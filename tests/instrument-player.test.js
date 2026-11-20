const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "instrument-player.js"), "utf8");
const InstrumentPlayer = vm.runInNewContext(`${source}\nInstrumentPlayer`, { atob, Uint8Array });

test("plays cached samples polyphonically with tuned pitch and scheduled offsets", async () => {
  const played = [];
  let decodes = 0;
  const context = {
    currentTime: 3,
    destination: {},
    async decodeAudioData(bytes) { decodes++; return { bytes }; },
    createBufferSource() {
      const source = { playbackRate: {}, connect() { return this; }, start(time) { played.push({ time, rate: this.playbackRate.value }); }, stop() {} };
      return source;
    },
    createGain() {
      return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; } };
    }
  };
  const player = new InstrumentPlayer(context, { INSPiano_Vel02_C4_01: btoa("sample") });
  const events = [
    { midi: 60, offset: 0, duration: 0.5, gain: 0.3 },
    { midi: 61, offset: 0.22, duration: 0.5, gain: 0.3 }
  ];
  assert.equal(await player.play("piano", events, 442), 3.05);
  assert.equal(decodes, 1);
  assert.equal(played[0].time, 3.05);
  assert.ok(Math.abs(played[1].time - 3.27) < 1e-10);
  assert.ok(Math.abs(played[0].rate - 442 / 440) < 1e-10);
  assert.ok(Math.abs(played[1].rate - Math.pow(2, 1 / 12) * 442 / 440) < 1e-10);
});

test("reports a missing sample instead of producing a synthesized sound", async () => {
  const player = new InstrumentPlayer({}, {});
  await assert.rejects(player.play("guitar", [{ midi: 40 }], 440), /Missing instrument sample/);
});

test("replay cancels active and scheduled channel sources without affecting other playback", async () => {
  const sources = [];
  const context = {
    currentTime: 3, destination: {}, async decodeAudioData() { return {}; },
    createBufferSource() {
      const source = { playbackRate: {}, stops: [], connect() { return this; }, start() {}, stop(time) { this.stops.push(time); } };
      sources.push(source);
      return source;
    },
    createGain() {
      return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {},
        cancelScheduledValues() {}, setTargetAtTime() {} }, connect() { return this; } };
    }
  };
  const player = new InstrumentPlayer(context, { INSPiano_Vel02_C4_01: btoa("sample") });
  const events = [{ midi: 60, offset: 0, duration: 1, gain: 0.3 }, { midi: 60, offset: 1, duration: 1, gain: 0.3 }];
  await player.play("piano", events, 440, "ear");
  await player.play("piano", [events[0]], 440);
  context.currentTime = 3.2;
  await player.play("piano", [events[0]], 440, "ear");
  assert.ok(Math.abs(sources[0].stops.at(-1) - 3.28) < 1e-10);
  assert.equal(sources[1].stops.at(-1), 3.2);
  assert.equal(sources[2].stops.length, 1);
});

test("a stopped channel cannot start after an asynchronous sample load", async () => {
  let resolve;
  let started = 0;
  const context = { currentTime: 0, destination: {},
    decodeAudioData() { return new Promise((done) => { resolve = done; }); },
    createBufferSource() { started++; return {}; }
  };
  const player = new InstrumentPlayer(context, { INSPiano_Vel02_C4_01: btoa("sample") });
  const playback = player.play("piano", [{ midi: 60, offset: 0, duration: 1, gain: 0.3 }], 440, "ear");
  player.stop("ear");
  resolve({});
  assert.equal(await playback, null);
  assert.equal(started, 0);
});
