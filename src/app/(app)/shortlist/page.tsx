"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  ExternalLink,
  Loader2,
  Mail,
  MailPlus,
  Briefcase,
  Send,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { SendOutreachModal } from "@/components/app/SendOutreachModal";
import { AddEmailDialog } from "@/components/app/AddEmailDialog";
import {
  BulkAddEmailsDialog,
  type BulkEmailCandidate,
} from "@/components/app/BulkAddEmailsDialog";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  useAddMatchToPool,
  useSetMatchStatuses,
  useShortlist,
} from "@/hooks/useMatching";
import { useSendOutreach } from "@/hooks/useOutreach";
import {
  usePersistentState,
  useScrollRestoration,
} from "@/hooks/usePersistentState";
import { MATCH_STATUS_META, RECOMMENDATION_META } from "@/constants/status";
import { cn } from "@/lib/utils";
import type { ShortlistItem } from "@/types";

const TABS = [
  { label: "Saved", value: "SAVED" },
  { label: "Contacted", value: "CONTACTED" },
];

/** Default nudges for a bulk send — same ceiling the backend enforces. */
const BULK_FOLLOW_UPS = 2;

/** A shortlist row can only be emailed once it has both a record and an address. */
function isContactable(item: ShortlistItem): boolean {
  return Boolean(item.candidate_id && item.email);
}

