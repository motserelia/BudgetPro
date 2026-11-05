const test = require('node:test'), assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { createHandler, buildRequest } = require('../../api/voice/transcribe');
const { wav } = require('../../www/voice/pcm');
process.env.GOOGLE_CLOUD_PROJECT = 'budgetpro-test'; process.env.GOOGLE_CLOUD_LOCATION = 'europe-west4';
const audio=Buffer.from(wav(new Float32Array(16000)));
let serial=0;
async function invoke({lang='ka',mode='auto',method='POST',contentType='audio/wav',body=audio,google,authorize,sessionId}={}) {
 const req=Readable.from([body]); req.method=method; req.headers={'content-type':contentType}; req.url=`/api/voice/transcribe?language=${lang}&mode=${mode}&sessionId=${sessionId||'test-session-'+String(++serial).padStart(16,'0')}`;
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(body){this.body=body?JSON.parse(body):null;}};
 await createHandler({validateConfig:()=>({name:'google',provider:'google-stt-v2',model:'chirp_2',region:'europe-west4'}),authorize:authorize|| (async()=>`unit-user-${serial}`),recognize:google|| (async()=>({results:[{languageCode:'ka-GE',alternatives:[{transcript:'ყავა რვა ლარი'}]}]}))})(req,res); return res;
}
for(const [lang,locale] of [['ka','ka-GE'],['ru','ru-RU'],['en','en-US'],['auto','auto']]) test(`actual Google request: ${lang} => [${locale}] chirp_2`,()=>{ const r=buildRequest(audio,lang,[],process.env); assert.deepEqual(r.config.languageCodes,[locale]); assert.equal(r.config.model,'chirp_2'); assert.ok(r.recognizer.includes('/europe-west4/')); assert.equal(r.config.translationConfig,undefined); });
test('success contains real detected language, null absent confidence, no persistence',async()=> { const r=await invoke(); assert.equal(r.statusCode,200); assert.equal(r.body.confidence,null); assert.equal(r.body.detectedLanguage,'ka-GE'); assert.equal(r.body.provider,'google-stt-v2'); assert.equal(r.headers['Cache-Control'],'no-store'); });
test('fixed Georgian Cyrillic rejected; never re-requested in Russian',async()=> {let calls=0;const r=await invoke({google:async request=>{calls++;assert.deepEqual(request.config.languageCodes,['ka-GE']);return {results:[{alternatives:[{transcript:'Сегодня домой'}]}]};}});assert.equal(r.statusCode,422);assert.equal(r.body.error,'invalid-script');assert.equal(calls,1);});
test('empty result is NO_SPEECH',async()=>assert.equal((await invoke({google:async()=>({results:[]})})).body.error,'NO_SPEECH'));
for(const [options,error,status] of [[{method:'GET'},'METHOD_NOT_ALLOWED',405],[{lang:'de'},'UNSUPPORTED_LANGUAGE',400],[{mode:'street'},'INVALID_MODE',400],[{contentType:'application/json'},'INVALID_AUDIO',415],[{body:Buffer.from('bad')},'INVALID_AUDIO',400],[{body:Buffer.alloc(1000000)},'PAYLOAD_TOO_LARGE',413]]) test(error+status,async()=>{const r=await invoke(options);assert.equal(r.body.error,error);assert.equal(r.statusCode,status);});
test('authentication failure prevents Google call',async()=> {let calls=0;const r=await invoke({authorize:async()=>{throw Object.assign(new Error(),{code:'AUTH_ERROR',status:401});},google:async()=>{calls++;}});assert.equal(r.statusCode,401);assert.equal(calls,0);});
test('duplicate session rejected',async()=> {const options={sessionId:'dedup-session-12345678',authorize:async()=> 'dedup-user'};assert.equal((await invoke(options)).statusCode,200);assert.equal((await invoke(options)).body.error,'DUPLICATE_SESSION');});
test('concurrent duplicate streams invoke Google only once',async()=> {
 let calls=0;
 const options={sessionId:'concurrent-session-12345678',authorize:async()=> 'concurrent-user',google:async()=>{calls++;return {results:[{alternatives:[{transcript:'ყავა რვა ლარი'}]}]};}};
 const results=await Promise.all([invoke(options),invoke(options)]);
 assert.deepEqual(results.map(r=>r.statusCode).sort(),[200,409]);assert.equal(calls,1);
});
test('invalid WAV releases reservation so corrected audio can be submitted',async()=> {
 const options={sessionId:'invalid-retry-session-12345678',authorize:async()=> 'invalid-retry-user'};
 assert.equal((await invoke({...options,body:Buffer.from('bad')})).statusCode,400);
 assert.equal((await invoke(options)).statusCode,200);
});
test('upstream failure retains reservation to prevent duplicate processing',async()=> {
 let calls=0;const options={sessionId:'upstream-retry-session-12345678',authorize:async()=> 'upstream-retry-user',google:async()=>{calls++;throw Object.assign(new Error(),{code:'NETWORK_ERROR'});}};
 assert.equal((await invoke(options)).body.error,'NETWORK_ERROR');
 assert.equal((await invoke(options)).body.error,'DUPLICATE_SESSION');assert.equal(calls,1);
});
test('auth and STT failures propagate without fallback',async()=>{for(const code of ['AUTH_ERROR','STT_ERROR','NETWORK_ERROR']){const r=await invoke({google:async()=>{throw Object.assign(new Error(code),{code});}});assert.equal(r.body.error,code);}});
test('Vercel binary body helper accepted without base64 JSON',async()=>{const r=await invoke({contentType:'application/octet-stream'});assert.equal(r.statusCode,200);});
test('server deadline returns TIMEOUT even if upstream never resolves',async()=>{const req=Readable.from([audio]);req.method='POST';req.headers={'content-type':'audio/wav'};req.url='/api/voice/transcribe?language=ka&mode=quiet&sessionId=timeout-session-12345678';const res={setHeader(){},end(body){this.body=JSON.parse(body);}};await createHandler({validateConfig:()=>({name:'google',provider:'google-stt-v2',model:'chirp_2',region:'europe-west4'}),authorize:async()=> 'timeout-user',recognize:()=>new Promise(()=>{}),timeoutMs:10})(req,res);assert.equal(res.statusCode,504);assert.equal(res.body.error,'TIMEOUT');});
