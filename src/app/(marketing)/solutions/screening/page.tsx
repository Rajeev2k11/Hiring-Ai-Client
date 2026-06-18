import type { Metadata } from "next";
import { FileSearch, MessageSquare, ScanLine } from "lucide-react";

import { SolutionTemplate } from "@/components/marketing/SolutionTemplate";
import { ScreeningMockup } from "@/components/marketing/mockups/PanelMockups";

export const metadata: Metadata = {
  title: "AI Screening & Scoring",
  description: "Evidence-based candidate evaluations with explainable 0–100 match scores.",
};

export default function ScreeningPage() {
  return (
    <SolutionTemplate
      config={{
        eyebrow: "Screening Agent",
        accent: "electric",
        title: (
          <>
            Evidence-based evaluations,{" "}
            <span className="text-gradient-brand">in seconds</span>
          </>
        ),
        description:
          "The Screening Agent reads every résumé against the job and returns a transparent score, a recommendation, and the exact strengths, risks, and questions to ask next.",
        highlights: [
          "A 0–100 match score with a clear shortlist / maybe / reject recommendation",
          "Strengths, weaknesses, and risks — every score is explainable and auditable",
          "Tailored interview questions generated for each candidate",
          "Adaptive, conversational screens that score answers in real time",
        ],
        visual: <ScreeningMockup />,
        metrics: [
          { value: "92%", label: "screening accuracy" },
          { value: "0–100", label: "match score" },
          { value: "<10s", label: "per evaluation" },
        ],
        features: [
          { icon: FileSearch, title: "Résumé ↔ JD scoring", description: "Each candidate evaluated against the specific role — no generic keyword matching." },
          { icon: ScanLine, title: "Explainable results", description: "Strengths, risks, and a rationale you can defend to any hiring manager." },
          { icon: MessageSquare, title: "Live AI screens", description: "Conversational screening that adapts and scores as the candidate responds." },
        ],
        image: "https://picsum.photos/seed/hiringos-screening/900/700",
        imageCaption: "Fair, fast, and defensible",
        imagePoints: [
          "Consistent rubric applied to every candidate",
          "Bias-aware evaluation with a complete audit trail",
          "Humans always make the final call — with full context",
        ],
      }}
    />
  );
}
