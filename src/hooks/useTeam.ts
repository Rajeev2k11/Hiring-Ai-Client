"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teamService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { InvitationCreateInput } from "@/types";

export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team.members,
    queryFn: () => teamService.members(),
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: queryKeys.team.invites,
    queryFn: () => teamService.invitations(),
  });
}

export function useInviteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvitationCreateInput) => teamService.invite(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.team.invites }),
  });
}

export function useRevokeInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamService.revokeInvite(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.team.invites }),
  });
}

export function useResendInvite() {
  return useMutation({
    mutationFn: (id: string) => teamService.resendInvite(id),
  });
}
