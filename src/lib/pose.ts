import { JOINTS, type Pose, type Point } from "../data/skeleton";
import type { Breath, Keyframe } from "../data/gestures";

/** Slow, breath-like ease used for every playback transition. */
export function easeInOut(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerpPoint(a: Point, b: Point, f: number): Point {
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

function lerpPose(a: Pose, b: Pose, f: number): Pose {
  const out = {} as Pose;
  for (const j of JOINTS) out[j] = lerpPoint(a[j], b[j], f);
  return out;
}

export interface Sample {
  front: Pose;
  profile: Pose;
  weight: number;
  breath: Breath;
  cue: { fr: string; en: string };
  /** index of the nearest keyframe — drives the "active keyframe" highlight */
  nearestIndex: number;
}

/**
 * Sample a gesture at position t ∈ [0,1]. Joints are linearly interpolated
 * between the bracketing keyframes (the caller eases t for smooth playback;
 * scrubbing passes raw t for a precise film-strip feel). Breath, weight and cue
 * read from the nearer keyframe so a held micro-position shows its real cue.
 */
export function sampleGesture(keyframes: Keyframe[], t: number): Sample {
  const clamped = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < keyframes.length - 1 && keyframes[i + 1].t < clamped) i++;
  const k0 = keyframes[i];
  const k1 = keyframes[Math.min(i + 1, keyframes.length - 1)];
  const span = k1.t - k0.t || 1;
  const f = Math.max(0, Math.min(1, (clamped - k0.t) / span));
  const nearer = f < 0.5 ? k0 : k1;
  return {
    front: lerpPose(k0.front, k1.front, f),
    profile: lerpPose(k0.profile, k1.profile, f),
    weight: k0.weight + (k1.weight - k0.weight) * f,
    breath: nearer.breath,
    cue: nearer.cue,
    nearestIndex: keyframes.indexOf(nearer),
  };
}
