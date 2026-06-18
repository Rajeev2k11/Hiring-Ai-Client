import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { WORKFLOW_STEPS } from "@/constants/marketing";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

export function WorkflowSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-dots opacity-[0.4] mask-radial" />
      <div className="relative mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From open role to signed offer — on autopilot"
          description="Four moves. The agents handle the busywork end-to-end; your team makes the calls that matter."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* connecting line on desktop */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {WORKFLOW_STEPS.map((step, i) => {
            const accent = ACCENT[step.accent];
            return (
              <Reveal key={step.step} index={i} className="relative">
                <div className="flex flex-col">
                  <div className="relative z-10 flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border bg-background",
                        accent.iconWrap
                      )}
                    >
                      <step.icon className="size-6" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-muted-foreground/60">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
