import { Check } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Badge } from "@/components/ui/badge";
import { AI_AGENTS, type AgentStatus } from "@/constants/marketing";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

const statusMeta: Record<AgentStatus, { label: string; tone: "success" | "electric" | "neutral" }> = {
  live: { label: "Live", tone: "success" },
  beta: { label: "Beta", tone: "electric" },
  soon: { label: "Soon", tone: "neutral" },
};

export function AgentsSection() {
  return (
    <section id="command-center" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="The nine-agent system"
          title={
            <>
              One cockpit.{" "}
              <span className="text-gradient-brand">Nine specialized agents.</span>
            </>
          }
          description="Each agent owns a stage of hiring and shares the same talent graph. Turn them on as you scale — assisted when you want control, autonomous when you don't."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_AGENTS.map((agent, i) => {
            const accent = ACCENT[agent.accent];
            const status = statusMeta[agent.status];
            return (
              <Reveal key={agent.id} index={i % 3}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card/70",
                    accent.glowHover
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-b to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                      accent.gradient
                    )}
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110",
                        accent.iconWrap
                      )}
                    >
                      <agent.icon className="size-6" />
                    </span>
                    <Badge tone={status.tone}>
                      {agent.status === "live" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                      {status.label}
                    </Badge>
                  </div>

                  <h3 className="relative mt-5 font-display text-lg font-semibold text-foreground">
                    {agent.name}
                  </h3>
                  <p className={cn("relative mt-0.5 text-sm font-medium", accent.text)}>
                    {agent.tagline}
                  </p>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                    {agent.description}
                  </p>

                  <ul className="relative mt-5 space-y-2 border-t border-border/50 pt-4">
                    {agent.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-center gap-2 text-xs text-foreground/75"
                      >
                        <Check className={cn("size-3.5 shrink-0", accent.text)} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
