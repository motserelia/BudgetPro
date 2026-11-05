'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), http = require('node:http'), fs = require('node:fs'), vm = require('node:vm');
const { createRelay, oidcProvider, parseIdentity, parseArgs, PREVIEW, PROJECT, TEAM, MAX_BYTES } = require('../../scripts/voice-debug/relay');
const { wav } = require('../../www/voice/pcm');
const api = require('../../www/api-config');
const audio = Buffer.from(wav(new Float32Array(16000))), origin = 'https://budgetpro.app';
const route = '/api/voice/transcribe?language=ru&mode=auto&sessionId=relay-test-session-12345678';
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
async function start(t, deps = {}) {
  const relay = createRelay({ getOidcToken: async () => 'unit-private-oidc', fetchImpl: async () => json({ ok: true }), ...deps });
  await new Promise(resolve => relay.server.listen(0, '127.0.0.1', resolve)); t.after(() => relay.close()); return relay;
}
function send(relay, { path = route, method = 'POST', headers = {}, body = Buffer.alloc(0) } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: relay.server.address().port, path, method, headers: { Origin: origin, 'Content-Type': 'application/octet-stream', ...headers } }, res => {
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => { const raw = Buffer.concat(chunks).toString(); let data; try { data = JSON.parse(raw); } catch { data = raw; } resolve({ status: res.statusCode, headers: res.headers, data }); });
    }); req.on('error', reject); req.end(body);
  });
}
test('relay binds loopback; preserves WAV, methods, Supabase Bearer and fixed HTTPS destination only', async t => {
  let calls = 0, logged = [];
  const relay = await start(t, { allowOneRuAudio: true, log: d => logged.push(d), fetchImpl: async (url, opts) => {
    calls++; assert.equal(url.origin, PREVIEW); assert.equal(url.pathname, '/api/voice/transcribe'); assert.equal(opts.method, 'POST'); assert.deepEqual(opts.body, audio); assert.equal(opts.redirect, 'error');
    assert.equal(opts.headers.authorization, 'Bearer unit-supabase-secret'); assert.equal(opts.headers['x-vercel-trusted-oidc-idp-token'], 'unit-private-oidc'); assert.equal(opts.headers.cookie, undefined);
    return json({ ok: true, transcript: 'unit-private-text' }, 200, { 'Set-Cookie': 'unit-cookie', 'x-vercel-trusted-oidc-idp-token': 'unit-private-oidc' });
  } });
  assert.equal(relay.server.address().address, '127.0.0.1');
  const r = await send(relay, { body: audio, headers: { Authorization: 'Bearer unit-supabase-secret', Cookie: 'unit-cookie', 'x-vercel-trusted-oidc-idp-token': 'unit-attacker' } });
  assert.equal(r.status, 200); assert.equal(calls, 1); assert.equal(r.headers['set-cookie'], undefined); assert.equal(r.headers['x-vercel-trusted-oidc-idp-token'], undefined);
  for (const secret of ['unit-private-oidc', 'unit-supabase-secret', 'unit-private-text', 'unit-cookie']) assert.equal(JSON.stringify(logged).includes(secret), false);
});
test('default relay never forwards synthetic valid WAV to STT', async t => {
  let calls = 0; const relay = await start(t, { fetchImpl: async () => { calls++; return json({ ok: true }); } });
  const r = await send(relay, { body: audio }); assert.equal(r.status, 423); assert.equal(r.data.error, 'DEBUG_AUDIO_NOT_ARMED'); assert.equal(calls, 0);
});
test('empty auth probe reaches original endpoint unchanged; no microphone/audio needed', async t => {
  let calls = 0; const relay = await start(t, { fetchImpl: async (_, opts) => { calls++; assert.equal(opts.body.length, 0); assert.equal(opts.headers.authorization, 'Bearer unit-only'); return json({ ok: false, error: 'INVALID_AUDIO' }, 400); } });
  const r = await send(relay, { headers: { Authorization: 'Bearer unit-only' } }); assert.equal(r.status, 400); assert.equal(r.data.error, 'INVALID_AUDIO'); assert.equal(calls, 1); assert.equal(relay.getState().audioAttempts, 0);
});
test('health/preflight and Android Private Network Access headers work without leaking identity', async t => {
  const relay = await start(t, { fetchImpl: async (_, opts) => opts.method === 'OPTIONS' ? new Response(null, { status: 204 }) : json({ ok: true, provider: 'groq' }) });
  assert.equal((await send(relay, { path: '/api/voice/health', method: 'GET' })).status, 200);
  const r = await send(relay, { method: 'OPTIONS', headers: { 'Access-Control-Request-Private-Network': 'true' } });
  assert.equal(r.status, 204); assert.equal(r.headers['access-control-allow-origin'], origin); assert.equal(r.headers['access-control-allow-private-network'], 'true');
  assert.equal(r.headers['x-vercel-trusted-oidc-idp-token'], undefined);
});
test('CORS, Host/DNS rebinding, URL traversal, arbitrary origins and unrelated APIs fail closed', async t => {
  let calls = 0; const relay = await start(t, { fetchImpl: async () => { calls++; return json({}); } });
  for (const path of ['/api/auth/magic-link', '/api/jsonbin/backup', '/api/voice/../voice/health', '/api/voice/%68ealth', '//attacker.invalid/api/voice/health', 'https://attacker.invalid/api/voice/health', '/api/voice/health/extra', '/api/voice/health\\evil']) assert.ok((await send(relay, { path, method: 'GET' })).status >= 400, path);
  assert.equal((await send(relay, { headers: { Origin: 'https://attacker.invalid' } })).status, 403);
  assert.equal((await send(relay, { headers: { Host: 'attacker.invalid' } })).status, 403); assert.equal(calls, 0);
});
test('invalid WAV, oversized audio and non-Russian armed input are never forwarded', async t => {
  let calls = 0; const relay = await start(t, { allowOneRuAudio: true, fetchImpl: async () => { calls++; return json({}); } });
  assert.equal((await send(relay, { body: Buffer.from('not-wav') })).status, 400);
  assert.equal((await send(relay, { body: Buffer.alloc(MAX_BYTES + 1) })).status, 413);
  assert.equal((await send(relay, { path: route.replace('language=ru', 'language=ka'), body: audio })).data.error, 'DEBUG_RU_ONLY'); assert.equal(calls, 0);
});
test('one-shot budget is atomic and stays consumed after provider 429; no retries', async t => {
  let calls = 0; const relay = await start(t, { allowOneRuAudio: true, fetchImpl: async () => { calls++; return json({ ok: false, error: 'ASR_QUOTA_EXCEEDED' }, 429, { 'Retry-After': '75' }); } });
  const results = await Promise.all([send(relay, { body: audio }), send(relay, { body: audio })]);
  assert.deepEqual(results.map(x => x.status).sort(), [423, 429]); assert.equal(calls, 1); assert.equal(results.find(x => x.status === 429).headers['retry-after'], '75'); assert.equal(relay.getState().audioAttempts, 1);
});
test('language selection is explicit, rejects invalid/conflicting CLI flags and retains legacy RU flag', () => {
  assert.deepEqual(parseArgs([]), { port: 8139, audioLanguage: null });
  assert.equal(parseArgs(['--allow-one-ru-audio']).audioLanguage, 'ru');
  for (const lang of ['ru', 'ka', 'en']) assert.equal(parseArgs(['--allow-one-audio', lang]).audioLanguage, lang);
  for (const args of [['--allow-one-audio'], ['--allow-one-audio', 'auto'], ['--allow-one-audio', 'xx'], ['--allow-one-ru-audio', '--allow-one-audio', 'ka'], ['--allow-one-audio', 'ka', '--allow-one-audio', 'en']]) assert.throws(() => parseArgs(args), e => e.code === 'INVALID_ARGUMENT');
  assert.throws(() => createRelay({ audioLanguage: 'auto' }), e => e.code === 'INVALID_ARGUMENT');
  assert.throws(() => createRelay({ audioLanguage: 'ka', allowOneRuAudio: true }), e => e.code === 'INVALID_ARGUMENT');
});
for (const language of ['ru', 'ka', 'en']) {
  test(`one-shot ${language} preserves exact language/WAV, rejects other or duplicate languages, and never retries`, async t => {
    let calls = 0;
    const relay = await start(t, { audioLanguage: language, fetchImpl: async (url, opts) => {
      calls++; assert.equal(url.searchParams.get('language'), language); assert.deepEqual(opts.body, audio);
      return json({ ok: false, error: 'ASR_QUOTA_EXCEEDED' }, 429);
    } });
    for (const other of ['ru', 'ka', 'en', 'auto'].filter(v => v !== language)) {
      const r = await send(relay, { path: route.replace('language=ru', 'language=' + other), body: audio });
      assert.equal(r.status, 400); assert.equal(r.data.error, 'DEBUG_LANGUAGE_MISMATCH');
    }
    const path = route.replace('language=ru', 'language=' + language);
    assert.equal((await send(relay, { path: path + '&language=' + language, body: audio })).status, 400);
    assert.equal((await send(relay, { path: '/api/voice/transcribe', body: audio })).status, 400);
    assert.equal(calls, 0); assert.equal(relay.getState().audioAttempts, 0);
    const results = await Promise.all([send(relay, { path, body: audio }), send(relay, { path, body: audio })]);
    assert.deepEqual(results.map(r => r.status).sort(), [423, 429]);
    assert.equal((await send(relay, { path, body: audio })).status, 423);
    assert.equal(calls, 1); assert.equal(relay.getState().audioAttempts, 1);
  });
}
test('redirect, non-JSON login and network errors are sanitized without retries', async t => {
  for (const fetchImpl of [async () => new Response(null, { status: 302 }), async () => new Response('private html', { headers: { 'Content-Type': 'text/html' } }), async () => { throw new Error('unit-private-oidc'); }]) {
    let calls = 0; const relay = await start(t, { fetchImpl: (...args) => { calls++; return fetchImpl(...args); } });
    const r = await send(relay); assert.equal(r.status, 502); assert.equal(calls, 1); assert.equal(JSON.stringify(r.data).includes('unit-private-oidc'), false);
  }
});
test('deadline aborts upstream; safe shutdown closes listener', async t => {
  let aborted = false;
  const relay = await start(t, { timeoutMs: 15, fetchImpl: async (_, opts) => new Promise((_, reject) => opts.signal.addEventListener('abort', () => { aborted = true; reject(new Error()); }, { once: true })) });
  assert.equal((await send(relay)).status, 504); assert.equal(aborted, true);
  await relay.close(); assert.equal(relay.server.listening, false);
});
const claims = { project_id: PROJECT, owner_id: TEAM, aud: 'https://vercel.com/motserelia-s-projects', iss: 'https://oidc.vercel.com/motserelia-s-projects', environment: 'development', exp: Math.floor(Date.now() / 1000) + 3600 };
const assertion = value => 'eyJhbGciOiJSUzI1NiJ9.' + Buffer.from(JSON.stringify(value)).toString('base64url') + '.unit-signature';
test('OIDC uses official CLI, exact project/team identity, single-flight refresh, no token output', async () => {
  let calls = 0; const provider = oidcProvider(async args => { calls++; assert.deepEqual(args, ['project','token','budget-pro-lski','--scope',TEAM,'--format=json']); return JSON.stringify({ token: assertion(claims) }); });
  const values = await Promise.all([provider(), provider()]); assert.equal(values[0], values[1]); assert.equal(calls, 1); await provider(); assert.equal(calls, 1);
  for (const patch of [{ project_id: 'other' }, { owner_id: 'other' }, { iss: 'https://attacker.invalid' }, { aud: 'other' }, { environment: 'production' }, { exp: 1 }]) assert.equal(parseIdentity(assertion({ ...claims, ...patch })), null);
  await assert.rejects(oidcProvider(async () => { throw new Error('private-token'); })(), e => e.code === 'RELAY_VERCEL_LOGIN_REQUIRED' && !String(e).includes('private-token'));
});
function debugContext({ native = true, authenticated = true, status = 400, code = 'INVALID_AUDIO' } = {}) {
  let saves = 0, requests = 0; const ctx = { Capacitor: { isNativePlatform: () => native }, BudgetPROApiConfig: api, getAuthSession: () => authenticated ? { access_token: 'unit-session-secret' } : null, isAuthSessionExpired: () => false, saveVoiceDraftTransaction: () => { saves++; }, crypto: require('node:crypto'), AbortController, VoiceApiClient: { transcribe: async options => { requests++; assert.equal(options.wav.byteLength, 0); assert.equal(options.token, 'unit-session-secret'); throw Object.assign(new Error(), { code, diagnostics: { httpStatus: status } }); } } };
  vm.runInNewContext(fs.readFileSync('scripts/voice-debug/android-bootstrap.js','utf8'),ctx); return { ctx, counts: () => ({ saves, requests }) };
}
test('debug override affects exactly two voice routes; Auth, refresh, backup and JSONBin stay production', () => {
  const { ctx } = debugContext();
  for (const path of ['voice/health','voice/transcribe']) assert.equal(ctx.BudgetPROApiConfig.getApiUrl(path),'http://localhost:8139/api/'+path);
  for (const path of ['auth/magic-link','auth/refresh-session','jsonbin/backup','jsonbin/messages','voice/other']) assert.equal(ctx.BudgetPROApiConfig.getApiUrl(path),api.productionOrigin+'/api/'+path);
  const web = debugContext({ native: false }).ctx; assert.equal(web.BudgetPROApiConfig,api); assert.equal(web.BudgetPROVoiceDebug,undefined);
});
test('session probe returns only safe status; debug voice save is blocked', async () => {
  const { ctx, counts } = debugContext(); const r = await ctx.BudgetPROVoiceDebug.checkSession(); assert.equal(r.ok,true); assert.equal(r.httpStatus,400); assert.equal(JSON.stringify(r).includes('unit-session-secret'),false);
  assert.equal(ctx.saveVoiceDraftTransaction({ amount: 8 }),false); assert.equal(counts().saves,0);
  const signedOut=debugContext({authenticated:false});assert.equal((await signedOut.ctx.BudgetPROVoiceDebug.checkSession()).error,'VOICE_AUTH_REQUIRED');assert.equal(signedOut.counts().requests,0);
  assert.equal((await debugContext({status:401,code:'VOICE_AUTH_REQUIRED'}).ctx.BudgetPROVoiceDebug.checkSession()).ok,false);
});

