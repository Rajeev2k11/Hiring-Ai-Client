import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { BrowserFrame } from "@/components/marketing/mockups/BrowserFrame";
import { DashboardMockup } from "@/components/marketing/mockups/DashboardMockup";
import {
  AnalyticsMockup,
  ScreeningMockup,
  SourcingMockup,
} from "@/components/marketing/mockups/PanelMockups";

export function ShowcaseSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-aurora-radial opacity-60" />
      <div className="relative mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="See it in action"
          title={
            <>
              A command center that feels like{" "}
              <span className="text-gradient-brand">the future</span>
            </>
          }
          description="Every metric, candidate, and agent in one beautifully fast workspace. This is the real product surface — not a slide."
        />

        {/* 3D dashboard demo */}
        <Reveal className="mt-14 [perspective:1600px]">
          <div className="group relative mx-auto max-w-5xl">
            <div className="absolute -inset-x-10 -top-10 bottom-0 -z-10 bg-electric/10 blur-[100px]" />
            <div className="origin-center transition-transform duration-700 ease-out [transform:rotateX(11deg)_rotateY(-7deg)_scale(0.96)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)_scale(1)]">
              <BrowserFrame>
                <DashboardMockup />
              </BrowserFrame>
            </div>
          </div>
        </Reveal>

        {/* Bento of product surfaces */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Reveal index={0}>
            <Labeled label="Autonomous sourcing">
              <SourcingMockup />
            </Labeled>
          </Reveal>
          <Reveal index={1}>
            <Labeled label="Evidence-based screening">
              <ScreeningMockup />
            </Labeled>
          </Reveal>
          <Reveal index={2}>
            <Labeled label="Real-time analytics">
              <AnalyticsMockup />
            </Labeled>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
