'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), { Readable } = require('node:stream');
const { spawnSync } = require('node:child_process');
const { wav } = require('../../www/voice/pcm');
const { createGroqClient, ENDPOINT } = require('../../server/voice/groq-client');
const { readConfig, health } = require('../../server/voice/asr');
const { createRequestLimiter, RESERVE_SCRIPT, COOLDOWN_SCRIPT } = require('../../server/voice/request-limits');
const { createHandler } = require('../../api/voice/transcribe');
const apiConfig = require('../../www/api-config');
const KEY = 'unit-only-groq-secret', STORE_KEY = 'unit-only-store-secret';
const env = { ASR_PROVIDER: 'groq', GROQ_API_KEY: KEY, GROQ_FREE_TIER_CONFIRMED: 'true', ASR_REDIS_REST_URL: 'https://unit-redis.invalid', ASR_REDIS_REST_TOKEN: STORE_KEY };
const provider = readConfig(env), audio = Buffer.from(wav(new Float32Array(16000)));
const phrase = { ru: 'Кофе восемь лари', ka: 'ყავა რვა ლარი', en: 'Coffee eight lari', auto: 'ყავა რვა ლარი' };
const response = (status = 200, body = { text: phrase.ka }, retryAfter) => ({ status, ok: status >= 200 && status < 300, headers: { get: () => retryAfter || null }, json: async () => body });
let serial = 0;
function request(language = 'ka', id = 'groq-session-' + String(++serial).padStart(16, '0'), body = audio) {
  const req = Readable.from([body]); Object.assign(req, { method: 'POST', headers: { 'content-type': 'application/octet-stream', origin: 'https://budgetpro.app', authorization: 'Bearer unit-supabase-token' }, url: `/api/voice/transcribe?language=${language}&mode=quiet&sessionId=${id}` }); return req;
}
function result() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(body) { this.body = body ? JSON.parse(body) : null; } }; }
const limiter = { reserve: async () => {}, cooldown: async () => {} };
async function invoke({ language = 'ka', body, fetchImpl, deps = {}, req = request(language, undefined, body) } = {}) {
  const res = result();
  const handler = createHandler({ validateConfig: () => provider, authorize: async () => 'groq-test-user-' + serial, createLimiter: () => limiter, recognize: createGroqClient(KEY, fetchImpl || (async () => response(200, { text: phrase[language] }))).recognize, ...deps });
  await handler(req, res); return res;
}
for (const language of ['ru', 'ka', 'en', 'auto']) test(`Groq ${language}: multipart transcriptions + compatible Android response (mock audio only)`, async () => {
  let calls = 0;
  const res = await invoke({ language, fetchImpl: async (url, options) => {
    calls++; assert.equal(url, ENDPOINT); assert.equal(options.method, 'POST'); assert.equal(options.redirect, 'error');
    assert.deepEqual(options.headers, { Authorization: 'Bearer ' + KEY });
    const form = options.body; assert.equal(form.get('model'), 'whisper-large-v3'); assert.equal(form.get('response_format'), 'json'); assert.equal(form.get('temperature'), '0');
    assert.equal(form.get('language'), language === 'auto' ? null : language);
    assert.deepEqual([...form.keys()].sort(), ['file', 'model', 'response_format', 'temperature', ...(language === 'auto' ? [] : ['language'])].sort());
    assert.deepEqual(Buffer.from(await form.get('file').arrayBuffer()), audio);
    return response(200, { text: phrase[language] });
  } });
  assert.equal(calls, 1); assert.equal(res.statusCode, 200); assert.equal(res.body.provider, 'groq'); assert.equal(res.body.model, 'whisper-large-v3');
  assert.equal(res.body.region, null); assert.equal(res.body.detectedLanguage, null); assert.deepEqual(res.body.detectedLanguages, []); assert.equal(res.body.confidence, null); assert.equal(res.body.transcript, phrase[language]);
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://budgetpro.app');
});
for (const [status, code, expected] of [[429, 'ASR_QUOTA_EXCEEDED', 429], [401, 'ASR_PROVIDER_AUTH_FAILED', 503], [403, 'ASR_PROVIDER_AUTH_FAILED', 503], [500, 'ASR_UNAVAILABLE', 503], [400, 'ASR_REQUEST_REJECTED', 502]]) test(`provider HTTP ${status}: sanitized ${code}, one request, no fallback`, async () => {
  let calls = 0, cooldown;
  const res = await invoke({ fetchImpl: async () => { calls++; return response(status, { error: KEY + STORE_KEY + 'private provider message' }, '75'); }, deps: { createLimiter: () => ({ ...limiter, cooldown: async seconds => { cooldown = seconds; } }) } });
  assert.equal(calls, 1); assert.equal(res.body.error, code); assert.equal(res.statusCode, expected);
  if (status === 429) { assert.equal(cooldown, 75); assert.equal(res.headers['Retry-After'], '75'); }
  for (const secret of [KEY, STORE_KEY, 'private provider message', 'unit-supabase-token']) assert.equal(JSON.stringify(res).includes(secret), false);
});
test('empty text is NO_SPEECH, malformed provider JSON is a distinct error', async () => {
  assert.equal((await invoke({ fetchImpl: async () => response(200, { text: '   ' }) })).body.error, 'NO_SPEECH');
  assert.equal((await invoke({ fetchImpl: async () => response(200, { unexpected: 'body' }) })).body.error, 'ASR_INVALID_RESPONSE');
  assert.equal((await invoke({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new Error(KEY); } }) })).body.error, 'ASR_INVALID_RESPONSE');
});
test('network failure is sanitized; key missing never calls provider', async () => {
  assert.equal((await invoke({ fetchImpl: async () => { throw new TypeError(KEY); } })).body.error, 'ASR_UNAVAILABLE');
  assert.throws(() => createGroqClient(''), e => e.code === 'STT_NOT_CONFIGURED');
});
test('no selection, unverified Free tier, missing key/store, Cloudflare and paid Google fail closed', () => {
  for (const value of [{}, { ...env, ASR_PROVIDER: '' }, { ...env, ASR_PROVIDER: 'cloudflare' }, { ...env, ASR_PROVIDER: 'google' }, { ...env, GROQ_API_KEY: '' }, { ...env, GROQ_FREE_TIER_CONFIRMED: 'false' }]) assert.throws(() => readConfig(value), e => e.code === 'STT_NOT_CONFIGURED');
  for (const value of [{ ...env, ASR_REDIS_REST_TOKEN: '' }, { ...env, ASR_REDIS_REST_URL: 'http://unit.invalid' }]) assert.throws(() => readConfig(value), e => e.code === 'ASR_LIMITS_NOT_CONFIGURED');
  assert.equal(health(env).configured, true); assert.equal(health({}).configured, false);
  for (const value of [KEY, STORE_KEY, env.ASR_REDIS_REST_URL]) assert.equal(JSON.stringify(health(env)).includes(value), false);
});
test('invalid WAV and absent Supabase auth never reserve shared quota or call Groq', async () => {
  let reserves = 0, calls = 0;
  const deps = { createLimiter: () => ({ reserve: async () => { reserves++; } }) };
  assert.equal((await invoke({ body: Buffer.from('invalid'), fetchImpl: async () => { calls++; }, deps })).statusCode, 400);
  const req = request(); delete req.headers.authorization;
  const res = await invoke({ req, deps: { ...deps, authorize: require('../../api/voice/transcribe').authorize }, fetchImpl: async () => { calls++; } });
  assert.equal(res.statusCode, 401); assert.equal(res.body.error, 'VOICE_AUTH_REQUIRED'); assert.equal(reserves, 0); assert.equal(calls, 0);
});
test('OPTIONS does not read credentials, auth or make requests', async () => {
  const req = request(); req.method = 'OPTIONS';
  const res = await invoke({ req, deps: { validateConfig: () => { throw new Error('must not run'); } } }); assert.equal(res.statusCode, 204);
});
test('shared-store outage fails closed without Groq call', async () => {
  let calls = 0;
  const res = await invoke({ fetchImpl: async () => { calls++; }, deps: { createLimiter: () => createRequestLimiter(env, async () => { throw new Error(STORE_KEY); }) } });
  assert.equal(res.statusCode, 503); assert.equal(res.body.error, 'ASR_LIMITS_UNAVAILABLE'); assert.equal(calls, 0); assert.equal(JSON.stringify(res).includes(STORE_KEY), false);
});
test('deadline and request cancellation abort exactly one provider upload', async () => {
  for (const cancel of [false, true]) {
    let calls = 0, signal; const req = request();
    const pending = invoke({ req, deps: { timeoutMs: cancel ? 1000 : 12 }, fetchImpl: async (_, options) => { calls++; signal = options.signal; if (cancel) setImmediate(() => req.emit('aborted')); return new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true })); } });
    const res = await pending; assert.equal(calls, 1); assert.equal(signal.aborted, true); assert.equal(res.statusCode, 504); assert.equal(res.body.error, 'TIMEOUT');
  }
});
test('adapter honors an already cancelled request', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(createGroqClient(KEY, async (_, opts) => { opts.signal.throwIfAborted(); }).recognize({ audio, language: 'ka' }, controller.signal), e => e.name === 'AbortError');
});