test('phone disconnect cancels the in-flight relay fetch without a retry', async t => {
  let calls = 0, resolveStarted, resolveAbort;
  const started = new Promise(r => resolveStarted = r), aborted = new Promise(r => resolveAbort = r);
  const relay = await start(t, { fetchImpl: async (_, opts) => { calls++; resolveStarted(); return new Promise((_, reject) => opts.signal.addEventListener('abort', () => { resolveAbort(); reject(new Error()); }, { once: true })); } });
  const req = http.request({ hostname:'127.0.0.1',port:relay.server.address().port,path:route,method:'POST',headers:{ Origin:origin,'Content-Type':'application/octet-stream' } });req.on('error',()=>{});req.end();
  await started;req.destroy();await aborted;assert.equal(calls,1);
});
test('debug capture blocks full-editor voice Save as well as quick-save; auth errors return no secret', async () => {
  let listener, capture, prevented = 0;
  const ctx = { Capacitor:{isNativePlatform:()=>true},BudgetPROApiConfig:api,document:{addEventListener:(type,fn,c)=>{assert.equal(type,'click');listener=fn;capture=c;}},getAuthSession:()=>{throw new Error('unit-user-secret');} };
  vm.runInNewContext(fs.readFileSync('scripts/voice-debug/android-bootstrap.js','utf8'),ctx);
  assert.equal(capture,true);listener({target:{closest:selector=>{assert.ok(selector.includes('#voiceSaveDraft'));return {}; }},preventDefault:()=>prevented++,stopImmediatePropagation:()=>prevented++});assert.equal(prevented,2);
  const safe=await ctx.BudgetPROVoiceDebug.checkSession();assert.equal(safe.error,'AUTH_CHECK_FAILED');assert.equal(JSON.stringify(safe).includes('unit-user-secret'),false);
});
