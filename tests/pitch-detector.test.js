const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "pitch-detector.js"), "utf8");
const { YinPitchDetector, PitchTracker } = vm.runInNewContext(`${source}\n({ YinPitchDetector, PitchTracker })`);

function signal(frequency, sampleRate, amplitude = 0.3) {
  return Float32Array.from({ length: 8192 }, (_, i) =>
    amplitude * (Math.sin(2 * Math.PI * frequency * i / sampleRate) +
      0.35 * Math.sin(4 * Math.PI * frequency * i / sampleRate)));
}

test("YIN measures low guitar notes and cent offsets within one cent", () => {
  const detector = new YinPitchDetector();
  for (const sampleRate of [44100, 48000, 96000]) {
    for (const frequency of [55, 61.735, 82.407, 110, 329.628, 440]) {
      for (const offset of [-17, 0, 23]) {
        const expected = frequency * 2 ** (offset / 1200);
        const result = detector.detect(signal(expected, sampleRate), sampleRate);
        assert.ok(result.frequency, `${sampleRate} Hz, ${expected} Hz not detected`);
        const error = Math.abs(1200 * Math.log2(result.frequency / expected));
        assert.ok(error < 1, `${sampleRate} Hz, ${expected} Hz: ${error} cents`);
      }
    }
  }
});

test("noise gate and YIN reject silence and nonperiodic noise", () => {
  const detector = new YinPitchDetector();
  assert.equal(detector.detect(signal(55, 48000, 0.001), 48000).frequency, null);
  let seed = 42;
  const noise = Float32Array.from({ length: 8192 }, () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return (seed / 0x100000000 - 0.5) * 0.2;
  });
  assert.equal(detector.detect(noise, 48000).frequency, null);
});

test("median rejects isolated outliers and octave filter allows sustained new notes", () => {
  const tracker = new PitchTracker();
  [100, 100.1, 99.9, 100, 100].forEach((value, i) => tracker.update(value, 0.2, i * 50));
  assert.equal(tracker.update(140, 0.2, 250), 100);
  assert.equal(tracker.update(200, 0.1, 300), null);
  assert.equal(tracker.update(200, 0.08, 900), null);
  assert.equal(tracker.update(200, 0.07, 2000), null);
  assert.equal(tracker.update(200, 0.15, 2050), 200);
  tracker.reset();
  tracker.update(100, 0.1, 0);
  assert.notEqual(tracker.update(200, 0.2, 50), null);
});
