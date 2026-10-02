"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

require("../www/voice/voice-core.js");
require("../www/voice/voice-capture.js");

function installAudioMocks() {
  const tracks = [];
  const contexts = [];
  global.navigator = {
    mediaDevices: {
      getSupportedConstraints: () => ({ echoCancellation: true, noiseSuppression: true, autoGainControl: true }),
      getUserMedia: async () => {
        const track = { stopped: false, stop() { this.stopped = true; } };
        tracks.push(track);
        return { getTracks: () => [track] };
      },
    },
  };
  class MockNode {
    connect() {}
    disconnect() {}
  }
  class MockContext {
    constructor() {
      this.sampleRate = 48000;
      this.state = "running";
      this.destination = {};
      contexts.push(this);
    }
    createMediaStreamSource() { return new MockNode(); }
    createScriptProcessor() { this.processor = new MockNode(); return this.processor; }
    createGain() { const node = new MockNode(); node.gain = { value: 1 }; return node; }
    async resume() {}
    async close() { this.state = "closed"; }
  }
  global.AudioContext = MockContext;
  return { tracks, contexts };
}

function feed(context, amplitude = 0.08) {
  const data = Float32Array.from({ length: 4096 }, (_, index) => Math.sin(index * 0.1) * amplitude);
  context.processor.onaudioprocess({ inputBuffer: { getChannelData: () => data } });
}

test("stop and cancel release every microphone track and AudioContext", async () => {
  const mocks = installAudioMocks();
  const first = new global.BudgetPROVoiceCapture({ mode: "auto" });
  await first.start();
  feed(mocks.contexts[0]);
  const firstResult = await first.stop();
  assert.equal(mocks.tracks[0].stopped, true);
  assert.equal(mocks.contexts[0].state, "closed");
  assert.equal(firstResult.audioMetrics.sampleRate, 16000);
  assert.equal(firstResult.audioMetrics.channelCount, 1);
  assert.ok(firstResult.audioMetrics.rms > 0);
  assert.ok(firstResult.audioMetrics.peak > 0);

  const second = new global.BudgetPROVoiceCapture({ mode: "whisper" });
  await second.start();
  feed(mocks.contexts[1], 0.03);
  await second.cancel();
  assert.equal(mocks.tracks[1].stopped, true);
  assert.equal(mocks.contexts[1].state, "closed");
});

test("two sequential captures do not share processors or completion events", async () => {
  const mocks = installAudioMocks();
  let completions = 0;
  for (let run = 0; run < 2; run++) {
    const capture = new global.BudgetPROVoiceCapture({ onComplete: () => completions++ });
    await capture.start();
    feed(mocks.contexts[run]);
    await capture.stop();
  }
  assert.equal(completions, 2);
  assert.notEqual(mocks.contexts[0].processor, mocks.contexts[1].processor);
  assert.equal(mocks.tracks.every((track) => track.stopped), true);
});

test("denied microphone permission is reported without starting capture", async () => {
  global.navigator = {
    mediaDevices: {
      getSupportedConstraints: () => ({}),
      getUserMedia: async () => {
        const error = new Error("Permission denied");
        error.name = "NotAllowedError";
        throw error;
      },
    },
  };
  const capture = new global.BudgetPROVoiceCapture();
  await assert.rejects(capture.start(), /microphone_denied/);
  assert.equal(capture.active, false);
  assert.equal(capture.stream, undefined);
});