export default function ShortlistPage() {
  const [status, setStatus] = usePersistentState("shortlist:status", "SAVED");
  const { data: items, isLoading } = useShortlist(status);
  useScrollRestoration("shortlist", !isLoading);

  const [outreachTarget, setOutreachTarget] = useState<{
    candidateId: string;
    jobId: string;
    name: string;
  } | null>(null);
  const [emailTarget, setEmailTarget] = useState<{
    candidateId: string;
    name: string;
  } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const send = useSendOutreach();
  const setStatuses = useSetMatchStatuses();

  /**
   * Take matches off the shortlist by returning them to `NEW`. Nothing is
   * deleted — they go back to the job's active match list — so this offers an
   * undo toast rather than a confirmation dialog.
   */
  const unshortlist = (matchIds: string[], label: string) => {
    const previous = status; // SAVED or CONTACTED, i.e. what undo restores
    setStatuses.mutate(
      { matchIds, status: "NEW" },
      {
        onSuccess: () => {
          setSelected((prev) => {
            const next = new Set(prev);
            matchIds.forEach((id) => next.delete(id));
            return next;
          });
          toast.success(`${label} removed from shortlist`, {
            action: {
              label: "Undo",
              onClick: () =>
                setStatuses.mutate(
                  { matchIds, status: previous },
                  {
                    onSuccess: () => toast.success(`${label} restored`),
                    onError: (e) =>
                      toast.error((e as Error).message || "Could not undo"),
                  }
                ),
            },
          });
        },
        onError: (e) =>
          toast.error((e as Error).message || "Could not update shortlist"),
      }
    );
  };

  const contactable = useMemo(
    () => (items ?? []).filter(isContactable),
    [items]
  );

  /**
   * In the pool but with no address — the only group bulk entry can fix.
   * Purely discovered rows have no candidate record to attach an email to yet,
   * so they need "Add to pool" first and are deliberately excluded.
   */
  const needEmail = useMemo<BulkEmailCandidate[]>(
    () =>
      (items ?? [])
        .filter((i) => i.candidate_id && !i.email)
        .map((i) => ({
          id: i.candidate_id as string,
          name: i.name,
          profileUrl: i.profile_url,
          subtitle: i.job_title,
        })),
    [items]
  );
  // Anything can be selected — removal works for every row. Emailing is the
  // narrower action, so it filters the selection down rather than restricting
  // what may be ticked in the first place.
  const selectedEmailable = useMemo(
    () => contactable.filter((i) => selected.has(i.id)),
    [contactable, selected]
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /**
   * Bulk send. The API takes one job per call, so a selection spanning several
   * roles is split into one call per job — each candidate must receive the mail
   * for the role they were actually saved against.
   */
  const sendToSelected = async () => {
    const byJob = new Map<string, string[]>();
    for (const item of selectedEmailable) {
      const list = byJob.get(item.job_id) ?? [];
      list.push(item.candidate_id as string);
      byJob.set(item.job_id, list);
    }

    let sent = 0;
    const failures: string[] = [];
    for (const [jobId, candidateIds] of byJob) {
      try {
        const result = await send.mutateAsync({
          candidate_ids: candidateIds,
          job_id: jobId,
          follow_ups: BULK_FOLLOW_UPS,
        });
        sent += result.sent_count;
        failures.push(...result.failed.map((f) => f.reason));
      } catch (e) {
        failures.push((e as Error).message || "Send failed");
      }
    }

    if (sent > 0) {
      toast.success(
        `Sent to ${sent} candidate${sent === 1 ? "" : "s"} — follow-ups scheduled.`
      );
    }
    if (failures.length) {
      toast.error(`${failures.length} could not be sent: ${failures[0]}`);
    }
    setSelected(new Set());
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Talent"
        title="Shortlist"
        description="Every candidate you've saved or contacted — across all your jobs, in one place."
        actions={
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatus(t.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  status === t.value
                    ? "border-electric/50 bg-electric/10 text-electric-soft"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Bulk bar */}
      {items && items.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-secondary/20 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-[hsl(var(--electric))]"
              checked={selected.size > 0 && selected.size === items.length}
              // Indeterminate isn't a prop — it only exists on the DOM node.
              ref={(el) => {
                if (el)
                  el.indeterminate =
                    selected.size > 0 && selected.size < items.length;
              }}
              onChange={(e) =>
                setSelected(
                  e.target.checked ? new Set(items.map((i) => i.id)) : new Set()
                )
              }
            />
            <span className="text-muted-foreground">
              {selected.size > 0
                ? `${selected.size} selected`
                : `Select all ${items.length}`}
            </span>
          </label>

          {selected.size > 0 && (
            <>
              <Button
                variant="brand"
                size="sm"
                onClick={sendToSelected}
                disabled={send.isPending || selectedEmailable.length === 0}
                title={
                  selectedEmailable.length === 0
                    ? "None of the selected candidates have an email address"
                    : undefined
                }
              >
                {send.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Send invite to {selectedEmailable.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={setStatuses.isPending}
                onClick={() =>
                  unshortlist(
                    [...selected],
                    `${selected.size} candidate${selected.size === 1 ? "" : "s"}`
                  )
                }
              >
                {setStatuses.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <BookmarkX className="size-4" />
                )}
                Remove from shortlist
              </Button>
            </>
          )}

          {needEmail.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkEmailOpen(true)}
            >
              <MailPlus className="size-4" />
              Add {needEmail.length} missing email
              {needEmail.length === 1 ? "" : "s"}
            </Button>
          )}

          {items && contactable.length + needEmail.length < items.length && (
            <span className="text-xs text-muted-foreground">
              {items.length - contactable.length - needEmail.length} still need
              &ldquo;Add to pool&rdquo; first.
            </span>
          )}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : !items?.length ? (
          <EmptyState
            icon={Bookmark}
            title={status === "SAVED" ? "No saved candidates yet" : "No contacted candidates yet"}
            description="Open a job's AI Match, then Save or Contact candidates — they'll collect here across all your jobs."
          />
        ) : (
          items.map((it) => (
            <ShortlistCard
              key={it.id}
              item={it}
              selected={selected.has(it.id)}
              onToggle={() => toggle(it.id)}
              onEmail={() =>
                it.candidate_id &&
                setOutreachTarget({
                  candidateId: it.candidate_id,
                  jobId: it.job_id,
                  name: it.name,
                })
              }
              onAddEmail={() =>
                it.candidate_id &&
                setEmailTarget({ candidateId: it.candidate_id, name: it.name })
              }
              onUnshortlist={() => unshortlist([it.id], it.name)}
              unshortlistPending={setStatuses.isPending}
            />
          ))
        )}
      </div>

      <SendOutreachModal
        open={outreachTarget !== null}
        onClose={() => setOutreachTarget(null)}
        jobId={outreachTarget?.jobId ?? ""}
        candidateId={outreachTarget?.candidateId ?? ""}
        candidateName={outreachTarget?.name}
      />

      <AddEmailDialog
        open={emailTarget !== null}
        onClose={() => setEmailTarget(null)}
        candidateId={emailTarget?.candidateId ?? ""}
        candidateName={emailTarget?.name ?? ""}
      />

      <BulkAddEmailsDialog
        open={bulkEmailOpen}
        onClose={() => setBulkEmailOpen(false)}
        candidates={needEmail}
      />
    </div>
  );
}

function ShortlistCard({
  item,
  selected,
  onToggle,
  onEmail,
  onAddEmail,
  onUnshortlist,
  unshortlistPending,
}: {
  item: ShortlistItem;
  selected: boolean;
  onToggle: () => void;
  onEmail: () => void;
  onAddEmail: () => void;
  onUnshortlist: () => void;
  unshortlistPending: boolean;
}) {
  const rec = item.recommendation?.toLowerCase();
  // A discovered profile has no candidate record yet, so there is nothing to
  // send mail *from* — importing them into the pool creates one.
  const external = !item.candidate_id;
  const addToPool = useAddMatchToPool(item.job_id);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card/40 p-4 transition-colors",
        selected
          ? "border-electric/50 bg-electric/[0.04]"
          : "border-border/70 hover:border-electric/30"
      )}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          className="mt-4 size-4 shrink-0 accent-[hsl(var(--electric))]"
          checked={selected}
          onChange={onToggle}
          aria-label={`Select ${item.name}`}
        />
        <ScoreRing score={item.score} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UserAvatar seed={item.candidate_id ?? item.name} name={item.name} size={28} className="border border-border/60" />
            <span className="font-semibold">{item.name}</span>
            {rec && RECOMMENDATION_META[rec] && (
              <StatusBadge value={rec} meta={RECOMMENDATION_META} />
            )}
            <StatusBadge value={item.status} meta={MATCH_STATUS_META} />
            {external ? (
              <Badge tone="plasma">Discovered · {item.source}</Badge>
            ) : (
              <Badge tone="neutral">{item.source}</Badge>
            )}
          </div>

          {/* Job context — the whole point of the cross-job shortlist */}
          <Link
            href={`/jobs/${item.job_id}/matches`}
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Briefcase className="size-3" /> Saved for{" "}
            <span className="font-medium text-foreground/80">{item.job_title}</span>
          </Link>

          {item.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{item.summary}</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            {item.email ? (
              <a
                href={`mailto:${item.email}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <Mail className="size-3" /> {item.email}
              </a>
            ) : (
              // Say why, not just that it's missing — "no email" reads like a
              // bug, whereas the real reason is that GitHub never published one.
              <span className="inline-flex items-center gap-1 text-xs text-amber-300/90">
                <Mail className="size-3" />
                {external
                  ? "No public email — add to pool first"
                  : "No public email on this profile"}
              </span>
            )}
            {item.profile_url && (
              <a
                href={item.profile_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <ExternalLink className="size-3" /> Profile
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1.5">
          {external ? (
            <Button
              size="sm"
              variant="brand"
              disabled={addToPool.isPending}
              title="Import this profile so you can email them"
              onClick={() =>
                addToPool.mutate(item.id, {
                  onSuccess: () =>
                    toast.success(
                      `${item.name} added to your pool — you can email them now.`
                    ),
                  onError: (e) =>
                    toast.error((e as Error).message || "Could not add to pool"),
                })
              }
            >
              {addToPool.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              Add to pool
            </Button>
          ) : item.email ? (
            <Button
              size="sm"
              variant="brand"
              onClick={onEmail}
              title="Preview and send an email"
            >
              <Send className="size-4" /> Email
            </Button>
          ) : (
            // In the pool but unreachable — the one action that unblocks them.
            <Button
              size="sm"
              variant="brand"
              onClick={onAddEmail}
              title="Add an email address so you can contact them"
            >
              <MailPlus className="size-4" /> Add email
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href={`/jobs/${item.job_id}/matches`}>Open role</Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            disabled={unshortlistPending}
            onClick={onUnshortlist}
            title="Send back to the job's active matches"
          >
            <BookmarkX className="size-4" /> Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
