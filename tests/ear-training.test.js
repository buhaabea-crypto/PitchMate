const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = ["music-theory.js", "ear-training-engine.js"]
  .map((file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8")).join("\n");
const engine = vm.runInNewContext(`${source}\nEarTrainingEngine`);
const values = (array) => Array.from(array);
const randomSequence = (...values) => {
  let index = 0;
  return () => values[index++ % values.length];
};

test("interval questions cover hard tritone and compound intervals and honor direction", () => {
  const tritone = engine.create("interval", "hard", 60, 60, 0.5, "descending", randomSequence(0, 5 / 19));
  assert.equal(tritone.answer, "TT");
  assert.deepEqual(values(tritone.events).map((event) => event.midi), [66, 60]);
  const compound = engine.create("interval", "hard", 60, 60, 0.5, "harmonic", randomSequence(0, 0.999));
  assert.equal(compound.answer, "P12");
  assert.deepEqual(values(compound.events).map((event) => event.offset), [0, 0]);
  assert.deepEqual(values(compound.events).map((event) => event.midi), [60, 79]);
});

test("seventh chords include inversions without changing chord quality", () => {
  const chord = engine.create("chord", "hard", 60, 60, 0.5, "mixed", randomSequence(0, 7 / 9, 0.5));
  assert.equal(chord.answer, "halfDiminished7");
  assert.deepEqual(values(chord.events).map((event) => event.midi), [66, 70, 72, 75]);
  assert.deepEqual(values(engine.chords.diminished7), [0, 3, 6, 9]);
});

test("descending melodic minor uses the same identifiable pitches as ascending", () => {
  const scale = engine.create("scale", "medium", 60, 60, 0.5, "descending", randomSequence(0, 0.8));
  assert.equal(scale.answer, "melodicMinor");
  assert.deepEqual(values(scale.events).map((event) => event.midi), [72, 71, 69, 67, 65, 63, 62, 60]);
});

test("dictation generates diatonic melodies of increasing length after the tonic chord", () => {
  for (const [difficulty, length] of [["easy", 3], ["medium", 4], ["hard", 6]]) {
    const question = engine.create("dictation", difficulty, 61, 61, 0.5, "mixed", () => 0.3);
    assert.equal(question.notes.length, length);
    assert.deepEqual(values(question.events).slice(0, 3).map((event) => event.midi), [61, 65, 68]);
    assert.deepEqual(values(question.events).slice(3).map((event) => event.midi % 12), values(question.notes));
    assert.ok(values(question.events).slice(3).every((event) => event.offset >= 1));
  }
});

test("pitch matching starts detuned and invalid ranges fail explicitly", () => {
  const question = engine.create("pitch", "easy", 60, 60, 0.5, "mixed", () => 0);
  assert.equal(question.initialCents, -12);
  assert.equal(question.events[0].midi, 60);
  assert.equal(engine.create("pitch", "hard", 60, 60, 0.5, "mixed", () => 0).initialCents, -1);
  assert.throws(() => engine.create("pitch", "easy", 70, 60, 0.5, "mixed"), /Invalid exercise settings/);
});

test("scores count one attempt at a time and preserve the best streak", () => {
  let score = { attempts: 0, correct: 0, streak: 0, best: 0 };
  score = engine.updateScore(score, true);
  score = engine.updateScore(score, true);
  score = engine.updateScore(score, false);
  score = engine.updateScore(score, true);
  assert.deepEqual({ ...score }, { attempts: 4, correct: 3, streak: 1, best: 2 });
});

test("dictation requires the complete melody in order", () => {
  assert.equal(engine.matchesMelody([0, 4, 7], [0, 4, 7]), true);
  assert.equal(engine.matchesMelody([0, 4, 7], [0, 4]), false);
  assert.equal(engine.matchesMelody([0, 4, 7], [0, 7, 4]), false);
});

test("weakest-area practice targets the selected answer or tonic", () => {
  for (const [mode, difficulty, focus] of [["interval", "hard", "TT"], ["chord", "hard", "minor7"], ["scale", "hard", "dorian"]]) {
    const question = engine.create(mode, difficulty, 60, 71, 0.5, "mixed", () => 0.99, focus);
    assert.equal(question.answer, focus);
  }
  for (const mode of ["pitch", "dictation"]) {
    const question = engine.create(mode, "easy", 60, 71, 0.5, "mixed", () => 0.99, "2");
    assert.equal(question.root % 12, 2);
  }
});
