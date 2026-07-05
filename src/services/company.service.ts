import { api } from "@/lib/api-fetch";
import type {
  CompanyProfileUpdateInput,
  OnboardingState,
  SetupStatus,
} from "@/types";

/**
 * Company onboarding / setup — real backend via the authenticated BFF proxy.
 * Maps 1:1 to /api/v1/recruiter/setup/*.
 */
export const companyService = {
  /** Current onboarding state + company profile. */
  status(): Promise<SetupStatus> {
    return api.get<SetupStatus>("recruiter/setup/status");
  },

  /** Update the company profile (step 1). Returns the refreshed setup status. */
  updateProfile(payload: CompanyProfileUpdateInput): Promise<SetupStatus> {
    return api.put<SetupStatus>("recruiter/setup/profile", payload);
  },

  /** Mark the whole setup as complete. */
  complete(): Promise<OnboardingState> {
    return api.post<OnboardingState>("recruiter/setup/complete");
  },

  /** Skip the team-invite step. */
  skipTeam(): Promise<OnboardingState> {
    return api.post<OnboardingState>("recruiter/setup/team/skip");
  },
};
