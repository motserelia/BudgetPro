(function (root) {
  "use strict";

  const Core = root.BudgetPROVoiceCore;
  if (!Core) throw new Error("BudgetPROVoiceCore must load before voice-capture.js");

  class VoiceCapture {
    constructor(options = {}) {
      this.onState = options.onState || (() => {});
      this.onMeter = options.onMeter || (() => {});
      this.onComplete = options.onComplete || (() => {});
      this.mode = Core.normalizeMode(options.mode);
      this.vad = new Core.AdaptiveVad(this.mode);
      this.chunks = [];
      this.audioStats = null;
      this.cleanupPromise = null;
      this.active = false;
    }

    async start() {
      if (this.active) throw new Error("capture_already_active");
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("microphone_unavailable");
      this.onState("requesting");
      const constraints = Core.getSupportedAudioConstraints(navigator.mediaDevices);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
      } catch (error) {
        if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
          throw new Error("microphone_denied");
        }
        if (error?.name === "NotFoundError") throw new Error("microphone_missing");
        throw error;
      }

      const AudioContextCtor = root.AudioContext || root.webkitAudioContext;
      if (!AudioContextCtor) {
        this.stream.getTracks().forEach((track) => track.stop());
        throw new Error("audio_context_unavailable");
      }
      this.context = new AudioContextCtor({ latencyHint: "interactive" });
      if (this.context.state === "suspended") await this.context.resume();
      this.source = this.context.createMediaStreamSource(this.stream);
      this.processor = this.context.createScriptProcessor(4096, 1, 1);
      this.silentGain = this.context.createGain();
      this.silentGain.gain.value = 0;
      this.source.connect(this.processor);
      this.processor.connect(this.silentGain);
      this.silentGain.connect(this.context.destination);
      this.chunks = [];
      this.audioStats = {
        sampleCount: 0,
        energy: 0,
        peak: 0,
        clippedSamples: 0,
        speechSamples: 0,
        lastNoiseFloor: 0,
      };
      this.active = true;
      this.startedAt = performance.now();
      this.vad.reset(this.startedAt);
      this.onState("listening");

      this.processor.onaudioprocess = (event) => {
        if (!this.active) return;
        const input = event.inputBuffer.getChannelData(0);
        this.chunks.push(new Float32Array(input));
        const metrics = this.vad.update(input, performance.now());
        this.audioStats.sampleCount += input.length;
        this.audioStats.lastNoiseFloor = metrics.noiseFloor;
        if (metrics.isSpeech) this.audioStats.speechSamples += input.length;
        for (let i = 0; i < input.length; i++) {
          const sample = Number(input[i]) || 0;
          this.audioStats.energy += sample * sample;
          this.audioStats.peak = Math.max(this.audioStats.peak, Math.abs(sample));
          if (Math.abs(sample) >= 0.985) this.audioStats.clippedSamples++;
        }
        this.onMeter(metrics);
        if (metrics.isSpeech) this.onState("speech");
        if (metrics.shouldAutoStop) this.stop("silence").catch(() => {});
        else if (metrics.noSpeechTimeout) this.stop("no-speech").catch(() => {});
        else if (metrics.maxDuration) this.stop("max-duration").catch(() => {});
      };
      return this;
    }

    async stop(reason = "manual") {
      if (this.cleanupPromise) return this.cleanupPromise;
      this.cleanupPromise = this.finish(reason).then((result) => {
        this.onComplete(result);
        return result;
      });
      return this.cleanupPromise;
    }

    async cancel() {
      const result = await this.stop("cancelled");
      return { ...result, cancelled: true };
    }

    async finish(reason) {
      const wasActive = this.active;
      this.active = false;
      if (this.processor) this.processor.onaudioprocess = null;
      for (const node of [this.source, this.processor, this.silentGain]) {
        try {
          node?.disconnect();
        } catch (error) {}
      }
      this.stream?.getTracks().forEach((track) => track.stop());
      if (this.context && this.context.state !== "closed") {
        try {
          await this.context.close();
        } catch (error) {}
      }

      const sampleRate = this.context?.sampleRate || 48000;
      const length = this.chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const joined = new Float32Array(length);
      let offset = 0;
      for (const chunk of this.chunks) {
        joined.set(chunk, offset);
        offset += chunk.length;
      }
      const processed = Core.preprocessPcm(joined, this.mode);
      const resampled = Core.resamplePcm(processed, sampleRate, 16000);
      const wav = Core.encodeWav(resampled, 16000);
      const stats = this.audioStats || {
        sampleCount: joined.length,
        energy: 0,
        peak: 0,
        clippedSamples: 0,
        speechSamples: 0,
        lastNoiseFloor: this.vad.noiseFloor,
      };
      const audioMetrics = {
        durationMs: Math.round((resampled.length / 16000) * 1000),
        sampleRate: 16000,
        channelCount: 1,
        rms: Math.sqrt(stats.energy / Math.max(1, stats.sampleCount)),
        peak: stats.peak,
        clippingRatio: stats.clippedSamples / Math.max(1, stats.sampleCount),
        noiseFloor: stats.lastNoiseFloor,
        speechDurationMs: Math.round((stats.speechSamples / Math.max(1, sampleRate)) * 1000),
        vadSpeechDetected: this.vad.speechDetected,
      };
      this.onState(reason === "cancelled" ? "cancelled" : "processing");
      this.chunks = [];
      return {
        wav,
        reason,
        hadSpeech: this.vad.speechDetected,
        clipped: this.vad.clippedFrames > 4,
        wasActive,
        durationMs: Math.round((resampled.length / 16000) * 1000),
        audioMetrics,
      };
    }
  }

  root.BudgetPROVoiceCapture = VoiceCapture;
})(typeof globalThis !== "undefined" ? globalThis : this);
