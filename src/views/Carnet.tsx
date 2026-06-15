import { useSessions } from "../content";
import { useSettings } from "../store";
import type { Session, SessionKind } from "../db";
import { Page, PageTitle } from "../components/ui";

function kindLabel(k: SessionKind, t: (key: "sessionEtude" | "sessionSouffle" | "sessionPratique") => string) {
  return k === "etude" ? t("sessionEtude") : k === "souffle" ? t("sessionSouffle") : t("sessionPratique");
}

function fmtDate(ms: number, lang: "fr" | "en") {
  return new Date(ms).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Carnet() {
  const sessions = useSessions();
  const { t, lang } = useSettings();

  const totalMin = Math.round(sessions.reduce((a, s) => a + s.durationMs, 0) / 60000);

  // group by calendar day
  const groups = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = fmtDate(s.date, lang);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }

  return (
    <Page>
      <PageTitle title={t("navCarnet")} lead={t("carnetLead")} />

      {sessions.length === 0 ? (
        <p className="text-sumi-faint text-[15px]">{t("noSessions")}</p>
      ) : (
        <>
          <p className="mb-6 text-[13px] text-sumi-faint tabular-nums">
            {sessions.length} · {totalMin} {t("minutes")}
          </p>
          <div className="space-y-7">
            {[...groups.entries()].map(([day, items]) => (
              <section key={day}>
                <h2 className="mb-2 text-[12px] uppercase tracking-wide3 text-sumi-faint first-letter:uppercase">
                  {day}
                </h2>
                <ul className="space-y-2">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-sumi-faint/25 bg-leaf px-4 py-3"
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-medium ${
                          s.kind === "pratique"
                            ? "bg-celadon/15 text-celadon-deep"
                            : s.kind === "souffle"
                              ? "bg-vermilion/10 text-vermilion"
                              : "bg-sumi/5 text-sumi-soft"
                        }`}
                      >
                        {kindLabel(s.kind, t).slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif text-[15px] truncate">{s.refName}</div>
                        <div className="text-[12px] text-sumi-faint">
                          {kindLabel(s.kind, t)} · {Math.max(1, Math.round(s.durationMs / 60000))} {t("minutes")}
                          {s.loops ? ` · ${s.loops}∞` : ""}
                        </div>
                      </div>
                      {s.ease ? (
                        <span className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= s.ease! ? "bg-celadon" : "bg-sumi-faint/30"}`} />
                          ))}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
