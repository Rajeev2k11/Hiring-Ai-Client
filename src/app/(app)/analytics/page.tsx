"use client";

import { BarChart3, Info } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { Panel } from "@/components/app/Panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <PageHeader
        title="Hiring Analytics"
        description="Funnel conversion, source quality, and offer acceptance — computed from real data."
        actions={<Button variant="secondary" size="sm">Last 30 days</Button>}
      />

      {/* Metric cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : data?.metrics.map((m) => (
              <div key={m.key} className="rounded-2xl border border-border/70 bg-card/40 p-5">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                {m.available ? (
                  <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                    {m.value}
                    {m.unit && <span className="ml-0.5 text-lg text-muted-foreground">{m.unit}</span>}
                  </p>
                ) : (
                  <>
                    <p className="mt-2 font-display text-2xl font-bold text-muted-foreground/60">N/A</p>
                    {m.note && (
                      <p className="mt-1 flex items-start gap-1 text-[11px] text-muted-foreground/70">
                        <Info className="mt-0.5 size-3 shrink-0" /> {m.note}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Funnel */}
        <Panel title="Hiring Funnel">
          {isLoading || !data ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="space-y-3">
              {data.funnel.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count} · {stage.percentage}%
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-secondary/50">
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all",
                        i === data.funnel.length - 1 ? "bg-brand-gradient" : "bg-electric/35"
                      )}
                      style={{ width: `${Math.max(stage.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Source quality */}
        <Panel title="Source Quality">
          {isLoading || !data ? (
            <Skeleton className="h-56 w-full" />
          ) : data.source_quality.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No source data yet.</p>
          ) : (
            <div className="space-y-2.5">
              {data.source_quality.map((s) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{s.source}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.applications} applicants · {s.hired} hired
                    </p>
                  </div>
                  {s.avg_match_score !== null && (
                    <span className="text-sm font-semibold text-electric-soft">
                      {s.avg_match_score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <div className="flex items-center gap-3">
            <BarChart3 className="size-5 text-electric-soft" />
            <p className="text-sm text-muted-foreground">
              Metrics that need data the platform doesn't capture yet (pipeline velocity,
              quality of hire, cost per hire) are shown honestly as <strong>N/A</strong>
              rather than fabricated.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
