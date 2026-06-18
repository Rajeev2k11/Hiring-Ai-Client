import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FEATURE_PILLARS } from "@/constants/marketing";
import { ACCENT } from "@/lib/accent";
import { cn } from "@/lib/utils";

export function PillarsSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="A different kind of ATS"
          title={
            <>
              Built like an operating system,{" "}
              <span className="text-gradient-brand">not a database.</span>
            </>
          }
          description="Most hiring tools store your pipeline. Hiring OS runs it — a composable layer of agents and humans working from one shared talent graph."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURE_PILLARS.map((pillar, i) => {
            const accent = ACCENT[pillar.accent];
            return (
              <Reveal
                key={pillar.title}
                index={i}
                className={cn(i === 0 && "md:col-span-2 lg:col-span-2")}
              >
                <article
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:border-border hover:bg-card/70",
                    i === 0 && "lg:p-9"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                      accent.gradient
                    )}
                  />
                  <span
                    className={cn(
                      "relative grid h-12 w-12 place-items-center rounded-xl border",
                      accent.iconWrap
                    )}
                  >
                    <pillar.icon className="size-6" />
                  </span>
                  <h3 className="relative mt-6 font-display text-xl font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
