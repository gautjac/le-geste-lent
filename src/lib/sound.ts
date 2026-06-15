// Optional soft audio cues — a wooden, bowl-like tone — for practitioners who
// keep their eyes closed where haptics aren't available (e.g. iOS Safari).

import type { Cue } from "./haptics";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** Must be called from a user gesture once to unlock audio on mobile. */
export function primeSound(): void {
  audio();
}

const TONE: Record<Cue, { freq: number; dur: number }> = {
  begin: { freq: 528, dur: 0.18 },
  settle: { freq: 396, dur: 0.5 },
  switch: { freq: 660, dur: 0.14 },
  complete: { freq: 432, dur: 0.9 },
};

export function chime(cue: Cue, enabled: boolean): void {
  if (!enabled) return;
  const ac = audio();
  if (!ac) return;
  const { freq, dur } = TONE[cue];
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const now = ac.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.05);
}
