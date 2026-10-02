(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.BudgetPROVoiceCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LANGUAGES = Object.freeze(["auto", "ru", "en", "ka"]);
  const MODES = Object.freeze(["auto", "whisper", "street"]);
  const MODE_CONFIG = Object.freeze({
    auto: {
      thresholdRatio: 2.25,
      thresholdOffset: 0.008,
      attackFrames: 3,
      releaseMs: 1450,
      noSpeechMs: 12000,
      maxDurationMs: 45000,
      gain: 1,
    },
    whisper: {
      thresholdRatio: 1.45,
      thresholdOffset: 0.0035,
      attackFrames: 2,
      releaseMs: 1900,
      noSpeechMs: 15000,
      maxDurationMs: 50000,
      gain: 1.22,
    },
    street: {
      thresholdRatio: 2.9,
      thresholdOffset: 0.014,
      attackFrames: 4,
      releaseMs: 1650,
      noSpeechMs: 13000,
      maxDurationMs: 42000,
      gain: 0.94,
    },
  });

  function normalizeLanguage(value) {
    const raw = String(value || "auto").trim().toLowerCase();
    const names = { russian: "ru", english: "en", georgian: "ka" };
    if (names[raw]) return names[raw];
    const short = raw.split("-")[0];
    return LANGUAGES.includes(short) ? short : "auto";
  }

  function normalizeMode(value) {
    const raw = String(value || "auto").trim().toLowerCase();
    return MODES.includes(raw) ? raw : "auto";
  }

  function normalizeTranscript(value) {
    return String(value || "")
      .normalize("NFC")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
      .replace(/\s+/gu, " ")
      .trim();
  }

  function containsText(value) {
    return /[\p{L}\p{N}]/u.test(normalizeTranscript(value));
  }

  function getSupportedAudioConstraints(mediaDevices) {
    const supported = mediaDevices?.getSupportedConstraints?.() || {};
    const audio = { channelCount: 1 };
    for (const key of ["echoCancellation", "noiseSuppression", "autoGainControl"]) {
      if (supported[key] !== false) audio[key] = true;
    }
    return audio;
  }

  class AdaptiveVad {
    constructor(mode = "auto") {
      this.mode = normalizeMode(mode);
      this.config = MODE_CONFIG[this.mode];
      this.noiseFloor = 0.008;
      this.speechFrames = 0;
      this.speechDetected = false;
      this.lastSpeechAt = 0;
      this.startedAt = 0;
      this.clippedFrames = 0;
    }

    reset(now = 0) {
      this.noiseFloor = 0.008;
      this.speechFrames = 0;
      this.speechDetected = false;
      this.lastSpeechAt = 0;
      this.startedAt = now;
      this.clippedFrames = 0;
    }

    update(samples, now) {
      let energy = 0;
      let peak = 0;
      let zeroCrossings = 0;
      let previous = samples[0] || 0;
      for (let i = 0; i < samples.length; i++) {
        const sample = Number(samples[i]) || 0;
        energy += sample * sample;
        peak = Math.max(peak, Math.abs(sample));
        if ((sample >= 0) !== (previous >= 0)) zeroCrossings++;
        previous = sample;
      }
      const rms = Math.sqrt(energy / Math.max(1, samples.length));
      const crossingRate = zeroCrossings / Math.max(1, samples.length);
      const speechBandHint = crossingRate > 0.012 && crossingRate < 0.34 ? 1 : 0.76;
      const threshold =
        this.noiseFloor * this.config.thresholdRatio + this.config.thresholdOffset;
      const candidate = rms * speechBandHint > threshold || peak > threshold * 3.1;

      if (!candidate) {
        const rate = rms < this.noiseFloor ? 0.045 : 0.008;
        this.noiseFloor += (rms - this.noiseFloor) * rate;
        this.speechFrames = Math.max(0, this.speechFrames - 1);
      } else {
        this.speechFrames++;
      }
      if (peak >= 0.985) this.clippedFrames++;

      if (this.speechFrames >= this.config.attackFrames) {
        this.speechDetected = true;
        this.lastSpeechAt = now;
      }
      const silenceMs = this.speechDetected ? now - this.lastSpeechAt : 0;
      return {
        rms,
        peak,
        noiseFloor: this.noiseFloor,
        threshold,
        isSpeech: candidate && this.speechFrames >= this.config.attackFrames,
        speechDetected: this.speechDetected,
        clipped: peak >= 0.985,
        shouldAutoStop:
          this.mode === "auto" &&
          this.speechDetected &&
          silenceMs >= this.config.releaseMs,
        noSpeechTimeout:
          !this.speechDetected && now - this.startedAt >= this.config.noSpeechMs,
        maxDuration: now - this.startedAt >= this.config.maxDurationMs,
      };
    }
  }

  function preprocessPcm(samples, mode = "auto") {
    const config = MODE_CONFIG[normalizeMode(mode)];
    const output = new Float32Array(samples.length);
    let mean = 0;
    for (let i = 0; i < samples.length; i++) mean += samples[i];
    mean /= Math.max(1, samples.length);

    let previousInput = 0;
    let previousOutput = 0;
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
      const centered = samples[i] - mean;
      const highPassed = centered - previousInput + 0.985 * previousOutput;
      previousInput = centered;
      previousOutput = highPassed;
      output[i] = highPassed;
      peak = Math.max(peak, Math.abs(highPassed));
    }

    const safeGain = Math.min(config.gain, peak > 0.92 ? 0.92 / peak : config.gain);
    for (let i = 0; i < output.length; i++) {
      const value = output[i] * safeGain;
      output[i] = Math.tanh(value * 1.08) / Math.tanh(1.08);
    }
    return output;
  }

  function resamplePcm(samples, sourceRate, targetRate = 16000) {
    if (sourceRate === targetRate) return new Float32Array(samples);
    const ratio = sourceRate / targetRate;
    const length = Math.max(1, Math.round(samples.length / ratio));
    const output = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const sourcePosition = i * ratio;
      const left = Math.floor(sourcePosition);
      const right = Math.min(samples.length - 1, left + 1);
      const mix = sourcePosition - left;
      output[i] = samples[left] * (1 - mix) + samples[right] * mix;
    }
    return output;
  }

  function encodeWav(samples, sampleRate = 16000) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const write = (offset, value) => {
      for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
    };
    write(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    write(8, "WAVEfmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    write(36, "data");
    view.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
    }
    return buffer;
  }

  return {
    LANGUAGES,
    MODES,
    MODE_CONFIG,
    AdaptiveVad,
    containsText,
    encodeWav,
    getSupportedAudioConstraints,
    normalizeLanguage,
    normalizeMode,
    normalizeTranscript,
    preprocessPcm,
    resamplePcm,
  };
});
