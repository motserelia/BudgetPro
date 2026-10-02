"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");

const WHISPER_VERSION = "v1.9.2";
const MODELS = Object.freeze({
  primary: Object.freeze({
    id: "large-v3-turbo-q5_0",
    version: "1",
    name: "ggml-large-v3-turbo-q5_0.bin",
    displayName: "Whisper large-v3-turbo Q5 multilingual",
    url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin",
    sha1: "e050f7970618a659205450ad97eb95a18d69c9ee",
    size: 574041195,
  }),
  fallback: Object.freeze({
    id: "small",
    version: "1",
    name: "ggml-small.bin",
    displayName: "Whisper small multilingual (fallback)",
    url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin",
    sha1: "55356645c2b361a969dfd0ef2c5a50d530afd8d5",
    size: 487601967,
  }),
});
const MODEL = MODELS.primary;
const LANGUAGES = new Set(["auto", "ru", "en", "ka"]);
const RESTRICTED_LANGUAGES = ["ru", "en", "ka"];

class WhisperEngine {
  constructor({ app, isPackaged, onProgress = () => {} }) {
    this.app = app;
    this.isPackaged = isPackaged;
    this.onProgress = onProgress;
    this.modelDir = path.join(app.getPath("userData"), "voice-models");
    const binaryDir = isPackaged
      ? path.join(process.resourcesPath, "whisper", "bin")
      : path.join(app.getAppPath(), "vendor", "whisper", "bin");
    this.binaryPath = path.join(binaryDir, "whisper-cli");
    this.serverBinaryPath = path.join(binaryDir, "whisper-server");
    this.downloadPromise = null;
    this.activeProcess = null;
    this.serverProcess = null;
    this.serverReady = false;
    this.serverModelId = "";
    this.serverPort = 0;
    this.serverSecret = crypto.randomBytes(18).toString("hex");
    this.serverStartPromise = null;
    this.activeRequest = false;
    this.validationCache = new Map();
  }

  modelPath(model) {
    return path.join(this.modelDir, model.name);
  }

  manifestPath(model) {
    return `${this.modelPath(model)}.manifest.json`;
  }

  async fileStatus(filePath) {
    try {
      const stat = await fsp.stat(filePath);
      return { exists: stat.isFile(), size: stat.size, mtimeMs: stat.mtimeMs };
    } catch (error) {
      return { exists: false, size: 0, mtimeMs: 0 };
    }
  }

