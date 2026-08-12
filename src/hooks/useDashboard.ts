"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => jobsService.dashboardStats(),
  });
}

export function useDashboardJobs(
  status?: string | null,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.dashboard.jobs(status ?? undefined),
    queryFn: () => jobsService.listForDashboard(status),
    // Lets callers that only need the list conditionally (a role picker inside
    // a closed modal, say) avoid the request until it's actually shown.
    enabled: options.enabled ?? true,
  });
}
