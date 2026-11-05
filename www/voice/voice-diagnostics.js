(function(root) {
  'use strict';
  let last = null, audio = null;
  const attempts = [];
  const debug = () => !!root.BudgetPROVoiceDebug || ['localhost', '127.0.0.1'].includes(root.location?.hostname);
  const fields = new Set(('sessionId voiceLanguage locale mode authPresent httpStatus captureFormat sampleRate sourceSampleRate channels duration speechDuration RMS peak noiseFloor gain georgianChars cyrillicChars latinChars digits provider model region stage asrStatus financialParseStatus financialParseError requestStarted responseTime detectedLanguage rawTranscript normalizedTranscript validation error errorPhase captureStatus requestStatus responseStatus launchSource finishTrigger microphoneRequestedAt microphoneAcquiredAt audioContextCreatedAt workletReadyAt recordingReadyAt firstFrameAt firstSpeechAt vadStartedAt captureStoppedAt wavBytes parserInput').split(' '));
  fields.add('voiceApiUrl');
  const clean = data => {
    const safe = Object.fromEntries(Object.entries(data || {}).filter(([key, value]) => fields.has(key) && (debug() || !['rawTranscript','normalizedTranscript','parserInput'].includes(key)) && (value === null || ['string', 'number', 'boolean'].includes(typeof value))).map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 20000).replace(/Bearer\s+\S+|eyJ[\w-]+\.[\w-]+\.[\w-]+|(?:sk|gsk)_[A-Za-z0-9_-]{8,}/g, '[REDACTED]') : value]));
    if ('voiceApiUrl' in safe) safe.voiceApiUrl = typeof safe.voiceApiUrl === 'string' && /^https?:\/\/[a-z0-9.-]+(?::\d{1,5})?\/api\/voice\/transcribe(?:[?#].*)?$/i.test(safe.voiceApiUrl) ? safe.voiceApiUrl.split(/[?#]/)[0] : null;
    return safe;
  };
  const snapshot = value => value ? JSON.parse(JSON.stringify(value)) : null;
  const find = id => !id ? last : attempts.find(item => item.sessionId === id) || (last?.sessionId === id ? last : null);
  // Memory only. Cancel and the next session discard the previous audio.
  root.VoiceDiagnostics = {
    begin(data) {
      audio = null;
      last = { ...clean(data), captureFormat: 'PCM16 WAV', sampleRate: 16000, channels: 1, duration: 0, speechDuration: 0, RMS: 0, peak: 0, noiseFloor: 0, georgianChars: 0, cyrillicChars: 0, latinChars: 0, digits: 0, provider: null, model: null, region: null, stage: 'capture', asrStatus: null, financialParseStatus: null, financialParseError: null, requestStarted: null, responseTime: null, detectedLanguage: null, rawTranscript: '', normalizedTranscript: '', validation: null, error: null, events: [] };
      if (!last.sessionId || attempts.some(item => item.sessionId === last.sessionId)) last.sessionId = root.crypto.randomUUID();
      if (debug()) { attempts.push(last); if (attempts.length > 10) attempts.shift(); }
      return snapshot(last);
    },
    update(data, sessionId) {
      const item = find(sessionId); if (!item) return;
      Object.assign(item, clean(data));
    },
    event(name, data = {}, sessionId) {
      const item = find(sessionId); if (!item || !debug() || !/^[a-z_-]{1,40}$/.test(name)) return;
      item.events.push({ event: name, at: Date.now(), ...clean(data) });
      if (item.events.length > 100) item.events.shift();
    },
    get(sessionId) { return snapshot(find(sessionId)); },
    history() { return debug() ? attempts.map(snapshot) : []; },
    format() { return 'Voice Input Diagnostics\n\n' + JSON.stringify(debug() ? { current: snapshot(last), attempts: this.history() } : snapshot(last), null, 2); },
    retain(wav) { if (this.isDeveloper()) audio = wav; },
    discard() { audio = null; },
    isDeveloper() { return ['localhost', '127.0.0.1'].includes(location.hostname); },
    save() { if (!this.isDeveloper() || !audio) return; const url = URL.createObjectURL(new Blob([audio], { type: 'audio/wav' })); const a = document.createElement('a'); a.href = url; a.download = `voice-${last.sessionId}.wav`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); },
  };
})(globalThis);
