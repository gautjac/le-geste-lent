import type { ButtonHTMLAttributes, ReactNode } from "react";
import { go, useRoute } from "../router";
import { useSettings } from "../store";

export function Btn({
  children,
  variant = "solid",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "quiet" | "accent";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";
  const styles: Record<string, string> = {
    solid: "bg-sumi text-paper hover:bg-sumi/90",
    accent: "bg-celadon text-paper hover:bg-celadon-deep",
    ghost: "border border-sumi-faint/50 text-sumi hover:border-sumi/60 hover:bg-sumi/5",
    quiet: "text-sumi-soft hover:text-sumi hover:bg-sumi/5",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function BackBar({ to = "/", label }: { to?: string; label?: string }) {
  const { t } = useSettings();
  return (
    <button
      onClick={() => go(to)}
      className="group inline-flex items-center gap-1.5 text-sumi-soft hover:text-sumi text-[14px] transition-colors"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">←</span>
      {label ?? t("back")}
    </button>
  );
}

export function PageTitle({
  hanzi,
  pinyin,
  title,
  lead,
}: {
  hanzi?: string;
  pinyin?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-7">
      {hanzi && (
        <div className="flex items-baseline gap-3 text-sumi-faint mb-1">
          <span className="font-serif text-2xl">{hanzi}</span>
          {pinyin && <span className="italic text-[15px]">{pinyin}</span>}
        </div>
      )}
      <h1 className="font-serif text-[clamp(1.9rem,6vw,2.7rem)] leading-[1.05] tracking-[-0.01em] text-sumi">
        {title}
      </h1>
      {lead && <p className="mt-3 max-w-prose text-sumi-soft leading-relaxed text-[15px]">{lead}</p>}
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pt-6 pb-28 fade-up">{children}</main>
  );
}

export function BottomNav() {
  const { t } = useSettings();
  const { parts } = useRoute();
  const root = "/" + (parts[0] ?? "");
  const items = [
    { to: "/", key: "navSentier" as const, icon: "ladder", match: ["/", "/g", "/atelier"] },
    { to: "/formes", key: "navFormes" as const, icon: "flow", match: ["/formes", "/f", "/composer"] },
    { to: "/carnet", key: "navCarnet" as const, icon: "book", match: ["/carnet"] },
    { to: "/reglages", key: "navReglages" as const, icon: "gear", match: ["/reglages"] },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-sumi-faint/25 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto max-w-2xl grid grid-cols-4">
        {items.map((it) => {
          const active = it.match.includes(root) || (root === "/g" && it.to === "/") ||
            (root === "/atelier" && it.to === "/") ||
            ((root === "/f" || root === "/composer") && it.to === "/formes");
          return (
            <button
              key={it.to}
              onClick={() => go(it.to)}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] tracking-wide transition-colors ${
                active ? "text-celadon-deep" : "text-sumi-faint hover:text-sumi-soft"
              }`}
            >
              <NavIcon name={it.icon} active={active} />
              {t(it.key)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "rgb(var(--celadon-deep))" : "currentColor";
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "ladder")
    return (
      <svg {...common}>
        <path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10" />
      </svg>
    );
  if (name === "flow")
    return (
      <svg {...common}>
        <path d="M3 12c3-5 6 5 9 0s6-5 9 0" />
      </svg>
    );
  if (name === "book")
    return (
      <svg {...common}>
        <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM18 3v18" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8" />
    </svg>
  );
}
