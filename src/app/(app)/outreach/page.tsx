"use client";

/**
 * Outreach inbox: every candidate email this company sent, with the replies
 * that came back. Replies are pulled from the connected mailbox by the
 * background poller; "Check replies" forces a poll now.
 */

import { useState } from "react";
import Link from "next/link";
import {
  Ban,
  CircleStop,
  Inbox,
  Loader2,
  Mail,
  MailCheck,
  MailX,
  RefreshCw,
  Repeat,
  Send,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  useEmailAccount,
  useOutreachMessage,
  useOutreachMessages,
  usePollReplies,
  useStopSequence,
  useSuppressions,
} from "@/hooks/useOutreach";
import { SEQUENCE_STATE_META } from "@/constants/status";
import {
  usePersistentState,
  useScrollRestoration,
} from "@/hooks/usePersistentState";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Tone } from "@/constants/status";
import type { OutreachMessage } from "@/types";

const STATUS_META: Record<string, { label: string; tone: Tone }> = {
  QUEUED: { label: "Queued", tone: "neutral" },
  SENT: { label: "Sent", tone: "info" },
  REPLIED: { label: "Replied", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
};

const KIND_META: Record<string, { label: string; tone: Tone }> = {
  SHORTLIST: { label: "Shortlist", tone: "electric" },
  INVITE: { label: "Invite to apply", tone: "plasma" },
};

const TABS = [
  { label: "All", value: "" },
  { label: "Replied", value: "REPLIED" },
  { label: "Sent", value: "SENT" },
  { label: "Failed", value: "FAILED" },
];

export default function OutreachPage() {
  const [status, setStatus] = usePersistentState("outreach:status", "");
  // Which thread was expanded is part of "where I was" too — the inbox is long
  // and re-finding the open message after a detour is pure friction.
  const [openId, setOpenId] = usePersistentState<string | null>(
    "outreach:openId",
    null
  );
  const [showSuppressions, setShowSuppressions] = useState(false);

  const { data: account } = useEmailAccount();
  const { data: messages, isLoading } = useOutreachMessages({ status: status || undefined });
  useScrollRestoration("outreach", !isLoading);
  const { data: suppressions } = useSuppressions();
  const poll = usePollReplies();

  const onPoll = async () => {
    try {
      const res = await poll.mutateAsync();
      toast.success(
        res.new_replies > 0
          ? `${res.new_replies} new repl${res.new_replies === 1 ? "y" : "ies"} found`
          : "No new replies"
      );
    } catch (e) {
      toast.error((e as Error).message || "Could not check replies.");
    }
  };

  const repliedCount = (messages ?? []).filter((m) => m.status === "REPLIED").length;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Outreach"
        title="Candidate outreach"
        description="Every email sent to candidates from your company, and the replies that came back."
        actions={
          <div className="flex gap-2">
            {account?.reply_tracking_enabled && (
              <Button variant="outline" size="sm" onClick={onPoll} disabled={poll.isPending}>
                {poll.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Check replies
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <Settings2 className="size-4" /> Email settings
              </Link>
            </Button>
          </div>
        }
      />

      {/* Mailbox status */}
      {!account ? (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-medium">No email account connected</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your company mailbox in Settings → Email to start sending outreach and
            tracking replies.
          </p>
          <Button asChild variant="brand" size="sm" className="mt-3">
            <Link href="/settings">Connect email account</Link>
          </Button>
        </div>
      ) : !account.reply_tracking_enabled ? (
        <div className="mt-6 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
          Sending is set up, but replies aren&apos;t tracked. Add IMAP details in{" "}
          <Link href="/settings" className="text-electric-soft hover:underline">
            Settings → Email
          </Link>{" "}
          to see candidate replies here.
        </div>
      ) : null}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Send} label="Sent" value={(messages ?? []).length} />
        <StatTile icon={MailCheck} label="Replied" value={repliedCount} tone="success" />
        <StatTile
          icon={MailX}
          label="Failed"
          value={(messages ?? []).filter((m) => m.status === "FAILED").length}
          tone="danger"
        />
        <button onClick={() => setShowSuppressions((v) => !v)} className="text-left">
          <StatTile icon={Ban} label="Unsubscribed" value={(suppressions ?? []).length} />
        </button>
      </div>

      {showSuppressions && (
        <div className="mt-3 rounded-2xl border border-border/70 bg-card/40 p-4">
          <p className="mb-2 text-sm font-semibold">Unsubscribed addresses</p>
          {!suppressions?.length ? (
            <p className="text-sm text-muted-foreground">Nobody has unsubscribed.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {suppressions.map((s) => (
                <li key={s.id} className="flex justify-between gap-3 text-muted-foreground">
                  <span className="truncate">{s.email}</span>
                  <span className="shrink-0 text-xs">
                    {s.reason.toLowerCase()} · {formatRelative(s.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">History</h2>
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setStatus(t.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                status === t.value
                  ? "border-electric/50 bg-electric/10 text-electric-soft"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : !messages?.length ? (
          <EmptyState
            icon={Inbox}
            title="No outreach yet"
            description="Open a job's candidates or AI matches and use “Send outreach” to email a candidate."
          />
        ) : (
          messages.map((m) => (
            <MessageRow
              key={m.id}
              message={m}
              open={openId === m.id}
              onToggle={() => setOpenId(openId === m.id ? null : m.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Send;
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold",
          tone === "success" && "text-emerald-300",
          tone === "danger" && value > 0 && "text-red-300"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MessageRow({
  message,
  open,
  onToggle,
}: {
  message: OutreachMessage;
  open: boolean;
  onToggle: () => void;
}) {
  const { data: detail, isLoading } = useOutreachMessage(open ? message.id : null);
  const stopSequence = useStopSequence();
  const statusMeta = STATUS_META[message.status] ?? { label: message.status, tone: "neutral" as Tone };
  const kindMeta = KIND_META[message.kind] ?? { label: message.kind, tone: "neutral" as Tone };
  const sequenceMeta = message.sequence_state
    ? SEQUENCE_STATE_META[message.sequence_state]
    : null;
  const sequenceRunning = message.sequence_state === "ACTIVE";

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 transition-colors hover:border-electric/30">
      <button onClick={onToggle} className="flex w-full items-start gap-3.5 p-4 text-left">
        <UserAvatar
          seed={message.candidate_id ?? message.to_email}
          name={message.to_name ?? message.to_email}
          size={38}
          className="border border-border/60"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{message.to_name ?? message.to_email}</span>
            <Badge tone={kindMeta.tone}>{kindMeta.label}</Badge>
            <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            {message.reply_count > 0 && (
              <Badge tone="success">
                {message.reply_count} repl{message.reply_count === 1 ? "y" : "ies"}
              </Badge>
            )}
            {sequenceMeta && (
              <Badge tone={sequenceMeta.tone}>
                <Repeat className="mr-1 inline size-3" />
                {sequenceMeta.label}
              </Badge>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-foreground/80">{message.subject}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {message.to_email}
            {message.sent_at ? ` · sent ${formatRelative(message.sent_at)}` : ""}
            {message.replied_at ? ` · replied ${formatRelative(message.replied_at)}` : ""}
          </p>
          {sequenceRunning && message.follow_up_due_at && (
            <p className="mt-1 text-xs text-electric-soft">
              Next automatic follow-up {formatRelative(message.follow_up_due_at)}
              {message.max_follow_ups > 0
                ? ` · ${message.sequence_step}/${message.max_follow_ups} sent`
                : ""}
            </p>
          )}
          {message.failure_reason && (
            <p className="mt-1 text-xs text-red-400">{message.failure_reason}</p>
          )}
        </div>
        <Mail className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="border-t border-border/50 px-4 pb-4 pt-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <>
              {sequenceRunning && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-electric/30 bg-electric/5 p-3">
                  <p className="text-xs text-muted-foreground">
                    Automatic follow-ups are on. They stop by themselves if{" "}
                    {message.to_name ?? "the candidate"} replies, applies, or
                    unsubscribes.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={stopSequence.isPending}
                    onClick={() =>
                      stopSequence.mutate(message.id, {
                        onSuccess: () => toast.success("Follow-ups stopped."),
                        onError: (e) =>
                          toast.error(
                            (e as Error).message || "Could not stop follow-ups"
                          ),
                      })
                    }
                  >
                    {stopSequence.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CircleStop className="size-4" />
                    )}
                    Stop follow-ups
                  </Button>
                </div>
              )}

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sent message
              </p>
              <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-border/50 bg-secondary/20 p-3 text-sm text-foreground/85">
                {detail?.body_text}
              </pre>

              {detail?.replies?.length ? (
                <>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Replies
                  </p>
                  <div className="mt-2 space-y-2">
                    {detail.replies.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {r.from_name || r.from_email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {r.received_at ? formatRelative(r.received_at) : ""}
                          </span>
                        </div>
                        {r.subject && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.subject}</p>
                        )}
                        <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground/85">
                          {r.body_text}
                        </pre>
                        <a
                          href={`mailto:${r.from_email}`}
                          className="mt-2 inline-block text-xs font-medium text-electric-soft hover:underline"
                        >
                          Reply by email →
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">No reply yet.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
