"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Radar, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/app/StatusBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJob } from "@/hooks/useJobs";
import {
  useCandidates,
  useCandidate,
  useUpdateApplicationStatus,
} from "@/hooks/useCandidates";
import { APPLICATION_PIPELINE, ApplicationStatus } from "@/types";
import {
  APPLICATION_STATUS_META,
  JOB_STATUS_META,
  scoreTone,
} from "@/constants/status";
import { cn, formatScore } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { RecruiterCandidateListItem } from "@/types";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading: jobLoading } = useJob(id);
  const { data: candidates, isLoading } = useCandidates({ job_id: id });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail } = useCandidate(selectedId ?? "", Boolean(selectedId));
  const updateStatus = useUpdateApplicationStatus();

  const [dragId, setDragId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<string | null>(null);

  const byStatus = (status: string) =>
    (candidates ?? []).filter((c) => c.status === status);

  /** Move a specific application to a stage (used by both the buttons and DnD). */
  const moveTo = (applicationId: string, status: string) => {
    const card = (candidates ?? []).find((c) => c.application_id === applicationId);
    if (!card || card.status === status) return;
    updateStatus.mutate(
      { id: applicationId, status },
      { onSuccess: () => toast.success(`Moved to ${APPLICATION_STATUS_META[status]?.label ?? status}`) }
    );
  };

  const move = (status: string) => {
    if (selectedId) moveTo(selectedId, status);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to roles
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-electric-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Active search
          </div>
          {jobLoading ? (
            <Skeleton className="mt-2 h-9 w-72" />
          ) : (
            <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight">
              {job?.title}
            </h1>
          )}
          <p className="mt-1.5 text-sm text-muted-foreground">
            {(candidates?.length ?? 0)} candidates · {job?.location ?? "—"} · {job?.department ?? "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {job && <StatusBadge value={job.status} meta={JOB_STATUS_META} />}
          <Button variant="outline" size="sm">
            <Share2 className="size-4" /> Share
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/interviews">
              <Radar className="size-4" /> Source more
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Kanban */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4">
            {APPLICATION_PIPELINE.map((status) => {
              const items = byStatus(status);
              const meta = APPLICATION_STATUS_META[status];
              const isOver = overStatus === status;
              return (
                <div
                  key={status}
                  className="w-72 shrink-0"
                  onDragOver={(e) => {
                    if (!dragId) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setOverStatus(status);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOverStatus(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragId) moveTo(dragId, status);
                    setOverStatus(null);
                    setDragId(null);
                  }}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className="text-sm font-semibold">{meta?.label ?? status}</span>
                    <Badge tone="neutral">{items.length}</Badge>
                  </div>
                  <div
                    className={cn(
                      "min-h-[120px] space-y-2.5 rounded-xl border border-transparent p-1 transition-colors",
                      isOver && "border-dashed border-electric/50 bg-electric/5"
                    )}
                  >
                    {isLoading ? (
                      <Skeleton className="h-24 w-full" />
                    ) : items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                        {dragId ? "Drop here" : "Empty"}
                      </div>
                    ) : (
                      items.map((c) => (
                        <CandidateMiniCard
                          key={c.application_id}
                          c={c}
                          active={selectedId === c.application_id}
                          dragging={dragId === c.application_id}
                          onClick={() => setSelectedId(c.application_id)}
                          onDragStart={() => setDragId(c.application_id)}
                          onDragEnd={() => {
                            setDragId(null);
                            setOverStatus(null);
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <aside className="xl:sticky xl:top-24 xl:self-start">
          {!selectedId ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-8 text-center">
              <Sparkles className="mx-auto size-6 text-electric-soft" />
              <p className="mt-3 text-sm font-medium">Select a candidate</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click any card to see the AI summary and move them through the pipeline.
              </p>
            </div>
          ) : !detail ? (
            <Skeleton className="h-96 w-full rounded-2xl" />
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/50 p-5">
              <div className="flex items-center gap-3">
                <ScoreRing score={detail.match_score ?? 0} size={56} />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold">{detail.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{detail.email}</p>
                </div>
              </div>

              {detail.ai_evaluation && (
                <div className="mt-4 rounded-xl border border-electric/20 bg-electric/5 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-electric-soft">
                    <Sparkles className="size-3.5" /> AI Summary
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                    {detail.ai_evaluation.summary}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Move to stage
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {APPLICATION_PIPELINE.filter((s) => s !== detail.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => move(s)}
                      disabled={updateStatus.isPending}
                      className="rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-electric/40 hover:text-foreground disabled:opacity-60"
                    >
                      {APPLICATION_STATUS_META[s]?.label ?? s}
                    </button>
                  ))}
                  {detail.status !== ApplicationStatus.REJECTED && (
                    <button
                      onClick={() => move(ApplicationStatus.REJECTED)}
                      disabled={updateStatus.isPending}
                      className="col-span-2 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-destructive/20 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>

              <Button asChild variant="outline" className="mt-4 w-full" size="sm">
                <Link href={`/candidates/${detail.application_id}`}>
                  View full profile <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function CandidateMiniCard({
  c,
  active,
  dragging,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  c: RecruiterCandidateListItem;
  active: boolean;
  dragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <button
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", c.application_id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "w-full cursor-grab rounded-xl border bg-card/60 p-3.5 text-left transition-all hover:border-electric/40 active:cursor-grabbing",
        active ? "border-electric/60 shadow-glow" : "border-border/60",
        dragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserAvatar seed={c.candidate_id} name={c.candidate_name} size={36} className="border border-border/60" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{c.candidate_name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{c.job_title}</p>
          </div>
        </div>
        {c.match_score !== null && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-xs font-semibold",
              scoreTone(c.match_score) === "success" ? "text-emerald-300" : "text-electric-soft"
            )}
          >
            {formatScore(c.match_score)}%
          </span>
        )}
      </div>
    </button>
  );
}
