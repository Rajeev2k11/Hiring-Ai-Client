import type { ISODateString } from "./common";

/** Recruiter lifecycle decision on a match (backend MatchStatus). */
export enum MatchStatus {
  NEW = "NEW",
  SAVED = "SAVED",
  REJECTED = "REJECTED",
  CONTACTED = "CONTACTED",
}

/** POST /recruiter/jobs/{id}/match → MatchRunCreate */
export interface MatchRunCreateInput {
  providers?: string[]; // e.g. ["internal", "github", "portfolio"]
  limit?: number; // max candidates to evaluate, default 50
}

/** app/schemas/recruiter/match.py → MatchRunResponse (reuses SourcingRunStatus). */
export interface MatchRun {
  id: string;
  job_id: string;
  status: string; // SourcingRunStatus: PENDING | RUNNING | COMPLETED | FAILED
  total_candidates: number;
  evaluated_count: number;
  selected_count: number;
  error: string | null;
  created_at: ISODateString;
  completed_at: ISODateString | null;
}

/** Per-dimension sub-scores (0–100); a dimension may be absent. */
export interface ScoreBreakdown {
  semantic?: number;
  skills?: number;
  experience?: number;
  location?: number;
  seniority?: number;
}

/** app/schemas/recruiter/match.py → JobCandidateMatchResponse */
export interface JobCandidateMatch {
  id: string;
  candidate_id: string | null;
  name: string;
  email: string | null;
  source: string;
  score: number;
  recommendation: string | null; // AiRecommendation: shortlist | maybe | reject
  summary: string | null;
  profile_url: string | null;
  reasons: string[] | null;
  missing_skills: string[] | null;
  concerns: string[] | null;
  interview_focus: string[] | null;
  score_breakdown: ScoreBreakdown | null;
  status: string; // MatchStatus
  created_at: ISODateString;
}

/** Job.parsed_requirements shape (jd_parser output). */
export interface ParsedRequirements {
  role: string;
  seniority: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  experience_min: number;
  location: string | null;
  employment_type: string | null;
}

/** PATCH /recruiter/matches/{id}/status → MatchStatusUpdate */
export interface MatchStatusUpdateInput {
  status: MatchStatus | string;
}

/** app/schemas/recruiter/match.py → ShortlistItemResponse (cross-job saved). */
export interface ShortlistItem {
  id: string;
  candidate_id: string | null;
  name: string;
  email: string | null;
  source: string;
  score: number;
  recommendation: string | null;
  summary: string | null;
  profile_url: string | null;
  status: string;
  created_at: ISODateString;
  job_id: string;
  job_title: string;
}
