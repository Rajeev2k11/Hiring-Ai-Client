"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { companyService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { CompanyProfileUpdateInput, SetupStatus } from "@/types";

export function useSetupStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.company.status,
    queryFn: () => companyService.status(),
    enabled,
  });
}

export function useUpdateCompanyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyProfileUpdateInput) =>
      companyService.updateProfile(payload),
    onSuccess: (status) => {
      qc.setQueryData(queryKeys.company.status, status);
    },
  });
}

export function useCompleteSetup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => companyService.complete(),
    onSuccess: (onboarding) => {
      // Patch the cached status so the onboarding gate clears immediately.
      qc.setQueryData<SetupStatus | undefined>(
        queryKeys.company.status,
        (prev) => (prev ? { ...prev, onboarding } : prev)
      );
      qc.invalidateQueries({ queryKey: queryKeys.company.status });
    },
  });
}

export function useSkipTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => companyService.skipTeam(),
    onSuccess: (onboarding) => {
      qc.setQueryData<SetupStatus | undefined>(
        queryKeys.company.status,
        (prev) => (prev ? { ...prev, onboarding } : prev)
      );
    },
  });
}
