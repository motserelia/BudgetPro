'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),install=require('../../www/voice/voice-native-client'),{wav}=require('../../www/voice/pcm'),safety=require('../../www/voice/voice-draft-safety');
function setup({text='ყავაში რვა ლარი გადავიხადე',fail='',platform='android'}={}){
 let calls=0,releases=0,cancels=0,remote=0,parameters;
 const native={initialize:async()=>({}),transcribe:async o=>{calls++;parameters=o;if(fail)throw Object.assign(Error('private native detail'),{code:fail});return{offline:true,model:o.language==='ru'?'vosk-model-small-ru-0.22':'vosk-model-small-ka-0.42',transcript:text};},release:async()=>{releases++},cancel:async()=>{cancels++}};
 const root={Capacitor:{isNativePlatform:()=>platform!=='web',getPlatform:()=>platform,Plugins:{BudgetPROVosk:native}},VoiceApiClient:{transcribe:async()=>{remote++;return 'existing-server'}},setTimeout,clearTimeout,btoa:s=>Buffer.from(s,'binary').toString('base64')};
 const api=install(root);return{api,native,root,stats:()=>({calls,releases,cancels,remote,parameters}),send:(language='ka',options={})=>api.transcribe({language,wav:wav(new Float32Array(16000)),sessionId:'fixture',signal:new AbortController().signal,token:'MUST_NOT_LEAK',hints:['PRIVATE_FINANCE'],...options})};
}
for(const language of ['ka','ru'])test('offline '+language+' returns real bridge result; repeats without a one-shot gate',async()=>{const s=setup({text:language==='ru'?'Потратил восемь лари на кофе':'ყავაში რვა ლარი გადავიხადე'});for(let i=0;i<3;i++){const r=await s.send(language);assert.equal(r.provider,'vosk-android-offline');assert.equal(r.sessionId,'fixture');}assert.equal(s.stats().calls,3);assert.equal(s.stats().releases,3);assert.equal(s.stats().remote,0);assert.deepEqual(Object.keys(s.stats().parameters).sort(),['language','wavBase64']);});
test('web retains existing authenticated server adapter',async()=>{const s=setup({platform:'web'});assert.equal(await s.send(),'existing-server');assert.equal(s.stats().remote,1);assert.equal(s.stats().calls,0)});
for(const language of ['auto','en',undefined])test('unsupported '+language+' never captures cloud fallback',async()=>{const s=setup();await assert.rejects(s.send(language===undefined?null:language),/LANGUAGE_REQUIRED/);assert.equal(s.stats().remote,0);assert.equal(s.stats().calls,0)});
for(const [native,expected]of [['VOSK_MODEL_NOT_FOUND','MODEL_NOT_FOUND'],['VOSK_MODEL_LOAD_FAILED','MODEL_LOAD_FAILED'],['VOSK_INVALID_WAV','INVALID_PCM'],['VOSK_TIMEOUT','TIMEOUT'],['unknown','RECOGNIZER_FAILED']])test(native+' sanitized and resources released',async()=>{const s=setup({fail:native});const b=wav(new Float32Array(16000));await assert.rejects(s.send('ka',{wav:b}),new RegExp(expected));assert.equal(s.stats().calls,1);assert.equal(s.stats().remote,0);assert.equal(s.stats().releases,1);assert(new Uint8Array(b).every(x=>x===0));});
test('empty result never becomes financial data',async()=>{const s=setup({text:''});await assert.rejects(s.send(),/EMPTY_TRANSCRIPT/);assert.equal(s.stats().calls,1);});
test('invalid WAV never reaches native',async()=>{const s=setup();await assert.rejects(s.send('ru',{wav:new ArrayBuffer(9)}),/INVALID_PCM/);assert.equal(s.stats().calls,0);assert.equal(s.stats().releases,1);});
test('late result after cancellation is rejected; no concurrent native call or fallback',async()=>{const s=setup();let resolve;s.native.transcribe=()=>new Promise(r=>resolve=r);const abort=new AbortController(),p=s.send('ka',{signal:abort.signal});await assert.rejects(s.send(),/BUSY/);abort.abort();await assert.rejects(p,/RECORDING_INTERRUPTED/);resolve({offline:true,model:'vosk-model-small-ka-0.42',transcript:'late'});assert.equal(s.stats().remote,0);assert.equal(s.stats().releases,1);});
test('real selected model must match language',async()=>{const s=setup();s.native.transcribe=async()=>({offline:true,model:'vosk-model-small-ka-0.42',transcript:'русский'});await assert.rejects(s.send('ru'),/RECOGNIZER_FAILED/)});
test('multiple operations and wrong currency refuse a misleading ready draft',()=>{
 assert.equal(safety.check('ყავაში 8 ლარი გადავიხადე','GEL').valid,true);
 assert.equal(safety.check('3 ლარი და 50 თეთრი გადავიხადე','GEL').valid,true);
 assert.equal(safety.check('50 თეთრი დავხარჯე','GEL').valid,true);
 assert.equal(safety.check('8 ლარი ყავა, 12 ლარი ტაქსი, 2500 ლარი ხელფასი','GEL').error,'VOICE_MULTIPLE_OPERATIONS');
 assert.equal(safety.check('Потратил 8 лари на кофе и 12 лари на такси','GEL').error,'VOICE_MULTIPLE_OPERATIONS');
 assert.equal(safety.check('8 ლარი','RUB').error,'VOICE_CURRENCY_MISMATCH');
 assert.equal(safety.check('8 USD и 12 EUR','USD').error,'VOICE_AMBIGUOUS_AMOUNT');
});
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
function localSession(language='ka'){
 const values=new Map([['voiceLanguage',language],['financial','UNCHANGED']]);let mic=0,send=0,token=0,recorder;
 const ctx={ArrayBuffer,document:{addEventListener(){}},localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},crypto,navigator:{onLine:false},console,setTimeout,clearTimeout,AbortController,VoiceTranscriptValidator:require('../../www/voice/transcript-validator'),BudgetPROVoiceNumberNormalizer:require('../../www/voice/number-normalizer'),VoiceDiagnostics:{begin(){},update(){},event(){},get(){return{}},retain(){},discard(){}},VoiceApiClient:{isLocal:()=>true,transcribe:async()=>{send++;return{transcript:language==='ru'?'Потратил восемь лари на кофе':'ყავაში რვა ლარი გადავიხადე',detectedLanguage:language,provider:'vosk-android-offline',model:'fixture'};}},VoiceRecorder:class{constructor(_,frame){recorder=this;this.frame=frame;}async start(){mic++}async close(){}async finish(){return{wav:new ArrayBuffer(44),metrics:{}}}}};
 vm.runInNewContext(fs.readFileSync('www/voice/voice-session.js','utf8'),ctx);
 return{voice:ctx.BudgetPROVoiceModule,values,frame:m=>recorder.frame(m),start:options=>ctx.BudgetPROVoiceModule.start({getToken(){token++;throw Error('AUTH_MUST_NOT_BE_TOUCHED')},...options}),stats:()=>({mic,send,token})};
}
for(const language of ['ka','ru'])test('session '+language+' works offline without auth refresh; VAD cannot truncate; no automatic saving',async()=>{
 const s=localSession(language);let results=0;
 for(let i=0;i<2;i++){const p=s.start({onTranscript:t=>{assert(t.includes('8'));results++;}});await new Promise(r=>setImmediate(r));s.frame({ended:true,elapsed:2000,rms:.05,peak:.2});await new Promise(r=>setImmediate(r));assert.equal(s.voice.isActive(),true);s.voice.stop();s.voice.stop();assert.equal((await p).error,undefined);}
 assert.deepEqual(s.stats(),{mic:2,send:2,token:0});assert.equal(results,2);assert.equal(s.values.get('financial'),'UNCHANGED');
});
test('local session refuses automatic language before microphone',async()=>{const s=localSession('auto');assert.equal((await s.start()).error,'VOSK_LANGUAGE_REQUIRED');assert.deepEqual(s.stats(),{mic:0,send:0,token:0});});

