"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { jobsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { JobCreateInput, JobUpdateInput } from "@/types";

export function useJobs(status?: string | null) {
  return useQuery({
    queryKey: queryKeys.jobs.list(status ?? undefined),
    queryFn: () => jobsService.list(status),
  });
}

export function useJob(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobsService.get(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: JobCreateInput) => jobsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: JobUpdateInput }) =>
      jobsService.update(id, payload),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all });
      qc.invalidateQueries({ queryKey: queryKeys.jobs.detail(job.id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}
