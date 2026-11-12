// Hybrid routing (Э2): the cloud ASR is the most accurate provider, the packaged
// engines are the offline route. This module only decides which engine runs; it
// never records audio, never touches storage and never sends anything by itself.
(function(root, factory) {
  if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root);
})(globalThis,function(root){
 'use strict';
 // Whisper (ggml-small-q5_1) is measured as better for Russian and English, while
 // Vosk keeps the Georgian model because Whisper's Georgian accuracy is far worse.
 // "auto" needs a multilingual engine, so it also goes to Whisper offline.
 const offlineEngines=Object.freeze({ka:'vosk',ru:'whisper',en:'whisper',auto:'whisper'});
 const isNative=()=>root.Capacitor?.isNativePlatform?.()===true&&root.Capacitor?.getPlatform?.()==='android';
 const isOnline=value=>value===undefined?root.navigator?.onLine!==false:value===true;
 // Without the Android native bridge there is no offline engine at all, so the
 // browser build always resolves to the cloud and then reports OFFLINE through the
 // existing session check. A failed cloud upload is reported, never auto-retried
 // on another engine: the user asked for one route per language.
 function select({language='auto',online,native}={}){
  const device=native===undefined?isNative():native===true;
  if(!device||isOnline(online))return {engine:'cloud',local:false,language};
  return {engine:offlineEngines[language]||'whisper',local:true,language};
 }
 const api={select,isOnline,isNative,offlineEngines};
 root.VoiceProvider=api;return api;
});
