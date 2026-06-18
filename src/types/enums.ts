/**
 * Domain enums — mirrored 1:1 from the FastAPI backend so the frontend stays
 * aligned with the real contract. Values match the backend string values
 * exactly (e.g. JobStatus.OPEN === "OPEN").
 *
 * Backend refs:
 *   app/models/job.py            → JobStatus
 *   app/models/application.py    → ApplicationStatus
 *   app/models/interview.py      → InterviewStatus, InterviewPlatform
 *   app/models/sourcing.py       → SourcingRunStatus
 *   app/models/user.py           → UserRole
 *   app/services/ai_scorer.py    → recommendation {shortlist|maybe|reject}
 */

export const JobStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const ApplicationStatus = {
  APPLIED: "APPLIED",
  SCREENING: "SCREENING",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/** Canonical pipeline ordering (drives Kanban columns + funnel). */
export const APPLICATION_PIPELINE: ApplicationStatus[] = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SCREENING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
];

export const InterviewStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type InterviewStatus =
  (typeof InterviewStatus)[keyof typeof InterviewStatus];

export const InterviewPlatform = {
  ZOOM: "ZOOM",
  GOOGLE_MEET: "GOOGLE_MEET",
  MICROSOFT_TEAMS: "MICROSOFT_TEAMS",
  PHONE: "PHONE",
  ONSITE: "ONSITE",
  OTHER: "OTHER",
} as const;
export type InterviewPlatform =
  (typeof InterviewPlatform)[keyof typeof InterviewPlatform];

export const SourcingRunStatus = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type SourcingRunStatus =
  (typeof SourcingRunStatus)[keyof typeof SourcingRunStatus];

/** Company-user roles (actor_type === "company_user"). */
export const UserRole = {
  ADMIN: "ADMIN",
  RECRUITER: "RECRUITER",
  HIRING_MANAGER: "HIRING_MANAGER",
  INTERVIEWER: "INTERVIEWER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Frontend-only extension: the platform-level operator role. The backend has
 * no SUPER_ADMIN actor yet — this powers the (mock) Super Admin surface and is
 * kept distinct so it never collides with real backend roles.
 */
export const PlatformRole = {
  ...UserRole,
  SUPER_ADMIN: "SUPER_ADMIN",
  CANDIDATE: "CANDIDATE",
} as const;
export type PlatformRole = (typeof PlatformRole)[keyof typeof PlatformRole];

export type ActorType = "company_user" | "candidate";

export const AiRecommendation = {
  SHORTLIST: "shortlist",
  MAYBE: "maybe",
  REJECT: "reject",
} as const;
export type AiRecommendation =
  (typeof AiRecommendation)[keyof typeof AiRecommendation];
