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

export function useDashboardJobs(status?: string | null) {
  return useQuery({
    queryKey: queryKeys.dashboard.jobs(status ?? undefined),
    queryFn: () => jobsService.listForDashboard(status),
  });
}
