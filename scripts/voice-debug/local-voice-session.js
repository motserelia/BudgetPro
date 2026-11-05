// Bundled ONLY in the isolated local-Vosk APK in place of voice-session.js.
(function(root) {
  'use strict';
  let active = null, state = { status: 'ready', meter: 0, error: null, transcript: '', debugCaptureState: 'READY' };
  const listeners = new Set();
  const diag = (s, data) => root.VoiceDiagnostics.update(data, s.id);
  const event = (s, name) => root.VoiceDiagnostics.event(name, {}, s.id);
  const emit = data => {
    state = { ...state, ...data, diagnostics: root.VoiceDiagnostics.get() };
    for (const fn of listeners) { try { fn(state); } catch {} }
    root.BudgetPROVoiceDebug?.showState(state.debugCaptureState);
  };
  const getLanguage = () => 'ka';
  const getMode = () => { const raw = root.localStorage.getItem('budgetpro_voice_mode'); return ['quiet', 'noise'].includes(raw) ? raw : 'auto'; };
  function fail(s, code) {
    if (active !== s) return;
    active = null; clearTimeout(s.timer); s.controller.abort(); s.capture?.fail(s.id); Promise.resolve(s.recorder?.close()).catch(() => {});
    diag(s, { error: code, errorPhase: 'capture', captureStatus: 'failed', requestStatus: 'not_sent', httpStatus: null, asrStatus: 'not_started' }); event(s, 'local_capture_error');
    emit({ status: 'ready', error: null, meter: 0, debugCaptureState: 'ERROR' }); s.resolve({ handled: true, localCaptureError: code });
  }
  function cancel() {
    const s = active; active = null;
    if (s) { clearTimeout(s.timer); s.controller.abort(); s.capture?.cancel(s.id); Promise.resolve(s.recorder?.close()).catch(() => {}); diag(s, { captureStatus: 'cancelled', requestStatus: 'not_sent', asrStatus: 'not_started' }); event(s, 'cancel'); s.resolve({ handled: true, cancelled: true }); }
    emit({ status: 'ready', error: null, meter: 0, debugCaptureState: 'CANCELLED' });
  }
  async function finish(s, trigger = 'stop') {
    if (active !== s || s.finishing || !s.recording) return;
    s.finishing = true; clearTimeout(s.timer); event(s, 'finish');
    try {
      const recording = await s.recorder.finish(); if (active !== s) return;
      diag(s, { ...recording.metrics, captureStatus: 'complete', captureStoppedAt: Date.now(), wavBytes: recording.wav.byteLength, finishTrigger: trigger, requestStatus: 'not_sent' });
      if (s.capture !== root.BudgetPROLocalWavCapture || !s.capture.status().installed) throw Error('LOCAL_CAPTURE_MISSING');
      const result = await root.VoiceApiClient.transcribe({ wav: recording.wav, language: 'ka', sessionId: s.id, signal: s.controller.signal });
      if (active !== s) return;
      if (!s.capture.isCompletion(result, s.id)) throw Error('LOCAL_CAPTURE_INVALID_RESULT');
      active = null;
      diag(s, { stage: 'local_capture', error: null, httpStatus: null, captureStatus: 'complete', requestStatus: 'not_sent', asrStatus: 'not_started', financialParseStatus: 'not_started' }); event(s, 'local_capture_complete');
      emit({ status: 'ready', error: null, transcript: '', meter: 0, debugCaptureState: 'CAPTURE_COMPLETE' });
      s.resolve({ handled: true, localCaptureComplete: true });
    } catch (e) { fail(s, /^[A-Z_]{1,64}$/.test(e.code || e.message || '') ? e.code || e.message : 'LOCAL_CAPTURE_ERROR'); }
  }
  function start(options = {}) {
    if (active) return Promise.resolve({ handled: true, busy: true });
    const capture = root.BudgetPROLocalWavCapture;
    if (root.BudgetPROVoiceDebug?.buildRevision !== 4 || !root.BudgetPROVoiceDebug?.guardReady || !root.BudgetPROVoiceDebug?.localOnly || !capture?.canStart()) {
      root.BudgetPROVoiceDebug?.trace('start_blocked'); emit({ status: 'ready', debugCaptureState: 'ERROR', error: null });
      return Promise.resolve({ handled: true, localCaptureBlocked: true });
    }
    return new Promise(resolve => {
      const s = { id: root.crypto.randomUUID(), capture, controller: new AbortController(), resolve, recording: false, finishing: false };
      active = s; root.VoiceDiagnostics.begin({ sessionId: s.id, voiceLanguage: 'ka', locale: 'ka-GE', mode: getMode(), launchSource: 'local_debug', requestStatus: 'not_sent', asrStatus: 'not_started' }); event(s, 'start');
      emit({ status: 'authenticating', debugCaptureState: 'READY', transcript: '', error: null });
      Promise.resolve().then(() => options.getToken ? options.getToken(s.controller.signal) : options.token).then(async token => {
        if (active !== s) return;
        if (!token) { fail(s, 'VOICE_AUTH_REQUIRED'); return; }
        diag(s, { authPresent: true }); // Never retain/forward the token.
        if (capture !== root.BudgetPROLocalWavCapture || !capture.canStart()) throw Error('LOCAL_CAPTURE_MISSING');
        capture.begin(s.id);
        s.recorder = new root.VoiceRecorder(getMode(), metrics => {
          if (active !== s || s.finishing) return;
          diag(s, { ...metrics, duration: metrics.elapsed, speechDuration: metrics.speechDuration, RMS: metrics.rms });
          if (!s.recording) return;
          emit({ status: metrics.speech ? 'speech' : 'listening', meter: Math.min(1, Math.sqrt(metrics.rms || 0) * 2), debugCaptureState: 'RECORDING' });
          if (metrics.ended || metrics.elapsed >= 29000) finish(s, metrics.ended ? 'vad' : 'duration_limit');
        });
        diag(s, { captureStatus: 'initializing', microphoneRequestedAt: Date.now() }); event(s, 'microphone_requested');
        emit({ status: 'requesting', debugCaptureState: 'RECORDING' }); await s.recorder.start();
        if (active !== s) { await s.recorder.close(); return; }
        s.recording = true; diag(s, { captureStatus: 'ready', recordingReadyAt: Date.now() }); event(s, 'recording_ready');
        emit({ status: 'listening', debugCaptureState: 'RECORDING' }); s.timer = setTimeout(() => finish(s, 'timer'), 29000);
      }).catch(e => fail(s, e.code || 'LOCAL_CAPTURE_ERROR'));
    });
  }
  root.document?.addEventListener('visibilitychange', () => { if (root.document.hidden && active) cancel(); });
  root.BudgetPROVoiceModule = { protocolVersion: 3, start, cancel, stop: () => active && finish(active), isActive: () => !!active, getLanguage, getMode, setLanguage() {}, setMode() {}, subscribe(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); }, getDiagnostics: () => root.VoiceDiagnostics.get(), disposeScreen: cancel };
})(globalThis);
