"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin, Pencil, Radar, Share2 } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useJob, useUpdateJob } from "@/hooks/useJobs";
import { useCandidates, useUpdateApplicationStatus } from "@/hooks/useCandidates";
import { APPLICATION_PIPELINE, JobStatus } from "@/types";
import { APPLICATION_STATUS_META, JOB_STATUS_META, scoreTone } from "@/constants/status";
import { cn, formatScore } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { RecruiterCandidateListItem } from "@/types";

const STATUS_OPTIONS = [JobStatus.OPEN, JobStatus.DRAFT, JobStatus.CLOSED];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading: jobLoading } = useJob(id);
  const { data: candidates, isLoading } = useCandidates({ job_id: id });
  const updateStatus = useUpdateApplicationStatus();
  const updateJob = useUpdateJob();

  const [dragId, setDragId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<string | null>(null);

  // Inline job editing (PATCH /jobs/{id}).
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    status: JobStatus.DRAFT as string,
  });

  const byStatus = (status: string) =>
    (candidates ?? []).filter((c) => c.status === status);

  /** Move a specific application to a stage (drag-and-drop). */
  const moveTo = (applicationId: string, status: string) => {
    const card = (candidates ?? []).find((c) => c.application_id === applicationId);
    if (!card || card.status === status) return;
    updateStatus.mutate(
      { id: applicationId, status },
      { onSuccess: () => toast.success(`Moved to ${APPLICATION_STATUS_META[status]?.label ?? status}`) }
    );
  };

  const startEdit = () => {
    if (!job) return;
    setForm({
      title: job.title,
      department: job.department ?? "",
      location: job.location ?? "",
      description: job.description,
      status: job.status,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!job) return;
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    try {
      await updateJob.mutateAsync({
        id: job.id,
        payload: {
          title: form.title,
          department: form.department || null,
          location: form.location || null,
          description: form.description,
          status: form.status,
        },
      });
      toast.success("Job updated");
      setEditing(false);
    } catch (e) {
      toast.error((e as Error).message || "Could not update job");
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to roles
      </Link>

      {/* Header */}
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
          {job && !editing && (
            <Button variant="outline" size="sm" onClick={startEdit}>
              <Pencil className="size-4" /> Edit
            </Button>
          )}
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

      {/* Job details (read or edit) */}
      <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-6">
        {jobLoading || !job ? (
          <Skeleton className="h-40 w-full" />
        ) : editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dept">Department</Label>
                <Input id="dept" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc">Location</Label>
                <Input id="loc" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3.5 text-sm outline-none focus-visible:border-electric/60 focus-visible:ring-2 focus-visible:ring-electric/25"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-popover">{JOB_STATUS_META[s]?.label ?? s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={10} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button variant="brand" onClick={saveEdit} disabled={updateJob.isPending}>
                {updateJob.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save changes
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} disabled={updateJob.isPending}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="neutral">{job.department ?? "No department"}</Badge>
              <Badge tone="neutral"><MapPin className="mr-1 size-3" /> {job.location ?? "Remote"}</Badge>
              <StatusBadge value={job.status} meta={JOB_STATUS_META} withDot />
            </div>
            <h2 className="mt-5 font-display text-base font-semibold">About the role</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
              {job.description}
            </p>
          </div>
        )}
      </div>

      {/* Pipeline */}
      <h2 className="mt-8 font-display text-lg font-semibold">Pipeline</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag a candidate between stages, or click a card to open their full profile.
      </p>

      <div className="mt-4 overflow-x-auto pb-2">
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
                        dragging={dragId === c.application_id}
                        onClick={() => router.push(`/candidates/${c.application_id}`)}
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
    </div>
  );
}

function CandidateMiniCard({
  c,
  dragging,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  c: RecruiterCandidateListItem;
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
        "w-full cursor-grab rounded-xl border border-border/60 bg-card/60 p-3.5 text-left transition-all hover:border-electric/40 active:cursor-grabbing",
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
