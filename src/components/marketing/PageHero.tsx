import type { ReactNode } from "react";

import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Standard inner-page header with aurora backdrop, used across marketing pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden pt-36 pb-16 sm:pt-44", className)}>
      <AuroraBackground intensity="subtle" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        {eyebrow && (
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-electric-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-glow" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.15}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
