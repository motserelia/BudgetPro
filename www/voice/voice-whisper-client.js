// Android-only offline Whisper (whisper.cpp) provider. Audio never leaves the app process.
// Registers itself as VoiceWhisperClient and deliberately does NOT replace VoiceApiClient:
// voice-provider.js routes ru/en (and "auto") here when the device is offline.
(function(root, factory) {
  if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root);
})(globalThis,function(root){
 'use strict';
 const server=root.VoiceApiClient;
 // One multilingual ggml-small-q5_1 model serves ru, en, ka and "auto" (per-request language).
 const model='ggml-small-q5_1';
 const languages=Object.freeze(['ru','en','ka','auto']);
 let busy=false;
 const error=code=>Object.assign(new Error(code),{code});
 const isLocal=()=>root.Capacitor?.isNativePlatform?.()===true&&root.Capacitor?.getPlatform?.()==='android';
 const plugin=()=>{const p=root.Capacitor?.Plugins?.BudgetPROWhisper;if(!p||['initialize','transcribe','release','cancel'].some(k=>typeof p[k]!=='function'))throw error('WHISPER_NATIVE_UNAVAILABLE');return p;};
 const client={isLocal,model,supportsLanguage:language=>languages.includes(language),async transcribe(options){
  if(!isLocal())return server.transcribe(options);
  if(busy)throw error('WHISPER_BUSY');
  const {wav,language,signal,sessionId}=options;
  if(!languages.includes(language))throw error('WHISPER_LANGUAGE_REQUIRED');
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
    // The native plugin enforces 120 s itself; stop the JS wait first so the UI reports TIMEOUT.
    timer=root.setTimeout(()=>{Promise.resolve().then(()=>p.cancel()).catch(()=>{});reject(error('TIMEOUT'));},115000);
   });
   if(signal?.aborted)aborted();
   const started=Date.now();const pending=signal?.aborted?cancellation:p.transcribe({language,wavBase64:root.btoa(binary)});binary='';
   const response=await Promise.race([pending,cancellation]);
   if(signal?.aborted)throw error('RECORDING_INTERRUPTED');
   if(response?.offline!==true||response.model!==model||typeof response.transcript!=='string')throw error('RECOGNIZER_FAILED');
   if(!response.transcript.trim())throw error('EMPTY_TRANSCRIPT');
   const detected=typeof response.detectedLanguage==='string'&&response.detectedLanguage.trim()?response.detectedLanguage:language;
   return {ok:true,sessionId,requestedLanguage:language,detectedLanguage:detected,provider:'whisper-android-offline',model:response.model,transcript:response.transcript,responseTime:Date.now()-started,recognitionTime:Number.isFinite(response.recognitionMs)?response.recognitionMs:null};
  }catch(e){
   const aliases={WHISPER_INVALID_WAV:'INVALID_PCM',WHISPER_MODEL_NOT_FOUND:'MODEL_NOT_FOUND',WHISPER_MODEL_LOAD_FAILED:'MODEL_LOAD_FAILED',WHISPER_MODEL_FAILED:'MODEL_LOAD_FAILED',WHISPER_MODEL_INTEGRITY:'MODEL_LOAD_FAILED',WHISPER_STORAGE_LOW:'MODEL_LOAD_FAILED',WHISPER_LOW_MEMORY:'MODEL_LOAD_FAILED',WHISPER_CANCELLED:'RECORDING_INTERRUPTED',WHISPER_TIMEOUT:'TIMEOUT',WHISPER_RECOGNIZER_FAILED:'RECOGNIZER_FAILED',WHISPER_INFERENCE_FAILED:'RECOGNIZER_FAILED',WHISPER_BAD_RESPONSE:'RECOGNIZER_FAILED',WHISPER_INPUT_OR_SERVICE_ERROR:'RECOGNIZER_FAILED',WHISPER_BIND_FAILED:'WHISPER_NATIVE_UNAVAILABLE',WHISPER_PROCESS_STOPPED:'RECOGNIZER_FAILED',WHISPER_DEBUG_ONLY:'WHISPER_NATIVE_UNAVAILABLE',WHISPER_BUSY:'WHISPER_BUSY',WHISPER_LANGUAGE_REQUIRED:'WHISPER_LANGUAGE_REQUIRED',WHISPER_NATIVE_UNAVAILABLE:'WHISPER_NATIVE_UNAVAILABLE'};
   const name=e?.code||e?.message;throw error(aliases[name]||(['INVALID_PCM','EMPTY_TRANSCRIPT','RECORDING_INTERRUPTED','TIMEOUT','WHISPER_NATIVE_UNAVAILABLE','WHISPER_BUSY','WHISPER_LANGUAGE_REQUIRED'].includes(name)?name:'RECOGNIZER_FAILED'));
  }finally{
   root.clearTimeout(timer);signal?.removeEventListener('abort',aborted);
   if(wav instanceof ArrayBuffer)new Uint8Array(wav).fill(0);
   // Bound cleanup without allowing an unhandled late native rejection.
   let cleanupTimer;try{await Promise.race([Promise.resolve().then(()=>p.release()),new Promise((_,reject)=>{cleanupTimer=root.setTimeout(()=>reject(error('TIMEOUT')),5000);})]);}catch{}finally{root.clearTimeout(cleanupTimer);busy=false;}
  }
 }};
 root.VoiceWhisperClient=client;return client;
});
