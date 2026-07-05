import { api } from "@/lib/api-fetch";
import { clone } from "./api-helpers";
import { TEAM } from "./mock/seed";
import type { Invitation, InvitationCreateInput, TeamMember } from "@/types";

/**
 * Team directory + invitations.
 *
 * - `members()` powers the scheduling interviewer panel. The backend has no
 *   members endpoint yet (no /recruiter/team/members route exists), so this is
 *   always mock-backed until one lands.
 * - Invitations map 1:1 to /api/v1/recruiter/setup/invitations (real backend
 *   via the BFF proxy).
 */
export const teamService = {
  members(): Promise<TeamMember[]> {
    // No backend members endpoint yet — always return the mock directory.
    return Promise.resolve(clone(TEAM) as TeamMember[]);
  },

  invitations(): Promise<Invitation[]> {
    return api.get<Invitation[]>("recruiter/setup/invitations");
  },

  invite(payload: InvitationCreateInput): Promise<Invitation> {
    return api.post<Invitation>("recruiter/setup/invitations", payload);
  },

  revokeInvite(id: string): Promise<void> {
    return api.del<void>(`recruiter/setup/invitations/${id}`);
  },

  resendInvite(id: string): Promise<void> {
    return api.post<void>(`recruiter/setup/invitations/${id}/resend`);
  },
};
