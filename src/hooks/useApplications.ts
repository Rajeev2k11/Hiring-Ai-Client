"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { applicationsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { ApplicationCreateInput } from "@/types";

interface Filters {
  job_id?: string | null;
  status?: string | null;
}

export function useApplications(filters: Filters = {}) {
  return useQuery({
    queryKey: queryKeys.applications.list({
      job_id: filters.job_id ?? undefined,
      status: filters.status ?? undefined,
    }),
    queryFn: () => applicationsService.list(filters),
  });
}

export function useApplication(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.applications.detail(applicationId),
    queryFn: () => applicationsService.get(applicationId),
    enabled: enabled && Boolean(applicationId),
  });
}

/** Run the AI evaluation for an application (POST /applications/{id}/evaluate). */
export function useEvaluateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsService.evaluate(applicationId),
    onSuccess: (_data, applicationId) => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
      qc.invalidateQueries({ queryKey: queryKeys.candidates.detail(applicationId) });
      qc.invalidateQueries({ queryKey: queryKeys.applications.detail(applicationId) });
    },
  });
}

/** Candidate applies to a job (POST /jobs/{id}/apply). */
export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: ApplicationCreateInput;
    }) => applicationsService.apply(jobId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.all });
      // Refresh the candidate-portal views (My Applications + per-job applied state).
      qc.invalidateQueries({ queryKey: ["portal"] });
    },
  });
}
