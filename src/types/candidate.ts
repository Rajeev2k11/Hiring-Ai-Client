import type { ISODateString } from "./common";
import type { AiEvaluation, Resume } from "./application";

/**
 * Recruiter "Candidates" list is application-centric — one card == one
 * candidate's application to one of the company's jobs.
 * app/schemas/recruiter/candidate.py → RecruiterCandidateListItem
 */
export interface RecruiterCandidateListItem {
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  job_id: string;
  job_title: string;
  status: string;
  match_score: number | null;
  applied_at: ISODateString;
  updated_at: ISODateString;
}

/** app/schemas/recruiter/candidate.py → RecruiterCandidateDetail */
export interface RecruiterCandidateDetail {
  application_id: string;
  status: string;
  match_score: number | null;
  applied_at: ISODateString;
  updated_at: ISODateString;

  candidate_id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;

  job_id: string;
  job_title: string;

  ai_evaluation: AiEvaluation | null;
  resume: Resume | null;
}
