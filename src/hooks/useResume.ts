"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { resumeService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

/**
 * Read the résumé for an application. A missing résumé is a 404 from the
 * backend; pass `enabled: false` or handle the error where there may be none.
 */
export function useResume(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.resume.detail(applicationId),
    queryFn: () => resumeService.get(applicationId),
    enabled: enabled && Boolean(applicationId),
    retry: false,
  });
}

/** Upload a PDF résumé for an application (multipart). */
export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, file }: { applicationId: string; file: File }) =>
      resumeService.upload(applicationId, file),
    onSuccess: (_data, { applicationId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.resume.detail(applicationId) });
      qc.invalidateQueries({
        queryKey: queryKeys.applications.detail(applicationId),
      });
    },
  });
}
