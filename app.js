const MIN_FREQUENCY = 15;
const MAX_FREQUENCY = 8000;
const MIN_RMS = 0.003;
const QUIET_THRESHOLD = 0.008;
const BUFFER_SIZE = 4096;
const EMA_ALPHA = 0.18;
const VISUAL_SMOOTHING_FACTOR = 0.2;
const CENTS_WINDOW_SIZE = 3;
const LOW_PASS_MAX_FREQUENCY = 4000;
const AUDIO_LOW_PASS_FREQUENCY = 8000;
const NOTE_CONFIRMATION_FRAMES = 2;
const NOTE_HOLD_TIME = 1500;
const DEFAULT_REFERENCE_FREQUENCY = 440;

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

class PitchSmoother {
  constructor({ rmsThreshold = 0.008, windowSize = 3, alpha = 0.42, deadbandCents = 1 } = {}) {
	this.rmsThreshold = rmsThreshold;
	this.windowSize = windowSize;
	this.alpha = alpha;
	this.deadbandCents = deadbandCents;
	this.frequencyWindow = [];
	this.smoothedFrequency = null;
	this.lockedFrequency = null;
	  this.lastAcceptedTime = 0;
  }

	update(rawFrequency, audioBuffer, sampleRate) {
	const rms = calculateRms(audioBuffer);
	const clarity = this.getClarity(rawFrequency, audioBuffer, sampleRate);
	if (rms < this.rmsThreshold || clarity < 0.12 || !Number.isFinite(rawFrequency) || rawFrequency <= 0) {
	  return { smoothedFrequency: null, isSignalActive: false, cents: null };
	}

	const now = performance.now();
	if (this.smoothedFrequency !== null && now - this.lastAcceptedTime < 150 && this.isOctaveJump(rawFrequency)) {
	  return { smoothedFrequency: this.lockedFrequency, isSignalActive: true, cents: this.getCents(this.lockedFrequency) };
	}

	this.frequencyWindow.push(rawFrequency);
	if (this.frequencyWindow.length > this.windowSize) this.frequencyWindow.shift();

	const medianFrequency = this.getMedian(this.frequencyWindow);
	const adaptiveAlpha = this.getAdaptiveAlpha(medianFrequency);
	this.smoothedFrequency = this.smoothedFrequency === null
	  ? medianFrequency
		: adaptiveAlpha * medianFrequency + (1 - adaptiveAlpha) * this.smoothedFrequency;

	const targetFrequency = frequencyToNote(this.smoothedFrequency)?.targetFreq;
	const cents = this.getCents(this.smoothedFrequency);
	if (Math.abs(cents) <= this.deadbandCents) {
	  this.lockedFrequency = targetFrequency;
	} else {
	  this.lockedFrequency = this.smoothedFrequency;
	}

	this.lastAcceptedTime = now;
	return {
	  smoothedFrequency: this.lockedFrequency,
	  isSignalActive: true,
	  cents: Math.abs(cents) <= this.deadbandCents ? 0 : cents
	};
  }

  getAdaptiveAlpha(frequency) {
	if (frequency >= 800) return 0.2;
	if (frequency >= 400) return 0.3;
	return this.alpha;
  }

  getCents(frequency) {
	if (!Number.isFinite(frequency) || frequency <= 0) return null;
	return frequencyToNote(frequency)?.cents ?? null;
  }

  isOctaveJump(frequency) {
	const ratio = frequency / this.smoothedFrequency;
	return Math.abs(ratio - 0.5) < 0.06 || Math.abs(ratio - 1.5) < 0.1 || Math.abs(ratio - 2) < 0.12;
  }

  getClarity(frequency, data, sampleRate) {
	if (!Number.isFinite(frequency) || frequency <= 0) return 0;
	const lag = Math.round(sampleRate / frequency);
	if (lag < 2 || lag >= data.length) return 0;
	let correlation = 0;
	let energy = 0;
	for (let i = 0; i < data.length - lag; i++) {
	  correlation += data[i] * data[i + lag];
	  energy += data[i] * data[i];
	}
	return energy > 0 ? correlation / energy : 0;
  }

  getMedian(values) {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
  }
}

const startButton = document.getElementById("startButton");
const noteElement = document.getElementById("note");
const frequencyElement = document.getElementById("frequency");
const centsElement = document.getElementById("cents");
const statusElement = document.getElementById("status");
const gaugeTicksElement = document.getElementById("gaugeTicks");
const gaugeNeedleElement = document.getElementById("gaugeNeedle");
const gaugeCenterElement = document.getElementById("gaugeCenter");
const gaugeZoneElement = document.getElementById("gaugeZone");
const inputGainElement = document.getElementById("inputGain");
const gainValueElement = document.getElementById("gainValue");
const resetButton = document.getElementById("resetButton");
const referenceFrequencyElement = document.getElementById("referenceFrequency");
const referenceFrequencyValueElement = document.getElementById("referenceFrequencyValue");
const referenceDisplayElement = document.getElementById("referenceDisplay");
const navButtons = document.querySelectorAll(".nav-button");
const sections = document.querySelectorAll(".section");
const keySelect = document.getElementById("keySelect");
const modeSelect = document.getElementById("modeSelect");
const moodSelect = document.getElementById("moodSelect");
const generateButton = document.getElementById("generateButton");
const progressionNameElement = document.getElementById("progressionName");
const progressionRomanElement = document.getElementById("progressionRoman");
const progressionChordsElement = document.getElementById("progressionChords");
const progressionDescriptionElement = document.getElementById("progressionDescription");
const listenGeneratedButton = document.getElementById("listenGeneratedButton");
const generatedPlaybackStatus = document.getElementById("generatedPlaybackStatus");
const pianoKeyboardElement = document.getElementById("pianoKeyboard");
const intervalViewElement = document.getElementById("intervalView");
const scaleToggleElement = document.getElementById("scaleToggle");
const scaleFormulaElement = document.getElementById("scaleFormula");
const scaleTrackElement = document.getElementById("scaleTrack");
const scaleStepsElement = document.getElementById("scaleSteps");
const builderThirdElement = document.getElementById("builderThird");
const minorChordButton = document.getElementById("minorChordButton");
const playerChordsElement = document.getElementById("playerChords");
const playProgressionButton = document.getElementById("playProgressionButton");
const themeToggle = document.getElementById("themeToggle");
const languageSelect = document.getElementById("languageSelect");

