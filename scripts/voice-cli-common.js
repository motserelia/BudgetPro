'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const api = require('../www/api-config');
function args(argv = process.argv.slice(2)) {
  const output = {};
  for (let i = 0; i < argv.length; i++) {
    if (!/^--[a-z-]+$/.test(argv[i])) throw Object.assign(new Error('INVALID_ARGUMENT'), { code: 'INVALID_ARGUMENT' });
    output[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  if (output['env-file']) {
    if (typeof process.loadEnvFile !== 'function') throw Object.assign(new Error('ENV_LOADER_UNAVAILABLE'), { code: 'ENV_LOADER_UNAVAILABLE' });
    process.loadEnvFile(output['env-file']);
  }
  return output;
}
function endpoint(options = {}, route = 'voice/transcribe') {
  const base = options['api-base'] || api.getApiBaseUrl();
  const url = new URL(base);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw Object.assign(new Error('INVALID_API_BASE'), { code: 'INVALID_API_BASE' });
  if (url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/api') throw Object.assign(new Error('INVALID_API_BASE'), { code: 'INVALID_API_BASE' });
  return url.href.replace(/\/$/, '') + '/' + route;
}
function safeError(e) { return { ok: false, error: typeof e.code === 'string' && (/^[A-Z_-]+$/.test(e.code) || e.code === 'invalid-script') ? e.code : 'VOICE_COMMAND_FAILED', ...(e.reason ? { reason: e.reason } : {}), ...(e.technicalReason ? { technicalReason: e.technicalReason } : {}) }; }
function readFixture(filename) {
  if (!filename || !fs.existsSync(filename)) throw Object.assign(new Error('FIXTURE_MISSING'), { code: 'FIXTURE_MISSING' });
  const audio = fs.readFileSync(filename);
  require('../api/voice/transcribe').validateWav(audio);
  return audio;
}
async function smoke(options, overrides = {}) {
  const language = options.lang || 'ka';
  if (!['ka','ru','en','auto'].includes(language)) throw Object.assign(new Error('UNSUPPORTED_LANGUAGE'), { code: 'UNSUPPORTED_LANGUAGE' });
  const audio = readFixture(options.file), sessionId = crypto.randomUUID();
  const url = new URL(endpoint(options)); url.searchParams.set('language', language); url.searchParams.set('mode', options.mode || 'auto'); url.searchParams.set('sessionId', sessionId);
  const started = Date.now();
  let result, httpStatus;
  if (options.local) {
    // Invoke the actual endpoint handler, including its Supabase auth. No fake
    // user, alternative Google implementation or bypass of production checks.
    const { Readable } = require('node:stream');
    const req = Readable.from([audio]); req.url = url.pathname + url.search; req.method = 'POST';
    req.headers = { 'content-type': 'application/octet-stream', authorization: process.env.VOICE_TEST_ACCESS_TOKEN ? `Bearer ${process.env.VOICE_TEST_ACCESS_TOKEN}` : '' };
    const res = { setHeader() {}, end(body) { result = JSON.parse(body); httpStatus = this.statusCode; } };
    const handler = overrides.handler || require('../api/voice/transcribe'); await handler(req, res);
  } else {
    const token = process.env.VOICE_TEST_ACCESS_TOKEN;
    if (!token) throw Object.assign(new Error('VOICE_AUTH_REQUIRED'), { code: 'VOICE_AUTH_REQUIRED' });
    const response = await (overrides.fetch || fetch)(url, { method: 'POST', signal: AbortSignal.timeout(28000), headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${token}` }, body: audio });
    httpStatus = response.status; result = await response.json().catch(() => ({ok:false,error:'BACKEND_INVALID_RESPONSE'}));
  }
  if (!result.ok) throw Object.assign(new Error(result.error), { code: result.error, technicalReason: result.technicalReason, status: httpStatus });
  if (result.requestedLocale !== { ka:'ka-GE',ru:'ru-RU',en:'en-US',auto:'auto' }[language] || !((result.provider === 'google-stt-v2' && result.model === 'chirp_2' && result.region === 'europe-west4') || (result.provider === 'groq' && result.model === 'whisper-large-v3' && result.region === null))) throw Object.assign(new Error('REQUEST_CONFIG_MISMATCH'), {code:'REQUEST_CONFIG_MISMATCH'});
  const validation = require('../www/voice/transcript-validator').validateTranscript(result.transcript, language);
  if (!validation.valid) throw Object.assign(new Error(validation.reason), {code:validation.reason});
  return { ...result, voiceApiUrl: url.origin + url.pathname, httpStatus, requestDurationMs: Date.now() - started, scriptValidation: validation.reason, normalizedTranscript: require('../www/voice/number-normalizer').normalizeNumbers(result.transcript, language === 'auto' ? result.detectedLanguage || 'auto' : language) };
}
module.exports = { args, endpoint, safeError, readFixture, smoke };
