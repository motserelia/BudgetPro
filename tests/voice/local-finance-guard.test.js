'use strict';
const test=require('node:test'), assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const guard=fs.readFileSync('scripts/voice-debug/local-finance-guard.js','utf8');
function setup(){
 const listeners=new Map();let requests=0;
 class Storage {constructor(){this.values=new Map();}getItem(k){return this.values.get(k)||null;}setItem(k,v){this.values.set(k,String(v));}removeItem(k){this.values.delete(k);}clear(){this.values.clear();}}
 class DB {transaction(_,mode){return mode;}}
 const storage=new Storage();storage.setItem('financial-profile',JSON.stringify({transactions:[{id:'fixture',amount:7}],balance:10}));storage.setItem('budgetpro_auth_session','existing-session');
 const root={Storage,IDBDatabase:DB,indexedDB:{deleteDatabase(){throw Error('MUST_NOT_DELETE');}},localStorage:storage,URL,location:{href:'https://budgetpro.app/',origin:'https://budgetpro.app'},navigator:{},document:{documentElement:{lang:'ru'},querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners.set(type,fn)},fetch:async()=>{requests++;return{ok:true};}};
 root.today=()=> '2026-11-03';root.window=root;vm.runInNewContext(guard,root);
 return{root,listeners,storage,requests:()=>requests};
}
test('financial Storage/IndexedDB boundaries reject actual writes/deletes while auth session still works',()=>{
 const s=setup(),before=s.storage.getItem('financial-profile');s.storage.setItem('financial-profile','changed');s.storage.removeItem('financial-profile');s.storage.clear();
 assert.equal(s.storage.getItem('financial-profile'),before);assert.equal(s.storage.getItem('budgetpro_auth_session'),'existing-session');
 s.storage.setItem('budgetpro_auth_session','refreshed-session');assert.equal(s.storage.getItem('budgetpro_auth_session'),'refreshed-session');
 const db=new s.root.IDBDatabase();assert.equal(db.transaction('profiles','readonly'),'readonly');assert.throws(()=>db.transaction('profiles','readwrite'),/LOCAL_TEST_READ_ONLY/);assert.throws(()=>s.root.indexedDB.deleteDatabase('financial'));
});
test('finance clicks, touch, submit and input are stopped before handlers, including programmatic Save/Delete',()=>{
 const s=setup();let writes=0;
 for(const name of ['save','delete','operation','confirm'])for(const type of ['pointerup','touchend','click','submit','input']){
  let prevented=false,stopped=false;
  const event={target:{closest:()=>null},preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;},isTrusted:false};s.listeners.get(type)(event);
  if(!stopped)writes++;assert.equal(prevented,true);assert.equal(stopped,true,name+type);
 }
 assert.equal(writes,0);assert.equal(s.root.BudgetPROVoiceDebug.history().some(e=>e.event==='input_blocked'),true);
});
test('debug trace is bounded, contains no record values, tokens, arbitrary messages or text',()=>{
 const s=setup();for(let i=0;i<110;i++)s.root.BudgetPROVoiceDebug.trace('event',{token:'secret',amount:2222,text:'private',role:'stop'});
 const history=s.root.BudgetPROVoiceDebug.history();assert.equal(history.length,100);assert.equal(JSON.stringify(history).includes('secret'),false);assert.equal(JSON.stringify(history).includes('2222'),false);
 history[0].event='changed';assert.notEqual(s.root.BudgetPROVoiceDebug.history()[0].event,'changed');
});
test('network gate rejects STT, relay and backup APIs without retries but keeps canonical auth request',async()=>{
 const s=setup();for(const url of ['https://api.groq.com/openai/v1/audio/transcriptions','https://speech.googleapis.com/v2/recognize','https://budget-pro-lski.vercel.app/api/voice/transcribe','http://localhost:8139/api/voice/transcribe','https://api.jsonbin.io/v3/b/x'])await assert.rejects(s.root.fetch(url,{method:'POST'}),/LOCAL_TEST_NETWORK_BLOCKED/);
 assert.equal(s.requests(),0);await s.root.fetch('https://budget-pro-lski.vercel.app/api/auth/refresh-session',{method:'POST'});assert.equal(s.requests(),1);
});
test('real staged financial entry points return BEFORE editing, mutation, normalization or persistence',()=>{
 const source=execFileSync('python3',['-c',"import importlib.util,pathlib; s=importlib.util.spec_from_file_location('p','scripts/voice-debug/prepare-android.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);print(m.guard_financial_handlers(pathlib.Path('www/index.js').read_text()))"],{maxBuffer:4*1024*1024}).toString();
 const s=setup();
 for(const name of ['openEditModal','openAddModal','safeDeleteOp','saveAll','saveProfileData','saveGlobal','normalizeFinancialState','applyRecurringOps','saveVoiceDraftTransaction','askConfirm']){
  const start=source.indexOf('function '+name+'(');assert.ok(start>=0,name);const end=source.indexOf('\n}\n',start)+2;vm.runInNewContext(source.slice(start,end),s.root);
  assert.equal(s.root[name]({}),false,name);
 }
 assert.equal(s.storage.getItem('financial-profile'),JSON.stringify({transactions:[{id:'fixture',amount:7}],balance:10}));
});

