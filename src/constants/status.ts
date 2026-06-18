import {
  ApplicationStatus,
  InterviewStatus,
  JobStatus,
  SourcingRunStatus,
  AiRecommendation,
} from "@/types";

/** Visual tone tokens consumed by the Badge / StatusDot components. */
export type Tone =
  | "neutral"
  | "info"
  | "electric"
  | "plasma"
  | "success"
  | "warning"
  | "danger";

interface StatusMeta {
  label: string;
  tone: Tone;
}

export const JOB_STATUS_META: Record<string, StatusMeta> = {
  [JobStatus.DRAFT]: { label: "Draft", tone: "neutral" },
  [JobStatus.OPEN]: { label: "Open", tone: "success" },
  [JobStatus.CLOSED]: { label: "Closed", tone: "danger" },
};

export const APPLICATION_STATUS_META: Record<string, StatusMeta> = {
  [ApplicationStatus.APPLIED]: { label: "Applied", tone: "neutral" },
  [ApplicationStatus.SCREENING]: { label: "Screening", tone: "info" },
  [ApplicationStatus.SHORTLISTED]: { label: "Shortlisted", tone: "electric" },
  [ApplicationStatus.INTERVIEW]: { label: "Interview", tone: "plasma" },
  [ApplicationStatus.OFFER]: { label: "Offer", tone: "warning" },
  [ApplicationStatus.HIRED]: { label: "Hired", tone: "success" },
  [ApplicationStatus.REJECTED]: { label: "Rejected", tone: "danger" },
};

export const INTERVIEW_STATUS_META: Record<string, StatusMeta> = {
  [InterviewStatus.SCHEDULED]: { label: "Scheduled", tone: "info" },
  [InterviewStatus.COMPLETED]: { label: "Completed", tone: "success" },
  [InterviewStatus.CANCELLED]: { label: "Cancelled", tone: "danger" },
};

export const SOURCING_STATUS_META: Record<string, StatusMeta> = {
  [SourcingRunStatus.PENDING]: { label: "Queued", tone: "neutral" },
  [SourcingRunStatus.RUNNING]: { label: "Running", tone: "electric" },
  [SourcingRunStatus.COMPLETED]: { label: "Completed", tone: "success" },
  [SourcingRunStatus.FAILED]: { label: "Failed", tone: "danger" },
};

export const RECOMMENDATION_META: Record<string, StatusMeta> = {
  [AiRecommendation.SHORTLIST]: { label: "Shortlist", tone: "success" },
  [AiRecommendation.MAYBE]: { label: "Maybe", tone: "warning" },
  [AiRecommendation.REJECT]: { label: "Reject", tone: "danger" },
};

export const PLATFORM_LABELS: Record<string, string> = {
  ZOOM: "Zoom",
  GOOGLE_MEET: "Google Meet",
  MICROSOFT_TEAMS: "Microsoft Teams",
  PHONE: "Phone",
  ONSITE: "On-site",
  OTHER: "Other",
};

/** Map an AI match score (0–100) to a tone for chips/rings. */
export function scoreTone(score?: number | null): Tone {
  if (score === null || score === undefined) return "neutral";
  if (score >= 80) return "success";
  if (score >= 60) return "electric";
  if (score >= 40) return "warning";
  return "danger";
}
