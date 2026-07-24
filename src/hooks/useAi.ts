"use client";

import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/services";
import type { ComposerComposeInput, JobDraftContext } from "@/types";

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

/** Composer: analyze the one-line hiring intent. */
export function useComposerStart() {
  return useMutation({
    mutationFn: (prompt: string) => aiService.composerStart(prompt),
  });
}

/** Composer: suggest skills for the chosen title. */
export function useComposerSkills() {
  return useMutation({
    mutationFn: ({ title, department }: { title: string; department?: string | null }) =>
      aiService.composerSkills(title, department),
  });
}

/** Composer: build the final description from the wizard answers. */
export function useComposerCompose() {
  return useMutation({
    mutationFn: (input: ComposerComposeInput) => aiService.composerCompose(input),
  });
}
