import type { ISODateString } from "./common";

/**
 * A company team member (interviewer / recruiter / admin …). Used by the
 * scheduling panel; the backend has no dedicated members endpoint yet so this
 * stays mock-backed.
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  /** UserRole: ADMIN | RECRUITER | HIRING_MANAGER | INTERVIEWER */
  role: string;
  title?: string | null;
  avatar?: string | null;
  created_at?: ISODateString;
}

/** InvitationResponse — recruiter/setup/invitations */
export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string; // PENDING | ACCEPTED | EXPIRED | REVOKED
  expires_at: ISODateString;
  created_at: ISODateString;
}

/** POST recruiter/setup/invitations body → InvitationCreate */
export interface InvitationCreateInput {
  email: string;
  role: string; // UserRole
}

/** POST recruiter/setup/invitations/accept body → InvitationAccept */
export interface InvitationAcceptInput {
  token: string;
  password: string;
}

/** InvitedUserResponse */
export interface InvitedUser {
  id: string;
  company_id: string;
  email: string;
  name: string;
  role: string;
}
