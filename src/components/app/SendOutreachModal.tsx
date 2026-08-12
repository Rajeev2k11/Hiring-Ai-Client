"use client";

/**
 * "Send outreach" — pick the role, pick the email, preview it, edit it, send.
 *
 * Three templates, each tied to where the candidate actually stands:
 *
 * - INVITE    — sourced and never applied. Carries an apply link to the public
 *               job page; once they apply they enter the pipeline normally.
 * - SHORTLIST — already applied, and this tells them they progressed.
 * - REJECTION — the company has decided not to proceed. Closing the loop beats
 *               leaving someone waiting on an answer that never comes.
 *
 * Which are offered is the backend's call (`allowed_kinds`), not a guess made
 * here: telling somebody they've been shortlisted, or rejected, when they were
 * never in the process is a false statement, so those are earned rather than
 * always available.
 *
 * `jobId` may be omitted — from the talent pool there is no role in context, so
 * the recruiter picks one first and everything else follows from that.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Repeat, Send, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailAccount, usePreviewOutreach, useSendOutreach } from "@/hooks/useOutreach";
import { useDashboardJobs } from "@/hooks/useDashboard";
import { FOLLOW_UP_DELAY_DAYS } from "@/constants/status";
import { cn } from "@/lib/utils";
import type { OutreachPreview } from "@/types";

/** Order here is the order shown in the picker: ask → progress → decline. */
const KIND_ORDER = ["INVITE", "SHORTLIST", "REJECTION"] as const;

const KIND_META: Record<
  string,
  { label: string; blurb: string; locked: string }
