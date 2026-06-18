import { Plug } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { INTEGRATION_GROUPS } from "@/constants/marketing";

export function IntegrationsSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="Integrations"
          title="Plugs into the tools your team already lives in"
          description="Connect your calendar, video, job boards, and comms in a click. Everything else is one open API away."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {INTEGRATION_GROUPS.map((group, i) => (
            <Reveal key={group.title} index={i}>
              <div className="group h-full rounded-2xl border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:border-border hover:bg-card/70">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                  <group.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs font-medium text-foreground/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/30 px-7 py-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white">
                <Plug className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Build anything with the Hiring OS API
                </p>
                <p className="text-sm text-muted-foreground">
                  REST + webhooks for every object in your pipeline.
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-electric-soft">
              Explore the docs →
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
