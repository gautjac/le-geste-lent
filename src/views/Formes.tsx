import { useForms, useGestures } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { GESTURES } from "../data/gestures";
import { Page, PageTitle } from "../components/ui";

export default function Formes() {
  const forms = useForms();
  const gestures = useGestures();
  const { t, lang } = useSettings();

  const absorbedSet = new Set(gestures.filter((g) => g.status === "absorbed").map((g) => g.slug));
  const nameOf = (slug: string) =>
    gestures.find((g) => g.slug === slug)?.name[lang] ??
    GESTURES.find((g) => g.slug === slug)?.name[lang] ??
    slug;

  return (
    <Page>
      <PageTitle title={t("navFormes")} lead={t("formesLead")} />

      <div className="space-y-4">
        {forms.map((f, i) => {
          const unlocked = f.postures.some((p) => absorbedSet.has(p.gestureSlug));
          const postureNames = [...new Set(f.postures.map((p) => nameOf(p.gestureSlug)))];
          return (
            <article
              key={f.slug}
              style={{ animationDelay: `${i * 50}ms` }}
              className="fade-up rounded-2xl border border-sumi-faint/30 bg-leaf p-5 shadow-rise"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-[1.35rem] leading-tight">{f.name[lang]}</h2>
                  <p className="mt-0.5 text-[12.5px] text-sumi-faint">
                    {f.level[lang]} · {f.postures.length} {t("postures")}
                    {f.loop ? " · ∞" : ""}
                  </p>
                </div>
                <button
                  disabled={!unlocked}
                  onClick={() => go(`/f/${f.slug}`)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-all active:scale-95 ${
                    unlocked
                      ? "bg-celadon text-paper hover:bg-celadon-deep"
                      : "bg-sumi/5 text-sumi-faint cursor-not-allowed"
                  }`}
                >
                  {t("practice")}
                </button>
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-sumi-soft">{f.description[lang]}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {postureNames.map((nm) => (
                  <span key={nm} className="rounded-full border border-sumi-faint/30 px-2.5 py-1 text-[11.5px] text-sumi-soft">
                    {nm}
                  </span>
                ))}
              </div>
              {!unlocked && <p className="mt-3 text-[12.5px] text-sumi-faint">{t("formLockedHint")}</p>}
            </article>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => go("/composer")}
          className="text-[14px] text-sumi-soft hover:text-celadon-deep transition-colors underline-offset-4 hover:underline"
        >
          + {t("createWithAI")}
        </button>
      </div>
    </Page>
  );
}
