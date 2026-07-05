import { api } from "@/lib/api-fetch";
import type {
  ProvidersResponse,
  SourcingMatch,
  SourcingRun,
  SourcingRunCreateInput,
} from "@/types";

/**
 * AI sourcing — real backend integration via the authenticated BFF proxy.
 *
 * Maps to the company-scoped recruiter sourcing routes
 * (/recruiter/sourcing/*). Every route derives the company from the
 * authenticated recruiter's token.
 */
export const sourcingService = {
  /** Available provider keys — GET /recruiter/sourcing/providers. */
  providers(): Promise<ProvidersResponse> {
    return api.get<ProvidersResponse>("recruiter/sourcing/providers");
  },

  /** Runs for the company, most recent first — GET /recruiter/sourcing/runs. */
  listRuns(): Promise<SourcingRun[]> {
    return api.get<SourcingRun[]>("recruiter/sourcing/runs");
  },

  /** Run status/progress — GET /recruiter/sourcing/runs/{id}. */
  getRun(id: string): Promise<SourcingRun> {
    return api.get<SourcingRun>(`recruiter/sourcing/runs/${id}`);
  },

  /** Matched candidates for a run — GET /recruiter/sourcing/runs/{id}/candidates. */
  runCandidates(id: string, selectedOnly = false): Promise<SourcingMatch[]> {
    const q = selectedOnly ? "?selected_only=true" : "";
    return api.get<SourcingMatch[]>(
      `recruiter/sourcing/runs/${id}/candidates${q}`
    );
  },

  /** Start an AI sourcing run — POST /recruiter/sourcing/runs. */
  startRun(payload: SourcingRunCreateInput): Promise<SourcingRun> {
    return api.post<SourcingRun>("recruiter/sourcing/runs", payload);
  },
};
