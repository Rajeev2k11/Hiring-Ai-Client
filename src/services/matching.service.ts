import { api } from "@/lib/api-fetch";
import type {
  JobCandidateMatch,
  MatchRun,
  MatchRunCreateInput,
  ParsedRequirements,
  PoolCandidate,
  ShortlistItem,
} from "@/types";

/**
 * AI matching engine — real backend via the authenticated BFF proxy.
 * Company-scoped recruiter routes; the company is derived from the token.
 */
export const matchingService = {
  /** JD -> structured requirements — POST /recruiter/jobs/{id}/parse-requirements. */
  parseRequirements(jobId: string): Promise<ParsedRequirements> {
    return api.post<ParsedRequirements>(
      `recruiter/jobs/${jobId}/parse-requirements`
    );
  },

  /** Start a match run (background) — POST /recruiter/jobs/{id}/match. */
  startMatch(jobId: string, payload: MatchRunCreateInput = {}): Promise<MatchRun> {
    return api.post<MatchRun>(`recruiter/jobs/${jobId}/match`, payload);
  },

  /** Poll a run's status — GET /recruiter/match-runs/{id}. */
  getRun(runId: string): Promise<MatchRun> {
    return api.get<MatchRun>(`recruiter/match-runs/${runId}`);
  },

  /** Ranked matches for a job — GET /recruiter/jobs/{id}/candidates. */
  jobCandidates(
    jobId: string,
    filters: { min_score?: number; status?: string } = {}
  ): Promise<JobCandidateMatch[]> {
    const params = new URLSearchParams();
    if (filters.min_score) params.set("min_score", String(filters.min_score));
    if (filters.status) params.set("status", filters.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return api.get<JobCandidateMatch[]>(
      `recruiter/jobs/${jobId}/candidates${q}`
    );
  },

  /** One match detail — GET /recruiter/matches/{id}. */
  getMatch(matchId: string): Promise<JobCandidateMatch> {
    return api.get<JobCandidateMatch>(`recruiter/matches/${matchId}`);
  },

  /** Update a match's lifecycle status — PATCH /recruiter/matches/{id}/status. */
  updateStatus(matchId: string, status: string): Promise<JobCandidateMatch> {
    return api.patch<JobCandidateMatch>(`recruiter/matches/${matchId}/status`, {
      status,
    });
  },

  /** Import a discovered match into the talent pool — POST .../add-to-pool. */
  addToPool(matchId: string): Promise<PoolCandidate> {
    return api.post<PoolCandidate>(`recruiter/matches/${matchId}/add-to-pool`);
  },

  /** Cross-job shortlist — GET /recruiter/shortlist?status=SAVED|CONTACTED. */
  shortlist(status = "SAVED"): Promise<ShortlistItem[]> {
    return api.get<ShortlistItem[]>(
      `recruiter/shortlist?status=${encodeURIComponent(status)}`
    );
  },
};
