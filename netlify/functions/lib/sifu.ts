import Anthropic from "@anthropic-ai/sdk";

export type Lang = "fr" | "en";

const MODEL = "claude-opus-4-8"; // depth for the limb decomposition
const FAST = "claude-haiku-4-5"; // low-latency reflection

function client(): Anthropic {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Server missing CLAUDE_API_KEY");
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
}

const VOICE = `You are the sifu of "Le Geste Lent", a patient tai-chi tutor in the Yang tradition. You teach beginners one slow movement at a time. You are precise about the body — weight transfer, the angle of a wrist, the bend of a knee, the breath — and gentle in tone, never showy. You write idiomatic Québécois French and clear English; cues are short, calm, sensory, present-tense. You never invent mystical nonsense; you describe what the body actually does.`;

// The skeleton coordinate contract shared with the client renderer.
const SKELETON = `SKELETON COORDINATE SYSTEM (critical):
- A 2D box 100 wide × 130 tall. x grows RIGHT, y grows DOWN. Center line x=50.
- Head ~y13, shoulders ~y28, pelvis ~y56, knees ~y86, feet/ankles ~y116, floor y≈120.
- Joints (names are exact): head, neck, pelvis, shoulderL, shoulderR, elbowL, elbowR, wristL, wristR, hipL, hipR, kneeL, kneeR, ankleL, ankleR, toeL, toeR.
- L/R mean the SCREEN sides: L = left of frame, R = right of frame (NOT anatomical).
- Provide TWO synchronized views per keyframe: "front" (figure faces the viewer) and "profile" (figure faces RIGHT, so +x is the direction the body faces).
- In each keyframe's front/profile objects, include ONLY the joints that move away from a relaxed standing posture (Wuji). Unlisted joints stay at their neutral standing position. Always include moved limbs' chain (e.g. if the wrist moves, give elbow too).
- Neutral standing reference — front: shoulderL[41,28] shoulderR[59,28] elbowL[38,41] elbowR[62,41] wristL[37,54] wristR[63,54] hipL[44,58] hipR[56,58] kneeL[43,86] kneeR[57,86] ankleL[43,116] ankleR[57,116].
- Keyframes: 3 to 5 of them, t from 0 (start) to 1 (end), in order. The first keyframe is the entry posture, the last is the completed posture.
- breath: "in" (inhale), "out" (exhale), or "hold". weight: percent of body weight on the SCREEN-RIGHT foot (50 = even, higher = more on the right).`;

function langLine(lang: Lang) {
  return lang === "fr"
    ? "The interface language is French; make the French primary and natural, English a faithful equivalent."
    : "The interface language is English; both languages should read naturally.";
}

// ── decompose a movement into keyframes ───────────────────────────────────────
const DECOMPOSE_TOOL: Anthropic.Tool = {
  name: "deliver_gesture",
  description: "Deliver one tai-chi movement broken into synchronized front+profile keyframes.",
  input_schema: {
    type: "object",
    required: [
      "name_fr",
      "name_en",
      "hanzi",
      "pinyin",
      "family_fr",
      "family_en",
      "intro_fr",
      "intro_en",
      "baseDurationMs",
      "keyframes",
    ],
    properties: {
      name_fr: { type: "string" },
      name_en: { type: "string" },
      hanzi: { type: "string", description: "Chinese characters for the movement, or empty string." },
      pinyin: { type: "string", description: "Pinyin with tone marks, or empty string." },
      family_fr: { type: "string", description: "A one-word family, e.g. Ouverture, Séparation, Équilibre." },
      family_en: { type: "string" },
      intro_fr: { type: "string", description: "2–3 calm sentences introducing the gesture." },
      intro_en: { type: "string" },
      baseDurationMs: { type: "number", description: "Natural duration of one slow pass in ms (10000–18000)." },
      keyframes: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          required: ["t", "breath", "weight", "cue_fr", "cue_en", "front", "profile"],
          properties: {
            t: { type: "number", description: "0 to 1, in order." },
            breath: { type: "string", enum: ["in", "out", "hold"] },
            weight: { type: "number", description: "0–100, percent on the screen-right foot." },
            cue_fr: { type: "string" },
            cue_en: { type: "string" },
            front: {
              type: "object",
              description: "Moved joints only → [x,y]. Front view.",
              additionalProperties: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 },
            },
            profile: {
              type: "object",
              description: "Moved joints only → [x,y]. Profile view (faces right).",
              additionalProperties: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 },
            },
          },
        },
      },
    },
  },
};

