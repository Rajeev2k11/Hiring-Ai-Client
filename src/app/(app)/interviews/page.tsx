"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CalendarPlus, Video, AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviews } from "@/hooks/useInterviews";
import { INTERVIEW_STATUS_META, PLATFORM_LABELS } from "@/constants/status";
import { InterviewStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatDayLabel, formatTime } from "@/lib/format";

const TABS = [
  { key: null, label: "All" },
  { key: InterviewStatus.SCHEDULED, label: "Scheduled" },
  { key: InterviewStatus.COMPLETED, label: "Completed" },
  { key: InterviewStatus.CANCELLED, label: "Cancelled" },
];

export default function InterviewsPage() {
  const [tab, setTab] = useState<string | null>(null);
  const { data: interviews, isLoading, isError, error, refetch, isFetching } =
    useInterviews(tab);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <PageHeader
        title="Interviews"
        description="Your coordinated interview calendar across every role."
        actions={
          <Button asChild variant="brand">
            <Link href="/interviews/schedule">
              <CalendarPlus className="size-4" /> Schedule
            </Link>
          </Button>
        }
      />

      <div className="mt-8 flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-secondary/30 p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
        ) : isError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load interviews"
            description={
              (error as { message?: string })?.message ??
              "Something went wrong while fetching interviews."
            }
            action={
              <Button variant="brand" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? "Retrying…" : "Try again"}
              </Button>
            }
          />
        ) : !interviews || interviews.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No interviews"
            description="Schedule an interview from a candidate's profile or here."
            action={
              <Button asChild variant="brand">
                <Link href="/interviews/schedule">Schedule interview</Link>
              </Button>
            }
          />
        ) : (
          interviews.map((iv) => (
            <Link
              key={iv.id}
              href={`/interviews/${iv.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/40 p-4 transition-all hover:border-electric/40 hover:bg-card/60"
            >
              <div className="grid w-16 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/40 py-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {formatDayLabel(iv.scheduled_at)}
                </span>
                <span className="text-sm font-semibold">{formatTime(iv.scheduled_at)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {iv.candidate_name} — {iv.stage}
                </p>
                <p className="truncate text-xs text-muted-foreground">{iv.job_title}</p>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Video className="size-3.5" /> {PLATFORM_LABELS[iv.platform] ?? iv.platform}
              </div>
              <StatusBadge value={iv.status} meta={INTERVIEW_STATUS_META} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
