// Injected ONLY into the isolated debug APK. No credentials or production API overrides.
(function(root) {
  'use strict';
  if (!root.Capacitor?.isNativePlatform?.()) return;
  const original = root.BudgetPROApiConfig;
  const relay = 'http://localhost:8139/api';
  root.BudgetPROApiConfig = Object.freeze({ ...original, getApiUrl(route, context) {
    const name = String(route).replace(/^\/+/, '');
    return ['voice/health', 'voice/transcribe'].includes(name) ? relay + '/' + name : original.getApiUrl(route, context);
  } });
  // Invoked manually through the debuggable WebView. Uses the app's normal
  // auth lifecycle; returns only status, never tokens. Does not request mic.
  // A test dictation must never create a financial record, even after a stray Save tap.
  if (typeof root.saveVoiceDraftTransaction === 'function') root.saveVoiceDraftTransaction = () => { root.VoiceDiagnostics?.update({ debugSaveBlocked: true }); return false; };
  root.document?.addEventListener('click', event => {
    if (!event.target?.closest?.('#voiceSaveDraft,#voiceQuickSave,#voiceQuickMore')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    root.VoiceDiagnostics?.update({ debugSaveBlocked: true });
  }, true);
  root.BudgetPROVoiceDebug = Object.freeze({ saveBlocked: true, async checkSession() {
    try {
      if (root.BudgetPROVoiceModule?.isActive()) return { ok: false, error: 'VOICE_BUSY' };
      let session = getAuthSession('voice-debug');
      if (!session) return { ok: false, error: 'VOICE_AUTH_REQUIRED' };
      if (isAuthSessionExpired(session)) {
        if (!session.refresh_token || !await refreshAuthSession('voice-debug')) return { ok: false, error: 'AUTH_REFRESH_FAILED' };
        session = getAuthSession('voice-debug:refreshed');
      }
      if (!session?.access_token) return { ok: false, error: 'VOICE_AUTH_REQUIRED' };
      await root.VoiceApiClient.transcribe({ wav: new ArrayBuffer(0), language: 'ru', mode: 'auto', sessionId: crypto.randomUUID(), hints: [], token: session.access_token, signal: new AbortController().signal });
      return { ok: false, error: 'UNEXPECTED_RESPONSE' };
    } catch (e) { return { ok: e.code === 'INVALID_AUDIO' && e.diagnostics?.httpStatus === 400, error: /^[A-Z_-]{1,64}$/.test(e.code || '') ? e.code : 'AUTH_CHECK_FAILED', httpStatus: Number.isInteger(e.diagnostics?.httpStatus) ? e.diagnostics.httpStatus : null }; }
  } });
})(globalThis);
