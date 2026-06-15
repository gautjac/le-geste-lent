import { useState } from "react";
import { useSettings } from "../store";
import { Btn } from "../components/ui";
import Figure from "../components/Figure";
import { GESTURES } from "../data/gestures";
import { sampleGesture } from "../lib/pose";

const slides = [
  { title: "obIntro1Title", body: "obIntro1Body", pos: 0.0 },
  { title: "obIntro2Title", body: "obIntro2Body", pos: 0.45 },
  { title: "obIntro3Title", body: "obIntro3Body", pos: 1.0 },
] as const;

export default function Onboarding() {
  const { t, lang, set } = useSettings();
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const g = GESTURES[1]; // Part the Wild Horse's Mane — an expressive open posture
  const s = sampleGesture(g.keyframes, slide.pos);

  const finish = () => set("onboarded", true);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => set("lang", lang === "fr" ? "en" : "fr")}
            className="rounded-full border border-sumi-faint/40 px-3 py-1.5 text-[12.5px] text-sumi-soft hover:text-sumi"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <button onClick={finish} className="text-[13px] text-sumi-faint hover:text-sumi-soft">
            {t("obSkip")}
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[11px] uppercase tracking-wide3 text-sumi-faint">{t("tagline")}</p>
          <h1 className="mt-1 font-serif text-[clamp(2rem,9vw,2.8rem)] leading-none">{t("obWelcome")}</h1>
        </div>

        <div className="my-6 flex flex-1 items-center justify-center">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="aspect-[3/4] rounded-2xl bg-leaf border border-sumi-faint/30 shadow-rise overflow-hidden">
              <Figure pose={s.front} weight={s.weight} variant="front" active />
            </div>
            <div className="aspect-[3/4] rounded-2xl bg-leaf border border-sumi-faint/30 shadow-rise overflow-hidden">
              <Figure pose={s.profile} weight={s.weight} variant="profile" active />
            </div>
          </div>
        </div>

        <div key={step} className="fade-up text-center min-h-[7rem]">
          <h2 className="font-serif text-[1.5rem] leading-tight">{t(slide.title)}</h2>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-sumi-soft">{t(slide.body)}</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-celadon" : "w-1.5 bg-sumi-faint/40"}`}
            />
          ))}
        </div>

        <div className="mt-6">
          {step < slides.length - 1 ? (
            <Btn variant="solid" className="w-full" onClick={() => setStep((n) => n + 1)}>
              {t("next")}
            </Btn>
          ) : (
            <Btn variant="accent" className="w-full" onClick={finish}>
              {t("obStart")}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
