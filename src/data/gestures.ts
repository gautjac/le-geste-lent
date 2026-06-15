import { front, profile, type Pose } from "./skeleton";

export type Breath = "in" | "out" | "hold";

export interface Keyframe {
  /** position along the gesture, 0 → 1 */
  t: number;
  breath: Breath;
  /** percent of weight carried on the screen-RIGHT foot (50 = even) */
  weight: number;
  cue: { fr: string; en: string };
  front: Pose;
  profile: Pose;
}

export interface Gesture {
  slug: string;
  order: number;
  name: { fr: string; en: string };
  hanzi: string;
  pinyin: string;
  family: { fr: string; en: string };
  intro: { fr: string; en: string };
  /** natural duration of one slow pass, before the global tempo factor */
  baseDurationMs: number;
  keyframes: Keyframe[];
  /** seeded gestures are part of the core ladder; AI-made ones are not */
  custom?: boolean;
}

// ── 1 · Commencement ─────────────────────────────────────────────────────────
const commencement: Gesture = {
  slug: "commencement",
  order: 1,
  name: { fr: "Le Commencement", en: "Commencement" },
  hanzi: "起势",
  pinyin: "Qǐshì",
  family: { fr: "Ouverture", en: "Opening" },
  intro: {
    fr: "Le premier souffle de la forme. On se tient debout, calme, puis les bras flottent vers l'avant comme portés par l'eau, et redescendent. Rien à réussir — seulement se rassembler.",
    en: "The form's first breath. You stand quietly, the arms float forward as if carried by water, then settle. Nothing to achieve — only to gather yourself.",
  },
  baseDurationMs: 12000,
  keyframes: [
    {
      t: 0,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Debout, immobile. Poids réparti également, genoux à peine fléchis.",
        en: "Stand still. Weight evenly shared, knees barely bent.",
      },
      front: front(),
      profile: profile(),
    },
    {
      t: 0.45,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Les bras flottent vers l'avant, à hauteur d'épaule. Les poignets mènent, mous.",
        en: "Arms float forward to shoulder height. Soft wrists lead.",
      },
      front: front({
        wristL: [40, 31],
        elbowL: [39, 40],
        wristR: [60, 31],
        elbowR: [61, 40],
      }),
      profile: profile({
        head: [52, 13],
        shoulderR: [50, 28],
        elbowR: [58, 31],
        wristR: [66, 32],
        shoulderL: [48, 28],
        elbowL: [56, 32],
        wristL: [64, 33],
      }),
    },
    {
      t: 0.75,
      breath: "out",
      weight: 50,
      cue: {
        fr: "Les coudes s'abaissent, les paumes pressent doucement vers le sol.",
        en: "Elbows sink, palms press gently toward the floor.",
      },
      front: front({
        elbowL: [38, 38],
        wristL: [39, 47],
        elbowR: [62, 38],
        wristR: [61, 47],
      }),
      profile: profile({
        elbowR: [56, 36],
        wristR: [60, 46],
        elbowL: [54, 37],
        wristL: [58, 47],
      }),
    },
    {
      t: 1,
      breath: "out",
      weight: 50,
      cue: {
        fr: "Les bras reviennent le long du corps. Une vague qui se retire.",
        en: "Arms return to your sides. A wave drawing back.",
      },
      front: front(),
      profile: profile(),
    },
  ],
};

