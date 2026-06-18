import type { ISODateString } from "./common";

/** app/schemas/job.py → JobResponse */
export interface Job {
  id: string;
  company_id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string;
  status: string; // JobStatus
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** app/schemas/recruiter/job.py → RecruiterJobCreate (company derived from token) */
export interface JobCreateInput {
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  status?: string; // OPEN (publish) | DRAFT (save draft)
}

/** app/schemas/job.py → JobUpdate */
export interface JobUpdateInput {
  title?: string;
  department?: string | null;
  location?: string | null;
  description?: string;
  status?: string;
}

/** app/schemas/recruiter/dashboard.py → JobStatusCounts */
export interface JobStatusCounts {
  all: number;
  open: number;
  draft: number;
  closed: number;
}

/** app/schemas/recruiter/dashboard.py → DashboardStats */
export interface DashboardStats {
  total_openings: number;
  total_applicants: number;
  draft_roles: number;
  total_roles: number;
  status_counts: JobStatusCounts;
}

/** app/schemas/recruiter/dashboard.py → JobListItem */
export interface JobListItem {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  status: string;
  applicant_count: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  last_activity_at: ISODateString;
}
