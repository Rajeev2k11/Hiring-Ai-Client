"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Clock,
  MapPin,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/app/StatusBadge";
import { Panel } from "@/components/app/Panel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInterview,
  useUpdateInterview,
  useDeleteInterview,
} from "@/hooks/useInterviews";
import { INTERVIEW_STATUS_META, PLATFORM_LABELS } from "@/constants/status";
import { InterviewStatus } from "@/types";
import { initials } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: iv, isLoading } = useInterview(id);
  const update = useUpdateInterview();
  const remove = useDeleteInterview();

  if (isLoading || !iv) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const setStatus = (status: string) =>
    update.mutate({ id, payload: { status } }, { onSuccess: () => toast.success("Interview updated") });

  const onRemove = () =>
    remove.mutate(id, {
      onSuccess: () => {
        toast.success("Interview removed");
        router.push("/interviews");
      },
    });

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <Link href="/interviews" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to interviews
      </Link>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar seed={iv.candidate_id} name={iv.candidate_name} size={56} className="rounded-2xl border border-border/60" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{iv.candidate_name}</h1>
            <p className="text-sm text-muted-foreground">{iv.job_title} · {iv.stage}</p>
          </div>
        </div>
        <StatusBadge value={iv.status} meta={INTERVIEW_STATUS_META} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Panel title="Details">
          <dl className="space-y-4 text-sm">
            <Row icon={CalendarClock} label="When" value={formatDateTime(iv.scheduled_at)} />
            <Row icon={Clock} label="Duration" value={`${iv.duration_minutes ?? 60} min · ${iv.timezone ?? "UTC"}`} />
            <Row icon={Video} label="Platform" value={PLATFORM_LABELS[iv.platform] ?? iv.platform} />
            <Row icon={MapPin} label="Location" value={iv.location ?? "—"} />
          </dl>
          {iv.meeting_join_url && (
            <Button asChild variant="brand" className="mt-5 w-full" size="sm">
              <a href={iv.meeting_join_url} target="_blank" rel="noreferrer">
                <Video className="size-4" /> Join meeting
              </a>
            </Button>
          )}
        </Panel>

        <Panel title="Panel">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {iv.interviewers.length} interviewer{iv.interviewers.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {iv.interviewers.length === 0 ? (
              <li className="text-sm text-muted-foreground">No panel assigned.</li>
            ) : (
              iv.interviewers.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-plasma/15 text-plasma-soft">{initials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>

      {iv.notes && (
        <Panel title="Notes" className="mt-6">
          <p className="text-sm leading-relaxed text-foreground/85">{iv.notes}</p>
        </Panel>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline">
          <Link href={`/interviews/schedule?application=${iv.application_id}`}>
            <CalendarClock className="size-4" /> Reschedule
          </Link>
        </Button>
        {iv.status !== InterviewStatus.COMPLETED && (
          <Button variant="secondary" onClick={() => setStatus(InterviewStatus.COMPLETED)} disabled={update.isPending}>
            Mark completed
          </Button>
        )}
        {iv.status !== InterviewStatus.CANCELLED && (
          <Button variant="secondary" onClick={() => setStatus(InterviewStatus.CANCELLED)} disabled={update.isPending}>
            Cancel interview
          </Button>
        )}
        <Button variant="ghost" className="text-red-300 hover:bg-destructive/10" onClick={onRemove} disabled={remove.isPending}>
          <Trash2 className="size-4" /> Remove
        </Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
