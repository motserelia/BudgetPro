'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { readConfig, health } = require('../../server/voice/config');
const { createGoogleClient } = require('../../server/voice/google-client');
const { createHandler, buildRequest } = require('../../api/voice/transcribe');
const { wav } = require('../../www/voice/pcm');

const env = Object.freeze({
  GOOGLE_AUTH_MODE: 'wif', GOOGLE_CLOUD_PROJECT: 'budgetpro-push', GOOGLE_CLOUD_LOCATION: 'europe-west4',
  GOOGLE_WIF_PROVIDER: 'projects/632084975766/locations/global/workloadIdentityPools/budgetpro-vercel-stt/providers/vercel',
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'budgetpro-stt-preview@budgetpro-push.iam.gserviceaccount.com', VERCEL_ENV: 'preview',
});
const config = readConfig(env), now = Math.floor(Date.now() / 1000);
const claims = {
  iss: config.wif.trust.issuer, aud: config.wif.trust.audience,
  owner_id: config.wif.trust.ownerId, owner: config.wif.trust.owner,
  project_id: config.wif.trust.projectId, project: config.wif.trust.project,
  environment: 'preview', sub: 'owner:motserelia-s-projects:project:budget-pro-lski:environment:preview',
  iat: now, nbf: now, exp: now + 3600,
};
function jwt(changes = {}, signature = 'mock-signature', header = { alg: 'RS256' }) {
  const encode = x => Buffer.from(JSON.stringify(x)).toString('base64url');
  return `${encode(header)}.${encode({ ...claims, ...changes })}.${signature}`;
}
const assertion = jwt(), federated = 'mock-sts-secret', impersonated = 'mock-iam-secret';
const audio = Buffer.from(wav(new Float32Array(16000)));
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }
function mockGoogle({ fail, status = 403, malformed } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    const path = String(url); calls.push({ url: path, options });
    assert.ok(options.signal, 'both SDK exchanges retain the handler abort signal');
    if (path === 'https://sts.googleapis.com/v1/token') {
      const body = new URLSearchParams(options.body);
      assert.equal(body.get('grant_type'), 'urn:ietf:params:oauth:grant-type:token-exchange');
      assert.equal(body.get('subject_token_type'), 'urn:ietf:params:oauth:token-type:jwt');
      assert.equal(body.get('requested_token_type'), 'urn:ietf:params:oauth:token-type:access_token');
      assert.equal(body.get('audience'), config.wif.audience);
      assert.equal(new Headers(options.headers).has('Authorization'), false);
      if (fail === 'sts') return json({ error: 'invalid_grant', error_description: assertion + federated }, status);
      return json({ access_token: federated, token_type: 'Bearer', expires_in: 900 });
    }
    if (path.startsWith('https://iamcredentials.googleapis.com/')) {
      assert.equal(path, `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${env.GOOGLE_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`);
      assert.equal(new Headers(options.headers).get('Authorization'), `Bearer ${federated}`);
      const body = JSON.parse(options.body);
      assert.deepEqual(body.scope, ['https://www.googleapis.com/auth/cloud-platform']);
      assert.equal(body.lifetime, '900s');
      if (fail === 'impersonation') return json({ error: { status: 'PERMISSION_DENIED', message: federated + assertion } }, status);
      return json(malformed ? { accessToken: impersonated, expireTime: 'invalid' } : { accessToken: impersonated, expireTime: new Date(Date.now() + 900000).toISOString() });
    }
    assert.equal(path, 'https://europe-west4-speech.googleapis.com/v2/projects/budgetpro-push/locations/europe-west4/recognizers/_:recognize');
    assert.equal(new Headers(options.headers).get('Authorization'), `Bearer ${impersonated}`);
    const body = JSON.parse(options.body);
    assert.equal(body.config.model, 'chirp_2'); assert.deepEqual(body.config.languageCodes, ['ka-GE']);
    assert.equal(body.content, audio.toString('base64'));
    return json({ results: [{ languageCode: 'ka-GE', alternatives: [{ transcript: 'ყავა რვა ლარი' }] }] });
  };
  return { calls, fetchImpl };
}
function clientFor(mock, getOidcToken = async () => assertion, environment = env) {
  return createGoogleClient(environment, mock.fetchImpl, { getOidcToken });
}
function recognize(client, signal = AbortSignal.timeout(2000)) { return client.recognize(buildRequest(audio, 'ka', [], env), signal); }
function noSecrets(error) {
  const text = JSON.stringify(error) + String(error) + error.stack;
  for (const value of [assertion, federated, impersonated]) assert.equal(text.includes(value), false);
  assert.equal(error.cause, undefined); assert.equal(error.response, undefined); assert.equal(error.config, undefined);
  return true;
}
function withEnv(t) {
  const selected = { ...env, ASR_PROVIDER: 'google', ASR_ALLOW_PAID_PROVIDERS: 'true' }; // Google calls are mocked in this suite.
  const saved = Object.fromEntries(Object.keys(selected).map(k => [k, process.env[k]])); Object.assign(process.env, selected);
  t.after(() => { for (const [k, v] of Object.entries(saved)) if (v === undefined) delete process.env[k]; else process.env[k] = v; });
}

