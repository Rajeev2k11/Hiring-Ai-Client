import { clone, resolve } from "./api-helpers";
import { APPLICATIONS, COMPANY, JOBS } from "./mock/seed";
import { JobStatus } from "@/types";
import type { ISODateString, Job } from "@/types";

/**
 * Candidate-portal data. The backend has no candidate-scoped "my applications"
 * endpoint yet, so this is mock-derived from the shared seed for the demo.
 */
export interface PortalApplication {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string | null;
  status: string;
  match_score: number | null;
  applied_at: ISODateString;
  next_step: string | null;
}

const STEP_BY_STATUS: Record<string, string | null> = {
  APPLIED: "Awaiting review",
  SCREENING: "AI screening in progress",
  SHORTLISTED: "Shortlisted — interview likely",
  INTERVIEW: "Interview scheduled",
  OFFER: "Offer extended 🎉",
  HIRED: "Hired 🎉",
  REJECTED: "Not moving forward",
};

export const portalService = {
  myApplications(): Promise<PortalApplication[]> {
    return resolve(
      () =>
        APPLICATIONS.slice(0, 5).map((a) => {
          const job = JOBS.find((j) => j.id === a.job_id);
          return {
            id: a.id,
            job_id: a.job_id,
            job_title: job?.title ?? "Role",
            company: COMPANY.name,
            location: job?.location ?? null,
            status: a.status,
            match_score: a.match_score,
            applied_at: a.created_at,
            next_step: STEP_BY_STATUS[a.status] ?? null,
          };
        }),
      async () => []
    );
  },

  openJobs(): Promise<Job[]> {
    return resolve(
      () => clone(JOBS.filter((j) => j.status === JobStatus.OPEN)),
      async () => []
    );
  },

  job(id: string): Promise<Job | undefined> {
    return resolve(
      () => clone(JOBS.find((j) => j.id === id)),
      async () => undefined
    );
  },
};
