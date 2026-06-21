"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, LayoutGrid, Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useDashboardJobs } from "@/hooks/useDashboard";
import { JOB_STATUS_META } from "@/constants/status";
import { JobStatus } from "@/types";
import { cn, hashUnit } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import { UserAvatar } from "@/components/shared/UserAvatar";

const TABS = [
  { key: null, label: "All" },
  { key: JobStatus.OPEN, label: "Open" },
  { key: JobStatus.DRAFT, label: "Draft" },
  { key: JobStatus.CLOSED, label: "Closed" },
];

function AvatarStack({ seed, count }: { seed: string; count: number }) {
  const shown = Math.min(count, 3);
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {Array.from({ length: shown }).map((_, i) => (
          <UserAvatar key={i} seed={`${seed}-${i}`} size={28} className="border-2 border-card" />
        ))}
      </div>
      {count > shown && (
        <span className="ml-1 text-xs text-muted-foreground">+{count - shown}</span>
      )}
    </div>
  );
}

export default function JobsPage() {
  const [tab, setTab] = useState<string | null>(null);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: jobs, isLoading } = useDashboardJobs(tab);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <PageHeader
        title="Open Roles"
        description="Manage and track your active job listings across the organization."
        actions={
          <Button asChild variant="brand">
            <Link href="/jobs/new">
              <Plus className="size-4" /> Create Job
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Openings" value={stats?.total_openings} icon={Briefcase} accent="electric" loading={statsLoading} />
        <StatCard label="Total Applicants" value={stats?.total_applicants} icon={Users} accent="plasma" loading={statsLoading} />
        <StatCard label="Draft Roles" value={stats?.draft_roles} icon={FileText} accent="aurora" loading={statsLoading} />
        <StatCard label="Total Roles" value={stats?.total_roles} icon={LayoutGrid} accent="electric" loading={statsLoading} />
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex items-center gap-1 rounded-xl border border-border/70 bg-secondary/30 p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Jobs table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card/40">
        <div className="hidden grid-cols-[2.2fr_1fr_1.2fr_0.9fr_1fr_1fr] gap-4 border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid">
          <span>Job Title</span>
          <span>Department</span>
          <span>Location</span>
          <span>Status</span>
          <span>Applicants</span>
          <span>Last Activity</span>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No roles here yet"
            description="Create your first job and let the agents start sourcing."
            action={
              <Button asChild variant="brand">
                <Link href="/jobs/new">
                  Create Job <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border/50">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-secondary/30 lg:grid-cols-[2.2fr_1fr_1.2fr_0.9fr_1fr_1fr] lg:items-center lg:gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{job.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    REQ-{job.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{job.department ?? "—"}</span>
                <span className="text-sm text-muted-foreground">{job.location ?? "—"}</span>
                <span><StatusBadge value={job.status} meta={JOB_STATUS_META} withDot /></span>
                <AvatarStack seed={`${job.id}-${Math.round(hashUnit(job.id) * 100)}`} count={job.applicant_count} />
                <span className="text-sm text-muted-foreground">
                  {formatRelative(job.last_activity_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {jobs && jobs.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {jobs.length} {jobs.length === 1 ? "role" : "roles"}
        </p>
      )}
    </div>
  );
}
