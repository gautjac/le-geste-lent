import type { Breath } from "../data/gestures";
import { useSettings } from "../store";

interface Props {
  breath: Breath;
  size?: number;
}

/**
 * A single breathing ring. Expanded on the inhale, gathered on the exhale, held
 * steady between. It transitions slowly when the breath phase changes, so during
 * playback it appears to breathe with the figure.
 */
export default function BreathMarker({ breath, size = 56 }: Props) {
  const { t } = useSettings();
  const scale = breath === "in" ? 1 : breath === "out" ? 0.62 : 0.82;
  const label = breath === "in" ? t("breathIn") : breath === "out" ? t("breathOut") : t("breathHold");

  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <span
        className="relative grid place-items-center"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-0 rounded-full border border-celadon/40" />
        <span
          className="rounded-full bg-celadon/15 border border-celadon/70 transition-transform duration-[2200ms] ease-breath"
          style={{
            width: size,
            height: size,
            transform: `scale(${scale})`,
          }}
        />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-celadon-deep" />
      </span>
      <span className="font-serif italic text-sumi-soft text-[15px] tracking-wide">{label}</span>
    </div>
  );
}
