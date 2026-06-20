import { api } from "@/lib/api-fetch";
import type {
  DashboardStats,
  Job,
  JobCreateInput,
  JobListItem,
  JobUpdateInput,
} from "@/types";

/**
 * Jobs — real backend integration via the authenticated BFF proxy.
 *
 * Company (recruiter) surfaces are intentionally scoped to the logged-in
 * company:
 *   - the jobs list + stats come from /recruiter/dashboard/* (only this
 *     company's roles), NOT the public GET /jobs (that lists every company's
 *     jobs and is for the candidate portal);
 *   - creation goes through POST /recruiter/jobs (company derived from token),
 *     NOT the public POST /jobs (demo-company fallback).
 * Detail + update reuse the shared /jobs/{id} routes.
 */
export const jobsService = {
  /** Company's own jobs enriched with applicant count — /recruiter/dashboard/jobs. */
  listForDashboard(status?: string | null): Promise<JobListItem[]> {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return api.get<JobListItem[]>(`recruiter/dashboard/jobs${q}`);
  },

  /** Summary stat cards for the company — /recruiter/dashboard/stats. */
  dashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>("recruiter/dashboard/stats");
  },

  /** All open jobs (candidate-facing listing) — public GET /jobs. */
  list(status?: string | null): Promise<Job[]> {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return api.get<Job[]>(`jobs${q}`);
  },

  /** Single job by id — GET /jobs/{id}. */
  get(id: string): Promise<Job> {
    return api.get<Job>(`jobs/${id}`);
  },

  /** Create a job for the recruiter's company — POST /recruiter/jobs. */
  create(payload: JobCreateInput): Promise<Job> {
    return api.post<Job>("recruiter/jobs", payload);
  },

  /** Update a job — PATCH /jobs/{id}. */
  update(id: string, payload: JobUpdateInput): Promise<Job> {
    return api.patch<Job>(`jobs/${id}`, payload);
  },
};
