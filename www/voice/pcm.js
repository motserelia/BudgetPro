(function(root, factory) { const api = factory(); if (typeof module === 'object') module.exports = api; root.VoicePCM = api; })(globalThis, () => {
  'use strict';
  function resample(input, sourceRate, targetRate = 16000) {
    if (sourceRate === targetRate) return input.slice();
    const ratio = sourceRate / targetRate, output = new Float32Array(Math.floor(input.length / ratio));
    // Windowed sinc interpolation includes anti-alias filtering when downsampling.
    const cutoff = Math.min(1, targetRate / sourceRate) * .94, radius = Math.ceil(20 / cutoff);
    for (let i = 0; i < output.length; i++) {
      const position = i * ratio; let sum = 0, weight = 0;
      for (let j = Math.max(0, Math.ceil(position - radius)); j <= Math.min(input.length - 1, Math.floor(position + radius)); j++) {
        const distance = position - j, x = Math.PI * distance * cutoff;
        const w = (x === 0 ? 1 : Math.sin(x) / x) * (.5 + .5 * Math.cos(Math.PI * distance / radius)) * cutoff;
        sum += input[j] * w; weight += w;
      }
      output[i] = weight ? sum / weight : 0;
    }
    return output;
  }
  function wav(samples, sampleRate = 16000) {
    const buffer = new ArrayBuffer(44 + samples.length * 2), view = new DataView(buffer);
    const str = (offset, s) => [...s].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    str(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); str(8, 'WAVE'); str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, samples.length * 2, true);
    samples.forEach((s, i) => view.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, s)) * (s < 0 ? 32768 : 32767)), true));
    return buffer;
  }
  return { resample, wav };
});
