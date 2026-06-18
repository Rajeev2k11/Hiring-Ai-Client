"use client";

import type { ReactNode } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

/**
 * Renders children only on desktop (lg+). Used to avoid mounting heavy WebGL
 * canvases that would otherwise run invisibly behind `hidden lg:flex` panels.
 */
export function DesktopOnly({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <>{children}</>;
}
