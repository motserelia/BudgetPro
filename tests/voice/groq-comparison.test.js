'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { createComparisonRecognizer, GEORGIAN_CONTEXT } = require('../../scripts/voice-debug/groq-comparison');
const { ENDPOINT } = require('../../server/voice/groq-client');
const audio = Buffer.from(require('../../www/voice/pcm').wav(new Float32Array(16000)));
for (const variant of ['baseline', 'ka-context']) test(`local ${variant} comparison preserves WAV, fixed model, ka, cancellation and server-only key (mocks)`, async () => {
  let calls = 0; const controller = new AbortController();
  const recognize = createComparisonRecognizer(variant, { apiKey: 'unit-only-key', fetchImpl: async (url, opts) => {
    calls++; assert.equal(url, ENDPOINT); assert.equal(opts.signal, controller.signal);
    assert.deepEqual(opts.headers, { Authorization: 'Bearer unit-only-key' });
    const f = opts.body; assert.equal(f.get('model'), 'whisper-large-v3'); assert.equal(f.get('language'), 'ka');
    assert.equal(f.get('temperature'), '0'); assert.equal(f.get('response_format'), 'json');
    assert.deepEqual(Buffer.from(await f.get('file').arrayBuffer()), audio);
    assert.equal(f.get('prompt'), variant === 'baseline' ? null : GEORGIAN_CONTEXT);
    return new Response(JSON.stringify({ text: 'mock transcript' }), { status: 200 });
  } });
  const r = await recognize({ audio, language: 'ka', token: 'never-forward-supabase', hints: ['private category'] }, controller.signal);
  assert.equal(r.results[0].alternatives[0].transcript, 'mock transcript'); assert.equal(calls, 1);
});
test('comparison requires explicit variant and ka; fixed context has no test amount or full phrase', async () => {
  assert.throws(() => createComparisonRecognizer(undefined, { apiKey: 'unit-only' }), /COMPARISON_VARIANT_REQUIRED/);
  let calls = 0; const r = createComparisonRecognizer('ka-context', { apiKey: 'unit-only', fetchImpl: () => calls++ });
  await assert.rejects(async () => r({ audio, language: 'ru' }), /COMPARISON_KA_ONLY/); assert.equal(calls, 0);
  assert.equal(/\d|რვა|ყავაში რვა ლარი გადავიხადე/.test(GEORGIAN_CONTEXT), false);
  for (const word of ['ყავა', 'ლარი', 'თეთრი', 'გადავიხადე', 'დავხარჯე', 'შემოსავალი', 'ხელფასი']) assert.ok(GEORGIAN_CONTEXT.includes(word));
});
test('comparison retains quota error and never retries or switches providers', async () => {
  let calls = 0; const recognize = createComparisonRecognizer('ka-context', { apiKey: 'unit-only', fetchImpl: async () => { calls++; return new Response('{}', { status: 429, headers: { 'Retry-After': '60' } }); } });
  await assert.rejects(recognize({ audio, language: 'ka' }), e => e.code === 'ASR_QUOTA_EXCEEDED'); assert.equal(calls, 1);
});
test('server comparison selection is explicit and preview-only; ordinary baseline remains unchanged', () => {
  const { readConfig, health } = require('../../server/voice/asr');
  const env = { ASR_PROVIDER: 'groq', GROQ_API_KEY: 'unit-key', GROQ_FREE_TIER_CONFIRMED: 'true', ASR_REDIS_REST_URL: 'https://unit.invalid', ASR_REDIS_REST_TOKEN: 'unit-store' };
  assert.equal(readConfig(env).comparisonVariant, undefined);
  for (const comparisonVariant of ['baseline', 'ka-context']) {
    const selected = { ...env, VERCEL_ENV: 'preview', ASR_TEST_VARIANT: comparisonVariant };
    assert.equal(readConfig(selected).comparisonVariant, comparisonVariant);
    assert.equal(health(selected).comparisonVariant, comparisonVariant);
  }
  for (const patch of [{ ASR_TEST_VARIANT: 'ka-context' }, { ASR_TEST_VARIANT: 'ka-context', VERCEL_ENV: 'production' }, { ASR_TEST_VARIANT: 'auto', VERCEL_ENV: 'preview' }, { ASR_TEST_VARIANT: '', VERCEL_ENV: 'preview' }, { ASR_TEST_VARIANT: 'ka-context', VERCEL_ENV: 'preview', ASR_PROVIDER: 'google', ASR_ALLOW_PAID_PROVIDERS: 'true' }]) assert.throws(() => readConfig({ ...env, ...patch }), e => e.code === 'STT_NOT_CONFIGURED');
});
test('context handler preserves raw corrupted numeral, shared Redis failure and duplicate protection (mocks)', async () => {
  const { Readable } = require('node:stream'), { randomUUID } = require('node:crypto');
  const { createHandler } = require('../../api/voice/transcribe');
  const { normalizeNumbers } = require('../../www/voice/number-normalizer');
  const raw = 'ავაში არვა ლარი გადავიხადე.'; let calls = 0, reserves = 0;
  const recognize = createComparisonRecognizer('ka-context', { apiKey: 'unit-only', fetchImpl: async (_, opts) => {
    calls++; assert.equal(opts.body.get('prompt'), GEORGIAN_CONTEXT);
    return new Response(JSON.stringify({ text: raw }), { status: 200 });
  } });
  const provider = { name: 'groq', provider: 'groq', model: 'whisper-large-v3', region: null, comparisonVariant: 'ka-context' };
  const makeReq = id => Object.assign(Readable.from([audio]), { method: 'POST', url: `/api/voice/transcribe?language=ka&mode=quiet&sessionId=${id}&prompt=8`, headers: { origin: 'https://budgetpro.app', 'content-type': 'audio/wav', authorization: 'Bearer unit-supabase' } });
  const invoke = async (handler, id) => { const res = { setHeader() {}, end(body) { this.body = JSON.parse(body); } }; await handler(makeReq(id), res); return res; };
  const handler = createHandler({ validateConfig: () => provider, authorize: async () => 'context-mock-user', createLimiter: () => ({ reserve: async () => reserves++ }), recognize });
  const id = randomUUID(), r = await invoke(handler, id);
  assert.equal(r.statusCode, 200); assert.equal(r.body.transcript, raw); assert.equal(normalizeNumbers(r.body.transcript, 'ka'), raw);
  assert.equal((await invoke(handler, id)).body.error, 'DUPLICATE_SESSION'); assert.equal(calls, 1); assert.equal(reserves, 1);
  const blocked = createHandler({ validateConfig: () => provider, authorize: async () => 'context-mock-user-blocked', createLimiter: () => ({ reserve: async () => { throw Object.assign(Error(), { code: 'ASR_LIMITS_UNAVAILABLE', status: 503 }); } }), recognize });
  assert.equal((await invoke(blocked, randomUUID())).body.error, 'ASR_LIMITS_UNAVAILABLE'); assert.equal(calls, 1);
});
