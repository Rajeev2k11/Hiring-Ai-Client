"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { settingsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { NotificationUpdateInput, ProfileUpdateInput } from "@/types";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.settings.profile,
    queryFn: () => settingsService.profile(),
  });
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.settings.sessions,
    queryFn: () => settingsService.sessions(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfileUpdateInput) =>
      settingsService.updateProfile(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile }),
  });
}

export function useUpdateNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NotificationUpdateInput) =>
      settingsService.updateNotifications(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.settings.profile }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (p: { current_password: string; new_password: string }) =>
      settingsService.changePassword(p.current_password, p.new_password),
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.revokeSession(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.settings.sessions }),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => settingsService.deleteAccount(password),
  });
}

export function useRevokeOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.revokeOtherSessions(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.settings.sessions }),
  });
}
