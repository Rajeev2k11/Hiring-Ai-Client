import { resolve, clone } from "./api-helpers";
import { TEAM, type TeamMember } from "./mock/seed";

/**
 * Team directory — interviewers/panelists for scheduling and seat management.
 * The backend has no dedicated team-list endpoint yet, so this is mock-only.
 */
export const teamService = {
  members(): Promise<TeamMember[]> {
    return resolve(
      () => clone(TEAM),
      async () => clone(TEAM)
    );
  },
};
