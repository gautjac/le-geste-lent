import { useGestures, type GestureView } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { Page } from "../components/ui";

function StatusDot({ g }: { g: GestureView }) {
  if (g.status === "absorbed")
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-celadon/15 text-celadon-deep">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  if (g.status === "locked")
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-sumi/5 text-sumi-faint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </span>
    );
  return (
    <span
      className={`grid h-7 w-7 place-items-center rounded-full border ${
        g.justUnlocked ? "border-vermilion text-vermilion" : "border-celadon text-celadon-deep"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${g.justUnlocked ? "bg-vermilion" : "bg-celadon"}`} />
    </span>
  );
}

export default function Sentier() {
  const gestures = useGestures();
  const { t, lang } = useSettings();
  const absorbed = gestures.filter((g) => g.status === "absorbed").length;

  return (
    <Page>
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-wide3 text-sumi-faint">{t("tagline")}</p>
        <h1 className="mt-2 font-serif text-[clamp(2.2rem,8vw,3.2rem)] leading-[1] tracking-[-0.02em]">
          {t("appName")}
        </h1>
        <p className="mt-4 max-w-prose text-sumi-soft leading-relaxed text-[15px]">
          {t("sentierLead")}
        </p>
        <p className="mt-3 text-[13px] text-sumi-faint">
          {absorbed} / {gestures.length} {t("absorbedCount")}
        </p>
      </header>

      <ol className="relative space-y-2">
        {/* the slow ladder rail */}
        <span className="absolute left-[27px] top-3 bottom-3 w-px bg-sumi-faint/25" aria-hidden />
        {gestures.map((g, i) => {
          const locked = g.status === "locked";
          return (
            <li key={g.slug} style={{ animationDelay: `${i * 45}ms` }} className="fade-up">
              <button
                disabled={locked}
                onClick={() => go(`/g/${g.slug}`)}
                className={`group relative z-10 flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                  locked
                    ? "border-transparent cursor-default opacity-55"
                    : g.justUnlocked
                      ? "border-vermilion/45 bg-leaf shadow-rise hover:border-vermilion/70"
                      : "border-sumi-faint/30 bg-leaf shadow-rise hover:border-celadon/60 hover:-translate-y-0.5"
                }`}
              >
                <StatusDot g={g} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-[1.15rem] leading-tight text-sumi truncate">
                      {g.name[lang]}
                    </span>
                    <span className="font-serif text-sumi-faint text-sm shrink-0">{g.hanzi}</span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-sumi-faint">
                    {locked ? (
                      t("lockedHint")
                    ) : (
                      <>
                        {g.family[lang]}
                        {g.justUnlocked && (
                          <span className="ml-2 text-vermilion">· {t("justUnlocked")}</span>
                        )}
                        {g.status === "absorbed" && <span className="ml-2 text-celadon-deep">· {t("absorbed")}</span>}
                      </>
                    )}
                  </span>
                </span>
                {!locked && (
                  <span className="text-sumi-faint transition-transform group-hover:translate-x-0.5">→</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 text-center">
        <button
          onClick={() => go("/atelier")}
          className="text-[14px] text-sumi-soft hover:text-celadon-deep transition-colors underline-offset-4 hover:underline"
        >
          + {t("atelierTitle")}
        </button>
      </div>
    </Page>
  );
}
