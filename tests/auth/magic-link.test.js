'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createHandler}=require('../../api/auth/magic-link');
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'unit-only-key'};
const source=fs.readFileSync('www/index.js','utf8');
const extract=name=>{const a=source.indexOf(`function ${name}(`);assert.ok(a>=0,name);return source.slice(source.lastIndexOf('async ',a)===a-6?a-6:a,source.indexOf('\n}',a)+2);};
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v;},end(body){this.body=body?JSON.parse(body):null;}};}
const req=()=>({method:'POST',body:{email:'  TEST@example.com  '}});
test('REST OTP contract: normalized email, create_user and canonical HTTPS redirect query; one request',async()=>{
 let calls=0;const res=response();await createHandler({env,fetch:async(url,options)=>{calls++;assert.equal(new URL(url).searchParams.get('redirect_to'),'https://budget-pro-lski.vercel.app/');assert.deepEqual(JSON.parse(options.body),{email:'test@example.com',create_user:true});assert.equal(options.headers.apikey,env.SUPABASE_ANON_KEY);return{ok:true,json:async()=>({})};}})(req(),res);
 assert.equal(calls,1);assert.equal(res.statusCode,200);assert.deepEqual(res.body,{ok:true});assert.equal(res.headers['Cache-Control'],'no-store');
});
test('classifies provider/config/recipient/limit errors without forwarding private upstream values or retrying',async()=>{
 for(const [status,data,code] of [[429,{code:'over_email_send_rate_limit'},'AUTH_RATE_LIMITED'],[403,{code:'email_address_not_authorized'},'AUTH_RECIPIENT_NOT_ALLOWED'],[500,{msg:'Error sending magiclink email'},'AUTH_EMAIL_DELIVERY_FAILED'],[401,{msg:'invalid api key'},'AUTH_CONFIG_ERROR'],[400,{code:'email_provider_disabled'},'AUTH_CONFIG_ERROR'],[503,{msg:'internal detail'},'AUTH_SERVER_UNAVAILABLE']]){
  let calls=0;const res=response();await createHandler({env,fetch:async()=>{calls++;return{ok:false,status,headers:{get:()=> '300'},json:async()=>({...data,private:'NEVER_EXPOSE'})};}})(req(),res);
  assert.equal(calls,1);assert.equal(res.body.error,code);assert.equal(res.body.ok,false);assert.ok(!JSON.stringify(res.body).includes('NEVER_EXPOSE'));if(status===429)assert.equal(res.body.retryAfter,300);
 }
});
test('rejects invalid input/config and handles malformed response or network failure without false success',async()=>{
 const res=response();let calls=0;await createHandler({env,fetch:async()=>{calls++;}})({method:'POST',body:{email:'invalid'}},res);assert.equal(res.statusCode,400);assert.equal(calls,0);
 const config=response();await createHandler({env:{},fetch:async()=>{calls++;}})(req(),config);assert.equal(config.body.error,'AUTH_CONFIG_ERROR');assert.equal(calls,0);
 for(const fetch of [async()=>{throw new TypeError('private connection detail');},async()=>({ok:true,json:async()=>{throw new Error();}})]){
  const res=response();await createHandler({env,fetch})(req(),res);assert.equal(res.body.ok,false);assert.equal(res.body.error,'AUTH_SERVER_UNAVAILABLE');
 }
});
function client(fetch){const saved=new Map();const ctx={window:{BudgetPROApiConfig:{getApiUrl:()=> 'https://budget-pro-lski.vercel.app/api/auth/magic-link'}},navigator:{onLine:true},fetch,AbortController,setTimeout,clearTimeout,AUTH_PENDING_EMAIL_KEY:'pending',localStorage:{setItem:(k,v)=>saved.set(k,v)},currentLang:'ru',t:k=>k};vm.createContext(ctx);for(const fn of ['createMagicLinkError','getMagicLinkErrorMessage','sendMagicLink'])vm.runInContext(extract(fn),ctx);return{ctx,saved};}
test('client requires explicit JSON success, separates offline/server/limit, and does not store email on failure',async()=>{
 for(const [status,body,code]of[[200,null,'AUTH_SERVER_UNAVAILABLE'],[200,{ok:false,error:'AUTH_EMAIL_DELIVERY_FAILED'},'AUTH_EMAIL_DELIVERY_FAILED'],[429,{ok:false,error:'AUTH_RATE_LIMITED'},'AUTH_RATE_LIMITED'],[500,{ok:false,error:'AUTH_CONFIG_ERROR'},'AUTH_CONFIG_ERROR']]){
  const{ctx,saved}=client(async()=>({ok:status===200,status,json:async()=>body}));await assert.rejects(ctx.sendMagicLink('test@example.com'),e=>e.code===code);assert.equal(saved.size,0);
 }
 const{ctx}=client(async()=>{throw new TypeError();});await assert.rejects(ctx.sendMagicLink('test@example.com'),e=>e.code==='AUTH_NETWORK_ERROR');
});
test('client double press produces one request and unlocks after completion',async()=>{
 let resolve,calls=0;const{ctx,saved}=client(()=>{calls++;return new Promise(r=>resolve=r);});const p=ctx.sendMagicLink('  TEST@example.com ');await assert.rejects(ctx.sendMagicLink('test@example.com'),e=>e.code==='AUTH_REQUEST_PENDING');resolve({ok:true,json:async()=>({ok:true})});await p;assert.equal(calls,1);assert.equal(saved.get('pending'),'test@example.com');assert.equal(ctx.window.__magicLinkSending,false);
});
test('all requested error classes have Russian, Georgian and English messages',()=>{
 const{ctx}=client();for(const lang of['ru','ka','en']){ctx.currentLang=lang;for(const code of['AUTH_NETWORK_ERROR','AUTH_SERVER_UNAVAILABLE','AUTH_RATE_LIMITED','AUTH_RECIPIENT_NOT_ALLOWED','AUTH_EMAIL_DELIVERY_FAILED','AUTH_CONFIG_ERROR'])assert.notEqual(ctx.getMagicLinkErrorMessage({code}),'authError');}
});
test('cold and warm Android App Links use the same handler; wrong origin is rejected',async()=>{
 let listener,calls=0;const ctx={appUrlOpenListenerInstalled:false,window:{Capacitor:{Plugins:{App:{addListener:(name,fn)=>listener=fn,getLaunchUrl:async()=>({url:'https://budget-pro-lski.vercel.app/#access_token=fixture'})}}},BudgetPROApiConfig:{productionOrigin:'https://budget-pro-lski.vercel.app'}},URL,console:{log(){},error(){}},pendingAppUrlAuthHash:'',handleAuthCallback:async()=>{calls++;return true;},document:{getElementById:()=>null},loadAll:async()=>{},init(){},showCreatorWelcomeToastIfNeeded(){}};
 vm.createContext(ctx);vm.runInContext(extract('setupAppUrlOpenListener'),ctx);ctx.setupAppUrlOpenListener();await new Promise(r=>setImmediate(r));assert.equal(calls,1);await listener({url:'https://attacker.invalid/#access_token=fixture'});assert.equal(calls,1);await listener({url:'https://budget-pro-lski.vercel.app/#access_token=warm-fixture'});assert.equal(calls,2);assert.ok(ctx.pendingAppUrlAuthHash.includes('warm-fixture'));
});

test('safe runtime diagnostics distinguish transport failures and never log credentials, recipients or upstream bodies',async()=>{
 const events=[],privateMarker='PRIVATE_FIXTURE_VALUE';
 const res=response();await createHandler({env:{...env,SUPABASE_ANON_KEY:privateMarker},log:e=>events.push(e),fetch:async()=>{throw Object.assign(new TypeError(privateMarker),{cause:{code:'ENOTFOUND',message:privateMarker}});}})(req(),res);
 assert.equal(events[0].stage,'supabase_request');assert.equal(events[0].cause,'ENOTFOUND');assert.equal(res.body.error,'AUTH_SERVER_UNAVAILABLE');
 const upstream=response();await createHandler({env,log:e=>events.push(e),fetch:async()=>({ok:false,status:500,json:async()=>({msg:'Error sending email '+privateMarker})})})(req(),upstream);
 assert.equal(events[1].stage,'supabase_response');assert.equal(events[1].upstreamStatus,500);
 assert.ok(!JSON.stringify(events).includes(privateMarker));assert.ok(!JSON.stringify(events).includes('test@example.com'));
});
