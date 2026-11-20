const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "music-theory.js"), "utf8");
const engine = vm.runInNewContext(`${source}\nMusicTheoryEngine`);
const values = (array) => Array.from(array);

test("frequency and note names respect MIDI octaves and reference tuning", () => {
  assert.equal(engine.frequency(69), 440);
  assert.equal(engine.frequency(57, 442), 221);
  assert.equal(engine.midiFromFrequency(221, 442), 57);
  assert.equal(engine.noteName(35), "B1");
  assert.equal(engine.noteName(engine.stringNote(engine.tunings.standard[2], 2)), "A3");
});

test("chord pitch classes wrap around the octave for all chord types", () => {
  assert.deepEqual(values(engine.chordNotes(11, "major")), [11, 3, 6]);
  assert.deepEqual(values(engine.chordNotes(0, "minor")), [0, 3, 7]);
  assert.deepEqual(values(engine.chordNotes(0, "diminished")), [0, 3, 6]);
  assert.deepEqual(values(engine.chordNotes(0, "augmented")), [0, 4, 8]);
  assert.deepEqual(values(engine.chordNotes(0, "major7")), [0, 4, 7, 11]);
  assert.deepEqual(values(engine.chordNotes(0, "minor7")), [0, 3, 7, 10]);
  assert.deepEqual(values(engine.chordNotes(0, "dominant7")), [0, 4, 7, 10]);
});

test("alternate guitar tunings retain the correct string pitches", () => {
  assert.deepEqual(values(engine.tunings.dropD).map((midi) => engine.noteName(midi)), ["E4", "B3", "G3", "D3", "A2", "D2"]);
  assert.deepEqual(values(engine.tunings.dropB).map((midi) => engine.noteName(midi)), ["C#4", "G#3", "E3", "B2", "F#2", "B1"]);
  assert.deepEqual(values(engine.tunings.openG).map((midi) => engine.noteName(midi)), ["D4", "B3", "G3", "D3", "G2", "D2"]);
});
