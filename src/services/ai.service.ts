import { api } from "@/lib/api-fetch";
import type {
  ComposerComposeInput,
  ComposerComposeResponse,
  ComposerSkillsResponse,
  ComposerStartResponse,
  GeneratedRequirementsResponse,
  ImprovedDescriptionResponse,
  JobDraftContext,
  SuggestedSalaryResponse,
} from "@/types";

/**
 * AI Recruiter Assist (Create New Job page) — real backend integration via the
 * authenticated BFF proxy. Stateless authoring helpers; nothing is persisted.
 * Maps to /recruiter/jobs/assist/*.
 */
export const aiService = {
  improveDescription(ctx: JobDraftContext): Promise<ImprovedDescriptionResponse> {
    return api.post<ImprovedDescriptionResponse>(
      "recruiter/jobs/assist/improve-description",
      ctx
    );
  },

  generateRequirements(ctx: JobDraftContext): Promise<GeneratedRequirementsResponse> {
    return api.post<GeneratedRequirementsResponse>(
      "recruiter/jobs/assist/generate-requirements",
      ctx
    );
  },

  suggestSalary(ctx: JobDraftContext): Promise<SuggestedSalaryResponse> {
    return api.post<SuggestedSalaryResponse>(
      "recruiter/jobs/assist/suggest-salary",
      ctx
    );
  },

  /** Composer: one-line intent -> title/department options. */
  composerStart(prompt: string): Promise<ComposerStartResponse> {
    return api.post<ComposerStartResponse>("recruiter/jobs/composer/start", {
      prompt,
    });
  },

  /** Composer: chosen title -> suggested skills. */
  composerSkills(
    title: string,
    department?: string | null
  ): Promise<ComposerSkillsResponse> {
    return api.post<ComposerSkillsResponse>("recruiter/jobs/composer/skills", {
      title,
      department,
    });
  },

  /** Composer: all wizard answers -> full professional description. */
  composerCompose(input: ComposerComposeInput): Promise<ComposerComposeResponse> {
    return api.post<ComposerComposeResponse>(
      "recruiter/jobs/composer/compose",
      input
    );
  },
};
