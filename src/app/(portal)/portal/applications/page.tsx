"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyApplications } from "@/hooks/usePortal";
import { APPLICATION_STATUS_META } from "@/constants/status";
import { formatDate } from "@/lib/format";

export default function PortalApplicationsPage() {
  const { data: apps, isLoading } = useMyApplications();

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 lg:px-8">
      <PageHeader title="My Applications" description="Every role you've applied to and where it stands." />

      <div className="mt-8 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
        ) : !apps || apps.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Browse open roles and apply — they'll show up here."
            action={<Button asChild variant="brand"><Link href="/portal/jobs">Browse jobs</Link></Button>}
          />
        ) : (
          apps.map((a) => (
            <div key={a.id} className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/40 p-5 sm:flex-row sm:items-center">
              {a.match_score !== null && <ScoreRing score={a.match_score} size={52} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold">{a.job_title}</h3>
                  <StatusBadge value={a.status} meta={APPLICATION_STATUS_META} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.location ?? "Remote"} · applied {formatDate(a.applied_at)}
                </p>
                {a.next_step && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-electric/10 px-2.5 py-1 text-xs font-medium text-electric-soft">
                    <ArrowRight className="size-3.5" /> {a.next_step}
                  </p>
                )}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/portal/jobs/${a.job_id}`}>View role</Link>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
