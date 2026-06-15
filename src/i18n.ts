export type Lang = "fr" | "en";

type Dict = Record<string, { fr: string; en: string }>;

export const STR = {
  // chrome / nav
  appName: { fr: "Le Geste Lent", en: "Le Geste Lent" },
  tagline: {
    fr: "Apprendre le tai-chi, un souffle à la fois",
    en: "Learning tai chi, one breath at a time",
  },
  navSentier: { fr: "Le Sentier", en: "The Path" },
  navFormes: { fr: "Les Formes", en: "Forms" },
  navCarnet: { fr: "Le Carnet", en: "Journal" },
  navReglages: { fr: "Réglages", en: "Settings" },
  back: { fr: "Retour", en: "Back" },

  // sentier
  sentierLead: {
    fr: "Une échelle lente de gestes. Maîtrise-en un avant que le suivant ne s'ouvre.",
    en: "A slow ladder of gestures. Master one before the next opens.",
  },
  locked: { fr: "Verrouillé", en: "Locked" },
  available: { fr: "À étudier", en: "To study" },
  absorbed: { fr: "Absorbé", en: "Absorbed" },
  justUnlocked: { fr: "Nouvellement ouvert", en: "Just unlocked" },
  lockedHint: {
    fr: "Absorbe le geste précédent pour ouvrir celui-ci.",
    en: "Absorb the previous gesture to open this one.",
  },
  gestureCount: { fr: "gestes", en: "gestures" },
  absorbedCount: { fr: "absorbés", en: "absorbed" },

  // étude
  study: { fr: "Étudier", en: "Study" },
  frontView: { fr: "De face", en: "Front" },
  profileView: { fr: "De profil", en: "Profile" },
  scrubHint: {
    fr: "Glisse pour parcourir le geste. Arrête-toi sur n'importe quelle micro-position.",
    en: "Drag to move through the gesture. Pause on any micro-position.",
  },
  keyframe: { fr: "Repère", en: "Keyframe" },
  weight: { fr: "Poids", en: "Weight" },
  weightLeft: { fr: "gauche", en: "left" },
  weightRight: { fr: "droite", en: "right" },
  breathIn: { fr: "Inspire", en: "Breathe in" },
  breathOut: { fr: "Expire", en: "Breathe out" },
  breathHold: { fr: "Suspends", en: "Hold" },
  playBreath: { fr: "Le Souffle", en: "Breath playback" },
  openRessenti: { fr: "Le Ressenti", en: "Felt-sense" },

  // souffle
  souffleLead: {
    fr: "Le geste se rejoue en boucle, au rythme du souffle. Choisis ta lenteur.",
    en: "The gesture loops at the pace of the breath. Choose your slowness.",
  },
  tempo: { fr: "Lenteur", en: "Slowness" },
  slower: { fr: "Plus lent", en: "Slower" },
  faster: { fr: "Plus vif", en: "Quicker" },
  play: { fr: "Jouer", en: "Play" },
  pause: { fr: "Pause", en: "Pause" },
  loopsDone: { fr: "boucles", en: "loops" },
  finishSession: { fr: "Terminer la séance", en: "End session" },

  // ressenti
  ressentiLead: {
    fr: "Note ce que le corps a senti. Quand le geste est tien, marque-le absorbé.",
    en: "Note what the body felt. When the gesture is yours, mark it absorbed.",
  },
  feltPlaceholder: {
    fr: "Aujourd'hui, l'épaule droite voulait monter trop tôt…",
    en: "Today the right shoulder wanted to rise too soon…",
  },
  ease: { fr: "Aisance", en: "Ease" },
  saveNote: { fr: "Garder la note", en: "Keep note" },
  absorber: { fr: "Absorber le geste", en: "Absorb the gesture" },
  absorberHint: {
    fr: "Ouvre le geste suivant du sentier. À faire seulement quand tu te sens prêt·e.",
    en: "Opens the next gesture on the path. Only when you feel ready.",
  },
  alreadyAbsorbed: { fr: "Geste absorbé", en: "Gesture absorbed" },
  noNotesYet: { fr: "Aucune note pour l'instant.", en: "No notes yet." },
  pastNotes: { fr: "Notes passées", en: "Past notes" },

  // formes / pratique
  formesLead: {
    fr: "Enchaîne les gestes absorbés en une forme fluide, guidée au rythme et au toucher.",
    en: "Chain absorbed gestures into a flowing form, paced by rhythm and touch.",
  },
  practice: { fr: "Pratiquer", en: "Practice" },
  postures: { fr: "postures", en: "postures" },
  formLockedHint: {
    fr: "Absorbe au moins un geste de cette forme pour la pratiquer.",
    en: "Absorb at least one gesture in this form to practise it.",
  },
  begin: { fr: "Commencer", en: "Begin" },
  eyesOptional: {
    fr: "Yeux ouverts ou fermés — les tapotements donnent le rythme.",
    en: "Eyes open or closed — the taps keep the pace.",
  },
  settle: { fr: "Installe-toi", en: "Settle" },
  transition: { fr: "Transition", en: "Transition" },
  posture: { fr: "Posture", en: "Posture" },
  done: { fr: "Terminé", en: "Done" },
  nextPosture: { fr: "Suivante", en: "Next" },
  newForm: { fr: "Nouvelle forme", en: "New form" },
  createWithAI: { fr: "Composer avec l'IA", en: "Compose with AI" },

  // carnet
  carnetLead: {
    fr: "Un registre tranquille de ta pratique : les gestes parcourus, la lenteur tenue, l'aisance ressentie.",
    en: "A quiet record of your practice: gestures travelled, slowness held, ease felt.",
  },
  noSessions: {
    fr: "Le carnet est vide. Une première séance l'ouvrira.",
    en: "The journal is empty. A first session will open it.",
  },
  sessionEtude: { fr: "Étude", en: "Study" },
  sessionSouffle: { fr: "Souffle", en: "Breath" },
  sessionPratique: { fr: "Forme", en: "Form" },
  minutes: { fr: "min", en: "min" },

  // réglages
  language: { fr: "Langue", en: "Language" },
  theme: { fr: "Ambiance", en: "Ambiance" },
  themeDay: { fr: "Jour", en: "Day" },
  themeNight: { fr: "Nuit", en: "Night" },
  haptics: { fr: "Tapotements", en: "Haptics" },
  hOff: { fr: "Aucun", en: "Off" },
  hSoft: { fr: "Doux", en: "Soft" },
  hFull: { fr: "Pleins", en: "Full" },
  soundCues: { fr: "Sons", en: "Sound cues" },
  on: { fr: "Activés", en: "On" },
  off: { fr: "Coupés", en: "Off" },
  globalTempo: { fr: "Lenteur générale", en: "Global slowness" },
  resetProgress: { fr: "Réinitialiser la progression", en: "Reset progress" },
  resetConfirm: {
    fr: "Effacer toute la progression, les notes et les séances ? Cette action est définitive.",
    en: "Erase all progress, notes and sessions? This cannot be undone.",
  },
  hapticsUnsupported: {
    fr: "Cet appareil ne vibre pas — les sons et l'arc de rythme prennent le relais.",
    en: "This device can't vibrate — sound and the pacing arc carry the rhythm instead.",
  },
  about: { fr: "À propos", en: "About" },
  aboutBody: {
    fr: "Le Geste Lent réunit deux idées : étudier un geste en profondeur, puis le pratiquer dans la forme, les yeux mi-clos. Pas de scores, pas de séries — un souffle, un geste, tenu jusqu'à ce qu'il devienne tien.",
    en: "Le Geste Lent joins two ideas: study a gesture deeply, then practise it in the form, eyes half-closed. No scores, no streaks — one breath, one gesture, held until it becomes yours.",
  },

  // onboarding
  obWelcome: { fr: "Le Geste Lent", en: "Le Geste Lent" },
  obIntro1Title: { fr: "Un geste à la fois", en: "One gesture at a time" },
  obIntro1Body: {
    fr: "Le tai-chi s'apprend lentement. Ici, chaque mouvement s'étudie seul, scruté image par image, avant que le suivant ne s'ouvre.",
    en: "Tai chi is learned slowly. Here each movement is studied alone, scrubbed frame by frame, before the next one opens.",
  },
  obIntro2Title: { fr: "De face et de profil", en: "Front and profile" },
  obIntro2Body: {
    fr: "Deux silhouettes bougent en parfaite synchronie. Glisse la ligne du temps pour figer n'importe quel angle de poignet ou transfert de poids.",
    en: "Two figures move in perfect sync. Drag the timeline to freeze any wrist angle or shift of weight.",
  },
  obIntro3Title: { fr: "Puis, la forme", en: "Then, the form" },
  obIntro3Body: {
    fr: "Une fois un geste absorbé, pratique-le dans la forme guidée — au rythme du souffle et de doux tapotements, les yeux ouverts ou fermés.",
    en: "Once a gesture is absorbed, practise it in the guided form — paced by the breath and gentle taps, eyes open or closed.",
  },
  obLang: { fr: "Français / English", en: "Français / English" },
  obStart: { fr: "Commencer", en: "Begin" },
  obSkip: { fr: "Passer", en: "Skip" },
  next: { fr: "Suivant", en: "Next" },

  // atelier (AI)
  atelierTitle: { fr: "L'Atelier des Gestes", en: "The Gesture Workshop" },
  atelierLead: {
    fr: "Décris un mouvement de tai-chi ; l'IA le décompose en repères scrutables, de face et de profil.",
    en: "Describe a tai-chi movement; the AI breaks it into scrubbable keyframes, front and profile.",
  },
  atelierPlaceholder: {
    fr: "Ex. : Saisir la queue de l'oiseau — parer, reculer, presser, pousser.",
    en: "e.g. Grasp the Bird's Tail — ward off, roll back, press, push.",
  },
  compose: { fr: "Décomposer", en: "Decompose" },
  composing: { fr: "Décomposition…", en: "Decomposing…" },
  composeFormLead: {
    fr: "Décris une intention — apaiser, délier les épaules, dix minutes au réveil — et l'IA compose une forme à partir de tes gestes.",
    en: "Describe an intention — to calm, to loosen the shoulders, ten minutes at dawn — and the AI composes a form from your gestures.",
  },
  composeFormPlaceholder: {
    fr: "Ex. : Une forme douce de cinq minutes pour relâcher le dos après l'écran.",
    en: "e.g. A gentle five-minute form to release the back after screen time.",
  },
  aiUnavailable: {
    fr: "L'atelier IA s'active une fois l'application déployée avec une clé. En local, le sentier reste pleinement utilisable.",
    en: "The AI workshop activates once the app is deployed with a key. Locally, the path remains fully usable.",
  },
  aiError: { fr: "L'atelier n'a pas répondu. Réessaie.", en: "The workshop didn't answer. Try again." },
  save: { fr: "Garder", en: "Keep" },
  discard: { fr: "Jeter", en: "Discard" },
} satisfies Dict;

export type StrKey = keyof typeof STR;

export function tr(lang: Lang, key: StrKey): string {
  return STR[key][lang];
}
