class YinPitchDetector {
  constructor({ minFrequency = 15, maxFrequency = 8000, threshold = 0.12, noiseGate = 0.008 } = {}) {
    this.minFrequency = minFrequency;
    this.maxFrequency = maxFrequency;
    this.threshold = threshold;
    this.noiseGate = noiseGate;
    this.normalized = new Float64Array(0);
  }

  detect(samples, sampleRate) {
    let sum = 0;
    let power = 0;
    for (const sample of samples) {
      sum += sample;
      power += sample * sample;
    }
    const mean = sum / samples.length;
    const rms = Math.sqrt(Math.max(0, power / samples.length - mean * mean));
    if (rms < this.noiseGate) return { frequency: null, rms };

    const windowSize = Math.floor(samples.length / 2);
    const minLag = Math.max(2, Math.floor(sampleRate / this.maxFrequency));
    const maxLag = Math.min(windowSize - 1, Math.ceil(sampleRate / this.minFrequency));
    if (maxLag <= minLag) return { frequency: null, rms };
    if (this.normalized.length <= maxLag + 1) this.normalized = new Float64Array(maxLag + 2);
    this.normalized[0] = 1;
    let cumulative = 0;
    let minimum = -1;
    for (let lag = 1; lag <= maxLag; lag++) {
      let difference = 0;
      for (let i = 0; i < windowSize; i++) {
        const delta = samples[i] - samples[i + lag];
        difference += delta * delta;
      }
      cumulative += difference;
      this.normalized[lag] = cumulative > 0 ? difference * lag / cumulative : 1;
      if (lag > minLag && this.normalized[lag - 1] < this.threshold &&
          this.normalized[lag - 1] <= this.normalized[lag]) {
        minimum = lag - 1;
        break;
      }
    }
    if (minimum < 0) return { frequency: null, rms };
    const left = this.normalized[minimum - 1];
    const center = this.normalized[minimum];
    const right = this.normalized[minimum + 1];
    const denominator = left - 2 * center + right;
    const correction = denominator === 0 ? 0 : 0.5 * (left - right) / denominator;
    const frequency = sampleRate / (minimum + correction);
    return { frequency: frequency >= this.minFrequency && frequency <= this.maxFrequency ? frequency : null, rms };
  }
}

class PitchTracker {
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
    this.reset();
  }

  reset() {
    this.frequencies = [];
    this.lastFrequency = null;
    this.lastRms = 0;
    this.octaveSince = null;
    this.octaveRms = 0;
    this.rejectedOctave = false;
  }

  update(frequency, rms, now) {
    if (!Number.isFinite(frequency) || frequency <= 0) return null;
    const octaveJump = this.lastFrequency !== null &&
      Math.abs(1200 * Math.log2(frequency / this.lastFrequency) - 1200) < 70;
    this.rejectedOctave = false;
    if (octaveJump && rms <= this.lastRms * 1.3) {
      if (this.octaveSince === null) {
        this.octaveSince = now;
        this.octaveRms = rms;
      }
      const newAttack = rms > this.octaveRms * 1.3;
      this.octaveRms = rms;
      if (!newAttack && (now - this.octaveSince < 700 || rms < this.lastRms * 0.85)) {
        this.rejectedOctave = true;
        return null;
      }
      this.frequencies = [];
    }
    this.octaveSince = null;
    this.frequencies.push(frequency);
    if (this.frequencies.length > this.windowSize) this.frequencies.shift();
    const sorted = [...this.frequencies].sort((a, b) => a - b);
    this.lastFrequency = sorted[Math.floor(sorted.length / 2)];
    this.lastRms = rms;
    return this.lastFrequency;
  }
}
