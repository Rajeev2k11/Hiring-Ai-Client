import type { Metadata } from "next";
import { Check } from "lucide-react";

import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { BookDemoForm } from "@/components/marketing/BookDemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See Hiring OS in action. Book a personalized walkthrough of the autonomous hiring platform.",
};

const POINTS = [
  "A tailored walkthrough of the nine-agent system",
  "See AI sourcing and screening on your real roles",
  "Migration plan from your current ATS",
  "Pricing and rollout for your team",
];

export default function BookDemoPage() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
      <AuroraBackground intensity="subtle" />
      <div className="relative mx-auto grid max-w-[1200px] items-start gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div className="lg:pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-electric-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-glow" />
            Book a demo
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            See the future of hiring, live
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            In 30 minutes we'll show you exactly how autonomous agents can
            transform your hiring — using your own roles.
          </p>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-electric/15 text-electric-soft">
                  <Check className="size-3" />
                </span>
                <span className="text-[15px] text-foreground/85">{point}</span>
              </li>
            ))}
          </ul>

          <figure className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-5">
            <blockquote className="text-sm leading-relaxed text-foreground/85">
              “The demo sold the whole team in 20 minutes. We saw a ranked
              shortlist build itself from a live role — there was no going back.”
            </blockquote>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Priya Nair · VP of Talent, Northwind
            </figcaption>
          </figure>
        </div>

        <BookDemoForm />
      </div>
    </section>
  );
}
