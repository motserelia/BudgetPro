'use strict';

const { createHash } = require('node:crypto');
const { IdentityPoolClient } = require('google-auth-library');
const { getVercelOidcTokenSync } = require('@vercel/oidc');

function authError(reason, stage = 'oidc') {
  const descriptions = {
    oidc: 'Vercel workload identity is missing or does not match the configured trust.',
    sts: 'Google STS token exchange failed.',
    impersonation: 'Google service-account impersonation failed.',
  };
  return Object.assign(new Error('AUTH_ERROR'), { code: 'AUTH_ERROR', status: 503, reason, stage, technicalReason: descriptions[stage] });
}

function validateOidc(token, config, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 32768 || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) throw authError('OIDC_MISSING_OR_INVALID');
  let header, claims;
  try {
    header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
  } catch { throw authError('OIDC_MISSING_OR_INVALID'); }
  const trust = config.trust, seconds = now / 1000;
  if (header?.alg !== 'RS256' || !claims || typeof claims !== 'object') throw authError('OIDC_MISSING_OR_INVALID');
  if (claims.iss !== trust.issuer) throw authError('OIDC_ISSUER_INVALID');
  if (claims.aud !== trust.audience) throw authError('OIDC_AUDIENCE_INVALID');
  if (claims.owner_id !== trust.ownerId || claims.owner !== trust.owner) throw authError('OIDC_OWNER_INVALID');
  if (claims.project_id !== trust.projectId || claims.project !== trust.project) throw authError('OIDC_PROJECT_INVALID');
  if (claims.environment !== config.environment || claims.sub !== `owner:${trust.owner}:project:${trust.project}:environment:${config.environment}`) throw authError('OIDC_ENVIRONMENT_INVALID');
  if (!Number.isFinite(claims.exp) || claims.exp <= seconds || !Number.isFinite(claims.iat) || claims.iat > seconds + 30 || (claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf > seconds + 30))) throw authError('OIDC_EXPIRED_OR_NOT_YET_VALID');
  // These are fail-closed claim checks, NOT signature verification. Google STS
  // verifies the signature against the configured OIDC provider/JWKS and CEL
  // condition before returning credentials. Never skip that exchange on refresh.
  return claims;
}

// IdentityPoolClient exposes stsCredential as a protected member. Sharing its
// public transporter gives BOTH SDK exchanges the request's abort/deadline and
// disables SDK retries. No SDK internals or credential sources are patched.
class RequestIdentityPoolClient extends IdentityPoolClient {
  constructor(options, signal, fetchImpl) {
    super({ ...options, transporterOptions: { fetchImplementation: fetchImpl } });
    this.transporter.interceptors.request.add({ resolved: options => {
      options.signal = signal; options.timeout = 25000; options.retry = false;
      options.retryConfig = { retry: 0, noResponseRetries: 0, shouldRetry: () => false };
      return options;
    } });
    this.stsCredential.transporter = this.transporter;
  }
}

function createWifTokenSupplier(config, { fetchImpl = fetch, getOidcToken = getVercelOidcTokenSync, now = Date.now } = {}) {
  let cached;
  return async signal => {
    let oidc;
    try { oidc = await getOidcToken(); }
    catch { throw authError('OIDC_UNAVAILABLE'); }
    const claims = validateOidc(oidc, config, now());
    const assertionHash = createHash('sha256').update(oidc).digest('hex');
    signal?.throwIfAborted();
    // Validate this request's identity even when a Google access token is cached.
    // This closure belongs to one provider/account/environment configuration.
    // Only reuse credentials for the EXACT assertion already verified by STS.
    // Decoding claims alone must never permit a forged JWT to hit this cache.
    if (cached && cached.assertionHash === assertionHash && cached.expires > now() + 60000) return cached.token;
    const accountUrl = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${config.serviceAccount}:generateAccessToken`;
    const auth = new RequestIdentityPoolClient({
      type: 'external_account', audience: config.audience,
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      token_url: 'https://sts.googleapis.com/v1/token',
      service_account_impersonation_url: accountUrl,
      service_account_impersonation: { token_lifetime_seconds: 900 },
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      subject_token_supplier: { getSubjectToken: async () => oidc },
    }, signal, fetchImpl);
    try {
      const result = await auth.getAccessToken();
      signal?.throwIfAborted();
      const expires = auth.credentials.expiry_date;
      if (!result.token || !Number.isFinite(expires) || expires <= now()) throw authError('WIF_RESPONSE_INVALID', 'impersonation');
      cached = { token: result.token, expires: Math.min(expires, claims.exp * 1000), assertionHash };
      return cached.token;
    } catch (error) {
      if (error?.code === 'AUTH_ERROR' && error?.reason === 'WIF_RESPONSE_INVALID') throw error;
      // SDK errors can carry assertions, headers and entire HTTP requests.
      // Discard them rather than logging/serializing or attaching as a cause.
      const url = String(error?.config?.url || error?.response?.config?.url || '');
      const stage = url === accountUrl ? 'impersonation' : 'sts';
      throw authError(stage === 'sts' ? 'WIF_STS_FAILED' : 'WIF_IMPERSONATION_FAILED', stage);
    }
  };
}

module.exports = { createWifTokenSupplier, validateOidc };
