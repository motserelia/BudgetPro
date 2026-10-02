"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const os = require("node:os");
const path = require("node:path");
const Core = require("../www/voice/voice-core.js");
const { MODELS, WHISPER_VERSION, WhisperEngine } = require("../desktop/voice/whisper-engine");

test("reports missing binary/model without crashing", async () => {
  const userData = path.join(os.tmpdir(), `budgetpro-test-${process.pid}-${Date.now()}`);
  const engine = new WhisperEngine({
    app: { getPath: () => userData, getAppPath: () => userData },
    isPackaged: false,
  });
  const status = await engine.status();
  assert.equal(status.available, false);
  assert.equal(status.binaryAvailable, false);
  assert.equal(status.modelAvailable, false);
  assert.equal(status.modelId, "large-v3-turbo-q5_0");
  assert.equal(status.whisperVersion, "v1.9.2");
  await assert.rejects(
    engine.transcribe({ wav: new ArrayBuffer(44), language: "ka" }),
    /engine_missing/,
  );
});

test("restricted auto detection considers only RU, EN, and KA", async () => {
  const engine = new WhisperEngine({
    app: { getPath: () => os.tmpdir(), getAppPath: () => os.tmpdir() },
    isPackaged: false,
  });
  engine.requestServer = async () => ({
    language_probabilities: { de: 0.82, ka: 0.61, ru: 0.2, en: 0.1 },
  });
  const detected = await engine.detectRestrictedLanguage(Buffer.alloc(44));
  assert.equal(detected.language, "ka");
  assert.deepEqual(detected.ranked.map((item) => item.language).sort(), ["en", "ka", "ru"]);
});

test("fixed Georgian forces ka without auto detection or translation", async () => {
  const engine = new WhisperEngine({
    app: { getPath: () => os.tmpdir(), getAppPath: () => os.tmpdir() },
    isPackaged: false,
  });
  const requests = [];
  engine.ensureServer = async () => {};
  engine.requestServer = async (_bytes, options) => {
    requests.push(options);
    return { text: "დღეს ახალი დავალება დავამატო" };
  };
  const result = await engine.transcribeWithServer(Buffer.alloc(44), "ka", MODELS.primary, null);
  assert.equal(result.text, "დღეს ახალი დავალება დავამატო");
  assert.equal(result.language, "ka");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].language, "ka");
  assert.equal(requests[0].detectOnly, false);
});

test("restricted auto detects first and then transcribes with the selected language", async () => {
  const engine = new WhisperEngine({
    app: { getPath: () => os.tmpdir(), getAppPath: () => os.tmpdir() },
    isPackaged: false,
  });
  const requests = [];
  engine.ensureServer = async () => {};
  engine.requestServer = async (_bytes, options) => {
    requests.push(options);
    if (options.detectOnly) return { language_probabilities: { ru: 0.08, en: 0.07, ka: 0.85 } };
    return { text: "ეს არის ტესტი" };
  };
  const result = await engine.transcribeWithServer(Buffer.alloc(44), "auto", MODELS.primary, null);
  assert.equal(result.language, "ka");
  assert.equal(result.languageConfidence, 0.85);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].detectOnly, true);
  assert.equal(requests[1].language, "ka");
});

test("language detection excerpt keeps valid 16 kHz mono WAV metadata", () => {
  const engine = new WhisperEngine({
    app: { getPath: () => os.tmpdir(), getAppPath: () => os.tmpdir() },
    isPackaged: false,
  });
  const samples = new Float32Array(16000 * 12);
  for (let index = 16000; index < samples.length; index++) samples[index] = Math.sin(index * 0.08) * 0.1;
  const wav = Buffer.from(Core.encodeWav(samples, 16000));
  const excerpt = engine.extractInformativeWav(wav);
  assert.ok(excerpt.length < wav.length);
  assert.equal(excerpt.toString("ascii", 0, 4), "RIFF");
  assert.equal(excerpt.readUInt32LE(24), 16000);
  assert.equal(excerpt.readUInt16LE(22), 1);
});

test("engine metadata pins the selected upstream release and model", () => {
  assert.equal(WHISPER_VERSION, "v1.9.2");
  assert.equal(MODELS.primary.sha1, "e050f7970618a659205450ad97eb95a18d69c9ee");
  assert.equal(MODELS.fallback.id, "small");
});
