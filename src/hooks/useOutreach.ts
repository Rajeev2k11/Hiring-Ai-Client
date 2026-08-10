"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { outreachService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import type { EmailAccountInput, OutreachSendInput } from "@/types";

/** The company's connected mailbox (null when not set up). */
export function useEmailAccount() {
  return useQuery({
    queryKey: queryKeys.outreach.account,
    queryFn: () => outreachService.getEmailAccount(),
  });
}

export function useSaveEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EmailAccountInput) => outreachService.saveEmailAccount(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.outreach.account }),
  });
}

export function useTestEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => outreachService.testEmailAccount(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.outreach.account }),
  });
}

export function useDeleteEmailAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => outreachService.deleteEmailAccount(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.outreach.account }),
  });
}

/** Sent history, optionally filtered. */
export function useOutreachMessages(
  filters: { status?: string; kind?: string; job_id?: string } = {}
) {
  return useQuery({
    queryKey: queryKeys.outreach.list(filters),
    queryFn: () => outreachService.list(filters),
  });
}

/** One message plus its reply thread. */
export function useOutreachMessage(messageId: string | null) {
  return useQuery({
    queryKey: queryKeys.outreach.detail(messageId ?? ""),
    queryFn: () => outreachService.get(messageId as string),
    enabled: Boolean(messageId),
  });
}

/** Render the email before sending. */
export function usePreviewOutreach() {
  return useMutation({
    mutationFn: ({
      candidateId,
      jobId,
      kind,
    }: {
      candidateId: string;
      jobId: string;
      kind?: string;
    }) => outreachService.preview(candidateId, jobId, kind),
  });
}

export function useSendOutreach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OutreachSendInput) => outreachService.send(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outreach"] }),
  });
}

/** Force an inbox check for new replies. */
export function usePollReplies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => outreachService.pollReplies(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outreach"] }),
  });
}

export function useSuppressions() {
  return useQuery({
    queryKey: queryKeys.outreach.suppressions,
    queryFn: () => outreachService.suppressions(),
  });
}
