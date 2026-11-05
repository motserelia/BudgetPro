'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const { smoke }=require('../../scripts/voice-cli-common');
const { accept }=require('../../server/voice/metrics');
const { readConfig }=require('../../server/voice/asr');
const manifest=require('./fixtures/manifest.json');
let configured=false;try{readConfig();configured=true;}catch{}
const ready=process.env.VOICE_RUN_REAL_API==='true' && process.env.VOICE_TEST_ACCESS_TOKEN && (process.env.VOICE_TEST_API_LOCAL!=='true'||configured);
for(const fixture of manifest){
 const file=path.join(__dirname,'fixtures',fixture.file),exists=fs.existsSync(file);
 // In normal unit runs, this suite contains no hidden external network calls.
 // voice:test:api performs a failing preflight before invoking this file.
 test(`REAL backend STT ${fixture.language}/${fixture.mode}: ${fixture.expected}`,{skip:!exists?'Human microphone fixture required':!ready?'API preflight not satisfied (not an STT success)':false},async()=>{
  const result=await smoke({file,lang:fixture.language,mode:fixture.mode,local:process.env.VOICE_TEST_API_LOCAL==='true','api-base':process.env.VOICE_TEST_API_BASE});
  assert.equal(result.requestedLocale,{ka:'ka-GE',ru:'ru-RU',en:'en-US'}[fixture.language]);assert.ok((result.provider==='groq' && result.model==='whisper-large-v3' && result.region===null) || (result.provider==='google-stt-v2' && result.model==='chirp_2' && result.region==='europe-west4'));
  // The endpoint response echoes the config it actually used. Provider tests
  // also inspect the serialized REST request at the fetch boundary.
  const acceptance=accept(fixture,result.transcript);
  assert.equal(acceptance.scriptValidation,'valid',result.transcript);
  assert.ok(acceptance.accepted,JSON.stringify({fixture:fixture.file,...acceptance}));
  console.log(JSON.stringify({realProvider:result.provider,fixture:fixture.file,transcript:result.transcript,...acceptance}));
 });
}
