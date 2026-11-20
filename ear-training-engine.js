// @ts-check
/** @typedef {'easy'|'medium'|'hard'} EarDifficulty */
/** @typedef {'interval'|'chord'|'scale'|'pitch'|'dictation'} EarMode */
/** @typedef {'ascending'|'descending'|'harmonic'|'mixed'} EarDirection */
/** @typedef {{midi:number, offset:number, duration:number, gain:number}} EarAudioEvent */
/** @typedef {{mode:EarMode, root:number, answer:string, choices:string[], events:EarAudioEvent[], notes:number[], interval:number, direction:EarDirection, initialCents:number}} EarQuestion */

const EarTrainingEngine = (() => {
  /** @type {Record<EarDifficulty, number[]>} */
  const intervals = {
    easy: [3, 4, 5, 7, 12],
    medium: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
    hard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  };
  const intervalNames = ["", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8", "m9", "M9", "m10", "M10", "P11", "TT+8", "P12"];
  /** @type {Record<string, number[]>} */
  const chords = {
    major: MusicTheoryEngine.chords.major.intervals, minor: MusicTheoryEngine.chords.minor.intervals,
    diminished: MusicTheoryEngine.chords.diminished.intervals, augmented: MusicTheoryEngine.chords.augmented.intervals,
    major7: MusicTheoryEngine.chords.major7.intervals, minor7: MusicTheoryEngine.chords.minor7.intervals,
    dominant7: MusicTheoryEngine.chords.dominant7.intervals,
    halfDiminished7: [0, 3, 6, 10], diminished7: [0, 3, 6, 9]
  };
  /** @type {Record<string, number[]>} */
  const scales = {
    major: [...MusicTheoryEngine.scales.major, 12], naturalMinor: [...MusicTheoryEngine.scales.naturalMinor, 12],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11, 12], melodicMinor: [0, 2, 3, 5, 7, 9, 11, 12],
    dorian: [...MusicTheoryEngine.scales.dorian, 12], phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
    lydian: [0, 2, 4, 6, 7, 9, 11, 12], mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
    locrian: [0, 1, 3, 5, 6, 8, 10, 12]
  };
  /** @param {number} midi @param {number} offset @param {number} duration @param {number} gain @returns {EarAudioEvent} */
  const event = (midi, offset, duration, gain) => ({ midi, offset, duration, gain });
  /** @template T @param {T[]} values @param {() => number} random @returns {T} */
  const pick = (values, random) => values[Math.floor(random() * values.length)];

  /**
   * @param {EarMode} mode
   * @param {EarDifficulty} difficulty
   * @param {number} minRoot
   * @param {number} maxRoot
   * @param {number} beat
   * @param {EarDirection} direction
   * @param {() => number} [random]
   * @param {string} [focus]
   * @returns {EarQuestion}
   */
  function create(mode, difficulty, minRoot, maxRoot, beat, direction, random = Math.random, focus = "") {
    if (!Number.isInteger(minRoot) || !Number.isInteger(maxRoot) || minRoot > maxRoot || minRoot < 12 || maxRoot > 96 ||
        !Number.isFinite(beat) || beat <= 0) throw new RangeError("Invalid exercise settings");
    let root = minRoot + Math.floor(random() * (maxRoot - minRoot + 1));
    if ((mode === "pitch" || mode === "dictation") && /^\d+$/.test(focus)) {
      const pitchClass = Number(focus);
      const focusedRoot = minRoot + ((pitchClass - minRoot % 12 + 12) % 12);
      if (pitchClass < 12 && focusedRoot <= maxRoot) root = focusedRoot;
    }
    /** @type {EarQuestion} */
    const question = { mode, root, answer: "", choices: [], events: [], notes: [], interval: 0, direction, initialCents: 0 };
    if (mode === "interval") {
      const focusInterval = intervalNames.indexOf(focus);
      question.interval = intervals[difficulty].includes(focusInterval) ? focusInterval : pick(intervals[difficulty], random);
      question.answer = intervalNames[question.interval];
      question.choices = intervals[difficulty].map((step) => intervalNames[step]);
      question.direction = direction === "mixed" ? pick(["ascending", "descending", "harmonic"], random) : direction;
      const upper = root + question.interval;
      const notes = question.direction === "descending" ? [upper, root] : [root, upper];
      question.events = notes.map((midi, index) => event(midi, question.direction === "harmonic" ? 0 : index * beat, beat * 0.9, 0.35));
    } else if (mode === "chord") {
      question.choices = difficulty === "hard" ? Object.keys(chords) : ["major", "minor", "diminished", "augmented"];
      question.answer = question.choices.includes(focus) ? focus : pick(question.choices, random);
      const tones = chords[question.answer].map((step) => root + step);
      const inversion = difficulty === "easy" ? 0 : Math.floor(random() * tones.length);
      for (let i = 0; i < inversion; i++) tones.push(/** @type {number} */ (tones.shift()) + 12);
      question.events = tones.map((midi) => event(midi, 0, beat * 2, 0.3));
    } else if (mode === "scale") {
      question.choices = difficulty === "hard" ? Object.keys(scales) : ["major", "naturalMinor", "harmonicMinor", "melodicMinor"];
      question.answer = question.choices.includes(focus) ? focus : pick(question.choices, random);
      const tones = scales[question.answer].map((step) => root + step);
      question.direction = direction === "descending" || (direction === "mixed" && random() < 0.5) ? "descending" : "ascending";
      if (question.direction === "descending") tones.reverse();
      question.events = tones.map((midi, index) => event(midi, index * beat, beat * 0.88, 0.55));
    } else if (mode === "pitch") {
      const bounds = difficulty === "easy" ? [12, 40] : difficulty === "medium" ? [5, 30] : [1, 12];
      const magnitude = bounds[0] + Math.floor(random() * (bounds[1] - bounds[0] + 1));
      question.initialCents = (random() < 0.5 ? -1 : 1) * magnitude;
      question.events = [event(root, 0, 1, 0.65)];
    } else if (mode === "dictation") {
      const length = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 6;
      const degrees = difficulty === "easy" ? [0, 2, 4, 7, 9] : [0, 2, 4, 5, 7, 9, 11];
      question.notes = Array.from({ length }, () => (root + pick(degrees, random)) % 12);
      question.events = [0, 4, 7].map((step) => event(root + step, 0, beat * 1.5, 0.3));
      question.events.push(...question.notes.map((note, index) =>
        event(root + ((note - root % 12 + 12) % 12), beat * (2 + index), beat * 0.85, 0.55)));
    } else {
      throw new RangeError("Invalid exercise mode");
    }
    return question;
  }
  /** @param {{attempts:number, correct:number, streak:number, best:number}} score @param {boolean} correct */
  function updateScore(score, correct) {
    const streak = correct ? score.streak + 1 : 0;
    return { attempts: score.attempts + 1, correct: score.correct + (correct ? 1 : 0),
      streak, best: Math.max(score.best, streak) };
  }
  /** @param {number[]} expected @param {number[]} actual */
  function matchesMelody(expected, actual) {
    return expected.length === actual.length && expected.every((note, index) => note === actual[index]);
  }
  return { create, chords, scales, intervals, intervalNames, updateScore, matchesMelody };
})();
