"use client";

/**
 * "Send outreach" — preview then send.
 *
 * The backend picks the template automatically: a candidate who applied gets
 * the SHORTLIST mail, everyone else gets the INVITE ("we're interested, here's
 * the role — apply") mail. The recruiter can edit the copy before sending.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Send, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailAccount, usePreviewOutreach, useSendOutreach } from "@/hooks/useOutreach";
import type { OutreachPreview } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  jobId: string;
  candidateId: string;
  candidateName?: string;
}

export function SendOutreachModal({ open, onClose, jobId, candidateId, candidateName }: Props) {
  const { data: account } = useEmailAccount();
  const preview = usePreviewOutreach();
  const send = useSendOutreach();

  const [data, setData] = useState<OutreachPreview | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!open || !candidateId || !jobId) return;
    setData(null);
    preview
      .mutateAsync({ candidateId, jobId })
      .then((res) => {
        setData(res);
        setSubject(res.subject);
        setBody(res.body_text);
      })
      .catch((e) => toast.error((e as Error).message || "Could not build the email."));
    // Re-render the preview whenever the target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidateId, jobId]);

  if (!open) return null;

  const submit = async () => {
    if (!data?.can_send) return;
    try {
      const result = await send.mutateAsync({
        candidate_ids: [candidateId],
        job_id: jobId,
        kind: data.kind,
        subject,
        body_text: body,
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

  const kindLabel = data?.kind === "SHORTLIST" ? "Shortlist notification" : "Invite to apply";

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

        {preview.isPending || !data ? (
          <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone={data.kind === "SHORTLIST" ? "electric" : "plasma"}>{kindLabel}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="size-3" /> {data.to_email ?? "no email on file"}
              </span>
              <span className="text-xs text-muted-foreground">· {data.job_title}</span>
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
