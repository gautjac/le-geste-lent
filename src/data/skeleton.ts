// ── The skeleton ────────────────────────────────────────────────────────────
// A stick-and-joint figure rendered in two synchronised views (front + profile).
// Coordinates live in a 100 × 130 box: x grows rightward, y grows downward,
// head near the top (y≈12), feet near the floor (y≈118). L / R are the *screen*
// sides (left of frame / right of frame), which keeps the keyframes intuitive to
// author and read. The profile faces right (+x is the direction the body faces).

export type Joint =
  | "head"
  | "neck"
  | "pelvis"
  | "shoulderL"
  | "shoulderR"
  | "elbowL"
  | "elbowR"
  | "wristL"
  | "wristR"
  | "hipL"
  | "hipR"
  | "kneeL"
  | "kneeR"
  | "ankleL"
  | "ankleR"
  | "toeL"
  | "toeR";

export type Point = readonly [number, number];
export type Pose = Record<Joint, Point>;

// Bones connect joints; "near" bones (the limb closest to the viewer in profile)
// read a touch heavier so the side view has depth.
export interface Bone {
  a: Joint;
  b: Joint;
  near?: boolean;
}

export const BONES: Bone[] = [
  { a: "head", b: "neck" },
  { a: "neck", b: "pelvis" },
  { a: "neck", b: "shoulderL" },
  { a: "neck", b: "shoulderR", near: true },
  { a: "shoulderL", b: "elbowL" },
  { a: "elbowL", b: "wristL" },
  { a: "shoulderR", b: "elbowR", near: true },
  { a: "elbowR", b: "wristR", near: true },
  { a: "pelvis", b: "hipL" },
  { a: "pelvis", b: "hipR", near: true },
  { a: "hipL", b: "kneeL" },
  { a: "kneeL", b: "ankleL" },
  { a: "hipR", b: "kneeR", near: true },
  { a: "kneeR", b: "ankleR", near: true },
  { a: "ankleL", b: "toeL" },
  { a: "ankleR", b: "toeR", near: true },
];

export const JOINTS = Object.keys({
  head: 0,
  neck: 0,
  pelvis: 0,
  shoulderL: 0,
  shoulderR: 0,
  elbowL: 0,
  elbowR: 0,
  wristL: 0,
  wristR: 0,
  hipL: 0,
  hipR: 0,
  kneeL: 0,
  kneeR: 0,
  ankleL: 0,
  ankleR: 0,
  toeL: 0,
  toeR: 0,
} satisfies Record<Joint, number>) as Joint[];

// Wuji — the quiet standing posture every gesture departs from and returns to.
export const NEUTRAL_FRONT: Pose = {
  head: [50, 13],
  neck: [50, 25],
  pelvis: [50, 56],
  shoulderL: [41, 28],
  shoulderR: [59, 28],
  elbowL: [38, 41],
  elbowR: [62, 41],
  wristL: [37, 54],
  wristR: [63, 54],
  hipL: [44, 58],
  hipR: [56, 58],
  kneeL: [43, 86],
  kneeR: [57, 86],
  ankleL: [43, 116],
  ankleR: [57, 116],
  toeL: [40, 119],
  toeR: [60, 119],
};

export const NEUTRAL_PROFILE: Pose = {
  head: [53, 13],
  neck: [50, 25],
  pelvis: [49, 56],
  shoulderL: [48, 28],
  shoulderR: [50, 28],
  elbowL: [48, 41],
  elbowR: [50, 41],
  wristL: [48, 54],
  wristR: [50, 54],
  hipL: [47, 58],
  hipR: [49, 58],
  kneeL: [47, 86],
  kneeR: [49, 86],
  ankleL: [46, 116],
  ankleR: [50, 116],
  toeL: [52, 119],
  toeR: [55, 119],
};

export type Overrides = Partial<Record<Joint, Point>>;

/** Build a full pose from a base by overriding only the joints that move. */
export function poseFrom(base: Pose, overrides: Overrides = {}): Pose {
  return { ...base, ...overrides };
}
export const front = (o?: Overrides): Pose => poseFrom(NEUTRAL_FRONT, o);
export const profile = (o?: Overrides): Pose => poseFrom(NEUTRAL_PROFILE, o);
