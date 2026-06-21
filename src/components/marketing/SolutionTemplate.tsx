import type { ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { MarketingCtas } from "@/components/marketing/MarketingCtas";
import { CtaSection } from "@/components/marketing/sections/CtaSection";
import { ACCENT } from "@/lib/accent";
import type { Accent } from "@/constants/marketing";
import { cn } from "@/lib/utils";

export interface SolutionFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SolutionConfig {
  eyebrow: string;
  title: ReactNode;
  description: string;
  accent: Accent;
  highlights: string[];
  visual: ReactNode;
  features: SolutionFeature[];
  metrics: { value: string; label: string }[];
  /** Real image (photographic) shown in the "in practice" band. */
  image: string;
  imageCaption: string;
  imagePoints: string[];
}

export function SolutionTemplate({ config }: { config: SolutionConfig }) {
  const a = ACCENT[config.accent];
  return (
    <>
      <PageHero eyebrow={config.eyebrow} title={config.title} description={config.description}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MarketingCtas size="lg" primaryLabel="Start free" secondaryLabel="Book a demo" />
        </div>
      </PageHero>

      {/* Visual + highlights */}
      <section className="relative pb-8">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>{config.visual}</Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {config.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border", a.iconWrap)}>
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground/85">{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
              {config.metrics.map((m) => (
                <div key={m.label}>
                  <p className={cn("font-display text-2xl font-bold", a.text)}>{m.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <SectionHeading align="left" eyebrow="Capabilities" title="What you get" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {config.features.map((f, i) => (
              <Reveal key={f.title} index={i}>
                <div className="h-full rounded-2xl border border-border/70 bg-card/40 p-6">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl border", a.iconWrap)}>
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* In practice — real image band */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border/70 bg-card/30 p-6 lg:grid-cols-2 lg:p-10">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-border/60">
                <img
                  src={config.image}
                  alt={config.imageCaption}
                  loading="lazy"
                  className="h-72 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{config.imageCaption}</h3>
              <ul className="mt-5 space-y-3">
                {config.imagePoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-foreground/85">
                    <Check className={cn("mt-0.5 size-4 shrink-0", a.text)} /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
