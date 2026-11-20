const BUFFER_SIZE = 8192;
const NOTE_HOLD_TIME = 1500;
const DEFAULT_REFERENCE_FREQUENCY = 440;

const NOTES = MusicTheoryEngine.notes;

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
const smoothnessElement = document.getElementById("inputSmoothness");
const smoothnessValueElement = document.getElementById("smoothnessValue");
const tunerPresetElement = document.getElementById("tunerPreset");
const tunerStringsElement = document.getElementById("tunerStrings");
const tunerReferenceStatusElement = document.getElementById("tunerReferenceStatus");
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
const generatorBoardElement = document.getElementById("generatorBoard");
const generatorTabs = document.querySelectorAll(".generator-tab");
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
	chordTones: "Ноты аккорда",
	brandSubtitle: "музыкальная лаборатория", navTuner: "Тюнер", navTheory: "Теория", navChords: "Аккорды",
	tunerTitle: "Хроматический тюнер", tunerDescription: "Поднесите инструмент к микрофону. Стрелка плавно реагирует на отклонение от выбранной ноты.",
	startMicrophone: "Запустить микрофон", gaugeLabel: "Шкала отклонения в центах", signalSettings: "Настройки сигнала", smoothnessGain: "Плавность / усиление", referenceA4: "Эталон A4",
	referenceDescription: "Эталон A4 используется для расчёта нот и отклонения в центах.", gainDescription: "Ползунок меняет громкость сигнала мягко, без резких скачков.", resetSettings: "Сбросить настройки",
	frequency: "Частота", cents: "Отклонение", range: "Диапазон", listening: "Слушаю микрофон...", signalDetecting: "Сигнал есть, определяю частоту...", noteHeld: "Нота удерживается...", noteTuned: "Нота настроена", tuneInstrument: "Настройте инструмент", waitingNote: "Ожидание ноты C0–B8",
	theoryTitle: "Интерактивная теория музыки", theoryDescription: "Изучайте ноты, интервалы, гаммы, аккорды и прогрессии через звук и движение.", generatorTitle: "Генератор прогрессий", generatorDescription: "Выберите тонику, лад и настроение — PitchMate соберёт гармоническую последовательность.", generate: "Сгенерировать прогрессию", listen: "▶ Послушать прогрессию", playback: "Воспроизведение...", ready: "Прогрессия готова к прослушиванию.", done: "Готово.", chord: "Аккорд", outOf: "из",
	major: "Мажор", minor: "Минор", dreamy: "Мечтательное", sad: "Грустное", energetic: "Энергичное", melancholic: "Меланхоличное", nostalgic: "Ностальгическое", dark: "Тёмное", tonic: "Тоника", mode: "Лад", mood: "Настроение", roman: "Символические ступени", chordNames: "Буквенные аккорды", lightTheme: "☀ Светлая тема", darkTheme: "☾ Тёмная тема", makeMinor: "Сделать минорным", restoreMajor: "Вернуть E мажор", theoryCard1Title: "1. 12 нот и октава", theoryCard1Description: "Нажмите на клавишу, чтобы услышать ноту. Белые клавиши подписаны буквами, чёрные — диезами.", theoryCard2Title: "2. Тон и полутон", theoryCard2Description: "Полутон — расстояние до соседней клавиши или соседнего лада.", theoryCard3Title: "3. Скелет гаммы", theoryCard3Description: "Переключите лад и наблюдайте, как меняются расстояния между ступенями.", theoryCard4Title: "4. Конструктор аккорда", theoryCard4Description: "Третья ступень определяет характер трезвучия. Опустите G# на полутон и услышите E minor.", theoryCard5Title: "5. Движение песни", theoryCard5Description: "Слушайте мечтательно-меланхоличный переход E — Em — A — Am.", piano: "Пианино", guitar: "Гитара", play: "Play", generatorEyebrow: "Find your next idea", progressionReady: "Прогрессия готова к прослушиванию.", playing: "Воспроизведение...", finished: "Готово.", chordProgress: "Аккорд", of: "из", descriptionSuffix: "Тональность", progressionDescription: "Мягкая и выразительная гармоническая последовательность."
  },
  en: {
	chordTones: "Chord tones",
	brandSubtitle: "music laboratory", navTuner: "Tuner", navTheory: "Theory", navChords: "Chords",
	tunerTitle: "Chromatic tuner", tunerDescription: "Bring your instrument close to the microphone. The needle smoothly reacts to the selected note.",
	startMicrophone: "Start microphone", gaugeLabel: "Cents deviation scale", signalSettings: "Signal settings", smoothnessGain: "Smoothness / gain", referenceA4: "A4 reference",
	referenceDescription: "The A4 reference is used to calculate notes and cents deviation.", gainDescription: "The slider changes signal volume smoothly without sudden jumps.", resetSettings: "Reset settings",
	frequency: "Frequency", cents: "Deviation", range: "Range", listening: "Listening to microphone...", signalDetecting: "Signal detected, measuring frequency...", noteHeld: "Holding note...", noteTuned: "Note is in tune", tuneInstrument: "Tune your instrument", waitingNote: "Waiting for note C0–B8",
	theoryTitle: "Interactive music theory", theoryDescription: "Explore notes, intervals, scales, chords, and progressions through sound and motion.", generatorTitle: "Progression generator", generatorDescription: "Choose a key, mode, and mood — PitchMate will create a harmonic progression.", generate: "Generate progression", listen: "▶ Listen to progression", playback: "Playing...", ready: "Progression ready to play.", done: "Done.", chord: "Chord", outOf: "of",
	major: "Major", minor: "Minor", dreamy: "Dreamy", sad: "Sad", energetic: "Energetic", melancholic: "Melancholic", nostalgic: "Nostalgic", dark: "Dark", tonic: "Key", mode: "Mode", mood: "Mood", roman: "Roman numerals", chordNames: "Chord names", lightTheme: "☀ Light mode", darkTheme: "☾ Dark mode", makeMinor: "Make minor", restoreMajor: "Restore E major", theoryCard1Title: "1. 12 notes and an octave", theoryCard1Description: "Click a key to hear the note. White keys are labeled with letters, black keys with sharps.", theoryCard2Title: "2. Tone and semitone", theoryCard2Description: "A semitone is the distance to the neighboring key or fret.", theoryCard3Title: "3. Scale structure", theoryCard3Description: "Switch the mode and watch the distances between scale degrees change.", theoryCard4Title: "4. Chord builder", theoryCard4Description: "The third defines the character of a triad. Lower G# by a semitone to hear E minor.", theoryCard5Title: "5. Song movement", theoryCard5Description: "Listen to the dreamy, melancholic transition E — Em — A — Am.", piano: "Piano", guitar: "Guitar", play: "Play", generatorEyebrow: "Find your next idea", progressionReady: "Progression ready to play.", playing: "Playing...", finished: "Done.", chordProgress: "Chord", of: "of", descriptionSuffix: "Key", progressionDescription: "A smooth and expressive harmonic progression."
  },
  kk: {
	chordTones: "Аккорд ноталары",
	brandSubtitle: "музыкалық зертхана", navTuner: "Тюнер", navTheory: "Теория", navChords: "Аккордтар",
	tunerTitle: "Хроматикалық тюнер", tunerDescription: "Аспапты микрофонға жақындатыңыз. Көрсеткі таңдалған нотаға ауытқуды бірқалыпты көрсетеді.",
	startMicrophone: "Микрофонды іске қосу", gaugeLabel: "Цент ауытқу шкаласы", signalSettings: "Сигнал баптаулары", smoothnessGain: "Тегістік / күшейту", referenceA4: "A4 эталоны",
	referenceDescription: "A4 эталоны ноталар мен цент ауытқуын есептеу үшін қолданылады.", gainDescription: "Жүгірткі сигнал деңгейін күрт өзгеріссіз бірқалыпты өзгертеді.", resetSettings: "Баптауларды қалпына келтіру",
	frequency: "Жиілік", cents: "Ауытқу", range: "Диапазон", listening: "Микрофон тыңдалуда...", signalDetecting: "Сигнал бар, жиілік анықталуда...", noteHeld: "Нота ұсталып тұр...", noteTuned: "Нота дәл бапталған", tuneInstrument: "Аспапты баптаңыз", waitingNote: "C0–B8 нотасы күтілуде",
	theoryTitle: "Интерактивті музыка теориясы", theoryDescription: "Ноталарды, интервалдарды, гаммаларды, аккордтар мен прогрессияларды дыбыс арқылы үйреніңіз.", generatorTitle: "Прогрессия генераторы", generatorDescription: "Тониканы, ладты және көңіл күйді таңдаңыз — PitchMate гармониялық прогрессия жасайды.", generate: "Прогрессия жасау", listen: "▶ Прогрессияны тыңдау", playback: "Ойнатылуда...", ready: "Прогрессия тыңдауға дайын.", done: "Дайын.", chord: "Аккорд", outOf: "ішінен",
	major: "Мажор", minor: "Минор", dreamy: "Армандай", sad: "Мұңды", energetic: "Қуатты", melancholic: "Мұңлы", nostalgic: "Ностальгиялық", dark: "Қараңғы", tonic: "Тоника", mode: "Лад", mood: "Көңіл күй", roman: "Рим цифрлары", chordNames: "Аккорд атаулары", lightTheme: "☀ Ашық режим", darkTheme: "☾ Қараңғы режим", makeMinor: "Минор жасау", restoreMajor: "E мажорын қайтару", theoryCard1Title: "1. 12 нота және октава", theoryCard1Description: "Нотаны есту үшін пернені басыңыз. Ақ пернелер әріптермен, қара пернелер диездермен белгіленген.", theoryCard2Title: "2. Тон және жарты тон", theoryCard2Description: "Жарты тон — көрші перне немесе лад арасындағы қашықтық.", theoryCard3Title: "3. Гамма құрылымы", theoryCard3Description: "Ладты ауыстырып, сатылар арасындағы қашықтықтардың өзгеруін көріңіз.", theoryCard4Title: "4. Аккорд құрастырушы", theoryCard4Description: "Үшінші саты үшдыбыстың сипатын анықтайды. E minor дыбысын есту үшін G# нотасын жарты тонға төмендетіңіз.", theoryCard5Title: "5. Ән қозғалысы", theoryCard5Description: "E — Em — A — Am армандайтын, мұңды ауысуын тыңдаңыз.", piano: "Пианино", guitar: "Гитара", play: "Ойнату", generatorEyebrow: "Келесі идеяңызды табыңыз", progressionReady: "Прогрессия тыңдауға дайын.", playing: "Ойнатылуда...", finished: "Дайын.", chordProgress: "Аккорд", of: "ішінен", descriptionSuffix: "Тональдік", progressionDescription: "Жұмсақ әрі әсерлі гармониялық прогрессия."
  }
};

