const MusicTheoryEngine = Object.freeze({
  notes: Object.freeze(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]),
  chords: Object.freeze({
    major: { intervals: [0, 4, 7], suffix: "" },
    minor: { intervals: [0, 3, 7], suffix: "m" },
    diminished: { intervals: [0, 3, 6], suffix: "dim" },
    augmented: { intervals: [0, 4, 8], suffix: "aug" },
    major7: { intervals: [0, 4, 7, 11], suffix: "maj7" },
    minor7: { intervals: [0, 3, 7, 10], suffix: "m7" },
    dominant7: { intervals: [0, 4, 7, 10], suffix: "7" }
  }),
  scales: Object.freeze({
    major: [0, 2, 4, 5, 7, 9, 11],
    naturalMinor: [0, 2, 3, 5, 7, 8, 10],
    minorPentatonic: [0, 3, 5, 7, 10],
    majorPentatonic: [0, 2, 4, 7, 9],
    dorian: [0, 2, 3, 5, 7, 9, 10]
  }),
  tunings: Object.freeze({
    standard: [64, 59, 55, 50, 45, 40],
    dropD: [64, 59, 55, 50, 45, 38],
    dropB: [61, 56, 52, 47, 42, 35],
    openG: [62, 59, 55, 50, 43, 38]
  }),
  pitchClass(midi) {
    return ((midi % 12) + 12) % 12;
  },
  noteName(midi) {
    return `${this.notes[this.pitchClass(midi)]}${Math.floor(midi / 12) - 1}`;
  },
  frequency(midi, a4 = 440) {
    return a4 * Math.pow(2, (midi - 69) / 12);
  },
  midiFromFrequency(frequency, a4 = 440) {
    return Math.round(69 + 12 * Math.log2(frequency / a4));
  },
  stringNote(openMidi, fret) {
    return openMidi + fret;
  },
  chordNotes(root, type) {
    return this.chords[type].intervals.map((interval) => this.pitchClass(root + interval));
  }
});
