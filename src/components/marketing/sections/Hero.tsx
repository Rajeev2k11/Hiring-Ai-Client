"use client";

import { Sparkles } from "lucide-react";

import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { MarketingCtas } from "@/components/marketing/MarketingCtas";
import { StatCounter } from "@/components/shared/StatCounter";
import { HERO_STATS } from "@/constants/marketing";
import { useGsapContext, gsap } from "@/hooks/useGsap";

export function Hero() {
  // Selector strings are auto-scoped to the ref inside gsap.context.
  const scope = useGsapContext<HTMLElement>(() => {
    gsap.set(".hero-anim", { opacity: 0, y: 28 });
    gsap
      .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
      .to(".hero-anim", { opacity: 1, y: 0, stagger: 0.12 }, 0.1);
  });

  return (
    <section
      ref={scope}
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28"
    >
      <AuroraBackground intensity="normal" />
      {/* fade the section into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto grid max-w-[1360px] items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <div className="hero-anim inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-foreground/80 backdrop-blur">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-2 py-0.5 text-[11px] font-semibold text-white">
              <Sparkles className="size-3" /> New
            </span>
            The nine-agent hiring system is here
          </div>

          <h1 className="hero-anim mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Hire the best talent,{" "}
            <span className="text-gradient-brand glow-text">autonomously.</span>
          </h1>

          <p className="hero-anim mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Hiring OS is the AI operating system for recruiting. A system of
            autonomous agents sources, screens, schedules, and analyzes — so your
            team spends time with people, not pipelines.
          </p>

          <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
            <MarketingCtas size="xl" primaryLabel="Start hiring free" secondaryLabel="Book a demo" />
          </div>

          <p className="hero-anim mt-4 text-sm text-muted-foreground">
            No credit card required · Live in under an hour · SOC 2 Type II
          </p>

          <div className="hero-anim mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border/60 pt-8 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="hero-anim">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
