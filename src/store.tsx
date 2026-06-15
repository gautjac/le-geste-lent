import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { db, getSetting, setSetting } from "./db";
import { tr, type Lang, type StrKey } from "./i18n";
import type { HapticIntensity } from "./lib/haptics";

export type Theme = "jour" | "nuit";

interface Settings {
  lang: Lang;
  theme: Theme;
  haptics: HapticIntensity;
  sound: boolean;
  /** duration multiplier: 1 = base, >1 slower, <1 quicker */
  slowness: number;
  onboarded: boolean;
}

const DEFAULTS: Settings = {
  lang: "fr",
  theme: "jour",
  haptics: "soft",
  sound: false,
  slowness: 1,
  onboarded: false,
};

interface Ctx extends Settings {
  ready: boolean;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  t: (key: StrKey) => string;
  resetAll: () => Promise<void>;
}

const SettingsContext = createContext<Ctx | null>(null);

function parse(raw: string | undefined, fallback: Settings): Settings {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    getSetting("settings").then((raw) => {
      if (!live) return;
      setSettings(parse(raw, DEFAULTS));
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  // reflect theme on <html> for the CSS-variable swap
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.lang = settings.lang;
  }, [settings.theme, settings.lang]);

  const set = useCallback<Ctx["set"]>((key, value) => {
    setSettings((prev) => {
      const nextSettings = { ...prev, [key]: value };
      void setSetting("settings", JSON.stringify(nextSettings));
      return nextSettings;
    });
  }, []);

  const resetAll = useCallback(async () => {
    await Promise.all([
      db.progress.clear(),
      db.notes.clear(),
      db.sessions.clear(),
      db.customGestures.clear(),
      db.customForms.clear(),
    ]);
  }, []);

  const t = useCallback((key: StrKey) => tr(settings.lang, key), [settings.lang]);

  const value = useMemo<Ctx>(
    () => ({ ...settings, ready, set, t, resetAll }),
    [settings, ready, set, t, resetAll],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
