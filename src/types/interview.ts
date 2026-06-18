import type { ISODateString } from "./common";

/** app/schemas/recruiter/interview.py → InterviewerSummary */
export interface InterviewerSummary {
  id: string;
  name: string;
  email: string;
}

/** app/schemas/recruiter/interview.py → InterviewResponse */
export interface Interview {
  id: string;
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  job_id: string;
  job_title: string;
  stage: string;
  scheduled_at: ISODateString;
  duration_minutes: number | null;
  timezone: string | null;
  platform: string; // InterviewPlatform
  location: string | null;
  status: string; // InterviewStatus
  notes: string | null;
  meeting_join_url: string | null;
  meeting_host_url: string | null;
  meeting_external_id: string | null;
  interviewers: InterviewerSummary[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** POST /recruiter/interviews → InterviewCreate */
export interface InterviewCreateInput {
  application_id: string;
  stage: string;
  scheduled_at: ISODateString;
  duration_minutes?: number | null;
  timezone?: string | null;
  platform?: string;
  location?: string | null;
  notes?: string | null;
  interviewer_ids?: string[];
  auto_generate_meeting?: boolean;
}

/** PATCH /recruiter/interviews/{id} → InterviewUpdate */
export interface InterviewUpdateInput {
  stage?: string;
  scheduled_at?: ISODateString;
  duration_minutes?: number | null;
  timezone?: string | null;
  platform?: string;
  location?: string | null;
  status?: string;
  notes?: string | null;
  interviewer_ids?: string[];
}

/** app/schemas/recruiter/interview.py → AvailabilitySlot */
export interface AvailabilitySlot {
  start_at: ISODateString;
  end_at: ISODateString;
  available_interviewer_ids: string[];
  available_count: number;
  total_interviewers: number;
  is_optimal: boolean;
}

/** GET /recruiter/interviews/availability → AvailabilityResponse */
export interface AvailabilityResponse {
  date: string;
  timezone: string;
  duration_minutes: number;
  total_interviewers: number;
  slots: AvailabilitySlot[];
}
