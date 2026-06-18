"use client";

import type { ReactNode } from "react";

import { AppChrome } from "@/components/app/AppChrome";
import { PORTAL_NAV } from "@/constants/navigation";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AppChrome
      nav={PORTAL_NAV}
      subtitle="Candidate Portal"
      searchPlaceholder="Search jobs…"
      primaryCta={{ label: "Browse Jobs", href: "/portal/jobs" }}
      requiredActor="candidate"
      otherActorHome="/dashboard"
      homeHref="/portal"
    >
      {children}
    </AppChrome>
  );
}
