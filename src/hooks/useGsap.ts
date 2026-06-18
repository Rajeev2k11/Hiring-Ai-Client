"use client";

import { useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Run GSAP animations scoped to a container ref, with automatic cleanup via
 * `gsap.context`. The callback receives the live context so you can use
 * `self.selector` if needed.
 *
 *   const scope = useGsapContext((ctx) => {
 *     gsap.from(".hero-line", { y: 40, opacity: 0, stagger: 0.1 });
 *   });
 *   return <div ref={scope}>…</div>;
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  factory: (self: gsap.Context) => void,
  deps: DependencyList = []
): RefObject<T | null> {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(factory, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
