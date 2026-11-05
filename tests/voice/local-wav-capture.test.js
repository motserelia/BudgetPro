'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), crypto = require('node:crypto'), vm = require('node:vm'), fs = require('node:fs');
const install = require('../../scripts/voice-debug/local-wav-capture');
const { wav } = require('../../www/voice/pcm');
const makeAudio = () => wav(new Float32Array(16000));
const tick = () => new Promise(r => setImmediate(r));
function setup({ audio = makeAudio(), pendingReady = false } = {}) {
  let network = 0, starts = 0, ready, expire, recorder;
  const states = [];
  const root = { BudgetPROVoiceDebug: { localOnly: true, buildRevision: 4, guardReady: true, saveBlocked: true, showState() {}, trace() {} }, Capacitor: { isNativePlatform: () => true }, location: { origin: 'https://budgetpro.app', hostname: 'budgetpro.app' }, crypto, Date, AbortController, navigator: { onLine: true }, document: { addEventListener() {} }, localStorage: { getItem: () => 'auto' }, console,
    setTimeout: (fn, ms) => { if (ms === 600000) { expire = fn; return 0; } const t = setTimeout(fn, ms); t.unref(); return t; }, clearTimeout,
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    VoiceRecorder: class { constructor(_, frame) { recorder = this; this.frame = frame; } start() { starts++; return pendingReady ? new Promise(r => ready = r) : Promise.resolve(); } async close() {} async finish() { return { wav: audio, metrics: { duration: 1000 } }; } },
    VoiceApiClient: { transcribe() { network++; throw Error('NETWORK_FORBIDDEN'); } },
  };
  for (const name of ['voice-diagnostics']) vm.runInNewContext(fs.readFileSync(`www/voice/${name}.js`, 'utf8'), root);
  vm.runInNewContext(fs.readFileSync('scripts/voice-debug/local-voice-session.js', 'utf8'), root);
  const capture = install(root); root.BudgetPROVoiceModule.subscribe(s => states.push({ ...s }));
  return { root, capture, voice: root.BudgetPROVoiceModule, states, counts: () => ({ network, starts }), expire: () => expire(), ready: () => ready(), frame: m => recorder.frame(m) };
}
async function record(s, options = {}) { s.capture.arm(); const p = s.voice.start({ token: 'unit-secret', ...options }); await tick(); s.voice.stop(); s.voice.stop(); return p; }
test('successful capture is distinct from Cancel, keeps session result non-cancelled, never parses or sends', async () => {
  const s = setup(); let cancels = 0, parsed = 0; const cancel = s.voice.cancel; s.voice.cancel = () => { cancels++; cancel(); };
  const result = await record(s, { onTranscript: () => parsed++ });
  assert.equal(result.localCaptureComplete, true); assert.equal(result.cancelled, undefined);
  assert.equal(cancels, 0); assert.equal(parsed, 0); assert.equal(s.states.at(-1).debugCaptureState, 'CAPTURE_COMPLETE');
  assert.equal(s.capture.status().state, 'CAPTURE_COMPLETE'); assert.equal(s.capture.status().captured, true);
  assert.equal(s.root.VoiceDiagnostics.get().requestStatus, 'not_sent'); assert.equal(s.root.VoiceDiagnostics.get().httpStatus, null);
  assert.equal(s.root.VoiceDiagnostics.history().length, 1); assert.equal(s.counts().network, 0);
  assert.equal(JSON.stringify(s.root.VoiceDiagnostics.history()).includes('unit-secret'), false);
  for (let i=0;i<3;i++) assert.equal((await s.voice.start({token:'unit-secret'})).localCaptureBlocked, true);
  assert.equal(s.counts().starts, 1); assert.throws(() => s.capture.arm()); s.capture.discard();
});
test('one export preserves exact PCM16 WAV bytes and SHA-256; bounds, expiry and reinstall are safe', async () => {
  const s = setup(); await record(s); const meta = s.capture.claimExport(), chunks = [];
  for (let i = 0; i < meta.bytes; i += 32768) chunks.push(Buffer.from(s.capture.readChunk(i), 'base64'));
  const exported = Buffer.concat(chunks); assert.deepEqual(exported, Buffer.from(makeAudio()));
  assert.equal(crypto.createHash('sha256').update(exported).digest('hex'), meta.sha256);
  assert.throws(() => s.capture.claimExport()); assert.throws(() => s.capture.readChunk(0, 32769));
  assert.equal(install(s.root), s.capture); s.expire(); assert.equal(s.capture.status().captured, false);
  assert.throws(() => s.capture.claimExport()); assert.throws(() => s.capture.arm());
});
test('missing, replaced or unarmed handler blocks microphone and has no cloud fallback', async () => {
  for (const change of [s=>{}, s=>{delete s.root.BudgetPROLocalWavCapture;}, s=>{s.capture.arm();s.root.VoiceApiClient={transcribe(){throw Error('NETWORK');}};}]) {
    const s = setup(); change(s); assert.equal((await s.voice.start({token:'unit-secret'})).localCaptureBlocked, true);
    assert.equal(s.counts().starts, 0); assert.equal(s.counts().network, 0);
  }
  assert.throws(() => install({}), /LOCAL_DEBUG_REQUIRED/);
});
test('WAV validation rejects truncated/header/channel/rate/bits failures without retaining or networking', async () => {
  const bad = [new ArrayBuffer(10)];
  for (const [offset, value, width] of [[22,2,2],[24,48000,4],[34,8,2],[40,1,4]]) { const a=makeAudio(), v=new DataView(a); v[width===2?'setUint16':'setUint32'](offset,value,true);bad.push(a); }
  for (const audio of bad) { const s = setup({audio}); assert.equal((await record(s)).localCaptureError, 'LOCAL_INVALID_WAV'); assert.equal(s.capture.status().captured,false); assert.equal(s.capture.status().state,'ERROR'); assert.equal(s.counts().network,0); }
});
test('Cancel during recording consumes one slot, closes capture, does not fabricate completion', async () => {
  const s = setup(); s.capture.arm(); const p = s.voice.start({token:'unit-secret'});await tick();s.voice.cancel();
  assert.equal((await p).cancelled,true);assert.equal(s.capture.status().state,'CANCELLED');assert.equal(s.capture.status().captured,false);assert.throws(()=>s.capture.arm());
  assert.equal(s.states.at(-1).debugCaptureState,'CANCELLED');assert.equal(s.counts().network,0);
});
test('permission and first-frame readiness precede Stop/VAD; pending setup cannot auto-finish', async () => {
  const s=setup({pendingReady:true});s.capture.arm();const p=s.voice.start({token:'unit-secret'});await tick();
  s.frame({ended:true,speech:true,elapsed:1000,rms:.1});s.voice.stop();assert.equal(s.capture.status().captured,false);assert.equal(s.states.at(-1).status,'requesting');
  s.ready();await tick();assert.equal(s.states.at(-1).status,'listening');s.voice.stop();assert.equal((await p).localCaptureComplete,true);s.capture.discard();
});
test('authorization missing fails before microphone and never retains tokens', async()=>{const s=setup();s.capture.arm();assert.equal((await s.voice.start()).localCaptureError,'VOICE_AUTH_REQUIRED');assert.equal(s.counts().starts,0);assert.equal(s.capture.status().captured,false);});
test('Cancel during async digest cannot retain a late WAV or emit completion',async()=>{
 const s=setup();let finishDigest;
 s.root.crypto={randomUUID:crypto.randomUUID,subtle:{digest:()=>new Promise(r=>finishDigest=r)}};
 s.capture.arm();const p=s.voice.start({token:'unit-secret'});await tick();s.voice.stop();await tick();assert.equal(typeof finishDigest,'function');
 s.voice.cancel();assert.equal((await p).cancelled,true);finishDigest(new ArrayBuffer(32));await tick();
 assert.equal(s.capture.status().captured,false);assert.equal(s.capture.status().state,'CANCELLED');assert.equal(s.states.some(x=>x.debugCaptureState==='CAPTURE_COMPLETE'),false);
 assert.equal(s.counts().network,0);
});
test('incomplete financial guard or replaced debug session invalidates readiness before mic',async()=>{
 for(const change of [s=>{s.root.BudgetPROVoiceDebug.guardReady=false;},s=>{s.root.BudgetPROVoiceModule={...s.voice};}]){
  const s=setup();s.capture.arm();change(s);assert.equal(s.capture.status().installed,false);
  assert.equal((await s.voice.start({token:'unit-secret'})).localCaptureBlocked,true);assert.equal(s.counts().starts,0);
 }
});