export async function decompose(name: string, description: string, lang: Lang) {
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: `${VOICE}\n\n${SKELETON}\n\n${langLine(lang)}`,
    tools: [DECOMPOSE_TOOL],
    tool_choice: { type: "tool", name: "deliver_gesture" },
    messages: [
      {
        role: "user",
        content: `Decompose this tai-chi movement into scrubbable keyframes.\n\nMovement: ${name}\nNotes: ${description || "(none)"}\n\nBe anatomically faithful: show the real weight transfer and the path of the hands. Keep cues short and sensory.`,
      },
    ],
  });
  return extractTool(msg);
}

// ── compose a form from the practitioner's gestures ───────────────────────────
const FORM_TOOL: Anthropic.Tool = {
  name: "deliver_form",
  description: "Compose a coherent tai-chi form from the available gestures.",
  input_schema: {
    type: "object",
    required: [
      "name_fr",
      "name_en",
      "level_fr",
      "level_en",
      "description_fr",
      "description_en",
      "loop",
      "postures",
    ],
    properties: {
      name_fr: { type: "string" },
      name_en: { type: "string" },
      level_fr: { type: "string", description: "e.g. Débutant, Méditatif, Apaisant." },
      level_en: { type: "string" },
      description_fr: { type: "string", description: "2–3 sentences on the form's intention and feel." },
      description_en: { type: "string" },
      loop: { type: "boolean", description: "true if the sequence is meant to loop endlessly." },
      postures: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["gestureSlug", "transitionMs", "dwellMs"],
          properties: {
            gestureSlug: { type: "string", description: "Must be one of the provided gesture slugs." },
            transitionMs: { type: "number", description: "ms to flow through the gesture (8000–20000)." },
            dwellMs: { type: "number", description: "ms to settle in the posture (2000–8000)." },
          },
        },
      },
    },
  },
};

export async function composeForm(
  intention: string,
  lang: Lang,
  gestures: { slug: string; name: string; family: string }[],
) {
  const list = gestures.map((g) => `- ${g.slug} — ${g.name} (${g.family})`).join("\n");
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: `${VOICE}\n\n${langLine(lang)}\n\nYou may ONLY use gestures from the practitioner's available list, by their exact slug. Order them so the body flows naturally (open → move → close). A gesture may repeat. Match length to the stated intention.`,
    tools: [FORM_TOOL],
    tool_choice: { type: "tool", name: "deliver_form" },
    messages: [
      {
        role: "user",
        content: `Compose a tai-chi form for this intention:\n"${intention}"\n\nAvailable gestures (use exact slugs):\n${list}`,
      },
    ],
  });
  return extractTool(msg);
}

// ── reflect on a felt-sense note (fast) ───────────────────────────────────────
const REFLECT_TOOL: Anthropic.Tool = {
  name: "deliver_reflection",
  description: "Offer one gentle line of reflection and a tempo suggestion.",
  input_schema: {
    type: "object",
    required: ["reflection", "tempo"],
    properties: {
      reflection: { type: "string", description: "ONE warm, specific sentence responding to the note." },
      tempo: { type: "string", enum: ["slower", "same", "quicker"] },
    },
  },
};

export async function reflect(note: string, lang: Lang) {
  const msg = await client().messages.create({
    model: FAST,
    max_tokens: 300,
    system: `${VOICE}\n\n${langLine(lang)}\n\nRespond to the practitioner's felt-sense note with exactly one kind, specific sentence — no lists, no preaching. Suggest a tempo: "slower" if they seem rushed or tense, "quicker" if too sleepy/disengaged, otherwise "same".`,
    tools: [REFLECT_TOOL],
    tool_choice: { type: "tool", name: "deliver_reflection" },
    messages: [{ role: "user", content: note }],
  });
  return extractTool(msg);
}

function extractTool(msg: Anthropic.Message): unknown {
  for (const block of msg.content) {
    if (block.type === "tool_use") return block.input;
  }
  throw new Error("Model returned no structured output");
}