test('negative amounts, Russian minor units and multiple bare amounts are not guessed',()=>{
 for(const text of ['-8 ლარი','−8 ლარი','минус 8 лари','minus 8 GEL'])assert.equal(safety.check(text,'GEL').valid,false,text);
 assert.equal(safety.check('50 тетри','GEL').currency,'GEL');assert.equal(safety.check('50 копеек','GEL').error,'VOICE_CURRENCY_MISMATCH');
 assert.equal(safety.check('Потратил 8 на кофе и 12 на такси','GEL').error,'VOICE_MULTIPLE_OPERATIONS');
});

test('confirmed RU minor-unit failures use the same strict 1/100 amount parser as Georgian',()=>{
 const {fixture}=require('./helpers/finance-parser.cjs'),p=fixture('www/index.js',{lang:'ru'}),before=p.snapshot();
 for(const [text,amount]of [['Потратил пятьдесят тетри',.5],['Потратил три лари и пятьдесят тетри',3.5],['Потратил пятьдесят копеек',.5],['Потратил три рубля и пятьдесят копеек',3.5],['Получил две тысячи пятьсот лари',2500],['Потратил минус восемь лари',null]])assert.equal(p.draft(text,'ru').amount,amount,text);
 assert.equal(p.snapshot(),before);
});

