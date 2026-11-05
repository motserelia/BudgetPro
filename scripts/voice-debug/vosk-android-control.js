'use strict';
// USB-only operator control. Never starts a recorder, never saves transactions.
const fs=require('node:fs');const {evaluate}=require('/tmp/budgetpro-phone-cdp');
(async()=>{
 const [action,permission,...extra]=process.argv.slice(2);
 if(!['status','self-test','prepare','arm','report','release'].includes(action)||extra.length)throw Error('INVALID_ACTION');
 if(action==='arm'&&permission!=='--confirm-audio-permission')throw Error('EXPLICIT_AUDIO_PERMISSION_REQUIRED');
 if(action!=='arm'&&permission)throw Error('INVALID_ARGUMENT');
 const method={'status':'status','self-test':'selfTest','prepare':'prepare','arm':'arm','report':'history','release':'release'}[action];
 const result=await evaluate(`(async()=>{if(!window.BudgetPROVoiceDebug?.guardReady||!window.BudgetPROVoskDebugTest)throw Error('NATIVE_VOSK_DEBUG_REQUIRED');return await window.BudgetPROVoskDebugTest.${method}();})()`);
 if(action==='report'){
  const file='/tmp/budgetpro-vosk-android-phone-report.json';fs.writeFileSync(file,JSON.stringify(result,null,2),{mode:0o600});console.log(JSON.stringify({report:file,attempts:result.length}));
 }else console.log(JSON.stringify(result));
})().catch(()=>{console.log(JSON.stringify({ok:false,error:'NATIVE_VOSK_DEBUG_CONTROL_FAILED'}));process.exitCode=1;});
