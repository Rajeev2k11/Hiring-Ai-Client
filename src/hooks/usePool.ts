"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { poolService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type {
  LinkedInManualImportInput,
  PoolCandidateUpdateInput,
} from "@/types";

/** List the company's sourced pool candidates. */
export function usePool(sourceType?: string) {
  return useQuery({
    queryKey: queryKeys.pool.list(sourceType),
    queryFn: () => poolService.list(sourceType),
  });
}

/** Upload a resume PDF into the pool. */
export function useUploadPoolResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => poolService.uploadResume(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pool"] }),
  });
}

/** Import a recruiter-entered, consented LinkedIn profile into the pool. */
export function useImportLinkedInCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LinkedInManualImportInput) => poolService.importLinkedIn(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pool"] }),
  });
}

/** Create/enrich a pool candidate from a URL. */
export function useEnrichUrl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => poolService.enrichUrl(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pool"] }),
  });
}

/** Correct an AI-extracted pool profile. */
export function useUpdatePoolCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PoolCandidateUpdateInput }) =>
      poolService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pool"] });
      // Edits change the embedding, so any ranked list built from it is stale.
      qc.invalidateQueries({ queryKey: ["matching"] });
    },
  });
}

/** Remove a candidate from the company's pool. */
export function useDeletePoolCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => poolService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pool"] });
      qc.invalidateQueries({ queryKey: ["matching"] });
    },
  });
}
