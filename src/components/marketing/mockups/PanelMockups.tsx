import { BadgeCheck, Github, Radar, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { cn } from "@/lib/utils";

/** AI sourcing run — ranked candidates with scores + provider tags. */
export function SourcingMockup({ className }: { className?: string }) {
  const rows = [
    { n: "Ethan Patel", s: 95, src: "internal", sel: true },
    { n: "Mia Nguyen", s: 91, src: "github", sel: true },
    { n: "Liam Garcia", s: 86, src: "internal", sel: true },
    { n: "Ava Kim", s: 78, src: "github", sel: false },
    { n: "Noah Rossi", s: 72, src: "internal", sel: false },
  ];
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card/60 p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Radar className="size-4 text-plasma-soft" /> Sourcing Run · Senior Backend
        </p>
        <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          Completed
        </span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>42 evaluated</span>
          <span>9 selected ≥ 80</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary/60">
          <div className="h-full w-full rounded-full bg-brand-gradient" />
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.n} className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-electric/40 to-plasma/40 text-[9px] font-semibold text-white">
              {r.n.split(" ").map((p) => p[0]).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{r.n}</p>
              <p className="flex items-center gap-1 text-[9px] text-muted-foreground">
                {r.src === "github" ? <Github className="size-2.5" /> : <Sparkles className="size-2.5" />}
                {r.src}
              </p>
            </div>
            {r.sel && <BadgeCheck className="size-3.5 text-emerald-400" />}
            <span className={cn("text-xs font-semibold", r.s >= 80 ? "text-emerald-300" : "text-muted-foreground")}>
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** AI screening scorecard — score ring + recommendation + strengths/risks. */
export function ScreeningMockup({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card/60 p-5", className)}>
      <div className="flex items-center gap-4">
        <ScoreRing score={94} size={64} strokeWidth={5} />
        <div>
          <p className="text-sm font-semibold">David Hudson</p>
          <p className="text-xs text-muted-foreground">Senior Product Designer</p>
          <span className="mt-1 inline-block rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            Recommend · Shortlist
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Strengths</p>
          <ul className="mt-1.5 space-y-1">
            {["Design systems mastery", "Growth-stage scale", "Strong communication"].map((t) => (
              <li key={t} className="text-[10px] text-foreground/80">• {t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Risks</p>
          <ul className="mt-1.5 space-y-1">
            {["Top-tier salary band", "Prefers remote-first"].map((t) => (
              <li key={t} className="text-[10px] text-foreground/80">• {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Analytics — funnel + source quality bars. */
export function AnalyticsMockup({ className }: { className?: string }) {
  const funnel = [
    { s: "Applied", v: 100 },
    { s: "Screened", v: 39 },
    { s: "Interview", v: 13 },
    { s: "Offer", v: 4 },
    { s: "Hired", v: 2 },
  ];
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card/60 p-5", className)}>
      <p className="text-sm font-semibold">Hiring Funnel · 30 days</p>
      <div className="mt-3 space-y-2">
        {funnel.map((f, i) => (
          <div key={f.s} className="flex items-center gap-2">
            <span className="w-14 text-[10px] text-muted-foreground">{f.s}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-md bg-secondary/50">
              <div
                className={cn("h-full rounded-md", i === funnel.length - 1 ? "bg-brand-gradient" : "bg-electric/30")}
                style={{ width: `${Math.max(f.v, 6)}%` }}
              />
            </div>
            <span className="w-7 text-right text-[10px] font-medium">{f.v}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-3">
        {[
          { k: "Referral", v: "84" },
          { k: "AI Sourcing", v: "89" },
          { k: "LinkedIn", v: "71" },
        ].map((m) => (
          <div key={m.k} className="rounded-lg bg-secondary/20 p-2 text-center">
            <p className="font-display text-sm font-bold text-electric-soft">{m.v}</p>
            <p className="text-[9px] text-muted-foreground">{m.k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