test('production diagnostics never retain user transcript or WAV for export',()=>{
 const ctx={location:{hostname:'budgetpro.app'},crypto,URL:{createObjectURL(){throw Error('MUST_NOT_EXPORT')}},document:{},console};
 vm.runInNewContext(fs.readFileSync('www/voice/voice-diagnostics.js','utf8'),ctx);ctx.VoiceDiagnostics.begin({sessionId:'fixture'});ctx.VoiceDiagnostics.update({rawTranscript:'PRIVATE_RECORDED_SPEECH',normalizedTranscript:'PRIVATE_NORMALIZED',parserInput:'PRIVATE_INPUT'});const text=ctx.VoiceDiagnostics.format();for(const value of ['PRIVATE_RECORDED_SPEECH','PRIVATE_NORMALIZED','PRIVATE_INPUT'])assert.equal(text.includes(value),false);ctx.VoiceDiagnostics.retain(new ArrayBuffer(44));ctx.VoiceDiagnostics.save();
});
test('missing offline JS adapter on Android cannot silently use the cloud',async()=>{
 let calls=0;const ctx={Capacitor:{isNativePlatform:()=>true,getPlatform:()=> 'android'},document:{addEventListener(){}},localStorage:{getItem:k=>k==='voiceLanguage'?'ka':null},crypto,navigator:{onLine:true},console,setTimeout,clearTimeout,AbortController,VoiceDiagnostics:{begin(){},update(){},event(){},get(){return{}},discard(){}},VoiceApiClient:{transcribe:async()=>{calls++}},VoiceRecorder:class{async start(){calls++}async close(){}}};vm.runInNewContext(fs.readFileSync('www/voice/voice-session.js','utf8'),ctx);assert.equal((await ctx.BudgetPROVoiceModule.start({getToken(){calls++}})).error,'VOSK_NATIVE_UNAVAILABLE');assert.equal(calls,0);
});

test('currency units do not confuse a shirt with rubles and unsupported minor units fail closed',()=>{
 assert.equal(safety.check('Купил рубашку за 8 лари','GEL').valid,true);
 assert.equal(safety.check('8 ლარს ვიხდი','RUB').error,'VOICE_CURRENCY_MISMATCH');
 assert.equal(safety.check('50 центов','GEL').valid,false);
});
