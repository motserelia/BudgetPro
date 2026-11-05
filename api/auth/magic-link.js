'use strict';
// Supabase REST /otp expects redirect_to in the query and create_user in the body.
function classifyError(status, data = {}) {
  const code = String(data.error_code || data.code || '');
  const message = String(data.msg || data.error_description || data.error || '').toLowerCase();
  if (status === 429 || /rate_limit|too many|rate limit|frequency/.test(code + ' ' + message)) return 'AUTH_RATE_LIMITED';
  if (/email_address_not_authorized|email address not authorized|authorized recipients|only.*send.*team|only.*send.*testing/.test(code + ' ' + message)) return 'AUTH_RECIPIENT_NOT_ALLOWED';
  if (/email_provider_disabled|signup_disabled|email.*disabled/.test(code + ' ' + message) || status === 401 || status === 403) return 'AUTH_CONFIG_ERROR';
  if (/smtp|error sending.*email|error sending.*mail|email.*delivery|mail.*provider/.test(message)) return 'AUTH_EMAIL_DELIVERY_FAILED';
  if (/email_address_invalid|invalid email/.test(code + ' ' + message)) return 'AUTH_INVALID_EMAIL';
  if (status >= 500) return 'AUTH_SERVER_UNAVAILABLE';
  return 'AUTH_SEND_FAILED';
}
function createHandler({ fetch: request = globalThis.fetch, env = process.env, log = event => console.warn('[BP_AUTH_FAILURE]', JSON.stringify(event)) } = {}) {
  const report = event => { try { log(event); } catch {} };
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'Retry-After');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    const reply = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
    if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(''); return; }
    if (req.method !== 'POST') return reply(405, { ok: false, error: 'AUTH_METHOD_NOT_ALLOWED' });
    let payload;
    try {
      if (req.body && typeof req.body === 'object') payload = req.body;
      else if (typeof req.body === 'string') payload = JSON.parse(req.body);
      else { const chunks = []; for await (const chunk of req) chunks.push(Buffer.from(chunk)); payload = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    } catch { return reply(400, { ok: false, error: 'AUTH_INVALID_REQUEST' }); }
    const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, { ok: false, error: 'AUTH_INVALID_EMAIL' });
    let url, redirect;
    const key = env.SUPABASE_ANON_KEY;
    try {
      url = new URL('/auth/v1/otp', env.SUPABASE_URL);
      redirect = new URL(env.BUDGETPRO_AUTH_REDIRECT_URL || 'https://budget-pro-lski.vercel.app/');
      if (!key || url.protocol !== 'https:' || redirect.protocol !== 'https:' || redirect.username || redirect.password) throw new Error();
    } catch {
      report({ stage: 'configuration', code: 'AUTH_CONFIG_ERROR', urlConfigured: !!env.SUPABASE_URL, keyConfigured: !!key });
      return reply(503, { ok: false, error: 'AUTH_CONFIG_ERROR' });
    }
    url.searchParams.set('redirect_to', redirect.href);
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 8000);
    try {
      // One attempt only. Email limits and provider failures must never trigger retries.
      const response = await request(url.href, {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, create_user: true }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const error = classifyError(response.status, data || {});
        report({ stage: 'supabase_response', upstreamStatus: response.status, code: error });
        if (error === 'AUTH_RATE_LIMITED') {
          const seconds = Number(response.headers?.get('retry-after'));
          const retryAfter = Number.isFinite(seconds) && seconds > 0 ? Math.min(86400, Math.ceil(seconds)) : 60;
          res.setHeader('Retry-After', String(retryAfter));
          return reply(429, { ok: false, error, retryAfter });
        }
        return reply(response.status >= 400 && response.status <= 599 ? response.status : 502, { ok: false, error });
      }
      if (!data || typeof data !== 'object' || Array.isArray(data) || data.error || data.ok === false) return reply(502, { ok: false, error: 'AUTH_SERVER_UNAVAILABLE' });
      return reply(200, { ok: true });
    } catch (error) {
      const knownCauses = ['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'ERR_INVALID_URL', 'ERR_INVALID_CHAR'];
      const cause = error?.cause?.code || error?.code;
      report({ stage: 'supabase_request', code: 'AUTH_SERVER_UNAVAILABLE', timeout: controller.signal.aborted, cause: knownCauses.includes(cause) ? cause : 'request_failed' });
      return reply(controller.signal.aborted ? 504 : 503, { ok: false, error: 'AUTH_SERVER_UNAVAILABLE' });
    }
    finally { clearTimeout(timer); }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
module.exports.classifyError = classifyError;