const translations = {
  ru: {
	brandSubtitle: "музыкальная лаборатория", navTuner: "Тюнер", navTheory: "Теория", navChords: "Аккорды",
	tunerTitle: "Хроматический тюнер", tunerDescription: "Поднесите инструмент к микрофону. Стрелка плавно реагирует на отклонение от выбранной ноты.",
	startMicrophone: "Запустить микрофон", gaugeLabel: "Шкала отклонения в центах", signalSettings: "Настройки сигнала", smoothnessGain: "Плавность / усиление", referenceA4: "Эталон A4",
	referenceDescription: "Эталон A4 используется для расчёта нот и отклонения в центах.", gainDescription: "Ползунок меняет громкость сигнала мягко, без резких скачков.", resetSettings: "Сбросить настройки",
	frequency: "Частота", cents: "Отклонение", range: "Диапазон", listening: "Слушаю микрофон...", signalDetecting: "Сигнал есть, определяю частоту...", noteHeld: "Нота удерживается...", noteTuned: "Нота настроена", tuneInstrument: "Настройте инструмент", waitingNote: "Ожидание ноты C0–B8",
	theoryTitle: "Интерактивная теория музыки", theoryDescription: "Изучайте ноты, интервалы, гаммы, аккорды и прогрессии через звук и движение.", generatorTitle: "Генератор прогрессий", generatorDescription: "Выберите тонику, лад и настроение — PitchMate соберёт гармоническую последовательность.", generate: "Сгенерировать прогрессию", listen: "▶ Послушать прогрессию", playback: "Воспроизведение...", ready: "Прогрессия готова к прослушиванию.", done: "Готово.", chord: "Аккорд", outOf: "из",
	major: "Мажор", minor: "Минор", dreamy: "Мечтательное", sad: "Грустное", energetic: "Энергичное", melancholic: "Меланхоличное", nostalgic: "Ностальгическое", dark: "Тёмное", tonic: "Тоника", mode: "Лад", mood: "Настроение", roman: "Символические ступени", chordNames: "Буквенные аккорды", lightTheme: "☀ Светлая тема", darkTheme: "☾ Тёмная тема", makeMinor: "Сделать минорным", restoreMajor: "Вернуть E мажор", theoryCard1Title: "1. 12 нот и октава", theoryCard1Description: "Нажмите на клавишу, чтобы услышать ноту. Белые клавиши подписаны буквами, чёрные — диезами.", theoryCard2Title: "2. Тон и полутон", theoryCard2Description: "Полутон — расстояние до соседней клавиши или соседнего лада.", theoryCard3Title: "3. Скелет гаммы", theoryCard3Description: "Переключите лад и наблюдайте, как меняются расстояния между ступенями.", theoryCard4Title: "4. Конструктор аккорда", theoryCard4Description: "Третья ступень определяет характер трезвучия. Опустите G# на полутон и услышите E minor.", theoryCard5Title: "5. Движение песни", theoryCard5Description: "Слушайте мечтательно-меланхоличный переход E — Em — A — Am.", piano: "Пианино", guitar: "Гитара", play: "Play", generatorEyebrow: "Find your next idea", progressionReady: "Прогрессия готова к прослушиванию.", playing: "Воспроизведение...", finished: "Готово.", chordProgress: "Аккорд", of: "из", descriptionSuffix: "Тональность", progressionDescription: "Мягкая и выразительная гармоническая последовательность."
  },
  en: {
	brandSubtitle: "music laboratory", navTuner: "Tuner", navTheory: "Theory", navChords: "Chords",
	tunerTitle: "Chromatic tuner", tunerDescription: "Bring your instrument close to the microphone. The needle smoothly reacts to the selected note.",
	startMicrophone: "Start microphone", gaugeLabel: "Cents deviation scale", signalSettings: "Signal settings", smoothnessGain: "Smoothness / gain", referenceA4: "A4 reference",
	referenceDescription: "The A4 reference is used to calculate notes and cents deviation.", gainDescription: "The slider changes signal volume smoothly without sudden jumps.", resetSettings: "Reset settings",
	frequency: "Frequency", cents: "Deviation", range: "Range", listening: "Listening to microphone...", signalDetecting: "Signal detected, measuring frequency...", noteHeld: "Holding note...", noteTuned: "Note is in tune", tuneInstrument: "Tune your instrument", waitingNote: "Waiting for note C0–B8",
	theoryTitle: "Interactive music theory", theoryDescription: "Explore notes, intervals, scales, chords, and progressions through sound and motion.", generatorTitle: "Progression generator", generatorDescription: "Choose a key, mode, and mood — PitchMate will create a harmonic progression.", generate: "Generate progression", listen: "▶ Listen to progression", playback: "Playing...", ready: "Progression ready to play.", done: "Done.", chord: "Chord", outOf: "of",
	major: "Major", minor: "Minor", dreamy: "Dreamy", sad: "Sad", energetic: "Energetic", melancholic: "Melancholic", nostalgic: "Nostalgic", dark: "Dark", tonic: "Key", mode: "Mode", mood: "Mood", roman: "Roman numerals", chordNames: "Chord names", lightTheme: "☀ Light mode", darkTheme: "☾ Dark mode", makeMinor: "Make minor", restoreMajor: "Restore E major", theoryCard1Title: "1. 12 notes and an octave", theoryCard1Description: "Click a key to hear the note. White keys are labeled with letters, black keys with sharps.", theoryCard2Title: "2. Tone and semitone", theoryCard2Description: "A semitone is the distance to the neighboring key or fret.", theoryCard3Title: "3. Scale structure", theoryCard3Description: "Switch the mode and watch the distances between scale degrees change.", theoryCard4Title: "4. Chord builder", theoryCard4Description: "The third defines the character of a triad. Lower G# by a semitone to hear E minor.", theoryCard5Title: "5. Song movement", theoryCard5Description: "Listen to the dreamy, melancholic transition E — Em — A — Am.", piano: "Piano", guitar: "Guitar", play: "Play", generatorEyebrow: "Find your next idea", progressionReady: "Progression ready to play.", playing: "Playing...", finished: "Done.", chordProgress: "Chord", of: "of", descriptionSuffix: "Key", progressionDescription: "A smooth and expressive harmonic progression."
  },
  kk: {
	brandSubtitle: "музыкалық зертхана", navTuner: "Тюнер", navTheory: "Теория", navChords: "Аккордтар",
	tunerTitle: "Хроматикалық тюнер", tunerDescription: "Аспапты микрофонға жақындатыңыз. Көрсеткі таңдалған нотаға ауытқуды бірқалыпты көрсетеді.",
	startMicrophone: "Микрофонды іске қосу", gaugeLabel: "Цент ауытқу шкаласы", signalSettings: "Сигнал баптаулары", smoothnessGain: "Тегістік / күшейту", referenceA4: "A4 эталоны",
	referenceDescription: "A4 эталоны ноталар мен цент ауытқуын есептеу үшін қолданылады.", gainDescription: "Жүгірткі сигнал деңгейін күрт өзгеріссіз бірқалыпты өзгертеді.", resetSettings: "Баптауларды қалпына келтіру",
	frequency: "Жиілік", cents: "Ауытқу", range: "Диапазон", listening: "Микрофон тыңдалуда...", signalDetecting: "Сигнал бар, жиілік анықталуда...", noteHeld: "Нота ұсталып тұр...", noteTuned: "Нота дәл бапталған", tuneInstrument: "Аспапты баптаңыз", waitingNote: "C0–B8 нотасы күтілуде",
	theoryTitle: "Интерактивті музыка теориясы", theoryDescription: "Ноталарды, интервалдарды, гаммаларды, аккордтар мен прогрессияларды дыбыс арқылы үйреніңіз.", generatorTitle: "Прогрессия генераторы", generatorDescription: "Тониканы, ладты және көңіл күйді таңдаңыз — PitchMate гармониялық прогрессия жасайды.", generate: "Прогрессия жасау", listen: "▶ Прогрессияны тыңдау", playback: "Ойнатылуда...", ready: "Прогрессия тыңдауға дайын.", done: "Дайын.", chord: "Аккорд", outOf: "ішінен",
	major: "Мажор", minor: "Минор", dreamy: "Армандай", sad: "Мұңды", energetic: "Қуатты", melancholic: "Мұңлы", nostalgic: "Ностальгиялық", dark: "Қараңғы", tonic: "Тоника", mode: "Лад", mood: "Көңіл күй", roman: "Рим цифрлары", chordNames: "Аккорд атаулары", lightTheme: "☀ Ашық режим", darkTheme: "☾ Қараңғы режим", makeMinor: "Минор жасау", restoreMajor: "E мажорын қайтару", theoryCard1Title: "1. 12 нота және октава", theoryCard1Description: "Нотаны есту үшін пернені басыңыз. Ақ пернелер әріптермен, қара пернелер диездермен белгіленген.", theoryCard2Title: "2. Тон және жарты тон", theoryCard2Description: "Жарты тон — көрші перне немесе лад арасындағы қашықтық.", theoryCard3Title: "3. Гамма құрылымы", theoryCard3Description: "Ладты ауыстырып, сатылар арасындағы қашықтықтардың өзгеруін көріңіз.", theoryCard4Title: "4. Аккорд құрастырушы", theoryCard4Description: "Үшінші саты үшдыбыстың сипатын анықтайды. E minor дыбысын есту үшін G# нотасын жарты тонға төмендетіңіз.", theoryCard5Title: "5. Ән қозғалысы", theoryCard5Description: "E — Em — A — Am армандайтын, мұңды ауысуын тыңдаңыз.", piano: "Пианино", guitar: "Гитара", play: "Ойнату", generatorEyebrow: "Келесі идеяңызды табыңыз", progressionReady: "Прогрессия тыңдауға дайын.", playing: "Ойнатылуда...", finished: "Дайын.", chordProgress: "Аккорд", of: "ішінен", descriptionSuffix: "Тональдік", progressionDescription: "Жұмсақ әрі әсерлі гармониялық прогрессия."
  }
};

