import { useMemo, useRef, useState } from "react";
import { useGesture } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { sampleGesture, easeInOut } from "../lib/pose";
import { usePlayhead } from "../lib/usePlayhead";
import { logSession } from "../db";
import DualView from "../components/DualView";
import BreathMarker from "../components/BreathMarker";
import { BackBar, Btn } from "../components/ui";

export default function Souffle({ slug }: { slug: string }) {
  const g = useGesture(slug);
  const { t, lang, slowness, set } = useSettings();
  const [playing, setPlaying] = useState(true);
  const [loops, setLoops] = useState(0);
  const startedAt = useRef(Date.now());

  const duration = (g?.baseDurationMs ?? 12000) * slowness;
  const { t: raw } = usePlayhead({
    durationMs: duration,
    playing,
    loop: true,
    resetKey: slug,
    onLoop: () => setLoops((n) => n + 1),
  });

  const sample = useMemo(
    () => (g ? sampleGesture(g.keyframes, easeInOut(raw)) : null),
    [g, raw],
  );

  if (!g || !sample) return null;

  const finish = () => {
    const elapsed = Date.now() - startedAt.current;
    if (loops > 0 || elapsed > 20000) {
      void logSession({
        kind: "souffle",
        refSlug: slug,
        refName: g.name[lang],
        date: Date.now(),
        durationMs: elapsed,
        loops,
      });
    }
    go(`/g/${slug}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-5 pt-6 pb-32 flex-1 flex flex-col fade-up">
        <BackBar to={`/g/${slug}`} />

        <div className="mt-6 text-center">
          <div className="font-serif text-lg text-sumi-faint">{g.hanzi}</div>
          <h1 className="font-serif text-[clamp(1.5rem,5vw,2rem)] leading-tight">{g.name[lang]}</h1>
        </div>

        <div className="mt-6">
          <DualView front={sample.front} profile={sample.profile} weight={sample.weight} active />
        </div>

        <div className="mt-7 flex flex-col items-center gap-5">
          <BreathMarker breath={sample.breath} size={68} />
          <p className="min-h-[3rem] max-w-md text-center font-serif italic text-[clamp(1.05rem,3.8vw,1.3rem)] leading-snug text-sumi">
            {sample.cue[lang]}
          </p>
        </div>

        {/* tempo */}
        <div className="mt-6 mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide3 text-sumi-faint">
            <span>{t("slower")}</span>
            <span>{t("tempo")}</span>
            <span>{t("faster")}</span>
          </div>
          <input
            className="scrub mt-2 w-full"
            type="range"
            min={0.6}
            max={2}
            step={0.05}
            // higher slowness should sit to the LEFT, so invert the visual value
            value={2.6 - slowness}
            onChange={(e) => set("slowness", Number((2.6 - Number(e.target.value)).toFixed(2)))}
            aria-label={t("tempo")}
          />
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Btn variant={playing ? "ghost" : "accent"} onClick={() => setPlaying((p) => !p)}>
            {playing ? `⏸ ${t("pause")}` : `▶ ${t("play")}`}
          </Btn>
          <Btn variant="quiet" onClick={finish}>
            {t("finishSession")}
          </Btn>
        </div>

        <p className="mt-4 text-center text-[12px] text-sumi-faint tabular-nums">
          {loops} {t("loopsDone")}
        </p>
      </div>
    </div>
  );
}
