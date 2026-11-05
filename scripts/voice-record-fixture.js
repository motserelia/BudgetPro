'use strict';
const fs = require('node:fs'), path = require('node:path'), { spawn } = require('node:child_process');
const { args, safeError } = require('./voice-cli-common');
const { wav } = require('../www/voice/pcm');
const { validateWav } = require('../api/voice/transcribe');
const prompts = { ka:['გამარჯობა','ყავა რვა ლარი','ერთი ორი სამი ოთხი ხუთი','დღეს ახალი დავალება დავამატო'], ru:['Добавить задачу на сегодня','Кофе восемь лари','Один два три четыре пять'], en:['Add a task for today','Coffee eight lari','One two three four five'] };
(async()=> {
  const options = args();
  if (!options.lang && process.stdin.isTTY) { const rl=require('node:readline/promises').createInterface({input:process.stdin,output:process.stdout}); options.lang=await rl.question('Speech language (ka/ru/en): ');options.name=await rl.question('Fixture name (e.g. ka-01-gamarjoba): ');rl.close(); }
  const language = options.lang, name = options.name;
  if (!prompts[language] || typeof name !== 'string' || !new RegExp(`^${language}-[a-zA-Z0-9-]+(?:\\.wav)?$`).test(name)) throw Object.assign(new Error('Use --lang ka|ru|en --name LANG-fixture-name'),{code:'INVALID_ARGUMENT'});
  const seconds=Number(options.seconds||6); if(!Number.isFinite(seconds)||seconds<2||seconds>29)throw Object.assign(new Error(),{code:'INVALID_DURATION'});
  const filename=path.join('tests/voice/fixtures',name.endsWith('.wav')?name:name+'.wav');
  if(fs.existsSync(filename))throw Object.assign(new Error(),{code:'FIXTURE_ALREADY_EXISTS'});
  console.log(`Human microphone recording: ${language}. Speak one reference phrase:\n${prompts[language].join('\n')}\nDuration: ${seconds}s. No generated/fake audio is used.`);
  const child=spawn('arecord',['-q','-D',String(options.device||'default'),'-t','raw','-f','S16_LE','-r','16000','-c','1','-d',String(Math.ceil(seconds))],{stdio:['ignore','pipe','ignore']});
  const chunks=[];let size=0;
  child.stdout.on('data',chunk=>{size+=chunk.length;if(size>32000*30){child.kill();}else chunks.push(chunk);});
  const cancel=()=>child.kill('SIGINT');process.once('SIGINT',cancel);
  let code;
  try{code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});}finally{process.removeListener('SIGINT',cancel);}
  if(code!==0||size<7040||size>32000*30)throw Object.assign(new Error(),{code:'MICROPHONE_RECORD_FAILED'});
  const raw=Buffer.concat(chunks), pcm=new Float32Array(raw.length/2);let peak=0;
  for(let i=0;i<pcm.length;i++){pcm[i]=raw.readInt16LE(i*2)/32768;peak=Math.max(peak,Math.abs(pcm[i]));}
  if(peak<.0005)throw Object.assign(new Error(),{code:'MICROPHONE_SILENT'});
  const audio=Buffer.from(wav(pcm));validateWav(audio);fs.writeFileSync(filename,audio,{flag:'wx'});
  console.log(JSON.stringify({ok:true,file:filename,language,format:'PCM16 mono 16000 Hz WAV',humanRecording:true}));
})().catch(e=>{console.error(JSON.stringify(safeError(e)));process.exitCode=1;});
