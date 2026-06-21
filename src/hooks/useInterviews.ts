"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { interviewsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { InterviewCreateInput, InterviewUpdateInput } from "@/types";

/** Page size for the paginated interviews list (backend max is 200). */
export const INTERVIEWS_PAGE_SIZE = 20;

export function useInterviews(status?: string | null) {
  return useQuery({
    queryKey: queryKeys.interviews.list(status ?? undefined),
    queryFn: () => interviewsService.list({ status }),
  });
}

/**
 * Paginated interviews list backed by the `skip`/`limit` query params.
 * Fetches one page at a time and exposes `fetchNextPage` / `hasNextPage`
 * for a "Load more" affordance. There's another page whenever the last
 * page came back full (=== page size).
 */
export function useInfiniteInterviews(status?: string | null) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.interviews.list(status ?? undefined), "infinite"],
    queryFn: ({ pageParam }) =>
      interviewsService.list({
        status,
        skip: pageParam,
        limit: INTERVIEWS_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === INTERVIEWS_PAGE_SIZE
        ? allPages.length * INTERVIEWS_PAGE_SIZE
        : undefined,
  });
}

export function useInterview(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: () => interviewsService.get(id),
    enabled: enabled && Boolean(id),
  });
}

/**
 * Panel availability for a given day. Refetches when the date, panel,
 * duration, or timezone change. Disabled until a date is provided.
 */
export function useInterviewAvailability(
  params: {
    date: string | null;
    interviewer_ids?: string[];
    duration_minutes?: number;
    timezone?: string;
  },
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.interviews.availability({
      date: params.date,
      interviewer_ids: params.interviewer_ids,
      duration_minutes: params.duration_minutes,
      timezone: params.timezone,
    }),
    queryFn: () =>
      interviewsService.availability({
        date: params.date as string,
        interviewer_ids: params.interviewer_ids,
        duration_minutes: params.duration_minutes,
        timezone: params.timezone,
      }),
    enabled: enabled && Boolean(params.date),
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
