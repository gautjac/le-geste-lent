import { SettingsProvider, useSettings } from "./store";
import { useRoute } from "./router";
import { BottomNav } from "./components/ui";
import Onboarding from "./views/Onboarding";
import Sentier from "./views/Sentier";
import Etude from "./views/Etude";
import Souffle from "./views/Souffle";
import Ressenti from "./views/Ressenti";
import Formes from "./views/Formes";
import Pratique from "./views/Pratique";
import Carnet from "./views/Carnet";
import Reglages from "./views/Reglages";
import Atelier from "./views/Atelier";
import Composer from "./views/Composer";

function Router() {
  const { parts } = useRoute();
  const [a, b, c] = parts;

  // /g/:slug, /g/:slug/souffle, /g/:slug/ressenti
  if (a === "g" && b) {
    if (c === "souffle") return <Souffle slug={b} />;
    if (c === "ressenti") return <Ressenti slug={b} />;
    return <Etude slug={b} />;
  }
  // /f/:slug  → practice screen
  if (a === "f" && b) return <Pratique slug={b} />;
  if (a === "atelier") return <Atelier />;
  if (a === "composer") return <Composer />;
  if (a === "formes") return <Formes />;
  if (a === "carnet") return <Carnet />;
  if (a === "reglages") return <Reglages />;
  return <Sentier />;
}

function Shell() {
  const { ready, onboarded } = useSettings();
  if (!ready) {
    return (
      <div className="min-h-[100dvh] grid place-items-center">
        <div className="h-10 w-10 rounded-full border border-celadon/40 animate-breathe" />
      </div>
    );
  }
  if (!onboarded) return <Onboarding />;
  return (
    <>
      <Router />
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Shell />
    </SettingsProvider>
  );
}
