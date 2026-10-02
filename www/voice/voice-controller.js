(function (root) {
  "use strict";

  const Core = root.BudgetPROVoiceCore;
  const NumberNormalizer = root.BudgetPROVoiceNumberNormalizer;
  const VoiceCapture = root.BudgetPROVoiceCapture;
  if (!Core || !VoiceCapture) {
    throw new Error("Voice core and capture modules must load before voice-controller.js");
  }

  const LANGUAGE_KEY = "budgetpro_voice_language";
  const MODE_KEY = "budgetpro_voice_mode";
  const listeners = new Set();
  let capture = null;
  let transcriptHandler = null;
  let transcribing = false;
  let starting = false;
  let state = {
    status: "ready",
    meter: 0,
    noiseFloor: 0,
    transcript: "",
    error: "",
    model: null,
    clipped: false,
    diagnostics: null,
  };

  function emit(patch) {
    state = { ...state, ...patch };
    if (typeof root.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
      root.dispatchEvent(new CustomEvent("budgetpro:voice-state", { detail: { ...state } }));
    }
    listeners.forEach((listener) => {
      try {
        listener({ ...state });
      } catch (error) {
        console.warn("[Voice state listener]", error);
      }
    });
  }

  function getLanguage() {
    return Core.normalizeLanguage(localStorage.getItem(LANGUAGE_KEY) || "auto");
  }

  function setLanguage(language) {
    const normalized = Core.normalizeLanguage(language);
    localStorage.setItem(LANGUAGE_KEY, normalized);
    emit({ language: normalized });
    return normalized;
  }

  function getMode() {
    return Core.normalizeMode(localStorage.getItem(MODE_KEY) || "auto");
  }

  function setMode(mode) {
    const normalized = Core.normalizeMode(mode);
    localStorage.setItem(MODE_KEY, normalized);
    emit({ mode: normalized });
    return normalized;
  }

  function errorCode(error) {
    const message = String(error?.message || error || "transcription_failed");
    for (const code of [
      "microphone_denied",
      "microphone_missing",
      "microphone_unavailable",
      "model_missing",
      "model_downloading",
      "model_download_failed",
      "model_checksum_mismatch",
      "engine_missing",
      "no_speech",
      "transcription_busy",
      "invalid_audio_payload",
    ]) {
      if (message.includes(code)) return code;
    }
    return "transcription_failed";
  }

  async function processCapture(result) {
    if (result.cancelled || result.reason === "cancelled") {
      capture = null;
      emit({ status: "cancelled", meter: 0 });
      return;
    }
    if (!result.hadSpeech || result.durationMs < 250) {
      capture = null;
      emit({ status: "no-speech", meter: 0, error: "no_speech" });
      return;
    }
    if (!root.budgetPRODesktopVoice?.transcribe) {
      capture = null;
      emit({ status: "error", meter: 0, error: "engine_missing" });
      return;
    }

    transcribing = true;
    emit({ status: "transcribing", meter: 0, clipped: result.clipped });
    try {
      const response = await root.budgetPRODesktopVoice.transcribe({
        wav: result.wav,
        language: getLanguage(),
        audioMetrics: result.audioMetrics,
      });
      const rawText = Core.normalizeTranscript(response?.rawText || response?.text);
      const detectedLanguage = Core.normalizeLanguage(response?.language);
      const normalizationLanguage = getLanguage() === "auto" ? detectedLanguage : getLanguage();
      const text = Core.normalizeTranscript(
        NumberNormalizer?.normalizeNumbers?.(rawText, normalizationLanguage) || rawText,
      );
      if (!Core.containsText(text)) throw new Error("no_speech");
      const diagnostics = {
        ...(response?.diagnostics || {}),
        selectedLanguage: getLanguage(),
        detectedLanguage,
        languageConfidence: response?.languageConfidence ?? response?.diagnostics?.languageConfidence ?? null,
        recordingMode: getMode(),
        durationMs: result.audioMetrics?.durationMs ?? result.durationMs,
        speechDurationMs: result.audioMetrics?.speechDurationMs ?? 0,
        rms: result.audioMetrics?.rms ?? 0,
        peak: result.audioMetrics?.peak ?? 0,
        clippingRatio: result.audioMetrics?.clippingRatio ?? 0,
        noiseFloor: result.audioMetrics?.noiseFloor ?? 0,
        rawText,
        normalizedText: text,
      };
      emit({
        status: "done",
        transcript: text,
        rawTranscript: rawText,
        detectedLanguage,
        diagnostics,
        error: "",
      });
      transcriptHandler?.(text, []);
    } catch (error) {
      console.error("[Voice transcription]", error);
      emit({ status: "error", error: errorCode(error) });
    } finally {
      transcribing = false;
      capture = null;
    }
  }

  function recordExternalResult(rawValue, options = {}) {
    const rawText = Core.normalizeTranscript(rawValue);
    const selectedLanguage = getLanguage();
    const detectedLanguage = Core.normalizeLanguage(
      options.detectedLanguage || (selectedLanguage === "auto" ? options.uiLanguage : selectedLanguage),
    );
    const normalizationLanguage = selectedLanguage === "auto" ? detectedLanguage : selectedLanguage;
    const normalizedText = Core.normalizeTranscript(
      NumberNormalizer?.normalizeNumbers?.(rawText, normalizationLanguage) || rawText,
    );
    const diagnostics = {
      backend: options.backend || "system-fallback",
      server: "none",
      modelId: "system",
      whisperVersion: "n/a",
      selectedLanguage,
      detectedLanguage,
      languageConfidence: null,
      recordingMode: getMode(),
      rawText,
      normalizedText,
    };
    emit({ status: "done", transcript: normalizedText, rawTranscript: rawText, detectedLanguage, diagnostics, error: "" });
    return normalizedText;
  }

  async function start(options = {}) {
    if (!root.budgetPRODesktopVoice?.transcribe) return { handled: false };
    if (capture?.active || transcribing || starting) return { handled: true, busy: true };
    starting = true;
    transcriptHandler = options.onTranscript || transcriptHandler;
    emit({
      status: "requesting",
      transcript: options.keepTranscript ? state.transcript : "",
      error: "",
      meter: 0,
      language: getLanguage(),
      mode: getMode(),
    });
    if (root.budgetPRODesktopVoice?.getModelStatus) {
      try {
        let model = await getModelStatus();
        if (!model.available && root.budgetPRODesktopVoice?.installModel) {
          emit({ status: "model-downloading", model, error: "" });
          try {
            model = await installModel();
          } catch (error) {
            if (!model.canTranscribe) throw error;
            console.warn("[Voice model upgrade] Falling back to installed model", error);
          }
        }
      } catch (error) {
        console.error("[Voice model preparation]", error);
        emit({ status: "error", error: errorCode(error), meter: 0 });
        starting = false;
        return { handled: true, error };
      }
    }
    capture = new VoiceCapture({
      mode: getMode(),
      onState(status) {
        emit({ status });
      },
      onMeter(metrics) {
        emit({
          meter: Math.min(1, metrics.rms * 8),
          noiseFloor: metrics.noiseFloor,
          status: metrics.isSpeech ? "speech" : state.status,
        });
      },
      onComplete: processCapture,
    });
    try {
      await capture.start();
      starting = false;
      return { handled: true };
    } catch (error) {
      console.error("[Voice capture]", error);
      capture = null;
      starting = false;
      emit({ status: "error", error: errorCode(error), meter: 0 });
      return { handled: true, error };
    }
  }

  async function stop() {
    if (!capture) return null;
    return capture.stop("manual");
  }

  async function cancel() {
    if (!capture) {
      emit({ status: "cancelled", meter: 0 });
      return null;
    }
    return capture.cancel();
  }

  async function getModelStatus() {
    if (!root.budgetPRODesktopVoice?.getModelStatus) {
      const model = { available: false, platform: "fallback", reason: "engine_missing" };
      emit({ model });
      return model;
    }
    const model = await root.budgetPRODesktopVoice.getModelStatus();
    emit({ model });
    return model;
  }

  async function installModel() {
    if (!root.budgetPRODesktopVoice?.installModel) throw new Error("engine_missing");
    emit({ status: "model-downloading", error: "" });
    const model = await root.budgetPRODesktopVoice.installModel();
    emit({ model, status: "ready" });
    return model;
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener({ ...state, language: getLanguage(), mode: getMode() });
    return () => listeners.delete(listener);
  }

  function disposeScreen() {
    transcriptHandler = null;
    if (capture) cancel().catch(() => {});
  }

  if (root.budgetPRODesktopVoice?.onModelProgress) {
    root.budgetPRODesktopVoice.onModelProgress((progress) => {
      emit({ modelProgress: progress, status: "model-downloading" });
    });
  }

  root.BudgetPROVoiceModule = {
    cancel,
    disposeScreen,
    getLanguage,
    getMode,
    getModelStatus,
    getDiagnostics: () => state.diagnostics ? { ...state.diagnostics } : null,
    getState: () => ({ ...state }),
    installModel,
    recordExternalResult,
    setLanguage,
    setMode,
    start,
    stop,
    subscribe,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
