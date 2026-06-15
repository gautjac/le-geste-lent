// Eyes-optional haptic vocabulary (Le Lent's signature). A small set of distinct
// gentle taps lets a practitioner feel the rhythm of a form with eyes closed.
// Backed by the Vibration API where available (Android / some browsers); on iOS
// Safari vibration is unavailable, so the pacing arc and audio cues carry it.

export type HapticIntensity = "off" | "soft" | "full";
export type Cue = "begin" | "settle" | "switch" | "complete";

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

// Base patterns (ms on/off). Scaled down for "soft".
const PATTERNS: Record<Cue, number[]> = {
  begin: [26], // a single tap — a transition begins
  settle: [120], // one long pulse — arrive, settle into the posture
  switch: [22, 70, 22, 70, 22], // a triple flutter — change sides
  complete: [60, 80, 160], // soft three-beat resolve — the form is done
};

export function haptic(cue: Cue, intensity: HapticIntensity): void {
  if (intensity === "off" || !canVibrate()) return;
  const base = PATTERNS[cue];
  const pattern =
    intensity === "soft" ? base.map((ms, i) => (i % 2 === 0 ? Math.round(ms * 0.55) : ms)) : base;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* never let a cue throw */
  }
}

export function hapticsSupported(): boolean {
  return canVibrate();
}