let currentLanguage = localStorage.getItem("pitchmate-language") || "ru";
if (!translations[currentLanguage]) currentLanguage = "ru";

function t(key) {
  return translations[currentLanguage][key] || translations.ru[key] || key;
}

function updateDynamicText() {
  if (referenceFrequencyValueElement) {
	const formattedFrequency = Number.isInteger(referenceFrequency) ? referenceFrequency.toString() : referenceFrequency.toFixed(1);
	referenceFrequencyValueElement.textContent = `${formattedFrequency} ${currentLanguage === "ru" ? "Гц" : "Hz"}`;
  }
  if (frequencyElement.textContent.includes("—")) frequencyElement.textContent = `${t("frequency")}: —`;
  if (centsElement.textContent.includes("—")) centsElement.textContent = `${t("cents")}: —`;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
	element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
	element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.documentElement.lang = currentLanguage === "kk" ? "kk" : currentLanguage;
  if (languageSelect) languageSelect.value = currentLanguage;
  updateReferenceFrequencyDisplay();
  updateThemeToggle();
  renderScale(scaleToggleElement?.dataset.mode || "major");
  renderIntervalView(document.querySelector(".theory-tab.active")?.dataset.interval || "piano");
}

languageSelect?.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  localStorage.setItem("pitchmate-language", currentLanguage);
  applyTranslations();
  updateDynamicText();
  refreshGeneratedProgression();
});

const savedTheme = localStorage.getItem("pitchmate-theme");
const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
document.documentElement.dataset.theme = initialTheme;