Object.assign(translations.ru, {
  tunerTuning: "Строй", chromatic: "Хроматический", standardTuning: "Стандартный E",
  referenceStrings: "Эталонные звуки струн", signalGain: "Усиление", smoothness: "Плавность",
  tuneHigher: "Выше ↑", tuneLower: "Ниже ↓", audioError: "Не удалось воспроизвести эталонный звук.",
  instrumentAudioError: "Не удалось воспроизвести звук инструмента.",
  microphoneUnsupported: "Браузер не поддерживает доступ к микрофону.", webAudioUnsupported: "Web Audio API не поддерживается браузером.",
  microphoneDenied: "Доступ к микрофону запрещён. Разрешите микрофон в настройках сайта.",
  microphoneNotFound: "Микрофон не найден. Подключите микрофон и повторите попытку.",
  microphoneInUse: "Микрофон занят другой программой.", microphoneError: "Ошибка микрофона"
});
Object.assign(translations.en, {
  tunerTuning: "Tuning", chromatic: "Chromatic", standardTuning: "Standard E",
  referenceStrings: "Reference string tones", signalGain: "Gain", smoothness: "Smoothness",
  tuneHigher: "Higher ↑", tuneLower: "Lower ↓", audioError: "Could not play the reference tone.",
  instrumentAudioError: "Could not play the instrument sound.",
  microphoneUnsupported: "Microphone access is not supported by this browser.", webAudioUnsupported: "Web Audio API is not supported by this browser.",
  microphoneDenied: "Microphone access was denied. Allow it in the site settings.",
  microphoneNotFound: "No microphone found. Connect a microphone and try again.",
  microphoneInUse: "The microphone is in use by another application.", microphoneError: "Microphone error"
});
Object.assign(translations.kk, {
  tunerTuning: "Бұрау", chromatic: "Хроматикалық", standardTuning: "Стандартты E",
  referenceStrings: "Ішектердің эталондық дыбыстары", signalGain: "Күшейту", smoothness: "Тегістік",
  tuneHigher: "Жоғары ↑", tuneLower: "Төмен ↓", audioError: "Эталондық дыбысты ойнату мүмкін болмады.",
  instrumentAudioError: "Аспап дыбысын ойнату мүмкін болмады.",
  microphoneUnsupported: "Бұл браузерде микрофонға қол жеткізу мүмкін емес.", webAudioUnsupported: "Бұл браузерде Web Audio API қолжетімсіз.",
  microphoneDenied: "Микрофонға рұқсат берілмеді. Сайт баптауларында рұқсат беріңіз.",
  microphoneNotFound: "Микрофон табылмады. Микрофонды қосып, қайталап көріңіз.",
  microphoneInUse: "Микрофонды басқа бағдарлама пайдаланып жатыр.", microphoneError: "Микрофон қатесі"
});

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
  if (statusElement.dataset.initial === "true") statusElement.textContent = `${t("range")}: C0–B8`;
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
	renderIntervalView(document.querySelector('.theory-tab[data-interval].active')?.dataset.interval || "piano");
  renderTunerStrings();
  updateDynamicText();
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
let inputBuffer = null;
let lastValidPitchTime = 0;
let targetCents = 0;
let displayCents = 0;
let targetNote = "—";
let targetFrequency = null;
let targetMidi = null;
let signalActive = false;
let stableSince = null;
let isTuned = false;
let tunerMessageKey = "listening";
let lastVisualTime = null;
let lastAnalysisTime = 0;
let inputGainNode = null;
let targetGain = 1;
let currentGain = 1;
let generatedProgression = [];
let generatedChordNames = [];
let selectedProgressionChordIndex = 0;
let generatorInstrument = "piano";
let generatedPlaybackTimer = null;
let referenceFrequency = DEFAULT_REFERENCE_FREQUENCY;
let instrumentPlayer = null;
const instrumentChannelVersions = new Map();
const pitchDetector = new YinPitchDetector();
const pitchTracker = new PitchTracker();

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
smoothnessElement?.addEventListener("input", () => {
  smoothnessValueElement.textContent = `${smoothnessElement.value}%`;
});
tunerPresetElement?.addEventListener("change", () => {
  renderTunerStrings();
  stableSince = null;
  isTuned = false;
  if (signalActive && targetFrequency !== null) updatePitch(targetFrequency, performance.now());
});
referenceFrequencyElement?.addEventListener("input", () => {
  const nextReference = Number(referenceFrequencyElement.value);
  if (!Number.isFinite(nextReference) || nextReference < 400 || nextReference > 480) return;
  referenceFrequency = nextReference;
	updateReferenceFrequencyDisplay();
  stableSince = null;
  isTuned = false;
  if (signalActive && targetFrequency !== null) updatePitch(targetFrequency, performance.now());
});
resetButton?.addEventListener("click", () => {
  inputGainElement.value = "100";
  targetGain = 1;
  gainValueElement.textContent = "100%";
  smoothnessElement.value = "50";
  smoothnessValueElement.textContent = "50%";
  tunerPresetElement.value = "chromatic";
  renderTunerStrings();
  referenceFrequency = DEFAULT_REFERENCE_FREQUENCY;
  referenceFrequencyElement.value = String(DEFAULT_REFERENCE_FREQUENCY);
	updateReferenceFrequencyDisplay();
  stableSince = null;
  isTuned = false;
  if (signalActive && targetFrequency !== null) updatePitch(targetFrequency, performance.now());
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
	navButtons.forEach((item) => item.classList.toggle("active", item === button));
	sections.forEach((section) => section.classList.toggle("active", section.id === button.dataset.section));
	window.trackEvent("tab_switch", { tab_name: button.dataset.section });
  });
});

