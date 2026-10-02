"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const binary = path.join(root, "vendor", "whisper", "bin", "whisper-cli");
const DEFAULT_REFERENCE = "And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.";

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= right.length; j++) {
      const above = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[right.length];
}

function normalizeForScore(text) {
  return String(text || "").normalize("NFC").toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/gu, " ").trim();
}

function errorRates(reference, result) {
  const expected = normalizeForScore(reference);
  const actual = normalizeForScore(result);
  const expectedWords = expected ? expected.split(" ") : [];
  const actualWords = actual ? actual.split(" ") : [];
  return {
    wer: expectedWords.length ? editDistance(expectedWords, actualWords) / expectedWords.length : null,
    cer: expected.length ? editDistance(Array.from(expected), Array.from(actual)) / Array.from(expected).length : null,
  };
}

function parseArgs(argv) {
  const models = [];
  const fixtures = [];
  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === "--model") {
      const [id, file] = String(argv[++index] || "").split("=");
      if (id && file) models.push({ id, file: path.resolve(file) });
    } else if (argv[index] === "--fixture") {
      const value = String(argv[++index] || "");
      const [descriptor, reference = ""] = value.split("::");
      const separator = descriptor.indexOf("=");
      if (separator > 0) fixtures.push({ language: descriptor.slice(0, separator), file: path.resolve(descriptor.slice(separator + 1)), reference });
    }
  }
  return { models, fixtures };
}

function wavDuration(file) {
  const header = fs.readFileSync(file).subarray(0, 44);
  const sampleRate = header.readUInt32LE(24);
  const channels = header.readUInt16LE(22);
  const bits = header.readUInt16LE(34);
  const dataBytes = Math.max(0, fs.statSync(file).size - 44);
  return dataBytes / (sampleRate * channels * (bits / 8));
}

function defaults() {
  const modelDirs = [
    path.join(os.homedir(), ".config", "budgetpro", "voice-models"),
    "/tmp/budgetpro-whisper-test/voice-models",
    "/tmp/budgetpro-voice-models",
  ];
  const wanted = [
    ["small", "ggml-small.bin"],
    ["large-v3-turbo-q5_0", "ggml-large-v3-turbo-q5_0.bin"],
    ["large-v3-turbo", "ggml-large-v3-turbo.bin"],
  ];
  const models = [];
  for (const [id, filename] of wanted) {
    const file = modelDirs.map((dir) => path.join(dir, filename)).find(fs.existsSync);
    if (file) models.push({ id, file });
  }
  const sample = path.join(root, "vendor", "whisper", "source", "samples", "jfk.wav");
  const fixtures = fs.existsSync(sample) ? [{ language: "en", file: sample, reference: DEFAULT_REFERENCE }] : [];
  return { models, fixtures };
}

function benchmark(model, fixture) {
  const outputBase = path.join(os.tmpdir(), `budgetpro-bench-${process.pid}-${model.id}-${fixture.language}`);
  const args = [
    "-f", "VOICE_BENCH_METRICS wall=%e rss_kb=%M",
    binary,
    "--model", model.file,
    "--file", fixture.file,
    "--language", fixture.language,
    "--beam-size", "5",
    "--best-of", "5",
    "--threads", String(Math.max(2, Math.min(6, os.cpus().length - 1))),
    "--output-txt",
    "--output-file", outputBase,
    "--no-timestamps",
  ];
  const run = spawnSync("/usr/bin/time", args, { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (run.status !== 0) throw new Error(run.stderr || `benchmark failed for ${model.id}`);
  const text = fs.readFileSync(`${outputBase}.txt`, "utf8").trim();
  fs.rmSync(`${outputBase}.txt`, { force: true });
  const metrics = run.stderr.match(/VOICE_BENCH_METRICS wall=([\d.]+) rss_kb=(\d+)/);
  const rates = fixture.reference ? errorRates(fixture.reference, text) : { wer: null, cer: null };
  return {
    model: model.id,
    language: fixture.language,
    audioSeconds: Number(wavDuration(fixture.file).toFixed(2)),
    transcriptionSeconds: metrics ? Number(metrics[1]) : null,
    peakRssMiB: metrics ? Number((Number(metrics[2]) / 1024).toFixed(1)) : null,
    wer: rates.wer === null ? null : Number(rates.wer.toFixed(4)),
    cer: rates.cer === null ? null : Number(rates.cer.toFixed(4)),
    result: text,
  };
}

function main() {
  if (!fs.existsSync(binary)) throw new Error("Run npm run voice:prepare first");
  const supplied = parseArgs(process.argv.slice(2));
  const found = defaults();
  const models = supplied.models.length ? supplied.models : found.models;
  const fixtures = supplied.fixtures.length ? supplied.fixtures : found.fixtures;
  if (!models.length || !fixtures.length) throw new Error("Provide --model id=/path/model.bin and --fixture lang=/path/audio.wav::reference");
  const results = [];
  for (const model of models) {
    for (const fixture of fixtures) results.push(benchmark(model, fixture));
  }
  console.table(results.map(({ result, ...row }) => row));
  for (const result of results) console.log(`\n[${result.model}/${result.language}] ${result.result}`);
  console.log(`\n${JSON.stringify(results, null, 2)}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
}

module.exports = { editDistance, errorRates, normalizeForScore };