function updateThemeToggle() {
  if (!themeToggle) return;
  const isDark = document.documentElement.dataset.theme === "dark";
	themeToggle.textContent = isDark ? t("lightTheme") : t("darkTheme");
  themeToggle.setAttribute("aria-label", isDark ? t("lightTheme") : t("darkTheme"));
}

updateThemeToggle();
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("pitchmate-theme", nextTheme);
  updateThemeToggle();
});

let audioContext = null;
let analyser = null;
let lowPassFilterNode = null;
let inputBuffer = null;
let filteredBuffer = null;
let movingAverageBuffer = null;
let centeredBuffer = null;
let smoothedCents = null;
let currentMidi = null;
let candidateMidi = null;
let candidateFrames = 0;
let lastValidPitchTime = 0;
let targetCents = 0;
let displayCents = 0;
let centsWindow = [];
let targetNote = "—";
let targetFrequency = null;
let inputGainNode = null;
let targetGain = 1;
let currentGain = 1;
let generatedProgression = [];
let generatedPlaybackTimer = null;
let referenceFrequency = DEFAULT_REFERENCE_FREQUENCY;
const theoryInstruments = new Map();
const instrumentLoading = new Map();
let soundfontWarningShown = false;
const pitchSmoother = new PitchSmoother();

function updateReferenceFrequencyDisplay() {
  const formattedFrequency = Number.isInteger(referenceFrequency)
	? referenceFrequency.toString()
	: referenceFrequency.toFixed(1);
	if (referenceFrequencyValueElement) referenceFrequencyValueElement.textContent = `${formattedFrequency} ${currentLanguage === "ru" ? "Гц" : "Hz"}`;
  if (referenceDisplayElement) referenceDisplayElement.textContent = `A4 = ${formattedFrequency} Hz`;
}

updateReferenceFrequencyDisplay();
applyTranslations();

createGaugeTicks();

startButton.addEventListener("click", startTuner);
inputGainElement?.addEventListener("input", () => {
  targetGain = Number(inputGainElement.value) / 100;
  gainValueElement.textContent = `${inputGainElement.value}%`;
});
referenceFrequencyElement?.addEventListener("input", () => {
  const nextReference = Number(referenceFrequencyElement.value);
  if (!Number.isFinite(nextReference) || nextReference < 400 || nextReference > 480) return;
  referenceFrequency = nextReference;
	updateReferenceFrequencyDisplay();
  currentMidi = null;
  candidateMidi = null;
  candidateFrames = 0;
  smoothedCents = null;
});
resetButton?.addEventListener("click", () => {
  inputGainElement.value = "100";
  targetGain = 1;
  gainValueElement.textContent = "100%";
  referenceFrequency = DEFAULT_REFERENCE_FREQUENCY;
  referenceFrequencyElement.value = String(DEFAULT_REFERENCE_FREQUENCY);
	updateReferenceFrequencyDisplay();
  currentMidi = null;
  candidateMidi = null;
  candidateFrames = 0;
  smoothedCents = null;
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
	navButtons.forEach((item) => item.classList.toggle("active", item === button));
	sections.forEach((section) => section.classList.toggle("active", section.id === button.dataset.section));
  });
});

generateButton?.addEventListener("click", generateProgression);
listenGeneratedButton?.addEventListener("click", playGeneratedProgression);
initializeTheoryVisuals();

function initializeTheoryVisuals() {
  createPianoKeyboard();
  renderIntervalView("piano");
  renderScale("major");
  document.querySelectorAll(".theory-tab").forEach((tab) => {
	tab.addEventListener("click", () => {
	  document.querySelectorAll(".theory-tab").forEach((item) => item.classList.toggle("active", item === tab));
	  renderIntervalView(tab.dataset.interval);
	  playIntervalExample(tab.dataset.interval);
	});
  });
  scaleToggleElement?.addEventListener("click", () => {
	const nextMode = scaleToggleElement.dataset.mode === "minor" ? "major" : "minor";
	renderScale(nextMode);
  });
  minorChordButton?.addEventListener("click", toggleMinorChord);
  playProgressionButton?.addEventListener("click", playProgression);
}

function getTheoryAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone(frequency, duration = 0.65, startTime = null, instrumentName = "acoustic_grand_piano") {
  const context = getTheoryAudioContext();
  if (!context) return;
	const start = startTime ?? context.currentTime;
	const midi = Math.round(69 + 12 * Math.log2(frequency / referenceFrequency));
  loadTheoryInstrument(instrumentName).then((instrument) => {
	if (instrument) {
	  instrument.play(midi, Math.max(start, context.currentTime), { duration, gain: 0.9 });
	} else {
	  playSynthFallback(frequency, duration, start, instrumentName);
	}
  });
}

function loadTheoryInstrument(instrumentName) {
  if (theoryInstruments.has(instrumentName)) return Promise.resolve(theoryInstruments.get(instrumentName));
  if (instrumentLoading.has(instrumentName)) return instrumentLoading.get(instrumentName);
  if (!window.Soundfont || !audioContext) return Promise.resolve(null);

  const loading = Soundfont.instrument(audioContext, instrumentName, {
	soundfont: "FluidR3_GM",
	nameToUrl: (name, soundfont, format) => `https://gleitz.github.io/midi-js-soundfonts/${soundfont}/${name}-${format}.js`
  }).then((instrument) => {
	theoryInstruments.set(instrumentName, instrument);
	instrumentLoading.delete(instrumentName);
	return instrument;
  }).catch((error) => {
	instrumentLoading.delete(instrumentName);
	if (!soundfontWarningShown) {
	  soundfontWarningShown = true;
	  console.warn("Не удалось загрузить сэмплы инструмента, используется резервный синтез.", error);
	}
	return null;
  });
  instrumentLoading.set(instrumentName, loading);
  return loading;
}

