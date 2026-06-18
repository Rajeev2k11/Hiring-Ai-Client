import type { ReactNode } from "react";

/**
 * Auth pages provide their own split-screen <AuthShell> (variant-specific),
 * so this layout is just a full-height passthrough.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
