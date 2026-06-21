import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { Reveal } from "@/components/shared/Reveal";
import { MarketingCtas } from "@/components/marketing/MarketingCtas";

export function CtaSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <Reveal>
          <div className="noise relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/40 px-6 py-16 text-center sm:px-16 sm:py-20">
            <AuroraBackground intensity="vivid" grid={false} />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.08]">
                Hire like it's{" "}
                <span className="text-gradient-brand">the future.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                Join the teams running their entire hiring process on autonomous
                agents. Live in under an hour — no credit card required.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <MarketingCtas size="xl" primaryLabel="Start hiring free" secondaryLabel="Talk to sales" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
