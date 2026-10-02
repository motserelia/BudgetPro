"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { editDistance, errorRates, normalizeForScore } = require("../scripts/voice-benchmark.js");

test("benchmark WER and CER helpers are Unicode-aware", () => {
  assert.equal(editDistance(["a", "b"], ["a", "c"]), 1);
  assert.equal(normalizeForScore("ეს არის ტესტი!"), "ეს არის ტესტი");
  assert.deepEqual(errorRates("დღეს ახალი დავალება", "დღეს ახალი დავალება"), { wer: 0, cer: 0 });
  const changed = errorRates("one two three", "one two four");
  assert.equal(changed.wer, 1 / 3);
  assert.ok(changed.cer > 0);
});
