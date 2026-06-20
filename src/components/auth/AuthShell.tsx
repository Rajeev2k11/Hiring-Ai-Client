import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { LazyCompanyScene, LazyCandidateScene } from "@/components/three/lazy";
import { DesktopOnly } from "@/components/shared/DesktopOnly";
import { cn } from "@/lib/utils";

type Variant = "company" | "candidate";

interface VariantContent {
  badge: string;
  badgeIcon: LucideIcon;
  accent: string; // text accent class
  dot: string;
  heading: ReactNode;
  highlights: { icon: LucideIcon; text: string }[];
  quote: string;
  attribution: string;
}

const CONTENT: Record<Variant, VariantContent> = {
  company: {
    badge: "For companies",
    badgeIcon: Briefcase,
    accent: "text-electric-soft",
    dot: "bg-electric",
    heading: (
      <>
        The operating system for{" "}
        <span className="text-gradient-brand">autonomous hiring</span>
      </>
    ),
    highlights: [
      { icon: Zap, text: "Live in under an hour — no migration headaches" },
      { icon: Sparkles, text: "Nine AI agents working your pipeline 24/7" },
      { icon: ShieldCheck, text: "SOC 2 Type II · GDPR · enterprise SSO" },
    ],
    quote:
      "Our time-to-hire dropped from 41 days to 12. Hiring OS replaced four tools and gave our recruiters their week back.",
    attribution: "Priya Nair · VP of Talent, Northwind",
  },
  candidate: {
    badge: "For job seekers",
    badgeIcon: UserRound,
    accent: "text-plasma-soft",
    dot: "bg-plasma",
    heading: (
      <>
        Find your next role,{" "}
        <span className="text-gradient-brand">faster</span>
      </>
    ),
    highlights: [
      { icon: Target, text: "AI-matched roles tailored to your experience" },
      { icon: Sparkles, text: "A fast, transparent, respectful process" },
      { icon: Zap, text: "Track every application in one place" },
    ],
    quote:
      "I had three interviews lined up within a week. Easily the best application experience I've had.",
    attribution: "Jordan Lee · Product Designer",
  },
};

export function AuthShell({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  const c = CONTENT[variant];
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col items-center justify-between overflow-hidden border-r border-border/60 bg-card/30 p-12 lg:flex">
        <AuroraBackground intensity={variant === "candidate" ? "subtle" : "normal"} />
        <div className="relative flex items-center gap-3 self-start">
          <Logo />
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-1 text-[11px] font-medium", c.accent)}>
            <c.badgeIcon className="size-3" />
            {c.badge}
          </span>
        </div>

        <div className="relative max-w-md">
          <div className="mb-6 h-52 w-full">
            <DesktopOnly>
              {variant === "company" ? (
                <LazyCompanyScene className="h-full w-full" />
              ) : (
                <LazyCandidateScene className="h-full w-full" />
              )}
            </DesktopOnly>
          </div>
          <h2 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight">
            {c.heading}
          </h2>
          <ul className="mt-8 space-y-4">
            {c.highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                  <h.icon className="size-4" />
                </span>
                <span className="text-sm text-foreground/85">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative max-w-md rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <Quote className={cn("size-5", c.accent)} />
          <blockquote className="mt-2 text-sm leading-relaxed text-foreground/85">
            {c.quote}
          </blockquote>
          <figcaption className="mt-3 text-xs text-muted-foreground">
            {c.attribution}
          </figcaption>
        </figure>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-6 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          {/* Mobile context badge (brand panel is hidden on small screens) */}
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-1 text-[11px] font-medium lg:hidden", c.accent)}>
            <c.badgeIcon className="size-3" />
            {c.badge}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
