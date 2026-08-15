import { api } from "@/lib/api-fetch";
import type {
  EmailAccount,
  EmailAccountInput,
  OutreachMessage,
  OutreachMessageDetail,
  OutreachPreview,
  OutreachSendInput,
  OutreachSendResult,
  OutreachSuppression,
} from "@/types";

/**
 * Outreach Agent — company-branded candidate email via the BFF proxy.
 * Maps to /recruiter/outreach/*.
 */
export const outreachService = {
  /** Connected mailbox (null when none) — GET .../email-account. */
  getEmailAccount(): Promise<EmailAccount | null> {
    return api.get<EmailAccount | null>("recruiter/outreach/email-account");
  },

  /** Connect/update the mailbox; the backend verifies before saving. */
  saveEmailAccount(input: EmailAccountInput): Promise<EmailAccount> {
    return api.put<EmailAccount>("recruiter/outreach/email-account", input);
  },

  /** Re-verify stored credentials — POST .../email-account/test. */
  testEmailAccount(): Promise<EmailAccount> {
    return api.post<EmailAccount>("recruiter/outreach/email-account/test");
  },

  /** Disconnect the mailbox (sent history is kept). */
  deleteEmailAccount(): Promise<void> {
    return api.del<void>("recruiter/outreach/email-account");
  },

  /** Check the inbox for replies right now. */
  pollReplies(): Promise<{ new_replies: number }> {
    return api.post<{ new_replies: number }>("recruiter/outreach/poll-replies");
  },

  /** Render the email before sending — POST .../preview. */
  preview(candidateId: string, jobId: string, kind?: string): Promise<OutreachPreview> {
    return api.post<OutreachPreview>("recruiter/outreach/preview", {
      candidate_id: candidateId,
      job_id: jobId,
      kind: kind ?? null,
    });
  },

  /** Send to one or many candidates — POST .../send. */
  send(input: OutreachSendInput): Promise<OutreachSendResult> {
    return api.post<OutreachSendResult>("recruiter/outreach/send", input);
  },

  /** Sent history — GET /recruiter/outreach. */
  list(filters: { status?: string; kind?: string; job_id?: string } = {}): Promise<OutreachMessage[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.kind) params.set("kind", filters.kind);
    if (filters.job_id) params.set("job_id", filters.job_id);
    const q = params.toString() ? `?${params.toString()}` : "";
    return api.get<OutreachMessage[]>(`recruiter/outreach${q}`);
  },

  /** One message with its reply thread. */
  get(messageId: string): Promise<OutreachMessageDetail> {
    return api.get<OutreachMessageDetail>(`recruiter/outreach/${messageId}`);
  },

  /** Cancel the pending automatic follow-ups for a conversation. */
  stopSequence(messageId: string): Promise<OutreachMessage> {
    return api.post<OutreachMessage>(
      `recruiter/outreach/${messageId}/stop-sequence`
    );
  },

  /** Opted-out addresses for this company. */
  suppressions(): Promise<OutreachSuppression[]> {
    return api.get<OutreachSuppression[]>("recruiter/outreach/suppressions");
  },
};
