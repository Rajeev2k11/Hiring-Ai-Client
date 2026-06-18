import { Check, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

const FUNNEL = [
  { stage: "Applied", count: 248, pct: 100 },
  { stage: "Screened", count: 96, pct: 39 },
  { stage: "Interviewed", count: 31, pct: 13 },
  { stage: "Offer", count: 8, pct: 3 },
  { stage: "Hired", count: 5, pct: 2 },
];

const SOURCES = [
  { source: "Referral", apps: 64, score: 84 },
  { source: "LinkedIn", apps: 88, score: 71 },
  { source: "AI Sourcing", apps: 42, score: 89 },
  { source: "Indeed", apps: 54, score: 62 },
];

const POINTS = [
  "Every score is explainable — strengths, risks, and the why",
  "Funnel, source quality, and offer acceptance, computed live",
  "No fabricated metrics — unavailable data is shown honestly",
];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-electric-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-glow" />
            Evidence over instinct
          </span>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
            The science behind every hiring decision
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Hiring OS turns your pipeline into real-time intelligence. See exactly
            where candidates drop off, which sources convert, and why each
            recommendation was made — all backed by transparent scoring.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-emerald-400">
                  <Check className="size-3" />
                </span>
                <span className="text-[15px] text-foreground/85">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="ring-gradient relative rounded-2xl border border-border/80 bg-card/60 p-6 shadow-elevated backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Hiring Analytics</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                <TrendingUp className="size-3.5" />
                +18% conversion
              </span>
            </div>

            {/* Funnel */}
            <div className="mt-6 space-y-2.5">
              {FUNNEL.map((row, i) => (
                <div key={row.stage} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">
                    {row.stage}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-secondary/50">
                    <div
                      className={cn(
                        "flex h-full items-center justify-end rounded-lg pr-2",
                        i === FUNNEL.length - 1 ? "bg-brand-gradient" : "bg-electric/30"
                      )}
                      style={{ width: `${Math.max(row.pct, 8)}%` }}
                    >
                      <span className="text-[11px] font-semibold text-foreground">
                        {row.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Source quality */}
            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Source quality
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {SOURCES.map((s) => (
                  <div
                    key={s.source}
                    className="rounded-xl border border-border/50 bg-secondary/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/80">{s.source}</span>
                      <span className="text-xs font-semibold text-electric-soft">
                        {s.score}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      {s.apps} applicants
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