let compiled;
function compiledSource() {
 if(!compiled)compiled=JSON.parse(execFileSync('python3',['-c',"import importlib.util,pathlib,json;s=importlib.util.spec_from_file_location('p','scripts/voice-debug/prepare-android.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);print(json.dumps({'source':m.guard_financial_handlers(pathlib.Path('www/index.js').read_text()),'names':m.GUARDED_FUNCTIONS}))"],{maxBuffer:5*1024*1024}).toString());
 return compiled;
}
function declareFrom(source,name,root){
 let start=source.indexOf('function '+name+'(');assert.ok(start>=0,name);
 if(source.slice(start-6,start)==='async ')start-=6;
 let end=start;
 for(;;){end=source.indexOf('\n}\n',end+1);assert.ok(end>=0,name);const code=source.slice(start,end+2);try{new vm.Script(code);}catch{continue;}vm.runInNewContext(code,root);return;}
}
function partnerFixture(patched=true){
 const s=setup();let writes=0;
 s.storage.values.set('partnerRoomCode','fixture-room');
 Object.assign(s.root,{transactions:[{id:'fixture',amountRub:8}],profiles:[{id:'default',name:'Fixture'}],activeProfileId:'default',_fbDB:{ref(){return{set(){writes++;},update(){writes++;},remove(){writes++;}};}}});
 const source=patched?compiledSource().source:fs.readFileSync('www/index.js','utf8');
 if(patched)declareFrom(source,'saveAll',s.root);else s.root.saveAll=()=>false;
 const start=source.indexOf('saveAll = function () {'),end=source.indexOf('\n};',start)+3;
 vm.runInNewContext('const _origSaveAll=saveAll;'+source.slice(start,end)+'\nconst savedWrapper=saveAll;',s.root);
 return{...s,writes:()=>writes};
}
test('positive control: old outer wrapper ignores false from original and writes to configured mock room',()=>{
 const s=partnerFixture(false);vm.runInNewContext('saveAll()',s.root);assert.equal(s.writes(),1);
});
test('patched outer wrapper, saved original and saved wrapper do not sync a configured mock room',async()=>{
 const s=partnerFixture(),before=JSON.stringify(s.root.transactions);
 vm.runInNewContext('saveAll();_origSaveAll();savedWrapper();',s.root);
 await vm.runInNewContext('Promise.resolve().then(()=>savedWrapper()).then(()=>_origSaveAll())',s.root);
 assert.equal(s.writes(),0);assert.equal(s.requests(),0);assert.equal(JSON.stringify(s.root.transactions),before);
});
test('final runtime sealing blocks later reassignment while saved references remain protected',()=>{
 const s=partnerFixture(),{source,names}=compiledSource();
 for(const name of names)if(name!=='saveAll')declareFrom(source,name,s.root);
 assert.equal(s.root.BudgetPROVoiceDebug.guardReady,false);
 assert.equal(s.root.BudgetPROVoiceDebug.finalize(names),true);
 assert.equal(s.root.BudgetPROVoiceDebug.guardReady,true);
 for(const name of names){assert.equal(Object.getOwnPropertyDescriptor(s.root,name).writable,false);assert.equal(Object.getOwnPropertyDescriptor(s.root,name).configurable,false);}
 assert.throws(()=>{s.root.saveAll=()=>{throw Error('BYPASS');};});
 assert.throws(()=>{s.root.BudgetPROVoiceDebug={localOnly:false};});
 vm.runInNewContext('saveAll();_origSaveAll();savedWrapper();',s.root);assert.equal(s.writes(),0);
});
test('unreviewed wrapper changes fail preparation rather than silently shipping incomplete guards',()=>{
 const result=execFileSync('python3',['-c',"import importlib.util,pathlib;s=importlib.util.spec_from_file_location('p','scripts/voice-debug/prepare-android.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);src=pathlib.Path('www/index.js').read_text();\ntry:m.guard_financial_handlers(src+'\\nsaveAll = function () {};\\n')\nexcept RuntimeError:print('REJECTED')\nelse:print('UNSAFE')"],{maxBuffer:10000}).toString().trim();assert.equal(result,'REJECTED');
});