// Shared REST mock executes the *actual* atomic Lua scripts, not a JS rewrite
// of their decisions. Only Redis primitives and time are mocked.
function runLua(t, commands) {
  const child = spawnSync('python3', ['tests/voice/helpers/redis-lua.py'], { input: JSON.stringify(commands), encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  if (child.status === 77) { t.skip('system liblua5.3 unavailable; no dependencies installed'); return null; }
  assert.equal(child.status, 0, child.stderr); return JSON.parse(child.stdout);
}
function reservation(user, id, seconds = 10) { return ['EVAL', RESERVE_SCRIPT, 4, 'budgetpro:{groq-free}:user:' + user, 'budgetpro:{groq-free}:global', 'budgetpro:{groq-free}:session:' + id, 'budgetpro:{groq-free}:cooldown', id, String(seconds)]; }
test('atomic Lua: shared duplicate, user minute cap, rolling expiry and cooldown', t => {
  const commands = [reservation('u', 'one'), reservation('u', 'one'), ...[2, 3, 4, 5, 6].map(i => reservation('u', 'id' + i)), ['ADVANCE', 60001], reservation('u', 'after-minute'), ['EVAL', COOLDOWN_SCRIPT, 1, 'budgetpro:{groq-free}:cooldown', '80'], reservation('v', 'cooldown'), ['ADVANCE', 80001], reservation('v', 'after-cooldown'), ['ADVANCE', 86400001], reservation('u', 'one')];
  const r = runLua(t, commands); if (!r) return;
  assert.deepEqual(r.map(v => Array.isArray(v) ? v[0] : v), ['OK', 'DUPLICATE_SESSION', 'OK', 'OK', 'OK', 'OK', 'RATE_LIMITED', 'OK', 1, 'ASR_QUOTA_EXCEEDED', 'OK', 'OK']);
});
test('atomic Lua: global RPM is shared by different users', t => {
  const r = runLua(t, Array.from({ length: 19 }, (_, i) => reservation('user' + i, 'id' + i))); if (!r) return;
  assert.equal(r.filter(v => v[0] === 'OK').length, 18); assert.equal(r[18][0], 'RATE_LIMITED');
});
test('atomic Lua: per-user daily cap survives minute boundary', t => {
  const commands = []; for (let i = 0; i < 61; i++) commands.push(['ADVANCE', 60001], reservation('same-user', 'daily' + i));
  const r = runLua(t, commands); if (!r) return; assert.equal(r[59][0], 'OK'); assert.equal(r[60][0], 'ASR_QUOTA_EXCEEDED');
});
test('atomic Lua: global audio-hour quota and window reset', t => {
  const commands = []; for (let i = 0; i < 201; i++) commands.push(['ADVANCE', 4000], reservation('u' + i, 'h' + i, 30));
  commands.push(['ADVANCE', 3600001], reservation('new', 'after-hour', 30));
  const r = runLua(t, commands); if (!r) return; assert.equal(r[199][0], 'OK'); assert.equal(r[200][0], 'ASR_QUOTA_EXCEEDED'); assert.equal(r[201][0], 'OK');
});
test('atomic Lua: global daily audio quota', t => {
  const commands = []; for (let i = 0; i < 801; i++) commands.push(['ADVANCE', 61000], reservation('u' + i, 'd' + i, 30));
  const r = runLua(t, commands); if (!r) return; assert.equal(r[799][0], 'OK'); assert.equal(r[800][0], 'ASR_QUOTA_EXCEEDED');
});
test('atomic Lua: global daily request quota', t => {
  const commands = []; for (let i = 0; i < 1801; i++) commands.push(['ADVANCE', 31000], reservation('u' + i, 'count' + i));
  const r = runLua(t, commands); if (!r) return; assert.equal(r[1799][0], 'OK'); assert.equal(r[1800][0], 'ASR_QUOTA_EXCEEDED');
});
test('REST limiter hashes private identifiers, charges min 10 seconds and consumes shared result', async () => {
  let args, calls = 0;
  const store = async (_, opts) => { calls++; assert.equal(opts.headers.Authorization, 'Bearer ' + STORE_KEY); args = JSON.parse(opts.body); return response(200, { result: ['OK', 0] }); };
  await createRequestLimiter(env, store).reserve('private-user-id', 'private-session-id', 250, new AbortController().signal);
  assert.equal(calls, 1); assert.equal(args[0], 'EVAL'); assert.equal(args[2], 4); assert.equal(args.at(-1), '10'); assert.equal(JSON.stringify(args).includes('private-user-id'), false); assert.equal(JSON.stringify(args).includes('private-session-id'), false);
  await assert.rejects(createRequestLimiter(env, async () => response(200, { result: ['DUPLICATE_SESSION', 0] })).reserve('u', 's', 1000), e => e.code === 'DUPLICATE_SESSION' && e.status === 409);
});
test('independent handlers honor a duplicate from shared store even after another instance', async () => {
  let calls = 0;
  // Local session keys are deliberately different: only shared Redis denies it.
  const shared = createRequestLimiter(env, async () => response(200, { result: ['DUPLICATE_SESSION', 0] }));
  for (let i = 0; i < 2; i++) {
    const res = await invoke({ fetchImpl: async () => { calls++; }, deps: { createLimiter: () => shared } }); assert.equal(res.statusCode, 409);
  }
  assert.equal(calls, 0);
});

for (const language of ['ru', 'ka', 'en', 'auto']) test(`packaged JS accepts Groq without changing WAV/Supabase/API contract: ${language}`, async () => {
  let seen; const ctx = { BudgetPROApiConfig: apiConfig, navigator: { onLine: true }, AbortController, DOMException, URL, setTimeout, clearTimeout, fetch: async (url, options) => { seen = { url, options }; return response(200, { ok: true, provider: 'groq', model: 'whisper-large-v3', sessionId: 'client-session', requestedLanguage: language, transcript: phrase[language] }); } };
  vm.runInNewContext(fs.readFileSync('www/voice/voice-api-client.js', 'utf8'), ctx);
  const data = await ctx.VoiceApiClient.transcribe({ wav: audio, language, mode: 'auto', sessionId: 'client-session', token: 'unit-supabase-only', signal: new AbortController().signal });
  assert.equal(data.transcript, phrase[language]); assert.equal(seen.options.body, audio); assert.equal(seen.options.headers.Authorization, 'Bearer unit-supabase-only'); assert.equal(seen.url.pathname, '/api/voice/transcribe'); assert.equal(seen.url.searchParams.get('language'), language);
});
test('financial parsing diagnostics are separate from ASR; draft still requires manual save', () => {
  const source = fs.readFileSync('www/index.js', 'utf8'); const start = source.indexOf('function parseVoiceInput('), end = source.indexOf('\nfunction getVoiceFallbackCategory', start);
  for (const scenario of ['valid', 'missing', 'throw']) {
    let opened = 0, diagnostics = { asrStatus: 'success' };
    const ctx = { displayCurrency:'GEL', window: { VoiceDraftSafety: {check:()=>({valid:true})}, BudgetPROVoiceModule: { getLanguage: () => 'ka' }, VoiceTranscriptValidator: { validateTranscript: () => ({ valid: true }) }, BudgetPROVoiceNumberNormalizer: { normalizeNumbers: text => text }, VoiceDiagnostics: { update: d => Object.assign(diagnostics, d) } }, buildVoiceDraftFromText: () => { if (scenario === 'throw') throw new Error('unit parse failure'); return { amount: scenario === 'valid' ? 8 : 0 }; }, openVoiceQuickModal: () => { opened++; } };
    vm.runInNewContext(source.slice(start, end), ctx);
    if (scenario === 'throw') assert.throws(() => ctx.parseVoiceInput(phrase.ka)); else ctx.parseVoiceInput(phrase.ka);
    assert.equal(diagnostics.asrStatus, 'success'); assert.equal(diagnostics.financialParseStatus, { valid: 'draft', missing: 'needs_input', throw: 'failed' }[scenario]); assert.equal(opened, scenario === 'throw' ? 0 : 1);
    assert.equal(/saveVoiceDraftTransaction|transactions\.push|saveAll/.test(source.slice(start, end)), false);
  }
});
test('new error messages exist in RU / EN / KA, no style changes required', () => {
  const ctx = {}; vm.runInNewContext(fs.readFileSync('www/voice/voice-ui.js', 'utf8'), ctx);
  for (const code of ['ASR_QUOTA_EXCEEDED', 'RATE_LIMITED', 'ASR_PROVIDER_AUTH_FAILED', 'ASR_UNAVAILABLE', 'ASR_LIMITS_NOT_CONFIGURED', 'ASR_LIMITS_UNAVAILABLE', 'DUPLICATE_SESSION']) {
    const messages = ['ru', 'en', 'ka'].map(lang => ctx.VoiceUI.errorText(code, lang, 'auto')); assert.equal(new Set(messages).size, 3); assert.ok(messages.every(x => !x.includes(KEY)));
  }
});

test('existing smoke tool accepts real-shape Groq and Google responses, rejects unknown engines (mocks)', async t => {
  const os = require('node:os'), path = require('node:path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'budgetpro-groq-fixture-')); t.after(() => fs.rmSync(dir, { recursive: true }));
  const file = path.join(dir, 'synthetic-validation-only.wav'); fs.writeFileSync(file, audio);
  const { smoke } = require('../../scripts/voice-cli-common');
  for (const [name, model, region] of [['groq', 'whisper-large-v3', null], ['google-stt-v2', 'chirp_2', 'europe-west4'], ['unknown', 'unknown', null]]) {
    const run = () => smoke({ file, lang: 'ka', local: true }, { handler: async (_, res) => { res.statusCode = 200; res.end(JSON.stringify({ ok: true, provider: name, model, region, requestedLocale: 'ka-GE', transcript: phrase.ka })); } });
    if (name === 'unknown') await assert.rejects(run, e => e.code === 'REQUEST_CONFIG_MISMATCH'); else assert.equal((await run()).provider, name);
  }
});
test('a failed Groq upload stays charged and cannot be automatically processed a second time', async () => {
  let calls = 0;
  const id = 'groq-failed-dedup-session-12345678';
  const deps = { authorize: async () => 'groq-failed-dedup-user' };
  const fetchImpl = async () => { calls++; return response(500); };
  assert.equal((await invoke({ req: request('ka', id), deps, fetchImpl })).body.error, 'ASR_UNAVAILABLE');
  assert.equal((await invoke({ req: request('ka', id), deps, fetchImpl })).body.error, 'DUPLICATE_SESSION'); assert.equal(calls, 1);
});
test('packaged client preserves cancel and quota errors with exactly one network request', async () => {
  for (const cancel of [false, true]) {
    let calls = 0; const controller = new AbortController();
    const ctx = { BudgetPROApiConfig: apiConfig, navigator: { onLine: true }, AbortController, DOMException, URL, setTimeout, clearTimeout, fetch: async (_, options) => {
      calls++;
      if (!cancel) return response(429, { ok: false, error: 'ASR_QUOTA_EXCEEDED' });
      controller.abort(); options.signal.throwIfAborted();
    } };
    vm.runInNewContext(fs.readFileSync('www/voice/voice-api-client.js', 'utf8'), ctx);
    await assert.rejects(ctx.VoiceApiClient.transcribe({ wav: audio, language: 'ka', mode: 'auto', sessionId: 'client-session', token: 'unit-only', signal: controller.signal }), e => cancel ? e.name === 'AbortError' : e.code === 'ASR_QUOTA_EXCEEDED');
    assert.equal(calls, 1);
  }
});
test('shared REST errors, unknown script results and bad store config never fail open', async () => {
  for (const fetchImpl of [async () => response(500), async () => response(200, { error: STORE_KEY }), async () => response(200, { result: ['unexpected', 0] }), async () => response(200, { wrong: true })]) {
    await assert.rejects(createRequestLimiter(env, fetchImpl).reserve('u', 's', 1000), e => e.code === 'ASR_LIMITS_UNAVAILABLE' && !String(e).includes(STORE_KEY));
  }
  for (const url of ['http://unit.invalid', 'https://user:password@unit.invalid', 'https://unit.invalid/?secret=1', 'https://unit.invalid/path']) assert.throws(() => createRequestLimiter({ ...env, ASR_REDIS_REST_URL: url }), e => e.code === 'ASR_LIMITS_NOT_CONFIGURED');
});
test('atomic cooldown from another instance never shortens an existing lock', t => {
  const key = 'budgetpro:{groq-free}:cooldown';
  const r = runLua(t, [['EVAL', COOLDOWN_SCRIPT, 1, key, '3600'], ['EVAL', COOLDOWN_SCRIPT, 1, key, '60'], ['ADVANCE', 61000], reservation('u', 'still-blocked')]);
  if (!r) return; assert.equal(r[2][0], 'ASR_QUOTA_EXCEEDED'); assert.ok(r[2][1] > 3500);
});

test('client treats provider metadata as server-owned; future adapters need no financial UI rewrite', async () => {
  for (const provider of ['cloudflare', null, '']) {
    const ctx = { BudgetPROApiConfig: apiConfig, navigator: { onLine: true }, AbortController, DOMException, URL, setTimeout, clearTimeout, fetch: async () => response(200, { ok: true, provider, model: '@cf/openai/whisper', sessionId: 'future-client-session', requestedLanguage: 'ka', transcript: phrase.ka }) };
    vm.runInNewContext(fs.readFileSync('www/voice/voice-api-client.js', 'utf8'), ctx);
    const run = () => ctx.VoiceApiClient.transcribe({ wav: audio, language: 'ka', mode: 'auto', sessionId: 'future-client-session', token: 'unit-only', signal: new AbortController().signal });
    if (provider) assert.equal((await run()).provider, provider); else await assert.rejects(run, e => e.code === 'STT_ERROR');
  }
  // This test supplies a mock response only. Actual Cloudflare dispatch stays off.
  assert.throws(() => readConfig({ ...env, ASR_PROVIDER: 'cloudflare' }), e => e.code === 'STT_NOT_CONFIGURED');
});
