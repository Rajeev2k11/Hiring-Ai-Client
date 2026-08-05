import type { ISODateString } from "./common";

/** A structured skill on a candidate profile. */
export interface CandidateSkill {
  name: string;
  confidence?: number | null;
  evidence?: string | null;
}

/** External links on a candidate profile. */
export interface CandidateLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

/** app/schemas/recruiter/candidate_pool.py → PoolCandidateResponse */
export interface PoolCandidate {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  current_company: string | null;
  experience_years: number | null;
  summary: string | null;
  skills: (CandidateSkill | string)[] | null;
  links: CandidateLinks | null;
  // INTERNAL | GITHUB | PORTFOLIO | PUBLIC_WEB | ATS_IMPORT | RECRUITER_PROVIDED
  source_type: string;
  source_url: string | null;
  last_enriched_at: ISODateString | null;
  created_at: ISODateString;
}

/** POST /recruiter/pool/enrich-url → UrlEnrichRequest */
export interface UrlEnrichInput {
  url: string;
}

/**
 * POST /recruiter/pool/linkedin-import → LinkedInManualImportRequest.
 *
 * Recruiter-entered, consented profile data. The URL is stored as a reference
 * only — Hiring OS never fetches, crawls or scrapes LinkedIn.
 */
export interface LinkedInManualImportInput {
  profile_url: string;
  name: string;
  headline?: string | null;
  location?: string | null;
  experience_years?: number | null;
  skills: string[];
  summary?: string | null;
  email?: string | null;
  consent_confirmed: boolean;
  legal_basis?: string | null;
}
