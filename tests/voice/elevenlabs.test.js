'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { wav } = require('../../www/voice/pcm');
const { keytermWords } = require('../../www/voice/number-normalizer');
const { createElevenLabsClient, ENDPOINT } = require('../../server/voice/elevenlabs-client');
const { readConfig, readElevenLabsConfig, providerForLanguage, health } = require('../../server/voice/asr');
const { createKaRequestLimiter, readKaBudget, KA_RESERVE_SCRIPT, KA_PREFIX } = require('../../server/voice/request-limits');
const { createHandler } = require('../../api/voice/transcribe');
const KEY = 'unit-only-elevenlabs-secret', STORE = 'unit-only-store-secret', GROQ = 'unit-only-groq-secret';
const env = { ASR_PROVIDER: 'groq', GROQ_API_KEY: GROQ, GROQ_FREE_TIER_CONFIRMED: 'true', ASR_REDIS_REST_URL: 'https://unit-redis.invalid', ASR_REDIS_REST_TOKEN: STORE, ASR_PROVIDER_KA: 'elevenlabs', ELEVENLABS_API_KEY: KEY, ELEVENLABS_KA_BUDGET_CONFIRMED: 'true' };
const audio = Buffer.from(wav(new Float32Array(16000)));
const phrase = { ka: 'ყავა რვა ლარი', ru: 'Кофе восемь лари' };
const response = (status = 200, body = { text: phrase.ka, language_code: 'kat' }, retryAfter) => ({ status, ok: status >= 200 && status < 300, headers: { get: () => retryAfter || null }, json: async () => body });
test('ka: Scribe multipart keeps the contract (scribe_v3 default, no keyterms, no audio events)', async () => {
  let calls = 0;
  const client = createElevenLabsClient(KEY, async (url, options) => {
    calls++;
    assert.equal(url, ENDPOINT);
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error');
    assert.deepEqual(options.headers, { 'xi-api-key': KEY });
    const form = options.body;
    assert.equal(form.get('model_id'), 'scribe_v3');
    assert.equal(form.get('language_code'), 'ka');
    assert.equal(form.get('tag_audio_events'), 'false');
    assert.equal(form.get('no_verbatim'), 'true');
    assert.equal(form.get('keyterms'), null);
    assert.deepEqual([...form.keys()].sort(), ['file', 'language_code', 'model_id', 'no_verbatim', 'tag_audio_events']);
    assert.deepEqual(Buffer.from(await form.get('file').arrayBuffer()), audio);
    return response(200, { text: phrase.ka, language_code: 'kat' });
  });
  const result = await client.recognize({ audio, language: 'ka' }, AbortSignal.timeout(1000));
  assert.equal(calls, 1);
  assert.equal(result.results[0].alternatives[0].transcript, phrase.ka);
  assert.equal(result.results[0].languageCode, 'kat');
});
test('ka: only Georgian is accepted here and the model is env-selectable with validation', async () => {
  const client = createElevenLabsClient(KEY, async () => { throw new Error('must not be called'); });
  await assert.rejects(client.recognize({ audio, language: 'ru' }), e => e.code === 'UNSUPPORTED_LANGUAGE' && e.status === 400);
  assert.equal(readElevenLabsConfig({ ...env, ELEVENLABS_MODEL_ID: 'scribe_v2' }).model, 'scribe_v2');
  assert.equal(readElevenLabsConfig(env).model, 'scribe_v3');
  assert.equal(readElevenLabsConfig({ ...env, ELEVENLABS_MODEL_ID: ' scribe_v3 ' }).model, 'scribe_v3');
  for (const modelId of ['scribe_medical', 'SCRIBE_V3', 'scribe_v3_realtime']) assert.throws(() => readElevenLabsConfig({ ...env, ELEVENLABS_MODEL_ID: modelId }), e => e.code === 'STT_NOT_CONFIGURED');
  assert.equal(readElevenLabsConfig({ ...env, ELEVENLABS_MODEL_ID: '' }).model, 'scribe_v3');
});
test('ka path fails closed: no key, no budget, no shared store or bad budget never fall back to Groq', () => {
  const missingKey = { ...env, ELEVENLABS_API_KEY: '' };
  assert.throws(() => providerForLanguage('ka', missingKey), e => e.code === 'STT_NOT_CONFIGURED' && e.reason === 'ELEVENLABS_KEY_MISSING');
  assert.throws(() => providerForLanguage('ka', { ...env, ELEVENLABS_KA_BUDGET_CONFIRMED: 'false' }), e => e.code === 'ELEVENLABS_BUDGET_NOT_CONFIGURED');
  assert.throws(() => providerForLanguage('ka', { ...env, ELEVENLABS_KA_BUDGET_CONFIRMED: undefined }), e => e.code === 'ELEVENLABS_BUDGET_NOT_CONFIGURED');
  for (const patch of [{ ELEVENLABS_KA_MONTHLY_SECONDS: 'abc' }, { ELEVENLABS_KA_MONTHLY_SECONDS: '0' }, { ELEVENLABS_KA_DAILY_REQUESTS: '0' }, { ELEVENLABS_KA_DAILY_REQUESTS: '10001' }, { ELEVENLABS_KA_MONTHLY_SECONDS: '12.5' }]) assert.throws(() => providerForLanguage('ka', { ...env, ...patch }), e => e.code === 'ELEVENLABS_BUDGET_INVALID');
  assert.throws(() => providerForLanguage('ka', { ...env, ASR_REDIS_REST_TOKEN: '' }), e => e.code === 'ASR_LIMITS_NOT_CONFIGURED');
  assert.throws(() => providerForLanguage('ka', { ...env, ASR_PROVIDER_KA: 'cloudflare' }), e => e.code === 'STT_NOT_CONFIGURED');
  // The paid provider gates ka only: the default selection still resolves for ru/en.
  assert.equal(readConfig(env).provider, 'groq');
  assert.equal(providerForLanguage('ru', missingKey).provider, 'groq');
  assert.equal(providerForLanguage('en', missingKey).provider, 'groq');
  assert.equal(providerForLanguage('auto', { ...env, ASR_PROVIDER_KA: 'cloudflare' }).provider, 'groq');
});
test('ka budget defaults are 3 hours per month and 100 requests per day and are validated', () => {
  assert.deepEqual(readKaBudget({ ELEVENLABS_KA_BUDGET_CONFIRMED: 'true' }), { monthlySeconds: 10800, dailyRequests: 100 });
  assert.deepEqual(readKaBudget({ ELEVENLABS_KA_BUDGET_CONFIRMED: 'true', ELEVENLABS_KA_MONTHLY_SECONDS: '3600', ELEVENLABS_KA_DAILY_REQUESTS: '30' }), { monthlySeconds: 3600, dailyRequests: 30 });
  assert.equal(KA_PREFIX, 'budgetpro:{elevenlabs-ka}:');
  assert.equal(KA_PREFIX.includes('groq'), false);
});
test('ka reservation uses its own Redis prefix, passes the budget and charges audio seconds', async () => {
  const calls = [];
  const limiter = createKaRequestLimiter(env, async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ result: ['OK', 0] }) }; });
  assert.deepEqual(limiter.budget, { monthlySeconds: 10800, dailyRequests: 100 });
  await limiter.reserve('unit-user', 'ka-session-12345678', 1500);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://unit-redis.invalid');
  assert.deepEqual(calls[0].options.headers, { Authorization: 'Bearer ' + STORE, 'Content-Type': 'application/json' });
  const args = JSON.parse(calls[0].options.body);
  assert.equal(args[0], 'EVAL'); assert.equal(args[1], KA_RESERVE_SCRIPT); assert.equal(args[2], 4);
  for (const key of args.slice(3, 7)) assert.ok(key.startsWith(KA_PREFIX), key);
  assert.equal(args[7], args[5].split(':').at(-1));
  // 1.5 s audio is charged with the 10 s floor, plus the daily and monthly caps.
  assert.equal(args[8], '10'); assert.equal(args[9], '100'); assert.equal(args[10], '10800');
  for (const secret of ['unit-user', 'ka-session-12345678']) assert.equal(JSON.stringify(args).includes(secret), false);
  await limiter.cooldown(90);
  const cooldown = JSON.parse(calls[1].options.body);
  assert.equal(cooldown[3], KA_PREFIX + 'cooldown'); assert.equal(cooldown[4], '90');
});
test('ka quota, duplicate session and store failure are sanitized, never retried', async () => {
  const withResult = result => createKaRequestLimiter(env, async () => ({ ok: true, json: async () => ({ result }) }));
  await assert.rejects(withResult(['ASR_QUOTA_EXCEEDED', 3600]).reserve('u', 's-1234567890123456', 1000), e => e.code === 'ASR_QUOTA_EXCEEDED' && e.status === 429 && e.retryAfter === 3600);
  await assert.rejects(withResult(['DUPLICATE_SESSION', 0]).reserve('u', 's-1234567890123456', 1000), e => e.code === 'DUPLICATE_SESSION' && e.status === 409);
  await assert.rejects(withResult(['ASR_LIMITS_UNAVAILABLE', 0]).reserve('u', 's-1234567890123456', 1000), e => e.code === 'ASR_LIMITS_UNAVAILABLE' && e.status === 503);
  await assert.rejects(withResult(['SOMETHING_ELSE', 0]).reserve('u', 's-1234567890123456', 1000), e => e.code === 'ASR_LIMITS_UNAVAILABLE');
  await assert.rejects(createKaRequestLimiter(env, async () => ({ ok: false, status: 500 })).reserve('u', 's-1234567890123456', 1000), e => e.code === 'ASR_LIMITS_UNAVAILABLE');
  await assert.rejects(withResult(['OK', 0]).reserve('u', 's-1234567890123456', 50), e => e.code === 'INVALID_AUDIO' && e.status === 400);
});
test('keyterms are disabled by default and, when enabled, come from the number normalizer', () => {
  assert.deepEqual(readElevenLabsConfig(env).keyterms, []);
  const words = keytermWords('ka'), enabled = readElevenLabsConfig({ ...env, ELEVENLABS_KEYTERMS: 'on' }).keyterms;
  assert.deepEqual(enabled, words);
  assert.ok(enabled.length > 50 && enabled.length <= 1000);
  for (const term of enabled) { assert.ok(term.length <= 50, term); assert.ok(term.split(/\s+/).length <= 5, term); }
  for (const expected of ['ათი', 'ოცდაათი', 'ოთხმოცდაათი', 'ასი', 'ორასი', 'ათასი', 'მილიონი']) assert.ok(enabled.includes(expected), expected);
  for (const stem of ['ოცდა', 'ორმოცდა', 'სამოცდა', 'ოთხმოცდა']) assert.equal(enabled.includes(stem), false, stem);
  // Currency words are absent from that number table: no second hand-written list is invented here.
  for (const currency of ['ლარი', 'თეთრი']) assert.equal(enabled.includes(currency), false);
  assert.throws(() => createElevenLabsClient(KEY, async () => response(), { keyterms: ['a'.repeat(51)] }), e => e.code === 'STT_NOT_CONFIGURED');
  assert.throws(() => createElevenLabsClient(KEY, async () => response(), { keyterms: ['ერთი ორი სამი ოთხი ხუთი ექვსი'] }), e => e.code === 'STT_NOT_CONFIGURED');
});
test('health reports ka selection and model without secrets or budget values', () => {
  const body = health(env);
  assert.equal(body.configured, true); assert.equal(body.provider, 'groq');
  assert.deepEqual(body.ka, { selected: true, configured: true, provider: 'elevenlabs-scribe', model: 'scribe_v3', keyterms: 0 });
  assert.deepEqual(health({ ...env, ASR_PROVIDER_KA: undefined }).ka, { selected: false, configured: false, provider: null, model: null, keyterms: 0 });
  assert.equal(health({ ...env, ELEVENLABS_API_KEY: '' }).ka.configured, false);
  const output = JSON.stringify(health(env));
  for (const secret of [KEY, STORE, GROQ, '10800', '100']) assert.equal(output.includes(secret), false, secret);
});
let serial = 0;
const limiter = { reserve: async () => {}, cooldown: async () => {} };
function result() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(body) { this.body = body ? JSON.parse(body) : null; } }; }
function request(language, id = 'ka-session-' + String(++serial).padStart(16, '0')) {
  const req = Readable.from([audio]);
  Object.assign(req, { method: 'POST', headers: { 'content-type': 'application/octet-stream', origin: 'https://budgetpro.app', authorization: 'Bearer unit-supabase-token' }, url: `/api/voice/transcribe?language=${language}&mode=quiet&sessionId=${id}` });
  return req;
}
async function invoke({ language = 'ka', fetchImpl, template = env, deps = {} } = {}) {
  const res = result(), seen = { ka: 0, groq: 0, requests: [] };
  const recognize = async (payload, signal, provider) => {
    seen.requests.push({ payload, provider, hasSignal: Boolean(signal) });
    if (provider.name !== 'elevenlabs') throw Object.assign(new Error('GROQ_SHOULD_NOT_BE_USED'), { code: 'GROQ_SHOULD_NOT_BE_USED' });
    return createElevenLabsClient(template.ELEVENLABS_API_KEY, fetchImpl || (async () => response())).recognize(payload, signal);
  };
  const handler = createHandler({ validateConfig: language => providerForLanguage(language, template), authorize: async () => 'ka-test-user-' + serial, createKaLimiter: () => { seen.ka++; return limiter; }, createLimiter: () => { seen.groq++; return limiter; }, recognize, ...deps });
  await handler(request(language), res);
  return { res, seen };
}
test('ka request is routed to Scribe with the paid limiter and keeps the audio+language contract', async () => {
  const { res, seen } = await invoke();
  assert.equal(res.statusCode, 200);
  assert.equal(seen.ka, 1); assert.equal(seen.groq, 0);
  assert.equal(seen.requests.length, 1);
  assert.deepEqual(Object.keys(seen.requests[0].payload).sort(), ['audio', 'language']);
  assert.equal(seen.requests[0].payload.language, 'ka');
  assert.deepEqual(seen.requests[0].payload.audio, audio);
  assert.equal(seen.requests[0].provider.provider, 'elevenlabs-scribe');
  assert.equal(seen.requests[0].hasSignal, true);
  assert.equal(res.body.provider, 'elevenlabs-scribe');
  assert.equal(res.body.model, 'scribe_v3');
  assert.equal(res.body.transcript, phrase.ka);
  assert.equal(res.body.requestedLanguage, 'ka'); assert.equal(res.body.requestedLocale, 'ka-GE');
  assert.equal(res.body.detectedLanguage, 'kat');
  assert.equal(res.body.confidence, null);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  const output = JSON.stringify(res.body);
  for (const secret of [KEY, STORE, GROQ]) assert.equal(output.includes(secret), false);
});
test('ru request keeps the default provider and never touches the paid limiter', async () => {
  const { res, seen } = await invoke({ language: 'ru', deps: { recognize: async () => ({ results: [{ languageCode: 'ru-RU', alternatives: [{ transcript: phrase.ru }] }] }) } });
  assert.equal(res.statusCode, 200);
  assert.equal(seen.ka, 0); assert.equal(seen.groq, 1);
  assert.equal(res.body.detectedLanguage, 'ru-RU');
  assert.equal(res.body.transcript, phrase.ru);
});
test('ka route is rejected before any provider call when the paid provider is not usable', async () => {
  for (const template of [{ ...env, ELEVENLABS_API_KEY: '' }, { ...env, ELEVENLABS_KA_BUDGET_CONFIRMED: 'false' }, { ...env, ASR_REDIS_REST_TOKEN: '' }]) {
    let calls = 0;
    const { res } = await invoke({ template, deps: { recognize: async () => { calls++; } } });
    assert.equal(res.statusCode, 503);
    assert.ok(['STT_NOT_CONFIGURED', 'ASR_LIMITS_NOT_CONFIGURED', 'ELEVENLABS_BUDGET_NOT_CONFIGURED'].includes(res.body.error), res.body.error);
    assert.equal(calls, 0);
  }
  // With no ka provider selected the default provider is used, as before.
  const { res } = await invoke({ template: { ...env, ASR_PROVIDER_KA: undefined }, deps: { recognize: async () => { throw Object.assign(new Error('down'), { code: 'GROQ_DOWN' }); } } });
  assert.equal(res.body.error, 'GROQ_DOWN');
});
test('Scribe quota error records the paid cooldown, never retries and never switches provider', async () => {
  const cooldowns = [];
  let kaLimiterCalls = 0;
  const { res, seen } = await invoke({ fetchImpl: async () => response(429, { detail: 'quota' }, '3600'), deps: { createKaLimiter: () => { kaLimiterCalls++; return { reserve: async () => {}, cooldown: async seconds => cooldowns.push(seconds) }; } } });
  assert.equal(res.statusCode, 429, JSON.stringify(res.body)); assert.equal(res.body.error, 'ASR_QUOTA_EXCEEDED');
  assert.equal(res.headers['Retry-After'], '3600');
  assert.deepEqual(cooldowns, [3600]);
  assert.equal(kaLimiterCalls, 1);
  assert.equal(seen.requests.length, 1);
});
for (const [status, expected, expectedStatus] of [[401, 'ASR_PROVIDER_AUTH_FAILED', 503], [403, 'ASR_PROVIDER_AUTH_FAILED', 503], [400, 'ASR_REQUEST_REJECTED', 502], [500, 'ASR_UNAVAILABLE', 503], [503, 'ASR_UNAVAILABLE', 503]]) test(`Scribe HTTP ${status} maps to ${expected}`, async () => {
  const { res, seen } = await invoke({ fetchImpl: async () => response(status, { detail: 'no key echo' }) });
  assert.equal(res.statusCode, expectedStatus); assert.equal(res.body.error, expected);
  assert.equal(JSON.stringify(res.body).includes('unit-only'), false);
  assert.equal(seen.requests.length, 1);
});
test('Scribe output keeps the local validation contract (empty and Cyrillic transcripts)', async () => {
  const empty = await invoke({ fetchImpl: async () => response(200, { text: '   ' }) });
  assert.equal(empty.res.body.error, 'NO_SPEECH');
  const cyrillic = await invoke({ fetchImpl: async () => response(200, { text: 'Сегодня домой', language_code: 'kat' }) });
  assert.equal(cyrillic.res.statusCode, 422); assert.equal(cyrillic.res.body.error, 'invalid-script');
  assert.equal(cyrillic.res.body.diagnostics.detectedLanguage, 'kat');
  const notJson = await invoke({ fetchImpl: async () => ({ status: 200, ok: true, headers: { get: () => null }, json: async () => { throw new Error('bad json'); } }) });
  assert.equal(notJson.res.statusCode, 502); assert.equal(notJson.res.body.error, 'ASR_INVALID_RESPONSE');
});




