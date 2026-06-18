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
  list(filters: ListFilters = {}): Promise<RecruiterCandidateListItem[]> {
    return resolve(
      () =>
        APPLICATIONS.filter((a) =>
          filters.status ? a.status === filters.status : true
        )
          .filter((a) => (filters.job_id ? a.job_id === filters.job_id : true))
          .map((a) => {
            const cand = CANDIDATES.find((c) => c.id === a.candidate_id)!;
            const job = JOBS.find((j) => j.id === a.job_id)!;
            return {
              application_id: a.id,
              candidate_id: cand.id,
              candidate_name: cand.name,
              candidate_email: cand.email,
              job_id: job.id,
              job_title: job.title,
              status: a.status,
              match_score: a.match_score,
              applied_at: a.created_at,
              updated_at: a.updated_at,
            };
          })
          .sort((a, b) => (b.match_score ?? -1) - (a.match_score ?? -1)),
      async () =>
        (
          await apiClient.get("/recruiter/candidates", {
            params: {
              status: filters.status || undefined,
              job_id: filters.job_id || undefined,
            },
          })
        ).data
    );
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
