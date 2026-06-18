import type { Metadata } from "next";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

import { SolutionTemplate } from "@/components/marketing/SolutionTemplate";
import { AnalyticsMockup } from "@/components/marketing/mockups/PanelMockups";

export const metadata: Metadata = {
  title: "Hiring Analytics",
  description: "Funnel conversion, source quality, and offer acceptance — computed from real data.",
};

export default function AnalyticsSolutionPage() {
  return (
    <SolutionTemplate
      config={{
        eyebrow: "Hiring Analytics",
        accent: "aurora",
        title: (
          <>
            The metrics that actually{" "}
            <span className="text-gradient-brand">move hiring</span>
          </>
        ),
        description:
          "See exactly where candidates drop off, which sources convert, and how offers land — all computed from your real pipeline, with nothing fabricated.",
        highlights: [
          "Funnel conversion from applied through hired, updated live",
          "Source quality: applications, hires, and average match score per channel",
          "Offer acceptance and pipeline health at a glance",
          "Metrics we can't yet compute are shown honestly as N/A — never invented",
        ],
        visual: <AnalyticsMockup />,
        metrics: [
          { value: "+18%", label: "conversion lift" },
          { value: "real-time", label: "always current" },
          { value: "0", label: "fabricated metrics" },
        ],
        features: [
          { icon: BarChart3, title: "Conversion funnel", description: "Spot the exact stage where your pipeline leaks and act on it." },
          { icon: PieChart, title: "Source quality", description: "Know which channels deliver candidates who actually get hired." },
          { icon: TrendingUp, title: "Offer intelligence", description: "Track acceptance and model the offers most likely to close." },
        ],
        image: "https://picsum.photos/seed/hiringos-analytics/900/700",
        imageCaption: "Decisions backed by data, not gut feel",
        imagePoints: [
          "Board-ready reporting your leadership will trust",
          "Drill from a metric down to the candidates behind it",
          "Honest data — unavailable metrics are flagged, not faked",
        ],
      }}
    />
  );
}
