'use strict';
// Native Node.js 24 multipart upload. No SDK, translation, retries or fallback.
const ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GEORGIAN_CONTEXT = 'ყავა, ლარი, თეთრი, გადავიხადე, დავხარჯე, შემოსავალი, ხელფასი';
function failure(code, status) { return Object.assign(new Error(code), { code, status }); }
function createGroqClient(apiKey, fetchImpl = fetch, { comparisonVariant } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw failure('STT_NOT_CONFIGURED', 503);
  if (comparisonVariant !== undefined && !['baseline', 'ka-context'].includes(comparisonVariant)) throw failure('STT_NOT_CONFIGURED', 503);
  return {
    async recognize({ audio, language }, signal) {
      if (!['ru', 'ka', 'en', 'auto'].includes(language)) throw failure('UNSUPPORTED_LANGUAGE', 400);
      if (comparisonVariant !== undefined && language !== 'ka') throw failure('UNSUPPORTED_LANGUAGE', 400);
      const form = new FormData();
      form.append('file', new Blob([audio], { type: 'audio/wav' }), 'voice.wav');
      form.append('model', 'whisper-large-v3');
      form.append('response_format', 'json');
      form.append('temperature', '0');
      if (language !== 'auto') form.append('language', language);
      if (comparisonVariant === 'ka-context') form.append('prompt', GEORGIAN_CONTEXT);
      let response;
      try {
        response = await fetchImpl(ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form, signal, redirect: 'error' });
      } catch (e) {
        if (signal?.aborted) throw e;
        throw failure('ASR_UNAVAILABLE', 503);
      }
      if (response.status === 429) {
        // Do not expose provider payloads or retry automatically. A shared
        // cooldown is recorded by the handler, including on another instance.
        const seconds = Number(response.headers?.get('retry-after'));
        const error = failure('ASR_QUOTA_EXCEEDED', 429);
        error.retryAfter = Number.isFinite(seconds) && seconds > 0 ? Math.min(86400, Math.ceil(seconds)) : 3600;
        throw error;
      }
      if (response.status === 401 || response.status === 403) throw failure('ASR_PROVIDER_AUTH_FAILED', 503);
      if (!response.ok) throw failure(response.status >= 500 ? 'ASR_UNAVAILABLE' : 'ASR_REQUEST_REJECTED', response.status >= 500 ? 503 : 502);
      let body;
      try { body = await response.json(); } catch { throw failure('ASR_INVALID_RESPONSE', 502); }
      if (!body || typeof body.text !== 'string' || body.text.length > 20000) throw failure('ASR_INVALID_RESPONSE', 502);
      // JSON has no detected-language field. Do not invent auto-detection or
      // confidence metadata; the existing validator handles an empty text.
      return { results: [{ alternatives: [{ transcript: body.text }] }] };
    }
  };
}
module.exports = { createGroqClient, ENDPOINT, GEORGIAN_CONTEXT };
