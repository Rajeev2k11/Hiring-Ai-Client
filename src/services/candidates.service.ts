import { apiClient } from "@/lib/api-client";
import { clone, nowISO, resolve } from "./api-helpers";
import {
  APPLICATIONS,
  CANDIDATES,
  EVALUATIONS,
  JOBS,
  RESUMES,
} from "./mock/seed";
import type {
  RecruiterCandidateDetail,
  RecruiterCandidateListItem,
} from "@/types";

interface ListFilters {
  status?: string | null;
  job_id?: string | null;
}

export const candidatesService = {
  /**
   * Live integration via the authenticated BFF proxy
   * (`/api/proxy/recruiter/candidates` → FastAPI `GET /api/v1/recruiter/candidates`).
   * The JWT stays in the httpOnly cookie — the browser sends it automatically
   * and the proxy attaches the Bearer token server-side. Optional `status` and
   * `job_id` filters are forwarded as query params.
   */
  async list(filters: ListFilters = {}): Promise<RecruiterCandidateListItem[]> {
    const qs = new URLSearchParams();
    if (filters.status) qs.set("status", filters.status);
    if (filters.job_id) qs.set("job_id", filters.job_id);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/proxy/recruiter/candidates${suffix}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Failed to load candidates");
    }
    return res.json();
  },

  detail(applicationId: string): Promise<RecruiterCandidateDetail> {
    return resolve(
      () => {
        const a = APPLICATIONS.find((x) => x.id === applicationId);
        if (!a) throw { status: 404, message: "Candidate application not found" };
        const cand = CANDIDATES.find((c) => c.id === a.candidate_id)!;
        const job = JOBS.find((j) => j.id === a.job_id)!;
        return clone({
          application_id: a.id,
          status: a.status,
          match_score: a.match_score,
          applied_at: a.created_at,
          updated_at: a.updated_at,
          candidate_id: cand.id,
          name: cand.name,
          email: cand.email,
          phone: cand.phone,
          location: cand.location,
          job_id: job.id,
          job_title: job.title,
          ai_evaluation: EVALUATIONS[a.id] ?? null,
          resume: RESUMES[a.id] ?? null,
        });
      },
      async () =>
        (await apiClient.get(`/recruiter/candidates/${applicationId}`)).data
    );
  },

  updateStatus(applicationId: string, status: string): Promise<void> {
    return resolve(
      () => {
        const a = APPLICATIONS.find((x) => x.id === applicationId);
        if (a) {
          a.status = status;
          a.updated_at = nowISO();
        }
      },
      async () => {
        await apiClient.patch(`/applications/${applicationId}/status`, { status });
      }
    );
  },
};
