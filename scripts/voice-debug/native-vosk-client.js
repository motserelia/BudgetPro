// Only staged into the independent offline Android debug build. No network or audio files.
(function(root,install){if(typeof module==='object'&&module.exports)module.exports=install;else install(root);})(globalThis,function(root){
 'use strict';
 const g=root.BudgetPROVoiceDebug,voice=root.BudgetPROVoiceModule;
 if(g?.buildRevision!==4||!g.guardReady||!g.saveBlocked||!g.localOnly||voice?.protocolVersion!==3||!root.Capacitor?.isNativePlatform?.())throw Error('VOSK_DEBUG_REQUIRED');
 const methods=['initialize','transcribe','release','cancel','selfTest'];
 const bridgeError=()=>{const p=root.Capacitor?.Plugins?.BudgetPROVoskDebug;return !p?'VOSK_NATIVE_PLUGIN_UNAVAILABLE':methods.some(n=>typeof p[n]!=='function')?'VOSK_NATIVE_PLUGIN_INVALID':null;};
 const native=()=>{const error=bridgeError();if(error)throw code(error);return root.Capacitor.Plugins.BudgetPROVoskDebug;};
 let ready=false,armed=false,consumed=false,busy=false,generation=0,cancelRequested=false,state='READY',attemptId=null,results=[];
 const completed=new WeakSet();
 const valid=()=>g.guardReady&&!bridgeError()&&root.BudgetPROVoiceModule===voice&&root.VoiceApiClient===client&&root.BudgetPROLocalWavCapture===capture;
 const code=(name)=>Object.assign(Error(name),{code:name});
 const diag=(id,patch)=>root.VoiceDiagnostics.update(patch,id);
 const show=text=>root.document?.querySelectorAll('#voiceOverlay [data-status]').forEach(e=>{e.textContent=text;});
 const safeCode=(e,fallback)=>/^VOSK_[A-Z_]+$/.test(e?.code||e?.message||'')?e.code||e.message:fallback;
 const cancelNative=()=>{generation++;ready=false;armed=false;if(!cancelRequested&&!bridgeError()){cancelRequested=true;Promise.resolve().then(()=>native().cancel()).catch(()=>{});}};
 const control=async(method)=>{
  if(busy||voice.isActive())throw code('VOSK_BUSY');
  busy=true;ready=false;armed=false;cancelRequested=false;const epoch=++generation;
  try{const r=await native()[method]();if(generation!==epoch)throw code('VOSK_CANCELLED');if(method==='initialize'){if(r.offline!==true||r.model!=='vosk-model-small-ka-0.42')throw code('VOSK_BAD_RESPONSE');ready=true;}return r;}
  catch(e){ready=false;const c=safeCode(e,method==='initialize'?'VOSK_INITIALIZATION_FAILED':'VOSK_LOCAL_ERROR');show(c+' — локальный Vosk недоступен; облачный fallback отключён.');throw code(c);}
  finally{busy=false;}
 };
 const test=Object.freeze({
  prepare:()=>control('initialize'),
  selfTest:()=>control('selfTest'),
  arm(){return capture.arm();},
  history:()=>results.map(r=>JSON.parse(JSON.stringify(r))),
  release:()=>control('release'),
  status:()=>({...capture.status(),provider:'vosk-android-offline',model:'vosk-model-small-ka-0.42',nativeReady:ready&&!bridgeError(),bridgeReady:!bridgeError(),bridgeError:bridgeError()}),
 });
 const capture=Object.freeze({
  status:()=>({protocolVersion:3,buildRevision:4,localOnly:true,installed:valid(),state,armed,consumed,busy,captured:false,exported:false,bytes:0,attemptId}),
  canStart:()=>valid()&&ready&&armed&&!consumed&&!busy,
  arm(){if(!valid()||!ready||consumed||busy||armed||voice.isActive())throw code('VOSK_NOT_READY_OR_USED');armed=true;return capture.status();},
  begin(id){if(!capture.canStart()||!/^[a-f0-9-]{36}$/i.test(id||''))throw code('VOSK_NOT_ARMED');armed=false;consumed=true;cancelRequested=false;attemptId=id;state='RECORDING';},
  cancel(id){if(id===attemptId){state='CANCELLED';cancelNative();}},
  fail(id){if(id===attemptId){state='ERROR';cancelNative();}},
  isCompletion:(r,id)=>completed.has(r)&&id===attemptId&&state==='CAPTURE_COMPLETE',
  discard(){armed=false;},
 });
 const client=Object.freeze({async transcribe({wav,language,sessionId,signal}){
  if(!valid()||state!=='RECORDING'||sessionId!==attemptId||busy||language!=='ka')throw code('VOSK_NOT_ARMED');
  busy=true;let timer,last=root.performance?.now?.()||Date.now(),maxLag=0;
  const aborted=cancelNative;signal?.addEventListener('abort',aborted,{once:true});
  try{
   if(signal?.aborted)throw code('VOSK_CANCELLED');
   // Validation repeats the proven local WAV validator boundaries before the bridge.
   const v=new DataView(wav);if(wav.byteLength<7084||wav.byteLength>960044||v.getUint32(0,true)!==0x46464952||v.getUint32(8,true)!==0x45564157||v.getUint16(20,true)!==1||v.getUint16(22,true)!==1||v.getUint32(24,true)!==16000||v.getUint16(34,true)!==16||v.getUint32(40,true)!==wav.byteLength-44)throw code('VOSK_INVALID_WAV');
   const bytes=new Uint8Array(wav);let binary='';for(let p=0;p<bytes.length;p+=32768)binary+=String.fromCharCode(...bytes.subarray(p,p+32768));
   if(root.setInterval)timer=root.setInterval(()=>{const n=root.performance?.now?.()||Date.now();maxLag=Math.max(maxLag,n-last-50);last=n;},50);
   const start=root.performance?.now?.()||Date.now();
   const response=await native().transcribe({wavBase64:root.btoa(binary)});binary='';
   if(signal?.aborted||state!=='RECORDING')throw code('VOSK_CANCELLED');
   if(response.offline!==true||response.model!=='vosk-model-small-ka-0.42')throw code('VOSK_BAD_RESPONSE');
   const raw=typeof response.transcript==='string'?response.transcript:'';
   diag(sessionId,{provider:'vosk-android-offline',model:'vosk-model-small-ka-0.42',rawTranscript:raw,asrStatus:raw.trim()?'success':'empty',requestStatus:'not_sent',httpStatus:null});
   if(!raw.trim())throw code('VOSK_EMPTY_TRANSCRIPT');
   let financial=null,parseError=null;
   try{
    const normalized=root.BudgetPROVoiceNumberNormalizer.normalizeNumbers(raw,'ka');
    const d=root.buildVoiceDraftFromText(normalized);
    financial={normalizedTranscript:normalized,type:d.type,amount:Number.isFinite(d.amount)?d.amount:null,category:d.category||'',configuredCurrency:typeof displayCurrency!=='undefined'?displayCurrency:(root.displayCurrency||null),parserCurrency:d.currency||null};
    diag(sessionId,{normalizedTranscript:normalized,parserInput:normalized,financialParseStatus:financial.amount>0?'success':'incomplete',financialParseError:financial.amount>0?null:'AMOUNT_NOT_DETERMINED'});
   }catch{parseError='FINANCIAL_PARSE_FAILED';diag(sessionId,{financialParseStatus:'failed',financialParseError:parseError});}
   results.push({attemptId,rawTranscript:raw,financial,parseError,metrics:{...response,transcript:undefined,bridgeAndRecognitionMs:(root.performance?.now?.()||Date.now())-start,maxObservedUiLagMs:Math.max(0,maxLag)},operationSaved:false});if(results.length>10)results.shift();
   state='CAPTURE_COMPLETE';const result=Object.freeze({localCaptureComplete:true,sessionId});completed.add(result);
   root.setTimeout(()=>show('Vosk (offline): '+raw+(financial?.amount>0?'':' — сумма требует уточнения. Не сохраняйте операцию.')),0);
   return result;
  }catch(e){state=signal?.aborted?'CANCELLED':'ERROR';ready=false;const c=/^VOSK_[A-Z_]+$/.test(e.code||e.message||'')?e.code||e.message:'VOSK_LOCAL_ERROR';diag(sessionId,{error:c,errorPhase:'stt',asrStatus:c==='VOSK_EMPTY_TRANSCRIPT'?'empty':'failed',requestStatus:'not_sent'});root.setTimeout(()=>show(c+' — локальное распознавание недоступно; облачный fallback отключён.'),0);throw code(c);}
  finally{if(timer)root.clearInterval(timer);signal?.removeEventListener('abort',aborted);new Uint8Array(wav).fill(0);ready=false;try{await native().release();const r=results[results.length-1];if(r?.attemptId===sessionId)r.metrics.resourcesReleased=true;}catch{const r=results[results.length-1];if(r?.attemptId===sessionId)r.metrics.resourcesReleased=false;}busy=false;}
 }});
 root.document?.addEventListener?.('visibilitychange',()=>{if(root.document.hidden){if(busy||voice.isActive())cancelNative();else{generation++;armed=false;ready=false;if(!bridgeError())native().release().catch(()=>{});}}});
 root.VoiceApiClient=client;root.BudgetPROLocalWavCapture=capture;root.BudgetPROVoskDebugTest=test;
 return test;
});
