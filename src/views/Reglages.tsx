import type { ReactNode } from "react";
import { useSettings } from "../store";
import { hapticsSupported } from "../lib/haptics";
import { Page, PageTitle } from "../components/ui";
import type { StrKey } from "../i18n";

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-sumi-faint/40 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-[13.5px] transition-all ${
            value === o.value ? "bg-sumi text-paper" : "text-sumi-soft hover:text-sumi"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sumi-faint/20 py-4">
      <span className="text-[15px] text-sumi">{label}</span>
      {children}
    </div>
  );
}

export default function Reglages() {
  const s = useSettings();
  const { t } = s;
  const k = (key: StrKey) => t(key);

  return (
    <Page>
      <PageTitle title={t("navReglages")} />

      <Row label={k("language")}>
        <Segmented
          value={s.lang}
          onChange={(v) => s.set("lang", v)}
          options={[
            { value: "fr", label: "Français" },
            { value: "en", label: "English" },
          ]}
        />
      </Row>

      <Row label={k("theme")}>
        <Segmented
          value={s.theme}
          onChange={(v) => s.set("theme", v)}
          options={[
            { value: "jour", label: k("themeDay") },
            { value: "nuit", label: k("themeNight") },
          ]}
        />
      </Row>

      <Row label={k("haptics")}>
        <Segmented
          value={s.haptics}
          onChange={(v) => s.set("haptics", v)}
          options={[
            { value: "off", label: k("hOff") },
            { value: "soft", label: k("hSoft") },
            { value: "full", label: k("hFull") },
          ]}
        />
      </Row>
      {!hapticsSupported() && (
        <p className="-mt-2 mb-1 text-[12.5px] text-sumi-faint">{k("hapticsUnsupported")}</p>
      )}

      <Row label={k("soundCues")}>
        <Segmented
          value={s.sound ? "on" : "off"}
          onChange={(v) => s.set("sound", v === "on")}
          options={[
            { value: "on", label: k("on") },
            { value: "off", label: k("off") },
          ]}
        />
      </Row>

      <div className="border-b border-sumi-faint/20 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-sumi">{k("globalTempo")}</span>
          <span className="text-[12px] text-sumi-faint tabular-nums">×{s.slowness.toFixed(2)}</span>
        </div>
        <input
          className="scrub mt-3 w-full"
          type="range"
          min={0.6}
          max={2}
          step={0.05}
          value={2.6 - s.slowness}
          onChange={(e) => s.set("slowness", Number((2.6 - Number(e.target.value)).toFixed(2)))}
          aria-label={k("globalTempo")}
        />
        <div className="flex justify-between text-[11px] uppercase tracking-wide3 text-sumi-faint">
          <span>{k("slower")}</span>
          <span>{k("faster")}</span>
        </div>
      </div>

      <section className="mt-8 rounded-2xl bg-leaf border border-sumi-faint/25 p-5">
        <h2 className="font-serif text-[1.1rem]">{k("about")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-sumi-soft">{k("aboutBody")}</p>
      </section>

      <div className="mt-8">
        <button
          onClick={() => {
            if (window.confirm(k("resetConfirm"))) void s.resetAll();
          }}
          className="text-[13.5px] text-vermilion/90 hover:text-vermilion transition-colors"
        >
          {k("resetProgress")}
        </button>
      </div>
    </Page>
  );
}
