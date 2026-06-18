import type { ISODateString } from "./common";

/** POST /recruiter/sourcing/runs → SourcingRunCreate */
export interface SourcingRunCreateInput {
  job_id: string;
  threshold?: number; // 0 < t <= 100, default 80
  providers?: string[] | null; // e.g. ["internal", "github"]
  limit?: number; // max candidates per provider, default 25
}

/** app/schemas/recruiter/sourcing.py → SourcingRunResponse */
export interface SourcingRun {
  id: string;
  job_id: string;
  threshold: number;
  status: string; // SourcingRunStatus
  total_candidates: number;
  evaluated_count: number;
  selected_count: number;
  error: string | null;
  created_at: ISODateString;
  completed_at: ISODateString | null;
}

/** app/schemas/recruiter/sourcing.py → SourcingMatchResponse */
export interface SourcingMatch {
  id: string;
  candidate_id: string | null;
  name: string;
  email: string | null;
  source: string;
  score: number;
  recommendation: string | null;
  summary: string | null;
  profile_url: string | null;
  selected: boolean;
  created_at: ISODateString;
}

/** GET /recruiter/sourcing/providers → ProvidersResponse */
export interface ProvidersResponse {
  providers: string[];
}
