'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const install=require('../../www/voice/voice-whisper-client');
const {wav}=require('../../www/voice/pcm');
function fixture({native,server,platform=true}={}){
 let calls=0,released=0,cancelled=0,network=0,options;
 const plugin=native||{async initialize(){return {offline:true,model:'ggml-small-q5_1'};},async transcribe(o){calls++;options=o;return {offline:true,model:'ggml-small-q5_1',transcript:'ყავაში რვა ლარი გადავიხადე',detectedLanguage:'ka',recognitionMs:1250};},async cancel(){cancelled++;},async release(){released++;}};
 const root={Capacitor:{isNativePlatform:()=>platform,getPlatform:()=>'android',Plugins:{BudgetPROWhisper:plugin}},VoiceApiClient:server||{async transcribe(){network++;throw Error('FORBIDDEN');}},btoa:s=>Buffer.from(s,'binary').toString('base64'),setTimeout:(fn,ms)=>setTimeout(fn,ms),clearTimeout:id=>clearTimeout(id)};
 const client=install(root),id='12345678-1234-4234-8234-123456789abc';
 const send=(extra={})=>client.transcribe({wav:wav(new Float32Array(16000)),language:'ka',mode:'auto',sessionId:id,token:'must-not-leak',hints:['private'],...extra});
 return {root,client,plugin,id,send,stats:()=>({calls,released,cancelled,network,options})};
}
test('native Whisper returns an offline transcript and releases the engine; no HTTP or hints',async()=>{
 const s=fixture(),w=wav(new Float32Array(16000)),original=Buffer.from(new Uint8Array(w));
 const r=await s.client.transcribe({wav:w,language:'ka',mode:'auto',sessionId:s.id,token:'must-not-leak',hints:['private']});
 assert.equal(r.ok,true);assert.equal(r.provider,'whisper-android-offline');assert.equal(r.model,'ggml-small-q5_1');
 assert.equal(r.detectedLanguage,'ka');assert.equal(r.requestedLanguage,'ka');assert.equal(r.transcript,'ყავაში რვა ლარი გადავიხადე');
 assert.equal(typeof r.responseTime,'number');assert.equal(r.responseTime>=0,true);assert.equal(r.sessionId,s.id);
 assert.equal(s.stats().calls,1);assert.equal(s.stats().released,1);assert.equal(s.stats().network,0);
 assert.deepEqual(Object.keys(s.stats().options),['language','wavBase64']);
 assert.equal(Buffer.from(s.stats().options.wavBase64,'base64').equals(original),true);
 assert.equal(new Uint8Array(w).some(Boolean),false);
 assert(!JSON.stringify(r).includes('must-not-leak'));
});
test('non-native platform delegates to the existing server client and never touches the plugin',async()=>{
 let forwarded;const server={async transcribe(o){forwarded=o;return {ok:true,transcript:'Coffee eight lari',provider:'server',model:'m'};}};
 const s=fixture({platform:false,server});const w=wav(new Float32Array(16000));
 const r=await s.client.transcribe({wav:w,language:'ka',token:'t',signal:new AbortController().signal});
 assert.equal(r.provider,'server');assert.equal(forwarded.wav,w);assert.equal(s.stats().calls,0);assert.equal(s.stats().released,0);
});
test('invalid WAV is rejected before the native call and the buffer is cleared',async()=>{
 const s=fixture(),w=wav(new Float32Array(16000));new DataView(w).setUint32(24,48000,true);
 await assert.rejects(s.send({wav:w}),/INVALID_PCM/);assert.equal(s.stats().calls,0);assert.equal(new Uint8Array(w).some(Boolean),false);
 await assert.rejects(s.send({wav:new ArrayBuffer(44)}),/INVALID_PCM/);assert.equal(s.stats().calls,0);
});
test('empty recognition maps to EMPTY_TRANSCRIPT and stays distinct from a failure',async()=>{
 const s=fixture({native:{async transcribe(){return {offline:true,model:'ggml-small-q5_1',transcript:'   '};},async release(){},async cancel(){},async initialize(){}}});
 await assert.rejects(s.send(),/EMPTY_TRANSCRIPT/);
});
test('language and model guards reject unsupported input without recognition',async()=>{
 const s=fixture();assert.equal(s.client.supportsLanguage('auto'),true);assert.equal(s.client.supportsLanguage('ka'),true);assert.equal(s.client.supportsLanguage('de'),false);
 await assert.rejects(s.send({language:'de'}),/WHISPER_LANGUAGE_REQUIRED/);assert.equal(s.stats().calls,0);
 for(const bad of [{offline:false,model:'ggml-small-q5_1',transcript:'x'},{offline:true,model:'other',transcript:'x'},{offline:true,model:'ggml-small-q5_1'}]){
  const t=fixture({native:{async transcribe(){return bad;},async release(){},async cancel(){},async initialize(){}}});await assert.rejects(t.send(),/RECOGNIZER_FAILED/);
 }
});
test('native error codes are mapped to the existing UI contract',async()=>{
 const cases={WHISPER_LOW_MEMORY:'MODEL_LOAD_FAILED',WHISPER_MODEL_NOT_FOUND:'MODEL_NOT_FOUND',WHISPER_INVALID_WAV:'INVALID_PCM',WHISPER_CANCELLED:'RECORDING_INTERRUPTED',WHISPER_TIMEOUT:'TIMEOUT',WHISPER_INFERENCE_FAILED:'RECOGNIZER_FAILED',WHISPER_BUSY:'WHISPER_BUSY',SOMETHING_ELSE:'RECOGNIZER_FAILED'};
 for(const [native,expected] of Object.entries(cases)){
  const s=fixture({native:{async transcribe(){throw Object.assign(Error(native),{code:native});},async release(){},async cancel(){},async initialize(){}}});
  await assert.rejects(s.send(),new RegExp(expected));
 }
});
test('a missing or incomplete native bridge fails closed',async()=>{
 const s=fixture();delete s.root.Capacitor.Plugins.BudgetPROWhisper;
 await assert.rejects(s.send(),/WHISPER_NATIVE_UNAVAILABLE/);
 s.root.Capacitor.Plugins.BudgetPROWhisper={async transcribe(){throw Error('MUST_NOT_CALL');}};
 await assert.rejects(s.send(),/WHISPER_NATIVE_UNAVAILABLE/);
});
test('cancellation aborts the native request and never resolves with a transcript',async()=>{
 const s=fixture({native:{async transcribe(){return new Promise(()=>{});},async release(){},async cancel(){},async initialize(){}}});
 const controller=new AbortController(),p=s.send({signal:controller.signal});
 controller.abort();await assert.rejects(p,/RECORDING_INTERRUPTED/);
});
test('concurrent Whisper recognition is rejected as busy',async()=>{
 const s=fixture({native:{async transcribe(){return new Promise(()=>{});},async release(){},async cancel(){},async initialize(){}}});
 const controller=new AbortController(),first=s.send({signal:controller.signal});
 await assert.rejects(s.send(),/WHISPER_BUSY/);controller.abort();await assert.rejects(first,/RECORDING_INTERRUPTED/);
});
