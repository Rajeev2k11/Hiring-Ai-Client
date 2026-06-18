"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { interviewsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { InterviewCreateInput, InterviewUpdateInput } from "@/types";

export function useInterviews(status?: string | null) {
  return useQuery({
    queryKey: queryKeys.interviews.list(status ?? undefined),
    queryFn: () => interviewsService.list(status),
  });
}

export function useInterview(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: () => interviewsService.get(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InterviewCreateInput) =>
      interviewsService.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.interviews.all }),
  });
}

export function useUpdateInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InterviewUpdateInput }) =>
      interviewsService.update(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.interviews.all }),
  });
}

export function useDeleteInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => interviewsService.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.interviews.all }),
  });
}
