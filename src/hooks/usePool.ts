"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { poolService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

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

/** Create/enrich a pool candidate from a URL. */
export function useEnrichUrl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => poolService.enrichUrl(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pool"] }),
  });
}
