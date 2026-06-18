"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sourcingService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import { SourcingRunStatus } from "@/types";
import type { SourcingRunCreateInput } from "@/types";

export function useSourcingProviders() {
  return useQuery({
    queryKey: queryKeys.sourcing.providers,
    queryFn: () => sourcingService.providers(),
  });
}

export function useSourcingRuns() {
  return useQuery({
    queryKey: queryKeys.sourcing.runs,
    queryFn: () => sourcingService.listRuns(),
  });
}

export function useSourcingRun(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.sourcing.run(id),
    queryFn: () => sourcingService.getRun(id),
    enabled: enabled && Boolean(id),
    // Poll while the run is in flight (mirrors the backend background worker).
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === SourcingRunStatus.RUNNING ||
        status === SourcingRunStatus.PENDING
        ? 2500
        : false;
    },
  });
}

export function useSourcingRunCandidates(
  id: string,
  selectedOnly = false,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.sourcing.runCandidates(id, selectedOnly),
    queryFn: () => sourcingService.runCandidates(id, selectedOnly),
    enabled: enabled && Boolean(id),
  });
}

export function useStartSourcingRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SourcingRunCreateInput) =>
      sourcingService.startRun(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sourcing.runs }),
  });
}
