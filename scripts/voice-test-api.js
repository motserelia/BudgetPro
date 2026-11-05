'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const {args,endpoint,safeError}=require('./voice-cli-common');
(async()=>{
 const options=args(),manifest=require('../tests/voice/fixtures/manifest.json');
 const available=manifest.filter(f=>fs.existsSync(path.join('tests/voice/fixtures',f.file)));
 if(!available.length){console.error(JSON.stringify({ok:false,error:'HUMAN_FIXTURES_REQUIRED',realTestsExecuted:0,missingHumanFixtures:manifest.length,skippedTests:0}));process.exitCode=1;return;}
 if(!process.env.VOICE_TEST_ACCESS_TOKEN)throw Object.assign(new Error(),{code:'VOICE_AUTH_REQUIRED'});
 if(options.local)require('../server/voice/asr').readConfig();
 else {const r=await fetch(endpoint(options,'voice/health'),{signal:AbortSignal.timeout(10000),cache:'no-store'});const h=await r.json().catch(()=>({configured:false}));if(!r.ok||!h.configured)throw Object.assign(new Error(),{code:'STT_NOT_CONFIGURED'});}
 const child=spawnSync(process.execPath,['tests/voice/integration.test.js'],{stdio:'inherit',env:{...process.env,VOICE_TEST_API_LOCAL:options.local?'true':'false',VOICE_TEST_API_BASE:options['api-base']||'',VOICE_RUN_REAL_API:'true'}});
 process.exitCode=child.status??1;
})().catch(e=>{console.error(JSON.stringify(safeError(e)));process.exitCode=1;});
