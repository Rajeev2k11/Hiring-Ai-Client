"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  LayoutGrid,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Panel } from "@/components/app/Panel";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useCandidates } from "@/hooks/useCandidates";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { isCompanyUser } from "@/types";
import { APPLICATION_STATUS_META } from "@/constants/status";
import { formatRelative } from "@/lib/format";

const ROLE_STATUSES = [
  { key: "open", label: "Open" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
] as const;

export default function DashboardPage() {
  const mounted = useMounted();
  const { identity } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: candidates, isLoading: candidatesLoading } = useCandidates();

  const firstName = mounted && identity ? identity.name.split(" ")[0] : "there";
  const companyName = mounted && identity && isCompanyUser(identity) ? identity.company_name : "";

  const recent = [...(candidates ?? [])]
    .sort((a, b) => +new Date(b.applied_at) - +new Date(a.applied_at))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      {/* Company identity bar */}
      {companyName && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/40 px-5 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-lg font-bold text-white">
            {companyName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-base font-semibold">{companyName}</p>
            <p className="text-xs text-muted-foreground">Hiring Dashboard</p>
          </div>
        </div>
      )}

      <PageHeader
        eyebrow="Executive Dashboard"
        title={`Welcome back, ${firstName}`}
        description="Here's how hiring is tracking across your organization."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Roles" value={stats?.total_openings} icon={Briefcase} accent="electric" loading={isLoading} />
        <StatCard label="Total Applicants" value={stats?.total_applicants} icon={Users} accent="plasma" loading={isLoading} />
        <StatCard label="Draft Roles" value={stats?.draft_roles} icon={FileText} accent="aurora" loading={isLoading} />
        <StatCard label="Total Roles" value={stats?.total_roles} icon={LayoutGrid} accent="electric" loading={isLoading} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent applicants — real data */}
        <Panel
          title="Recent Applicants"
          action={
            <Link href="/candidates" className="text-sm text-electric-soft hover:underline">
              View all
            </Link>
          }
          bodyClassName="p-0"
        >
          {candidatesLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Publish a role and applicants will show up here as they apply."
            />
          ) : (
            <div className="divide-y divide-border/50">
              {recent.map((c) => (
                <Link
                  key={c.application_id}
                  href={`/candidates/${c.application_id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/30"
                >
                  <UserAvatar seed={c.candidate_id} name={c.candidate_name} size={40} className="border border-border/60" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.candidate_name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.job_title} · applied {formatRelative(c.applied_at)}
                    </p>
                  </div>
                  <StatusBadge value={c.status} meta={APPLICATION_STATUS_META} />
                  {c.match_score !== null && <ScoreRing score={c.match_score} size={38} />}
                </Link>
              ))}
            </div>
          )}
        </Panel>

        {/* Roles by status — real data */}
        <Panel title="Roles by Status">
          {isLoading || !stats ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {ROLE_STATUSES.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 px-4 py-3"
                >
                  <span className="text-sm font-medium">{s.label}</span>
                  <Badge tone="neutral">{stats.status_counts[s.key]}</Badge>
                </div>
              ))}
            </div>
          )}
          <Button asChild variant="outline" className="mt-4 w-full" size="sm">
            <Link href="/jobs">
              Manage roles <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Panel>
      </div>
    </div>
  );
}
