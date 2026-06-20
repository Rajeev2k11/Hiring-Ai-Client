"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import { LIVE } from "@/lib/query-client";

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: () => analyticsService.overview(),
    ...LIVE,
  });
}
