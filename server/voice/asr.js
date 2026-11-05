'use strict';
const google = require('./google-client');
const googleConfig = require('./config');
const { createGroqClient } = require('./groq-client');
const { readLimitConfig } = require('./request-limits');
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
async function recognize(request, signal, config) {
  if (config.name === 'groq') return createGroqClient(process.env.GROQ_API_KEY, fetch, { comparisonVariant: config.comparisonVariant }).recognize(request, signal);
  if (config.name === 'google') return google.recognize(request, signal);
  notConfigured('PROVIDER_UNSUPPORTED');
}
function health(env = process.env) {
  let config;
  try { config = readConfig(env); } catch { /* No secrets, configuration reasons or tokens on the public endpoint. */ }
  return { ok: true, configured: Boolean(config), provider: config?.provider || null, model: config?.model || null, region: config?.region || null, sharedLimits: config?.name === 'groq', ...(config?.comparisonVariant ? { comparisonVariant: config.comparisonVariant } : {}) };
}
module.exports = { readConfig, recognize, health };