test('official Google SDK exchanges OIDC -> STS -> impersonation -> unchanged STT', async () => {
  const mock = mockGoogle(); const result = await recognize(clientFor(mock));
  assert.equal(result.results[0].languageCode, 'ka-GE'); assert.equal(mock.calls.length, 3);
  assert.equal(new URLSearchParams(mock.calls[0].options.body).get('subject_token'), assertion);
});
test('official Vercel helper reads request context on Node 24, not Supabase bearer', async t => {
  const symbol = Symbol.for('@vercel/request-context'), original = globalThis[symbol];
  globalThis[symbol] = { get: () => ({ headers: { 'x-vercel-oidc-token': assertion } }) };
  t.after(() => { if (original === undefined) delete globalThis[symbol]; else globalThis[symbol] = original; });
  const mock = mockGoogle(); await recognize(createGoogleClient(env, mock.fetchImpl)); assert.equal(mock.calls.length, 3);
});
for (const [name, changes] of [
  ['issuer', { iss: 'https://attacker.invalid' }], ['audience', { aud: 'https://vercel.com/other' }],
  ['audience array', { aud: [claims.aud, 'other'] }], ['owner ID', { owner_id: 'other-team' }],
  ['owner slug', { owner: 'other' }], ['project ID', { project_id: 'other-project' }],
  ['project name', { project: 'budget-pro' }], ['environment', { environment: 'production' }],
  ['development', { environment: 'development' }], ['subject', { sub: 'other' }],
  ['expired', { exp: now - 1 }], ['missing expiry', { exp: undefined }],
  ['future issued-at', { iat: now + 3600 }], ['future not-before', { nbf: now + 3600 }],
]) test(`OIDC rejects wrong ${name} before Google`, async () => {
  const mock = mockGoogle();
  await assert.rejects(recognize(clientFor(mock, async () => jwt(changes))), e => e.code === 'AUTH_ERROR' && noSecrets(e));
  assert.equal(mock.calls.length, 0);
});
test('OIDC rejects malformed JWT and alg=none before Google', async () => {
  for (const token of ['', 'bad', 'null.null.fake', jwt({}, 'fake', { alg: 'none' })]) {
    const mock = mockGoogle(); await assert.rejects(recognize(clientFor(mock, async () => token)), e => e.code === 'AUTH_ERROR'); assert.equal(mock.calls.length, 0);
  }
});
test('missing OIDC source fails closed without JSON fallback or Google request', async () => {
  const mock = mockGoogle();
  await assert.rejects(recognize(clientFor(mock, async () => { throw new Error('sensitive-local-path'); })), e => e.code === 'AUTH_ERROR' && e.reason === 'OIDC_UNAVAILABLE' && noSecrets(e));
  assert.equal(mock.calls.length, 0);
});
test('official Vercel helper fails safely when request context and token ENV are absent', async t => {
  const symbol = Symbol.for('@vercel/request-context'), original = globalThis[symbol], saved = process.env.VERCEL_OIDC_TOKEN;
  delete globalThis[symbol]; delete process.env.VERCEL_OIDC_TOKEN;
  t.after(() => {
    if (original !== undefined) globalThis[symbol] = original;
    if (saved === undefined) delete process.env.VERCEL_OIDC_TOKEN; else process.env.VERCEL_OIDC_TOKEN = saved;
  });
  const mock = mockGoogle();
  await assert.rejects(recognize(createGoogleClient(env, mock.fetchImpl)), e => e.reason === 'OIDC_UNAVAILABLE' && noSecrets(e));
  assert.equal(mock.calls.length, 0);
});
for (const stage of ['sts', 'impersonation']) test(`${stage} error is sanitized and not retried`, async () => {
  const mock = mockGoogle({ fail: stage, status: 500 });
  await assert.rejects(recognize(clientFor(mock)), e => e.stage === stage && e.code === 'AUTH_ERROR' && noSecrets(e));
  assert.equal(mock.calls.length, stage === 'sts' ? 1 : 2);
});
test('malformed IAM expiry is rejected without STT', async () => {
  const mock = mockGoogle({ malformed: true }); await assert.rejects(recognize(clientFor(mock)), e => e.code === 'AUTH_ERROR' && noSecrets(e)); assert.equal(mock.calls.length, 2);
});
test('cached Google credential is restricted to the exact STS-verified assertion', async () => {
  const mock = mockGoogle(); let token = assertion;
  const client = clientFor(mock, async () => token);
  await recognize(client); await recognize(client); assert.equal(mock.calls.length, 4);
  token = jwt({ owner_id: 'wrong' }); await assert.rejects(recognize(client), e => e.code === 'AUTH_ERROR'); assert.equal(mock.calls.length, 4);
  token = jwt({}, 'forged-signature');
  const original = mock.fetchImpl;
  // The client already holds the original mock function: modify its controlled
  // responses via a separate supplier to test signature rejection by real STS's
  // mocked boundary without ever locally trusting decoded claims.
  const calls = []; let current = assertion;
  const secured = createGoogleClient(env, async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('sts.') && new URLSearchParams(options.body).get('subject_token') !== assertion) return json({ error: 'invalid_grant' }, 400);
    return original(url, options);
  }, { getOidcToken: async () => current });
  await recognize(secured); current = token;
  await assert.rejects(recognize(secured), e => e.stage === 'sts');
  assert.equal(calls.filter(x => x.includes(':recognize')).length, 1);
});
test('cache expires and re-exchanges using the current request assertion', async () => {
  let clock = Date.now(); const mock = mockGoogle();
  const client = createGoogleClient(env, mock.fetchImpl, { getOidcToken: async () => assertion, now: () => clock });
  await recognize(client); clock += 850000; await recognize(client); assert.equal(mock.calls.length, 6);
});
test('abort reaches the official SDK STS request; no IAM or Speech after abort', async () => {
  const controller = new AbortController(); let calls = 0;
  const client = createGoogleClient(env, async (url, options) => {
    calls++; assert.equal(String(url), 'https://sts.googleapis.com/v1/token'); assert.equal(options.signal, controller.signal);
    return new Promise((resolve, reject) => { options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true }); controller.abort(); });
  }, { getOidcToken: async () => assertion });
  await assert.rejects(recognize(client, controller.signal)); assert.equal(calls, 1);
});
test('WIF configuration is explicit, same-project, dedicated-account, environment-bound', () => {
  for (const changes of [
    { GOOGLE_AUTH_MODE: 'other' }, { GOOGLE_AUTH_MODE: '' }, { GOOGLE_WIF_PROVIDER: '' },
    { GOOGLE_WIF_PROVIDER: env.GOOGLE_WIF_PROVIDER.replace('632084975766', '123456789012') },
    { GOOGLE_SERVICE_ACCOUNT_EMAIL: 'budgetpro-push@budgetpro-push.iam.gserviceaccount.com' },
    { GOOGLE_SERVICE_ACCOUNT_EMAIL: 'budgetpro-stt-production@budgetpro-push.iam.gserviceaccount.com' },
    { GOOGLE_CLOUD_PROJECT: 'other-project' }, { VERCEL_ENV: 'development' },
  ]) assert.throws(() => readConfig({ ...env, ...changes }), e => e.code === 'STT_NOT_CONFIGURED');
  assert.equal(config.authMode, 'wif'); assert.equal(config.account, undefined);
  assert.equal(readConfig({ ...env, GOOGLE_SERVICE_ACCOUNT_EMAIL: 'budgetpro-stt-production@budgetpro-push.iam.gserviceaccount.com', VERCEL_ENV: 'production' }).wif.environment, 'production');
  assert.equal(health(env).configured, true); const output = JSON.stringify(health(env));
  assert.equal(output.includes(env.GOOGLE_SERVICE_ACCOUNT_EMAIL), false); assert.equal(output.includes(env.GOOGLE_WIF_PROVIDER), false);
});
test('voice still requires Supabase auth before obtaining any Google credential', async t => {
  withEnv(t); const original = global.fetch; global.fetch = async () => { throw new Error('unexpected network'); }; t.after(() => { global.fetch = original; });
  let googleCalls = 0;
  const req = Readable.from([audio]); Object.assign(req, { method: 'POST', headers: { 'content-type': 'audio/wav', origin: 'https://budgetpro.app' }, url: '/api/voice/transcribe?language=ka&mode=quiet&sessionId=wif-auth-session-12345678' });
  const res = { setHeader() {}, end(body) { this.body = JSON.parse(body); } };
  await createHandler({ recognize: async () => { googleCalls++; } })(req, res);
  assert.equal(res.statusCode, 401); assert.equal(res.body.error, 'VOICE_AUTH_REQUIRED'); assert.equal(googleCalls, 0);
});
test('authorized voice with WIF returns transcript only; provider errors never leak tokens', async t => {
  withEnv(t);
  for (const fail of [undefined, 'sts', 'impersonation']) {
    const mock = mockGoogle({ fail }), client = clientFor(mock);
    const req = Readable.from([audio]); Object.assign(req, { method: 'POST', headers: { 'content-type': 'audio/wav', origin: 'https://budgetpro.app' }, url: `/api/voice/transcribe?language=ka&mode=quiet&sessionId=wif-end-to-end-session-${fail || 'success'}` });
    const res = { setHeader() {}, end(body) { this.body = JSON.parse(body); } };
    await createHandler({ authorize: async () => `wif-unit-${fail || 'success'}`, recognize: (payload, signal) => client.recognize(payload, signal) })(req, res);
    assert.equal(res.statusCode, fail ? 503 : 200);
    if (!fail) { assert.equal(res.body.transcript, 'ყავა რვა ლარი'); assert.equal(res.body.model, 'chirp_2'); }
    else assert.equal(res.body.error, 'AUTH_ERROR');
    for (const token of [assertion, federated, impersonated]) assert.equal(JSON.stringify(res.body).includes(token), false);
  }
});
test('Auth and JSONBin retain their handlers and preflight without Google dependencies', async t => {
  const original = global.fetch; global.fetch = async () => { throw new Error('network forbidden'); }; t.after(() => { global.fetch = original; });
  for (const route of ['auth/magic-link', 'auth/refresh-session', 'jsonbin/backup', 'jsonbin/messages']) {
    const handler = require('../../api/' + route);
    const res = { setHeader() {}, end(body) { this.body = body; } };
    await handler({ method: 'OPTIONS', headers: {} }, res); assert.equal(res.statusCode, 204, route);
  }
});
