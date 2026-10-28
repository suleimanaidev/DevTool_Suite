// Small sound effects shared by the stopwatch and countdown timer.
// Built with the Web Audio API, so there are no audio files to download.
// Browsers only allow audio after the user interacts with the page, so these
// sounds are always triggered from a click (or the Space key).

let audioContext = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

// Call this from a user gesture (Start / Reset) to unlock sound playback.
export function unlockSound() {
  getContext();
}

// One short note. "delay" is in seconds and "endFrequency" makes the note slide.
function tone({ frequency, duration = 0.1, volume = 0.12, type = "sine", delay = 0, endFrequency = null }) {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const startAt = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startAt);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.015, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  } catch {
    // Sound is a bonus; the tools work without it.
  }
}

// Two rising notes: starting or resuming.
export function playStart() {
  tone({ frequency: 660, duration: 0.07, volume: 0.13, type: "triangle" });
  tone({ frequency: 990, duration: 0.1, volume: 0.11, type: "triangle", delay: 0.07 });
}

// A short click for recording a lap.
export function playLap() {
  tone({ frequency: 1250, duration: 0.045, volume: 0.08, type: "triangle" });
}

// Two falling notes: reset.
export function playReset() {
  tone({ frequency: 520, duration: 0.08, volume: 0.11, type: "triangle" });
  tone({ frequency: 300, duration: 0.12, volume: 0.09, type: "triangle", delay: 0.08 });
}

// A clock-like tick. Alternate the pitch so repeated ticks sound natural.
export function playTick(high = false) {
  tone({ frequency: high ? 1150 : 900, duration: 0.03, volume: 0.06, type: "square" });
}

// Three-note chime when a countdown reaches zero.
export function playFinish() {
  tone({ frequency: 880, duration: 0.18, volume: 0.14, type: "triangle" });
  tone({ frequency: 880, duration: 0.18, volume: 0.14, type: "triangle", delay: 0.28 });
  tone({ frequency: 1046.5, duration: 0.3, volume: 0.16, type: "triangle", delay: 0.56 });
}
