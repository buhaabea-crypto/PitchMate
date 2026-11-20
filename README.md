# PitchMate

Open `index.html` in a browser with Web Audio support.

The tuner uses YIN with a noise gate and median filtering. Choose Chromatic or
a guitar tuning to target the nearest open string; its buttons play reference
tones. Gain and needle smoothness are separate controls. A note turns green
after it remains within three cents for 400 ms. The A4 setting applies to
pitch detection and reference tones.

The interactive piano, chord circle and guitar use local recordings from
[Meta Open Sound](https://github.com/facebookincubator/Meta-open-sound)
([CC0 1.0](https://github.com/facebookincubator/Meta-open-sound/blob/main/LICENSE)).
The progression player follows its selected piano or guitar view. Samples are
embedded for offline use and transposed to follow the selected A4 reference.

In Theory, the chromatic circle builds chords from a selected root and type;
select a note or use the listen button to hear it. The guitar fretboard offers
note exploration, scales and chord voicings in four tunings. In the progression
generator, select a chord and switch to Guitar to browse its voicings; `O`
means an open string and `X` a muted string. The fretboard scrolls horizontally
on small screens. Audio follows the tuner's A4 reference.

Ear Training offers interval, chord quality, scale/mode, pitch-matching and
melodic-dictation exercises in ten-question sessions. Choose difficulty,
instrument, root range, speed and direction. Review the diagnostic card before
advancing; use Space to replay, 1–9 to answer, and Enter for the next question.
Each correct answer scores one point, plus one bonus point when the streak is
at least two. The summary offers practice on the most frequently missed area.
Pitch matching starts from a hidden detuning. The slider shows the adjustment
from that starting pitch, not the deviation from the target; compare the two
playback buttons by ear. The check accepts deviations within three cents and
reveals the deviation afterward. Dictation begins with a major tonic chord and checks pitch classes rather
than octaves. Melodic minor uses the ascending form in both directions so it
remains distinguishable from natural minor. Scores and streaks are tracked per
exercise and difficulty, and saved with settings in browser localStorage.
Playback uses the selected instrument and the tuner's A4 reference.

The GA4 tag uses the placeholder measurement ID `G-XXXXXXXXXX`; replace it
with your own ID to collect analytics.

Run the checks with `node --test tests\music-theory.test.js tests\pitch-detector.test.js tests\instrument-player.test.js tests\ear-training.test.js`.
