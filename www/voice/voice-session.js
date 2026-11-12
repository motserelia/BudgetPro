(function(root) {
  'use strict';
  const locales = { auto: 'auto', ru: 'ru-RU', en: 'en-US', ka: 'ka-GE' };
  let active = null, state = { status: 'ready', meter: 0, error: null, transcript: '' };
  const listeners = new Set();
  const update = (session, data) => root.VoiceDiagnostics.update(data, session.id);
  const event = (session, name, data) => root.VoiceDiagnostics.event?.(name, data, session.id);
  const emit = data => { state = { ...state, ...data, diagnostics: root.VoiceDiagnostics.get() }; if (typeof root.dispatchEvent === 'function') root.dispatchEvent(new CustomEvent('budgetpro:voice-state', { detail: state })); for (const listener of listeners) { try { listener(state); } catch (e) { console.error('Voice UI update failed'); } } };
  // The ka, ru and en Vosk models are packaged into the APK, so the interface
  // language is adopted for all three. "auto" stays untouched.
  const interfaceLanguage = () => { const app = localStorage.getItem('lang'); return app === 'ka' || app === 'ru' || app === 'en' ? app : null; };
  const getLanguage = () => { const raw = localStorage.getItem('voiceLanguage') || localStorage.getItem('budgetpro_voice_language'); if (!raw) return interfaceLanguage() || 'auto'; return Object.hasOwn(locales, raw) ? raw : 'auto'; };
  const getMode = () => { const raw = localStorage.getItem('budgetpro_voice_mode') || 'auto', migrated = { whisper: 'quiet', street: 'noise' }[raw] || raw; const mode = ['auto', 'quiet', 'noise'].includes(migrated) ? migrated : 'auto'; if (raw !== mode) localStorage.setItem('budgetpro_voice_mode', mode); return mode; };
  // Hybrid routing (Э2): online uses the cloud ASR for every language, offline uses
  // Vosk for Georgian and Whisper for Russian/English/auto. The manual engine switch
  // is gone, so a stale budgetpro_voice_engine flag is ignored instead of read.
  const isOnline = () => root.navigator?.onLine !== false;
  const isNative = () => root.Capacitor?.isNativePlatform?.() === true && root.Capacitor?.getPlatform?.() === 'android';
  // The Vosk adapter reports isLocal() === true only inside the Android build.
  const hasDeviceEngine = () => isNative() || root.VoiceApiClient?.isLocal?.() === true;
  const route = language => root.VoiceProvider?.select
    ? root.VoiceProvider.select({ language, online: isOnline(), native: hasDeviceEngine() })
    // Fail closed to the offline engine if the provider script is missing.
    : { engine: hasDeviceEngine() ? (language === 'ka' ? 'vosk' : 'whisper') : 'cloud', local: hasDeviceEngine(), language };
  const getEngine = () => route(getLanguage()).engine;
  function cancel() {
    const session = active; active = null;
    if (session) { update(session, { captureStatus: 'cancelled', requestStatus: session.finishing ? 'cancelled' : 'not_sent' }); event(session, 'cancel'); session.controller.abort(); clearTimeout(session.timer); Promise.resolve(session.recorder.close()).catch(() => {}); session.resolve({ handled: true, cancelled: true }); }
    root.VoiceDiagnostics.discard(); emit({ status: 'ready', error: null, meter: 0 });
  }
  async function finish(session, trigger = 'stop') {
    let capturedWav;
    if (active !== session || session.finishing) return; session.finishing = true; session.recording = false; clearTimeout(session.timer);
    update(session, { finishTrigger: trigger, captureStatus: 'stopping' }); event(session, 'finish', { finishTrigger: trigger });
    try {
      emit({ status: 'sending', meter: 0 });
      const recording = await session.recorder.finish(); capturedWav=recording.wav; if (active !== session) return;
      session.captureComplete = true;
      update(session, { ...recording.metrics, captureStatus: 'complete', wavBytes: recording.wav.byteLength }); root.VoiceDiagnostics.retain(recording.wav);
      event(session, 'capture_complete');
      // A token can expire during the 29-second recording. Re-read/refresh through
      // the same app session before upload, without recording or sending twice.
      if (!session.local && session.options.getToken) {
        session.options.token = await session.options.getToken(session.controller.signal);
        if (active !== session) return;
        if (!session.options.token) throw Object.assign(new Error('VOICE_AUTH_REQUIRED'), { code: 'VOICE_AUTH_REQUIRED' });
      }
      emit({ status: 'transcribing' });
      update(session, { requestStarted: new Date().toISOString(), requestStatus: session.local ? 'not_sent' : 'sending' }); event(session, 'send');
      session.uploadStarted = true;
      const client = session.engine === 'whisper' ? root.VoiceWhisperClient : session.engine === 'vosk' ? root.VoiceApiClient : (root.VoiceCloudClient || root.VoiceApiClient);
      const result = await client.transcribe({ wav: recording.wav, language: session.language, mode: session.mode, sessionId: session.id, hints: session.options.hints || [], token: session.options.token, signal: session.controller.signal });
      if (active !== session) return;
      const validation = root.VoiceTranscriptValidator.validateTranscript(result.transcript, session.language);
      update(session, { stage: 'asr', requestStatus: session.local ? 'not_sent' : 'complete', responseStatus: 'received', asrStatus: 'success', provider: result.provider, model: result.model, region: result.region, responseTime: result.responseTime, detectedLanguage: result.detectedLanguage, rawTranscript: result.transcript, ...validation.script, georgianChars: validation.script.georgian, cyrillicChars: validation.script.cyrillic, latinChars: validation.script.latin, validation: validation.reason }); event(session, 'response');
      if (!validation.valid) throw Object.assign(new Error(validation.reason), { code: validation.reason });
      const lang = session.language === 'auto' ? result.detectedLanguage || 'auto' : session.language;
      const text = root.BudgetPROVoiceNumberNormalizer.normalizeNumbers(result.transcript, lang);
      update(session, { normalizedTranscript: text }); event(session, 'normalized'); active = null;
      emit({ status: 'done', transcript: text, error: null, meter: 0 });
      try { session.options.onTranscript?.(text, [], session.id); }
      catch { update(session, { financialParseStatus: 'failed', financialParseError: 'FINANCIAL_PARSE_FAILED' }); event(session, 'parse_failed'); }
      session.resolve({ handled: true, text });
    } catch (error) { fail(session, error); } finally { if(session.local && capturedWav instanceof ArrayBuffer)new Uint8Array(capturedWav).fill(0); }
  }
  function fail(session, error) {
    if (active !== session) return;
    active = null; clearTimeout(session.timer); session.controller.abort(); Promise.resolve(session.recorder.close()).catch(() => {});
    const code = error.code || ({ NotAllowedError: 'MICROPHONE_DENIED', MICROPHONE_PERMISSION_DENIED: 'MICROPHONE_DENIED', NotFoundError: 'MICROPHONE_MISSING', NotReadableError: 'MICROPHONE_MISSING' }[error.name]) || 'CAPTURE_ERROR';
    update(session, { ...(error.diagnostics || {}), error: code, errorPhase: session.uploadStarted ? 'asr' : session.captureComplete ? 'authorization' : 'capture', asrStatus: session.uploadStarted ? 'failed' : 'not_started', requestStatus: session.local ? 'not_sent' : session.uploadStarted ? 'failed' : 'not_sent', captureStatus: session.captureComplete ? 'complete' : 'failed', responseStatus: error.diagnostics?.httpStatus ? 'error' : null }); event(session, 'failed'); emit({ status: code === 'NO_SPEECH' ? 'no-speech' : 'error', error: code, meter: 0 }); session.resolve({ handled: true, error: code });
  }
  function start(options = {}) {
    if (active) return Promise.resolve({ handled: true, busy: true });
    const language = getLanguage(), mode = getMode(), id = crypto.randomUUID();
    const launchSource = ['main', 'overlay_retry', 'settings_start', 'settings_retry', 'draft_retry', 'floating_pointer', 'floating_keyboard', 'unknown'].includes(options.diagnosticSource) ? options.diagnosticSource : 'unknown';
    root.VoiceDiagnostics.begin({ sessionId: id, voiceLanguage: language, locale: locales[language], mode, authPresent: !!options.token, httpStatus: null, launchSource });
    return new Promise(resolve => {
      const decision = route(language);
      const session = { id, language, mode, options, resolve, controller: new AbortController(), finishing: false, engine: decision.engine, local: decision.local === true };
      event(session, 'start', { launchSource });
      session.recorder = new root.VoiceRecorder(mode, metrics => {
        if (active !== session || session.finishing) return;
        update(session, { ...metrics, duration: metrics.elapsed, speechDuration: metrics.speechDuration, RMS: metrics.rms, peak: metrics.peak, noiseFloor: metrics.noiseFloor });
        if (!session.recording) return;
        emit({ status: metrics.speech ? 'speech' : 'listening', meter: Math.min(1, Math.sqrt(metrics.rms) * 2), clipped: metrics.peak >= .99 });
        if ((!session.local && metrics.ended) || metrics.elapsed >= 29000) finish(session, metrics.ended ? 'vad' : 'duration_limit');
      }); active = session;
      emit({ status: 'authenticating', transcript: '', error: null, meter: 0 });
      const whisper = session.engine === 'whisper';
      // The cloud route is the online engine; browser builds have no offline one.
      if (session.engine === 'cloud' && !isOnline()) { fail(session, { code: 'OFFLINE' }); return; }
      if (whisper && root.VoiceWhisperClient?.isLocal?.() !== true) { fail(session, { code: 'WHISPER_NATIVE_UNAVAILABLE' }); return; }
      if (session.engine === 'vosk' && root.VoiceApiClient.isLocal?.() !== true) { fail(session, { code: 'VOSK_NATIVE_UNAVAILABLE' }); return; }
      // Whisper is multilingual, so it also accepts the "auto" language; Vosk needs a concrete model.
      if (whisper && !root.VoiceWhisperClient.supportsLanguage(language)) { fail(session, { code: 'WHISPER_LANGUAGE_REQUIRED' }); return; }
      if (session.engine === 'vosk' && !['ru','ka','en'].includes(language)) { fail(session, { code: 'VOSK_LANGUAGE_REQUIRED' }); return; }
      Promise.resolve().then(() => session.local ? null : options.getToken ? options.getToken(session.controller.signal) : options.token).then(token => {
        if (active !== session) return;
        session.options.token = token || '';
        update(session, { authPresent: !!token });
        if (!session.local && !token) { fail(session, { code: 'VOICE_AUTH_REQUIRED' }); return; }
        update(session, { captureStatus: 'initializing' }); event(session, 'microphone_requested'); emit({ status: 'requesting' });
        return session.recorder.start().then(() => {
          if (active !== session) return;
          session.recording = true; update(session, { captureStatus: 'ready', recordingReadyAt: Date.now() }); event(session, 'recording_ready'); session.timer = setTimeout(() => finish(session, 'timer'), 29000); emit({ status: 'listening' });
        });
      }).catch(e => fail(session, e));
    });
  }
  root.document?.addEventListener('visibilitychange', () => { if (root.document.hidden && active) cancel(); });
  root.BudgetPROVoiceModule = { start, cancel, stop() { if (active) event(active, 'stop_requested'); if (active?.recording && !active.finishing) finish(active); }, isActive: () => !!active, getLanguage, getMode, getEngine, setLanguage(v) { if (!active && Object.hasOwn(locales, v)) localStorage.setItem('voiceLanguage', v); }, setMode(v) { if (!active && ['auto', 'quiet', 'noise'].includes(v)) localStorage.setItem('budgetpro_voice_mode', v); }, subscribe(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); }, getDiagnostics: () => root.VoiceDiagnostics.get(), disposeScreen: cancel };
})(globalThis);
