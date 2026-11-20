// @ts-check
(() => {
  /** @type {Record<'en'|'ru'|'kk', Record<string, string>>} */
  const words = {
    en: {
      earTitle: "Ear Training", earIntro: "Listen, answer, and track your progress.", earSettings: "Session settings",
      earMode: "Exercise", earInterval: "Interval recognition", earChord: "Chord quality", earScale: "Scales and modes",
      earPitch: "Pitch matching", earDictation: "Melodic dictation", earDifficulty: "Difficulty", earEasy: "Easy",
      earMedium: "Medium", earHard: "Hard", earInstrument: "Instrument", earRange: "Root note range",
      earSpeed: "Playback speed", earSlow: "Slow", earNormal: "Normal", earFast: "Fast", earDirection: "Direction",
      earAscending: "Ascending", earDescending: "Descending", earHarmonic: "Harmonic (intervals)", earMixed: "Mixed",
      earAuto: "Auto-advance", earStart: "New question", earReplay: "Replay", earHint: "Reference song",
      earNoHint: "No reference song is available for this interval.", earHintAscending: "Ascending reference",
      earReferenceCaution: "The reference is for an ascending interval; your question may use a different direction.",
      earChoose: "Identify what you hear.", earPitchHelp: "Play the target, adjust your note and check within ±3 cents.",
      earTarget: "Play target", earYourNote: "Play your note", earCheck: "Check", earDeviation: "Deviation",
      earMinusCent: "Lower by one cent", earPlusCent: "Raise by one cent",
      earDictationHelp: "Listen to the tonic chord and melody, then enter the notes. Octaves do not count.",
      earKey: "Key", earEntered: "Your notes", earUndo: "Undo", earClear: "Clear", earSubmit: "Submit",
      earNeedNotes: "Enter the complete melody before submitting.", earCorrect: "Correct!", earWrong: "Not quite.",
      earAnswer: "Answer", earScore: "Score", earStreak: "Streak", earBest: "Best streak",
      earWaiting: "Start a question to begin.", earStorageError: "Progress could not be saved or loaded in this browser.",
      earHalfDiminished7: "Half-diminished seventh", earDiminished7: "Diminished seventh",
      earHarmonicMinor: "Harmonic minor", earMelodicMinor: "Melodic minor (same notes both directions)",
      earPhrygian: "Phrygian", earLydian: "Lydian", earMixolydian: "Mixolydian", earLocrian: "Locrian"
    },
    ru: {
      earTitle: "Развитие слуха", earIntro: "Слушайте, отвечайте и следите за прогрессом.", earSettings: "Настройки занятия",
      earMode: "Упражнение", earInterval: "Распознавание интервалов", earChord: "Тип аккорда", earScale: "Гаммы и лады",
      earPitch: "Сопоставление высоты", earDictation: "Мелодический диктант", earDifficulty: "Сложность", earEasy: "Лёгкая",
      earMedium: "Средняя", earHard: "Сложная", earInstrument: "Инструмент", earRange: "Диапазон тоники",
      earSpeed: "Скорость воспроизведения", earSlow: "Медленно", earNormal: "Обычно", earFast: "Быстро", earDirection: "Направление",
      earAscending: "Восходящее", earDescending: "Нисходящее", earHarmonic: "Одновременно (интервалы)", earMixed: "Смешанное",
      earAuto: "Автопереход", earStart: "Новое задание", earReplay: "Повторить", earHint: "Песня-подсказка",
      earNoHint: "Для этого интервала подсказка-песня недоступна.", earHintAscending: "Восходящий интервал",
      earReferenceCaution: "Песня иллюстрирует восходящий интервал; в задании направление может отличаться.",
      earChoose: "Определите то, что вы слышите.", earPitchHelp: "Прослушайте эталон, настройте свою ноту и проверьте точность до ±3 центов.",
      earTarget: "Слушать эталон", earYourNote: "Слушать свою ноту", earCheck: "Проверить", earDeviation: "Отклонение",
      earMinusCent: "Ниже на один цент", earPlusCent: "Выше на один цент",
      earDictationHelp: "Прослушайте аккорд тоники и мелодию, затем введите ноты. Октавы не учитываются.",
      earKey: "Тональность", earEntered: "Ваши ноты", earUndo: "Отменить", earClear: "Очистить", earSubmit: "Ответить",
      earNeedNotes: "Введите всю мелодию перед проверкой.", earCorrect: "Верно!", earWrong: "Неверно.",
      earAnswer: "Ответ", earScore: "Результат", earStreak: "Серия", earBest: "Лучшая серия",
      earWaiting: "Начните новое задание.", earStorageError: "Не удалось сохранить или загрузить прогресс в этом браузере.",
      earHalfDiminished7: "Полууменьшённый септаккорд", earDiminished7: "Уменьшённый септаккорд",
      earHarmonicMinor: "Гармонический минор", earMelodicMinor: "Мелодический минор (одинаковый в обоих направлениях)",
      earPhrygian: "Фригийский", earLydian: "Лидийский", earMixolydian: "Миксолидийский", earLocrian: "Локрийский"
    },
    kk: {
      earTitle: "Есту қабілетін дамыту", earIntro: "Тыңдаңыз, жауап беріңіз және жетістігіңізді бақылаңыз.", earSettings: "Жаттығу баптаулары",
      earMode: "Жаттығу", earInterval: "Интервалды тану", earChord: "Аккорд түрі", earScale: "Гаммалар мен ладтар",
      earPitch: "Дыбыс биіктігін сәйкестендіру", earDictation: "Әуен диктанты", earDifficulty: "Қиындық", earEasy: "Оңай",
      earMedium: "Орташа", earHard: "Қиын", earInstrument: "Аспап", earRange: "Тоника диапазоны",
      earSpeed: "Ойнату жылдамдығы", earSlow: "Баяу", earNormal: "Қалыпты", earFast: "Жылдам", earDirection: "Бағыт",
      earAscending: "Жоғары", earDescending: "Төмен", earHarmonic: "Бірге (интервалдар)", earMixed: "Аралас",
      earAuto: "Автоматты өту", earStart: "Жаңа тапсырма", earReplay: "Қайталау", earHint: "Ән көмегі",
      earNoHint: "Бұл интервалға арналған ән көмегі жоқ.", earHintAscending: "Жоғары бағыттағы интервал",
      earReferenceCaution: "Ән жоғары интервалды көрсетеді; тапсырма бағыты басқа болуы мүмкін.",
      earChoose: "Естігеніңізді анықтаңыз.", earPitchHelp: "Эталонды тыңдап, нотаңызды ±3 центке дейін баптаңыз.",
      earTarget: "Эталонды тыңдау", earYourNote: "Нотаңызды тыңдау", earCheck: "Тексеру", earDeviation: "Ауытқу",
      earMinusCent: "Бір центке төмен", earPlusCent: "Бір центке жоғары",
      earDictationHelp: "Тоника аккорды мен әуенді тыңдап, ноталарды енгізіңіз. Октавалар есептелмейді.",
      earKey: "Тональдік", earEntered: "Сіздің ноталарыңыз", earUndo: "Болдырмау", earClear: "Тазалау", earSubmit: "Жауап беру",
      earNeedNotes: "Тексеру алдында бүкіл әуенді енгізіңіз.", earCorrect: "Дұрыс!", earWrong: "Қате.",
      earAnswer: "Жауап", earScore: "Нәтиже", earStreak: "Қатар", earBest: "Үздік қатар",
      earWaiting: "Жаңа тапсырманы бастаңыз.", earStorageError: "Бұл браузерде нәтижені сақтау немесе жүктеу мүмкін болмады.",
      earHalfDiminished7: "Жартылай кемітілген септаккорд", earDiminished7: "Кемітілген септаккорд",
      earHarmonicMinor: "Гармониялық минор", earMelodicMinor: "Әуендік минор (екі бағытта бірдей)",
      earPhrygian: "Фригиялық", earLydian: "Лидиялық", earMixolydian: "Миксолидиялық", earLocrian: "Локриялық"
    }
  };
  Object.assign(words.en, {
    earEasy: "Beginner", earMedium: "Intermediate", earHard: "Pro", earStart: "Start new session",
    earProgress: "Question", earYourChoice: "Your choice", earCorrectAnswer: "Correct answer",
    earFormula: "Formula (semitones from root)", earSemitones: "semitones", earStreakBonus: "Streak bonus",
    earHearCorrect: "Hear correct", earHearChoice: "Hear your choice", earNext: "Next question (Enter)",
    earSummary: "Session summary", earAccuracy: "Accuracy", earFocus: "Focus area", earPerfect: "No missed answers",
    earPractice: "Practice weakest area", earNarrower: "The correct interval is narrower.",
    earWider: "The correct interval is wider.", earCompare: "Compare the notes and their distances.",
    earSummaryNext: "Session complete", earPitchFocus: "Pitch matching", earDictationFocus: "Melody in",
    earProgressLabel: "Session progress", earCorrectNotes: "Correct notes", earChoiceNotes: "Your notes",
    earAllTime: "All-time correct"
  });
  Object.assign(words.ru, {
    earEasy: "Начальный", earMedium: "Средний", earHard: "Профи", earStart: "Начать новую сессию",
    earProgress: "Вопрос", earYourChoice: "Ваш ответ", earCorrectAnswer: "Правильный ответ",
    earFormula: "Формула (полутоны от тоники)", earSemitones: "полутонов", earStreakBonus: "Бонус за серию",
    earHearCorrect: "Слушать правильный", earHearChoice: "Слушать ваш ответ", earNext: "Следующий вопрос (Enter)",
    earSummary: "Итоги сессии", earAccuracy: "Точность", earFocus: "Зона внимания", earPerfect: "Ошибок нет",
    earPractice: "Тренировать слабое место", earNarrower: "Правильный интервал уже.",
    earWider: "Правильный интервал шире.", earCompare: "Сравните ноты и расстояния между ними.",
    earSummaryNext: "Сессия завершена", earPitchFocus: "Сопоставление высоты", earDictationFocus: "Мелодия в",
    earProgressLabel: "Прогресс сессии", earCorrectNotes: "Правильные ноты", earChoiceNotes: "Ваши ноты",
    earAllTime: "Всего правильных"
  });
  Object.assign(words.kk, {
    earEasy: "Бастаушы", earMedium: "Орташа", earHard: "Кәсіби", earStart: "Жаңа сессияны бастау",
    earProgress: "Сұрақ", earYourChoice: "Сіздің жауабыңыз", earCorrectAnswer: "Дұрыс жауап",
    earFormula: "Формула (тоникадан жарты тон)", earSemitones: "жарты тон", earStreakBonus: "Қатар бонусы",
    earHearCorrect: "Дұрыс жауапты тыңдау", earHearChoice: "Өз жауабыңызды тыңдау", earNext: "Келесі сұрақ (Enter)",
    earSummary: "Сессия нәтижесі", earAccuracy: "Дәлдік", earFocus: "Назар аударатын тақырып", earPerfect: "Қате жоқ",
    earPractice: "Әлсіз тұсты жаттықтыру", earNarrower: "Дұрыс интервал тарлау.",
    earWider: "Дұрыс интервал кеңірек.", earCompare: "Ноталар мен олардың арақашықтығын салыстырыңыз.",
    earSummaryNext: "Сессия аяқталды", earPitchFocus: "Дыбыс биіктігін сәйкестендіру", earDictationFocus: "Әуен тональдігі",
    earProgressLabel: "Сессия барысы", earCorrectNotes: "Дұрыс ноталар", earChoiceNotes: "Сіздің ноталарыңыз",
    earAllTime: "Барлық дұрыс жауап"
  });
  Object.entries(words).forEach(([language, dictionary]) => Object.assign(translations[language], dictionary));
  /**
   * @template {keyof EarElements} K
   * @param {K} id
   * @returns {EarElements[K]}
   */
  const $ = (id) => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing ear training element: ${id}`);
    return /** @type {EarElements[K]} */ (element);
  };
  const section = $("earSection");
  /** @param {string} value @param {string} label */
  const option = (value, label) => `<option value="${value}" data-i18n="${label}"></option>`;
  section.innerHTML = `
    <div class="section-heading"><div><h2 data-i18n="earTitle"></h2><p data-i18n="earIntro"></p></div></div>
    <div class="ear-layout">
      <div class="panel ear-settings">
        <h3 data-i18n="earSettings"></h3>
        <label><span data-i18n="earMode"></span><select id="earMode">
          ${option("interval", "earInterval")}${option("chord", "earChord")}${option("scale", "earScale")}${option("pitch", "earPitch")}${option("dictation", "earDictation")}</select></label>
        <label><span data-i18n="earDifficulty"></span><select id="earDifficulty">
          ${option("easy", "earEasy")}${option("medium", "earMedium")}${option("hard", "earHard")}</select></label>
        <label><span data-i18n="earInstrument"></span><select id="earInstrument">${option("piano", "piano")}${option("guitar", "guitar")}</select></label>
        <label><span data-i18n="earRange"></span><select id="earRange"><option value="48">C3–B3</option><option value="60">C4–B4</option><option value="72">C5–B5</option></select></label>
        <label><span data-i18n="earSpeed"></span><select id="earSpeed">${option("0.8", "earSlow")}${option("0.5", "earNormal")}${option("0.3", "earFast")}</select></label>
        <label id="earDirectionControl"><span data-i18n="earDirection"></span><select id="earDirection">
          ${option("ascending", "earAscending")}${option("descending", "earDescending")}${option("harmonic", "earHarmonic")}${option("mixed", "earMixed")}</select></label>
        <div id="earStorageStatus" class="status" role="status"></div>
      </div>
      <div class="panel ear-exercise">
        <div class="ear-stats" id="earStats"></div>
        <div><div id="earProgressText"></div><div id="earProgress" class="ear-progress" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0" data-i18n-aria="earProgressLabel"><div id="earProgressBar"></div></div></div>
        <div class="ear-actions"><button type="button" class="button-primary" id="earStart" data-i18n="earStart"></button>
          <button type="button" class="button-secondary" id="earReplay" data-i18n="earReplay"></button>
          <button type="button" class="button-secondary" id="earHintButton" data-i18n="earHint"></button></div>
        <p id="earQuestion" class="ear-question"></p>
        <p id="earHintText" class="ear-hint"></p>
        <div id="earAnswers" class="ear-answers"></div>
        <div id="earPitchControls" class="ear-pitch" hidden>
          <label for="earCents"><span data-i18n="earDeviation"></span>: <output id="earCentsValue"></output></label>
          <input type="range" id="earCents" min="-50" max="50" step="1">
          <div class="ear-actions"><button type="button" class="button-secondary" id="earMinus" data-i18n-aria="earMinusCent">−1</button>
            <button type="button" class="button-secondary" id="earPlus" data-i18n-aria="earPlusCent">+1</button>
            <button type="button" class="button-secondary" id="earTarget" data-i18n="earTarget"></button>
            <button type="button" class="button-secondary" id="earYourNote" data-i18n="earYourNote"></button>
            <button type="button" class="button-primary" id="earCheck" data-i18n="earCheck"></button></div>
        </div>
        <div id="earDictationControls" hidden>
          <p id="earEntered"></p><div id="earKeyboard" class="piano ear-keyboard" role="group" data-i18n-aria="piano"></div>
          <div class="ear-actions"><button type="button" class="button-secondary" id="earUndo" data-i18n="earUndo"></button>
            <button type="button" class="button-secondary" id="earClear" data-i18n="earClear"></button>
            <button type="button" class="button-primary" id="earSubmit" data-i18n="earSubmit"></button></div>
        </div>
        <div id="earFeedback" class="ear-feedback" aria-live="polite"></div>
        <div id="earSummary" class="ear-summary" hidden></div>
        <div id="earAudioStatus" class="status" role="status"></div>
      </div>
    </div>`;
  const modes = ["interval", "chord", "scale", "pitch", "dictation"];
  /** @type {EarSettings} */
  const defaults = { mode: "interval", difficulty: "easy", instrument: "piano", range: "60", speed: "0.5", direction: "mixed", auto: false };
  const allowed = {
    mode: modes, difficulty: ["easy", "medium", "hard"], instrument: ["piano", "guitar"],
    range: ["48", "60", "72"], speed: ["0.8", "0.5", "0.3"], direction: ["ascending", "descending", "harmonic", "mixed"]
  };
  const storageKey = "pitchmate-ear-training-v1";
  const controls = { mode: $("earMode"), difficulty: $("earDifficulty"), instrument: $("earInstrument"),
    range: $("earRange"), speed: $("earSpeed"), direction: $("earDirection") };
  const settingKeys = /** @type {Array<keyof typeof controls>} */ (Object.keys(controls));
  /** @type {EarSettings} */
  let settings = { ...defaults };
  /** @type {Record<string, EarScore>} */
  let stats = {};
  let storageError = false;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (!data || typeof data !== "object" || !data.settings || !data.stats) throw new Error("Invalid ear training storage");
      settingKeys.forEach((key) => {
        if (!allowed[key].includes(data.settings[key])) throw new Error(`Invalid stored setting: ${key}`);
        Object.assign(settings, { [key]: data.settings[key] });
      });
      if (typeof data.settings.auto !== "boolean") throw new Error("Invalid stored auto-advance setting");
      settings.auto = data.settings.auto;
      modes.forEach((mode) => ["easy", "medium", "hard"].forEach((difficulty) => {
        const key = `${mode}:${difficulty}`;
        const item = data.stats[key];
        if (!item) return;
        if (![item.attempts, item.correct, item.streak, item.best].every((n) => Number.isSafeInteger(n) && n >= 0) ||
            item.correct > item.attempts || item.streak > item.correct || item.best > item.correct || item.streak > item.best)
          throw new Error(`Invalid stored score: ${key}`);
        stats[key] = item;
      }));
    }
  } catch (error) {
    console.error("Could not load ear training progress:", error);
    settings = { ...defaults };
    stats = {};
    storageError = true;
  }
  if (settings.mode === "scale" && settings.direction === "harmonic") settings.direction = "ascending";
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ settings, stats }));
      storageError = false;
    } catch (error) {
      console.error("Could not save ear training progress:", error);
      storageError = true;
    }
    $("earStorageStatus").textContent = storageError ? t("earStorageError") : "";
  }
  settingKeys.forEach((key) => { controls[key].value = settings[key]; });
  /** @type {EarQuestion|null} */
  let question = null;
  let answered = false;
  let feedback = "";
  let hint = false;
  /** @type {number[]} */
  let entered = [];
  let session = { count: 0, correct: 0, streak: 0, best: 0, bonus: 0, complete: false };
  /** @type {Record<string, number>} */
  let misses = {};
  let focus = "";
  let selected = "";
  let correctResult = false;
  const names = MusicTheoryEngine.notes;
  /** @type {Record<string, string>} */
  const labelKeys = {
    halfDiminished7: "earHalfDiminished7", diminished7: "earDiminished7", harmonicMinor: "earHarmonicMinor",
    melodicMinor: "earMelodicMinor", phrygian: "earPhrygian", lydian: "earLydian",
    mixolydian: "earMixolydian", locrian: "earLocrian"
  };
  /** @type {Record<number, string|undefined>} */
  const songs = { 1: "Jaws", 2: "Happy Birthday", 3: "Greensleeves", 4: "When the Saints Go Marching In",
    5: "Here Comes the Bride", 7: "Star Wars", 9: "My Bonnie Lies over the Ocean", 12: "Over the Rainbow" };
  /** @param {string} answer */
  const label = (answer) => labelKeys[answer] ? t(labelKeys[answer]) : t(answer);
  const currentStats = () => stats[`${settings.mode}:${settings.difficulty}`] || { attempts: 0, correct: 0, streak: 0, best: 0 };
  /** @param {EarAudioEvent[]} events */
  async function play(events) {
    await playInstrument(settings.instrument, events, $("earAudioStatus"), "ear-training");
  }
  /** @param {EarQuestion} q @param {string} choice @returns {EarAudioEvent[]} */
  function choiceEvents(q, choice) {
    const beat = Number(settings.speed);
    if (q.mode === "interval") {
      const interval = EarTrainingEngine.intervalNames.indexOf(choice);
      if (interval < 0) return [];
      const notes = q.direction === "descending" ? [q.root + interval, q.root] : [q.root, q.root + interval];
      return notes.map((midi, index) => ({ midi, offset: q.direction === "harmonic" ? 0 : index * beat, duration: beat * 0.9, gain: 0.35 }));
    }
    if (q.mode === "chord") {
      const steps = EarTrainingEngine.chords[choice];
      return steps ? steps.map((step) => ({ midi: q.root + step, offset: 0, duration: beat * 2, gain: 0.3 })) : [];
    }
    if (q.mode === "scale") {
      const steps = EarTrainingEngine.scales[choice];
      if (!steps) return [];
      const notes = steps.map((step) => q.root + step);
      if (q.direction === "descending") notes.reverse();
      return notes.map((midi, index) => ({ midi, offset: index * beat, duration: beat * 0.88, gain: 0.55 }));
    }
    if (q.mode === "pitch") return [{ midi: q.root + Number(choice) / 100, offset: 0, duration: 1, gain: 0.65 }];
    return choice.split(",").filter((note) => note !== "").map((note, index) => ({
      midi: q.root + ((Number(note) - q.root % 12 + 12) % 12), offset: index * beat, duration: beat * 0.85, gain: 0.55
    }));
  }
  /** @param {EarQuestion} q @param {string} choice */
  function choiceLabel(q, choice) {
    if (q.mode === "pitch") return `${Number(choice) > 0 ? "+" : ""}${choice} ¢`;
    if (q.mode === "dictation") return choice.split(",").map((note) => names[Number(note)]).join(" · ");
    const steps = q.mode === "interval" ? EarTrainingEngine.intervalNames.indexOf(choice) : -1;
    return steps > 0 ? `${choice} (${steps} ${t("earSemitones")})` : label(choice);
  }
  /** @param {EarQuestion} q @param {string} choice */
  function formula(q, choice) {
    if (q.mode === "interval") return `0, ${EarTrainingEngine.intervalNames.indexOf(choice)}`;
    if (q.mode === "chord") return (EarTrainingEngine.chords[choice] || []).join(", ");
    if (q.mode === "scale") return (EarTrainingEngine.scales[choice] || []).join(", ");
    if (q.mode === "pitch") return choiceLabel(q, choice);
    return choiceLabel(q, choice);
  }
  /** @param {EarQuestion} q */
  function correctChoice(q) {
    return q.mode === "pitch" ? "0" : q.mode === "dictation" ? q.notes.join(",") : q.answer;
  }
  /** @param {EarQuestion} q */
  function correctEvents(q) {
    if (q.mode !== "dictation") return q.events;
    const start = Number(settings.speed) * 2;
    return q.events.slice(3).map((event) => ({ ...event, offset: event.offset - start }));
  }
  /** @param {EarQuestion} q */
  function focusKey(q) {
    return q.mode === "pitch" || q.mode === "dictation" ? String(q.root % 12) : q.answer;
  }
  /** @param {string} key */
  function focusLabel(key) {
    if (settings.mode === "pitch") return `${t("earPitchFocus")}: ${names[Number(key)]}`;
    if (settings.mode === "dictation") return `${t("earDictationFocus")} ${names[Number(key)]}`;
    return settings.mode === "interval" ? `${key} (${EarTrainingEngine.intervalNames.indexOf(key)} ${t("earSemitones")})` : label(key);
  }
  function weakest() {
    return Object.keys(misses).sort((a, b) => misses[b] - misses[a])[0] || "";
  }
  /** @param {HTMLElement} container @param {string} text */
  function appendText(container, text) {
    const item = document.createElement("p");
    item.textContent = text;
    container.appendChild(item);
  }
  /** @param {HTMLElement} container @param {string} title @param {EarAudioEvent[]} events */
  function appendKeyboard(container, title, events) {
    const group = document.createElement("div");
    group.className = "ear-diagnostic-notes";
    const heading = document.createElement("span");
    heading.textContent = title;
    group.appendChild(heading);
    const keyboard = document.createElement("div");
    keyboard.className = "ear-mini-keyboard";
    const pitches = new Set(events.map((event) => MusicTheoryEngine.pitchClass(Math.round(event.midi))));
    names.forEach((name, pitch) => {
      const key = document.createElement("span");
      key.className = `ear-mini-key${name.includes("#") ? " black" : ""}${pitches.has(pitch) ? " active" : ""}`;
      key.textContent = name;
      keyboard.appendChild(key);
    });
    group.appendChild(keyboard);
    container.appendChild(group);
  }
  /** @param {HTMLElement} container @param {string} text @param {() => void} action @param {string} [className] */
  function appendButton(container, text, action, className = "button-secondary") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", action);
    container.appendChild(button);
  }
  function renderFeedback() {
    const card = $("earFeedback");
    card.replaceChildren();
    card.className = "ear-feedback";
    if (!question || !answered) { card.textContent = feedback; return; }
    const q = question;
    card.classList.add("ear-card", correctResult ? "correct" : "wrong");
    appendText(card, correctResult ? t("earCorrect") : t("earWrong"));
    const correct = correctChoice(q);
    const showFormula = q.mode === "interval" || q.mode === "chord" || q.mode === "scale";
    if (!correctResult) appendText(card, `${t("earYourChoice")}: ${choiceLabel(q, selected)}${showFormula ? ` — ${t("earFormula")}: ${formula(q, selected)}` : ""}`);
    appendText(card, `${t("earCorrectAnswer")}: ${choiceLabel(q, correct)}${showFormula ? ` — ${t("earFormula")}: ${formula(q, correct)}` : ""}`);
    if (!correctResult) {
      const chosenStep = EarTrainingEngine.intervalNames.indexOf(selected);
      appendText(card, q.mode === "interval" && chosenStep !== q.interval
        ? t(q.interval < chosenStep ? "earNarrower" : "earWider") : t("earCompare"));
      appendKeyboard(card, t("earCorrectNotes"), correctEvents(q));
      appendKeyboard(card, t("earChoiceNotes"), choiceEvents(q, selected));
      const actions = document.createElement("div");
      actions.className = "ear-actions";
      appendButton(actions, t("earHearCorrect"), () => play(correctEvents(q)));
      appendButton(actions, t("earHearChoice"), () => play(choiceEvents(q, selected)));
      card.appendChild(actions);
    } else {
      appendText(card, `${t("earStreakBonus")}: +${session.streak >= 2 ? 1 : 0}`);
    }
    if (!session.complete) appendButton(card, t("earNext"), nextQuestion, "button-primary");
  }
  function renderSummary() {
    const summary = $("earSummary");
    summary.hidden = !session.complete;
    summary.replaceChildren();
    if (!session.complete) return;
    const title = document.createElement("h3");
    title.textContent = t("earSummary");
    summary.appendChild(title);
    appendText(summary, `${t("earScore")}: ${session.correct + session.bonus} · ${t("earAccuracy")}: ${session.correct * 10}% · ${t("earBest")}: ${session.best}`);
    const key = weakest();
    appendText(summary, `${t("earFocus")}: ${key ? focusLabel(key) : t("earPerfect")}`);
    if (key) appendButton(summary, t("earPractice"), () => beginSession(key), "button-primary");
  }
  function render() {
    $("earStats").textContent = "";
    const total = currentStats();
    [`${t("earScore")}: ${session.correct + session.bonus}`, `${t("earStreak")}: ${session.streak}`, `${t("earBest")}: ${session.best}`,
      `${t("earAllTime")}: ${total.correct}/${total.attempts}`].forEach((text) => {
      const span = document.createElement("span");
      span.textContent = text;
      $("earStats").appendChild(span);
    });
    $("earStorageStatus").textContent = storageError ? t("earStorageError") : "";
    $("earProgressText").textContent = `${t("earProgress")} ${question ? Math.min(session.count + (answered ? 0 : 1), 10) : 0} / 10`;
    $("earProgress").setAttribute("aria-valuenow", String(session.count));
    $("earProgressBar").style.width = `${session.count * 10}%`;
    $("earReplay").disabled = !question || session.complete;
    $("earDirectionControl").hidden = !["interval", "scale"].includes(settings.mode);
    const harmonicOption = controls.direction.querySelector('option[value="harmonic"]');
    if (harmonicOption instanceof HTMLOptionElement) harmonicOption.disabled = settings.mode === "scale";
    $("earHintButton").hidden = !question || question.mode !== "interval";
    $("earPitchControls").hidden = !question || question.mode !== "pitch";
    $("earDictationControls").hidden = !question || question.mode !== "dictation";
    $("earHintText").textContent = hint && question && question.mode === "interval"
      ? songs[question.interval] ? `${t("earHintAscending")}: ${songs[question.interval]}. ${t("earReferenceCaution")}` : t("earNoHint") : "";
    const questionText = !question ? t("earWaiting") : question.mode === "pitch" ? t("earPitchHelp") :
      question.mode === "dictation" ? `${t("earDictationHelp")} ${t("earKey")}: ${names[question.root % 12]} ${t("major")}.` : t("earChoose");
    $("earQuestion").textContent = questionText;
    $("earAnswers").textContent = "";
    const activeQuestion = question;
    if (activeQuestion && ["interval", "chord", "scale"].includes(activeQuestion.mode)) {
      activeQuestion.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button-secondary";
        button.textContent = label(choice);
        button.disabled = answered;
        if (answered && choice === activeQuestion.answer) button.classList.add("correct");
        if (answered && !correctResult && choice === selected) button.classList.add("wrong");
        button.addEventListener("click", () => grade(choice === activeQuestion.answer, choice));
        $("earAnswers").appendChild(button);
      });
    }
    renderFeedback();
    renderSummary();
    $("earCentsValue").textContent = `${Number($("earCents").value) > 0 ? "+" : ""}${$("earCents").value} ¢`;
    $("earCheck").disabled = answered;
    $("earEntered").textContent = `${t("earEntered")}: ${entered.map((note) => names[note]).join(" · ") || "—"} (${entered.length}/${question && question.mode === "dictation" ? question.notes.length : 0})`;
    $("earKeyboard").querySelectorAll("button").forEach((button) => { button.disabled = answered; });
    $("earUndo").disabled = answered;
    $("earClear").disabled = answered;
    $("earSubmit").disabled = answered;
  }
  /** @param {string} [practiceFocus] */
  function beginSession(practiceFocus = "") {
    session = { count: 0, correct: 0, streak: 0, best: 0, bonus: 0, complete: false };
    misses = {};
    focus = practiceFocus;
    question = null;
    nextQuestion();
  }
  function nextQuestion() {
    if (session.complete || (question && !answered)) return;
    stopInstrumentChannel("ear-training");
    question = EarTrainingEngine.create(settings.mode, settings.difficulty, Number(settings.range), Number(settings.range) + 11, Number(settings.speed), settings.direction, Math.random, focus);
    answered = false;
    entered = [];
    feedback = "";
    hint = false;
    $("earCents").value = String(question.initialCents);
    render();
    const animated = [$("earQuestion"), $("earAnswers"), $("earPitchControls"), $("earDictationControls")];
    animated.forEach((element) => element.classList.remove("ear-enter"));
    void $("earQuestion").offsetWidth;
    animated.forEach((element) => element.classList.add("ear-enter"));
    play(question.events);
  }
  /** @param {boolean} correct @param {string} choice */
  function grade(correct, choice) {
    if (!question || answered) return;
    answered = true;
    selected = choice;
    correctResult = correct;
    session.count++;
    if (correct) { session.correct++; session.streak++; if (session.streak >= 2) session.bonus++; session.best = Math.max(session.best, session.streak); }
    else { session.streak = 0; const key = focusKey(question); misses[key] = (misses[key] || 0) + 1; }
    stats[`${settings.mode}:${settings.difficulty}`] = EarTrainingEngine.updateScore(currentStats(), correct);
    save();
    if (session.count === 10) {
      session.complete = true;
      window.trackEvent("ear_training_complete", { mode: settings.mode, difficulty: settings.difficulty, score: session.correct + session.bonus, accuracy: session.correct * 10 });
    }
    render();
    play([{ midi: correct ? 76 : 60, offset: 0, duration: 0.25, gain: 0.35 }]);
  }
  settingKeys.forEach((key) => {
    controls[key].addEventListener("change", () => {
      if (!allowed[key].includes(controls[key].value)) throw new Error(`Invalid ear training setting: ${key}`);
      Object.assign(settings, { [key]: controls[key].value });
      if (settings.mode === "scale" && settings.direction === "harmonic") {
        settings.direction = "ascending";
        controls.direction.value = settings.direction;
      }
      stopInstrumentChannel("ear-training");
      question = null; answered = false; feedback = ""; hint = false; entered = [];
      session = { count: 0, correct: 0, streak: 0, best: 0, bonus: 0, complete: false };
      misses = {}; focus = "";
      save(); render();
    });
  });
  $("earStart").addEventListener("click", () => beginSession());
  $("earReplay").addEventListener("click", () => { if (question) play(question.events); });
  $("earHintButton").addEventListener("click", () => { hint = true; render(); });
  $("earCents").addEventListener("input", render);
  [-1, 1].forEach((delta) => $(`ear${delta < 0 ? "Minus" : "Plus"}`).addEventListener("click", () => {
    $("earCents").value = String(Math.max(-50, Math.min(50, Number($("earCents").value) + delta)));
    render();
  }));
  $("earTarget").addEventListener("click", () => { if (question) play(question.events); });
  $("earYourNote").addEventListener("click", () => {
    if (question) play([{ midi: question.root + Number($("earCents").value) / 100, offset: 0, duration: 1, gain: 0.65 }]);
  });
  $("earCheck").addEventListener("click", () => grade(Math.abs(Number($("earCents").value)) <= 3, $("earCents").value));
  names.forEach((name, pitchClass) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `piano-key ${name.includes("#") ? "black-key" : "white-key"}`;
    button.textContent = name;
    button.addEventListener("click", () => {
      if (!question || answered || entered.length >= question.notes.length) return;
      entered.push(pitchClass);
      const midi = question.root + ((pitchClass - question.root % 12 + 12) % 12);
      play([{ midi, offset: 0, duration: 0.35, gain: 0.55 }]);
      render();
    });
    $("earKeyboard").appendChild(button);
  });
  $("earUndo").addEventListener("click", () => { entered.pop(); feedback = ""; render(); });
  $("earClear").addEventListener("click", () => { entered = []; feedback = ""; render(); });
  $("earSubmit").addEventListener("click", () => {
    if (!question) return;
    if (entered.length !== question.notes.length) { feedback = t("earNeedNotes"); render(); return; }
    const notes = question.notes;
    grade(EarTrainingEngine.matchesMelody(notes, entered), entered.join(","));
  });
  document.querySelectorAll(".nav-button").forEach((button) => button.addEventListener("click", () => {
    if (!(button instanceof HTMLButtonElement)) return;
    if (button.dataset.section !== "earSection") stopInstrumentChannel("ear-training");
  }));
  languageSelect.addEventListener("change", () => {
    if (!answered && feedback) feedback = t("earNeedNotes");
    render();
  });
  document.addEventListener("keydown", (event) => {
    if (!section.classList.contains("active") || event.repeat || event.ctrlKey || event.altKey || event.metaKey ||
        event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLElement && event.target.isContentEditable)) return;
    if (event.code === "Space" && question && !session.complete) {
      event.preventDefault();
      play(question.events);
    } else if (/^[1-9]$/.test(event.key) && question && !answered) {
      const buttons = $("earAnswers").querySelectorAll("button");
      const button = buttons[Number(event.key) - 1];
      if (button) { event.preventDefault(); button.click(); }
    } else if (event.key === "Enter" && answered && !session.complete) {
      event.preventDefault();
      nextQuestion();
    }
  });
  applyTranslations();
  render();
})();
