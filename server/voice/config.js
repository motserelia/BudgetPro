'use strict';
const crypto = require('node:crypto');
const LOCATION = 'europe-west4', MODEL = 'chirp_2';
const VERCEL_TRUST = Object.freeze({
  issuer: 'https://oidc.vercel.com/motserelia-s-projects',
  audience: 'https://vercel.com/motserelia-s-projects',
  ownerId: 'team_TX33yawczaApgU3vUv6jfnnb', owner: 'motserelia-s-projects',
  projectId: 'prj_JXya7HuDChbetag5FjXhWDej2MpV', project: 'budget-pro-lski',
});
function notConfigured(reason) { return Object.assign(new Error('STT_NOT_CONFIGURED'), { code: 'STT_NOT_CONFIGURED', status: 503, reason }); }
function readAuth(env) {
  const authMode = env.GOOGLE_AUTH_MODE || 'service_account';
  if (authMode === 'service_account') return { authMode, account: readCredentials(env) };
  if (authMode !== 'wif') throw notConfigured('AUTH_MODE_INVALID');
  if (env.GOOGLE_CLOUD_PROJECT !== 'budgetpro-push') throw notConfigured('WIF_PROJECT_INVALID');
  const provider = env.GOOGLE_WIF_PROVIDER || '', serviceAccount = env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  if (!/^projects\/632084975766\/locations\/global\/workloadIdentityPools\/[a-z][a-z0-9-]{3,31}\/providers\/[a-z][a-z0-9-]{3,31}$/.test(provider)) throw notConfigured('WIF_PROVIDER_INVALID');
  if (!/^budgetpro-stt(?:-preview|-production)?@budgetpro-push\.iam\.gserviceaccount\.com$/.test(serviceAccount)) throw notConfigured('WIF_ACCOUNT_INVALID');
  if (!['preview', 'production'].includes(env.VERCEL_ENV)) throw notConfigured('WIF_ENVIRONMENT_INVALID');
  if (serviceAccount.includes('-preview@') && env.VERCEL_ENV !== 'preview' || serviceAccount.includes('-production@') && env.VERCEL_ENV !== 'production') throw notConfigured('WIF_ACCOUNT_ENVIRONMENT_INVALID');
  return { authMode, wif: { provider, audience: '//iam.googleapis.com/' + provider, serviceAccount, environment: env.VERCEL_ENV, trust: VERCEL_TRUST } };
}
function readCredentials(env = process.env) {
  const encoded = env.GOOGLE_SERVICE_ACCOUNT_JSON_B64?.trim();
  let raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (encoded) {
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) throw notConfigured('CREDENTIALS_B64_INVALID');
    raw = Buffer.from(encoded, 'base64').toString('utf8');
  }
  if (!raw) throw notConfigured('CREDENTIALS_MISSING');
  let account;
  try { account = JSON.parse(raw); } catch { throw notConfigured('CREDENTIALS_JSON_INVALID'); }
  if (!account || typeof account !== 'object' || Array.isArray(account) || account.type !== 'service_account' || typeof account.client_email !== 'string' || !/^[^\s@]+@[^\s@]+\.gserviceaccount\.com$/.test(account.client_email) || typeof account.private_key !== 'string') throw notConfigured('CREDENTIALS_FIELDS_INVALID');
  // Some ENV interfaces double-escape newlines. Normalize only key contents.
  account.private_key = account.private_key.replace(/\\n/g, '\n');
  try { if (crypto.createPrivateKey(account.private_key).asymmetricKeyType !== 'rsa') throw new Error(); } catch { throw notConfigured('CREDENTIALS_KEY_INVALID'); }
  return account;
}
function readConfig(env = process.env) {
  if (!env.GOOGLE_CLOUD_PROJECT) throw notConfigured('PROJECT_MISSING');
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(env.GOOGLE_CLOUD_PROJECT)) throw notConfigured('PROJECT_INVALID');
  if (!env.GOOGLE_CLOUD_LOCATION) throw notConfigured('LOCATION_MISSING');
  if (env.GOOGLE_CLOUD_LOCATION !== LOCATION) throw notConfigured('LOCATION_INVALID');
  return { project: env.GOOGLE_CLOUD_PROJECT, location: LOCATION, model: MODEL, ...readAuth(env), endpoint: `https://${LOCATION}-speech.googleapis.com`, recognizer: `projects/${env.GOOGLE_CLOUD_PROJECT}/locations/${LOCATION}/recognizers/_` };
}
function health(env = process.env) {
  let configured = false, credentialsConfigured = false;
  try { readAuth(env); credentialsConfigured = true; } catch {}
  try { readConfig(env); configured = true; } catch {}
  return { ok: configured, configured, provider: 'google-stt-v2', model: MODEL, location: LOCATION, authMode: ['wif', 'service_account'].includes(env.GOOGLE_AUTH_MODE || 'service_account') ? env.GOOGLE_AUTH_MODE || 'service_account' : 'invalid', projectConfigured: /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(env.GOOGLE_CLOUD_PROJECT || ''), locationConfigured: env.GOOGLE_CLOUD_LOCATION === LOCATION, credentialsConfigured };
}
module.exports = { readConfig, readCredentials, health, notConfigured, LOCATION, MODEL };
