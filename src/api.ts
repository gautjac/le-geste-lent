import { front, profile, JOINTS, type Joint, type Overrides } from "./data/skeleton";
import type { Breath, Gesture, Keyframe } from "./data/gestures";
import type { Form, FormPosture } from "./data/forms";
import type { Lang } from "./i18n";

// ── raw shapes returned by the model (joint overrides only) ───────────────────
interface RawKeyframe {
  t: number;
  breath: Breath;
  weight: number;
  cue_fr: string;
  cue_en: string;
  front: Record<string, [number, number]>;
  profile: Record<string, [number, number]>;
}
interface RawGesture {
  name_fr: string;
  name_en: string;
  hanzi: string;
  pinyin: string;
  family_fr: string;
  family_en: string;
  intro_fr: string;
  intro_en: string;
  baseDurationMs: number;
  keyframes: RawKeyframe[];
}
interface RawForm {
  name_fr: string;
  name_en: string;
  level_fr: string;
  level_en: string;
  description_fr: string;
  description_en: string;
  loop: boolean;
  postures: { gestureSlug: string; transitionMs: number; dwellMs: number }[];
}
export interface Reflection {
  reflection: string;
  tempo: "slower" | "same" | "quicker";
}

const JOINT_SET = new Set<string>(JOINTS);
function asOverrides(raw: Record<string, [number, number]>): Overrides {
  const o: Overrides = {};
  for (const [k, v] of Object.entries(raw)) {
    if (JOINT_SET.has(k) && Array.isArray(v) && v.length === 2) {
      o[k as Joint] = [Number(v[0]), Number(v[1])];
    }
  }
  return o;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "geste";
}

/** Read an NDJSON keepalive stream and return the final {result} payload. */
async function readNdjson<T>(res: Response, lang: Lang): Promise<T> {
  const raw = await res.text();
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] ?? "";
  let parsed: { result?: T; error?: string } | null = null;
  try {
    parsed = last ? JSON.parse(last) : null;
  } catch {
    parsed = null;
  }
  const invalid = lang === "en" ? "Invalid response from the workshop." : "Réponse invalide de l'atelier.";
  if (!res.ok) {
    const fb = lang === "en" ? `Error ${res.status}` : `Erreur ${res.status}`;
    throw new Error(parsed?.error || fb);
  }
  if (!parsed) throw new Error(invalid);
  if (parsed.error) throw new Error(parsed.error);
  if (parsed.result) return parsed.result;
  throw new Error(invalid);
}

export async function decomposeGesture(
  name: string,
  description: string,
  lang: Lang,
  order: number,
): Promise<Gesture> {
  const res = await fetch("/api/geste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "decompose", lang, name, description }),
  });
  const r = await readNdjson<RawGesture>(res, lang);
  const keyframes: Keyframe[] = r.keyframes
    .slice()
    .sort((a, b) => a.t - b.t)
    .map((k) => ({
      t: Math.max(0, Math.min(1, k.t)),
      breath: k.breath,
      weight: Math.max(0, Math.min(100, k.weight)),
      cue: { fr: k.cue_fr, en: k.cue_en },
      front: front(asOverrides(k.front)),
      profile: profile(asOverrides(k.profile)),
    }));
  return {
    slug: `${slugify(r.name_en || r.name_fr)}-${Date.now().toString(36)}`,
    order,
    name: { fr: r.name_fr, en: r.name_en },
    hanzi: r.hanzi || "",
    pinyin: r.pinyin || "",
    family: { fr: r.family_fr, en: r.family_en },
    intro: { fr: r.intro_fr, en: r.intro_en },
    baseDurationMs: r.baseDurationMs || 12000,
    keyframes,
    custom: true,
  };
}

export async function composeForm(
  intention: string,
  lang: Lang,
  gestures: { slug: string; name: string; family: string }[],
): Promise<Form> {
  const res = await fetch("/api/geste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "compose-form", lang, intention, gestures }),
  });
  const r = await readNdjson<RawForm>(res, lang);
  const valid = new Set(gestures.map((g) => g.slug));
  const postures: FormPosture[] = r.postures
    .filter((p) => valid.has(p.gestureSlug))
    .map((p) => ({
      gestureSlug: p.gestureSlug,
      transitionMs: Math.max(4000, Math.min(30000, p.transitionMs || 12000)),
      dwellMs: Math.max(1000, Math.min(12000, p.dwellMs || 4000)),
    }));
  if (postures.length === 0) {
    throw new Error(lang === "en" ? "No usable postures were returned." : "Aucune posture exploitable.");
  }
  return {
    slug: `${slugify(r.name_en || r.name_fr)}-${Date.now().toString(36)}`,
    name: { fr: r.name_fr, en: r.name_en },
    tradition: "—",
    level: { fr: r.level_fr, en: r.level_en },
    description: { fr: r.description_fr, en: r.description_en },
    loop: !!r.loop,
    postures,
    custom: true,
  };
}

export async function reflect(note: string, lang: Lang): Promise<Reflection> {
  const res = await fetch("/api/geste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "reflect", lang, note }),
  });
  const data = (await res.json().catch(() => null)) as Reflection | { error?: string } | null;
  if (!res.ok || !data || "error" in data) {
    throw new Error((data as { error?: string } | null)?.error || "reflect failed");
  }
  return data as Reflection;
}
