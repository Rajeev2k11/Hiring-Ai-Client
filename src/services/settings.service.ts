import { api } from "@/lib/api-fetch";
import type {
  NotificationUpdateInput,
  Profile,
  ProfileUpdateInput,
  UserSession,
} from "@/types";

/**
 * Recruiter Settings — real backend integration via the authenticated BFF
 * proxy. Maps 1:1 to /api/v1/recruiter/settings/*.
 */
export const settingsService = {
  profile(): Promise<Profile> {
    return api.get<Profile>("recruiter/settings/profile");
  },

  updateProfile(payload: ProfileUpdateInput): Promise<Profile> {
    return api.patch<Profile>("recruiter/settings/profile", payload);
  },

  updateNotifications(payload: NotificationUpdateInput): Promise<Profile> {
    return api.patch<Profile>("recruiter/settings/notifications", payload);
  },

  changePassword(current_password: string, new_password: string): Promise<void> {
    return api.post<void>("recruiter/settings/password", {
      current_password,
      new_password,
    });
  },

  sessions(): Promise<UserSession[]> {
    return api.get<UserSession[]>("recruiter/settings/sessions");
  },

  revokeSession(id: string): Promise<void> {
    return api.del<void>(`recruiter/settings/sessions/${id}`);
  },

  revokeOtherSessions(): Promise<{ revoked: number }> {
    return api.post<{ revoked: number }>(
      "recruiter/settings/sessions/revoke-others"
    );
  },

  deleteAccount(password: string): Promise<void> {
    return api.del<void>("recruiter/settings/account", { password });
  },
};
