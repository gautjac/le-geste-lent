import { useEffect, useRef, useState } from "react";

interface Options {
  durationMs: number;
  playing: boolean;
  loop?: boolean;
  /** restart the playhead from 0 when this value changes */
  resetKey?: unknown;
  onLoop?: () => void;
  onComplete?: () => void;
}

/**
 * Drives a normalised playhead t ∈ [0,1] via requestAnimationFrame. Pausing
 * holds t; resuming continues from where it stood. Looping wraps seamlessly and
 * fires onLoop each wrap; non-looping calls onComplete once at the end.
 */
export function usePlayhead({ durationMs, playing, loop, resetKey, onLoop, onComplete }: Options) {
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const cbs = useRef({ onLoop, onComplete });
  cbs.current = { onLoop, onComplete };

  // reset
  useEffect(() => {
    tRef.current = 0;
    setT(0);
    last.current = null;
  }, [resetKey]);

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
      return;
    }
    const step = (now: number) => {
      if (last.current == null) last.current = now;
      const dt = now - last.current;
      last.current = now;
      let next = tRef.current + dt / durationMs;
      if (next >= 1) {
        if (loop) {
          next = next % 1;
          cbs.current.onLoop?.();
        } else {
          next = 1;
          tRef.current = 1;
          setT(1);
          raf.current = null;
          cbs.current.onComplete?.();
          return;
        }
      }
      tRef.current = next;
      setT(next);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [playing, durationMs, loop]);

  const setManual = (v: number) => {
    tRef.current = v;
    setT(v);
  };

  return { t, setT: setManual };
}
