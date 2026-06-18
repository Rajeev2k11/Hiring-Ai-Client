"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  CalendarCheck,
  FileSearch,
  Radar,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/shared/ScoreRing";

const float = (delay: number) => ({
  initial: { y: 0 },
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, delay, repeat: Infinity, ease: "easeInOut" as const },
});

const feed = [
  { icon: Radar, label: "Sourcing Agent", text: "Found 14 matches for Senior Backend", accent: "plasma" },
  { icon: FileSearch, label: "Screening Agent", text: "Scored Ethan Patel — 94 / 100", accent: "electric" },
  { icon: CalendarCheck, label: "Interview Agent", text: "Panel scheduled · Tue 2:30 PM", accent: "aurora" },
];

const accentBg: Record<string, string> = {
  electric: "bg-electric/15 text-electric-soft border-electric/30",
  plasma: "bg-plasma/15 text-plasma-soft border-plasma/30",
  aurora: "bg-aurora/15 text-cyan-300 border-aurora/30",
};

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Main command-center panel */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="ring-gradient relative rounded-[1.75rem] border border-border/80 bg-card/70 p-5 shadow-elevated backdrop-blur-2xl"
        style={{ perspective: 1000 }}
      >
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
              <Sparkles className="size-4 text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">AI Command Center</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                9 agents · live
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Autonomous
          </span>
        </div>

        {/* mini pipeline */}
        <div className="grid grid-cols-5 gap-1.5 py-4">
          {[
            { s: "Applied", v: 248 },
            { s: "Screened", v: 96 },
            { s: "Interview", v: 31 },
            { s: "Offer", v: 8 },
            { s: "Hired", v: 5 },
          ].map((c, i) => (
            <div key={c.s} className="text-center">
              <div className="relative h-16 overflow-hidden rounded-lg bg-secondary/50">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${100 - i * 16}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-x-0 bottom-0 rounded-lg",
                    i === 4 ? "bg-brand-gradient" : "bg-electric/30"
                  )}
                />
              </div>
              <p className="mt-1.5 text-xs font-semibold">{c.v}</p>
              <p className="text-[10px] text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>

        {/* agent activity feed */}
        <div className="space-y-2 border-t border-border/60 pt-4">
          {feed.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.18 }}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5"
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
                  accentBg[row.accent]
                )}
              >
                <row.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {row.text}
                </p>
                <p className="text-[10px] text-muted-foreground">{row.label}</p>
              </div>
              <BadgeCheck className="size-4 shrink-0 text-emerald-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating score card */}
      <motion.div
        {...float(0.6)}
        className="absolute -right-4 -top-6 hidden w-44 rounded-2xl border border-border/80 bg-card/90 p-3.5 shadow-elevated backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <ScoreRing score={94} size={52} />
          <div>
            <p className="text-xs font-semibold leading-tight">Ethan Patel</p>
            <p className="text-[10px] text-muted-foreground">Strong match</p>
            <span className="mt-1 inline-block rounded-full border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
              Shortlist
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating agent chip */}
      <motion.div
        {...float(1.1)}
        className="absolute -bottom-6 -left-5 hidden items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 px-4 py-3 shadow-elevated backdrop-blur-xl sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-plasma/15 text-plasma-soft border border-plasma/30">
          <BrainCircuit className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold leading-tight">Hiring Planner</p>
          <p className="text-[10px] text-muted-foreground">Drafted 3 reqs today</p>
        </div>
      </motion.div>
    </div>
  );
}
