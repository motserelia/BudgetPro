'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const api=require('../../www/api-config');
const {authorize,createHandler}=require('../../api/voice/transcribe');
const healthHandler=require('../../api/voice/health');
function location(url){const u=new URL(url);return {protocol:u.protocol,hostname:u.hostname,origin:u.origin};}
test('Web/file desktop/Android share one API configuration',()=>{assert.equal(api.getApiUrl('voice/transcribe',{location:location(api.productionOrigin)}),api.productionOrigin+'/api/voice/transcribe');assert.equal(api.getApiUrl('voice/transcribe',{location:location('file:///opt/BudgetPRO/index.html')}),api.productionOrigin+'/api/voice/transcribe');assert.equal(api.getApiUrl('voice/transcribe',{location:location('https://budgetpro.app'),native:true}),api.productionOrigin+'/api/voice/transcribe');});
test('unauthorized voice is distinct from Google credential error',async()=>{await assert.rejects(authorize({headers:{}},AbortSignal.timeout(100)),e=>e.code==='VOICE_AUTH_REQUIRED'&&e.status===401);});
test('Supabase validates bearer through user endpoint, no cookies assumed',async()=>{
 const original=fetch,env={url:process.env.SUPABASE_URL,key:process.env.SUPABASE_ANON_KEY};process.env.SUPABASE_URL='https://unit.supabase.co';process.env.SUPABASE_ANON_KEY='unit-public-key';
 global.fetch=async(url,options)=>{assert.equal(url,'https://unit.supabase.co/auth/v1/user');assert.equal(options.headers.Authorization,'Bearer unit-test-user');return {ok:true,json:async()=>({id:'unit-user'})};};
 try{assert.equal(await authorize({headers:{authorization:'Bearer unit-test-user'}},AbortSignal.timeout(1000)),'unit-user');}finally{global.fetch=original;for(const [key,value]of [['SUPABASE_URL',env.url],['SUPABASE_ANON_KEY',env.key]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});
test('health is safe and no-store; unknown origin denied',()=>{
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(body){this.body=body?JSON.parse(body):null;}};
 healthHandler({method:'GET',headers:{}},res);assert.equal(res.statusCode,200);assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(res.body.provider,null);assert.equal(res.body.configured,false);assert.equal('client_email' in res.body,false);
 healthHandler({method:'GET',headers:{origin:'https://attacker.invalid'}},res);assert.equal(res.statusCode,403);assert.equal(res.body.error,'CORS_DENIED');
});
test('renderer sends bearer to HTTPS backend and records only presence/status',async()=>{
 let diagnostics={},seen;
 const context={BudgetPROApiConfig:api,VoiceDiagnostics:{update:d=>Object.assign(diagnostics,d)},navigator:{onLine:true},AbortController,DOMException,URL,setTimeout,clearTimeout,fetch:async(url,options)=>{seen={url,options};return {ok:true,status:200,json:async()=>({ok:true,sessionId:'test-session',requestedLanguage:'ka',provider:'google-stt-v2',model:'chirp_2',transcript:'გამარჯობა'})};}};
 vm.runInNewContext(fs.readFileSync('www/voice/voice-api-client.js','utf8'),context);
 await context.VoiceApiClient.transcribe({wav:new ArrayBuffer(44),language:'ka',mode:'auto',sessionId:'test-session',token:'unit-jwt',signal:new AbortController().signal});
 assert.equal(seen.options.headers.Authorization,'Bearer unit-jwt');assert.equal(seen.url.origin,api.productionOrigin);assert.equal(diagnostics.authPresent,true);assert.equal(diagnostics.httpStatus,200);assert.equal(JSON.stringify(diagnostics).includes('unit-jwt'),false);
});
test('missing server ENV returns STT_NOT_CONFIGURED, not generic 500',async()=>{
 const res={setHeader(){},end(body){this.body=JSON.parse(body);}};const req={method:'POST',headers:{'content-type':'audio/wav'},url:'/api/voice/transcribe?language=ka&mode=auto&sessionId=unit-session-12345678'};
 await createHandler({validateConfig:()=>{throw Object.assign(new Error(),{code:'STT_NOT_CONFIGURED',status:503,reason:'CREDENTIALS_MISSING'});}})(req,res);assert.equal(res.statusCode,503);assert.equal(res.body.error,'STT_NOT_CONFIGURED');
});
test('voice re-reads session after boolean refresh on both entry points',async()=>{
 for(const file of ['www/index.js','index.js']){
  const source=fs.readFileSync(file,'utf8');
  const start=source.indexOf('const getToken = async () => {');
  const end=source.indexOf('\n    };',start);
  const code=source.slice(start,end+'\n    };'.length)+'\ngetToken();';
  let refreshed=false;
  const context={getAuthSession:()=>refreshed?{access_token:'fresh-unit-token'}:{refresh_token:'unit-refresh',access_token:'expired-unit-token'},isAuthSessionExpired:()=>true,refreshAuthSession:async()=>{refreshed=true;return true;}};
  assert.equal(await vm.runInNewContext(code,{...context}),'fresh-unit-token',file);
  context.refreshAuthSession=async()=>false;refreshed=false;
  if (file === 'www/index.js') await assert.rejects(vm.runInNewContext(code,{...context}), e => e.code === 'AUTH_REFRESH_FAILED');
  else assert.equal(await vm.runInNewContext(code,{...context}),'',file);
 }
});

test('voice uses persisted cloud session after reload, rejects expired tokens without refresh, distinguishes refresh failure',async()=>{
 const source=fs.readFileSync('www/index.js','utf8');const start=source.indexOf('const getToken = async () => {');const end=source.indexOf('\n    };',start);const code=source.slice(start,end+7)+'\ngetToken();';
 const saved=new Map();let calls=0;
 const context={getAuthSession:()=>JSON.parse(saved.get('session')||'null'),isAuthSessionExpired:s=>!s.expires_at||s.expires_at<=100,refreshAuthSession:async()=>{calls++;saved.set('session',JSON.stringify({access_token:'fresh-test',expires_at:200,refresh_token:'next-test'}));return true;}};
 assert.equal(await vm.runInNewContext(code,context),'');
 saved.set('session',JSON.stringify({access_token:'valid-test',expires_at:200}));
 assert.equal(await vm.runInNewContext(code,{...context}),'valid-test');assert.equal(calls,0);
 saved.set('session',JSON.stringify({access_token:'expired-test',expires_at:99}));assert.equal(await vm.runInNewContext(code,{...context}),'');
 saved.set('session',JSON.stringify({access_token:'expired-test',expires_at:99,refresh_token:'refresh-test'}));assert.equal(await vm.runInNewContext(code,{...context}),'fresh-test');assert.equal(calls,1);
 assert.equal(await vm.runInNewContext(code,{...context}),'fresh-test');assert.equal(calls,1);
 saved.set('session',JSON.stringify({access_token:'expired-test',expires_at:99,refresh_token:'refresh-test'}));
 await assert.rejects(vm.runInNewContext(code,{...context,refreshAuthSession:async()=>false}),e=>e.code==='AUTH_REFRESH_FAILED');
});