function playSynthFallback(frequency, duration, start, instrumentName) {
  const context = audioContext;
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
	oscillator.type = instrumentName === "acoustic_guitar_steel" ? "sine" : "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function createPianoKeyboard() {
  if (!pianoKeyboardElement) return;
	const whiteNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];
  const whiteSemitones = [0, 2, 4, 5, 7, 9, 11, 12];
  whiteNotes.forEach((note, index) => {
	const key = document.createElement("button");
	key.className = "piano-key white-key";
	key.textContent = note;
	key.addEventListener("click", () => playKeyboardNote(whiteSemitones[index], key));
	pianoKeyboardElement.appendChild(key);
  });
  [{ note: "C#", semitone: 1, className: "key-cs" }, { note: "D#", semitone: 3, className: "key-ds" }, { note: "F#", semitone: 6, className: "key-fs" }, { note: "G#", semitone: 8, className: "key-gs" }, { note: "A#", semitone: 10, className: "key-as" }].forEach(({ note, semitone, className }) => {
	const key = document.createElement("button");
	key.className = `piano-key black-key ${className}`;
	key.textContent = note;
	key.addEventListener("click", () => playKeyboardNote(semitone, key));
	pianoKeyboardElement.appendChild(key);
  });
}

function playKeyboardNote(semitone, element) {
  element.classList.add("active");
  playTone(midiToFrequency(60 + semitone));
  window.setTimeout(() => element.classList.remove("active"), 180);
}

function renderIntervalView(type) {
  if (!intervalViewElement) return;
  if (type === "guitar") {
	intervalViewElement.innerHTML = `<div class="fretboard"><div class="string"><span class="fret" style="left:25%"></span><span class="fret" style="left:50%"></span><span class="fret-dot" style="left:25%"></span><span class="fret-dot" style="left:50%"></span><span class="fret-label" style="left:25%">1</span><span class="fret-label" style="left:50%">2</span></div><div class="string"></div><div class="string"></div><div class="string"></div><div class="string"></div></div>`;
	return;
  }
  intervalViewElement.innerHTML = `<div class="interval-piano"><div class="interval-key">D</div><div class="interval-key highlight">E</div><span class="interval-arrow">← 1 полутон →</span><div class="interval-key highlight">F</div><div class="interval-key">G</div></div>`;
}

function playIntervalExample(type) {
  const context = getTheoryAudioContext();
  if (!context) return;
  const start = context.currentTime;
  const firstMidi = type === "guitar" ? 60 : 64;
	playTone(midiToFrequency(firstMidi), 0.45, start, type === "guitar" ? "acoustic_guitar_steel" : "acoustic_grand_piano");
  playTone(midiToFrequency(firstMidi + 1), 0.45, start + 0.48, type === "guitar" ? "acoustic_guitar_steel" : "acoustic_grand_piano");
}

function renderScale(mode) {
  const minor = mode === "minor";
  const notes = minor ? ["C", "D", "D#", "F", "G", "G#", "A#"] : ["C", "D", "E", "F", "G", "A", "B"];
  const steps = minor ? ["Тон", "Полутон", "Тон", "Тон", "Полутон", "Тон"] : ["Тон", "Тон", "Полутон", "Тон", "Тон", "Тон"];
  scaleToggleElement.dataset.mode = mode;
	scaleToggleElement.textContent = minor ? t("minor") : t("major");
  const localizedSteps = steps.map((step) => currentLanguage === "en" ? (step === "Тон" ? "Tone" : "Semitone") : currentLanguage === "kk" ? (step === "Тон" ? "Тон" : "Жарты тон") : step);
  scaleFormulaElement.textContent = localizedSteps.join(" · ");
  scaleTrackElement.classList.toggle("minor", minor);
  scaleTrackElement.innerHTML = notes.map((note, index) => `<span class="scale-note" style="transform:translateX(${minor ? (index % 2 ? 8 : -4) : 0}px)">${note}</span>`).join("");
	scaleStepsElement.innerHTML = localizedSteps.map((step) => `<span>${step}</span>`).join("");
}

function toggleMinorChord() {
  const isMinor = builderThirdElement.textContent === "G";
  builderThirdElement.textContent = isMinor ? "G#" : "G";
  builderThirdElement.classList.toggle("changed", !isMinor);
	minorChordButton.textContent = isMinor ? t("makeMinor") : t("restoreMajor");
  const notes = isMinor ? ["E", "G"] : ["E", "G#"];
  notes.forEach((note, index) => playTone(midiToFrequency({ E: 64, G: 67, "G#": 68 }[note]), 0.7, (getTheoryAudioContext()?.currentTime ?? 0) + index * 0.05));
  playTone(midiToFrequency(71), 0.7, (getTheoryAudioContext()?.currentTime ?? 0) + 0.1);
}

function playProgression() {
  const cards = [...playerChordsElement.querySelectorAll(".player-chord")];
  const frequencies = [[64, 68, 71], [64, 67, 71], [69, 73, 76], [69, 72, 76]];
  const context = getTheoryAudioContext();
  if (!context) return;
  const start = context.currentTime + 0.05;
  cards.forEach((card, index) => {
	const time = start + index * 0.9;
	window.setTimeout(() => {
	  cards.forEach((item) => item.classList.remove("active"));
	  card.classList.add("active");
	}, index * 900);
	frequencies[index].forEach((midi) => playTone(midiToFrequency(midi), 0.78, time));
  });
  window.setTimeout(() => cards.forEach((card) => card.classList.remove("active")), cards.length * 900);
}

