'use strict';
const fs = require('node:fs'), path = require('node:path'), { execFileSync } = require('node:child_process');
const { args, endpoint, safeError } = require('./voice-cli-common');
const { health } = require('../server/voice/asr');
const { createGoogleClient } = require('../server/voice/google-client');
function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]); }
const secret = /-----BEGIN (?:RSA )?PRIVATE KEY-----|"type"\s*:\s*"service_account"|"private_key"\s*:\s*"/;
function scan(paths) { return paths.filter(file => fs.existsSync(file) && /\.(?:js|json|env|md|ya?ml|pem|key)$/.test(file) && fs.statSync(file).size < 10000000 && secret.test(fs.readFileSync(file,'utf8'))); }
(async()=> {
  const options = args(), report = { ...health(), voiceApiUrl: endpoint(options), healthUrl: endpoint(options,'voice/health'), authConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY), testAuthPresent:!!process.env.VOICE_TEST_ACCESS_TOKEN };
  report.clientCredentialFiles = scan([...files('www'),...files('desktop'),...files('android/app/src/main/assets/public')]);
  const tracked = execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
  report.gitWorkingTreeCredentialFiles = scan(tracked);
  // Git index blobs, not only modified working tree files; print paths only.
  report.gitIndexCredentialFiles = tracked.filter(file => /\.(?:js|json|env|md|ya?ml|pem|key)$/.test(file)).filter(file => { try { return secret.test(execFileSync('git',['show',':'+file],{encoding:'utf8',maxBuffer:10000000,stdio:['ignore','pipe','ignore']})); } catch { return false; } });
  report.googleClientCreated = false;
  let client;
  if (report.provider === 'google-stt-v2') {
    try { client = createGoogleClient(); report.googleClientCreated = true; } catch(e) { report.configurationError = safeError(e); }
  }
  if (client && !options.offline) {
    try { report.googleConnectivity = await client.connectivity(AbortSignal.timeout(15000)); } catch(e) { report.googleConnectivity = safeError(e); }
  }
  if (!options.offline) {
    try { const response = await fetch(report.healthUrl,{cache:'no-store',signal:AbortSignal.timeout(10000)});report.backendHealth = {httpStatus:response.status,...await response.json().catch(()=>({ok:false,error:'HEALTH_INVALID_RESPONSE'}))}; }
    catch { report.backendHealth={ok:false,error:'HEALTH_UNREACHABLE'}; }
  }
  report.ok = report.configured && report.authConfigured && (report.provider !== 'google-stt-v2' || report.googleClientCreated) && !report.clientCredentialFiles.length && !report.gitWorkingTreeCredentialFiles.length && !report.gitIndexCredentialFiles.length && (options.offline || (report.backendHealth?.configured && report.backendHealth?.provider === report.provider && (report.provider !== 'google-stt-v2' || (report.googleConnectivity?.connected && report.googleConnectivity?.modelAvailabilityVerified))));
  report.recognitionPracticallyVerified = false; // Readiness checks never transcribe audio.
  console.log(JSON.stringify(report,null,2)); if(!report.ok) process.exitCode=1;
})().catch(e=>{console.error(JSON.stringify(safeError(e)));process.exitCode=1;});
