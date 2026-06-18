import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Reveal } from "@/components/shared/Reveal";
import { LazyPricingScene } from "@/components/three/lazy";
import { FaqSection } from "@/components/marketing/sections/FaqSection";
import { CtaSection } from "@/components/marketing/sections/CtaSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, scalable pricing for autonomous hiring. Start free, grow into the full nine-agent system.",
};

const VALUE = [
  "No per-hire fees — ever. Pay for seats, not outcomes.",
  "Every plan includes the core hiring OS and analytics.",
  "Turn agents on as you scale — from assisted to autonomous.",
  "Cancel anytime. Your data is always exportable.",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pricing that scales with{" "}
            <span className="text-gradient-brand">your ambition</span>
          </>
        }
        description="Start free and turn on agents as you grow. Every plan includes the core hiring OS — no per-hire fees, ever."
      />

      {/* Value band with animated 3D gem */}
      <section className="relative overflow-hidden pb-4">
        <div className="mx-auto grid max-w-[1100px] items-center gap-8 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal className="order-2 lg:order-1">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              One price. <span className="text-gradient-brand">Unfair advantage.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Replace your ATS, sourcing tools, and screening spend with a single
              platform that pays for itself in saved recruiter hours.
            </p>
            <ul className="mt-6 space-y-3">
              {VALUE.map((v) => (
                <li key={v} className="flex items-start gap-3 text-[15px] text-foreground/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-emerald-400">
                    <Check className="size-3" />
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <LazyPricingScene className="mx-auto h-64 w-full max-w-sm sm:h-80" />
          </Reveal>
        </div>
      </section>

      <section className="pb-12 pt-8">
        <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
          <PricingCards />
        </div>
      </section>
      <FaqSection />
      <CtaSection />
    </>
  );
}