async function startTuner() {
  try {
	if (!navigator.mediaDevices?.getUserMedia) {
	  throw new Error("Браузер не поддерживает доступ к микрофону");
	}

	const stream = await navigator.mediaDevices.getUserMedia({
	  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
	});
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) throw new Error("Web Audio API не поддерживается браузером");

	audioContext = new AudioContextClass();
	await audioContext.resume();
	const source = audioContext.createMediaStreamSource(stream);
	lowPassFilterNode = audioContext.createBiquadFilter();
	lowPassFilterNode.type = "lowpass";
	lowPassFilterNode.frequency.value = Math.min(AUDIO_LOW_PASS_FREQUENCY, audioContext.sampleRate * 0.45);
	lowPassFilterNode.Q.value = 0.7;
	analyser = audioContext.createAnalyser();
	analyser.fftSize = BUFFER_SIZE;
	analyser.smoothingTimeConstant = 0;
	inputBuffer = new Float32Array(BUFFER_SIZE);
  filteredBuffer = new Float32Array(BUFFER_SIZE);
  movingAverageBuffer = new Float32Array(BUFFER_SIZE);
	centeredBuffer = new Float32Array(BUFFER_SIZE);
	inputGainNode = audioContext.createGain();
	inputGainNode.gain.value = currentGain;
	source.connect(inputGainNode);
	inputGainNode.connect(lowPassFilterNode);
	lowPassFilterNode.connect(analyser);

	const silentGain = audioContext.createGain();
	silentGain.gain.value = 0;
	analyser.connect(silentGain);
	silentGain.connect(audioContext.destination);

	startButton.disabled = true;
	statusElement.textContent = "Слушаю микрофон...";
  requestAnimationFrame(updateVisuals);
	requestAnimationFrame(processAudio);
  } catch (error) {
	startButton.disabled = false;
	statusElement.textContent = getMicrophoneError(error);
	console.error(error);
  }
}

function processAudio() {
  if (!analyser || !audioContext) return;
  analyser.getFloatTimeDomainData(inputBuffer);
  lowPassFilter(inputBuffer, filteredBuffer, audioContext.sampleRate, LOW_PASS_MAX_FREQUENCY);
	applyMovingAverage(filteredBuffer, 3);
	const rms = calculateRms(filteredBuffer);
	if (rms < QUIET_THRESHOLD) {
	  handleQuietSignal(rms);
	  requestAnimationFrame(processAudio);
	  return;
	}
	const rawFrequency = detectFrequency(filteredBuffer, audioContext.sampleRate, centeredBuffer);
  const smoothed = pitchSmoother.update(rawFrequency, filteredBuffer, audioContext.sampleRate);

	if (!smoothed.isSignalActive) {
	keepLastNote("Сигнал есть, определяю частоту...");
  } else {
	updatePitch(smoothed.smoothedFrequency);
  }
  requestAnimationFrame(processAudio);
}

function applyMovingAverage(buffer, radius) {
  for (let i = 0; i < buffer.length; i++) {
	let sum = 0;
	let count = 0;
	const start = Math.max(0, i - radius);
	const end = Math.min(buffer.length - 1, i + radius);
	for (let j = start; j <= end; j++) {
	  sum += buffer[j];
	  count++;
	}
	movingAverageBuffer[i] = sum / count;
  }
  buffer.set(movingAverageBuffer);
}

function lowPassFilter(input, output, sampleRate, cutoffFrequency) {
  const alpha = (2 * Math.PI * cutoffFrequency / sampleRate) /
	(1 + 2 * Math.PI * cutoffFrequency / sampleRate);
  output[0] = alpha * input[0];
  for (let i = 1; i < input.length; i++) {
	output[i] = output[i - 1] + alpha * (input[i] - output[i - 1]);
  }
}

function detectFrequency(data, sampleRate, centered) {
  let mean = 0;
  for (let i = 0; i < data.length; i++) mean += data[i];
  mean /= data.length;

  let power = 0;
  for (let i = 0; i < data.length; i++) {
	centered[i] = data[i] - mean;
	power += centered[i] * centered[i];
  }
  if (Math.sqrt(power / data.length) < MIN_RMS) return -1;

  const minLag = Math.max(2, Math.floor(sampleRate / MAX_FREQUENCY));
  const maxLag = Math.min(Math.floor(sampleRate / MIN_FREQUENCY), Math.floor(data.length / 2));
  let bestLag = -1;
  let bestScore = -Infinity;
  const scores = new Float32Array(maxLag + 1);

  for (let lag = minLag; lag <= maxLag; lag++) {
	let difference = 0;
	for (let i = 0; i < data.length - lag; i++) {
	  const delta = centered[i] - centered[i + lag];
	  difference += delta * delta;
	}
	const score = 1 - difference / (2 * power);
	scores[lag] = score;
	if (score > bestScore) {
	  bestScore = score;
	  bestLag = lag;
	}
  }

	const significantThreshold = Math.max(0.05, bestScore * 0.92);
  for (let lag = minLag + 1; lag < maxLag; lag++) {
	if (scores[lag] >= significantThreshold && scores[lag] >= scores[lag - 1] && scores[lag] >= scores[lag + 1]) {
	  bestLag = lag;
	  bestScore = scores[lag];
	  break;
	}
  }

  if (bestLag < 1 || bestScore < 0.05) return -1;
  const left = lagScore(centered, power, bestLag - 1);
  const right = lagScore(centered, power, bestLag + 1);
  const denominator = left - 2 * bestScore + right;
  const correction = denominator === 0 ? 0 : 0.5 * (left - right) / denominator;
  const frequency = sampleRate / (bestLag + correction);
  return frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY ? frequency : -1;
}

function lagScore(data, power, lag) {
  if (lag < 1 || lag >= data.length) return 0;
  let difference = 0;
  for (let i = 0; i < data.length - lag; i++) {
	const delta = data[i] - data[i + lag];
	difference += delta * delta;
  }
  return 1 - difference / (2 * power);
}

function updatePitch(frequency) {
	const pitch = frequencyToNote(frequency);
  if (!pitch) return;
  const detectedMidi = pitch.midi;
  if (currentMidi === null) {
	currentMidi = detectedMidi;
	smoothedCents = null;
  } else if (detectedMidi !== currentMidi) {
	if (candidateMidi === detectedMidi) candidateFrames++;
	else { candidateMidi = detectedMidi; candidateFrames = 1; }
	if (candidateFrames >= NOTE_CONFIRMATION_FRAMES) {
	  currentMidi = candidateMidi;
	  candidateMidi = null;
	  candidateFrames = 0;
	  smoothedCents = null;
	}
  } else {
	candidateMidi = null;
	candidateFrames = 0;
  }
  lastValidPitchTime = Date.now();
	renderPitch({ ...pitch, midi: currentMidi });
}