// ── 2 · Part the Wild Horse's Mane (left) ────────────────────────────────────
const criniere: Gesture = {
  slug: "criniere-cheval",
  order: 2,
  name: { fr: "Séparer la Crinière", en: "Part the Wild Horse's Mane" },
  hanzi: "野马分鬃",
  pinyin: "Yěmǎ fēnzōng",
  family: { fr: "Séparation", en: "Separation" },
  intro: {
    fr: "On tient un ballon invisible, puis le pied gauche avance en arc de cercle. Les mains se séparent comme on écarte une crinière : l'une monte, paume au ciel ; l'autre presse vers la hanche.",
    en: "You cradle an invisible ball, then the left foot steps in an arc. The hands part as if combing a mane: one rises, palm to the sky; the other presses to the hip.",
  },
  baseDurationMs: 13000,
  keyframes: [
    {
      t: 0,
      breath: "in",
      weight: 65,
      cue: {
        fr: "Tenir le ballon : main droite dessus, main gauche dessous. Poids sur la jambe arrière.",
        en: "Hold the ball: right hand above, left below. Weight on the back leg.",
      },
      front: front({
        pelvis: [51, 56],
        wristR: [55, 40],
        elbowR: [61, 37],
        wristL: [51, 48],
        elbowL: [46, 45],
        kneeR: [58, 86],
      }),
      profile: profile({
        wristR: [56, 40],
        elbowR: [55, 37],
        wristL: [54, 48],
        elbowL: [53, 45],
      }),
    },
    {
      t: 0.5,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Le pied gauche avance en arc. Le poids commence à se transférer.",
        en: "The left foot steps forward in an arc. Weight begins to transfer.",
      },
      front: front({
        ankleL: [33, 116],
        toeL: [30, 119],
        kneeL: [37, 87],
        hipL: [43, 58],
        pelvis: [50, 56],
        wristL: [44, 46],
        elbowL: [44, 44],
        wristR: [57, 42],
        elbowR: [60, 40],
      }),
      profile: profile({
        pelvis: [51, 56],
        kneeR: [53, 86],
        ankleR: [54, 116],
        wristR: [58, 42],
        wristL: [52, 47],
      }),
    },
    {
      t: 1,
      breath: "out",
      weight: 35,
      cue: {
        fr: "Posture de l'arc à gauche. La main gauche monte (paume au ciel), la droite presse vers la hanche.",
        en: "Left bow stance. The left hand rises (palm skyward), the right presses to the hip.",
      },
      front: front({
        ankleL: [31, 116],
        toeL: [27, 119],
        kneeL: [35, 89],
        hipL: [42, 58],
        pelvis: [46, 57],
        hipR: [55, 58],
        kneeR: [61, 90],
        ankleR: [66, 116],
        toeR: [69, 118],
        shoulderL: [42, 29],
        elbowL: [40, 42],
        wristL: [35, 30],
        wristR: [57, 62],
        elbowR: [60, 52],
      }),
      profile: profile({
        head: [55, 14],
        neck: [51, 25],
        kneeR: [55, 86],
        ankleR: [58, 116],
        toeR: [62, 118],
        kneeL: [42, 88],
        ankleL: [39, 116],
        toeL: [44, 118],
        shoulderR: [51, 28],
        elbowR: [53, 40],
        wristR: [57, 32],
        elbowL: [49, 52],
        wristL: [47, 60],
      }),
    },
  ],
};

// ── 3 · White Crane Spreads Its Wings ────────────────────────────────────────
const grue: Gesture = {
  slug: "grue-blanche",
  order: 3,
  name: { fr: "La Grue Blanche déploie ses Ailes", en: "White Crane Spreads Its Wings" },
  hanzi: "白鹤亮翅",
  pinyin: "Báihè liàngchì",
  family: { fr: "Équilibre", en: "Balance" },
  intro: {
    fr: "Le poids recule sur la jambe arrière, le corps se redresse, haut et léger. La main droite s'ouvre près de la tempe, la gauche descend près de la hanche, et la pointe du pied avant effleure le sol.",
    en: "Weight settles back, the body lifts tall and light. The right hand opens by the temple, the left sinks by the hip, and the front toe brushes the floor.",
  },
  baseDurationMs: 12000,
  keyframes: [
    {
      t: 0,
      breath: "in",
      weight: 55,
      cue: {
        fr: "Transition : les mains se rassemblent doucement devant le centre.",
        en: "Transition: the hands gather softly before your center.",
      },
      front: front({
        wristR: [54, 42],
        elbowR: [57, 44],
        wristL: [50, 50],
        elbowL: [47, 48],
      }),
      profile: profile({
        wristR: [55, 42],
        wristL: [53, 50],
      }),
    },
    {
      t: 0.5,
      breath: "in",
      weight: 70,
      cue: {
        fr: "Le poids s'assoit sur la jambe arrière. Les mains commencent à s'ouvrir.",
        en: "Weight sits onto the back leg. The hands begin to open.",
      },
      front: front({
        pelvis: [53, 56],
        kneeR: [58, 86],
        hipR: [55, 58],
        ankleL: [46, 116],
        wristR: [56, 38],
        elbowR: [59, 40],
        wristL: [48, 52],
        elbowL: [45, 50],
      }),
      profile: profile({
        pelvis: [48, 56],
        wristR: [54, 38],
        wristL: [50, 54],
      }),
    },
    {
      t: 1,
      breath: "out",
      weight: 80,
      cue: {
        fr: "La grue déploie : main droite ouverte près de la tempe, main gauche basse, pointe du pied avant posée.",
        en: "The crane spreads: right hand open by the temple, left hand low, front toe touching.",
      },
      front: front({
        pelvis: [53, 56],
        hipR: [55, 58],
        kneeR: [57, 85],
        ankleR: [57, 116],
        hipL: [49, 58],
        kneeL: [48, 87],
        ankleL: [46, 113],
        toeL: [45, 118],
        shoulderR: [58, 28],
        elbowR: [60, 33],
        wristR: [60, 22],
        elbowL: [45, 53],
        wristL: [44, 64],
      }),
      profile: profile({
        kneeL: [47, 86],
        ankleL: [46, 116],
        toeL: [50, 118],
        kneeR: [52, 90],
        ankleR: [55, 114],
        toeR: [59, 118],
        shoulderR: [50, 28],
        elbowR: [53, 33],
        wristR: [55, 22],
        elbowL: [49, 53],
        wristL: [47, 62],
      }),
    },
  ],
};

