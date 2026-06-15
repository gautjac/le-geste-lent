import { useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { sampleGesture } from "../lib/pose";
import { logSession } from "../db";
import DualView from "../components/DualView";
import Scrubber from "../components/Scrubber";
import BreathMarker from "../components/BreathMarker";
import { BackBar, Btn, Page } from "../components/ui";

export default function Etude({ slug }: { slug: string }) {
  const g = useGesture(slug);
  const { t, lang } = useSettings();
  const [pos, setPos] = useState(0);
  const started = useRef(Date.now());

  // log an étude session if the practitioner lingered
  useEffect(() => {
    const begin = started.current;
    const name = g?.name[lang] ?? slug;
    return () => {
      const elapsed = Date.now() - begin;
      if (elapsed > 15000) {
        void logSession({ kind: "etude", refSlug: slug, refName: name, date: Date.now(), durationMs: elapsed });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const sample = useMemo(() => (g ? sampleGesture(g.keyframes, pos) : null), [g, pos]);

  // ghost = the next keyframe ahead of the playhead, to show where the motion goes
  const ghost = useMemo(() => {
    if (!g) return null;
    const next = g.keyframes.find((k) => k.t > pos + 0.001);
    return next ?? null;
  }, [g, pos]);

  if (!g || !sample) {
    return (
      <Page>
        <BackBar />
        <p className="mt-10 text-sumi-soft">…</p>
      </Page>
    );
  }

  const onRight = sample.weight > 50;
  const weightPct = Math.round(sample.weight);

  return (
    <Page>
      <BackBar />
      <header className="mt-4 mb-5">
        <div className="flex items-baseline gap-3 text-sumi-faint mb-1">
          <span className="font-serif text-xl">{g.hanzi}</span>
          <span className="italic text-[14px]">{g.pinyin}</span>
        </div>
        <h1 className="font-serif text-[clamp(1.7rem,5.5vw,2.3rem)] leading-[1.05] tracking-[-0.01em]">
          {g.name[lang]}
        </h1>
      </header>

      <DualView
        front={sample.front}
        profile={sample.profile}
        weight={sample.weight}
        ghostFront={ghost?.front}
        ghostProfile={ghost?.profile}
        active
      />

      {/* breath + weight + keyframe */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <BreathMarker breath={sample.breath} />
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide3 text-sumi-faint">
            {t("weight")}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[13px] text-sumi-soft tabular-nums">
              {onRight ? `${weightPct}% ${t("weightRight")}` : `${100 - weightPct}% ${t("weightLeft")}`}
            </span>
            <span className="relative block h-1.5 w-20 rounded-full bg-sumi-faint/30">
              <span
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-celadon-deep transition-all duration-300"
                style={{ left: `calc(${sample.weight}% - 6px)` }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* the active cue */}
      <p className="mt-5 min-h-[3.5rem] font-serif italic text-[clamp(1.05rem,3.6vw,1.3rem)] leading-snug text-sumi">
        {sample.cue[lang]}
      </p>

      {/* the film-strip timeline */}
      <div className="mt-4">
        <Scrubber keyframes={g.keyframes} value={pos} onChange={setPos} nearestIndex={sample.nearestIndex} />
        <p className="mt-2 text-[12px] text-sumi-faint">{t("scrubHint")}</p>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Btn variant="accent" onClick={() => go(`/g/${slug}/souffle`)}>
          ◴ {t("playBreath")}
        </Btn>
        <Btn variant="ghost" onClick={() => go(`/g/${slug}/ressenti`)}>
          {t("openRessenti")}
        </Btn>
      </div>

      <details className="mt-7 group">
        <summary className="cursor-pointer list-none text-[13px] text-sumi-faint hover:text-sumi-soft">
          <span className="group-open:hidden">＋ {g.name[lang]}</span>
          <span className="hidden group-open:inline">－</span>
        </summary>
        <p className="mt-3 text-[14.5px] leading-relaxed text-sumi-soft">{g.intro[lang]}</p>
      </details>
    </Page>
  );
}
