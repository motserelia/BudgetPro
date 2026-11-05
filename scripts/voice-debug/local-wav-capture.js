(function(root, install) {
  if (typeof module === 'object' && module.exports) module.exports = install;
  else install(root);
})(globalThis, function installLocalCapture(root) {
  'use strict';
  if (root.BudgetPROVoiceDebug?.buildRevision !== 4 || !root.BudgetPROVoiceDebug?.guardReady || !root.BudgetPROVoiceDebug?.localOnly || root.BudgetPROVoiceModule?.protocolVersion !== 3 || !root.BudgetPROVoiceDebug?.saveBlocked || !root.Capacitor?.isNativePlatform?.() || root.location?.origin !== 'https://budgetpro.app' || root.BudgetPROVoiceModule?.isActive()) throw Error('LOCAL_DEBUG_REQUIRED');
  const previous = root.BudgetPROLocalWavCapture;
  if (previous?.status().protocolVersion === 3) return previous;
  if (previous) throw Error('LOCAL_CAPTURE_REQUIRES_V3_DEBUG_APK');
  const voice = root.BudgetPROVoiceModule;
  let armed = false, consumed = false, busy = false, held = null, timer = null, exported = false;
  let state = 'READY', attemptId = null;
  const completions = new WeakSet();
  const error = code => Object.assign(new Error(code), { code });
  const discard = () => { if (held) new Uint8Array(held.wav).fill(0); held = null; armed = false; root.clearTimeout(timer); };
  const expire = () => { if (held && Date.now() >= held.expiresAt) discard(); };
  const requireAudio = () => { expire(); if (!held) throw error('LOCAL_WAV_UNAVAILABLE'); return held; };
  const installed = () => root.BudgetPROVoiceDebug?.buildRevision === 4 && root.BudgetPROVoiceDebug?.guardReady === true && root.BudgetPROVoiceModule === voice && root.VoiceApiClient === client && root.BudgetPROLocalWavCapture === api;
  const api = Object.freeze({
    status() { expire(); return { protocolVersion: 3, buildRevision: 4, localOnly: true, installed: installed(), state, armed, consumed, captured: !!held, busy, exported, bytes: held?.wav.byteLength || 0, sha256: held?.sha256 || null, attemptId, expiresAt: held?.expiresAt || null }; },
    canStart: () => installed() && armed && !consumed && !busy,
    arm() { if (!installed() || consumed || busy || armed || root.BudgetPROVoiceModule?.isActive()) throw error('LOCAL_CAPTURE_ALREADY_USED_OR_BUSY'); armed = true; return api.status(); },
    begin(id) { if (!api.canStart() || !/^[a-f0-9-]{36}$/i.test(id || '')) throw error('LOCAL_CAPTURE_NOT_ARMED'); armed = false; consumed = true; attemptId = id; state = 'RECORDING'; },
    cancel(id) { if (attemptId === id && state === 'RECORDING') { state = 'CANCELLED'; discard(); } },
    fail(id) { if (attemptId === id && state === 'RECORDING') { state = 'ERROR'; discard(); } },
    isCompletion: (result, id) => completions.has(result) && id === attemptId && state === 'CAPTURE_COMPLETE',
    claimExport() { const h = requireAudio(); if (exported) throw error('LOCAL_EXPORT_ALREADY_USED'); exported = true; return { bytes: h.wav.byteLength, sha256: h.sha256, attemptId }; },
    readChunk(offset, length = 32768) { const h = requireAudio(); if (!exported || !Number.isInteger(offset) || offset < 0 || !Number.isInteger(length) || length < 1 || length > 32768 || offset >= h.wav.byteLength) throw error('LOCAL_EXPORT_INVALID'); return root.btoa(String.fromCharCode(...new Uint8Array(h.wav, offset, Math.min(length, h.wav.byteLength - offset)))); },
    discard,
  });
  const client = Object.freeze({ async transcribe({ wav, language, sessionId, signal }) {
    if (!installed() || state !== 'RECORDING' || sessionId !== attemptId || busy) throw error('LOCAL_CAPTURE_NOT_ARMED');
    busy = true;
    let copy;
    try {
      if (signal?.aborted) throw error('LOCAL_CAPTURE_CANCELLED');
      if (language !== 'ka') throw error('LOCAL_CAPTURE_KA_ONLY');
      const v = new DataView(wav), text = (o, n) => String.fromCharCode(...new Uint8Array(wav, o, n));
      if (wav.byteLength < 44 || wav.byteLength > 960044 || text(0, 4) !== 'RIFF' || text(8, 4) !== 'WAVE' || text(12, 4) !== 'fmt ' || text(36, 4) !== 'data' || v.getUint32(16, true) !== 16 || v.getUint16(20, true) !== 1 || v.getUint16(22, true) !== 1 || v.getUint32(24, true) !== 16000 || v.getUint32(28, true) !== 32000 || v.getUint16(32, true) !== 2 || v.getUint16(34, true) !== 16 || v.getUint32(4, true) !== wav.byteLength - 8 || v.getUint32(40, true) !== wav.byteLength - 44 || (wav.byteLength - 44) % 2 || (wav.byteLength - 44) / 32 < 220) throw error('LOCAL_INVALID_WAV');
      copy = wav.slice(0);
      const digest = await root.crypto.subtle.digest('SHA-256', copy);
      if (signal?.aborted || state !== 'RECORDING') throw error('LOCAL_CAPTURE_CANCELLED');
      held = { wav: copy, sha256: [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join(''), expiresAt: Date.now() + 600000 };
      timer = root.setTimeout(discard, 600000); state = 'CAPTURE_COMPLETE';
      const result = Object.freeze({ localCaptureComplete: true, sessionId }); completions.add(result); return result;
    } catch (e) { if (copy) new Uint8Array(copy).fill(0); api.fail(sessionId); throw error(['LOCAL_CAPTURE_CANCELLED', 'LOCAL_CAPTURE_KA_ONLY', 'LOCAL_INVALID_WAV'].includes(e.code) ? e.code : 'LOCAL_INVALID_WAV'); }
    finally { busy = false; }
  } });
  root.VoiceApiClient = client;
  root.BudgetPROLocalWavCapture = api;
  return api;
});
