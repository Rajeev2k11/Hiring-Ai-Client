import { api } from "@/lib/api-fetch";
import type {
  RecruiterCandidateDetail,
  RecruiterCandidateListItem,
} from "@/types";

interface ListFilters {
  status?: string | null;
  job_id?: string | null;
}

/**
 * Recruiter Candidates — real backend integration via the authenticated BFF
 * proxy. The list/detail are company-scoped (/recruiter/candidates/*). Status
 * changes reuse the shared PATCH /applications/{id}/status route.
 */
export const candidatesService = {
  list(filters: ListFilters = {}): Promise<RecruiterCandidateListItem[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.job_id) params.set("job_id", filters.job_id);
    const q = params.toString();
    return api.get<RecruiterCandidateListItem[]>(
      `recruiter/candidates${q ? `?${q}` : ""}`
    );
  },

  detail(applicationId: string): Promise<RecruiterCandidateDetail> {
    return api.get<RecruiterCandidateDetail>(
      `recruiter/candidates/${applicationId}`
    );
  },

  updateStatus(applicationId: string, status: string): Promise<void> {
    return api.patch<void>(`applications/${applicationId}/status`, { status });
  },
};
