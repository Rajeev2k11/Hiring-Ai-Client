import type { ISODateString } from "./common";

/** Which template an outreach email used. */
export enum OutreachKind {
  /** Candidate applied and was shortlisted. */
  SHORTLIST = "SHORTLIST",
  /** Candidate never applied — invited to apply. */
  INVITE = "INVITE",
}

export enum OutreachStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  FAILED = "FAILED",
  REPLIED = "REPLIED",
}

/** app/schemas/recruiter/outreach.py → EmailAccountResponse (no credentials). */
export interface EmailAccount {
  id: string;
  from_name: string;
  from_email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_use_tls: boolean;
  smtp_use_ssl: boolean;
  imap_host: string | null;
  imap_port: number;
  imap_username: string | null;
  imap_use_ssl: boolean;
  imap_folder: string;
  status: string; // UNVERIFIED | CONNECTED | ERROR
  last_error: string | null;
  last_verified_at: ISODateString | null;
  last_polled_at: ISODateString | null;
  reply_tracking_enabled: boolean;
  created_at: ISODateString;
}

/** PUT /recruiter/outreach/email-account — passwords optional on update. */
export interface EmailAccountInput {
  from_name: string;
  from_email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password?: string | null;
  smtp_use_tls: boolean;
  smtp_use_ssl: boolean;
  imap_host?: string | null;
  imap_port: number;
  imap_username?: string | null;
  imap_password?: string | null;
  imap_use_ssl: boolean;
  imap_folder: string;
}

export interface OutreachPreview {
  candidate_id: string;
  candidate_name: string | null;
  to_email: string | null;
  job_id: string;
  job_title: string;
  kind: string;
  subject: string;
  body_text: string;
  body_html: string;
  can_send: boolean;
  blockers: string[];
}

export interface OutreachReply {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  received_at: ISODateString | null;
  created_at: ISODateString;
}

export interface OutreachMessage {
  id: string;
  candidate_id: string | null;
  job_id: string | null;
  kind: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  status: string;
  failure_reason: string | null;
  sent_at: ISODateString | null;
  replied_at: ISODateString | null;
  created_at: ISODateString;
  reply_count: number;
}

export interface OutreachMessageDetail extends OutreachMessage {
  body_text: string;
  body_html: string | null;
  replies: OutreachReply[];
}

export interface OutreachSendInput {
  candidate_ids: string[];
  job_id: string;
  kind?: string | null;
  subject?: string | null;
  body_text?: string | null;
}

export interface OutreachSendResult {
  sent_count: number;
  failed_count: number;
  failed: { candidate_id: string; reason: string }[];
}

export interface OutreachSuppression {
  id: string;
  email: string;
  reason: string;
  created_at: ISODateString;
}
