import type { Context } from "@netlify/functions";
import { decompose, composeForm, reflect, type Lang } from "./lib/sifu.ts";

interface Body {
  mode: "decompose" | "compose-form" | "reflect";
  lang: Lang;
  name?: string;
  description?: string;
  intention?: string;
  gestures?: { slug: string; name: string; family: string }[];
  note?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Stream NDJSON with keepalive heartbeats for the slow Opus calls; the client
// reads to end-of-stream and parses the final {result|error} line.
function ndjson(run: () => Promise<unknown>, lang: Lang): Response {
  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let done = false;
      const beat = setInterval(() => {
        if (!done) {
          try {
            controller.enqueue(enc.encode("\n"));
          } catch {
            /* closed */
          }
        }
      }, 3000);
      try {
        const result = await run();
        done = true;
        clearInterval(beat);
        controller.enqueue(enc.encode(JSON.stringify({ result }) + "\n"));
      } catch (err) {
        done = true;
        clearInterval(beat);
        const message =
          err instanceof Error ? err.message : lang === "en" ? "Unknown error" : "Erreur inconnue";
        controller.enqueue(enc.encode(JSON.stringify({ error: message }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const lang: Lang = body.lang === "en" ? "en" : "fr";

  try {
    if (body.mode === "decompose") {
      const name = (body.name ?? "").trim();
      if (name.length < 2) return json({ error: lang === "en" ? "Name the movement first." : "Nomme d'abord le mouvement." }, 400);
      return ndjson(() => decompose(name, (body.description ?? "").trim(), lang), lang);
    }
    if (body.mode === "compose-form") {
      const intention = (body.intention ?? "").trim();
      const gestures = body.gestures ?? [];
      if (intention.length < 4) return json({ error: lang === "en" ? "Describe the intention." : "Décris l'intention." }, 400);
      if (gestures.length === 0) return json({ error: lang === "en" ? "Absorb a gesture first." : "Absorbe d'abord un geste." }, 400);
      return ndjson(() => composeForm(intention, lang, gestures), lang);
    }
    if (body.mode === "reflect") {
      const note = (body.note ?? "").trim();
      if (note.length < 3) return json({ error: "note too short" }, 400);
      return json(await reflect(note, lang));
    }
    return json({ error: "Unknown mode" }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
};
