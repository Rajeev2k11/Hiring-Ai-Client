import { api } from "@/lib/api-fetch";
import type {
  Application,
  ApplicationCreateInput,
  ApplicationDetail,
} from "@/types";

interface ListFilters {
  job_id?: string | null;
  status?: string | null;
}

/**
 * Applications — real backend integration via the authenticated BFF proxy.
 * Shared by the candidate portal (apply) and the recruiter side (list / detail
 * / status). Maps to the public /applications + /jobs/{id}/apply routes.
 */
export const applicationsService = {
  /** Candidate applies to a job — POST /jobs/{job_id}/apply. */
  apply(jobId: string, payload: ApplicationCreateInput): Promise<Application> {
    return api.post<Application>(`jobs/${jobId}/apply`, payload);
  },

  /** List applications (optional job/status filters) — GET /applications. */
  list(filters: ListFilters = {}): Promise<Application[]> {
    const params = new URLSearchParams();
    if (filters.job_id) params.set("job_id", filters.job_id);
    if (filters.status) params.set("status", filters.status);
    const q = params.toString();
    return api.get<Application[]>(`applications${q ? `?${q}` : ""}`);
  },

  /** Full application detail (candidate + resume + AI eval) — GET /applications/{id}. */
  get(applicationId: string): Promise<ApplicationDetail> {
    return api.get<ApplicationDetail>(`applications/${applicationId}`);
  },

  /** Update status — PATCH /applications/{id}/status. */
  updateStatus(applicationId: string, status: string): Promise<Application> {
    return api.patch<Application>(`applications/${applicationId}/status`, {
      status,
    });
  },
};
