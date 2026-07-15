"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { candidatesService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

interface Filters {
  status?: string | null;
  job_id?: string | null;
}

export function useCandidates(filters: Filters = {}) {
  return useQuery({
    queryKey: queryKeys.candidates.list({
      status: filters.status ?? undefined,
      job_id: filters.job_id ?? undefined,
    }),
    queryFn: () => candidatesService.list(filters),
  });
}

export function useCandidate(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.candidates.detail(applicationId),
    queryFn: () => candidatesService.detail(applicationId),
    enabled: enabled && Boolean(applicationId),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      candidatesService.updateStatus(id, status),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
      qc.invalidateQueries({ queryKey: queryKeys.candidates.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.analytics.overview });
    },
  });
}
