'use strict';
const { validateTranscript } = require('../../www/voice/transcript-validator');
const asr = require('../../server/voice/asr');
const { createRequestLimiter } = require('../../server/voice/request-limits');
const { setCors } = require('../../server/voice/cors');
const LOCALES = Object.freeze({ auto: 'auto', ka: 'ka-GE', ru: 'ru-RU', en: 'en-US' });
const MAX_BYTES = 44 + 32000 * 30;
function abortable(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => reject(Object.assign(new Error('TIMEOUT'), { code: 'TIMEOUT', status: 504 }));
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
const rates = new Map(), sessions = new Map();
function fail(code, status = 400) { throw Object.assign(new Error(code), { code, status }); }
function validateWav(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 44) fail('INVALID_AUDIO');
  if (buffer.length > MAX_BYTES) fail('PAYLOAD_TOO_LARGE', 413);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE' || buffer.toString('ascii', 12, 16) !== 'fmt ' || buffer.toString('ascii', 36, 40) !== 'data' || buffer.readUInt32LE(16) !== 16 || buffer.readUInt16LE(20) !== 1 || buffer.readUInt16LE(22) !== 1 || buffer.readUInt32LE(24) !== 16000 || buffer.readUInt16LE(34) !== 16 || buffer.readUInt16LE(32) !== 2 || buffer.readUInt32LE(28) !== 32000 || buffer.readUInt32LE(4) !== buffer.length - 8 || buffer.readUInt32LE(40) !== buffer.length - 44 || (buffer.length - 44) % 2) fail('INVALID_AUDIO');
  const durationMs = (buffer.length - 44) / 32;
  if (durationMs < 220 || durationMs > 30000) fail('INVALID_AUDIO');
  return durationMs;
}
function buildRequest(audio, language, hints = [], env = process.env) {
  if (!Object.hasOwn(LOCALES, language)) fail('UNSUPPORTED_LANGUAGE');
  if (!/^[a-z][a-z0-9-]{4,62}$/.test(env.GOOGLE_CLOUD_PROJECT || '') || env.GOOGLE_CLOUD_LOCATION !== 'europe-west4') fail('STT_NOT_CONFIGURED', 503);
  const config = { autoDecodingConfig: {}, model: 'chirp_2', languageCodes: [LOCALES[language]], features: { enableAutomaticPunctuation: true } };
  if (process.env.VOICE_ENABLE_ADAPTATION === 'true' && hints.length && language !== 'auto') config.adaptation = { phraseSets: [{ inlinePhraseSet: { phrases: hints.map(value => ({ value })) } }] };
  // Denoiser/SNR filtering is deliberately disabled until real quiet/noise
  // recordings establish settings that preserve quiet Georgian speech.
  return { recognizer: `projects/${env.GOOGLE_CLOUD_PROJECT}/locations/europe-west4/recognizers/_`, config, content: audio };
}
async function authorize(req, signal) {
  const token = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '')?.[1];
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!token) fail('VOICE_AUTH_REQUIRED', 401);
  if (!url || !key) fail('VOICE_AUTH_NOT_CONFIGURED', 503);
  const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, { signal, headers: { Authorization: `Bearer ${token}`, apikey: key } });
  if (!response.ok) fail(response.status === 401 || response.status === 403 ? 'VOICE_AUTH_REQUIRED' : 'VOICE_AUTH_UNAVAILABLE', response.status === 401 || response.status === 403 ? 401 : 503);
  const user = await response.json(); if (!user.id) fail('VOICE_AUTH_REQUIRED', 401);
  return user.id;
}
async function readAudio(req) {
  if (Number(req.headers['content-length'] || 0) > MAX_BYTES) fail('PAYLOAD_TOO_LARGE', 413);
  if (Buffer.isBuffer(req.body)) return req.body;
  let size = 0; const chunks = [];
  for await (const chunk of req) { const data = Buffer.from(chunk); size += data.length; if (size > MAX_BYTES) fail('PAYLOAD_TOO_LARGE', 413); chunks.push(data); }
  return Buffer.concat(chunks);
}
function createHandler(dependencies = {}) {
  const auth = dependencies.authorize || authorize, recognize = dependencies.recognize || asr.recognize;
  return async (req, res) => {
    if (!setCors(req, res)) { res.statusCode = 403; res.end(JSON.stringify({ ok: false, error: 'CORS_DENIED' })); return; }
    if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), dependencies.timeoutMs || 25000);
    const onClose = () => controller.abort(); req.on?.('aborted', onClose);
    let reservedSession, limiter, recognitionStarted = false;
    try {
      if (req.method !== 'POST') fail('METHOD_NOT_ALLOWED', 405);
      if (!['audio/wav', 'application/octet-stream'].includes((req.headers['content-type'] || '').split(';')[0])) fail('INVALID_AUDIO', 415);
      const query = new URL(req.url, 'https://budgetpro.app').searchParams;
      const language = query.get('language'), mode = query.get('mode'), sessionId = query.get('sessionId');
      if (!Object.hasOwn(LOCALES, language)) fail('UNSUPPORTED_LANGUAGE');
      if (!['auto', 'quiet', 'noise'].includes(mode)) fail('INVALID_MODE');
      if (!/^[a-zA-Z0-9-]{16,64}$/.test(sessionId || '')) fail('INVALID_SESSION');
      let hints; try { hints = JSON.parse(query.get('hints') || '[]'); } catch { fail('INVALID_HINTS'); }
      if (!Array.isArray(hints) || hints.length > 20 || hints.reduce((n, h) => n + (typeof h === 'string' ? h.length : 0), 0) > 400 || hints.some(h => typeof h !== 'string' || !h.trim() || h.length > 60 || /[\p{Cc}]/u.test(h))) fail('INVALID_HINTS');
      const provider = (dependencies.validateConfig || asr.readConfig)();
      const userId = await abortable(auth(req, controller.signal), controller.signal);
      const now = Date.now();
      for (const [k, v] of rates) if (now - v.start >= 60000) rates.delete(k);
      for (const [k, v] of sessions) if (now - v >= 120000) sessions.delete(k);
      const rate = rates.get(userId) || { start: now, count: 0 }; if (++rate.count > 10) fail('RATE_LIMITED', 429); rates.set(userId, rate);
      const sessionKey = `${userId}:${sessionId}`; if (sessions.has(sessionKey)) fail('DUPLICATE_SESSION', 409);
      // Reserve before reading the stream: another request can arrive while
      // readAudio awaits chunks. Keep the reservation once a provider is invoked.
      sessions.set(sessionKey, now); reservedSession = sessionKey;
      const audio = await abortable(readAudio(req), controller.signal), durationMs = validateWav(audio);
      if (provider.name === 'groq') {
        limiter = (dependencies.createLimiter || createRequestLimiter)();
        await abortable(limiter.reserve(userId, sessionId, durationMs, controller.signal), controller.signal);
      }
      const request = provider.name === 'google' ? buildRequest(audio, language, hints) : { audio, language };
      recognitionStarted = true;
      const started = Date.now();
      const response = await abortable(recognize(request, controller.signal, provider), controller.signal);
      const results = response.results || [], transcript = results.map(r => r.alternatives?.[0]?.transcript || '').join(' ').normalize('NFC').trim();
      const validation = validateTranscript(transcript, language);
      if (!validation.valid) throw Object.assign(new Error(validation.reason), { code: validation.reason, status: 422, diagnostics: { rawTranscript: transcript, detectedLanguage: results[0]?.languageCode || null, validation: validation.reason, ...validation.script } });
      // Chirp 2 scores are documented as non-representative; never expose as confidence.
      const detected = [...new Set(results.map(r => r.languageCode).filter(Boolean))];
      res.statusCode = 200; res.end(JSON.stringify({ ok: true, provider: provider.provider, model: provider.model, region: provider.region, sessionId, requestedLanguage: language, requestedLocale: LOCALES[language], detectedLanguage: detected.length === 1 ? detected[0] : null, detectedLanguages: detected, transcript, confidence: null, durationMs, responseTime: Date.now() - started, validation: validation.reason }));
    } catch (e) {
      if (e.code === 'ASR_QUOTA_EXCEEDED' && limiter && recognitionStarted && !controller.signal.aborted) {
        try { await abortable(limiter.cooldown(e.retryAfter, controller.signal), controller.signal); } catch { /* Shared reservations remain charged; never retry upstream. */ }
      }
      const code = controller.signal.aborted ? 'TIMEOUT' : e.code || (e instanceof TypeError ? 'NETWORK_ERROR' : 'STT_ERROR');
      res.statusCode = controller.signal.aborted ? 504 : e.status || (code === 'AUTH_ERROR' ? 503 : 502);
      if (code === 'STT_NOT_CONFIGURED') console.warn('[voice] STT_NOT_CONFIGURED', e.reason || 'CONFIG_INVALID');
      if (e.retryAfter && !controller.signal.aborted) res.setHeader('Retry-After', String(e.retryAfter));
      res.end(JSON.stringify({ ok: false, error: code, ...(e.technicalReason ? { technicalReason: e.technicalReason } : {}), ...(e.diagnostics ? { diagnostics: e.diagnostics } : {}) }));
    } finally {
      if (reservedSession && !recognitionStarted) sessions.delete(reservedSession);
      clearTimeout(timer); req.off?.('aborted', onClose);
    }
  };
}
module.exports = createHandler();
module.exports.config = { maxDuration: 30 };
module.exports.authorize = authorize; module.exports.createHandler = createHandler; module.exports.buildRequest = buildRequest; module.exports.validateWav = validateWav;
