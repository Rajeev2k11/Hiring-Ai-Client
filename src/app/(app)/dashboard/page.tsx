"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Briefcase,
  CalendarDays,
  Clock,
  Download,
  FileCheck2,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Panel } from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useInterviews } from "@/hooks/useInterviews";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { InterviewStatus } from "@/types";
import { formatTime, formatDayLabel } from "@/lib/format";

const ACTIVITY = [
  { icon: UserPlus, title: "Alex Rivera applied for Principal Engineer", meta: "AI Score 98 · matches 12/12 skills", time: "2m ago", tone: "electric" as const },
  { icon: CalendarDays, title: "Jordan Smith — interview scheduled", meta: "Tomorrow, 10:00 AM · Technical Screen", time: "1h ago", tone: "plasma" as const },
  { icon: FileCheck2, title: "AI Evaluation complete for Product Lead", meta: "15 candidates processed · top 3 flagged", time: "3h ago", tone: "aurora" as const },
  { icon: Briefcase, title: "Senior Backend Engineer published", meta: "Now collecting applications", time: "5h ago", tone: "electric" as const },
];

const PULSE = [40, 62, 48, 92, 70, 55];

export default function DashboardPage() {
  const mounted = useMounted();
  const { identity } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: interviews } = useInterviews();

  const firstName = mounted && identity ? identity.name.split(" ")[0] : "there";
  const schedule = (interviews ?? [])
    .filter((i) => i.status === InterviewStatus.SCHEDULED)
    .sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Executive Dashboard"
        title={`Welcome back, ${firstName}`}
        description="Here's how hiring is tracking across your organization."
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays className="size-4" /> Last 30 Days
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Jobs" value={stats?.total_openings} icon={Briefcase} accent="electric" delta="+12%" loading={isLoading} />
        <StatCard label="In Pipeline" value={stats?.total_applicants} icon={Users} accent="plasma" delta="+8%" loading={isLoading} />
        <StatCard label="Interviews Today" value={schedule.length} icon={CalendarDays} accent="aurora" delta="0%" />
        <StatCard label="Time to Hire" value="18.5d" icon={Clock} accent="electric" delta="-4%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* AI Intelligence Radar */}
          <div className="relative overflow-hidden rounded-2xl border border-electric/25 bg-gradient-to-br from-electric/10 via-card/40 to-plasma/10 p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-electric-soft" />
              <h2 className="font-display text-lg font-semibold">AI Intelligence Radar</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-electric" />
                  <p className="text-sm font-semibold">Review Priority</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  3 strong candidates for the Senior UI Designer role match 95% of
                  your requirements.
                </p>
                <Link href="/candidates" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-electric-soft hover:underline">
                  View candidates <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-plasma" />
                  <p className="text-sm font-semibold">Offer Probability</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  2 candidates in the final stage have a 90% likelihood to accept
                  based on signal analysis.
                </p>
                <Link href="/candidates?status=OFFER" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-plasma-soft hover:underline">
                  Draft offers <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <Panel
            title="Activity Feed"
            action={
              <Link href="/candidates" className="text-sm text-electric-soft hover:underline">
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/50">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/40 text-electric-soft">
                    <a.icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Today's schedule */}
          <Panel
            title="Today's Schedule"
            action={<Badge tone="neutral">{schedule.length} events</Badge>}
          >
            <div className="space-y-3">
              {!interviews ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : schedule.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No interviews scheduled.
                </p>
              ) : (
                schedule.map((iv) => (
                  <Link
                    key={iv.id}
                    href={`/interviews/${iv.id}`}
                    className="block rounded-xl border-l-2 border-electric bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <p className="text-xs font-semibold text-electric-soft">
                      {formatDayLabel(iv.scheduled_at)} · {formatTime(iv.scheduled_at)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{iv.candidate_name}</p>
                    <p className="text-xs text-muted-foreground">{iv.job_title} · {iv.stage}</p>
                  </Link>
                ))
              )}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full" size="sm">
              <Link href="/interviews">Full calendar view</Link>
            </Button>
          </Panel>

          {/* Talent pulse */}
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#0a0c18] p-6">
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-aurora" />
              <h2 className="font-display text-base font-semibold">Talent Pulse</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Market competition for Cloud Architects is up 15% this week. Consider
              adjusting range.
            </p>
            <div className="mt-5 flex h-20 items-end gap-2">
              {PULSE.map((h, i) => (
                <div
                  key={i}
                  className={i === 3 ? "flex-1 rounded-md bg-aurora" : "flex-1 rounded-md bg-plasma/40"}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <Link href="/analytics" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-aurora hover:underline">
              View insights report <TrendingUp className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
