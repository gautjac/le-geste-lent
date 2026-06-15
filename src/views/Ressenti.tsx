import { useState } from "react";
import { useGesture, useNotes } from "../content";
import { useSettings } from "../store";
import { go } from "../router";
import { addNote, setStatus } from "../db";
import { reflect } from "../api";
import { BackBar, Btn, Page } from "../components/ui";

function EaseDots({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n}`}
          className={`h-5 w-5 rounded-full border transition-all ${
            n <= value ? "bg-celadon border-celadon" : "border-sumi-faint/60 hover:border-celadon/60"
          }`}
        />
      ))}
    </div>
  );
}

function fmtDate(ms: number, lang: "fr" | "en") {
  return new Date(ms).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Ressenti({ slug }: { slug: string }) {
  const g = useGesture(slug);
  const notes = useNotes(slug);
  const { t, lang } = useSettings();
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(3);
  const [reflection, setReflection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!g) return null;
  const absorbed = g.status === "absorbed";

  const save = async () => {
    const text = body.trim();
    if (!text) return;
    setSaving(true);
    await addNote({ slug, date: Date.now(), body: text, rating, absorbed: false });
    setBody("");
    // a gentle one-line reflection, if the AI workshop is reachable (best-effort)
    reflect(text, lang)
      .then((r) => setReflection(r.reflection))
      .catch(() => setReflection(null));
    setSaving(false);
  };

  const absorb = async () => {
    if (body.trim()) {
      await addNote({ slug, date: Date.now(), body: body.trim(), rating, absorbed: true });
    }
    await setStatus(slug, "absorbed");
    go("/");
  };

  return (
    <Page>
      <BackBar to={`/g/${slug}`} />
      <header className="mt-4 mb-5">
        <p className="text-[11px] uppercase tracking-wide3 text-sumi-faint">{t("openRessenti")}</p>
        <h1 className="mt-1 font-serif text-[clamp(1.6rem,5vw,2.1rem)] leading-tight">{g.name[lang]}</h1>
        <p className="mt-3 text-sumi-soft text-[15px] leading-relaxed">{t("ressentiLead")}</p>
      </header>

      <div className="rounded-2xl border border-sumi-faint/30 bg-leaf p-4 shadow-rise">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t("feltPlaceholder")}
          rows={4}
          className="w-full resize-none bg-transparent font-serif text-[16px] leading-relaxed text-sumi placeholder:text-sumi-faint/70 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between border-t border-sumi-faint/20 pt-3">
          <div className="flex items-center gap-3">
            <span className="text-[12px] uppercase tracking-wide text-sumi-faint">{t("ease")}</span>
            <EaseDots value={rating} onChange={setRating} />
          </div>
          <Btn variant="ghost" onClick={save} disabled={!body.trim() || saving}>
            {t("saveNote")}
          </Btn>
        </div>
      </div>

      {reflection && (
        <p className="mt-4 rounded-xl bg-celadon/10 px-4 py-3 font-serif italic text-[15px] leading-relaxed text-celadon-deep fade-up">
          {reflection}
        </p>
      )}

      <div className="mt-7">
        {absorbed ? (
          <div className="flex items-center gap-2 rounded-full bg-celadon/15 px-4 py-2.5 text-celadon-deep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[14px] font-medium">{t("alreadyAbsorbed")}</span>
          </div>
        ) : (
          <>
            <Btn variant="accent" className="w-full" onClick={absorb}>
              ✓ {t("absorber")}
            </Btn>
            <p className="mt-2 text-center text-[12.5px] text-sumi-faint">{t("absorberHint")}</p>
          </>
        )}
      </div>

      <section className="mt-9">
        <h2 className="text-[12px] uppercase tracking-wide3 text-sumi-faint mb-3">{t("pastNotes")}</h2>
        {notes.length === 0 ? (
          <p className="text-sumi-faint text-[14px]">{t("noNotesYet")}</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-xl border border-sumi-faint/25 bg-leaf/60 px-4 py-3">
                <div className="flex items-center justify-between text-[12px] text-sumi-faint">
                  <span>{fmtDate(n.date, lang)}</span>
                  <span className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= n.rating ? "bg-celadon" : "bg-sumi-faint/30"}`} />
                    ))}
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-sumi">{n.body}</p>
                {n.absorbed && <span className="mt-1 inline-block text-[11px] text-celadon-deep">· {t("absorbed")}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}
