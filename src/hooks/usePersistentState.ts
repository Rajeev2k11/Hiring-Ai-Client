"use client";

/**
 * Workspace state that survives navigation.
 *
 * Next.js unmounts a page component the moment you click another sidebar tab,
 * so plain `useState` filters, tabs and in-flight run IDs are gone by the time
 * you come back. React Query keeps the *data* cached; these hooks keep the
 * *view* — which filter you had picked, which run you were watching, where you
 * had scrolled — so returning to a screen resumes it instead of resetting it.
 *
 * sessionStorage (not localStorage) is deliberate: this is "where I was in this
 * sitting", and it should not follow the recruiter into a new browser session a
 * week later. Every read is defensive — private-mode browsers throw on access,
 * and a broken restore must never take the page down with it.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "hiring-os:view:";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — in-memory state still works for this visit.
  }
}

/**
 * `useState` that restores its last value for `key` when the component remounts.
 *
 * The first render deliberately returns `initial` rather than the stored value,
 * then restores in an effect: server and client must agree on the initial HTML
 * or React throws a hydration mismatch.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  /**
   * Set false when something more explicit already decided the value — a
   * `?status=` deep link, say. Restoring would silently override the intent the
   * link was carrying.
   */
  restore = true
) {
  const [value, setValue] = useState<T>(initial);
  const restored = useRef(false);

  useEffect(() => {
    if (restore) {
      const stored = read<T | undefined>(key, undefined);
      if (stored !== undefined) setValue(stored);
    }
    restored.current = true;
    // Re-restoring on key change is the point (e.g. switching to another job).
  }, [key, restore]);

  useEffect(() => {
    // Don't let the pre-restore `initial` overwrite what we're about to read.
    if (!restored.current) return;
    write(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

/**
 * Remembers the last route visited under each sidebar section, so clicking
 * "Jobs" returns to the role you were working on rather than the bare list.
 */
export function useSectionMemory() {
  const remember = useCallback((section: string, path: string) => {
    write(`section:${section}`, path);
  }, []);

  const recall = useCallback(
    (section: string) => read<string | null>(`section:${section}`, null),
    []
  );

  return { remember, recall };
}

/**
 * Restores the window scroll position for `key` after `ready` flips true.
 *
 * Waiting on `ready` matters: scrolling before the list has rendered would land
 * on a page that is still only a few skeletons tall and clamp back to the top.
 */
export function useScrollRestoration(key: string, ready: boolean) {
  const storageKey = `scroll:${key}`;
  const restored = useRef(false);

  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const y = read<number>(storageKey, 0);
    if (y > 0) {
      // Two frames: one for the list to paint, one for its final height.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo(0, y))
      );
    }
  }, [ready, storageKey]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => write(storageKey, window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      // Capture the final position on unmount — the last scroll event may have
      // been swallowed by the pending frame when navigation started.
      write(storageKey, window.scrollY);
    };
  }, [storageKey]);
}
