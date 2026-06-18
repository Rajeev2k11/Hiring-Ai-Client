import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  LayoutDashboard,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [LayoutDashboard, Briefcase, Users, CalendarCheck, BarChart3];
const BARS = [38, 58, 46, 72, 64, 88, 70];
const STATS = [
  { label: "Active Jobs", value: "24", tone: "text-electric-soft" },
  { label: "In Pipeline", value: "1,482", tone: "text-plasma-soft" },
  { label: "Interviews", value: "8", tone: "text-cyan-300" },
  { label: "Time to Hire", value: "18.5d", tone: "text-emerald-300" },
];

/** A faux Executive Dashboard — the hero "demo" visual. */
export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[420px] text-left", className)}>
      {/* sidebar */}
      <div className="hidden w-14 shrink-0 flex-col items-center gap-4 border-r border-border/50 bg-card/40 py-4 sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
          <Sparkles className="size-4" />
        </span>
        <div className="mt-2 flex flex-col gap-3">
          {NAV.map((Icon, i) => (
            <span
              key={i}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg",
                i === 0 ? "bg-electric/15 text-electric-soft" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
            </span>
          ))}
        </div>
      </div>

      {/* main */}
      <div className="min-w-0 flex-1 p-4">
        {/* topbar */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 text-[11px] text-muted-foreground">
            <Search className="size-3.5" /> Search candidates, jobs…
          </div>
          <span className="rounded-lg border border-electric/30 bg-electric/10 px-2.5 py-1.5 text-[11px] font-medium text-electric-soft">
            ✦ AI
          </span>
        </div>

        <p className="mt-4 font-display text-sm font-semibold">Welcome back, Sarah</p>

        {/* stats */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-border/50 bg-card/50 p-2.5">
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
              <p className={cn("mt-0.5 font-display text-base font-bold", s.tone)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* chart + side */}
        <div className="mt-3 grid grid-cols-[1.6fr_1fr] gap-3">
          <div className="rounded-xl border border-border/50 bg-card/50 p-3">
            <p className="text-[10px] font-medium text-muted-foreground">Pipeline velocity</p>
            <div className="mt-3 flex h-24 items-end gap-1.5">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-sm", i === BARS.length - 1 ? "bg-brand-gradient" : "bg-electric/30")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-electric/20 bg-electric/5 p-3">
            <p className="flex items-center gap-1 text-[10px] font-semibold text-electric-soft">
              <Sparkles className="size-3" /> AI Radar
            </p>
            <div className="mt-2 space-y-2">
              {["3 strong matches found", "2 offers likely to accept", "Source quality +18%"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 rounded-md bg-card/60 px-2 py-1.5 text-[9px] text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* pipeline row */}
        <div className="mt-3 grid grid-cols-5 gap-2">
          {["Applied", "Screen", "Interview", "Offer", "Hired"].map((s, i) => (
            <div key={s} className="rounded-lg border border-border/50 bg-card/40 p-2">
              <p className="text-[8px] text-muted-foreground">{s}</p>
              <p className="font-display text-xs font-bold">{[248, 96, 31, 8, 5][i]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
