import { useEffect, useMemo, useRef, useState } from "react";
import { useForms, useGestures } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { GESTURES, type Gesture } from "../data/gestures";
import { sampleGesture, easeInOut } from "../lib/pose";
import { haptic } from "../lib/haptics";
import { chime, primeSound } from "../lib/sound";
import { logSession } from "../db";
import DualView from "../components/DualView";
import BreathMarker from "../components/BreathMarker";
import { BackBar, Btn, Page, PageTitle } from "../components/ui";

type Phase = "transition" | "dwell";
interface Resolved {
  gesture: Gesture;
  transitionMs: number;
  dwellMs: number;
}

export default function Pratique({ slug }: { slug: string }) {
  const forms = useForms();
  const gestures = useGestures();
  const { t, lang, slowness, haptics, sound } = useSettings();
  const form = forms.find((f) => f.slug === slug);

  const resolved = useMemo<Resolved[]>(() => {
    if (!form) return [];
    const lookup = (s: string): Gesture | undefined =>
      gestures.find((g) => g.slug === s) ?? GESTURES.find((g) => g.slug === s);
    return form.postures
      .map((p) => {
        const g = lookup(p.gestureSlug);
        return g ? { gesture: g, transitionMs: p.transitionMs, dwellMs: p.dwellMs } : null;
      })
      .filter((x): x is Resolved => x !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.slug, gestures.length]);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("transition");
  const [phaseT, setPhaseT] = useState(0);
  const [local, setLocal] = useState(0); // eased position within the gesture
  const [loops, setLoops] = useState(0);

  // engine refs (avoid stale closures inside rAF)
  const idxRef = useRef(0);
  const phaseRef = useRef<Phase>("transition");
  const phaseStart = useRef(0);
  const startedAt = useRef(0);
  const lastWeight = useRef(50);
  const raf = useRef<number | null>(null);
  const cfg = useRef({ slowness, haptics, sound });
  cfg.current = { slowness, haptics, sound };

  const cue = (c: "begin" | "settle" | "switch" | "complete") => {
    haptic(c, cfg.current.haptics);
    chime(c, cfg.current.sound);
  };

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const finish = () => {
    stop();
    setRunning(false);
    setDone(true);
    cue("complete");
    if (form) {
      void logSession({
        kind: "pratique",
        refSlug: slug,
        refName: form.name[lang],
        date: Date.now(),
        durationMs: Date.now() - startedAt.current,
        loops: form.loop ? loops : undefined,
      });
    }
  };

  const begin = () => {
    if (resolved.length === 0) return;
    primeSound();
    idxRef.current = 0;
    phaseRef.current = "transition";
    phaseStart.current = performance.now();
    startedAt.current = Date.now();
    lastWeight.current = 50;
    setIdx(0);
    setPhase("transition");
    setLoops(0);
    setDone(false);
    setRunning(true);
    cue("begin");
  };

  useEffect(() => {
    if (!running) return;
    const frame = (now: number) => {
      const cur = resolved[idxRef.current];
      if (!cur) {
        finish();
        return;
      }
      const isTrans = phaseRef.current === "transition";
      const dur = (isTrans ? cur.transitionMs : cur.dwellMs) * cfg.current.slowness;
      let pt = (now - phaseStart.current) / dur;

      if (pt >= 1) {
        if (isTrans) {
          phaseRef.current = "dwell";
          phaseStart.current = now;
          setPhase("dwell");
          cue("settle");
          pt = 0;
        } else {
          const next = idxRef.current + 1;
          if (next >= resolved.length) {
            if (form?.loop) {
              idxRef.current = 0;
              phaseRef.current = "transition";
              phaseStart.current = now;
              setIdx(0);
              setPhase("transition");
              setLoops((n) => n + 1);
              cue("begin");
              pt = 0;
            } else {
              finish();
              return;
            }
          } else {
            idxRef.current = next;
            phaseRef.current = "transition";
            phaseStart.current = now;
            setIdx(next);
            setPhase("transition");
            cue("begin");
            pt = 0;
          }
        }
      }

      const g = resolved[idxRef.current].gesture;
      const eased = phaseRef.current === "transition" ? easeInOut(pt) : 1;
      const s = sampleGesture(g.keyframes, eased);

      // detect a weight side-switch during a transition → flutter
      if (phaseRef.current === "transition") {
        const crossed =
          (lastWeight.current < 50 && s.weight > 50) || (lastWeight.current > 50 && s.weight < 50);
        if (crossed && Math.abs(s.weight - 50) > 3) cue("switch");
        lastWeight.current = s.weight;
      }

      setLocal(eased);
      setPhaseT(pt);
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => stop, []);

  if (!form) {
    return (
      <Page>
        <BackBar to="/formes" />
        <p className="mt-10 text-sumi-soft">…</p>
      </Page>
    );
  }

  // ── ready screen ────────────────────────────────────────────────────────────
  if (!running && !done) {
    return (
      <Page>
        <BackBar to="/formes" />
        <div className="mt-4">
          <PageTitle title={form.name[lang]} lead={form.description[lang]} />
        </div>
        <ol className="space-y-2">
          {resolved.map((r, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-sumi-faint/25 bg-leaf px-4 py-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-sumi/5 text-[12px] text-sumi-soft tabular-nums">
                {i + 1}
              </span>
              <span className="font-serif text-[1.05rem]">{r.gesture.name[lang]}</span>
              <span className="ml-auto font-serif text-sumi-faint text-sm">{r.gesture.hanzi}</span>
            </li>
          ))}
        </ol>
        <div className="mt-7">
          <Btn variant="accent" className="w-full" onClick={begin}>
            ▶ {t("begin")}
          </Btn>
          <p className="mt-2 text-center text-[12.5px] text-sumi-faint">{t("eyesOptional")}</p>
        </div>
      </Page>
    );
  }

  // ── done screen ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <Page>
        <div className="mt-24 flex flex-col items-center text-center fade-up">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-celadon/15 text-celadon-deep">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h1 className="mt-5 font-serif text-[1.8rem]">{t("done")}</h1>
          <p className="mt-2 text-sumi-soft">{form.name[lang]}</p>
          <div className="mt-7 flex gap-3">
            <Btn variant="ghost" onClick={() => go("/formes")}>
              {t("navFormes")}
            </Btn>
            <Btn variant="quiet" onClick={() => go("/carnet")}>
              {t("navCarnet")}
            </Btn>
          </div>
        </div>
      </Page>
    );
  }

  // ── running screen (eyes-optional) ──────────────────────────────────────────
  const cur = resolved[idx];
  const s = sampleGesture(cur.gesture.keyframes, local);
  const arcLen = phase === "transition" ? phaseT : 1;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-5 pt-6 pb-32 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <BackBar to={`/f/${slug}`} label={t("done")} />
          <span className="text-[12px] text-sumi-faint tabular-nums">
            {idx + 1} / {resolved.length}
            {form.loop && loops > 0 ? ` · ${loops}∞` : ""}
          </span>
        </div>

        {/* the sweeping pacing arc over the figure */}
        <div className="relative mt-6 mx-auto w-full max-w-md">
          <svg viewBox="0 0 100 56" className="w-full">
            <path d="M 6 52 A 44 44 0 0 1 94 52" fill="none" stroke="rgb(var(--sumi-faint) / 0.3)" strokeWidth="1.4" strokeLinecap="round" />
            <path
              d="M 6 52 A 44 44 0 0 1 94 52"
              fill="none"
              stroke={phase === "transition" ? "rgb(var(--celadon))" : "rgb(var(--celadon-deep))"}
              strokeWidth="2.4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - arcLen}
              style={{ transition: "stroke-dashoffset 0.12s linear" }}
            />
          </svg>
          <div className="absolute inset-x-0 top-3 text-center">
            <span className="text-[11px] uppercase tracking-wide3 text-sumi-faint">
              {phase === "transition" ? t("transition") : t("settle")}
            </span>
          </div>
        </div>

        <div className="-mt-2 text-center">
          <div className="font-serif text-lg text-sumi-faint">{cur.gesture.hanzi}</div>
          <h1 className="font-serif text-[clamp(1.6rem,6vw,2.3rem)] leading-tight">{cur.gesture.name[lang]}</h1>
        </div>

        <div className="mt-5">
          <DualView front={s.front} profile={s.profile} weight={s.weight} active />
        </div>

        <div className="mt-7 flex flex-col items-center gap-4">
          <BreathMarker breath={s.breath} size={60} />
          <p className="min-h-[3rem] max-w-md text-center font-serif italic text-[clamp(1rem,3.6vw,1.25rem)] leading-snug text-sumi">
            {s.cue[lang]}
          </p>
        </div>

        <div className="mt-auto pt-7 flex items-center justify-center">
          <Btn variant="quiet" onClick={finish}>
            ⏹ {t("finishSession")}
          </Btn>
        </div>
      </div>
    </div>
  );
}
