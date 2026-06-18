import { apiClient } from "@/lib/api-client";
import { clone, nowISO, resolve, uid } from "./api-helpers";
import { APPLICATIONS, COMPANY, JOBS } from "./mock/seed";
import { JobStatus } from "@/types";
import type {
  DashboardStats,
  Job,
  JobCreateInput,
  JobListItem,
  JobUpdateInput,
} from "@/types";

function toListItem(job: Job): JobListItem {
  const applicant_count = APPLICATIONS.filter((a) => a.job_id === job.id).length;
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    status: job.status,
    applicant_count,
    created_at: job.created_at,
    updated_at: job.updated_at,
    last_activity_at: job.updated_at,
  };
}

export const jobsService = {
  listForDashboard(status?: string | null): Promise<JobListItem[]> {
    return resolve(
      () =>
        JOBS.filter((j) => (status ? j.status === status : true))
          .map(toListItem)
          .sort((a, b) => +new Date(b.last_activity_at) - +new Date(a.last_activity_at)),
      async () =>
        (
          await apiClient.get("/recruiter/dashboard/jobs", {
            params: { status: status || undefined },
          })
        ).data
    );
  },

  dashboardStats(): Promise<DashboardStats> {
    return resolve(
      () => {
        const counts = {
          all: JOBS.length,
          open: JOBS.filter((j) => j.status === JobStatus.OPEN).length,
          draft: JOBS.filter((j) => j.status === JobStatus.DRAFT).length,
          closed: JOBS.filter((j) => j.status === JobStatus.CLOSED).length,
        };
        return {
          total_openings: counts.open,
          total_applicants: APPLICATIONS.length,
          draft_roles: counts.draft,
          total_roles: counts.all,
          status_counts: counts,
        };
      },
      async () => (await apiClient.get("/recruiter/dashboard/stats")).data
    );
  },

  list(status?: string | null): Promise<Job[]> {
    return resolve(
      () => clone(JOBS.filter((j) => (status ? j.status === status : true))),
      async () =>
        (await apiClient.get("/jobs", { params: { status: status || undefined } })).data
    );
  },

  get(id: string): Promise<Job> {
    return resolve(
      () => {
        const found = JOBS.find((j) => j.id === id);
        if (!found) throw { status: 404, message: "Job not found" };
        return clone(found);
      },
      async () => (await apiClient.get(`/jobs/${id}`)).data
    );
  },

  create(payload: JobCreateInput): Promise<Job> {
    return resolve(
      () => {
        const job: Job = {
          id: uid("job"),
          company_id: COMPANY.id,
          title: payload.title,
          department: payload.department ?? null,
          location: payload.location ?? null,
          description: payload.description,
          status: payload.status ?? JobStatus.DRAFT,
          created_at: nowISO(),
          updated_at: nowISO(),
        };
        JOBS.unshift(job);
        return clone(job);
      },
      async () => (await apiClient.post("/recruiter/jobs", payload)).data
    );
  },

  update(id: string, payload: JobUpdateInput): Promise<Job> {
    return resolve(
      () => {
        const job = JOBS.find((j) => j.id === id);
        if (!job) throw { status: 404, message: "Job not found" };
        Object.assign(job, payload, { updated_at: nowISO() });
        return clone(job);
      },
      async () => (await apiClient.patch(`/jobs/${id}`, payload)).data
    );
  },
};
