import { apiClient } from "@/lib/api-client";
import { clone, resolve } from "./api-helpers";
import { COMPANY, SESSIONS, TEAM } from "./mock/seed";
import { daysAgo } from "./api-helpers";
import type {
  NotificationUpdateInput,
  Profile,
  ProfileUpdateInput,
  UserSession,
} from "@/types";

let profile: Profile = {
  id: TEAM[0].id,
  company_id: COMPANY.id,
  name: TEAM[0].name,
  email: TEAM[0].email,
  role: TEAM[0].role,
  email_updates: true,
  application_updates: true,
  created_at: daysAgo(120),
};

export const settingsService = {
  profile(): Promise<Profile> {
    return resolve(
      () => clone(profile),
      async () => (await apiClient.get("/recruiter/settings/profile")).data
    );
  },

  updateProfile(payload: ProfileUpdateInput): Promise<Profile> {
    return resolve(
      () => {
        profile = { ...profile, ...payload };
        return clone(profile);
      },
      async () => (await apiClient.patch("/recruiter/settings/profile", payload)).data
    );
  },

  updateNotifications(payload: NotificationUpdateInput): Promise<Profile> {
    return resolve(
      () => {
        profile = { ...profile, ...payload };
        return clone(profile);
      },
      async () =>
        (await apiClient.patch("/recruiter/settings/notifications", payload)).data
    );
  },

  changePassword(current_password: string, new_password: string): Promise<void> {
    return resolve(
      () => undefined,
      async () => {
        await apiClient.post("/recruiter/settings/password", {
          current_password,
          new_password,
        });
      }
    );
  },

  sessions(): Promise<UserSession[]> {
    return resolve(
      () => clone(SESSIONS),
      async () => (await apiClient.get("/recruiter/settings/sessions")).data
    );
  },

  revokeSession(id: string): Promise<void> {
    return resolve(
      () => {
        const idx = SESSIONS.findIndex((s) => s.id === id);
        if (idx >= 0) SESSIONS.splice(idx, 1);
      },
      async () => {
        await apiClient.delete(`/recruiter/settings/sessions/${id}`);
      }
    );
  },

  deleteAccount(password: string): Promise<void> {
    return resolve(
      () => undefined,
      async () => {
        await apiClient.delete("/recruiter/settings/account", {
          data: { password },
        });
      }
    );
  },

  revokeOtherSessions(): Promise<{ revoked: number }> {
    return resolve(
      () => {
        const others = SESSIONS.filter((s) => !s.is_current);
        const revoked = others.length;
        SESSIONS.splice(0, SESSIONS.length, ...SESSIONS.filter((s) => s.is_current));
        return { revoked };
      },
      async () =>
        (await apiClient.post("/recruiter/settings/sessions/revoke-others")).data
    );
  },
};
