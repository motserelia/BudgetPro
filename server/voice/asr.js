'use strict';
const google = require('./google-client');
const googleConfig = require('./config');
const { createGroqClient } = require('./groq-client');
const { createElevenLabsClient } = require('./elevenlabs-client');
const { readLimitConfig, readKaBudget } = require('./request-limits');
const { keytermWords } = require('../../www/voice/number-normalizer');
// Georgian is the only language routed to the paid provider; ru/en/auto keep the
// existing selection. Nothing here is enabled unless ASR_PROVIDER_KA is set.
const KA_PROVIDER = 'elevenlabs', KA_MODELS = Object.freeze(['scribe_v3', 'scribe_v2']);
function notConfigured(reason) { throw Object.assign(new Error('STT_NOT_CONFIGURED'), { code: 'STT_NOT_CONFIGURED', status: 503, reason }); }
function readConfig(env = process.env) {
  const name = env.ASR_PROVIDER;
  const comparisonVariant = env.ASR_TEST_VARIANT;
  if (comparisonVariant !== undefined && (env.VERCEL_ENV !== 'preview' || name !== 'groq' || !['baseline', 'ka-context'].includes(comparisonVariant))) notConfigured('TEST_VARIANT_INVALID');
  if (name === 'groq') {
    if (!env.GROQ_API_KEY?.trim()) notConfigured('GROQ_KEY_MISSING');
    // Deployment attestation, not a way to determine the account's billing tier.
    if (env.GROQ_FREE_TIER_CONFIRMED !== 'true') notConfigured('GROQ_FREE_TIER_NOT_CONFIRMED');
    readLimitConfig(env); // Fail closed without a shared limiter.
    return { name, provider: 'groq', model: 'whisper-large-v3', region: null, ...(comparisonVariant === undefined ? {} : { comparisonVariant }) };
  }
  if (name === 'google') {
    if (env.ASR_ALLOW_PAID_PROVIDERS !== 'true') notConfigured('PAID_PROVIDER_DISABLED');
    googleConfig.readConfig(env);
    return { name, provider: 'google-stt-v2', model: 'chirp_2', region: 'europe-west4' };
  }
  notConfigured(name ? 'PROVIDER_UNSUPPORTED' : 'PROVIDER_NOT_SELECTED');
}
// Paid ka provider. Fails closed: no key, no budget confirmation or no shared
// limiter means the ka route is unavailable, never silently sent to another
// provider. Keyterms stay empty unless explicitly enabled, and their words come
// from the same number table the parser uses.
function readElevenLabsConfig(env = process.env) {
  if (!env.ELEVENLABS_API_KEY?.trim()) notConfigured('ELEVENLABS_KEY_MISSING');
  const model = env.ELEVENLABS_MODEL_ID?.trim() || KA_MODELS[0];
  if (!KA_MODELS.includes(model)) notConfigured('ELEVENLABS_MODEL_INVALID');
  readLimitConfig(env); // Shared limiter storage; the paid budget is read below.
  readKaBudget(env); // Fail closed without an explicit budget attestation.
  const keyterms = env.ELEVENLABS_KEYTERMS === 'on' ? keytermWords('ka') : [];
  return { name: KA_PROVIDER, provider: 'elevenlabs-scribe', model, region: null, keyterms };
}
// ru/en/auto are unchanged; ka uses ASR_PROVIDER_KA when it is set.
function providerForLanguage(language, env = process.env) {
  const selected = language === 'ka' ? env.ASR_PROVIDER_KA?.trim() : undefined;
  if (!selected) return readConfig(env);
  if (selected === KA_PROVIDER) return readElevenLabsConfig(env);
  if (selected === 'groq') return readConfig(env);
  notConfigured('KA_PROVIDER_UNSUPPORTED');
}
async function recognize(request, signal, config) {
  if (config.name === 'groq') return createGroqClient(process.env.GROQ_API_KEY, fetch, { comparisonVariant: config.comparisonVariant }).recognize(request, signal);
  if (config.name === 'google') return google.recognize(request, signal);
  if (config.name === KA_PROVIDER) return createElevenLabsClient(process.env.ELEVENLABS_API_KEY, fetch, { modelId: config.model, keyterms: config.keyterms }).recognize(request, signal);
  notConfigured('PROVIDER_UNSUPPORTED');
}
function health(env = process.env) {
  let config;
  try { config = readConfig(env); } catch { /* No secrets, configuration reasons or tokens on the public endpoint. */ }
  // Only the selected provider's public model name is reported; key, budget
  // confirmations and limit values never leave the server.
  const kaSelected = env.ASR_PROVIDER_KA?.trim() === KA_PROVIDER;
  let kaConfig;
  if (kaSelected) { try { kaConfig = readElevenLabsConfig(env); } catch {} }
  return { ok: true, configured: Boolean(config), provider: config?.provider || null, model: config?.model || null, region: config?.region || null, sharedLimits: config?.name === 'groq', ...(config?.comparisonVariant ? { comparisonVariant: config.comparisonVariant } : {}), ka: { selected: kaSelected, configured: Boolean(kaConfig), provider: kaConfig?.provider || null, model: kaConfig?.model || null, keyterms: kaConfig ? kaConfig.keyterms.length : 0 } };
}
module.exports = { readConfig, readElevenLabsConfig, providerForLanguage, recognize, health, KA_PROVIDER, KA_MODELS };

