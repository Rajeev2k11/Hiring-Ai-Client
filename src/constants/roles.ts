import { UserRole } from "@/types";

/** Selectable company-user roles for team invitations. */
export const ROLE_OPTIONS: {
  value: string;
  label: string;
  description: string;
}[] = [
  {
    value: UserRole.ADMIN,
    label: "Admin",
    description: "Full access including billing and team management",
  },
  {
    value: UserRole.RECRUITER,
    label: "Recruiter",
    description: "Manage jobs, candidates, and interviews",
  },
  {
    value: UserRole.HIRING_MANAGER,
    label: "Hiring Manager",
    description: "Review candidates and submit hiring decisions",
  },
  {
    value: UserRole.INTERVIEWER,
    label: "Interviewer",
    description: "Conduct interviews and leave scorecards",
  },
];

export const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.map((r) => [r.value, r.label])
);
