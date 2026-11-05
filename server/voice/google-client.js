'use strict';
const crypto = require('node:crypto');
const { readConfig } = require('./config');
const { googleError } = require('./google-errors');
function createGoogleClient(env = process.env, fetchImpl = fetch, dependencies = {}) {
  const config = readConfig(env); let cachedToken;
  const wifToken = config.authMode === 'wif'
    ? require('./wif').createWifTokenSupplier(config.wif, { fetchImpl, getOidcToken: dependencies.getOidcToken, now: dependencies.now })
    : null;
  async function token(signal) {
    if (wifToken) return wifToken(signal);
    if (cachedToken && cachedToken.expires > Date.now() + 60000) return cachedToken.token;
    const encode = object => Buffer.from(JSON.stringify(object)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iss: config.account.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
    const assertion = `${unsigned}.${crypto.sign('RSA-SHA256', Buffer.from(unsigned), config.account.private_key).toString('base64url')}`;
    const response = await fetchImpl('https://oauth2.googleapis.com/token', { method: 'POST', signal, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
    const body = await response.json();
    if (!response.ok) throw googleError(response.status, body);
    if (!body.access_token) throw googleError(401);
    cachedToken = { token: body.access_token, expires: Date.now() + Number(body.expires_in || 3600) * 1000 };
    return cachedToken.token;
  }
  async function request(url, options, signal) {
    const accessToken = await token(signal);
    signal?.throwIfAborted();
    const response = await fetchImpl(url, { ...options, signal, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } });
    const body = await response.json();
    if (!response.ok) throw googleError(response.status, body);
    return body;
  }
  return {
    config,
    async recognize(payload, signal) {
      if (payload.recognizer !== config.recognizer || payload.config.model !== config.model) throw googleError(400, { message: 'Region/model unavailable' });
      return request(`${config.endpoint}/v2/${config.recognizer}:recognize`, { method: 'POST', body: JSON.stringify({ config: payload.config, content: payload.content.toString('base64') }) }, signal);
    },
    async connectivity(signal) {
      // Read-only Locations API. This is connectivity, not a recognize/IAM or
      // billing proof. Cloud Speech Client includes speech.locations.get.
      const location = await request(`${config.endpoint}/v2/projects/${config.project}/locations/${config.location}`, { method: 'GET' }, signal);
      const models = location.metadata?.languages?.models;
      const languageAvailability = Object.fromEntries(['ka-GE', 'ru-RU', 'en-US'].map(locale => [locale, models ? !!models[locale]?.modelFeatures?.[config.model] : null]));
      return { connected: true, location: config.location, model: config.model, languageAvailability, modelAvailabilityVerified: Object.values(languageAvailability).every(value => value === true), recognizePermissionVerified: false, billingVerified: false };
    },
  };
}
let client, signature;
function getClient() {
  const current = crypto.createHash('sha256').update([process.env.GOOGLE_AUTH_MODE, process.env.GOOGLE_CLOUD_PROJECT, process.env.GOOGLE_CLOUD_LOCATION, process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, process.env.GOOGLE_SERVICE_ACCOUNT_JSON, process.env.GOOGLE_WIF_PROVIDER, process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, process.env.VERCEL_ENV].join('\0')).digest('hex');
  if (!client || current !== signature) { client = createGoogleClient(); signature = current; }
  return client;
}
module.exports = { createGoogleClient, recognize: (request, signal) => getClient().recognize(request, signal), connectivity: signal => getClient().connectivity(signal) };
