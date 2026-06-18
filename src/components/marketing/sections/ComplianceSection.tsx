import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { COMPLIANCE_ITEMS } from "@/constants/marketing";

export function ComplianceSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="Compliance & security"
          title="Enterprise-grade trust, built in from day one"
          description="Your candidate data is sensitive. Hiring OS is engineered for the standards your security and legal teams require."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMPLIANCE_ITEMS.map((item, i) => (
            <Reveal key={item.title} index={i}>
              <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/40 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
