"use client";

import { useQuery } from "@tanstack/react-query";
import { portalService } from "@/services/portal.service";

export function useMyApplications() {
  return useQuery({
    queryKey: ["portal", "applications"],
    queryFn: () => portalService.myApplications(),
  });
}

export function usePortalJobs() {
  return useQuery({
    queryKey: ["portal", "jobs"],
    queryFn: () => portalService.openJobs(),
  });
}

export function usePortalJob(id: string, enabled = true) {
  return useQuery({
    queryKey: ["portal", "job", id],
    queryFn: () => portalService.job(id),
    enabled: enabled && Boolean(id),
  });
}
