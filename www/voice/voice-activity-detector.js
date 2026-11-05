(function(root, factory) { const api = factory(); if (typeof module === 'object') module.exports = api; root.VoiceActivityDetector = api; })(globalThis, () => {
  'use strict';
  const modes = { auto: { ratio: 2.5, minimum: .002, preRoll: 400, silence: 1000, hangover: 220 }, quiet: { ratio: 1.7, minimum: .0006, preRoll: 500, silence: 1500, hangover: 400 }, noise: { ratio: 3, minimum: .003, preRoll: 400, silence: 1100, hangover: 300 } };
  class Detector {
    constructor(mode) { this.config = modes[mode] || modes.auto; this.noiseFloor = .0003; this.history = []; this.elapsed = 0; this.speechDuration = 0; this.attack = 0; this.lastSpeech = 0; this.started = false; }
    process(samples, sampleRate) {
      let energy = 0, peak = 0, crossings = 0;
      for (let i = 0; i < samples.length; i++) { energy += samples[i] ** 2; peak = Math.max(peak, Math.abs(samples[i])); if (i && Math.sign(samples[i]) !== Math.sign(samples[i - 1])) crossings++; }
      const rms = Math.sqrt(energy / samples.length), ms = samples.length / sampleRate * 1000;
      this.elapsed += ms;
      this.history.push({ rms, ms }); while (this.history.reduce((n, f) => n + f.ms, 0) > 2000) this.history.shift();
      const sorted = this.history.map(f => f.rms).sort((a, b) => a - b);
      const floor = sorted[Math.floor(sorted.length * .2)] || .0001;
      // Estimate the lower envelope during non-speech; do not raise the floor
      // into a sustained utterance. Initial calibration suppresses steady noise.
      if (!this.started || rms < this.noiseFloor * 1.5) this.noiseFloor += (floor - this.noiseFloor) * .08;
      const zcr = crossings / samples.length;
      const candidate = this.elapsed > 200 && rms > Math.max(this.config.minimum, this.noiseFloor * this.config.ratio) && zcr > .005 && zcr < .48 && peak > rms * 1.3;
      this.attack = candidate ? this.attack + ms : Math.max(0, this.attack - ms * .5);
      if (candidate) { this.speechDuration += ms; this.lastSpeech = this.elapsed; }
      if (this.attack >= 120) this.started = true;
      const speech = this.started && this.elapsed - this.lastSpeech < this.config.hangover;
      const ended = this.started && this.speechDuration >= 220 && this.elapsed - this.lastSpeech >= this.config.silence;
      return { rms, peak, noiseFloor: this.noiseFloor, speech, started: this.started, ended, speechDuration: this.speechDuration, elapsed: this.elapsed };
    }
  }
  return { Detector, modes };
});
