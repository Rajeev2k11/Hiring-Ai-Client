import {
  AgentsSection,
  ComplianceSection,
  CtaSection,
  FaqSection,
  Hero,
  IntegrationsSection,
  LogoCloud,
  PillarsSection,
  ShowcaseSection,
  TestimonialsSection,
  WorkflowSection,
} from "@/components/marketing/sections";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <ShowcaseSection />
      <PillarsSection />
      <AgentsSection />
      <WorkflowSection />
      <IntegrationsSection />
      <ComplianceSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
