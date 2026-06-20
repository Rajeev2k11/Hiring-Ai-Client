"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import { LIVE } from "@/lib/query-client";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => jobsService.dashboardStats(),
    ...LIVE,
  });
}

export function useDashboardJobs(status?: string | null) {
  return useQuery({
    queryKey: queryKeys.dashboard.jobs(status ?? undefined),
    queryFn: () => jobsService.listForDashboard(status),
    ...LIVE,
  });
}
