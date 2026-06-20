"use client";

import { useQuery } from "@tanstack/react-query";

import { applicationsService, jobsService } from "@/services";
import {
  portalService,
  STEP_BY_STATUS,
  type PortalApplication,
} from "@/services/portal.service";
import { LIVE } from "@/lib/query-client";
import { useAppSelector } from "@/store/hooks";

/**
 * The signed-in candidate's applications. The backend has no candidate-scoped
 * list, so we fetch all applications + jobs and join/filter to this candidate
 * (matched by their candidate id from the session).
 */
export function useMyApplications() {
  const candidateId = useAppSelector((s) => s.auth.identity?.id);
  return useQuery({
    queryKey: ["portal", "applications", candidateId],
    enabled: Boolean(candidateId),
    ...LIVE,
    queryFn: async (): Promise<PortalApplication[]> => {
      const [apps, jobs] = await Promise.all([
        applicationsService.list(),
        jobsService.list(),
      ]);
      const jobMap = new Map(jobs.map((j) => [j.id, j]));
      return apps
        .filter((a) => a.candidate_id === candidateId)
        .map((a) => {
          const job = jobMap.get(a.job_id);
          return {
            id: a.id,
            job_id: a.job_id,
            job_title: job?.title ?? "Role",
            location: job?.location ?? null,
            status: a.status,
            match_score: a.match_score,
            applied_at: a.created_at,
            next_step: STEP_BY_STATUS[a.status] ?? null,
          };
        })
        .sort((a, b) => +new Date(b.applied_at) - +new Date(a.applied_at));
    },
  });
}

export function usePortalJobs() {
  return useQuery({
    queryKey: ["portal", "jobs"],
    queryFn: () => portalService.openJobs(),
    ...LIVE,
  });
}

export function usePortalJob(id: string, enabled = true) {
  return useQuery({
    queryKey: ["portal", "job", id],
    queryFn: () => portalService.job(id),
    enabled: enabled && Boolean(id),
  });
}

/**
 * This candidate's application to a specific job, if they've already applied
 * (else null). Powers the "Applied" state on the job-detail page.
 */
export function useMyApplicationForJob(jobId: string, enabled = true) {
  const candidateId = useAppSelector((s) => s.auth.identity?.id);
  return useQuery({
    queryKey: ["portal", "job-application", jobId, candidateId],
    enabled: enabled && Boolean(jobId) && Boolean(candidateId),
    ...LIVE,
    queryFn: async () => {
      const apps = await applicationsService.list({ job_id: jobId });
      return apps.find((a) => a.candidate_id === candidateId) ?? null;
    },
  });
}