> = {
  INVITE: {
    label: "Invite to apply",
    blurb:
      "Sourced candidate who hasn't applied. Includes a link to the role so they can apply themselves.",
    locked: "",
  },
  SHORTLIST: {
    label: "Shortlist notification",
    blurb: "Tells an existing applicant their application has moved forward.",
    locked: "Available once this candidate has applied to the role.",
  },
  REJECTION: {
    label: "Not moving forward",
    blurb:
      "A clear, respectful decline that keeps the door open for future roles.",
    locked: "Available once this candidate has applied to or been matched with the role.",
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** Omit to let the recruiter choose the role inside the modal. */
  jobId?: string;
  candidateId: string;
  candidateName?: string;
}

export function SendOutreachModal({
  open,
  onClose,
  jobId,
  candidateId,
  candidateName,
}: Props) {
  const { data: account } = useEmailAccount();
  const preview = usePreviewOutreach();
  const send = useSendOutreach();
  // Only fetched when the caller didn't fix a role for us.
  const { data: jobs } = useDashboardJobs(null, { enabled: open && !jobId });

  const [pickedJobId, setPickedJobId] = useState("");
  const [data, setData] = useState<OutreachPreview | null>(null);
  const [kind, setKind] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  /** The kind the backend detected — what the candidate's record supports. */
  const [detectedKind, setDetectedKind] = useState<string | null>(null);
  /** How many automatic nudges the agent may send if there's no reply. */
  const [followUps, setFollowUps] = useState(2);

  const activeJobId = jobId || pickedJobId;

  // Reset everything when the modal closes, so reopening for a different
  // candidate never shows the previous one's copy for a frame.
  useEffect(() => {
    if (open) return;
    setPickedJobId("");
    setData(null);
    setKind(null);
    setDetectedKind(null);
  }, [open]);

  useEffect(() => {
    if (!open || !candidateId || !activeJobId) return;
    setData(null);
    setKind(null);
    setDetectedKind(null);
    preview
      .mutateAsync({ candidateId, jobId: activeJobId })
      .then((res) => {
        setData(res);
        setDetectedKind(res.kind);
        setKind(res.kind);
        setSubject(res.subject);
        setBody(res.body_text);
      })
      .catch((e) => toast.error((e as Error).message || "Could not build the email."));
    // Re-render the preview whenever the target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidateId, activeJobId]);

  if (!open) return null;

  /**
   * Re-render with a different template. Any hand-edited copy is replaced,
   * which is the point — the three mails say entirely different things.
   */
  const switchKind = async (next: string) => {
    if (next === kind || preview.isPending || !activeJobId) return;
    try {
      const res = await preview.mutateAsync({
        candidateId,
        jobId: activeJobId,
        kind: next,
      });
      setData(res);
      setKind(res.kind);
      setSubject(res.subject);
      setBody(res.body_text);
    } catch (e) {
      toast.error((e as Error).message || "Could not switch the template.");
    }
  };

  const submit = async () => {
    if (!data?.can_send || !activeJobId) return;
    const sendingKind = kind ?? data.kind;
    try {
      const result = await send.mutateAsync({
        candidate_ids: [candidateId],
        job_id: activeJobId,
        kind: sendingKind,
        subject,
        body_text: body,
        // Only an invite gets chased; the backend enforces this too.
        follow_ups: sendingKind === "INVITE" ? followUps : 0,
      });
      if (result.sent_count > 0) {
        toast.success(`Email sent to ${data.candidate_name ?? "candidate"}`);
        onClose();
      } else {
        toast.error(result.failed[0]?.reason ?? "Send failed");
      }
    } catch (e) {
      toast.error((e as Error).message || "Could not send the email.");
    }
  };

  const allowedKinds = data?.allowed_kinds ?? [];
  const activeKind = kind ?? data?.kind ?? "INVITE";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Send outreach{candidateName ? ` to ${candidateName}` : ""}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the email before it goes out.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* No mailbox connected */}
        {!account && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-sm font-medium">Connect your email account first</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Outreach is sent from your own mailbox so candidates see your company as the sender.
            </p>
            <Button asChild variant="brand" size="sm" className="mt-2">
              <Link href="/settings">Go to Settings → Email</Link>
            </Button>
          </div>
        )}

        {/* Role picker — only when the caller didn't fix one for us */}
        {!jobId && (
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="ou-job">Which role is this about?</Label>
            <select
              id="ou-job"
              value={pickedJobId}
              onChange={(e) => setPickedJobId(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3.5 text-sm outline-none focus-visible:border-electric/60 focus-visible:ring-2 focus-visible:ring-electric/25"
            >
              <option value="" className="bg-popover">
                Select a role…
              </option>
              {(jobs ?? []).map((job) => (
                <option key={job.id} value={job.id} className="bg-popover">
                  {job.title}
                  {job.department ? ` · ${job.department}` : ""}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground">
              Every outreach email is about a specific role — it shapes the copy
              and the apply link.
            </p>
          </div>
        )}

        {!activeJobId ? null : preview.isPending || !data ? (
          <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="size-3" /> {data.to_email ?? "no email on file"}
              </span>
              <span className="text-xs text-muted-foreground">· {data.job_title}</span>
            </div>

            {/* Template picker */}
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Email type</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {KIND_ORDER.map((k) => {
                  const selected = activeKind === k;
                  const locked = !allowedKinds.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={locked || preview.isPending}
                      onClick={() => switchKind(k)}
                      title={locked ? KIND_META[k].locked : undefined}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        selected
                          ? "border-electric/50 bg-electric/10"
                          : "border-border/60 hover:border-border",
                        locked && "cursor-not-allowed border-dashed opacity-45"
                      )}
                    >
                      <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                        {KIND_META[k].label}
                        {k === detectedKind && (
                          <Badge tone="neutral">Suggested</Badge>
                        )}
                      </span>
                      <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                        {locked ? KIND_META[k].locked : KIND_META[k].blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {data.blockers.length > 0 && (
              <div className="mt-3 flex gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" />
                <div className="text-xs text-muted-foreground">
                  {data.blockers.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ou-subject">Subject</Label>
                <Input
                  id="ou-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!data.can_send}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ou-body">Message</Label>
                <Textarea
                  id="ou-body"
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={!data.can_send}
                />
                <p className="text-[11px] text-muted-foreground">
                  An unsubscribe link is added automatically.
                </p>
              </div>
            </div>

            {/* Follow-up agent — invites only */}
            {activeKind === "INVITE" && (
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/20 p-3.5">
                <div className="flex items-start gap-2">
                  <Repeat className="mt-0.5 size-4 shrink-0 text-electric-soft" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Automatic follow-ups</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      If they don&apos;t reply, send a short nudge every{" "}
                      {FOLLOW_UP_DELAY_DAYS} days in the same email thread. Stops
                      by itself the moment they reply, apply, or unsubscribe.
                    </p>
                    <div className="mt-2.5 flex gap-1.5">
                      {[0, 1, 2].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFollowUps(n)}
                          className={cn(
                            "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                            followUps === n
                              ? "border-electric/50 bg-electric/10 text-electric-soft"
                              : "border-border/60 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {n === 0 ? "Don't follow up" : `${n} follow-up${n > 1 ? "s" : ""}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="brand"
                onClick={submit}
                disabled={!data.can_send || !account || send.isPending}
              >
                {send.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Send email
              </Button>
              <Button variant="ghost" onClick={onClose} disabled={send.isPending}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
