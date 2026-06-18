"use client";

import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/services";
import type { JobDraftContext } from "@/types";

export function useImproveDescription() {
  return useMutation({
    mutationFn: (ctx: JobDraftContext) => aiService.improveDescription(ctx),
  });
}

export function useGenerateRequirements() {
  return useMutation({
    mutationFn: (ctx: JobDraftContext) => aiService.generateRequirements(ctx),
  });
}

export function useSuggestSalary() {
  return useMutation({
    mutationFn: (ctx: JobDraftContext) => aiService.suggestSalary(ctx),
  });
}
