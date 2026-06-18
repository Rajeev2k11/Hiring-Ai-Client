"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  duration?: number; // ms
  start?: number;
  decimals?: number;
}

/**
 * Animate a number from `start` to `end` once the element scrolls into view.
 * Returns the current display value and a ref to attach to the trigger element.
 */
export function useCountUp(end: number, options: Options = {}) {
  const { duration = 1600, start = 0, decimals = 0 } = options;
  const [value, setValue] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played.current) return;
        played.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          // easeOutExpo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setValue(start + (end - start) * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, start, duration]);

  return {
    ref,
    value: decimals ? value.toFixed(decimals) : Math.round(value).toString(),
  };
}
