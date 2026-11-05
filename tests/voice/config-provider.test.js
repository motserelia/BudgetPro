'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {readConfig,health}=require('../../server/voice/config');
const {createGoogleClient}=require('../../server/voice/google-client');
const {googleError}=require('../../server/voice/google-errors');
const {buildRequest}=require('../../api/voice/transcribe');
const key=crypto.generateKeyPairSync('rsa',{modulusLength:2048}).privateKey.export({type:'pkcs8',format:'pem'});
const account={type:'service_account',client_email:'voice-unit@budgetpro-test.iam.gserviceaccount.com',private_key:key};
const env={GOOGLE_CLOUD_PROJECT:'budgetpro-test',GOOGLE_CLOUD_LOCATION:'europe-west4',GOOGLE_SERVICE_ACCOUNT_JSON:JSON.stringify(account)};
test('raw/B64 credentials and double-escaped private-key newlines supported',()=>{
 assert.equal(readConfig(env).account.private_key,key);
 const b64=Buffer.from(JSON.stringify(account)).toString('base64');assert.equal(readConfig({...env,GOOGLE_SERVICE_ACCOUNT_JSON:'broken',GOOGLE_SERVICE_ACCOUNT_JSON_B64:b64}).account.private_key,key);
 assert.equal(readConfig({...env,GOOGLE_SERVICE_ACCOUNT_JSON:JSON.stringify({...account,private_key:key.replace(/\n/g,'\\n')})}).account.private_key,key);
});
test('missing/malformed config is STT_NOT_CONFIGURED with no secrets',()=>{
 for(const e of [{},{...env,GOOGLE_CLOUD_LOCATION:'global'},{...env,GOOGLE_SERVICE_ACCOUNT_JSON:'bad'},{...env,GOOGLE_SERVICE_ACCOUNT_JSON_B64:'!!!!'},{...env,GOOGLE_SERVICE_ACCOUNT_JSON:JSON.stringify({...account,private_key:'bad'})}])assert.throws(()=>readConfig(e),error=>error.code==='STT_NOT_CONFIGURED'&&!JSON.stringify(error).includes(key));
 const body=health(env);assert.equal(body.configured,true);assert.equal(JSON.stringify(body).includes(account.client_email),false);assert.equal(JSON.stringify(body).includes(key),false);assert.equal(health({}).configured,false);
});
test('provider serializes exact regional Recognize config, no adaptation baseline',async()=>{
 const calls=[];const client=createGoogleClient(env,async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.includes('oauth2')?{access_token:'unit-only-token',expires_in:3600}:{results:[{languageCode:'ka-GE',alternatives:[{transcript:'გამარჯობა'}]}]}};});
 const request=buildRequest(Buffer.from('unit-only-audio'),'ka',['not baseline'],env);
 await client.recognize(request,AbortSignal.timeout(1000));
 const call=calls[1],body=JSON.parse(call.options.body);assert.equal(call.url,'https://europe-west4-speech.googleapis.com/v2/projects/budgetpro-test/locations/europe-west4/recognizers/_:recognize');assert.deepEqual(body.config.languageCodes,['ka-GE']);assert.equal(body.config.model,'chirp_2');assert.equal(body.config.adaptation,undefined);assert.equal(body.config.features.denoiseAudio,undefined);assert.equal(call.options.headers.Authorization,'Bearer unit-only-token');
});
for(const [status,body,code] of [[403,{error:{details:[{reason:'SERVICE_DISABLED'}]}},'API_DISABLED'],[403,{error:{details:[{reason:'BILLING_DISABLED'}]}},'BILLING_DISABLED'],[403,{error:{status:'PERMISSION_DENIED'}},'PERMISSION_DENIED'],[401,{},'AUTH_ERROR'],[429,{},'QUOTA_EXCEEDED'],[400,{error:{message:'model unavailable in this region'}},'REGION_UNAVAILABLE']])test(code,()=>{const e=googleError(status,body);assert.equal(e.code,code);assert.ok(e.technicalReason);});

test('OAuth invalid_grant is AUTH_ERROR, not generic STT_ERROR',()=>assert.equal(googleError(400,{error:'invalid_grant',error_description:'invalid account signature'}).code,'AUTH_ERROR'));
test('JSON null credentials are rejected as configuration error',()=>assert.throws(()=>readConfig({...env,GOOGLE_SERVICE_ACCOUNT_JSON:'null'}),e=>e.code==='STT_NOT_CONFIGURED'));
test('read-only connectivity checks actual Locations metadata for all three locales',async()=>{
 const client=createGoogleClient(env,async(url)=>({ok:true,json:async()=>url.includes('oauth2')?{access_token:'unit-token'}:{metadata:{languages:{models:Object.fromEntries(['ka-GE','ru-RU','en-US'].map(locale=>[locale,{modelFeatures:{chirp_2:{}}}]))}}}}));
 const result=await client.connectivity(AbortSignal.timeout(1000));assert.equal(result.modelAvailabilityVerified,true);assert.equal(result.billingVerified,false);assert.equal(result.recognizePermissionVerified,false);
});
