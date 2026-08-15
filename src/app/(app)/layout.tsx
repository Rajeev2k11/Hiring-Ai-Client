"use client";

import type { ReactNode } from "react";

import { AppChrome } from "@/components/app/AppChrome";
import { APP_NAV } from "@/constants/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppChrome
      nav={APP_NAV}
      subtitle="Executive Suite"
      searchPlaceholder="Search candidates, jobs, or reports…"
      primaryCta={{ label: "Post a Job", href: "/jobs/new/ai" }}
      requiredActor="company_user"
      otherActorHome="/portal"
      enforceOnboarding
    >
      {children}
    </AppChrome>
  );
}
