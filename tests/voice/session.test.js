const test = require('node:test'), assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs'), crypto = require('node:crypto');
const validator = require('../../www/voice/transcript-validator'), numbers = require('../../www/voice/number-normalizer');
function setup({transcribe}={}) {
 let starts=0,closed=0,diags={},requestResolve,recorder,onVisibility;
 const values=new Map();
 class Recorder { constructor(mode,frame){this.mode=mode;this.frame=frame;recorder=this;}async start(){starts++;}async close(){closed++;}async finish(){await this.close();return {wav:new ArrayBuffer(44),metrics:{duration:500}};} }
 const ctx = { document:{hidden:false,addEventListener(type,fn){if(type==='visibilitychange')onVisibility=fn;}}, localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}, crypto, navigator:{onLine:true}, console, setTimeout, clearTimeout, AbortController, VoiceRecorder:Recorder, VoiceTranscriptValidator:validator, BudgetPROVoiceNumberNormalizer:numbers, VoiceDiagnostics:{begin:d=>diags=d,update:d=>Object.assign(diags,d),get:()=>diags,retain(){},discard(){}}, VoiceApiClient:{transcribe:transcribe||(()=>new Promise(r=>requestResolve=r))} };
 vm.runInNewContext(fs.readFileSync('www/voice/voice-session.js','utf8'),ctx);
 return {voice:ctx.BudgetPROVoiceModule,ctx,values,counts:()=>({starts,closed}),hide:()=>{ctx.document.hidden=true;onVisibility();},frame:m=>recorder.frame(m),resolve:r=>requestResolve(r),diags:()=>diags};
}
const tick=()=>new Promise(r=>setImmediate(r));
test('double start and cancellation clean capture and return ready',async()=>{const s=setup();let state;s.voice.subscribe(v=>state=v);const pending=s.voice.start({token:'test'});assert.equal((await s.voice.start({token:'test'})).busy,true);await tick();assert.equal(s.counts().starts,1);s.voice.cancel();assert.equal((await pending).cancelled,true);assert.equal(s.voice.isActive(),false);assert.equal(state.status,'ready');assert.equal(s.counts().closed,1);});
test('cancel during pending API aborts and ignores late result',async()=>{let signal;const s=setup({transcribe:options=>{signal=options.signal;return new Promise(r=>s.resolveApi=r);}});let transcripts=0;const p=s.voice.start({token:'test',onTranscript:()=>transcripts++});await tick();s.voice.stop();await tick();assert.ok(signal);s.voice.cancel();assert.equal(signal.aborted,true);s.resolveApi({transcript:'Coffee eight lari',detectedLanguage:'en-US'});await tick();assert.equal(transcripts,0);await p;});
test('Georgian is fixed despite Russian UI; rejects Cyrillic before parser',async()=>{let language,callbacks=0;const s=setup({transcribe:async options=>{language=options.language;return {transcript:'Кофе восемь лари',detectedLanguage:'ru-RU'};}});s.ctx.currentLang='ru';s.voice.setLanguage('ka');const p=s.voice.start({token:'test',onTranscript:()=>callbacks++});await tick();s.voice.stop();const result=await p;assert.equal(language,'ka');assert.equal(result.error,'invalid-script');assert.equal(callbacks,0);});
test('auto uses real Google detectedLanguage for number normalization',async()=>{const s=setup({transcribe:async()=>({transcript:'ყავა რვა ლარი',detectedLanguage:'ka-GE'})});s.ctx.currentLang='ru';const p=s.voice.start({token:'test'});await tick();s.voice.stop();assert.equal((await p).text,'ყავა 8 ლარი');});
test('migrates old modes without changing user financial storage',()=>{const s=setup();s.values.set('budgetpro_voice_mode','whisper');s.values.set('transactions','keep');assert.equal(s.voice.getMode(),'quiet');s.values.set('budgetpro_voice_mode','street');assert.equal(s.voice.getMode(),'noise');assert.equal(s.values.get('transactions'),'keep');});
test('offline and unauthorized sessions do not capture',async()=>{const s=setup();s.ctx.navigator.onLine=false;assert.equal((await s.voice.start({token:'test'})).error,'OFFLINE');s.ctx.navigator.onLine=true;assert.equal((await s.voice.start()).error,'VOICE_AUTH_REQUIRED');assert.equal(s.counts().starts,0);});

test('pending auth refresh is cancellable and cannot create two captures',async()=>{const s=setup();let resolveToken;const p=s.voice.start({getToken:()=>new Promise(r=>resolveToken=r)});await tick();assert.equal((await s.voice.start({token:'test'})).busy,true);s.voice.cancel();resolveToken('late-token');await tick();assert.equal(s.counts().starts,0);assert.equal((await p).cancelled,true);});

test('auth check precedes permission and stop cannot process audio before capture starts',async()=>{
 const s=setup();let resolveToken,state;const statuses=[];s.voice.subscribe(v=>{state=v;statuses.push(v.status);});
 const p=s.voice.start({getToken:()=>new Promise(r=>resolveToken=r)});await tick();
 assert.equal(state.status,'authenticating');s.voice.stop();assert.equal(state.status,'authenticating');assert.equal(s.counts().starts,0);
 resolveToken('test');await tick();assert.ok(statuses.indexOf('requesting')>statuses.indexOf('authenticating'));assert.equal(state.status,'listening');s.voice.cancel();await p;
});
test('measured PCM levels drive the meter; silence and cancellation reset it',async()=>{
 const s=setup();let state;s.voice.subscribe(v=>state=v);const p=s.voice.start({token:'test'});await tick();
 s.frame({rms:.09,peak:.4,speech:true,elapsed:500});assert.ok(state.meter>0);
 s.frame({rms:0,peak:0,speech:false,elapsed:600});assert.equal(state.meter,0);
 s.voice.cancel();await p;assert.equal(state.meter,0);assert.equal(state.status,'ready');
});
test('double stop sends exactly one request; retry receives a new session and token',async()=>{
 let requests=0;const s=setup({transcribe:async()=>{requests++;throw Object.assign(new Error('network'),{code:'NETWORK_ERROR'});}});
 for(let i=0;i<2;i++){const p=s.voice.start({token:'test'+i});await tick();s.voice.stop();s.voice.stop();assert.equal((await p).error,'NETWORK_ERROR');assert.equal(s.voice.isActive(),false);}
 assert.equal(requests,2);assert.equal(s.counts().starts,2);
});

test('token expiring during capture is re-read before the single upload',async()=>{
 let authCalls=0,requests=0,token;const s=setup({transcribe:async options=>{requests++;token=options.token;return{transcript:'Coffee eight lari',detectedLanguage:'en-US'};}});
 const p=s.voice.start({getToken:async()=>++authCalls===1?'before-recording':'refreshed-after-recording'});await tick();s.voice.stop();await p;
 assert.equal(authCalls,2);assert.equal(requests,1);assert.equal(token,'refreshed-after-recording');assert.equal(s.counts().starts,1);
});

test('backgrounding cancels capture and returns ready without a request',async()=>{
 let requests=0;const s=setup({transcribe:async()=>{requests++;}});let state;s.voice.subscribe(v=>state=v);
 const pending=s.voice.start({token:'test'});await tick();s.hide();assert.equal((await pending).cancelled,true);
 assert.equal(s.counts().closed,1);assert.equal(requests,0);assert.equal(state.status,'ready');assert.equal(s.voice.isActive(),false);
});
