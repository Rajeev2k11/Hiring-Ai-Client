import type { Metadata } from "next";
import { Activity, LayoutDashboard, Workflow } from "lucide-react";

import { SolutionTemplate } from "@/components/marketing/SolutionTemplate";
import { BrowserFrame } from "@/components/marketing/mockups/BrowserFrame";
import { DashboardMockup } from "@/components/marketing/mockups/DashboardMockup";

export const metadata: Metadata = {
  title: "AI Command Center",
  description: "Orchestrate every hiring agent from one cockpit with real-time intelligence.",
};

export default function CommandCenterPage() {
  return (
    <SolutionTemplate
      config={{
        eyebrow: "AI Command Center",
        accent: "electric",
        title: (
          <>
            Run your entire hiring org from{" "}
            <span className="text-gradient-brand">one cockpit</span>
          </>
        ),
        description:
          "A single, fast workspace where every role, candidate, and agent lives together — with an AI radar that surfaces what needs your attention next.",
        highlights: [
          "Delegate a goal — 'hire 3 backend engineers' — and watch the agents execute",
          "An AI radar that flags review priorities and offer probabilities in real time",
          "Every team member, role, and decision in one shared talent graph",
          "Sub-second navigation — it feels like a native app, not a web ATS",
        ],
        visual: (
          <BrowserFrame>
            <DashboardMockup />
          </BrowserFrame>
        ),
        metrics: [
          { value: "9", label: "agents orchestrated" },
          { value: "1", label: "unified cockpit" },
          { value: "60+", label: "hours saved / month" },
        ],
        features: [
          { icon: LayoutDashboard, title: "Unified workspace", description: "Jobs, candidates, interviews, and analytics — no more tab-switching across tools." },
          { icon: Workflow, title: "Agent orchestration", description: "Turn agents on per stage, set autonomy from assisted to fully autonomous." },
          { icon: Activity, title: "Real-time intelligence", description: "Live signals on pipeline health, risks, and the next best action." },
        ],
        image: "https://picsum.photos/seed/hiringos-command/900/700",
        imageCaption: "Built for the people running modern hiring",
        imagePoints: [
          "Role-aware views for owners, recruiters, hiring managers, and interviewers",
          "Keyboard-fast search across everything in your org",
          "Enterprise-grade security with SSO and granular permissions",
        ],
      }}
    />
  );
}
