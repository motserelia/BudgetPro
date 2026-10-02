"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../www/voice/voice-core.js");

function signal(amplitude, length = 512, frequency = 0.11) {
  return Float32Array.from({ length }, (_, index) => Math.sin(index * frequency) * amplitude);
}

test("maps supported language and legacy mode values safely", () => {
  assert.equal(Core.normalizeLanguage("ru-RU"), "ru");
  assert.equal(Core.normalizeLanguage("en-US"), "en");
  assert.equal(Core.normalizeLanguage("ka-GE"), "ka");
  assert.equal(Core.normalizeLanguage("russian"), "ru");
  assert.equal(Core.normalizeLanguage("english"), "en");
  assert.equal(Core.normalizeLanguage("georgian"), "ka");
  assert.equal(Core.normalizeLanguage("auto"), "auto");
  assert.equal(Core.normalizeMode("whisper"), "whisper");
  assert.equal(Core.normalizeMode("street"), "street");
  assert.equal(Core.normalizeMode("unknown"), "auto");
});

test("preserves Georgian Unicode text", () => {
  const text = "  დღეს ახალი დავალება დავამატო  ";
  assert.equal(Core.normalizeTranscript(text), "დღეს ახალი დავალება დავამატო");
  assert.equal(Core.containsText("ქართული ტექსტი"), true);
});

test("VAD keeps silence closed", () => {
  const vad = new Core.AdaptiveVad("auto");
  vad.reset(0);
  let result;
  for (let frame = 0; frame < 20; frame++) result = vad.update(new Float32Array(512), frame * 20);
  assert.equal(result.speechDetected, false);
});

test("VAD detects quiet speech in whisper mode", () => {
  const vad = new Core.AdaptiveVad("whisper");
  vad.reset(0);
  let result;
  for (let frame = 0; frame < 4; frame++) result = vad.update(signal(0.032), frame * 20);
  assert.equal(result.speechDetected, true);
});

test("VAD detects normal speech and ignores steady background", () => {
  const vad = new Core.AdaptiveVad("auto");
  vad.reset(0);
  for (let frame = 0; frame < 12; frame++) vad.update(Float32Array.from({ length: 512 }, () => 0.025), frame * 20);
  assert.equal(vad.speechDetected, false);
  let result;
  for (let frame = 12; frame < 18; frame++) result = vad.update(signal(0.1), frame * 20);
  assert.equal(result.speechDetected, true);
});

test("preprocessing and WAV encoding produce finite mono 16-bit audio", () => {
  const processed = Core.preprocessPcm(signal(0.3, 4800), "auto");
  assert.equal(Array.from(processed).every(Number.isFinite), true);
  const resampled = Core.resamplePcm(processed, 48000, 16000);
  assert.equal(resampled.length, 1600);
  const wav = Core.encodeWav(resampled, 16000);
  assert.equal(new DataView(wav).getUint32(24, true), 16000);
  assert.equal(String.fromCharCode(...new Uint8Array(wav, 0, 4)), "RIFF");
});
