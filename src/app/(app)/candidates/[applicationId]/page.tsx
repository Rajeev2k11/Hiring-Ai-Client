"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarPlus,
  Check,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { ScoreRing } from "@/components/shared/ScoreRing";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCandidate, useUpdateApplicationStatus } from "@/hooks/useCandidates";
import { useEvaluateApplication } from "@/hooks/useApplications";
import { useInterviews } from "@/hooks/useInterviews";
import {
  APPLICATION_STATUS_META,
  RECOMMENDATION_META,
  INTERVIEW_STATUS_META,
} from "@/constants/status";
import { ApplicationStatus } from "@/types";
import { formatDate, formatDateTime } from "@/lib/format";

export default function CandidateProfilePage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { data: c, isLoading } = useCandidate(applicationId);
  const { data: interviews } = useInterviews();
  const updateStatus = useUpdateApplicationStatus();
  const evaluate = useEvaluateApplication();

  const runEvaluation = () =>
    evaluate.mutate(applicationId, {
      onSuccess: () => toast.success("AI evaluation complete"),
      onError: (e) => toast.error((e as Error).message || "Evaluation failed"),
    });

  if (isLoading || !c) {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const ev = c.ai_evaluation;
  const myInterviews = (interviews ?? []).filter((i) => i.application_id === applicationId);

  const changeStatus = (status: string) =>
    updateStatus.mutate(
      { id: applicationId, status },
      { onSuccess: () => toast.success("Status updated") }
    );

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <Link href="/candidates" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to candidates
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-border/70 bg-card/40 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserAvatar seed={c.candidate_id} name={c.name} size={64} className="rounded-2xl border border-border/60" />
            <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-electric text-white">
              <BadgeCheck className="size-4" />
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{c.name}</h1>
            <p className="text-sm text-muted-foreground">
              {c.job_title} · {c.location ?? "—"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={c.status}
                onChange={(e) => changeStatus(e.target.value)}
                className="rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs font-medium outline-none"
              >
                {Object.entries(APPLICATION_STATUS_META).map(([k, v]) => (
                  <option key={k} value={k} className="bg-popover">{v.label}</option>
                ))}
              </select>
              <Button
                asChild
                variant="outline"
                size="icon-sm"
                title="Send email"
              >
                <a href={`mailto:${c.email}`}>
                  <Mail className="size-4" />
                </a>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link href={`/interviews/schedule?application=${applicationId}`}>
                  <CalendarPlus className="size-4" /> Schedule Interview
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-electric/20 bg-electric/5 px-5 py-4">
          <ScoreRing score={c.match_score ?? 0} size={64} strokeWidth={5} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-electric-soft">AI Match Score</p>
            <p className="mt-0.5 text-sm font-medium">
              {(c.match_score ?? 0) >= 80 ? "High confidence match" : (c.match_score ?? 0) >= 60 ? "Solid match" : "Needs review"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="evaluation">AI Evaluation</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-plasma/20 bg-gradient-to-br from-plasma/10 to-card/40 p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-plasma-soft">
                <Sparkles className="size-4" /> AI Executive Summary
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
                {ev?.summary ?? "Run the AI evaluation to generate an executive summary for this candidate."}
              </p>
              {ev && (
                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                  <SummaryList title="Key Strengths" items={ev.strengths} icon={Check} tone="text-emerald-400" />
                  <SummaryList title="Growth Areas" items={ev.weaknesses} icon={TrendingUp} tone="text-electric-soft" />
                  <SummaryList title="Potential Risks" items={ev.risks} icon={AlertTriangle} tone="text-amber-400" />
                </div>
              )}
            </div>

            {ev && ev.strengths.length > 0 && (
              <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
                <h3 className="font-display text-base font-semibold">Top Skills</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ev.strengths.slice(0, 5).map((s, i) => (
                    <Badge key={i} tone={i % 2 ? "electric" : "neutral"}>{s.split(" ").slice(0, 3).join(" ")}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <Meta label="Applied" value={formatDate(c.applied_at)} />
                <Meta label="Status" value={<StatusBadge value={c.status} meta={APPLICATION_STATUS_META} />} />
                <Meta label="Role" value={c.job_title} />
                <Meta label="Email" value={c.email} />
                {c.phone && <Meta label="Phone" value={c.phone} />}
                {c.location && <Meta label="Location" value={c.location} />}
              </dl>
            </div>
          </div>
        </TabsContent>

        {/* RESUME */}
        <TabsContent value="resume" className="mt-6">
          {c.resume ? (
            <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-electric-soft" />
                  <span className="text-sm font-medium">{c.name}'s résumé</span>
                </div>
                <Button variant="outline" size="sm">Download PDF</Button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/85">
                {c.resume.raw_text ?? "Resume text could not be extracted."}
              </pre>
            </div>
          ) : (
            <EmptyState icon={FileText} title="No résumé on file" description="This candidate hasn't uploaded a résumé yet." />
          )}
        </TabsContent>

        {/* AI EVALUATION */}
        <TabsContent value="evaluation" className="mt-6">
          {ev ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-card/40 p-6 text-center">
                <div className="relative grid place-items-center">
                  <ScoreRing score={ev.score} size={120} strokeWidth={8} showLabel={false} />
                  <span className="absolute font-display text-4xl font-bold">{Math.round(ev.score)}</span>
                </div>
                <div className="mt-5">
                  <StatusBadge value={ev.recommendation} meta={RECOMMENDATION_META} />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{ev.summary}</p>
              </div>
              <div className="space-y-5">
                <EvalList title="Strengths" items={ev.strengths} tone="success" />
                <EvalList title="Weaknesses" items={ev.weaknesses} tone="warning" />
                <EvalList title="Risks" items={ev.risks} tone="danger" />
                <EvalList title="Suggested interview questions" items={ev.questions_to_ask} tone="electric" />
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Not evaluated yet"
              description="Run the AI scorer to evaluate this candidate's résumé against the role."
              action={
                <Button variant="brand" onClick={runEvaluation} disabled={evaluate.isPending}>
                  {evaluate.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Run AI evaluation
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* INTERVIEW */}
        <TabsContent value="interview" className="mt-6">
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button asChild variant="brand" size="sm">
                <Link href={`/interviews/schedule?application=${applicationId}`}>
                  <CalendarPlus className="size-4" /> Schedule interview
                </Link>
              </Button>
            </div>
            {myInterviews.length === 0 ? (
              <EmptyState icon={CalendarPlus} title="No interviews yet" description="Schedule the first interview for this candidate." />
            ) : (
              myInterviews.map((iv) => (
                <Link
                  key={iv.id}
                  href={`/interviews/${iv.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/40 p-4 hover:border-electric/40"
                >
                  <div>
                    <p className="text-sm font-semibold">{iv.stage}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(iv.scheduled_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={iv.status} meta={INTERVIEW_STATUS_META} />
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SummaryList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof Check;
  tone: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.slice(0, 3).map((it, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm text-foreground/85">
            <Icon className={`mt-0.5 size-3.5 shrink-0 ${tone}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EvalList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "danger" | "electric";
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
      <h4 className="font-display text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
            <Badge tone={tone} className="mt-0.5 px-1.5">{i + 1}</Badge>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
