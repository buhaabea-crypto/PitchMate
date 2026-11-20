(() => {
  const engine = MusicTheoryEngine;
  const words = {
    ru: {
      chromaticTitle: "Хроматический круг аккордов", chromaticHelp: "Выберите тонику и тип аккорда или нажмите на ноту круга.",
      chordType: "Тип аккорда", diminished: "Уменьшённый", augmented: "Увеличенный",
      major7: "Мажорный септаккорд", minor7: "Минорный септаккорд", dominant7: "Доминантсептаккорд",
      listenChord: "Прослушать аккорд", fretboardTitle: "Интерактивный гитарный гриф",
      fretboardHelp: "Выберите строй и режим. Нажмите на позицию, чтобы услышать ноту.",
      tuning: "Строй", fretMode: "Режим грифа", explore: "Исследование нот", scales: "Гаммы и лады",
      voicings: "Аппликатуры аккордов", naturalMinor: "Натуральный минор",
      minorPentatonic: "Минорная пентатоника", majorPentatonic: "Мажорная пентатоника", dorian: "Дорийский",
      previous: "Предыдущая", next: "Следующая", position: "Вариант", openPosition: "Открытая позиция",
      movablePosition: "Позиция на грифе", barrePosition: "Баррэ", noVoicing: "Для этого аккорда и строя аппликатура не найдена.",
      audioUnavailable: "Web Audio API недоступен в этом браузере.", audioFailed: "Не удалось воспроизвести звук.", fret: "Лад", string: "Струна",
      standard: "Стандартный E", dropD: "Drop D", dropB: "Drop B", openG: "Open G"
    },
    en: {
      chromaticTitle: "Chromatic chord circle", chromaticHelp: "Choose a root and chord type, or select a note on the circle.",
      chordType: "Chord type", diminished: "Diminished", augmented: "Augmented",
      major7: "Major seventh", minor7: "Minor seventh", dominant7: "Dominant seventh",
      listenChord: "Listen to chord", fretboardTitle: "Interactive guitar fretboard",
      fretboardHelp: "Choose a tuning and mode. Select a position to hear its note.",
      tuning: "Tuning", fretMode: "Fretboard mode", explore: "Explore notes", scales: "Scales and modes",
      voicings: "Chord voicings", naturalMinor: "Natural minor",
      minorPentatonic: "Minor pentatonic", majorPentatonic: "Major pentatonic", dorian: "Dorian",
      previous: "Previous", next: "Next", position: "Variation", openPosition: "Open position",
      movablePosition: "Fretted position", barrePosition: "Barre", noVoicing: "No voicing found for this chord and tuning.",
      audioUnavailable: "Web Audio API is not available in this browser.", audioFailed: "Could not play audio.", fret: "Fret", string: "String",
      standard: "Standard E", dropD: "Drop D", dropB: "Drop B", openG: "Open G"
    },
    kk: {
      chromaticTitle: "Хроматикалық аккорд шеңбері", chromaticHelp: "Тоника мен аккорд түрін таңдаңыз немесе шеңбердегі нотаны басыңыз.",
      chordType: "Аккорд түрі", diminished: "Кемітілген", augmented: "Ұлғайтылған",
      major7: "Мажор септаккорд", minor7: "Минор септаккорд", dominant7: "Доминантсептаккорд",
      listenChord: "Аккордты тыңдау", fretboardTitle: "Интерактивті гитара грифі",
      fretboardHelp: "Бұрау мен режимді таңдаңыз. Нотаны есту үшін позицияны басыңыз.",
      tuning: "Бұрау", fretMode: "Гриф режимі", explore: "Ноталарды зерттеу", scales: "Гаммалар мен ладтар",
      voicings: "Аккорд аппликатуралары", naturalMinor: "Табиғи минор",
      minorPentatonic: "Минор пентатоникасы", majorPentatonic: "Мажор пентатоникасы", dorian: "Дорийлік",
      previous: "Алдыңғы", next: "Келесі", position: "Нұсқа", openPosition: "Ашық позиция",
      movablePosition: "Грифтегі позиция", barrePosition: "Баррэ", noVoicing: "Бұл аккорд пен бұрау үшін аппликатура табылмады.",
      audioUnavailable: "Бұл браузерде Web Audio API қолжетімсіз.", audioFailed: "Дыбысты ойнату мүмкін болмады.", fret: "Лад", string: "Ішек",
      standard: "Стандартты E", dropD: "Drop D", dropB: "Drop B", openG: "Open G"
    }
  };
  Object.keys(words).forEach((language) => Object.assign(translations[language], words[language]));

  const noteOptions = engine.notes.map((note, index) => `<option value="${index}">${note}</option>`).join("");
  const options = (keys) => keys.map((key) => `<option value="${key}" data-i18n="${key}"></option>`).join("");
  const chordOptions = options(Object.keys(engine.chords));
  const tuningOptions = options(Object.keys(engine.tunings));
  const circle = document.getElementById("chromaticModule");
  const guitar = document.getElementById("fretboardModule");
  circle.innerHTML = `
    <h3 data-i18n="chromaticTitle"></h3><p data-i18n="chromaticHelp"></p>
    <div class="module-controls">
      <label><span data-i18n="tonic"></span><select id="circleRoot">${noteOptions}</select></label>
      <label><span data-i18n="chordType"></span><select id="circleType">${chordOptions}</select></label>
      <button type="button" class="button-primary" id="circlePlay" data-i18n="listenChord"></button>
    </div>
    <div class="chromatic-layout"><svg id="circleSvg" class="chromatic-circle" viewBox="0 0 520 520" role="group" data-i18n-aria="chromaticTitle"></svg>
      <div id="circlePiano" class="piano chromatic-piano"></div></div>
    <div class="status module-status" id="circleStatus" aria-live="polite"></div>`;
  guitar.innerHTML = `
    <h3 data-i18n="fretboardTitle"></h3><p data-i18n="fretboardHelp"></p>
    <div class="module-controls">
      <label><span data-i18n="tuning"></span><select id="fretTuning">${tuningOptions}</select></label>
      <label><span data-i18n="fretMode"></span><select id="fretMode">${options(["explore", "scales", "voicings"])}</select></label>
      <label id="fretRootControl"><span data-i18n="tonic"></span><select id="fretRoot">${noteOptions}</select></label>
      <label id="fretScaleControl"><span data-i18n="mode"></span><select id="fretScale">${options(Object.keys(engine.scales))}</select></label>
      <label id="fretChordControl"><span data-i18n="chordType"></span><select id="fretChord">${chordOptions}</select></label>
    </div>
    <div id="theoryFretboard"></div><div class="status module-status" id="fretStatus" aria-live="polite"></div>`;

  const $ = (id) => document.getElementById(id);
  const circleRoot = $("circleRoot");
  const circleType = $("circleType");
  const fretTuning = $("fretTuning");
  const fretMode = $("fretMode");
  const fretRoot = $("fretRoot");
  const fretScale = $("fretScale");
  const fretChord = $("fretChord");
  let selectedPitch = null;
  let theoryPosition = 0;
  let generatorPosition = 0;
  let generatorTuning = "standard";
  let lastGeneratorChord = "";
  const voicingCache = new Map();

  function synth(midis, arpeggio, status, instrument = "piano") {
    const events = midis.map((midi, index) => ({
      midi, offset: arpeggio ? index * 0.22 : 0,
      duration: arpeggio ? 0.45 : 0.9, gain: 0.7 / Math.sqrt(midis.length)
    }));
    if (arpeggio) {
      events.push(...midis.map((midi) => ({
        midi, offset: midis.length * 0.22 + 0.12, duration: 1.1, gain: 0.7 / Math.sqrt(midis.length)
      })));
    }
    return playInstrument(instrument, events, status);
  }

  const svgNS = "http://www.w3.org/2000/svg";
  function svgElement(tag, attributes, text) {
    const element = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function point(index, radius) {
    const angle = index * Math.PI / 6 - Math.PI / 2;
    return [260 + radius * Math.cos(angle), 260 + radius * Math.sin(angle)];
  }
  function circleMidis() {
    return engine.chords[circleType.value].intervals.map((interval) => 60 + Number(circleRoot.value) + interval);
  }
  const circleSvg = $("circleSvg");
  const circlePiano = $("circlePiano");
  const reduceCircleMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let circleFrame = null;
  let circleGeometry = null;
  let lastCircleChord = "";
  const defs = svgElement("defs", {});
  const marker = svgElement("marker", { id: "circleArrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  marker.appendChild(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 Z", fill: "var(--good)" }));
  defs.appendChild(marker);
  circleSvg.appendChild(defs);
  circleSvg.appendChild(svgElement("circle", { cx: 260, cy: 260, r: 165, class: "orbit" }));
  const polygon = svgElement("polygon", { class: "polygon" });
  circleSvg.appendChild(polygon);
  const circleArcs = Array.from({ length: 3 }, () => {
    const group = svgElement("g", {});
    const path = svgElement("path", { class: "interval-arc", "marker-end": "url(#circleArrow)" });
    const label = svgElement("text", { class: "interval-label" });
    group.append(path, label);
    circleSvg.appendChild(group);
    return { group, path, label };
  });
  const centerName = svgElement("text", { x: 260, y: 259, class: "center-name" });
  const centerDescription = svgElement("text", { x: 260, y: 280, class: "center-description" });
  circleSvg.append(centerName, centerDescription);
  const circleNodes = engine.notes.map((note, index) => {
    const [x, y] = point(index, 165);
    const node = svgElement("g", { class: "node", role: "button", tabindex: 0 });
    const syllable = svgElement("text", { x, y: y + 12, class: "syllable" });
    node.append(svgElement("circle", { cx: x, cy: y, r: 22 }), svgElement("text", { x, y: y - 1 }, note), syllable);
    const select = () => {
      circleRoot.value = String(index);
      renderCircle();
      synth(circleMidis(), false, $("circleStatus"));
    };
    node.addEventListener("click", select);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
    circleSvg.appendChild(node);
    return { node, syllable };
  });
  const circleKeys = engine.notes.map((note, index) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = `piano-key ${note.includes("#") ? "black-key" : "white-key"}`;
    key.textContent = note;
    key.setAttribute("aria-label", note);
    key.addEventListener("click", () => synth([60 + index], false, $("circleStatus")));
    circlePiano.appendChild(key);
    return key;
  });
  function updateCircleText(element, text) {
    if (element.textContent === text) return;
    element.textContent = text;
    if (!reduceCircleMotion.matches && typeof element.animate === "function") {
      element.getAnimations().forEach((animation) => animation.cancel());
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: "ease-out" });
    }
  }
  function drawCircleGeometry(geometry) {
    polygon.setAttribute("points", geometry.vertices.map((vertex) => vertex.join(",")).join(" "));
    geometry.arcs.forEach((arc, index) => {
      const start = point(arc.start, 207);
      const end = point(arc.start + arc.distance, 207);
      const middle = point(arc.start + arc.distance / 2, 222);
      const elements = circleArcs[index];
      elements.group.setAttribute("opacity", String(arc.opacity));
      elements.path.setAttribute("d", `M ${start.join(" ")} A 207 207 0 0 1 ${end.join(" ")}`);
      elements.label.setAttribute("x", middle[0]);
      elements.label.setAttribute("y", middle[1] + 4);
    });
  }
  function transitionCircle(target) {
    if (circleFrame !== null) cancelAnimationFrame(circleFrame);
    circleFrame = null;
    if (!circleGeometry || reduceCircleMotion.matches) {
      circleGeometry = target;
      drawCircleGeometry(target);
      return;
    }
    const from = circleGeometry;
    target.arcs.forEach((arc, index) => {
      arc.start += 12 * Math.round((from.arcs[index].start - arc.start) / 12);
    });
    const startTime = performance.now();
    const interpolate = (a, b, progress) => a + (b - a) * progress;
    function frame(now) {
      const progress = Math.min(1, Math.max(0, (now - startTime) / 420));
      const eased = 1 - Math.pow(1 - progress, 3);
      circleGeometry = {
        vertices: from.vertices.map((vertex, index) => vertex.map((value, axis) => interpolate(value, target.vertices[index][axis], eased))),
        arcs: from.arcs.map((arc, index) => ({
          start: interpolate(arc.start, target.arcs[index].start, eased),
          distance: interpolate(arc.distance, target.arcs[index].distance, eased),
          opacity: interpolate(arc.opacity, target.arcs[index].opacity, eased)
        }))
      };
      drawCircleGeometry(circleGeometry);
      circleFrame = progress < 1 ? requestAnimationFrame(frame) : null;
    }
    circleFrame = requestAnimationFrame(frame);
  }
  function renderCircle() {
    const root = Number(circleRoot.value);
    const type = circleType.value;
    const intervals = engine.chords[type].intervals;
    const active = engine.chordNotes(root, type);
    const syllables = currentLanguage === "en"
      ? ["do", "do#", "re", "re#", "mi", "fa", "fa#", "sol", "sol#", "la", "la#", "ti"]
      : ["до", "до#", "ре", "ре#", "ми", "фа", "фа#", "соль", "соль#", "ля", "ля#", "си"];
    const vertices = active.map((note) => point(note, 165));
    while (vertices.length < 4) vertices.push([...vertices[vertices.length - 1]]);
    const arcs = circleArcs.map(({ group, label }, index) => {
      const exists = index < intervals.length - 1;
      const start = root + (exists ? intervals[index] : intervals[intervals.length - 1]);
      const distance = exists ? intervals[index + 1] - intervals[index] : 0;
      group.setAttribute("aria-hidden", String(!exists));
      if (exists) updateCircleText(label, `+${distance}`);
      return { start, distance, opacity: exists ? 1 : 0 };
    });
    const chord = `${root}:${type}`;
    if (chord !== lastCircleChord || (reduceCircleMotion.matches && circleFrame !== null)) {
      transitionCircle({ vertices, arcs });
      lastCircleChord = chord;
    }
    updateCircleText(centerName, engine.notes[root] + engine.chords[type].suffix);
    updateCircleText(centerDescription, `${syllables[root].toUpperCase()} ${t(type).toUpperCase()}`);
    circleNodes.forEach(({ node, syllable }, index) => {
      node.classList.toggle("active", active.includes(index));
      node.setAttribute("aria-label", `${engine.notes[index]} ${syllables[index]}`);
      node.setAttribute("aria-pressed", String(index === root));
      syllable.textContent = syllables[index];
      circleKeys[index].classList.toggle("active", active.includes(index));
    });
  }
  reduceCircleMotion.addEventListener("change", () => {
    if (reduceCircleMotion.matches) {
      [centerName, centerDescription, ...circleArcs.map(({ label }) => label)].forEach((element) => {
        element.getAnimations().forEach((animation) => animation.cancel());
      });
    }
    renderCircle();
  });

  function findVoicings(root, type, tuning) {
    const cacheKey = `${root}:${type}:${tuning}`;
    if (voicingCache.has(cacheKey)) return voicingCache.get(cacheKey);
    const pitches = engine.chordNotes(root, type);
    const strings = engine.tunings[tuning];
    const candidates = [];
    function search(index, frets) {
      if (index === strings.length) {
        const sounding = frets.map((fret, i) => fret < 0 ? null : engine.stringNote(strings[i], fret)).filter((midi) => midi !== null);
        if (sounding.length < Math.max(3, pitches.length) || new Set(sounding.map((midi) => engine.pitchClass(midi))).size !== pitches.length) return;
        if (engine.pitchClass(Math.min(...sounding)) !== root) return;
        const first = frets.findIndex((fret) => fret >= 0);
        const last = frets.length - 1 - [...frets].reverse().findIndex((fret) => fret >= 0);
        if (frets.slice(first, last + 1).includes(-1)) return;
        const pressed = frets.filter((fret) => fret > 0);
        const min = pressed.length ? Math.min(...pressed) : 0;
        const max = pressed.length ? Math.max(...pressed) : 0;
        if (max - min > 3) return;
        const open = frets.includes(0);
        if (open && max > 4) return;
        const barreIndexes = frets.map((fret, i) => fret === min && fret > 0 ? i : -1).filter((i) => i >= 0);
        const barre = barreIndexes.length > 1 && !frets.slice(barreIndexes[0], barreIndexes[barreIndexes.length - 1] + 1).some((fret) => fret === 0);
        const fingers = pressed.length - (barre ? barreIndexes.length - 1 : 0);
        if (fingers > 4) return;
        const score = (open ? 0 : 100) + (barre ? 0 : 8) + min * 3 + (max - min) * 4 + (6 - sounding.length) * 6;
        candidates.push({ frets: [...frets], open, barre, min, score });
        return;
      }
      frets.push(-1);
      search(index + 1, frets);
      frets.pop();
      for (let fret = 0; fret <= 12; fret++) {
        if (!pitches.includes(engine.pitchClass(strings[index] + fret))) continue;
        const pressed = frets.filter((value) => value > 0);
        if (fret > 0 && pressed.length && Math.max(...pressed, fret) - Math.min(...pressed, fret) > 3) continue;
        frets.push(fret);
        search(index + 1, frets);
        frets.pop();
      }
    }
    search(0, []);
    candidates.sort((a, b) => a.score - b.score);
    const result = [];
    const seenPositions = new Set();
    candidates.forEach((candidate) => {
      const key = candidate.open ? "open" : String(candidate.min);
      if (!seenPositions.has(key)) {
        seenPositions.add(key);
        result.push(candidate);
      }
    });
    voicingCache.set(cacheKey, result);
    return result;
  }

  function renderFretboard(container, config) {
    container.replaceChildren();
    const tuning = engine.tunings[config.tuning];
    const voicings = config.mode === "voicings" ? findVoicings(config.root, config.type, config.tuning) : [];
    const position = Math.min(config.position || 0, Math.max(0, voicings.length - 1));
    const voicing = voicings[position];
    const scroll = document.createElement("div");
    scroll.className = "fret-scroll";
    const grid = document.createElement("div");
    grid.className = "fret-grid";
    grid.appendChild(document.createElement("span"));
    for (let fret = 0; fret <= 12; fret++) {
      const label = document.createElement("span");
      label.className = `fret-heading${[3, 5, 7, 9, 12].includes(fret) ? " inlay" : ""}`;
      label.textContent = `${fret}${[3, 5, 7, 9].includes(fret) ? " •" : fret === 12 ? " ••" : ""}`;
      grid.appendChild(label);
    }
    tuning.forEach((openMidi, stringIndex) => {
      const label = document.createElement("span");
      label.className = "fret-string";
      label.textContent = engine.noteName(openMidi);
      grid.appendChild(label);
      for (let fret = 0; fret <= 12; fret++) {
        const midi = engine.stringNote(openMidi, fret);
        const pitch = engine.pitchClass(midi);
        const isExplore = config.mode === "explore";
        const cell = document.createElement(isExplore ? "button" : "div");
        cell.className = `fret-cell${fret === 0 ? " open" : ""}`;
        if (isExplore) {
          cell.type = "button";
          cell.setAttribute("aria-label", `${t("string")} ${stringIndex + 1}, ${t("fret")} ${fret}: ${engine.noteName(midi)}`);
          cell.addEventListener("click", () => {
            selectedPitch = pitch;
            synth([midi], false, $("fretStatus"), "guitar");
            renderTheoryFretboard();
            $("theoryFretboard").querySelectorAll("button.fret-cell")[stringIndex * 13 + fret].focus();
          });
        }
        let text = "";
        let markerClass = "";
        if (isExplore && pitch === selectedPitch) {
          text = engine.noteName(midi);
          markerClass = "selected";
        } else if (config.mode === "scales" && engine.scales[config.scale].includes(engine.pitchClass(pitch - config.root))) {
          text = engine.notes[pitch];
          markerClass = pitch === config.root ? "root" : "";
        } else if (voicing && fret === 0 && voicing.frets[stringIndex] <= 0) {
          text = voicing.frets[stringIndex] === 0 ? "O" : "X";
          markerClass = text === "X" ? "muted" : pitch === config.root ? "root" : "";
        } else if (voicing && fret > 0 && voicing.frets[stringIndex] === fret) {
          text = engine.notes[pitch];
          markerClass = pitch === config.root ? "root" : "";
        }
        if (text) {
          const marker = document.createElement("span");
          marker.className = `fret-marker ${markerClass}`;
          marker.textContent = text;
          cell.appendChild(marker);
        }
        grid.appendChild(cell);
      }
    });
    scroll.appendChild(grid);
    container.appendChild(scroll);
    if (config.mode === "voicings") {
      const controls = document.createElement("div");
      controls.className = "fret-position-controls";
      const description = document.createElement("span");
      description.className = "status";
      description.textContent = voicing
        ? `${t("position")} ${position + 1}/${voicings.length} · ${t(voicing.open ? "openPosition" : voicing.barre ? "barrePosition" : "movablePosition")}${voicing.barre ? ` · ${t("fret")} ${voicing.min}` : ""}`
        : t("noVoicing");
      controls.appendChild(description);
      [-1, 1].forEach((direction) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button-secondary";
        button.textContent = t(direction < 0 ? "previous" : "next");
        button.disabled = voicings.length < 2;
        button.addEventListener("click", () => config.onPosition((position + direction + voicings.length) % voicings.length));
        controls.appendChild(button);
      });
      container.appendChild(controls);
    }
  }

  function renderTheoryFretboard() {
    $("fretRootControl").hidden = fretMode.value === "explore";
    $("fretScaleControl").hidden = fretMode.value !== "scales";
    $("fretChordControl").hidden = fretMode.value !== "voicings";
    renderFretboard($("theoryFretboard"), {
      tuning: fretTuning.value, mode: fretMode.value, root: Number(fretRoot.value),
      scale: fretScale.value, type: fretChord.value, position: theoryPosition,
      onPosition: (position) => { theoryPosition = position; renderTheoryFretboard(); }
    });
  }

  function renderGeneratorGuitar(container, chordName) {
    const match = /^([A-G]#?)(m)?$/.exec(chordName);
    if (!match) {
      container.textContent = `${t("noVoicing")} ${chordName}`;
      return;
    }
    if (lastGeneratorChord !== chordName) {
      generatorPosition = 0;
      lastGeneratorChord = chordName;
    }
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    const controls = document.createElement("div");
    controls.className = "module-controls";
    const label = document.createElement("label");
    const caption = document.createElement("span");
    caption.textContent = t("tuning");
    const select = document.createElement("select");
    Object.keys(engine.tunings).forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = t(key);
      select.appendChild(option);
    });
    select.value = generatorTuning;
    select.addEventListener("change", () => {
      generatorTuning = select.value;
      generatorPosition = 0;
      renderGeneratorBoard();
    });
    label.append(caption, select);
    controls.appendChild(label);
    wrapper.appendChild(controls);
    const board = document.createElement("div");
    renderFretboard(board, {
      tuning: generatorTuning, mode: "voicings", root: engine.notes.indexOf(match[1]),
      type: match[2] ? "minor" : "major", position: generatorPosition,
      onPosition: (position) => { generatorPosition = position; renderGeneratorBoard(); }
    });
    wrapper.appendChild(board);
    container.appendChild(wrapper);
  }

  circleRoot.addEventListener("change", renderCircle);
  circleType.addEventListener("change", renderCircle);
  $("circlePlay").addEventListener("click", () => synth(circleMidis(), true, $("circleStatus")));
  [fretTuning, fretMode, fretRoot, fretScale, fretChord].forEach((control) => control.addEventListener("change", () => {
    theoryPosition = 0;
    renderTheoryFretboard();
  }));
  languageSelect.addEventListener("change", () => {
    renderCircle();
    renderTheoryFretboard();
    renderGeneratorBoard();
  });
  window.PitchMateModules = { renderGeneratorGuitar };
  applyTranslations();
  renderCircle();
  renderTheoryFretboard();
})();
