const test = require('node:test'), assert = require('node:assert/strict');
const { resample, wav } = require('../../www/voice/pcm');
const { validateWav } = require('../../api/voice/transcribe');
const { Detector } = require('../../www/voice/voice-activity-detector');
function tone(rate, hz, amplitude, seconds) { return Float32Array.from({length:rate*seconds}, (_,i)=>amplitude*Math.sin(i*2*Math.PI*hz/rate)); }
test('real resampling preserves duration and frequency; rejects aliases',()=>{
 const low = resample(tone(48000,440,.1,1),48000), high = resample(tone(48000,12000,.1,1),48000);
 assert.equal(low.length,16000);
 const rms = x=>Math.sqrt(x.reduce((n,s)=>n+s*s,0)/x.length);
 assert.ok(rms(low)>.06); assert.ok(rms(high)<.002);
 assert.equal(validateWav(Buffer.from(wav(low))),1000);
});
test('invalid codec/header rejected',()=>{ const b=Buffer.from(wav(tone(16000,440,.1,1))); b.writeUInt32LE(48000,24); assert.throws(()=>validateWav(b),/INVALID_AUDIO/); });
for (const mode of ['auto','quiet','noise']) test(`VAD ${mode}: pre-roll, minimum speech, pause, endpoint`,()=>{
 const d = new Detector(mode); const frame=(amp)=>d.process(tone(16000,440,amp,.02),16000);
 for(let i=0;i<30;i++) frame(.0001);
 for(let i=0;i<30;i++) frame(mode==='quiet'?.005:.08);
 assert.ok(d.started); for(let i=0;i<20;i++) assert.equal(frame(.0001).ended,false);
 let end; for(let i=0;i<100;i++) end=frame(.0001);
 assert.ok(end.ended); assert.ok(end.speechDuration>=220);
});
test('steady moderate background noise does not trigger speech',()=>{ const d = new Detector('noise'); for(let i=0;i<250;i++) d.process(tone(16000,240,.03,.02),16000); assert.equal(d.started,false); });
