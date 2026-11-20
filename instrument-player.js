class InstrumentPlayer {
  constructor(context, samples) {
    this.context = context;
    this.samples = samples;
    this.cache = new Map();
    this.channels = new Map();
    this.instruments = {
      piano: [
        [60, "INSPiano_Vel02_C4_01"], [64, "INSPiano_Vel02_E4_01"],
        [67, "INSPiano_Vel02_G4_01"], [71, "INSPiano_Vel02_B4_01"],
        [74, "INSPiano_Vel02_D5_01"], [77, "INSPiano_Vel02_F5_01"],
        [81, "INSPiano_Vel02_A5_01"]
      ],
      guitar: [
        [40, "INSGuitarSteel_StringLowE_Vel02_E2_01"], [45, "INSGuitarSteel_StringA_Vel02_A2_01"],
        [50, "INSGuitarSteel_StringD_Vel02_D3_01"], [55, "INSGuitarSteel_StringG_Vel02_G3_01"],
        [59, "INSGuitarSteel_StringB_Vel02_B3_01"], [64, "INSGuitarSteel_StringHighE_Vel02_E4_01"],
        [69, "INSGuitarSteel_StringHighE_Vel02_A4_01"], [76, "INSGuitarSteel_StringHighE_Vel02_E5_01"]
      ]
    };
  }

  async load(name) {
    if (!this.cache.has(name)) {
      const encoded = this.samples[name];
      if (!encoded) throw new Error(`Missing instrument sample: ${name}`);
      const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
      const loading = this.context.decodeAudioData(bytes.buffer).catch((error) => {
        this.cache.delete(name);
        throw error;
      });
      this.cache.set(name, loading);
    }
    return this.cache.get(name);
  }

  stop(channel) {
    const active = this.channels.get(channel);
    if (!active) return;
    this.channels.delete(channel);
    const now = this.context.currentTime;
    active.nodes.forEach(({ source, gain, time }) => {
      if (time > now) {
        source.stop(now);
      } else {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 0.015);
        source.stop(now + 0.08);
      }
    });
  }

  async play(instrument, events, referenceFrequency, channel = null) {
    const samples = this.instruments[instrument];
    if (!samples) throw new Error(`Unknown instrument: ${instrument}`);
    const playback = { nodes: [] };
    if (channel) {
      this.stop(channel);
      this.channels.set(channel, playback);
    }
    const resolved = await Promise.all(events.map(async (event) => {
      const sample = samples.reduce((nearest, candidate) =>
        Math.abs(candidate[0] - event.midi) < Math.abs(nearest[0] - event.midi) ? candidate : nearest);
      return { event, sample, buffer: await this.load(sample[1]) };
    }));
    if (channel && this.channels.get(channel) !== playback) return null;
    const start = this.context.currentTime + 0.05;
    resolved.forEach(({ event, sample, buffer }) => {
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      const time = start + event.offset;
      const duration = event.duration;
      source.buffer = buffer;
      source.playbackRate.value = Math.pow(2, (event.midi - sample[0]) / 12) * referenceFrequency / 440;
      gain.gain.setValueAtTime(0.0001, time);
      const attack = channel ? Math.min(0.015, duration) : 0.01;
      gain.gain.linearRampToValueAtTime(event.gain, time + attack);
      if (channel) gain.gain.linearRampToValueAtTime(event.gain * 0.85, time + Math.min(0.075, duration));
      gain.gain.setValueAtTime(channel ? event.gain * 0.85 : event.gain, time + duration);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.18);
      source.connect(gain).connect(this.context.destination);
      source.start(time);
      source.stop(time + duration + 0.2);
      if (channel) {
        const node = { source, gain, time };
        playback.nodes.push(node);
        source.onended = () => {
          const index = playback.nodes.indexOf(node);
          if (index >= 0) playback.nodes.splice(index, 1);
          if (!playback.nodes.length && this.channels.get(channel) === playback) this.channels.delete(channel);
        };
      }
    });
    return start;
  }
}
