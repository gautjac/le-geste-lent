import { useMemo, useState } from "react";
import { useGestures } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { composeForm } from "../api";
import type { Form } from "../data/forms";
import { db } from "../db";
import { BackBar, Btn, Page, PageTitle } from "../components/ui";

export default function Composer() {
  const gestures = useGestures();
  const { t, lang } = useSettings();
  const [intention, setIntention] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Form | null>(null);

  const available = useMemo(
    () =>
      gestures
        .filter((g) => g.status === "absorbed")
        .map((g) => ({ slug: g.slug, name: g.name[lang], family: g.family[lang] })),
    [gestures, lang],
  );

  const nameOf = (slug: string) => gestures.find((g) => g.slug === slug)?.name[lang] ?? slug;

  const run = async () => {
    setError(null);
    setBusy(true);
    try {
      const f = await composeForm(intention.trim(), lang, available);
      setDraft(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("aiError"));
    } finally {
      setBusy(false);
    }
  };

  const keep = async () => {
    if (!draft) return;
    await db.customForms.put({ slug: draft.slug, form: draft });
    go(`/f/${draft.slug}`);
  };

  return (
    <Page>
      <BackBar to="/formes" />
      <div className="mt-4">
        <PageTitle title={t("createWithAI")} lead={t("composeFormLead")} />
      </div>

      {available.length === 0 ? (
        <p className="rounded-xl bg-sumi/5 px-4 py-3 text-[14.5px] text-sumi-soft">
          {t("formLockedHint")}
        </p>
      ) : !draft ? (
        <div className="rounded-2xl border border-sumi-faint/30 bg-leaf p-4 shadow-rise">
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={t("composeFormPlaceholder")}
            rows={3}
            className="w-full resize-none bg-transparent font-serif text-[16px] leading-relaxed text-sumi placeholder:text-sumi-faint/70 focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] text-sumi-faint">
              {available.length} {t("absorbedCount")}
            </span>
            <Btn variant="accent" onClick={run} disabled={busy || intention.trim().length < 4}>
              {busy ? t("composing") : t("compose")}
            </Btn>
          </div>
        </div>
      ) : null}

      {error && (
        <p className="mt-4 rounded-xl bg-vermilion/10 px-4 py-3 text-[14px] leading-relaxed text-vermilion">
          {error}
          <span className="mt-1 block text-sumi-faint">{t("aiUnavailable")}</span>
        </p>
      )}

      {draft && (
        <div className="mt-2 fade-up">
          <h2 className="font-serif text-[1.6rem] leading-tight">{draft.name[lang]}</h2>
          <p className="mt-0.5 text-[12.5px] text-sumi-faint">
            {draft.level[lang]} · {draft.postures.length} {t("postures")}
            {draft.loop ? " · ∞" : ""}
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-sumi-soft">{draft.description[lang]}</p>
          <ol className="mt-4 space-y-2">
            {draft.postures.map((p, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-sumi-faint/25 bg-leaf px-4 py-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sumi/5 text-[12px] text-sumi-soft tabular-nums">
                  {i + 1}
                </span>
                <span className="font-serif text-[1.05rem]">{nameOf(p.gestureSlug)}</span>
              </li>
            ))}
          </ol>
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
