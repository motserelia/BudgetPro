"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

function installControllerMocks() {
  const tracks = [];
  const contexts = [];
  const values = new Map();
  global.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
  global.navigator = {
    mediaDevices: {
      getSupportedConstraints: () => ({}),
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
    createScriptProcessor() { return new MockNode(); }
    createGain() { const node = new MockNode(); node.gain = { value: 1 }; return node; }
    async close() { this.state = "closed"; }
  }
  global.AudioContext = MockContext;
  global.budgetPRODesktopVoice = {
    transcribe: async () => ({ text: "test", language: "en" }),
  };
  return { tracks, contexts };
}

test("closing the voice screen releases its active microphone", async () => {
  const mocks = installControllerMocks();
  require("../www/voice/voice-core.js");
  require("../www/voice/voice-capture.js");
  require("../www/voice/voice-controller.js");

  await global.BudgetPROVoiceModule.start();
  assert.equal(mocks.tracks[0].stopped, false);
  global.BudgetPROVoiceModule.disposeScreen();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(mocks.tracks[0].stopped, true);
  assert.equal(mocks.contexts[0].state, "closed");
});

test("two rapid starts create only one microphone capture", async () => {
  const mocks = installControllerMocks();
  const first = global.BudgetPROVoiceModule.start();
  const second = global.BudgetPROVoiceModule.start();
  const [, secondResult] = await Promise.all([first, second]);
  assert.equal(secondResult.busy, true);
  assert.equal(mocks.tracks.length, 1);
  await global.BudgetPROVoiceModule.cancel();
  assert.equal(mocks.tracks[0].stopped, true);
});
