import type { Metadata } from "next";
import { Filter, Github, Radar } from "lucide-react";

import { SolutionTemplate } from "@/components/marketing/SolutionTemplate";
import { SourcingMockup } from "@/components/marketing/mockups/PanelMockups";

export const metadata: Metadata = {
  title: "Autonomous Sourcing",
  description: "The Sourcing Agent finds, ranks, and shortlists qualified talent 24/7.",
};

export default function SourcingPage() {
  return (
    <SolutionTemplate
      config={{
        eyebrow: "Sourcing Agent",
        accent: "plasma",
        title: (
          <>
            Autonomous talent discovery,{" "}
            <span className="text-gradient-brand">around the clock</span>
          </>
        ),
        description:
          "Kick off a run and the agent scans your internal pool and external sources, scores every profile against the role, and shortlists the strongest matches — while you sleep.",
        highlights: [
          "Internal pool + GitHub providers out of the box, more on the way",
          "Every candidate scored against the specific job, not generic keywords",
          "Candidates above your threshold are auto-shortlisted into the pipeline",
          "Long-running runs you can start and walk away from — poll progress anytime",
        ],
        visual: <SourcingMockup />,
        metrics: [
          { value: "5×", label: "more qualified pipeline" },
          { value: "24/7", label: "always sourcing" },
          { value: "42", label: "profiles per run" },
        ],
        features: [
          { icon: Radar, title: "Multi-source scanning", description: "Pulls from internal talent and external providers in a single coordinated run." },
          { icon: Github, title: "Real signal, ranked", description: "Each profile gets a transparent match score so your shortlist is evidence-led." },
          { icon: Filter, title: "Auto-shortlisting", description: "Anyone above your threshold flows straight into the candidates pipeline." },
        ],
        image: "https://picsum.photos/seed/hiringos-sourcing/900/700",
        imageCaption: "Stop searching. Start reviewing.",
        imagePoints: [
          "Set a threshold and let the agent do the heavy lifting",
          "De-duplicated candidates across every source",
          "Source quality feeds straight into your analytics",
        ],
      }}
    />
  );
}
