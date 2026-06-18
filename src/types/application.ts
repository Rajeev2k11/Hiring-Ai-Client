import type { ISODateString } from "./common";

/** app/schemas/candidate.py → CandidateResponse (full) */
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  created_at: ISODateString;
}

/** app/schemas/resume.py → ResumeResponse */
export interface Resume {
  id: string;
  application_id: string;
  file_url: string;
  raw_text: string | null;
  parsed_json: Record<string, unknown> | null;
  created_at: ISODateString;
}

/** app/schemas/ai_evaluation.py → AiEvaluationResponse */
export interface AiEvaluation {
  id: string;
  application_id: string;
  score: number;
  recommendation: string; // shortlist | maybe | reject
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  questions_to_ask: string[];
  created_at: ISODateString;
}

/** app/schemas/application.py → ApplicationResponse */
export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string; // ApplicationStatus
  source: string | null;
  match_score: number | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** app/schemas/application.py → ApplicationDetailResponse */
export interface ApplicationDetail extends Application {
  candidate: Candidate | null;
  resume: Resume | null;
  ai_evaluation: AiEvaluation | null;
}

/** POST /jobs/{id}/apply → ApplicationCreate */
export interface ApplicationCreateInput {
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string | null;
  candidate_location?: string | null;
  source?: string | null;
}

export interface ApplicationStatusUpdateInput {
  status: string;
}
