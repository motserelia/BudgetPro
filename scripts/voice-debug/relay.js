'use strict';
// Development computer only. This file must never be copied into www/APK.
const http = require('node:http');
const { execFile } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const PREVIEW = 'https://budget-pro-lski-dwabf1uuf-motserelia-s-projects.vercel.app';
const PROJECT = 'prj_JXya7HuDChbetag5FjXhWDej2MpV', TEAM = 'team_TX33yawczaApgU3vUv6jfnnb';
const MAX_BYTES = 960044, ORIGIN = 'https://budgetpro.app';
const { validateWav } = require('../../api/voice/transcribe');
function failure(code, status) { return Object.assign(new Error(code), { code, status }); }
function parseIdentity(value, now = Date.now()) {
  if (typeof value === 'string' && /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(value)) {
    try {
      const p = JSON.parse(Buffer.from(value.split('.')[1], 'base64url'));
      if (p.project_id === PROJECT && p.owner_id === TEAM && p.aud === 'https://vercel.com/motserelia-s-projects' && p.environment === 'development' && p.exp * 1000 > now + 30000 && p.iss === 'https://oidc.vercel.com/motserelia-s-projects') return { token: value, expires: p.exp * 1000 };
    } catch { /* Never include assertion or CLI output in an error. */ }
  }
  if (value && typeof value === 'object') for (const item of Object.values(value)) { const found = parseIdentity(item, now); if (found) return found; }
  return null;
}
function oidcProvider(run = (args) => new Promise((resolve, reject) => execFile('vercel', args, { timeout: 20000, maxBuffer: 131072 }, (error, stdout) => error ? reject(failure('RELAY_VERCEL_LOGIN_REQUIRED', 503)) : resolve(stdout)))) {
  let cached, pending;
  return async () => {
    if (cached && cached.expires > Date.now() + 60000) return cached.token;
    if (!pending) pending = (async () => {
      try {
        const raw = await run(['project', 'token', 'budget-pro-lski', '--scope', TEAM, '--format=json']);
        cached = parseIdentity(JSON.parse(raw));
        if (!cached) throw failure('RELAY_VERCEL_IDENTITY_INVALID', 503);
        return cached.token;
      } catch (e) { throw failure(e.code === 'RELAY_VERCEL_IDENTITY_INVALID' ? e.code : 'RELAY_VERCEL_LOGIN_REQUIRED', 503); }
      finally { pending = null; }
    })();
    return pending;
  };
}
function createRelay({ getOidcToken = oidcProvider(), fetchImpl = fetch, timeoutMs = 27000, allowOneRuAudio = false, audioLanguage = null, log = () => {} } = {}) {
  if (audioLanguage !== null && !['ru', 'ka', 'en'].includes(audioLanguage)) throw failure('INVALID_ARGUMENT', 400);
  if (allowOneRuAudio && audioLanguage !== null && audioLanguage !== 'ru') throw failure('INVALID_ARGUMENT', 400);
  const armedLanguage = audioLanguage || (allowOneRuAudio ? 'ru' : null);
  let audioAttempts = 0, requests = 0, forwarded = 0, closing = false;
  const controllers = new Set();
  const server = http.createServer(async (req, res) => {
    requests++; const controller = new AbortController(); controllers.add(controller);
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const disconnect = () => controller.abort(); req.on('aborted', disconnect);
    res.on('close', () => { if (!res.writableEnded) disconnect(); });
    const reply = (status, body) => { if (!res.destroyed) { res.statusCode = status; res.end(JSON.stringify(body)); } };
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('Vary', 'Origin');
    let path, bytes = 0, wasForwarded = false, attemptId = null, language = null;
    try {
      if (closing) throw failure('RELAY_STOPPING', 503);
      const port = server.address()?.port;
      if (!['127.0.0.1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) || ![`localhost:${port}`, `127.0.0.1:${port}`].includes(req.headers.host)) throw failure('RELAY_HOST_DENIED', 403);
      if (req.headers.origin && req.headers.origin !== ORIGIN) throw failure('CORS_DENIED', 403);
      if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', ORIGIN);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
      res.setHeader('Access-Control-Expose-Headers', 'Retry-After');
      if (req.method === 'OPTIONS' && req.headers.origin === ORIGIN && req.headers['access-control-request-private-network'] === 'true') res.setHeader('Access-Control-Allow-Private-Network', 'true');
      const rawPath = req.url?.split('?')[0];
      if (!req.url?.startsWith('/') || req.url.startsWith('//') || req.url.includes('\\') || req.url.length > 8192 || !['/api/voice/health', '/api/voice/transcribe'].includes(rawPath)) throw failure('RELAY_ROUTE_DENIED', 404);
      const url = new URL(req.url, PREVIEW); path = rawPath;
      const id = url.searchParams.get('sessionId');
      if (/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id || '')) attemptId = id;
      if (['ru', 'ka', 'en', 'auto'].includes(url.searchParams.get('language'))) language = url.searchParams.get('language');
      if (url.origin !== PREVIEW || url.pathname !== rawPath) throw failure('RELAY_ROUTE_DENIED', 404);
      if (!(req.method === 'OPTIONS' || (path.endsWith('/health') && req.method === 'GET') || (path.endsWith('/transcribe') && req.method === 'POST'))) throw failure('METHOD_NOT_ALLOWED', 405);
      if (Number(req.headers['content-length']) > MAX_BYTES) throw failure('PAYLOAD_TOO_LARGE', 413);
      const chunks = [];
      for await (const chunk of req) { bytes += chunk.length; if (bytes > MAX_BYTES) throw failure('PAYLOAD_TOO_LARGE', 413); chunks.push(chunk); }
      const body = Buffer.concat(chunks);
      if (req.method !== 'POST' && body.length) throw failure('INVALID_AUDIO', 400);
      if (req.method === 'POST') {
        // Empty body is the only auth probe: it reaches Supabase but cannot reach STT.
        if (body.length) {
          validateWav(body);
          if (!armedLanguage || audioAttempts >= 1) throw failure('DEBUG_AUDIO_NOT_ARMED', 423);
          const languages = url.searchParams.getAll('language');
          if (languages.length !== 1 || languages[0] !== armedLanguage) throw failure(allowOneRuAudio ? 'DEBUG_RU_ONLY' : 'DEBUG_LANGUAGE_MISMATCH', 400);
          // Consume before any await. Failure/timeout never restores this slot.
          audioAttempts++;
        }
      }
      const headers = { Accept: 'application/json', 'x-vercel-trusted-oidc-idp-token': await getOidcToken() };
      if (controller.signal.aborted) throw failure('TIMEOUT', 504);
      for (const key of ['authorization', 'content-type', 'origin', 'access-control-request-method', 'access-control-request-headers', 'access-control-request-private-network']) if (req.headers[key]) headers[key] = req.headers[key];
      forwarded++; wasForwarded = true;
      const upstream = await fetchImpl(url, { method: req.method, headers, ...(req.method === 'POST' ? { body } : {}), signal: controller.signal, redirect: 'error' });
      if (upstream.status >= 300 && upstream.status < 400) throw failure('RELAY_UPSTREAM_REDIRECT', 502);
      // API contract is JSON, with empty preflight bodies. Never proxy HTML/login pages.
      if (upstream.status !== 204 && !(upstream.headers.get('content-type') || '').includes('application/json')) throw failure('RELAY_UPSTREAM_INVALID_RESPONSE', 502);
      let size = 0; const output = [];
      if (upstream.body) for await (const chunk of upstream.body) { size += chunk.length; if (size > 131072) throw failure('RELAY_UPSTREAM_INVALID_RESPONSE', 502); output.push(Buffer.from(chunk)); }
      if (!res.destroyed) {
        res.statusCode = upstream.status;
        const retry = upstream.headers.get('retry-after'); if (/^\d{1,5}$/.test(retry || '')) res.setHeader('Retry-After', retry);
        res.end(Buffer.concat(output));
      }
    } catch (e) {
      const safe = ['RELAY_STOPPING','RELAY_HOST_DENIED','CORS_DENIED','RELAY_ROUTE_DENIED','METHOD_NOT_ALLOWED','PAYLOAD_TOO_LARGE','INVALID_AUDIO','DEBUG_AUDIO_NOT_ARMED','DEBUG_RU_ONLY','DEBUG_LANGUAGE_MISMATCH','RELAY_VERCEL_IDENTITY_INVALID','RELAY_VERCEL_LOGIN_REQUIRED','RELAY_UPSTREAM_REDIRECT','RELAY_UPSTREAM_INVALID_RESPONSE'];
      const code = controller.signal.aborted ? 'TIMEOUT' : safe.includes(e.code) ? e.code : 'RELAY_UPSTREAM_ERROR';
      reply(controller.signal.aborted ? 504 : safe.includes(e.code) ? e.status || 400 : 502, { ok: false, error: code });
    } finally {
      clearTimeout(timer); controllers.delete(controller); req.off('aborted', disconnect);
      try { log({ event: 'request', requestId: randomUUID(), attemptId, language, method: req.method, path: path || 'denied', bytes, status: res.statusCode, forwarded: wasForwarded, audioAttempts }); } catch { /* Logging cannot expose errors or alter requests. */ }
    }
  });
  server.requestTimeout = 28000; server.headersTimeout = 10000; server.maxHeadersCount = 30;
  return { server, getState: () => ({ requests, forwarded, audioAttempts, audioArmed: Boolean(armedLanguage), audioLanguage: armedLanguage, closing }), async close() { closing = true; for (const c of controllers) c.abort(); server.closeIdleConnections(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } };
}
function parseArgs(args) {
  let port = 8139, audioLanguage = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port') port = Number(args[++i]);
    else if (args[i] === '--allow-one-ru-audio' || args[i] === '--allow-one-audio') {
      if (audioLanguage !== null) throw failure('INVALID_ARGUMENT', 400);
      audioLanguage = args[i] === '--allow-one-ru-audio' ? 'ru' : args[++i];
      if (!['ru', 'ka', 'en'].includes(audioLanguage)) throw failure('INVALID_ARGUMENT', 400);
    }
    else throw failure('INVALID_ARGUMENT', 400);
  }
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw failure('INVALID_PORT', 400);
  return { port, audioLanguage };
}
async function main() {
  const { port, audioLanguage } = parseArgs(process.argv.slice(2));
  const getOidcToken = oidcProvider(); await getOidcToken();
  const relay = createRelay({ getOidcToken, audioLanguage, log: row => console.log(JSON.stringify(row)) });
  await new Promise((resolve, reject) => { relay.server.once('error', reject); relay.server.listen(port, '127.0.0.1', resolve); });
  console.log(JSON.stringify({ event: 'listening', address: '127.0.0.1', port, audioArmed: Boolean(audioLanguage), audioLanguage }));
  let stopping = false;
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { if (stopping) return; stopping = true; await relay.close(); process.exitCode = 0; });
}
if (require.main === module) main().catch(() => { console.error(JSON.stringify({ ok: false, error: 'RELAY_START_FAILED' })); process.exitCode = 1; });
module.exports = { createRelay, oidcProvider, parseIdentity, parseArgs, PREVIEW, PROJECT, TEAM, MAX_BYTES };
