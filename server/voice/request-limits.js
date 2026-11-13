'use strict';
const { createHash } = require('node:crypto');
function error(code, status = 503) { return Object.assign(new Error(code), { code, status }); }
function readLimitConfig(env = process.env) {
  let url;
  try { url = new URL(env.ASR_REDIS_REST_URL); } catch { throw error('ASR_LIMITS_NOT_CONFIGURED'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || !env.ASR_REDIS_REST_TOKEN?.trim()) throw error('ASR_LIMITS_NOT_CONFIGURED');
  return { url: url.origin, token: env.ASR_REDIS_REST_TOKEN };
}
// All keys share a Redis hash tag. Redis TIME and one atomic script enforce
// rolling limits across instances/deployments. Store only hashed identities,
// timestamps and charged seconds: never audio, transcript, email or JWT.
const RESERVE_SCRIPT = `
local t=redis.call('TIME')
local now=tonumber(t[1])*1000+math.floor(tonumber(t[2])/1000)
if redis.call('EXISTS',KEYS[4])==1 then return {'ASR_QUOTA_EXCEEDED',redis.call('TTL',KEYS[4])} end
if redis.call('EXISTS',KEYS[3])==1 then return {'DUPLICATE_SESSION',0} end
redis.call('ZREMRANGEBYSCORE',KEYS[1],'-inf',now-86400000)
redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',now-86400000)
if redis.call('ZCOUNT',KEYS[1],now-60000,'+inf')>=5 then return {'RATE_LIMITED',60} end
if redis.call('ZCARD',KEYS[1])>=60 then return {'ASR_QUOTA_EXCEEDED',86400} end
if redis.call('ZCOUNT',KEYS[2],now-60000,'+inf')>=18 then return {'RATE_LIMITED',60} end
if redis.call('ZCARD',KEYS[2])>=1800 then return {'ASR_QUOTA_EXCEEDED',86400} end
local entries=redis.call('ZRANGE',KEYS[2],0,-1,'WITHSCORES')
local hour=0
local day=0
for i=1,#entries,2 do
 local seconds=tonumber(string.match(entries[i],':(%d+)$'))
 if not seconds then return {'ASR_LIMITS_UNAVAILABLE',0} end
 day=day+seconds
 if tonumber(entries[i+1])>now-3600000 then hour=hour+seconds end
end
local charge=tonumber(ARGV[2])
if day+charge>24000 then return {'ASR_QUOTA_EXCEEDED',86400} end
if hour+charge>6000 then return {'ASR_QUOTA_EXCEEDED',3600} end
redis.call('SET',KEYS[3],'1','EX',86400)
redis.call('ZADD',KEYS[1],now,ARGV[1])
redis.call('ZADD',KEYS[2],now,ARGV[1]..':'..ARGV[2])
redis.call('EXPIRE',KEYS[1],86400)
redis.call('EXPIRE',KEYS[2],86400)
return {'OK',0}
`;
// Never shorten another instance's cooldown.
const COOLDOWN_SCRIPT = `
local ttl=redis.call('TTL',KEYS[1])
if ttl<tonumber(ARGV[1]) then redis.call('SET',KEYS[1],'1','EX',ARGV[1]) end
return 1
`;
const hash = value => createHash('sha256').update(value).digest('hex');
const PREFIX = 'budgetpro:{groq-free}:';
function createRequestLimiter(env = process.env, fetchImpl = fetch) {
  const config = readLimitConfig(env);
  async function command(args, signal) {
    let body;
    try {
      const response = await fetchImpl(config.url, { method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal, redirect: 'error' });
      if (!response.ok) throw error('ASR_LIMITS_UNAVAILABLE');
      body = await response.json();
      if (!body || body.error || !Object.hasOwn(body, 'result')) throw error('ASR_LIMITS_UNAVAILABLE');
    } catch (e) {
      if (signal?.aborted) throw e;
      throw error('ASR_LIMITS_UNAVAILABLE');
    }
    return body.result;
  }
  return {
    async reserve(userId, sessionId, durationMs, signal) {
      if (typeof userId !== 'string' || !userId || typeof sessionId !== 'string' || !Number.isFinite(durationMs) || durationMs < 220 || durationMs > 30000) throw error('INVALID_AUDIO', 400);
      const id = hash(`${userId}:${sessionId}`);
      const keys = [PREFIX + 'user:' + hash(userId), PREFIX + 'global', PREFIX + 'session:' + id, PREFIX + 'cooldown'];
      const result = await command(['EVAL', RESERVE_SCRIPT, 4, ...keys, id, String(Math.max(10, Math.ceil(durationMs / 1000)))], signal);
      const allowed = ['OK', 'DUPLICATE_SESSION', 'RATE_LIMITED', 'ASR_QUOTA_EXCEEDED', 'ASR_LIMITS_UNAVAILABLE'];
      if (!Array.isArray(result) || !allowed.includes(result[0])) throw error('ASR_LIMITS_UNAVAILABLE');
      if (result[0] !== 'OK') {
        const failure = error(result[0], result[0] === 'DUPLICATE_SESSION' ? 409 : result[0] === 'ASR_LIMITS_UNAVAILABLE' ? 503 : 429);
        failure.retryAfter = Math.max(1, Math.min(86400, Number(result[1]) || 60));
        throw failure;
      }
    },
    async cooldown(seconds, signal) {
      await command(['EVAL', COOLDOWN_SCRIPT, 1, PREFIX + 'cooldown', String(Math.max(60, Math.min(86400, Number(seconds) || 3600)))], signal);
    }
  };
}
// Paid ElevenLabs budget. It is a separate prefix so the free Groq quotas are
// never mixed with a paid provider, and it fails closed unless a budget is
// explicitly confirmed for the deployment.
const KA_PREFIX = 'budgetpro:{elevenlabs-ka}:';
const KA_DEFAULTS = Object.freeze({ monthlySeconds: 10800, dailyRequests: 100 });
function readKaBudget(env = process.env) {
  if (env.ELEVENLABS_KA_BUDGET_CONFIRMED !== 'true') throw error('ELEVENLABS_BUDGET_NOT_CONFIGURED');
  const monthlySeconds = env.ELEVENLABS_KA_MONTHLY_SECONDS === undefined || env.ELEVENLABS_KA_MONTHLY_SECONDS === '' ? KA_DEFAULTS.monthlySeconds : Number(env.ELEVENLABS_KA_MONTHLY_SECONDS);
  const dailyRequests = env.ELEVENLABS_KA_DAILY_REQUESTS === undefined || env.ELEVENLABS_KA_DAILY_REQUESTS === '' ? KA_DEFAULTS.dailyRequests : Number(env.ELEVENLABS_KA_DAILY_REQUESTS);
  // Rolling 31-day window for seconds, rolling 24-hour window for requests.
  if (!Number.isInteger(monthlySeconds) || monthlySeconds < 600 || monthlySeconds > 2678400) throw error('ELEVENLABS_BUDGET_INVALID');
  if (!Number.isInteger(dailyRequests) || dailyRequests < 1 || dailyRequests > 10000) throw error('ELEVENLABS_BUDGET_INVALID');
  return { monthlySeconds, dailyRequests };
}
// Per-user daily request cap and rolling monthly seconds cap. No global cap is
// invented here: the paid budget is per user, the cooldown stays shared.
const KA_RESERVE_SCRIPT = `
local t=redis.call('TIME')
local now=tonumber(t[1])*1000+math.floor(tonumber(t[2])/1000)
if redis.call('EXISTS',KEYS[4])==1 then return {'ASR_QUOTA_EXCEEDED',redis.call('TTL',KEYS[4])} end
if redis.call('EXISTS',KEYS[3])==1 then return {'DUPLICATE_SESSION',0} end
redis.call('ZREMRANGEBYSCORE',KEYS[1],'-inf',now-86400000)
redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',now-2678400000)
if redis.call('ZCARD',KEYS[1])>=tonumber(ARGV[3]) then return {'ASR_QUOTA_EXCEEDED',86400} end
local entries=redis.call('ZRANGE',KEYS[2],0,-1)
local total=0
for i=1,#entries do
 local seconds=tonumber(string.match(entries[i],':(%d+)$'))
 if not seconds then return {'ASR_LIMITS_UNAVAILABLE',0} end
 total=total+seconds
end
local charge=tonumber(ARGV[2])
if total+charge>tonumber(ARGV[4]) then return {'ASR_QUOTA_EXCEEDED',86400} end
redis.call('SET',KEYS[3],'1','EX',86400)
redis.call('ZADD',KEYS[1],now,ARGV[1])
redis.call('ZADD',KEYS[2],now,ARGV[1]..':'..ARGV[2])
redis.call('EXPIRE',KEYS[1],86400)
redis.call('EXPIRE',KEYS[2],2678400)
return {'OK',0}
`;
function createKaRequestLimiter(env = process.env, fetchImpl = fetch) {
  const config = readLimitConfig(env), budget = readKaBudget(env);
  async function command(args, signal) {
    let body;
    try {
      const response = await fetchImpl(config.url, { method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal, redirect: 'error' });
      if (!response.ok) throw error('ASR_LIMITS_UNAVAILABLE');
      body = await response.json();
      if (!body || body.error || !Object.hasOwn(body, 'result')) throw error('ASR_LIMITS_UNAVAILABLE');
    } catch (e) {
      if (signal?.aborted) throw e;
      throw error('ASR_LIMITS_UNAVAILABLE');
    }
    return body.result;
  }
  return {
    budget,
    async reserve(userId, sessionId, durationMs, signal) {
      if (typeof userId !== 'string' || !userId || typeof sessionId !== 'string' || !Number.isFinite(durationMs) || durationMs < 220 || durationMs > 30000) throw error('INVALID_AUDIO', 400);
      const id = hash(`${userId}:${sessionId}`);
      const keys = [KA_PREFIX + 'user-requests:' + hash(userId), KA_PREFIX + 'user-seconds:' + hash(userId), KA_PREFIX + 'session:' + id, KA_PREFIX + 'cooldown'];
      const result = await command(['EVAL', KA_RESERVE_SCRIPT, 4, ...keys, id, String(Math.max(10, Math.ceil(durationMs / 1000))), String(budget.dailyRequests), String(budget.monthlySeconds)], signal);
      const allowed = ['OK', 'DUPLICATE_SESSION', 'ASR_QUOTA_EXCEEDED', 'ASR_LIMITS_UNAVAILABLE'];
      if (!Array.isArray(result) || !allowed.includes(result[0])) throw error('ASR_LIMITS_UNAVAILABLE');
      if (result[0] !== 'OK') {
        const failure = error(result[0], result[0] === 'DUPLICATE_SESSION' ? 409 : result[0] === 'ASR_LIMITS_UNAVAILABLE' ? 503 : 429);
        failure.retryAfter = Math.max(1, Math.min(86400, Number(result[1]) || 60));
        throw failure;
      }
    },
    async cooldown(seconds, signal) {
      await command(['EVAL', COOLDOWN_SCRIPT, 1, KA_PREFIX + 'cooldown', String(Math.max(60, Math.min(86400, Number(seconds) || 3600)))], signal);
    }
  };
}
module.exports = { readLimitConfig, createRequestLimiter, readKaBudget, createKaRequestLimiter, RESERVE_SCRIPT, COOLDOWN_SCRIPT, KA_RESERVE_SCRIPT, KA_PREFIX, KA_DEFAULTS };

