// A form is an ordered chain of gestures (postures), each with its own settle
// (dwell) and transition tempo. Practised in the flow view with haptic pacing.

export interface FormPosture {
  gestureSlug: string;
  /** ms to flow through the gesture's keyframes (before the global tempo factor) */
  transitionMs: number;
  /** ms to rest, settled, in the final posture */
  dwellMs: number;
}

export interface Form {
  slug: string;
  name: { fr: string; en: string };
  tradition: string;
  level: { fr: string; en: string };
  description: { fr: string; en: string };
  /** if true, the sequence loops seamlessly until you stop it */
  loop?: boolean;
  postures: FormPosture[];
  custom?: boolean;
}

const premiersGestes: Form = {
  slug: "premiers-gestes",
  name: { fr: "Les Premiers Gestes", en: "The First Gestures" },
  tradition: "Yang",
  level: { fr: "Débutant", en: "Beginner" },
  description: {
    fr: "Une courte forme d'ouverture qui enchaîne les cinq premiers gestes du sentier, de la mise en place jusqu'à la clôture. Le cœur de la pratique quotidienne.",
    en: "A short opening form chaining the first five gestures of the path, from settling in to the close. The heart of a daily practice.",
  },
  postures: [
    { gestureSlug: "commencement", transitionMs: 12000, dwellMs: 4000 },
    { gestureSlug: "criniere-cheval", transitionMs: 13000, dwellMs: 5000 },
    { gestureSlug: "grue-blanche", transitionMs: 12000, dwellMs: 5000 },
    { gestureSlug: "brosser-genou", transitionMs: 13000, dwellMs: 5000 },
    { gestureSlug: "cloture", transitionMs: 11000, dwellMs: 6000 },
  ],
};

const mainsNuages: Form = {
  slug: "mains-nuages-boucle",
  name: { fr: "Mains comme des Nuages", en: "Cloud Hands" },
  tradition: "Yang",
  level: { fr: "Méditatif", en: "Meditative" },
  description: {
    fr: "Un seul geste circulaire, bouclé sans fin. Ferme les yeux, laisse les tapotements marquer le passage du poids d'un pied à l'autre, et tourne avec les nuages.",
    en: "A single circular gesture, looped endlessly. Close your eyes, let the taps mark the weight passing foot to foot, and turn with the clouds.",
  },
  loop: true,
  postures: [{ gestureSlug: "mains-nuages", transitionMs: 16000, dwellMs: 1500 }],
};

export const FORMS: Form[] = [premiersGestes, mainsNuages];
