import type { Keyframe } from "../data/gestures";

interface Props {
  keyframes: Keyframe[];
  value: number; // 0..1
  onChange: (t: number) => void;
  onScrubStart?: () => void;
  nearestIndex: number;
}

export default function Scrubber({ keyframes, value, onChange, onScrubStart, nearestIndex }: Props) {
  return (
    <div className="select-none">
      <div className="relative h-7">
        {/* keyframe ticks */}
        {keyframes.map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(k.t)}
            aria-label={`Repère ${i + 1}`}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center"
            style={{ left: `${k.t * 100}%`, width: 26, height: 26 }}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === nearestIndex
                  ? "h-2.5 w-2.5 bg-celadon-deep ring-4 ring-celadon/20"
                  : "h-1.5 w-1.5 bg-sumi-faint"
              }`}
            />
          </button>
        ))}
        {/* the range input rides on top */}
        <input
          className="scrub absolute inset-0 my-auto h-7"
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={value}
          onPointerDown={onScrubStart}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Ligne du temps du geste"
        />
      </div>
    </div>
  );
}