  async hashFile(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha1");
      const input = fs.createReadStream(filePath);
      input.on("error", reject);
      input.on("data", (chunk) => hash.update(chunk));
      input.on("end", () => resolve(hash.digest("hex")));
    });
  }

  async validateModel(model) {
    const file = await this.fileStatus(this.modelPath(model));
    if (!file.exists || file.size !== model.size) return false;
    const cacheKey = `${file.size}:${file.mtimeMs}`;
    if (this.validationCache.get(model.id) === cacheKey) return true;
    try {
      const manifest = JSON.parse(await fsp.readFile(this.manifestPath(model), "utf8"));
      if (manifest.id === model.id && manifest.version === model.version && manifest.sha1 === model.sha1 && manifest.size === model.size) {
        this.validationCache.set(model.id, cacheKey);
        return true;
      }
    } catch (error) {}
    if ((await this.hashFile(this.modelPath(model))) !== model.sha1) return false;
    await this.writeManifest(model);
    this.validationCache.set(model.id, cacheKey);
    return true;
  }

  async writeManifest(model) {
    const destination = this.manifestPath(model);
    const partial = `${destination}.partial`;
    await fsp.writeFile(partial, JSON.stringify({
      id: model.id,
      version: model.version,
      filename: model.name,
      sha1: model.sha1,
      size: model.size,
      whisperVersion: WHISPER_VERSION,
    }), { flag: "w" });
    await fsp.rename(partial, destination);
  }

  async selectModel() {
    if (await this.validateModel(MODELS.primary)) return MODELS.primary;
    if (await this.validateModel(MODELS.fallback)) return MODELS.fallback;
    return null;
  }

  async status() {
    const [binary, serverBinary, primaryReady, fallbackReady] = await Promise.all([
      this.fileStatus(this.binaryPath),
      this.fileStatus(this.serverBinaryPath),
      this.validateModel(MODELS.primary),
      this.validateModel(MODELS.fallback),
    ]);
    const selected = primaryReady ? MODELS.primary : fallbackReady ? MODELS.fallback : null;
    return {
      available: (serverBinary.exists || binary.exists) && primaryReady,
      canTranscribe: (serverBinary.exists || binary.exists) && !!selected,
      binaryAvailable: serverBinary.exists || binary.exists,
      persistentServerAvailable: serverBinary.exists,
      persistentServerReady: this.serverReady,
      modelAvailable: primaryReady,
      fallbackModelAvailable: fallbackReady,
      needsUpgrade: !primaryReady && fallbackReady,
      modelId: MODELS.primary.id,
      activeModelId: selected?.id || "",
      modelName: MODELS.primary.displayName,
      activeModelName: selected?.displayName || "",
      modelBytes: primaryReady ? MODELS.primary.size : 0,
      expectedBytes: MODELS.primary.size,
      modelVersion: MODELS.primary.version,
      whisperVersion: WHISPER_VERSION,
      downloading: !!this.downloadPromise,
    };
  }

  async installModel() {
    if (await this.validateModel(MODELS.primary)) return this.status();
    if (this.downloadPromise) return this.downloadPromise;
    this.downloadPromise = this.downloadModel(MODELS.primary).finally(() => {
      this.downloadPromise = null;
    });
    return this.downloadPromise;
  }

  async downloadModel(model) {
    await fsp.mkdir(this.modelDir, { recursive: true });
    const destination = this.modelPath(model);
    const partialPath = `${destination}.partial`;
    await fsp.rm(partialPath, { force: true });
    const response = await fetch(model.url, { redirect: "follow" });
    if (!response.ok || !response.body) throw new Error(`model_download_failed:${response.status}`);
    const total = Number(response.headers.get("content-length")) || model.size;
    const hash = crypto.createHash("sha1");
    const output = fs.createWriteStream(partialPath, { flags: "wx" });
    let received = 0;
    try {
      for await (const chunk of response.body) {
        received += chunk.length;
        hash.update(chunk);
        if (!output.write(chunk)) await new Promise((resolve) => output.once("drain", resolve));
        this.onProgress({ modelId: model.id, received, total, ratio: Math.min(1, received / total) });
      }
      await new Promise((resolve, reject) => output.end((error) => (error ? reject(error) : resolve())));
      if (received !== model.size) throw new Error("model_download_incomplete");
      if (hash.digest("hex") !== model.sha1) throw new Error("model_checksum_mismatch");
      await fsp.rename(partialPath, destination);
      await this.writeManifest(model);
      this.validationCache.clear();
      if (this.serverModelId && this.serverModelId !== model.id) this.disposeServer();
      return this.status();
    } catch (error) {
      output.destroy();
      await fsp.rm(partialPath, { force: true });
      throw error;
    }
  }

  async transcribe({ wav, language = "auto", audioMetrics = null }) {
    const model = await this.selectModel();
    const [binary, serverBinary] = await Promise.all([this.fileStatus(this.binaryPath), this.fileStatus(this.serverBinaryPath)]);
    if (!binary.exists && !serverBinary.exists) throw new Error("engine_missing");
    if (!model) throw new Error("model_missing");
    if (this.activeRequest || this.activeProcess) throw new Error("transcription_busy");
    const normalizedLanguage = LANGUAGES.has(language) ? language : "auto";
    const bytes = Buffer.from(wav);
    if (bytes.length < 44 || bytes.length > 32 * 1024 * 1024) throw new Error("invalid_audio_payload");
    if (serverBinary.exists) return this.transcribeWithServer(bytes, normalizedLanguage, model, audioMetrics);
    return this.transcribeWithCli(bytes, normalizedLanguage, model, audioMetrics);
  }

  async getFreePort() {
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.unref();
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        server.close(() => resolve(port));
      });
    });
  }

  async ensureServer(model) {
    if (this.serverReady && this.serverProcess && this.serverModelId === model.id) return;
    if (this.serverProcess && this.serverModelId !== model.id) this.disposeServer();
    if (this.serverStartPromise) return this.serverStartPromise;
    this.serverStartPromise = this.startServer(model).finally(() => {
      this.serverStartPromise = null;
    });
    return this.serverStartPromise;
  }

  async startServer(model) {
    this.serverPort = await this.getFreePort();
    this.serverModelId = model.id;
    const requestPath = `/${this.serverSecret}`;
    const args = [
      "--model", this.modelPath(model), "--host", "127.0.0.1", "--port", String(this.serverPort),
      "--request-path", requestPath, "--public", this.modelDir, "--language", "auto", "--no-gpu",
      "--threads", String(Math.max(2, Math.min(6, os.cpus().length - 1))),
    ];
    const child = spawn(this.serverBinaryPath, args, { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
    this.serverProcess = child;
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-16000); });
    child.once("error", (error) => {
      this.serverReady = false;
      this.serverProcess = null;
      console.error("[Whisper server]", error);
    });
    child.once("close", (code) => {
      this.serverReady = false;
      this.serverProcess = null;
      if (code && code !== 143) console.error(`[Whisper server exited ${code}] ${stderr}`);
    });
    const deadline = Date.now() + 120000;
    const healthUrl = `http://127.0.0.1:${this.serverPort}${requestPath}/health`;
    while (Date.now() < deadline) {
      if (!this.serverProcess) throw new Error(`whisper_server_failed:${stderr.trim()}`);
      try {
        const response = await fetch(healthUrl, { signal: AbortSignal.timeout(1000) });
        if (response.ok) {
          this.serverReady = true;
          return;
        }
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    this.disposeServer();
    throw new Error("whisper_server_timeout");
  }

  async requestServer(bytes, options) {
    const body = new FormData();
    body.append("file", new Blob([bytes], { type: "audio/wav" }), "speech.wav");
    body.append("language", options.language);
    body.append("translate", "false");
    body.append("response_format", "verbose_json");
    body.append("no_timestamps", "true");
    body.append("suppress_nst", "true");
    body.append("no_context", "true");
    body.append("beam_size", "5");
    body.append("best_of", "5");
    body.append("temperature", "0.0");
    body.append("temperature_inc", "0.2");
    body.append("detect_language", options.detectOnly ? "true" : "false");
    body.append("no_language_probabilities", options.includeProbabilities ? "false" : "true");
    const response = await fetch(`http://127.0.0.1:${this.serverPort}/${this.serverSecret}/inference`, {
      method: "POST", body, signal: AbortSignal.timeout(180000),
    });
    if (!response.ok) {
      const detail = (await response.text()).replace(/\s+/g, " ").trim().slice(0, 240);
      throw new Error(`whisper_server_http:${response.status}:${detail}`);
    }
    return response.json();
  }

  scorePayload(payload) {
    const segments = Array.isArray(payload?.segments) ? payload.segments : [];
    if (!segments.length) return -Infinity;
    return segments.reduce((sum, segment) => {
      const logprob = Number(segment.avg_logprob ?? segment.avg_log_prob ?? -2);
      const noSpeech = Number(segment.no_speech_prob ?? 0);
      return sum + logprob - noSpeech * 0.35;
    }, 0) / segments.length;
  }

  extractInformativeWav(bytes, maxDurationMs = 6500) {
    if (
      bytes.length < 46 ||
      bytes.toString("ascii", 0, 4) !== "RIFF" ||
      bytes.toString("ascii", 36, 40) !== "data"
    ) return bytes;
    const channels = bytes.readUInt16LE(22);
    const sampleRate = bytes.readUInt32LE(24);
    const bitsPerSample = bytes.readUInt16LE(34);
    if (channels !== 1 || bitsPerSample !== 16 || sampleRate < 8000) return bytes;
    const bytesPerSample = 2;
    const frameSamples = Math.max(1, Math.round(sampleRate * 0.02));
    const frameBytes = frameSamples * bytesPerSample;
    const dataStart = 44;
    let noiseFloor = 0.006;
    let speechOffset = dataStart;
    for (let offset = dataStart; offset + frameBytes <= bytes.length; offset += frameBytes) {
      let energy = 0;
      let peak = 0;
      for (let cursor = offset; cursor < offset + frameBytes; cursor += 2) {
        const sample = bytes.readInt16LE(cursor) / 32768;
        energy += sample * sample;
        peak = Math.max(peak, Math.abs(sample));
      }
      const rms = Math.sqrt(energy / frameSamples);
      const threshold = noiseFloor * 2.1 + 0.006;
      if (rms > threshold || peak > threshold * 3) {
        speechOffset = Math.max(dataStart, offset - Math.round(sampleRate * 0.35) * bytesPerSample);
        break;
      }
      noiseFloor += (rms - noiseFloor) * 0.08;
    }
    const maxBytes = Math.round(sampleRate * (maxDurationMs / 1000)) * bytesPerSample;
    const dataEnd = Math.min(bytes.length, speechOffset + maxBytes);
    if (speechOffset === dataStart && dataEnd === bytes.length) return bytes;
    const pcm = bytes.subarray(speechOffset, dataEnd);
    const excerpt = Buffer.allocUnsafe(44 + pcm.length);
    bytes.copy(excerpt, 0, 0, 44);
    pcm.copy(excerpt, 44);
    excerpt.writeUInt32LE(36 + pcm.length, 4);
    excerpt.writeUInt32LE(pcm.length, 40);
    return excerpt;
  }

  async detectRestrictedLanguage(bytes) {
    const excerpt = this.extractInformativeWav(bytes);
    const detection = await this.requestServer(excerpt, { language: "auto", detectOnly: true, includeProbabilities: true });
    const probabilities = detection.language_probabilities || {};
    const ranked = RESTRICTED_LANGUAGES
      .map((language) => ({ language, confidence: Number(probabilities[language] || 0) }))
      .sort((a, b) => b.confidence - a.confidence);
    return {
      language: ranked[0].language,
      confidence: ranked[0].confidence,
      margin: ranked[0].confidence - ranked[1].confidence,
      ranked,
    };
  }

  async transcribeWithServer(bytes, language, model, audioMetrics) {
    await this.ensureServer(model);
    this.activeRequest = true;
    const startedAt = performance.now();
    try {
      let selectedLanguage = language;
      let detectedLanguage = language;
      let languageConfidence = language === "auto" ? 0 : 1;
      let payload;
      let ambiguous = false;
      if (language === "auto") {
        const detection = await this.detectRestrictedLanguage(bytes);
        selectedLanguage = detection.language;
        detectedLanguage = detection.language;
        languageConfidence = detection.confidence;
        ambiguous = detection.confidence < 0.46 || detection.margin < 0.1;
        if (ambiguous) {
          const candidates = [];
          for (const candidate of detection.ranked.slice(0, 2)) {
            candidates.push({
              language: candidate.language,
              confidence: candidate.confidence,
              payload: await this.requestServer(bytes, { language: candidate.language, detectOnly: false, includeProbabilities: false }),
            });
          }
          candidates.sort((a, b) => this.scorePayload(b.payload) - this.scorePayload(a.payload));
          selectedLanguage = candidates[0].language;
          detectedLanguage = candidates[0].language;
          languageConfidence = candidates[0].confidence;
          payload = candidates[0].payload;
        }
      }
      if (!payload) {
        payload = await this.requestServer(bytes, { language: selectedLanguage, detectOnly: false, includeProbabilities: false });
      }
      const rawText = String(payload.text || "").normalize("NFC").replace(/\s+/gu, " ").trim();
      return {
        text: rawText,
        rawText,
        language: detectedLanguage,
        selectedLanguage,
        languageConfidence,
        diagnostics: {
          backend: "whisper-server", server: "persistent", whisperVersion: WHISPER_VERSION,
          modelId: model.id, modelName: model.displayName, selectedLanguage: language,
          detectedLanguage, languageConfidence, restrictedAuto: language === "auto",
          ambiguousAuto: ambiguous, transcriptionMs: Math.round(performance.now() - startedAt), audio: audioMetrics || null,
        },
      };
    } finally {
      this.activeRequest = false;
    }
  }

  async transcribeWithCli(bytes, language, model, audioMetrics) {
    const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "budgetpro-voice-"));
    const inputPath = path.join(tempDir, "speech.wav");
    const outputBase = path.join(tempDir, "transcript");
    await fsp.writeFile(inputPath, bytes, { flag: "wx" });
    const startedAt = performance.now();
    try {
      const args = [
        "--model", this.modelPath(model), "--file", inputPath, "--language", language,
        "--beam-size", "5", "--best-of", "5", "--output-json", "--output-file", outputBase,
        "--no-timestamps", "--no-prints", "--suppress-nst",
        "--threads", String(Math.max(2, Math.min(6, os.cpus().length - 1))),
      ];
      await this.run(args);
      const payload = JSON.parse(await fsp.readFile(`${outputBase}.json`, "utf8"));
      const joined = Array.isArray(payload.transcription)
        ? payload.transcription.map((item) => item.text || "").join(" ")
        : payload.text || "";
      const detectedLanguage = payload.result?.language || payload.language || language;
      const text = String(joined).normalize("NFC").replace(/\s+/gu, " ").trim();
      return {
        text, rawText: text, language: detectedLanguage, selectedLanguage: language,
        languageConfidence: language === "auto" ? null : 1,
        diagnostics: {
          backend: "whisper-cli-fallback", server: "none", whisperVersion: WHISPER_VERSION,
          modelId: model.id, modelName: model.displayName, selectedLanguage: language,
          detectedLanguage, languageConfidence: language === "auto" ? null : 1,
          restrictedAuto: false, transcriptionMs: Math.round(performance.now() - startedAt), audio: audioMetrics || null,
        },
      };
    } finally {
      await fsp.rm(tempDir, { recursive: true, force: true });
    }
  }

  run(args) {
    return new Promise((resolve, reject) => {
      const child = spawn(this.binaryPath, args, { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
      this.activeProcess = child;
      let stderr = "";
      child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-16000); });
      child.once("error", reject);
      child.once("close", (code) => {
        this.activeProcess = null;
        if (code === 0) resolve();
        else reject(new Error(`whisper_failed:${code}:${stderr.trim()}`));
      });
    });
  }

  disposeServer() {
    if (this.serverProcess) this.serverProcess.kill("SIGTERM");
    this.serverProcess = null;
    this.serverReady = false;
    this.serverModelId = "";
  }

  dispose() {
    if (this.activeProcess) this.activeProcess.kill("SIGTERM");
    this.activeProcess = null;
    this.disposeServer();
  }
}

module.exports = { MODEL, MODELS, WHISPER_VERSION, WhisperEngine };