// ── 4 · Brush Knee and Twist Step (left) ─────────────────────────────────────
const genou: Gesture = {
  slug: "brosser-genou",
  order: 4,
  name: { fr: "Brosser le Genou", en: "Brush Knee and Twist Step" },
  hanzi: "搂膝拗步",
  pinyin: "Lōuxī àobù",
  family: { fr: "Le Pas", en: "Stepping" },
  intro: {
    fr: "La main droite recule près de l'oreille, puis pousse vers l'avant à hauteur d'épaule tandis que la main gauche balaie au-dessus du genou jusqu'à la hanche. Le pas et la poussée naissent du même transfert de poids.",
    en: "The right hand draws back by the ear, then pushes forward at shoulder height while the left hand brushes over the knee to the hip. Step and push are born of one weight shift.",
  },
  baseDurationMs: 13000,
  keyframes: [
    {
      t: 0,
      breath: "in",
      weight: 60,
      cue: {
        fr: "Main droite ramenée près de l'oreille, main gauche en travers du corps. Poids en arrière.",
        en: "Right hand drawn near the ear, left hand across the body. Weight back.",
      },
      front: front({
        pelvis: [51, 56],
        kneeR: [58, 86],
        wristR: [62, 34],
        elbowR: [64, 40],
        wristL: [52, 48],
        elbowL: [49, 45],
      }),
      profile: profile({
        wristR: [46, 34],
        elbowR: [48, 40],
        wristL: [52, 48],
      }),
    },
    {
      t: 0.5,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Le pied gauche avance. La main droite quitte l'oreille, la gauche descend vers le genou.",
        en: "The left foot steps forward. The right hand leaves the ear, the left lowers toward the knee.",
      },
      front: front({
        ankleL: [34, 116],
        toeL: [31, 119],
        kneeL: [37, 88],
        hipL: [43, 58],
        pelvis: [50, 56],
        wristR: [58, 40],
        elbowR: [61, 41],
        wristL: [48, 54],
        elbowL: [46, 50],
      }),
      profile: profile({
        pelvis: [51, 56],
        kneeR: [53, 86],
        ankleR: [54, 116],
        wristR: [54, 40],
        wristL: [50, 56],
      }),
    },
    {
      t: 1,
      breath: "out",
      weight: 35,
      cue: {
        fr: "Posture de l'arc à gauche. La paume droite pousse devant, à hauteur d'épaule ; la gauche repose près de la hanche.",
        en: "Left bow stance. The right palm pushes forward at shoulder height; the left rests by the hip.",
      },
      front: front({
        ankleL: [32, 116],
        toeL: [28, 119],
        kneeL: [35, 89],
        hipL: [42, 58],
        pelvis: [46, 57],
        hipR: [55, 58],
        kneeR: [61, 90],
        ankleR: [66, 116],
        toeR: [69, 118],
        shoulderR: [58, 29],
        elbowR: [60, 40],
        wristR: [54, 40],
        elbowL: [45, 51],
        wristL: [44, 60],
      }),
      profile: profile({
        head: [55, 14],
        neck: [51, 25],
        kneeR: [55, 86],
        ankleR: [58, 116],
        toeR: [62, 118],
        kneeL: [42, 88],
        ankleL: [39, 116],
        toeL: [44, 118],
        shoulderR: [50, 28],
        elbowR: [57, 39],
        wristR: [64, 38],
        elbowL: [49, 52],
        wristL: [47, 60],
      }),
    },
  ],
};

