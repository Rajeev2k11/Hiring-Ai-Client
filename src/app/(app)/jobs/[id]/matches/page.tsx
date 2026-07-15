"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Loader2,
  Sparkles,
  Wand2,
  Users,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/app/StatusBadge";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useJob } from "@/hooks/useJobs";
import {
  useJobMatches,
  useMatchRun,
  useParseRequirements,
  useStartMatch,
  useUpdateMatchStatus,
} from "@/hooks/useMatching";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import {
  MATCH_STATUS_META,
  RECOMMENDATION_META,
  scoreTone,
  type Tone,
} from "@/constants/status";
import { SourcingRunStatus } from "@/types";
import type { JobCandidateMatch, ParsedRequirements, ScoreBreakdown } from "@/types";

const PROVIDERS = [
  { key: "internal", label: "Talent Pool" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

const SCORE_FILTERS = [
  { label: "All", value: 0 },
  { label: "60+", value: 60 },
  { label: "80+", value: 80 },
];

export default function JobMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: job } = useJob(id);
  const [providers, setProviders] = useState<string[]>(["internal"]);
  const [minScore, setMinScore] = useState(0);
  const [runId, setRunId] = useState<string | null>(null);

  const parse = useParseRequirements();
  const startMatch = useStartMatch();
  const { data: run } = useMatchRun(runId);
  const { data: matches, isLoading: matchesLoading } = useJobMatches(id, {
    min_score: minScore || undefined,
  });
  const updateStatus = useUpdateMatchStatus(id);

  const requirements = job?.parsed_requirements ?? null;
  const running =
    run?.status === SourcingRunStatus.RUNNING ||
    run?.status === SourcingRunStatus.PENDING;

  // When a run finishes, refresh the ranked list.
  useEffect(() => {
    if (run?.status === SourcingRunStatus.COMPLETED) {
      qc.invalidateQueries({ queryKey: ["matching", "candidates", id] });
    }
    if (run?.status === SourcingRunStatus.FAILED) {
      toast.error(run.error || "Match run failed.");
    }
  }, [run?.status, run?.error, id, qc]);

  const toggleProvider = (key: string) =>
    setProviders((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );

  const handleParse = async () => {
    try {
      await parse.mutateAsync(id);
      await qc.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
      toast.success("Requirements extracted from the description.");
    } catch (e) {
      toast.error((e as Error).message || "Could not parse requirements.");
    }
  };

  const handleFindMatches = async () => {
    if (providers.length === 0) {
      toast.error("Select at least one source.");
      return;
    }
    try {
      const started = await startMatch.mutateAsync({
        jobId: id,
        payload: { providers, limit: 50 },
      });
      setRunId(started.id);
      toast.success("AI match run started — ranking candidates…");
    } catch (e) {
      toast.error((e as Error).message || "Could not start match run.");
    }
  };

  const exportCsv = () => {
    if (!matches?.length) return;
    exportMatchesCsv(matches, job?.title ?? "job");
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to role
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow="AI Matching"
          title={job ? `Best matches for ${job.title}` : "Best matches"}
          description="Rank your talent pool against this role — scored, explained, and ready to action."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={!matches?.length}
            >
              <Download className="size-4" /> Export CSV
            </Button>
          }
        />
      </div>

      {/* Requirements */}
      <RequirementsCard
        requirements={requirements}
        onParse={handleParse}
        parsing={parse.isPending}
      />

      {/* Run controls */}
      <div className="mt-5 rounded-2xl border border-border/70 bg-card/40 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Sources</p>
            <p className="text-xs text-muted-foreground">
              Where to look for candidates.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROVIDERS.map((p) => {
                const active = providers.includes(p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => toggleProvider(p.key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-electric/50 bg-electric/10 text-electric-soft"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Button
            variant="brand"
            onClick={handleFindMatches}
            disabled={startMatch.isPending || running}
          >
            {startMatch.isPending || running ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {running ? "Ranking…" : "Find matches with AI"}
          </Button>
        </div>

        {run && (running || run.status === SourcingRunStatus.COMPLETED) && (
          <MatchProgress run={run} />
        )}
      </div>

      {/* Results */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          Ranked candidates
          {matches?.length ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {matches.length}
            </span>
          ) : null}
        </h2>
        <div className="flex gap-1.5">
          {SCORE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setMinScore(f.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                minScore === f.value
                  ? "border-electric/50 bg-electric/10 text-electric-soft"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {matchesLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : !matches?.length ? (
          <EmptyState
            icon={Users}
            title="No matches yet"
            description="Run AI matching to rank your talent pool against this role. Add candidates in the Talent Pool first."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/pool">Go to Talent Pool</Link>
              </Button>
            }
          />
        ) : (
          matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onStatus={(status) =>
                updateStatus.mutate(
                  { matchId: m.id, status },
                  {
                    onSuccess: () =>
                      toast.success(
                        `Marked ${m.name} as ${MATCH_STATUS_META[status]?.label ?? status}`
                      ),
                  }
                )
              }
              pending={updateStatus.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RequirementsCard({
  requirements,
  onParse,
  parsing,
}: {
  requirements: ParsedRequirements | null;
  onParse: () => void;
  parsing: boolean;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Extracted requirements</p>
          <p className="text-xs text-muted-foreground">
            The structured criteria the AI matches against.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onParse} disabled={parsing}>
          {parsing ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {requirements ? "Re-extract" : "Extract"}
        </Button>
      </div>

      {!requirements ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Not extracted yet — click Extract, or just run matching (it extracts automatically).
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Meta label="Role" value={requirements.role} />
          <Meta label="Seniority" value={requirements.seniority} />
          <Meta
            label="Min experience"
            value={requirements.experience_min ? `${requirements.experience_min}+ yrs` : "—"}
          />
          <Meta label="Location" value={requirements.location ?? "—"} />
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Required skills</p>
            <div className="flex flex-wrap gap-1.5">
              {requirements.required_skills.map((s) => (
                <Badge key={s} tone="electric">{s}</Badge>
              ))}
            </div>
          </div>
          {requirements.nice_to_have_skills.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Nice to have</p>
              <div className="flex flex-wrap gap-1.5">
                {requirements.nice_to_have_skills.map((s) => (
                  <Badge key={s} tone="neutral">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function MatchProgress({ run }: { run: { status: string; evaluated_count: number; total_candidates: number; selected_count: number } }) {
  const pct = run.total_candidates
    ? Math.round((run.evaluated_count / run.total_candidates) * 100)
    : run.status === SourcingRunStatus.COMPLETED
      ? 100
      : 5;
  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          {run.status === SourcingRunStatus.COMPLETED
            ? `Done — ${run.selected_count} strong match${run.selected_count === 1 ? "" : "es"}`
            : "Ranking candidates…"}
        </span>
        <span className="text-muted-foreground">
          {run.evaluated_count}/{run.total_candidates || "…"}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MatchCard({
  match,
  onStatus,
  pending,
}: {
  match: JobCandidateMatch;
  onStatus: (status: string) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rec = match.recommendation?.toLowerCase();

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-4 transition-colors hover:border-electric/30">
      <div className="flex items-start gap-4">
        <ScoreRing score={match.score} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UserAvatar seed={match.candidate_id ?? match.name} name={match.name} size={28} className="border border-border/60" />
            <span className="font-semibold">{match.name}</span>
            {rec && RECOMMENDATION_META[rec] && (
              <StatusBadge value={rec} meta={RECOMMENDATION_META} />
            )}
            <StatusBadge value={match.status} meta={MATCH_STATUS_META} />
            <Badge tone="neutral">{match.source}</Badge>
          </div>

          {match.summary && (
            <p className="mt-2 text-sm text-foreground/80">{match.summary}</p>
          )}

          {match.score_breakdown && <ScoreBars breakdown={match.score_breakdown} />}

          {match.reasons?.length ? (
            <ul className="mt-3 space-y-1">
              {match.reasons.slice(0, open ? undefined : 2).map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>
          ) : null}

          {match.missing_skills?.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Missing:</span>
              {match.missing_skills.map((s) => (
                <Badge key={s} tone="warning">{s}</Badge>
              ))}
            </div>
          ) : null}

          {open && (
            <div className="mt-3 space-y-3 border-t border-border/50 pt-3">
              {match.concerns?.length ? (
                <Section title="Concerns" items={match.concerns} dot="bg-amber-400" />
              ) : null}
              {match.interview_focus?.length ? (
                <Section title="Interview focus" items={match.interview_focus} dot="bg-electric" />
              ) : null}
              {match.profile_url && (
                <a
                  href={match.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-electric-soft hover:underline"
                >
                  View source profile ↗
                </a>
              )}
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {open ? "Less" : "More detail"}
            <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <Button size="sm" variant="brand" disabled={pending} onClick={() => onStatus("SAVED")}>
            Save
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => onStatus("CONTACTED")}>
            Contact
          </Button>
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => onStatus("REJECTED")}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  semantic: "Semantic",
  skills: "Skills",
  experience: "Experience",
  location: "Location",
  seniority: "Seniority",
};

const toneBar: Record<Tone, string> = {
  success: "bg-emerald-400",
  electric: "bg-electric",
  plasma: "bg-plasma",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-sky-400",
  neutral: "bg-muted-foreground",
};

function ScoreBars({ breakdown }: { breakdown: ScoreBreakdown }) {
  const entries = (Object.keys(BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[])
    .filter((k) => typeof breakdown[k] === "number")
    .map((k) => [k, breakdown[k] as number] as const);
  if (!entries.length) return null;
  return (
    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
      {entries.map(([k, v]) => (
        <div key={k}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">{BREAKDOWN_LABELS[k]}</span>
            <span className="font-medium">{Math.round(v)}</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
            <div className={cn("h-full rounded-full", toneBar[scoreTone(v)])} style={{ width: `${v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/80">
            <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function exportMatchesCsv(matches: JobCandidateMatch[], jobTitle: string) {
  const headers = ["Name", "Email", "Source", "Score", "Recommendation", "Status", "Missing skills"];
  const rows = matches.map((m) => [
    m.name,
    m.email ?? "",
    m.source,
    String(m.score),
    m.recommendation ?? "",
    m.status,
    (m.missing_skills ?? []).join("; "),
  ]);
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${jobTitle.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}_matches.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
