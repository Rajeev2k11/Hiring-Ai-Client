"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useAuth";

interface MarketingCtasProps {
  size?: "lg" | "xl";
  /** Primary CTA label shown to signed-out visitors (links to /register). */
  primaryLabel: string;
  /** Secondary CTA label shown to signed-out visitors. */
  secondaryLabel: string;
  secondaryHref?: string;
}

/**
 * Auth-aware marketing CTAs. A signed-out visitor sees the usual
 * "Start free" + "Book a demo" buttons; a signed-in visitor instead sees a
 * single "Go to Dashboard" button (routed by actor type).
 */
export function MarketingCtas({
  size = "xl",
  primaryLabel,
  secondaryLabel,
  secondaryHref = "/book-demo",
}: MarketingCtasProps) {
  const { data: session } = useSession();
  const authed = Boolean(session?.authenticated);
  const dashboardHref =
    session?.actor_type === "candidate" ? "/portal" : "/dashboard";
  const iconSize = size === "xl" ? "size-5" : "size-4";

  if (authed) {
    return (
      <Button asChild variant="brand" size={size}>
        <Link href={dashboardHref}>
          <LayoutDashboard className={iconSize} />
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="brand" size={size}>
        <Link href="/register">
          {primaryLabel}
          <ArrowRight className={iconSize} />
        </Link>
      </Button>
      <Button asChild variant="glass" size={size}>
        <Link href={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </>
  );
}
