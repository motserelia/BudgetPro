'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), crypto = require('node:crypto');
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup({ pendingStart = false, transcribe } = {}) {
  let recorder, ready, uploads = 0;
  const ctx = { BudgetPROVoiceDebug: { saveBlocked: true }, location: { hostname: 'budgetpro.app' }, crypto, Date, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem() {} }, document: { addEventListener() {} }, console, AbortController, setTimeout, clearTimeout,
    VoiceTranscriptValidator: require('../../www/voice/transcript-validator'), BudgetPROVoiceNumberNormalizer: require('../../www/voice/number-normalizer'),
    VoiceRecorder: class { constructor(_, frame) { recorder = this; this.frame = frame; } start() { return pendingStart ? new Promise(resolve => ready = resolve) : Promise.resolve(); } close() {} async finish() { return { wav: new ArrayBuffer(44), metrics: { duration: 500 } }; } },
    VoiceApiClient: { async transcribe(options) { uploads++; return transcribe ? transcribe(options) : { transcript: 'ყავაში რვა ლარი გადავიხადე', provider: 'groq', model: 'whisper-large-v3' }; } }
  };
  for (const name of ['voice-diagnostics', 'voice-session']) vm.runInNewContext(fs.readFileSync(`www/voice/${name}.js`, 'utf8'), ctx);
  return { ctx, voice: ctx.BudgetPROVoiceModule, diag: ctx.VoiceDiagnostics, frame: m => recorder.frame(m), ready: () => ready(), uploads: () => uploads };
}
test('microphone is not shown as listening and cannot auto-send until recorder.start resolves', async () => {
  const s = setup({ pendingStart: true }); let state;
  s.voice.subscribe(next => state = next);
  const p = s.voice.start({ token: 'unit-token' }); await tick();
  assert.equal(state.status, 'requesting');
  s.frame({ rms: .05, peak: .2, elapsed: 1000, speechDuration: 500, speech: true, ended: true });
  await tick(); assert.equal(state.status, 'requesting'); assert.equal(s.uploads(), 0);
  s.voice.stop(); assert.equal(s.uploads(), 0);
  s.ready(); await tick(); assert.equal(state.status, 'listening'); s.voice.cancel(); await p;
});
test('successful attempt survives a later HTTP 423; history snapshots are independent', async () => {
  let calls = 0;
  const s = setup({ transcribe: async () => {
    if (++calls === 2) throw Object.assign(new Error('blocked'), { code: 'DEBUG_AUDIO_NOT_ARMED', diagnostics: { httpStatus: 423 } });
    return { transcript: 'ყავაში რვა ლარი გადავიხადე', provider: 'groq', model: 'whisper-large-v3' };
  } });
  for (let i = 0; i < 2; i++) { const p = s.voice.start({ token: 'unit-token' }); await tick(); s.voice.stop(); s.voice.stop(); await p; }
  const history = s.diag.history(); assert.equal(history.length, 2);
  assert.notEqual(history[0].sessionId, history[1].sessionId);
  assert.equal(history[0].rawTranscript, 'ყავაში რვა ლარი გადავიხადე');
  assert.equal(history[0].normalizedTranscript, 'ყავაში 8 ლარი გადავიხადე');
  assert.equal(history[0].asrStatus, 'success'); assert.equal(history[1].httpStatus, 423);
  history[0].rawTranscript = 'tampered'; assert.notEqual(s.diag.history()[0].rawTranscript, 'tampered');
  assert.equal(s.uploads(), 2);
});
test('debug history is bounded to ten, unique, memory only and sanitized', () => {
  const s = setup();
  for (let i = 0; i < 12; i++) s.diag.begin({ sessionId: 'same', token: 'unit-secret', transactions: [{ private: true }], voiceApiUrl: 'https://example.invalid/?token=private' });
  const history = s.diag.history(); assert.equal(history.length, 10); assert.equal(new Set(history.map(d => d.sessionId)).size, 10);
  s.diag.update({ rawTranscript: 'Bearer unit-secret gsk_123456789abcdef', authorization: 'unit-secret', refresh_token: 'unit-secret' });
  const exported = s.diag.format();
  for (const secret of ['unit-secret', 'gsk_123456789abcdef', 'transactions', '?token=private']) assert.equal(exported.includes(secret), false);
  s.diag.update({ voiceApiUrl: 'https://unit.invalid/api/voice/transcribe?token=private#secret' });
  assert.equal(s.diag.get().voiceApiUrl, 'https://unit.invalid/api/voice/transcribe');
  s.diag.discard(); assert.equal(s.diag.history().length, 10);
  const fresh = setup(); assert.equal(fresh.diag.history().length, 0);
  delete fresh.ctx.BudgetPROVoiceDebug; fresh.diag.begin({ sessionId: 'normal' }); assert.equal(fresh.diag.history().length, 0);
});
test('late response after cancel cannot overwrite a new attempt or call its financial parser', async () => {
  let finish, callbacks = 0;
  const s = setup({ transcribe: () => new Promise(resolve => finish = resolve) });
  const old = s.voice.start({ token: 'unit-token', onTranscript: () => callbacks++ }); await tick(); s.voice.stop(); await tick();
  const oldId = s.diag.get().sessionId; s.voice.cancel(); await old;
  const next = s.voice.start({ token: 'unit-token' }); await tick(); const id = s.diag.get().sessionId;
  finish({ transcript: 'old response', provider: 'groq' }); await tick();
  assert.equal(callbacks, 0); assert.equal(s.diag.get().sessionId, id); assert.equal(s.diag.get().rawTranscript, '');
  assert.equal(s.diag.get(oldId).captureStatus, 'cancelled');
  s.diag.update({ httpStatus: 423 }, oldId); assert.equal(s.diag.get().httpStatus, null);
  s.voice.cancel(); await next;
});
test('API diagnostics use attempt IDs and ignore a cancelled late HTTP response', async () => {
  const s = setup(); let respond;
  Object.assign(s.ctx, { URL, DOMException, BudgetPROApiConfig: { getApiUrl: () => 'https://unit.invalid/api/voice/transcribe' }, fetch: () => new Promise(resolve => respond = resolve) });
  vm.runInNewContext(fs.readFileSync('www/voice/voice-api-client.js', 'utf8'), s.ctx);
  const oldId = crypto.randomUUID(); s.diag.begin({ sessionId: oldId });
  const controller = new AbortController();
  const pending = s.ctx.VoiceApiClient.transcribe({ wav: new ArrayBuffer(44), language: 'ka', mode: 'auto', sessionId: oldId, token: 'unit-token', signal: controller.signal });
  controller.abort(); const newId = crypto.randomUUID(); s.diag.begin({ sessionId: newId });
  respond(new Response(JSON.stringify({ ok: true, sessionId: oldId, requestedLanguage: 'ka', provider: 'groq', model: 'whisper-large-v3', transcript: 'late text' }), { status: 200 }));
  await assert.rejects(pending, e => e.name === 'AbortError');
  assert.equal(s.diag.get().sessionId, newId); assert.equal(s.diag.get().rawTranscript, ''); assert.equal(s.diag.get(oldId).rawTranscript, '');
  s.ctx.fetch = async () => new Response(JSON.stringify({ ok: false, error: 'invalid-script', diagnostics: { rawTranscript: 'wrong script' } }), { status: 422 });
  await assert.rejects(s.ctx.VoiceApiClient.transcribe({ wav: new ArrayBuffer(44), language: 'ka', mode: 'auto', sessionId: newId, token: 'unit-token', signal: new AbortController().signal }), e => e.code === 'invalid-script');
  assert.equal(s.diag.get(newId).rawTranscript, 'wrong script'); assert.equal(s.diag.get(newId).httpStatus, 422);
});
test('Stop, VAD and repeated events share one upload; history identifies trigger and explicit restart', async () => {
  const s = setup(); const p = s.voice.start({ token: 'unit-token', diagnosticSource: 'settings_start' }); await tick();
  s.frame({ rms: .05, peak: .2, elapsed: 1000, speechDuration: 500, ended: true });
  s.voice.stop(); s.voice.stop(); await p; await tick();
  assert.equal(s.uploads(), 1); const first = s.diag.get();
  assert.equal(first.finishTrigger, 'vad'); assert.equal(first.launchSource, 'settings_start');
  for (const name of ['start', 'microphone_requested', 'recording_ready', 'finish', 'capture_complete', 'send', 'response', 'normalized']) assert.ok(first.events.some(e => e.event === name), name);
  const next = s.voice.start({ token: 'unit-token', diagnosticSource: 'overlay_retry' }); await tick();
  assert.equal(s.diag.get().launchSource, 'overlay_retry'); assert.notEqual(s.diag.get().sessionId, first.sessionId);
  s.voice.cancel(); await next; assert.equal(s.uploads(), 1);
});
test('financial parser failure is recorded independently of a successful ASR response', async () => {
  const s = setup(); const p = s.voice.start({ token: 'unit-token', onTranscript() { throw Error('private parser message'); } });
  await tick(); s.voice.stop(); await p;
  assert.equal(s.diag.get().asrStatus, 'success'); assert.equal(s.diag.get().financialParseStatus, 'failed');
  assert.equal(s.diag.get().financialParseError, 'FINANCIAL_PARSE_FAILED'); assert.equal(s.diag.format().includes('private parser message'), false);
});
test('Georgian words and compounds normalize without inventing a missing amount', () => {
  const n = require('../../www/voice/number-normalizer').normalizeNumbers;
  for (const [text, value] of [['რვა', '8'], ['ოცდარვა', '28'], ['ორი ათას ხუთასი', '2500'], ['რვა მძიმე ხუთი', '8.5']]) assert.equal(n(text, 'ka'), value);
  assert.equal(n('ავაშირვა ლარი გადავიხადე', 'ka'), 'ავაშირვა ლარი გადავიხადე');
  const source = fs.readFileSync('www/index.js', 'utf8');
  const start = source.indexOf('function parseVoiceInput('), end = source.indexOf('\nfunction getVoiceFallbackCategory', start);
  const s = setup(); s.diag.begin({ sessionId: crypto.randomUUID() }); s.diag.update({ asrStatus: 'success' });
  let shown = 0;
  s.ctx.displayCurrency='GEL';s.ctx.VoiceDraftSafety=require('../../www/voice/voice-draft-safety');s.ctx.window = s.ctx; s.ctx.BudgetPROVoiceModule.setLanguage('ka');
  s.ctx.buildVoiceDraftFromText = () => ({ type: 'expense', amount: null, category: '' });
  s.ctx.openVoiceQuickModal = draft => { assert.equal(draft.amount, null); shown++; };
  vm.runInNewContext(source.slice(start, end), s.ctx); s.ctx.parseVoiceInput('ავაშირვა ლარი გადავიხადე', [], s.diag.get().sessionId);
  assert.equal(shown, 1); assert.equal(s.diag.get().financialParseStatus, 'needs_input');
  assert.equal(s.diag.get().financialParseError, 'FINANCIAL_DRAFT_INCOMPLETE'); assert.equal(s.diag.get().asrStatus, 'success');
  assert.equal(s.diag.get().parserInput, 'ავაშირვა ლარი გადავიხადე');
});
test('real financial amount parser refuses corrupted Georgian but accepts normalized 8, 28 and 2500', () => {
  const source = fs.readFileSync('www/index.js', 'utf8'), ctx = {};
  for (const name of ['normalizeVoiceMeaningText', 'parseVoiceNumericCandidate', 'parseGeorgianCompactNumberToken', 'parseVoiceTokenNumber', 'parseVoiceNumericPhrase', 'parseGeorgianMoneyUnits', 'parseVoiceNumberWords', 'extractVoiceCurrencyPairAmount', 'extractVoiceAmount']) {
    const start = source.indexOf(`function ${name}(`); assert.ok(start >= 0);
    vm.runInNewContext(source.slice(start, source.indexOf('\n}', start) + 2), ctx);
  }
  assert.equal(ctx.extractVoiceAmount('ავაშირვა ლარი გადავიხადე'), null);
  for (const n of [8, 28, 2500]) assert.equal(ctx.extractVoiceAmount(`ყავაში ${n} ლარი გადავიხადე`), n);
});
test('recorder readiness waits for first PCM and Stop flush preserves all initial PCM', async () => {
  let giveMic, resume, node;
  class Context { constructor() { this.sampleRate=16000;this.state='suspended';this.destination={};this.audioWorklet={addModule:async()=>{}}; } createMediaStreamSource(){return{connect(){},disconnect(){}};} resume(){return new Promise(resolve=>resume=()=>{this.state='running';resolve();});} async close(){this.state='closed';} }
  class Detector {constructor(){this.config={minimum:.001};this.speechDuration=0;this.noiseFloor=.001;this.started=false;this.count=0;}process(){this.count++;this.speechDuration+=100;this.started=this.count>=3;return{rms:.1,peak:.2,elapsed:this.count*20,speechDuration:this.speechDuration};}}
  const frames=[];
  const ctx={URL,Float32Array,Date,setTimeout,clearTimeout,document:{currentScript:{src:'https://budgetpro.app/voice/voice-recorder.js'}},navigator:{mediaDevices:{getSupportedConstraints:()=>({}),getUserMedia:()=>new Promise(resolve=>giveMic=resolve)}},AudioContext:Context,AudioWorkletNode:class{constructor(){node=this;this.port={close(){},postMessage(){node.port.onmessage({data:{type:'stopped',sequence:4,samples:4096}});}};}connect(){}disconnect(){}},VoiceActivityDetector:{Detector},VoicePCM:require('../../www/voice/pcm')};
  vm.runInNewContext(fs.readFileSync('www/voice/voice-recorder.js','utf8'),ctx);
  const recorder=new ctx.VoiceRecorder('auto',m=>frames.push(m));let resolved=false;
  const ready=recorder.start().then(()=>resolved=true);await tick();assert.equal(resolved,false);
  giveMic({getTracks:()=>[{stop(){}}]});await tick();resume();await tick();assert.equal(resolved,false);
  for(let i=1;i<=3;i++)node.port.onmessage({data:{type:'pcm',sequence:i,samples:new Float32Array(1024).fill(i/10)}});
  assert.equal(frames[0].recordingReadyAt,undefined);await ready;assert.equal(resolved,true);
  node.port.onmessage({data:{type:'pcm',sequence:4,samples:new Float32Array(1024).fill(.4)}});
  const result=await recorder.finish();assert.ok(result.metrics.microphoneRequestedAt<=result.metrics.microphoneAcquiredAt);assert.ok(result.metrics.workletReadyAt<=result.metrics.recordingReadyAt);assert.ok(result.metrics.firstFrameAt);assert.ok(result.metrics.firstSpeechAt);assert.ok(result.metrics.vadStartedAt);assert.equal(result.metrics.flushAcknowledged,true);assert.equal(result.wav.byteLength,44+4096*2);assert.ok(Math.abs(new DataView(result.wav).getInt16(44,true)/32768-.1)<.001);
});
