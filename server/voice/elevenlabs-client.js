'use strict';
// Native Node.js 24 multipart upload for ElevenLabs Scribe. No SDK, retries or
// fallback: a failed ka request is reported, never re-sent to another provider.
const ENDPOINT = 'https://api.elevenlabs.io/v1/speech-to-text';
// Only Georgian is routed here; ru/en/auto stay on the existing provider.
const SUPPORTED_LANGUAGES = Object.freeze(['ka']);
const MODELS = Object.freeze(['scribe_v3', 'scribe_v2']);
// Documented keyterm limits: at most 1000 terms, each <= 50 characters and <= 5 words.
const KEYTERM_LIMIT = 1000, KEYTERM_CHARS = 50, KEYTERM_WORDS = 5;
function failure(code, status) { return Object.assign(new Error(code), { code, status }); }
function validKeyterms(keyterms) {
  return Array.isArray(keyterms) && keyterms.length <= KEYTERM_LIMIT
    && keyterms.every(term => typeof term === 'string' && term.trim() && term === term.trim()
      && term.length <= KEYTERM_CHARS && term.split(/\s+/).length <= KEYTERM_WORDS);
}
function createElevenLabsClient(apiKey, fetchImpl = fetch, { modelId = 'scribe_v3', keyterms = [] } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw failure('STT_NOT_CONFIGURED', 503);
  if (!MODELS.includes(modelId)) throw failure('STT_NOT_CONFIGURED', 503);
  if (!validKeyterms(keyterms)) throw failure('STT_NOT_CONFIGURED', 503);
  return {
    async recognize({ audio, language }, signal) {
      if (!SUPPORTED_LANGUAGES.includes(language)) throw failure('UNSUPPORTED_LANGUAGE', 400);
      const form = new FormData();
      form.append('file', new Blob([audio], { type: 'audio/wav' }), 'voice.wav');
      form.append('model_id', modelId);
      form.append('language_code', language);
      // Audio events are not part of the operation contract: keep the transcript
      // limited to speech and drop fillers before the existing parser sees it.
      form.append('tag_audio_events', 'false');
      form.append('no_verbatim', 'true');
      for (const term of keyterms) form.append('keyterms', term);
      let response;
      try {
        response = await fetchImpl(ENDPOINT, { method: 'POST', headers: { 'xi-api-key': apiKey }, body: form, signal, redirect: 'error' });
      } catch (e) {
        if (signal?.aborted) throw e;
        throw failure('ASR_UNAVAILABLE', 503);
      }
      if (response.status === 429) {
        // Never retry or switch providers; the handler records a shared cooldown.
        const seconds = Number(response.headers?.get('retry-after'));
        const error = failure('ASR_QUOTA_EXCEEDED', 429);
        error.retryAfter = Number.isFinite(seconds) && seconds > 0 ? Math.min(86400, Math.ceil(seconds)) : 3600;
        throw error;
      }
      if (response.status === 401 || response.status === 403) throw failure('ASR_PROVIDER_AUTH_FAILED', 503);
      if (!response.ok) throw failure(response.status >= 500 ? 'ASR_UNAVAILABLE' : 'ASR_REQUEST_REJECTED', response.status >= 500 ? 503 : 502);
      let body;
      try { body = await response.json(); } catch { throw failure('ASR_INVALID_RESPONSE', 502); }
      if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.text !== 'string' || body.text.length > 20000) throw failure('ASR_INVALID_RESPONSE', 502);
      // Scribe reports the detected language; pass the documented code through
      // unchanged (ka/kat) and never invent confidence scores.
      const detected = typeof body.language_code === 'string' && /^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(body.language_code) ? body.language_code : null;
      return { results: [{ ...(detected ? { languageCode: detected } : {}), alternatives: [{ transcript: body.text }] }] };
    }
  };
}
module.exports = { createElevenLabsClient, ENDPOINT, SUPPORTED_LANGUAGES, MODELS, KEYTERM_LIMIT, KEYTERM_CHARS, KEYTERM_WORDS };