function renderPitch(pitch) {
  const { frequency, midi } = pitch;
	const targetFreq = midiToFrequency(midi, referenceFrequency);
	const cents = 1200 * Math.log2(frequency / targetFreq);
	const noteIndex = ((midi % 12) + 12) % 12;
  const note = `${NOTES[noteIndex]}${Math.floor(midi / 12) - 1}`;

	// Keep the text and measured frequency responsive; only the needle target
  // receives the short median filter and the visual EMA below.
  targetCents = cents;
  targetNote = note;
  targetFrequency = frequency;
  lastValidPitchTime = Date.now();
}

function updateVisuals() {
  if (!gaugeNeedleElement) return;
	currentGain += (targetGain - currentGain) * 0.12;
  if (inputGainNode && audioContext) {
	inputGainNode.gain.setTargetAtTime(currentGain, audioContext.currentTime, 0.025);
  }
  displayCents += (targetCents - displayCents) * VISUAL_SMOOTHING_FACTOR;
  if (Math.abs(targetCents - displayCents) < 0.05) displayCents = targetCents;

  const roundedCents = Math.round(displayCents);
  if (targetFrequency !== null) {
	noteElement.textContent = targetNote;
	frequencyElement.textContent = `${t("frequency")}: ${targetFrequency.toFixed(2)} ${currentLanguage === "ru" ? "Гц" : "Hz"}`;
	centsElement.textContent = `${t("cents")}: ${roundedCents >= 0 ? "+" : ""}${roundedCents} ${currentLanguage === "en" ? "cents" : currentLanguage === "kk" ? "цент" : "центов"}`;
	updateTuner(targetNote, displayCents);
	centsElement.style.color = Math.abs(displayCents) <= 5 ? "#43a047" : "#ffca28";
	statusElement.textContent = Math.abs(displayCents) <= 5 ? t("noteTuned") : t("tuneInstrument");
  }

  requestAnimationFrame(updateVisuals);
}

const progressionPatterns = {
  major: {
	dreamy: { roman: ["I", "iii", "IV", "iv"], descriptionKey: "progressionDescription" },
	sad: { roman: ["vi", "IV", "I", "V"], descriptionKey: "progressionDescription" },
	energetic: { roman: ["I", "V", "vi", "IV"], descriptionKey: "progressionDescription" },
	melancholic: { roman: ["I", "V", "IV", "iv"], descriptionKey: "progressionDescription" },
	nostalgic: { roman: ["I", "vi", "IV", "V"], descriptionKey: "progressionDescription" },
	dark: { roman: ["I", "bVII", "IV", "iv"], descriptionKey: "progressionDescription" }
  },
  minor: {
	dreamy: { roman: ["i", "VI", "III", "VII"], descriptionKey: "progressionDescription" },
	sad: { roman: ["i", "iv", "VII", "III"], descriptionKey: "progressionDescription" },
	energetic: { roman: ["i", "VII", "VI", "VII"], descriptionKey: "progressionDescription" },
	melancholic: { roman: ["i", "VI", "iv", "V"], descriptionKey: "progressionDescription" },
	nostalgic: { roman: ["i", "III", "VI", "iv"], descriptionKey: "progressionDescription" },
	dark: { roman: ["i", "bII", "VI", "V"], descriptionKey: "progressionDescription" }
  }
};

refreshGeneratedProgression();

function generateProgression() {
  const key = keySelect.value;
	const mode = modeSelect.value;
  const pattern = progressionPatterns[mode][moodSelect.value];
  const chords = pattern.roman.map((degree) => romanToChord(degree, key, mode));
	generatedProgression = chords.map(chordNameToMidi);
	progressionNameElement.textContent = `${t(moodSelect.value)} • ${key} ${t(mode)}`;
  renderChordBlocks(progressionRomanElement, pattern.roman.map((degree) => `[ ${degree} ]`));
  renderChordBlocks(progressionChordsElement, [chords.join(" — ")]);
	progressionDescriptionElement.textContent = `${t(pattern.descriptionKey)} ${t("descriptionSuffix")}: ${key}.`;
  generatedPlaybackStatus.textContent = t("progressionReady");
}

function refreshGeneratedProgression() {
  if (keySelect?.value && modeSelect?.value && moodSelect?.value) generateProgression();
}

