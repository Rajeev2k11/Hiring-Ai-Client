"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { matchingService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import { SourcingRunStatus } from "@/types";
import type { MatchRunCreateInput } from "@/types";

/** Poll a match run while it's in flight (mirrors the backend worker). */
export function useMatchRun(runId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.matching.run(runId ?? ""),
    queryFn: () => matchingService.getRun(runId as string),
    enabled: enabled && Boolean(runId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === SourcingRunStatus.RUNNING ||
        status === SourcingRunStatus.PENDING
        ? 2000
        : false;
    },
  });
}

/** Ranked candidate matches for a job. */
export function useJobMatches(
  jobId: string,
  filters: { min_score?: number; status?: string } = {},
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.matching.candidates(jobId, filters),
    queryFn: () => matchingService.jobCandidates(jobId, filters),
    enabled: enabled && Boolean(jobId),
  });
}

/** Parse a job's description into structured requirements. */
export function useParseRequirements() {
  return useMutation({
    mutationFn: (jobId: string) => matchingService.parseRequirements(jobId),
  });
}

/** Start a match run for a job. */
export function useStartMatch() {
  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: string; payload?: MatchRunCreateInput }) =>
      matchingService.startMatch(jobId, payload),
  });
}

/** Update a match's recruiter status (SAVED / REJECTED / CONTACTED). */
export function useUpdateMatchStatus(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, status }: { matchId: string; status: string }) =>
      matchingService.updateStatus(matchId, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["matching", "candidates", jobId] }),
  });
}
