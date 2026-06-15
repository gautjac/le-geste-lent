import { useMemo, useState } from "react";
import { useGestures } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { decomposeGesture } from "../api";
import type { Gesture } from "../data/gestures";
import { sampleGesture } from "../lib/pose";
import { db } from "../db";
import DualView from "../components/DualView";
import Scrubber from "../components/Scrubber";
import { BackBar, Btn, Page, PageTitle } from "../components/ui";

export default function Atelier() {
  const gestures = useGestures();
  const { t, lang } = useSettings();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Gesture | null>(null);
  const [pos, setPos] = useState(0);

  const nextOrder = useMemo(
    () => Math.max(0, ...gestures.map((g) => g.order)) + 1,
    [gestures],
  );

  const run = async () => {
    setError(null);
    setBusy(true);
    try {
      const g = await decomposeGesture(name.trim(), desc.trim(), lang, nextOrder);
      setDraft(g);
      setPos(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("aiError"));
    } finally {
      setBusy(false);
    }
  };

  const keep = async () => {
    if (!draft) return;
    await db.customGestures.put({ slug: draft.slug, gesture: draft });
    go(`/g/${draft.slug}`);
  };

  const sample = draft ? sampleGesture(draft.keyframes, pos) : null;

  return (
    <Page>
      <BackBar to="/" />
      <div className="mt-4">
        <PageTitle title={t("atelierTitle")} lead={t("atelierLead")} />
      </div>

      {!draft && (
        <div className="rounded-2xl border border-sumi-faint/30 bg-leaf p-4 shadow-rise">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === "fr" ? "Nom du mouvement" : "Movement name"}
            className="w-full bg-transparent font-serif text-[18px] text-sumi placeholder:text-sumi-faint/70 focus:outline-none"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t("atelierPlaceholder")}
            rows={3}
            className="mt-3 w-full resize-none border-t border-sumi-faint/20 pt-3 bg-transparent text-[15px] leading-relaxed text-sumi placeholder:text-sumi-faint/70 focus:outline-none"
          />
          <div className="mt-3 flex justify-end">
            <Btn variant="accent" onClick={run} disabled={busy || name.trim().length < 2}>
              {busy ? t("composing") : t("compose")}
            </Btn>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-vermilion/10 px-4 py-3 text-[14px] leading-relaxed text-vermilion">
          {error}
          <span className="mt-1 block text-sumi-faint">{t("aiUnavailable")}</span>
        </p>
      )}

      {draft && sample && (
        <div className="mt-2 fade-up">
          <div className="mb-3 flex items-baseline gap-3 text-sumi-faint">
            <span className="font-serif text-xl">{draft.hanzi}</span>
            <span className="italic text-[14px]">{draft.pinyin}</span>
          </div>
          <h2 className="font-serif text-[1.5rem] leading-tight mb-4">{draft.name[lang]}</h2>
          <DualView
            front={sample.front}
            profile={sample.profile}
            weight={sample.weight}
            active
          />
          <p className="mt-4 min-h-[3rem] font-serif italic text-[1.1rem] leading-snug text-sumi">
            {sample.cue[lang]}
          </p>
          <div className="mt-3">
            <Scrubber keyframes={draft.keyframes} value={pos} onChange={setPos} nearestIndex={sample.nearestIndex} />
          </div>
          <p className="mt-4 text-[14.5px] leading-relaxed text-sumi-soft">{draft.intro[lang]}</p>
          <div className="mt-6 flex gap-3">
            <Btn variant="accent" onClick={keep}>
              ✓ {t("save")}
            </Btn>
            <Btn variant="quiet" onClick={() => setDraft(null)}>
              {t("discard")}
            </Btn>
          </div>
        </div>
      )}
    </Page>
  );
}
