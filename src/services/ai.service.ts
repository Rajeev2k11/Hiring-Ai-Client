import { apiClient } from "@/lib/api-client";
import { resolve } from "./api-helpers";
import type {
  GeneratedRequirementsResponse,
  ImprovedDescriptionResponse,
  JobDraftContext,
  SuggestedSalaryResponse,
} from "@/types";

export const aiService = {
  improveDescription(ctx: JobDraftContext): Promise<ImprovedDescriptionResponse> {
    return resolve(
      () => ({
        improved_description: `We're hiring a ${ctx.title}${
          ctx.department ? ` on our ${ctx.department} team` : ""
        }${ctx.location ? ` (${ctx.location})` : ""}.\n\nYou'll join a team building the future of autonomous hiring. ${
          ctx.description?.trim() ||
          "In this role you'll own meaningful problems end-to-end, partner across functions, and ship work that reaches thousands of teams."
        }\n\nWhat you'll do:\n• Drive high-impact projects from idea to launch\n• Collaborate with a senior, low-ego team\n• Raise the bar on quality and craft\n\nWhat we offer: competitive compensation, meaningful equity, and a culture that values outcomes over hours.`,
      }),
      async () =>
        (await apiClient.post("/recruiter/jobs/assist/improve-description", ctx)).data
    );
  },

  generateRequirements(ctx: JobDraftContext): Promise<GeneratedRequirementsResponse> {
    return resolve(
      () => ({
        responsibilities: [
          `Own and deliver core ${ctx.department ?? "team"} initiatives end-to-end`,
          "Collaborate cross-functionally with product, design, and engineering",
          "Raise the quality bar through reviews, mentorship, and best practices",
          "Translate ambiguous problems into shipped, measurable outcomes",
        ],
        qualifications: [
          `Proven experience as a ${ctx.title} or similar`,
          "Strong communication and stakeholder-management skills",
          "Track record of delivering complex projects on time",
          "Bias for action and a growth mindset",
        ],
        nice_to_have: [
          "Experience at a high-growth startup",
          "Familiarity with AI-native tooling",
          "Open-source or community contributions",
        ],
      }),
      async () =>
        (await apiClient.post("/recruiter/jobs/assist/generate-requirements", ctx)).data
    );
  },

  suggestSalary(ctx: JobDraftContext): Promise<SuggestedSalaryResponse> {
    return resolve(
      () => ({
        currency: "USD",
        min_amount: 145000,
        max_amount: 195000,
        period: "year",
        rationale: `Based on market data for a ${ctx.title}${
          ctx.location ? ` in ${ctx.location}` : ""
        }, this range is competitive at the 60th–75th percentile and balances attraction with internal equity.`,
      }),
      async () =>
        (await apiClient.post("/recruiter/jobs/assist/suggest-salary", ctx)).data
    );
  },
};
