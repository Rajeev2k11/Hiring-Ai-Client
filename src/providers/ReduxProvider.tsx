"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

/**
 * Single client-side store instance. We intentionally do NOT wrap children in
 * <PersistGate>: gating globally would make SSR/marketing pages render empty
 * until client rehydration (bad for SEO + first paint). redux-persist still
 * rehydrates asynchronously after mount via `persistStore` in `@/store`; the
 * first render uses initial state on both server and client (no hydration
 * mismatch), then re-renders once persisted state loads.
 */
export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