// ── 5 · Cloud Hands ──────────────────────────────────────────────────────────
const nuages: Gesture = {
  slug: "mains-nuages",
  order: 5,
  name: { fr: "Mains comme des Nuages", en: "Cloud Hands" },
  hanzi: "云手",
  pinyin: "Yúnshǒu",
  family: { fr: "Continuité", en: "Flow" },
  intro: {
    fr: "Le poids glisse d'un pied à l'autre tandis que les mains tournent sans fin devant le corps — l'une au visage, l'autre au nombril, qui échangent leurs places. Un geste circulaire, sans début ni fin : idéal à boucler en méditation.",
    en: "Weight glides from foot to foot while the hands turn endlessly before the body — one at the face, one at the navel, trading places. A circular gesture with no beginning or end: made to be looped in meditation.",
  },
  baseDurationMs: 16000,
  keyframes: [
    {
      t: 0,
      breath: "hold",
      weight: 70,
      cue: {
        fr: "Poids à droite. Main droite au visage, main gauche au nombril.",
        en: "Weight right. Right hand at the face, left hand at the navel.",
      },
      front: front({
        pelvis: [53, 56],
        wristR: [58, 34],
        elbowR: [60, 42],
        wristL: [48, 52],
        elbowL: [45, 50],
      }),
      profile: profile({
        wristR: [56, 36],
        elbowR: [54, 42],
        wristL: [54, 52],
        elbowL: [52, 50],
      }),
    },
    {
      t: 0.25,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Les mains se croisent au centre : la droite descend, la gauche monte.",
        en: "The hands cross at center: the right sinks, the left rises.",
      },
      front: front({
        wristR: [50, 44],
        elbowR: [55, 46],
        wristL: [50, 40],
        elbowL: [47, 48],
      }),
      profile: profile({
        wristR: [55, 44],
        wristL: [55, 42],
      }),
    },
    {
      t: 0.5,
      breath: "out",
      weight: 30,
      cue: {
        fr: "Poids à gauche. Main gauche au visage, main droite au nombril.",
        en: "Weight left. Left hand at the face, right hand at the navel.",
      },
      front: front({
        pelvis: [47, 56],
        wristL: [42, 34],
        elbowL: [40, 42],
        wristR: [52, 52],
        elbowR: [55, 50],
      }),
      profile: profile({
        wristR: [56, 52],
        elbowR: [54, 50],
        wristL: [54, 36],
        elbowL: [52, 42],
      }),
    },
    {
      t: 0.75,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Les mains se recroisent : la gauche descend, la droite remonte.",
        en: "The hands cross back: the left sinks, the right rises.",
      },
      front: front({
        wristL: [50, 44],
        elbowL: [45, 46],
        wristR: [50, 40],
        elbowR: [53, 48],
      }),
      profile: profile({
        wristR: [55, 42],
        wristL: [55, 44],
      }),
    },
    {
      t: 1,
      breath: "hold",
      weight: 70,
      cue: {
        fr: "Retour : poids à droite, main droite au visage. Le cercle peut recommencer.",
        en: "Return: weight right, right hand at the face. The circle may begin again.",
      },
      front: front({
        pelvis: [53, 56],
        wristR: [58, 34],
        elbowR: [60, 42],
        wristL: [48, 52],
        elbowL: [45, 50],
      }),
      profile: profile({
        wristR: [56, 36],
        elbowR: [54, 42],
        wristL: [54, 52],
        elbowL: [52, 50],
      }),
    },
  ],
};

// ── 6 · Closing ──────────────────────────────────────────────────────────────
const cloture: Gesture = {
  slug: "cloture",
  order: 6,
  name: { fr: "La Clôture", en: "Closing" },
  hanzi: "收势",
  pinyin: "Shōushì",
  family: { fr: "Clôture", en: "Closing" },
  intro: {
    fr: "Le dernier geste range la forme. Les mains se rapprochent, descendent ensemble, et le corps revient à l'immobilité du début. On ne s'arrête pas : on se dépose.",
    en: "The last gesture puts the form away. The hands draw together, lower as one, and the body returns to the stillness it began in. You don't stop: you settle.",
  },
  baseDurationMs: 11000,
  keyframes: [
    {
      t: 0,
      breath: "in",
      weight: 50,
      cue: {
        fr: "Les mains s'ouvrent devant la poitrine, paumes tournant vers le bas.",
        en: "The hands open before the chest, palms turning downward.",
      },
      front: front({
        wristL: [44, 40],
        elbowL: [42, 44],
        wristR: [56, 40],
        elbowR: [58, 44],
      }),
      profile: profile({
        wristR: [56, 40],
        elbowR: [54, 44],
        wristL: [54, 41],
      }),
    },
    {
      t: 0.5,
      breath: "out",
      weight: 50,
      cue: {
        fr: "Les paumes descendent ensemble, lentement, le long du centre.",
        en: "The palms lower together, slowly, along the center line.",
      },
      front: front({
        wristL: [46, 52],
        elbowL: [43, 47],
        wristR: [54, 52],
        elbowR: [57, 47],
      }),
      profile: profile({
        wristR: [55, 52],
        wristL: [53, 52],
      }),
    },
    {
      t: 1,
      breath: "out",
      weight: 50,
      cue: {
        fr: "Immobile. Le geste est rangé. Reste un instant, et respire.",
        en: "Still. The gesture is put away. Stay a moment, and breathe.",
      },
      front: front(),
      profile: profile(),
    },
  ],
};

export const GESTURES: Gesture[] = [
  commencement,
  criniere,
  grue,
  genou,
  nuages,
  cloture,
];