function chordNameToMidi(chord) {
  const match = chord.match(/^([A-G](?:#)?)(m)?$/);
  if (!match) return [];
  const root = NOTES.indexOf(match[1]);
  const rootMidi = 60 + (root < 0 ? 0 : root);
  return [rootMidi, rootMidi + (match[2] ? 3 : 4), rootMidi + 7];
}

function playGeneratedProgression() {
  if (!generatedProgression.length) generateProgression();
  const context = getTheoryAudioContext();
  if (!context) return;
  if (generatedPlaybackTimer) window.clearTimeout(generatedPlaybackTimer);
  const start = context.currentTime + 0.08;
	generatedPlaybackStatus.textContent = t("playing");
  generatedProgression.forEach((chord, index) => {
	const time = start + index * 0.9;
	chord.forEach((midi) => playTone(midiToFrequency(midi), 0.78, time, "acoustic_grand_piano"));
	generatedPlaybackTimer = window.setTimeout(() => {
	  generatedPlaybackStatus.textContent = index === generatedProgression.length - 1 ? t("finished") : `${t("chordProgress")} ${index + 1} ${t("of")} ${generatedProgression.length}`;
	}, index * 900);
  });
  generatedPlaybackTimer = window.setTimeout(() => {
  generatedPlaybackStatus.textContent = t("finished");
  }, generatedProgression.length * 900);
}

function renderChordBlocks(container, values) {
  container.innerHTML = "";
  values.forEach((value, index) => {
	const element = document.createElement("span");
	element.className = "chord";
	element.style.animationDelay = `${index * 70}ms`;
	element.textContent = value;
	container.appendChild(element);
  });
}

function romanToChord(roman, key, mode) {
  const rootIndex = NOTES.indexOf(key);
  const accidental = roman.startsWith("b") ? -1 : roman.startsWith("#") ? 1 : 0;
  const cleanRoman = roman.replace(/^[b#]/, "");
  const degreeMap = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };
  const degree = degreeMap[cleanRoman.toUpperCase()];
  const majorSteps = [0, 2, 4, 5, 7, 9, 11];
  const minorSteps = [0, 2, 3, 5, 7, 8, 10];
  const scale = mode === "major" ? majorSteps : minorSteps;
  const chordRoot = NOTES[(rootIndex + scale[degree] + accidental + 12) % 12];
  const isMinor = roman === roman.toLowerCase() || cleanRoman === "iv";
  return `${chordRoot}${isMinor ? "m" : ""}`;
}

function handleQuietSignal(rms) {
  if (rms < MIN_RMS) {
	targetCents += (0 - targetCents) * 0.04;
	if (Math.abs(targetCents) < 0.05) targetCents = 0;
	if (Date.now() - lastValidPitchTime >= NOTE_HOLD_TIME) {
	  targetNote = "—";
	  targetFrequency = null;
	  centsWindow = [];
	  noteElement.textContent = "—";
	  frequencyElement.textContent = "Частота: —";
	  centsElement.textContent = "Отклонение: —";
	  statusElement.textContent = "Ожидание ноты C0–B8";
	} else {
	  statusElement.textContent = "Нота удерживается...";
	}
  } else {
	statusElement.textContent = "Сигнал есть, определяю частоту...";
  }
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function createGaugeTicks() {
  if (!gaugeTicksElement) return;
  const fragment = document.createDocumentFragment();
  for (let cents = -50; cents <= 50; cents += 10) {
	// SVG uses a downward-pointing Y axis. Map -50 cents to the left,
	// 0 cents to the top, and +50 cents to the right side of the arc.
	const angle = 180 - ((cents + 50) / 100) * 180;
	const radians = (angle * Math.PI) / 180;
	const major = cents % 20 === 0 || cents === 0;
	const outerRadius = 153;
	const innerRadius = major ? 137 : 143;
	const x1 = 200 + Math.cos(radians) * innerRadius;
	const y1 = 200 + Math.sin(radians) * innerRadius;
	const x2 = 200 + Math.cos(radians) * outerRadius;
	const y2 = 200 + Math.sin(radians) * outerRadius;
	const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
	tick.setAttribute("x1", x1.toFixed(2));
	tick.setAttribute("y1", y1.toFixed(2));
	tick.setAttribute("x2", x2.toFixed(2));
	tick.setAttribute("y2", y2.toFixed(2));
	tick.setAttribute("class", `gauge-tick${cents === 0 ? " zero" : ""}`);
	fragment.appendChild(tick);
  }
  gaugeTicksElement.appendChild(fragment);
}

function updateTuner(note, cents) {
  const safeCents = Math.max(-50, Math.min(50, Number(cents) || 0));
  const angle = (safeCents / 50) * 90;
  const state = Math.abs(safeCents) <= 5
	? "is-perfect"
	: safeCents < -5
	  ? "is-warning"
	  : "is-danger";

  gaugeNeedleElement.style.transform = `rotate(${angle}deg)`;
  gaugeNeedleElement.classList.remove("is-perfect", "is-warning", "is-danger");
  gaugeCenterElement.classList.remove("is-perfect", "is-warning", "is-danger");
  gaugeZoneElement.classList.remove("is-perfect", "is-warning", "is-danger");
  gaugeNeedleElement.classList.add(state);
  gaugeCenterElement.classList.add(state);
  gaugeZoneElement.classList.add(state);
	noteElement.classList.remove("is-perfect", "is-warning", "is-danger");
  noteElement.classList.add(state);
  noteElement.textContent = note;
}

function keepLastNote(message) {
  if (lastValidPitchTime > 0 && Date.now() - lastValidPitchTime < NOTE_HOLD_TIME) {
	statusElement.textContent = "Нота удерживается...";
	return;
  }
  currentMidi = null;
  candidateMidi = null;
  candidateFrames = 0;
  smoothedCents = null;
  targetCents = 0;
  targetNote = "—";
  targetFrequency = null;
  centsWindow = [];
  updateTuner("—", displayCents);
  noteElement.textContent = "—";
  frequencyElement.textContent = "Частота: —";
  centsElement.textContent = "Отклонение: —";
  statusElement.textContent = message;
}

function frequencyToNote(freq) {
  if (!Number.isFinite(freq) || freq < 15 || freq > 8000) return null;

	const midi = Math.round(12 * Math.log2(freq / referenceFrequency) + 69);
  if (midi < 12 || midi > 119) return null;

  const noteName = NOTES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
	const targetFreq = referenceFrequency * Math.pow(2, (midi - 69) / 12);
  const cents = Math.round(1200 * Math.log2(freq / targetFreq));

  return {
	note: `${noteName}${octave}`,
	noteName,
	octave,
	targetFreq,
	cents,
	frequency: freq,
	midi
  };
}

function frequencyToMidi(frequency) {
  return frequencyToNote(frequency)?.midi ?? null;
}
function midiToFrequency(midi, tuningFrequency = DEFAULT_REFERENCE_FREQUENCY) {
  return tuningFrequency * Math.pow(2, (midi - 69) / 12);
}
function calculateRms(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  return Math.sqrt(sum / data.length);
}
function getMicrophoneError(error) {
  if (error.name === "NotAllowedError") return "Доступ к микрофону запрещён. Разрешите микрофон в настройках сайта.";
  if (error.name === "NotFoundError") return "Микрофон не найден. Подключите микрофон и повторите попытку.";
  if (error.name === "NotReadableError") return "Микрофон занят другой программой.";
  return `Ошибка микрофона: ${error.message || error.name}`;
}
