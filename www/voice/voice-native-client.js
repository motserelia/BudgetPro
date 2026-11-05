// Android-only offline provider. Never forwards audio, auth tokens or financial hints to a server.
(function(root, factory) {
  if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root);
})(globalThis,function(root){
 'use strict';
 const server=root.VoiceApiClient;
 const models=Object.freeze({ka:'vosk-model-small-ka-0.42',ru:'vosk-model-small-ru-0.22',en:'vosk-model-small-en-us-0.15'});
 let busy=false;
 const error=code=>Object.assign(new Error(code),{code});
 const isLocal=()=>root.Capacitor?.isNativePlatform?.()===true&&root.Capacitor?.getPlatform?.()==='android';
 const plugin=()=>{const p=root.Capacitor?.Plugins?.BudgetPROVosk;if(!p||['initialize','transcribe','release','cancel'].some(k=>typeof p[k]!=='function'))throw error('VOSK_NATIVE_UNAVAILABLE');return p;};
 const client={isLocal,async transcribe(options){
  if(!isLocal())return server.transcribe(options);
  if(busy)throw error('VOSK_BUSY');
  const {wav,language,signal,sessionId}=options;
  if(!Object.hasOwn(models,language))throw error('VOSK_LANGUAGE_REQUIRED');
  const p=plugin();busy=true;let timer,aborted;
  try{
   if(signal?.aborted)throw error('RECORDING_INTERRUPTED');
   if(!(wav instanceof ArrayBuffer))throw error('INVALID_PCM');
   const v=new DataView(wav);
   if(wav.byteLength<7084||wav.byteLength>960044||v.getUint32(0,true)!==0x46464952||v.getUint32(8,true)!==0x45564157||v.getUint32(12,true)!==0x20746d66||v.getUint32(16,true)!==16||v.getUint32(4,true)!==wav.byteLength-8||v.getUint16(20,true)!==1||v.getUint16(22,true)!==1||v.getUint32(24,true)!==16000||v.getUint32(28,true)!==32000||v.getUint16(32,true)!==2||v.getUint16(34,true)!==16||v.getUint32(36,true)!==0x61746164||v.getUint32(40,true)!==wav.byteLength-44||(wav.byteLength-44)%2)throw error('INVALID_PCM');
   const bytes=new Uint8Array(wav);let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
   const cancellation=new Promise((_,reject)=>{
    aborted=()=>{Promise.resolve().then(()=>p.cancel()).catch(()=>{});reject(error('RECORDING_INTERRUPTED'));};
    signal?.addEventListener('abort',aborted,{once:true});
    timer=root.setTimeout(()=>{Promise.resolve().then(()=>p.cancel()).catch(()=>{});reject(error('TIMEOUT'));},45000);
   });
   if(signal?.aborted)aborted();
   const started=Date.now();const pending=signal?.aborted?cancellation:p.transcribe({language,wavBase64:root.btoa(binary)});binary='';
   const response=await Promise.race([pending,cancellation]);
   if(signal?.aborted)throw error('RECORDING_INTERRUPTED');
   if(response?.offline!==true||response.model!==models[language]||typeof response.transcript!=='string')throw error('RECOGNIZER_FAILED');
   if(!response.transcript.trim())throw error('EMPTY_TRANSCRIPT');
   return {ok:true,sessionId,requestedLanguage:language,detectedLanguage:language,provider:'vosk-android-offline',model:response.model,transcript:response.transcript,responseTime:Date.now()-started};
  }catch(e){
   const aliases={VOSK_INVALID_WAV:'INVALID_PCM',VOSK_MODEL_NOT_FOUND:'MODEL_NOT_FOUND',VOSK_MODEL_FAILED:'MODEL_LOAD_FAILED',VOSK_MODEL_LOAD_FAILED:'MODEL_LOAD_FAILED',VOSK_MODEL_INTEGRITY:'MODEL_LOAD_FAILED',VOSK_CANCELLED:'RECORDING_INTERRUPTED',VOSK_TIMEOUT:'TIMEOUT',VOSK_RECOGNIZER_FAILED:'RECOGNIZER_FAILED',VOSK_NATIVE_UNAVAILABLE:'VOSK_NATIVE_UNAVAILABLE',VOSK_LOW_MEMORY:'MODEL_LOAD_FAILED',VOSK_STORAGE_LOW:'MODEL_LOAD_FAILED',VOSK_BUSY:'VOSK_BUSY'};
   const name=e?.code||e?.message;throw error(aliases[name]||(['INVALID_PCM','EMPTY_TRANSCRIPT','RECORDING_INTERRUPTED','TIMEOUT'].includes(name)?name:'RECOGNIZER_FAILED'));
  }finally{
   root.clearTimeout(timer);signal?.removeEventListener('abort',aborted);
   if(wav instanceof ArrayBuffer)new Uint8Array(wav).fill(0);
   // Bound cleanup without allowing an unhandled late native rejection.
   let cleanupTimer;try{await Promise.race([Promise.resolve().then(()=>p.release()),new Promise((_,reject)=>{cleanupTimer=root.setTimeout(()=>reject(error('TIMEOUT')),5000);})]);}catch{}finally{root.clearTimeout(cleanupTimer);busy=false;}
  }
 }};
 root.VoiceApiClient=client;return client;
});
