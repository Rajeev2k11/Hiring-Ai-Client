"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidates } from "@/hooks/useCandidates";
import { APPLICATION_STATUS_META } from "@/constants/status";
import { ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import { UserAvatar } from "@/components/shared/UserAvatar";

const TABS = [
  { key: null, label: "All" },
  { key: ApplicationStatus.APPLIED, label: "Applied" },
  { key: ApplicationStatus.SCREENING, label: "Screening" },
  { key: ApplicationStatus.SHORTLISTED, label: "Shortlisted" },
  { key: ApplicationStatus.INTERVIEW, label: "Interview" },
  { key: ApplicationStatus.OFFER, label: "Offer" },
  { key: ApplicationStatus.HIRED, label: "Hired" },
];

export default function CandidatesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <CandidatesInner />
    </Suspense>
  );
}

function CandidatesInner() {
  const params = useSearchParams();
  const initial = params.get("status");
  const [tab, setTab] = useState<string | null>(initial);
  const { data: candidates, isLoading } = useCandidates({ status: tab });

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <PageHeader
        title="Candidates"
        description="Every applicant across your roles, ranked by AI match score."
      />

      <div className="mt-8 flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-secondary/30 p-1">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
          ))
        ) : !candidates || candidates.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No candidates here"
            description="When applicants come in — or the sourcing agent finds them — they'll appear here."
          />
        ) : (
          candidates.map((c) => (
            <Link
              key={c.application_id}
              href={`/candidates/${c.application_id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/40 p-4 transition-all hover:border-electric/40 hover:bg-card/60"
            >
              <UserAvatar seed={c.candidate_id} name={c.candidate_name} size={44} className="border border-border/60" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.candidate_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.job_title} · applied {formatRelative(c.applied_at)}
                </p>
              </div>
              <div className="hidden sm:block">
                <StatusBadge value={c.status} meta={APPLICATION_STATUS_META} />
              </div>
              {c.match_score !== null ? (
                <ScoreRing score={c.match_score} size={44} />
              ) : (
                <span className="text-xs text-muted-foreground">Not scored</span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
