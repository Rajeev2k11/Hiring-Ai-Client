/**
 * Company onboarding / setup. Maps 1:1 to the backend `recruiter/setup/*`
 * endpoints (see app/schemas/recruiter/setup.py).
 */

/** CompanyProfileResponse.industry */
export const Industry = {
  TECHNOLOGY: "TECHNOLOGY",
  FINANCE: "FINANCE",
  HEALTHCARE: "HEALTHCARE",
  EDUCATION: "EDUCATION",
  RETAIL: "RETAIL",
  MANUFACTURING: "MANUFACTURING",
  MEDIA: "MEDIA",
  CONSULTING: "CONSULTING",
  NONPROFIT: "NONPROFIT",
  OTHER: "OTHER",
} as const;
export type Industry = (typeof Industry)[keyof typeof Industry];

/** CompanyProfileResponse.company_size */
export const CompanySize = {
  S1_10: "1-10",
  S11_50: "11-50",
  S51_200: "51-200",
  S201_500: "201-500",
  S501_1000: "501-1000",
  S1001_PLUS: "1001+",
} as const;
export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];

/** GET/PUT recruiter/setup/profile → CompanyProfileResponse */
export interface CompanyProfile {
  name: string;
  industry: string | null;
  company_size: string | null;
  headquarters_location: string | null;
  website_url: string | null;
  timezone: string | null;
  logo_url: string | null;
}

/** PUT recruiter/setup/profile body → CompanyProfileUpdate */
export interface CompanyProfileUpdateInput {
  name?: string | null;
  industry?: string | null;
  company_size?: string | null;
  headquarters_location?: string | null;
  website_url?: string | null;
  timezone?: string | null;
}

/** OnboardingStateResponse */
export interface OnboardingState {
  profile_completed: boolean;
  team_step_addressed: boolean;
  setup_complete: boolean;
  completed_at: string | null;
}

/** GET recruiter/setup/status → SetupStatusResponse */
export interface SetupStatus {
  onboarding: OnboardingState;
  profile: CompanyProfile;
}
