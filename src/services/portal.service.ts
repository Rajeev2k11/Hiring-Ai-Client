import { api } from "@/lib/api-fetch";
import { applicationsService } from "./applications.service";
import { JobStatus } from "@/types";
import type {
  Application,
  ApplicationCreateInput,
  ISODateString,
  Job,
} from "@/types";

/**
 * Candidate-portal data — real backend via the authenticated BFF proxy.
 * Open roles + a single job come from the public /jobs routes; applying goes
 * through /jobs/{id}/apply.
 *
 * "My applications" is derived from GET /applications (the backend has no
 * candidate-scoped list yet) filtered to the signed-in candidate in the hook.
 */
export interface PortalApplication {
  id: string;
  job_id: string;
  job_title: string;
  location: string | null;
  status: string;
  match_score: number | null;
  applied_at: ISODateString;
  next_step: string | null;
}

/** Human "what happens next" label per application status. */
export const STEP_BY_STATUS: Record<string, string | null> = {
  APPLIED: "Awaiting review",
  SCREENING: "AI screening in progress",
  SHORTLISTED: "Shortlisted — interview likely",
  INTERVIEW: "Interview scheduled",
  OFFER: "Offer extended 🎉",
  HIRED: "Hired 🎉",
  REJECTED: "Not moving forward",
};

export const portalService = {
  /** All open roles for the candidate listing — GET /jobs?status=OPEN. */
  openJobs(): Promise<Job[]> {
    return api.get<Job[]>(`jobs?status=${JobStatus.OPEN}`);
  },

  /** A single job — GET /jobs/{id}. */
  job(id: string): Promise<Job> {
    return api.get<Job>(`jobs/${id}`);
  },

  /** Apply to a job — POST /jobs/{id}/apply. */
  apply(jobId: string, payload: ApplicationCreateInput): Promise<Application> {
    return applicationsService.apply(jobId, payload);
  },
};
