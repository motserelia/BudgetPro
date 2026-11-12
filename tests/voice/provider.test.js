'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const install=require('../../www/voice/voice-provider');
function fixture({native=true,onLine=true}={}){
 const root={Capacitor:{isNativePlatform:()=>native,getPlatform:()=>'android'},navigator:{onLine}};
 return install(root);
}
test('online routes every language to the cloud provider',()=>{
 const provider=fixture();
 for(const language of ['ka','ru','en','auto'])assert.deepEqual(provider.select({language,online:true}),{engine:'cloud',local:false,language});
});
test('offline Georgian keeps Vosk while Russian, English and auto use Whisper',()=>{
 const provider=fixture();
 assert.deepEqual(provider.select({language:'ka',online:false}),{engine:'vosk',local:true,language:'ka'});
 for(const language of ['ru','en','auto'])assert.deepEqual(provider.select({language,online:false}),{engine:'whisper',local:true,language});
});
test('an unknown offline language falls back to Whisper and then fails its language check',()=>{
 assert.deepEqual(fixture().select({language:'de',online:false}),{engine:'whisper',local:true,language:'de'});
});
test('the browser build has no offline engine and resolves to the cloud route',()=>{
 const provider=fixture({native:false});
 assert.deepEqual(provider.select({language:'ka',online:false}),{engine:'cloud',local:false,language:'ka'});
 assert.deepEqual(provider.select({language:'ru',online:true}),{engine:'cloud',local:false,language:'ru'});
});
test('online and native are read from navigator and Capacitor when not passed explicitly',()=>{
 assert.equal(fixture({onLine:false}).select({language:'ka'}).engine,'vosk');
 assert.equal(fixture({onLine:true}).select({language:'ka'}).engine,'cloud');
 assert.equal(fixture({native:false,onLine:false}).select({language:'ru'}).engine,'cloud');
 assert.equal(fixture({native:true,onLine:false}).select({language:'ru'}).local,true);
 assert.equal(fixture({native:false,onLine:true}).select({language:'ru'}).local,false);
});
test('the offline engine map is frozen and the router never records or stores anything',()=>{
 const provider=fixture();
 assert.equal(Object.isFrozen(provider.offlineEngines),true);
 assert.deepEqual({...provider.offlineEngines},{ka:'vosk',ru:'whisper',en:'whisper',auto:'whisper'});
 assert.deepEqual(Object.keys(provider.select({language:'ka',online:false})),['engine','local','language']);
});
test('the consent gate blocks the cloud until the user decides and never guesses',()=>{
 const provider=fixture();
 assert.deepEqual(provider.gate({consent:null,native:true}),{allowed:false,engine:null,reason:'VOICE_CLOUD_CONSENT_REQUIRED'});
 assert.deepEqual(provider.gate({consent:undefined,native:false}),{allowed:false,engine:null,reason:'VOICE_CLOUD_CONSENT_REQUIRED'});
 assert.deepEqual(provider.gate({consent:'cloud',native:true}),{allowed:true,engine:'cloud',reason:null});
 assert.deepEqual(provider.gate({consent:'cloud',native:false}),{allowed:true,engine:'cloud',reason:null});
 assert.deepEqual(provider.gate({consent:'local',native:true}),{allowed:true,engine:'offline',reason:null});
 assert.deepEqual(provider.gate({consent:'local',native:false}),{allowed:false,engine:null,reason:'VOICE_OFFLINE_UNAVAILABLE'});
});
test('the local consent pins the offline engine even when the network is up',()=>{
 const provider=fixture();
 assert.deepEqual(provider.select({language:'ka',online:true,consent:'local'}),{engine:'vosk',local:true,language:'ka'});
 assert.deepEqual(provider.select({language:'ru',online:true,consent:'local'}),{engine:'whisper',local:true,language:'ru'});
 assert.deepEqual(provider.select({language:'ka',online:true,consent:'cloud'}),{engine:'cloud',local:false,language:'ka'});
 assert.deepEqual(provider.select({language:'ka',online:true,consent:null}),{engine:'cloud',local:false,language:'ka'});
 assert.deepEqual(fixture({native:false}).select({language:'ka',online:true,consent:'local'}),{engine:'cloud',local:false,language:'ka',blocked:'VOICE_OFFLINE_UNAVAILABLE'});
});
