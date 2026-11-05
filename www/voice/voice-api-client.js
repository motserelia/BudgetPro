(function(root) {
  'use strict';
  root.VoiceApiClient = {
    async transcribe({ wav, language, mode, sessionId, hints, token, signal, onSending }) {
      if (navigator.onLine === false) throw Object.assign(new Error('OFFLINE'), { code: 'OFFLINE' });
      if (!token) throw Object.assign(new Error('VOICE_AUTH_REQUIRED'), { code: 'VOICE_AUTH_REQUIRED' });
      const controller = new AbortController();
      const cancel = () => controller.abort(); signal.addEventListener('abort', cancel, { once: true });
      if (signal.aborted) controller.abort();
      let timedOut = false; const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 28000);
      const url = new URL(root.BudgetPROApiConfig.getApiUrl('voice/transcribe'));
      root.VoiceDiagnostics?.update({ voiceApiUrl: url.origin + url.pathname, authPresent: !!token, httpStatus: null }, sessionId);
      for (const [k, v] of Object.entries({ language, mode, sessionId, hints: JSON.stringify(hints || []) })) url.searchParams.set(k, v);
      try {
        onSending?.();
        const response = await fetch(url, { method: 'POST', cache: 'no-store', signal: controller.signal, headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${token}` }, body: wav });
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
        root.VoiceDiagnostics?.update({ httpStatus: response.status, stage: 'asr', responseStatus: response.ok ? 'received' : 'error' }, sessionId);
        const result = await response.json().catch(() => ({ ok: false, error: 'BACKEND_INVALID_RESPONSE' }));
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
        root.VoiceDiagnostics?.update({ rawTranscript: typeof result.transcript === 'string' ? result.transcript : result.diagnostics?.rawTranscript }, sessionId);
        if (!response.ok || !result.ok) throw Object.assign(new Error(result.error || 'STT_ERROR'), { code: response.status === 401 ? 'VOICE_AUTH_REQUIRED' : result.error || 'STT_ERROR', diagnostics: { ...result.diagnostics, httpStatus: response.status, technicalReason: result.technicalReason || null } });
        // Provider selection belongs to the authenticated server, not the UI.
        if (result.sessionId !== sessionId || result.requestedLanguage !== language || typeof result.provider !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(result.provider) || typeof result.model !== 'string' || !/^[a-z0-9@][a-z0-9@._/-]{0,159}$/i.test(result.model) || typeof result.transcript !== 'string') throw Object.assign(new Error('STT_ERROR'), { code: 'STT_ERROR' });
        return result;
      } catch (e) {
        if (timedOut) throw Object.assign(new Error('TIMEOUT'), { code: 'TIMEOUT' });
        if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
        if (e instanceof TypeError) throw Object.assign(new Error('NETWORK_ERROR'), { code: 'NETWORK_ERROR' });
        throw e;
      } finally { clearTimeout(timer); signal.removeEventListener('abort', cancel); }
    },
  };
})(globalThis);
