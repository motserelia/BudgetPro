'use strict';
// Local test harness only. No listener, credentials, automatic requests or deployment.
const { createGroqClient, GEORGIAN_CONTEXT } = require('../../server/voice/groq-client');
const { readConfig } = require('../../server/voice/asr');
const { createHandler } = require('../../api/voice/transcribe');
function createComparisonRecognizer(variant, { apiKey, fetchImpl = fetch } = {}) {
  if (!['baseline', 'ka-context'].includes(variant)) throw new Error('COMPARISON_VARIANT_REQUIRED');
  const client = createGroqClient(apiKey, fetchImpl, { comparisonVariant: variant });
  return (request, signal) => {
    if (request.language !== 'ka') throw new Error('COMPARISON_KA_ONLY');
    return client.recognize(request, signal);
  };
}
function createComparisonHandler(variant) {
  const provider = readConfig();
  if (provider.name !== 'groq') throw new Error('COMPARISON_GROQ_FREE_REQUIRED');
  // Original handler retains Supabase auth, WAV validation, Redis and request limits.
  return createHandler({ validateConfig: () => provider, recognize: createComparisonRecognizer(variant, { apiKey: process.env.GROQ_API_KEY }) });
}
module.exports = { GEORGIAN_CONTEXT, createComparisonRecognizer, createComparisonHandler };
