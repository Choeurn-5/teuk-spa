// Luxury Spa Audio Chime Synthesizer using Web Audio API
// Generates a soothing, crystalline Tibetan singing bowl / zen chime
// No external MP3 files needed, zero load lag, works 100% offline and cross-browser.

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
    }

    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {
        // Handled on next user gesture
      });
    }

    return sharedAudioCtx;
  } catch (err) {
    console.warn("AudioContext not supported or blocked:", err);
    return null;
  }
}

/**
 * Automatically unlocks AudioContext on the first click/touch on the page
 * to satisfy modern browser autoplay policies.
 */
export function initAudioUnlock() {
  if (typeof window === "undefined") return;

  const unlock = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
    } catch {
      // ignore
    }
  };

  window.addEventListener("click", unlock, { once: true, passive: true });
  window.addEventListener("touchstart", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true, passive: true });
}

/**
 * Plays a resonant, calming 4-tone luxury spa chime
 * Notes: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
 * with natural crystal overtones and gentle exponential decay.
 */
export function playSpaChime(volume: number = 0.8) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const clampedVolume = Math.max(0.05, Math.min(volume, 1.0));

    // Master volume node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(clampedVolume, now);

    // Warm low-pass filter to give soothing, organic acoustic feel
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Melodic notes sequence (ascending zen chime cascade)
    const notes = [
      { freq: 523.25, time: 0.0, duration: 1.4, gain: 0.28 }, // C5
      { freq: 659.25, time: 0.14, duration: 1.6, gain: 0.32 }, // E5
      { freq: 783.99, time: 0.28, duration: 1.8, gain: 0.36 }, // G5
      { freq: 1046.5, time: 0.44, duration: 2.4, gain: 0.42 }, // C6 (sustained bloom)
    ];

    notes.forEach(({ freq, time, duration, gain: noteGainLevel }) => {
      const noteTime = now + time;

      // 1. Fundamental tone (smooth sine)
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      // Bell envelope: ultra-fast attack, smooth natural exponential fadeout
      noteGain.gain.setValueAtTime(0.0001, noteTime);
      noteGain.gain.linearRampToValueAtTime(noteGainLevel, noteTime + 0.018);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + duration);

      // 2. Crystal overtone (gives physical bell/singing bowl resonance)
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      overtone.type = "sine";
      // Inharmonic physical chime overtone ratio (~2.76x)
      overtone.frequency.setValueAtTime(freq * 2.756, noteTime);

      overtoneGain.gain.setValueAtTime(0.0001, noteTime);
      overtoneGain.gain.linearRampToValueAtTime(noteGainLevel * 0.16, noteTime + 0.012);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.45);

      overtone.connect(overtoneGain);
      overtoneGain.connect(masterGain);

      overtone.start(noteTime);
      overtone.stop(noteTime + duration * 0.45);
    });
  } catch (err) {
    console.warn("Failed to play spa chime audio:", err);
  }
}
