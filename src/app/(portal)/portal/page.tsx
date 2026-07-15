"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Sparkles, Target } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Panel } from "@/components/app/Panel";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyApplications, usePortalJobs } from "@/hooks/usePortal";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { APPLICATION_STATUS_META } from "@/constants/status";
import { ApplicationStatus } from "@/types";
import { formatRelative } from "@/lib/format";

export default function PortalHome() {
  const mounted = useMounted();
  const { identity } = useAuth();
  const { data: apps, isLoading } = useMyApplications();
  const { data: jobs, isLoading: jobsLoading } = usePortalJobs();

  const first = mounted && identity ? identity.name.split(" ")[0] : "there";
  const active = (apps ?? []).filter(
    (a) => a.status !== ApplicationStatus.REJECTED && a.status !== ApplicationStatus.HIRED
  ).length;
  const interviews = (apps ?? []).filter((a) => a.status === ApplicationStatus.INTERVIEW).length;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader eyebrow="Candidate Portal" title={`Hi ${first} 👋`} description="Track your applications and discover new roles." />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active applications" value={active} icon={FileText} accent="electric" />
        <StatCard label="Interviews" value={interviews} icon={Target} accent="plasma" />
        <StatCard label="Open roles for you" value={jobs?.length ?? 0} icon={Briefcase} accent="aurora" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Your applications"
          action={<Link href="/portal/applications" className="text-sm text-electric-soft hover:underline">View all</Link>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>)
            ) : (
              (apps ?? []).slice(0, 4).map((a) => (
                <Link key={a.id} href={`/portal/applications`} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/30">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.job_title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.location ?? "Remote"} · applied {formatRelative(a.applied_at)}</p>
                  </div>
                  <StatusBadge value={a.status} meta={APPLICATION_STATUS_META} />
                </Link>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Recommended for you"
          action={<Link href="/portal/jobs" className="text-sm text-electric-soft hover:underline">Browse</Link>}
        >
          <div className="space-y-3">
            {jobsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : (jobs ?? []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No roles available yet.</p>
            ) : (
              (jobs ?? []).slice(0, 3).map((j) => (
                <Link
                  key={j.id}
                  href={`/portal/jobs/${j.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3.5 hover:border-electric/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border/60 bg-secondary/40 text-electric-soft">
                    <Briefcase className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{j.department ?? "—"} · {j.location ?? "Remote"}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
          <div className="mt-4 rounded-xl border border-electric/20 bg-electric/5 p-3.5 text-xs text-foreground/80">
            <Sparkles className="mb-1 size-4 text-electric-soft" />
            Complete your profile to unlock better AI-matched roles.
          </div>
        </Panel>
      </div>
    </div>
  );
}