generateButton?.addEventListener("click", generateProgression);
listenGeneratedButton?.addEventListener("click", playGeneratedProgression);
progressionChordsElement?.addEventListener("click", (event) => {
  const button = event.target.closest(".progression-chord");
  if (!button || !progressionChordsElement.contains(button)) return;
  selectedProgressionChordIndex = Number(button.dataset.index);
  progressionChordsElement.querySelectorAll(".progression-chord").forEach((chordButton, index) => {
	const isSelected = index === selectedProgressionChordIndex;
	chordButton.classList.toggle("active", isSelected);
	chordButton.setAttribute("aria-pressed", String(isSelected));
  });
  renderGeneratorBoard();
});
generatorTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
	generatorInstrument = tab.dataset.instrument;
	generatorTabs.forEach((item) => {
	  const isSelected = item === tab;
	  item.classList.toggle("active", isSelected);
	  item.setAttribute("aria-pressed", String(isSelected));
	});
	renderGeneratorBoard();
  });
});
initializeTheoryVisuals();

function initializeTheoryVisuals() {
  createPianoKeyboard();
  renderIntervalView("piano");
  renderScale("major");
	document.querySelectorAll('.theory-tab[data-interval]').forEach((tab) => {
	tab.addEventListener("click", () => {
	  document.querySelectorAll('.theory-tab[data-interval]').forEach((item) => item.classList.toggle("active", item === tab));
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
  return audioContext;
}

function stopInstrumentChannel(channel) {
  instrumentChannelVersions.set(channel, (instrumentChannelVersions.get(channel) || 0) + 1);
  if (instrumentPlayer) instrumentPlayer.stop(channel);
}

async function playInstrument(instrument, events, status = document.getElementById("theoryAudioStatus"), channel = null) {
  try {
    if (channel) stopInstrumentChannel(channel);
    const version = channel ? instrumentChannelVersions.get(channel) : 0;
    const context = getTheoryAudioContext();
    if (!context) throw new Error("Web Audio API unavailable");
    if (context.state === "suspended") await context.resume();
    if (channel && instrumentChannelVersions.get(channel) !== version) return null;
    if (!instrumentPlayer || instrumentPlayer.context !== context) {
      instrumentPlayer = new InstrumentPlayer(context, InstrumentSampleData);
    }
    const start = await instrumentPlayer.play(instrument, events, referenceFrequency, channel);
    status.textContent = "";
    return start;
  } catch (error) {
    console.error("Could not play instrument:", error);
    status.textContent = t("instrumentAudioError");
    return null;
  }
}

function createPianoKeyboard() {
  if (!pianoKeyboardElement) return;
	["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach((note, semitone) => {
	const key = document.createElement("button");
	key.className = `piano-key ${note.includes("#") ? "black-key" : "white-key"}`;
	key.textContent = note;
	key.addEventListener("click", () => playKeyboardNote(semitone, key));
	pianoKeyboardElement.appendChild(key);
  });
}

function playKeyboardNote(semitone, element) {
  element.classList.add("active");
  playInstrument("piano", [{ midi: 60 + semitone, offset: 0, duration: 0.85, gain: 0.7 }]);
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
  const firstMidi = type === "guitar" ? 60 : 64;
  playInstrument(type, [firstMidi, firstMidi + 1].map((midi, index) => ({ midi, offset: index * 0.48, duration: 0.45, gain: 0.7 })));
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
  const midis = [...notes.map((note) => ({ E: 64, G: 67, "G#": 68 }[note])), 71];
  playInstrument("piano", midis.map((midi, index) => ({ midi, offset: index * 0.05, duration: 0.7, gain: 0.35 })));
}

async function playProgression() {
  const cards = [...playerChordsElement.querySelectorAll(".player-chord")];
  const frequencies = [[64, 68, 71], [64, 67, 71], [69, 73, 76], [69, 72, 76]];
  const events = frequencies.flatMap((chord, index) => chord.map((midi) => ({ midi, offset: index * 0.9, duration: 0.78, gain: 0.35 })));
  const start = await playInstrument("piano", events);
  if (start === null) return;
  const delay = Math.max(0, (start - audioContext.currentTime) * 1000);
  cards.forEach((card, index) => {
	window.setTimeout(() => {
	  cards.forEach((item) => item.classList.remove("active"));
	  card.classList.add("active");
	}, delay + index * 900);
  });
  window.setTimeout(() => cards.forEach((card) => card.classList.remove("active")), delay + cards.length * 900);
}

async function startTuner() {
  let stream = null;
  delete statusElement.dataset.initial;
  startButton.disabled = true;
  try {
	if (!navigator.mediaDevices?.getUserMedia) {
	  throw new Error(t("microphoneUnsupported"));
	}
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) throw new Error(t("webAudioUnsupported"));

	if (!audioContext) audioContext = new AudioContextClass();
	await audioContext.resume();
	stream = await navigator.mediaDevices.getUserMedia({
	  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
	});
	const source = audioContext.createMediaStreamSource(stream);
	analyser = audioContext.createAnalyser();
	analyser.fftSize = BUFFER_SIZE;
	analyser.smoothingTimeConstant = 0;
	inputBuffer = new Float32Array(BUFFER_SIZE);
	inputGainNode = audioContext.createGain();
	inputGainNode.gain.value = currentGain;
	source.connect(inputGainNode).connect(analyser);
	window.trackEvent("tuner_start");
	tunerMessageKey = "listening";
	statusElement.textContent = t(tunerMessageKey);
	requestAnimationFrame(updateVisuals);
	requestAnimationFrame(processAudio);
  } catch (error) {
	if (stream) stream.getTracks().forEach((track) => track.stop());
	startButton.disabled = false;
	statusElement.textContent = getMicrophoneError(error);
	console.error(error);
  }
}

function processAudio(now) {
  if (!analyser || !audioContext) return;
  if (now - lastAnalysisTime >= 50) {
    lastAnalysisTime = now;
    analyser.getFloatTimeDomainData(inputBuffer);
    const result = pitchDetector.detect(inputBuffer, audioContext.sampleRate);
    const frequency = result.frequency === null ? null : pitchTracker.update(result.frequency, result.rms, now);
    if (frequency === null) {
      if (result.frequency !== null && pitchTracker.rejectedOctave) lastValidPitchTime = now;
      handleMissingSignal(now, result.rms < pitchDetector.noiseGate ? "waitingNote" : "signalDetecting");
    } else {
      updatePitch(frequency, now);
    }
  }
  requestAnimationFrame(processAudio);
}

function updatePitch(frequency, now) {
  const pitch = frequencyToNote(frequency);
  if (!pitch) {
    handleMissingSignal(now, "signalDetecting");
    return;
  }
  const strings = MusicTheoryEngine.tunings[tunerPresetElement.value];
  const midi = strings ? strings.reduce((closest, candidate) =>
    Math.abs(1200 * Math.log2(frequency / midiToFrequency(candidate, referenceFrequency))) <
    Math.abs(1200 * Math.log2(frequency / midiToFrequency(closest, referenceFrequency))) ? candidate : closest
  ) : pitch.midi;
  const cents = 1200 * Math.log2(frequency / midiToFrequency(midi, referenceFrequency));
  if (midi !== targetMidi || Math.abs(cents) > 3) {
    stableSince = null;
    isTuned = false;
  }
  if (Math.abs(cents) <= 3) {
    if (stableSince === null) stableSince = now;
    isTuned = now - stableSince >= 400;
  }
  targetMidi = midi;
  targetCents = cents;
  targetNote = MusicTheoryEngine.noteName(midi);
  targetFrequency = frequency;
  lastValidPitchTime = now;
  signalActive = true;
}

function updateVisuals(now) {
  if (!gaugeNeedleElement) return;
	currentGain += (targetGain - currentGain) * 0.12;
  if (inputGainNode && audioContext) {
	inputGainNode.gain.setTargetAtTime(currentGain, audioContext.currentTime, 0.025);
  }
  const elapsed = lastVisualTime === null ? 16.67 : Math.min(100, Math.max(0, now - lastVisualTime));
  lastVisualTime = now;
  const baseAlpha = 0.4 - Number(smoothnessElement.value) / 100 * 0.36;
  const alpha = 1 - Math.pow(1 - baseAlpha, elapsed / 16.67);
  displayCents += (targetCents - displayCents) * alpha;
  if (Math.abs(targetCents - displayCents) < 0.05) displayCents = targetCents;

  const roundedCents = Math.round(targetCents);
  if (targetFrequency !== null) {
	noteElement.textContent = targetNote;
	frequencyElement.textContent = `${t("frequency")}: ${targetFrequency.toFixed(2)} ${currentLanguage === "ru" ? "Гц" : "Hz"}`;
	centsElement.textContent = `${t("cents")}: ${roundedCents >= 0 ? "+" : ""}${roundedCents} ${currentLanguage === "en" ? "cents" : currentLanguage === "kk" ? "цент" : "центов"}`;
	updateTuner(targetNote, displayCents, signalActive && isTuned);
	centsElement.style.color = signalActive && isTuned ? "#43a047" : "";
	if (signalActive) {
	  statusElement.textContent = isTuned ? t("noteTuned") : stringsDirection();
	} else {
	  statusElement.textContent = t(tunerMessageKey);
	}
  } else {
    statusElement.textContent = t(tunerMessageKey);
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
	generatedChordNames = chords;
	selectedProgressionChordIndex = 0;
	progressionNameElement.textContent = `${t(moodSelect.value)} • ${key} ${t(mode)}`;
  renderChordBlocks(progressionRomanElement, pattern.roman.map((degree) => `[ ${degree} ]`));
	renderProgressionChordButtons(chords);
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
  return MusicTheoryEngine.chords[match[2] ? "minor" : "major"].intervals.map((interval) => rootMidi + interval);
}

async function playGeneratedProgression() {
  if (!generatedProgression.length) generateProgression();
  if (generatedPlaybackTimer) window.clearTimeout(generatedPlaybackTimer);
  const events = generatedProgression.flatMap((chord, index) =>
    chord.map((midi) => ({ midi, offset: index * 0.9, duration: 0.78, gain: 0.35 })));
  const start = await playInstrument(generatorInstrument, events, generatedPlaybackStatus);
  if (start === null) return;
  const delay = Math.max(0, (start - audioContext.currentTime) * 1000);
  generatedPlaybackStatus.textContent = t("playing");
  generatedProgression.forEach((chord, index) => {
	generatedPlaybackTimer = window.setTimeout(() => {
	  generatedPlaybackStatus.textContent = index === generatedProgression.length - 1 ? t("finished") : `${t("chordProgress")} ${index + 1} ${t("of")} ${generatedProgression.length}`;
	}, delay + index * 900);
  });
  generatedPlaybackTimer = window.setTimeout(() => {
  generatedPlaybackStatus.textContent = t("finished");
  }, delay + generatedProgression.length * 900);
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

function renderProgressionChordButtons(chords) {
  if (!progressionChordsElement) return;
  progressionChordsElement.innerHTML = "";
  chords.forEach((chord, index) => {
	const button = document.createElement("button");
	const isSelected = index === selectedProgressionChordIndex;
	button.type = "button";
	button.className = `chord progression-chord${isSelected ? " active" : ""}`;
	button.dataset.index = String(index);
	button.setAttribute("aria-pressed", String(isSelected));
	button.textContent = chord;
	progressionChordsElement.appendChild(button);
  });
  renderGeneratorBoard();
}

function renderGeneratorBoard() {
  if (!generatorBoardElement) return;
  const chord = generatedProgression[selectedProgressionChordIndex] || [];
  if (!chord.length) {
	generatorBoardElement.replaceChildren();
	return;
  }

  const pitchClasses = new Set(chord.map((midi) => ((midi % 12) + 12) % 12));
  const noteNames = [...pitchClasses].map((pitchClass) => NOTES[pitchClass]);
  const chordName = generatedChordNames[selectedProgressionChordIndex];
  generatorBoardElement.setAttribute("aria-label", `${chordName}: ${noteNames.join(", ")}`);
  generatorBoardElement.replaceChildren();

  if (generatorInstrument === "guitar") {
	if (window.PitchMateModules) {
	  window.PitchMateModules.renderGeneratorGuitar(generatorBoardElement, chordName);
	  return;
	}
	generatorBoardElement.appendChild(renderGuitarVoicing(chord, pitchClasses));
	return;
  }

  const keyboard = document.createElement("div");
  keyboard.className = "generator-piano";
  keyboard.setAttribute("aria-hidden", "true");
  const blackKeys = new Set([1, 3, 6, 8, 10]);
  NOTES.forEach((note, pitchClass) => {
	const key = document.createElement("span");
	key.className = `generator-piano-key${blackKeys.has(pitchClass) ? " is-black" : ""}`;
	if (pitchClasses.has(pitchClass)) key.classList.add("is-chord-tone");
	key.textContent = note;
	keyboard.appendChild(key);
  });
  generatorBoardElement.appendChild(keyboard);
}

function renderGuitarVoicing(chord, pitchClasses) {
  const strings = [
	{ label: "E", midi: 64 },
	{ label: "B", midi: 59 },
	{ label: "G", midi: 55 },
	{ label: "D", midi: 50 },
	{ label: "A", midi: 45 },
	{ label: "E", midi: 40 }
  ];
  const voicing = findGuitarVoicing(chord);
  const scroll = document.createElement("div");
  const fretboard = document.createElement("div");
  scroll.className = "generator-fretboard-scroll";
  fretboard.className = "generator-fretboard";
  fretboard.setAttribute("aria-hidden", "true");

  const corner = document.createElement("span");
  fretboard.appendChild(corner);
  for (let fret = 0; fret <= 12; fret++) {
	const label = document.createElement("span");
	label.className = "generator-fret-label";
	label.textContent = String(fret);
	fretboard.appendChild(label);
  }

  strings.forEach((string, stringIndex) => {
	const stringLabel = document.createElement("span");
	stringLabel.className = "generator-string-label";
	stringLabel.textContent = string.label;
	fretboard.appendChild(stringLabel);
	for (let fret = 0; fret <= 12; fret++) {
	  const cell = document.createElement("span");
	  cell.className = "generator-fret-cell";
	  const voicingNote = voicing.find((note) => note.stringIndex === stringIndex && note.fret === fret);
	  if (voicingNote && pitchClasses.has((string.midi + fret) % 12)) {
		const marker = document.createElement("span");
		marker.className = `generator-fret-marker${voicingNote.pitchClass === ((chord[0] % 12) + 12) % 12 ? " is-root" : ""}`;
		marker.textContent = NOTES[voicingNote.pitchClass];
		cell.appendChild(marker);
	  }
	  fretboard.appendChild(cell);
	}
  });
  scroll.appendChild(fretboard);
  return scroll;
}

function findGuitarVoicing(chord) {
  const strings = [64, 59, 55, 50, 45, 40];
  const pitchClasses = [...new Set(chord.map((midi) => ((midi % 12) + 12) % 12))];
  let bestVoicing = [];
  let bestScore = Infinity;

  function search(toneIndex, selectedNotes) {
	if (toneIndex === pitchClasses.length) {
	  const frets = selectedNotes.map((note) => note.fret);
	  const stringIndexes = selectedNotes.map((note) => note.stringIndex);
	  const fretSpan = Math.max(...frets) - Math.min(...frets);
	  const fretTotal = frets.reduce((total, fret) => total + fret, 0);
	  const stringSpan = Math.max(...stringIndexes) - Math.min(...stringIndexes);
	  const score = fretSpan * 30 + fretTotal * 3 + stringSpan;
	  if (score < bestScore) {
		bestScore = score;
		bestVoicing = [...selectedNotes];
	  }
	  return;
	}

	const pitchClass = pitchClasses[toneIndex];
	strings.forEach((openMidi, stringIndex) => {
	  if (selectedNotes.some((note) => note.stringIndex === stringIndex)) return;
	  for (let fret = 0; fret <= 12; fret++) {
		if ((openMidi + fret) % 12 !== pitchClass) continue;
		selectedNotes.push({ stringIndex, fret, pitchClass });
		search(toneIndex + 1, selectedNotes);
		selectedNotes.pop();
	  }
	});
  }

  search(0, []);
  return bestVoicing;
}

function romanToChord(roman, key, mode) {
  const rootIndex = NOTES.indexOf(key);
  const accidental = roman.startsWith("b") ? -1 : roman.startsWith("#") ? 1 : 0;
  const cleanRoman = roman.replace(/^[b#]/, "");
  const degreeMap = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };
  const degree = degreeMap[cleanRoman.toUpperCase()];
  const scale = MusicTheoryEngine.scales[mode === "major" ? "major" : "naturalMinor"];
  const chordRoot = NOTES[(rootIndex + scale[degree] + accidental + 12) % 12];
  const isMinor = roman === roman.toLowerCase() || cleanRoman === "iv";
  return `${chordRoot}${isMinor ? "m" : ""}`;
}

function handleMissingSignal(now, messageKey) {
  if (signalActive) targetCents = displayCents;
  signalActive = false;
  stableSince = null;
  isTuned = false;
  tunerMessageKey = lastValidPitchTime && now - lastValidPitchTime < NOTE_HOLD_TIME ? "noteHeld" : messageKey;
  if (!lastValidPitchTime || now - lastValidPitchTime >= NOTE_HOLD_TIME) {
    pitchTracker.reset();
    targetMidi = null;
    targetNote = "—";
    targetFrequency = null;
    noteElement.textContent = "—";
    noteElement.classList.remove("is-perfect", "is-warning", "is-danger");
    gaugeCenterElement.classList.remove("is-perfect", "is-warning", "is-danger");
    gaugeZoneElement.classList.remove("is-perfect", "is-warning", "is-danger");
    gaugeNeedleElement.classList.remove("is-perfect", "is-warning", "is-danger");
    frequencyElement.textContent = `${t("frequency")}: —`;
    centsElement.textContent = `${t("cents")}: —`;
  }
}

function stringsDirection() {
  if (tunerPresetElement.value === "chromatic" || Math.abs(targetCents) <= 3) return t("tuneInstrument");
  return t(targetCents < 0 ? "tuneHigher" : "tuneLower");
}

function renderTunerStrings() {
  const strings = MusicTheoryEngine.tunings[tunerPresetElement.value];
  tunerStringsElement.hidden = !strings;
  tunerStringsElement.replaceChildren();
  tunerReferenceStatusElement.textContent = "";
  if (!strings) return;
  [...strings].reverse().forEach((midi, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button-secondary";
    button.textContent = MusicTheoryEngine.noteName(midi);
    button.setAttribute("aria-label", `${t("referenceStrings")} ${6 - index}: ${button.textContent}`);
    button.addEventListener("click", () => playReferenceTone(midi));
    tunerStringsElement.appendChild(button);
  });
}

async function playReferenceTone(midi) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && !AudioContextClass) throw new Error("Web Audio API unavailable");
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === "suspended") await audioContext.resume();
    const start = audioContext.currentTime + 0.02;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = midiToFrequency(midi, referenceFrequency);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.15, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 1.02);
    tunerReferenceStatusElement.textContent = "";
  } catch (error) {
    console.error("Could not play reference tone:", error);
    tunerReferenceStatusElement.textContent = t("audioError");
  }
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

function updateTuner(note, cents, tuned) {
  const safeCents = Math.max(-50, Math.min(50, Number(cents) || 0));
  const angle = (safeCents / 50) * 90;
  const state = tuned ? "is-perfect" : safeCents < 0 ? "is-warning" : "is-danger";

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

function frequencyToNote(freq) {
  if (!Number.isFinite(freq) || freq < 15 || freq > 8000) return null;

	const midi = MusicTheoryEngine.midiFromFrequency(freq, referenceFrequency);
  if (midi < 12 || midi > 119) return null;

  const noteName = NOTES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
	const targetFreq = MusicTheoryEngine.frequency(midi, referenceFrequency);
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

function midiToFrequency(midi, tuningFrequency = DEFAULT_REFERENCE_FREQUENCY) {
  return MusicTheoryEngine.frequency(midi, tuningFrequency);
}
function getMicrophoneError(error) {
  if (error.name === "NotAllowedError") return t("microphoneDenied");
  if (error.name === "NotFoundError") return t("microphoneNotFound");
  if (error.name === "NotReadableError") return t("microphoneInUse");
  return `${t("microphoneError")}: ${error.message || error.name}`;
}
