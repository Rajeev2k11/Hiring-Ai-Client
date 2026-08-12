"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Linkedin,
  Loader2,
  Mail,
  Sparkles,
  Wand2,
  Users,
  UserPlus,
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
import { SendOutreachModal } from "@/components/app/SendOutreachModal";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useJob } from "@/hooks/useJobs";
import {
  useAddMatchToPool,
  useJobMatches,
  useMatchRun,
  useMatchProviders,
  useParseRequirements,
  useStartMatch,
  useUpdateMatchStatus,
} from "@/hooks/useMatching";
import {
  usePersistentState,
  useScrollRestoration,
} from "@/hooks/usePersistentState";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import {
  MATCH_STATUS_META,
  RECOMMENDATION_META,
  scoreTone,
  type Tone,
} from "@/constants/status";
import { SourcingRunStatus } from "@/types";
import type {
  JobCandidateMatch,
  MatchProviderInfo,
  ParsedRequirements,
  ScoreBreakdown,
} from "@/types";

/**
 * Shown only when the live provider catalog can't be loaded. Keep it aligned
 * with the backend allowlist (DISCOVERY_ENABLED_PROVIDERS) — the live
 * `/recruiter/matching/providers` response is always the source of truth.
 */
const FALLBACK_PROVIDERS: MatchProviderInfo[] = [
  { key: "internal", name: "Hiring OS Talent Pool", category: "Internal", tos_class: "OWNED_DATA", available: true, reason: null },
  {
    key: "github",
    name: "GitHub",
    category: "Engineering",
    tos_class: "OFFICIAL_API",
    available: false,
    reason: "Could not load live provider availability",
  },
];

const SCORE_FILTERS = [
  { label: "70+", value: 70 },
  { label: "80+", value: 80 },
  { label: "90+", value: 90 },
];

const STATUS_TABS = [
  { label: "Active", value: "" },
  { label: "Saved", value: "SAVED" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Rejected", value: "REJECTED" },
];

const QUALIFIED_MATCH_TARGET = 10;
const CANDIDATE_SEARCH_BUDGET = 200;

export default function JobMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: job } = useJob(id);
  const { data: liveProviders } = useMatchProviders();
  const [providers, setProviders] = useState<string[]>(["internal"]);
  const initializedProvidersForJob = useRef<string | null>(null);
  const skipNextProviderPersist = useRef(false);
  // Filters and the in-flight run are kept per job, so leaving for another
  // sidebar tab and coming back resumes the search instead of resetting it.
  const [minScore, setMinScore] = usePersistentState(`matches:${id}:minScore`, 70);
  const [statusTab, setStatusTab] = usePersistentState(`matches:${id}:statusTab`, ""); // "" = Active
  const [runId, setRunId] = usePersistentState<string | null>(
    `matches:${id}:runId`,
    null
  );
  const [outreachTarget, setOutreachTarget] = useState<{
    candidateId: string;
    name: string;
  } | null>(null);

  const parse = useParseRequirements();
  const startMatch = useStartMatch();
  const { data: run } = useMatchRun(runId);
  const { data: matches, isLoading: matchesLoading } = useJobMatches(id, {
    min_score: minScore || undefined,
    status: statusTab || undefined,
  });
  const updateStatus = useUpdateMatchStatus(id);
  const addToPool = useAddMatchToPool(id);

  useScrollRestoration(`matches:${id}`, !matchesLoading);

  const providerCatalog = liveProviders?.length ? liveProviders : FALLBACK_PROVIDERS;
  const providerGroups = useMemo(() => {
    const groups = new Map<string, MatchProviderInfo[]>();
    for (const provider of providerCatalog) {
      const current = groups.get(provider.category) ?? [];
      current.push(provider);
      groups.set(provider.category, current);
    }
    return [...groups.entries()];
  }, [providerCatalog]);
  const availableProviderKeys = useMemo(
    () => providerCatalog.filter((provider) => provider.available).map((provider) => provider.key),
    [providerCatalog]
  );

  // Start new jobs with every currently available source selected, and retain
  // the recruiter's explicit choice for this job during the browser session.
  useEffect(() => {
    if (initializedProvidersForJob.current === id || !liveProviders?.length) return;
    const available = new Set(
      liveProviders.filter((provider) => provider.available).map((provider) => provider.key)
    );
    let initial = [...available];
    try {
      const saved = window.sessionStorage.getItem(`hiring-os:match-sources:${id}`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          initial = parsed.filter((key): key is string => typeof key === "string" && available.has(key));
        }
      }
    } catch {
      // Storage is an optional convenience; live availability remains the source of truth.
    }
    skipNextProviderPersist.current = true;
    initializedProvidersForJob.current = id;
    setProviders(initial);
  }, [id, liveProviders]);

  useEffect(() => {
    if (initializedProvidersForJob.current !== id) return;
    if (skipNextProviderPersist.current) {
      skipNextProviderPersist.current = false;
      return;
    }
    try {
      window.sessionStorage.setItem(
        `hiring-os:match-sources:${id}`,
        JSON.stringify(providers)
      );
    } catch {
      // Ignore unavailable/private storage and continue with in-memory state.
    }
  }, [id, providers]);

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
        payload: {
          providers,
          limit: CANDIDATE_SEARCH_BUDGET,
          target_count: QUALIFIED_MATCH_TARGET,
        },
      });
      setRunId(started.id);
      toast.success("AI search started — targeting at least 10 qualified matches…");
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
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Candidate sources</p>
                <p className="text-xs text-muted-foreground">
                  Only selected platforms are searched. Up to 200 profiles are checked to target 10+ results; anything below 70% stays excluded.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProviders(availableProviderKeys)}
                  className="text-xs font-medium text-electric-soft hover:text-electric"
                >
                  Select all available
                </button>
                <span className="text-border">·</span>
                <button
                  type="button"
                  onClick={() => setProviders([])}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {providerGroups.map(([category, sources]) => (
                <div key={category} className="rounded-xl border border-border/50 bg-secondary/20 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sources.map((source) => {
                      const active = providers.includes(source.key);
                      return (
                        <button
                          key={source.key}
                          type="button"
                          disabled={!source.available}
                          title={source.available ? `Search ${source.name}` : source.reason ?? "Provider unavailable"}
                          onClick={() => toggleProvider(source.key)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
                            active
                              ? "border-electric/50 bg-electric/10 text-electric-soft"
                              : "border-border/60 text-muted-foreground hover:text-foreground",
                            !source.available && "cursor-not-allowed border-dashed opacity-45"
                          )}
                        >
                          {source.name}
                          {/* Synthetic sources are always labelled so fabricated
                              profiles can never look like real candidates. */}
                          {source.synthetic && (
                            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                              Test data
                            </span>
                          )}
                          {!source.available ? " · setup" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {providers.length} source{providers.length === 1 ? "" : "s"} selected. Disabled sources show the required setup on hover.
            </p>
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
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold">
            {STATUS_TABS.find((t) => t.value === statusTab)?.label === "Active"
              ? "Candidates"
              : STATUS_TABS.find((t) => t.value === statusTab)?.label}
            {matches?.length ? (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {matches.length}
              </span>
            ) : null}
          </h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {/* Status destination tabs */}
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusTab(t.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                statusTab === t.value
                  ? "border-electric/50 bg-electric/10 text-electric-soft"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
          <span className="mx-1 w-px bg-border/60" />
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
          statusTab ? (
            <EmptyState
              icon={Users}
              title={`No ${STATUS_TABS.find((t) => t.value === statusTab)?.label.toLowerCase()} candidates`}
              description={
                statusTab === "SAVED"
                  ? "Candidates you Save will appear here."
                  : statusTab === "CONTACTED"
                    ? "Candidates you mark as Contacted will appear here."
                    : "Candidates you Reject are moved here, out of your active list."
              }
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No 70%+ matches yet"
              description="Choose the internal pool and/or external platforms, then run AI matching. Only candidates scoring 70–100% are shown."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/pool">Go to Talent Pool</Link>
                </Button>
              }
            />
          )
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
              onOutreach={() =>
                m.candidate_id &&
                setOutreachTarget({ candidateId: m.candidate_id, name: m.name })
              }
              onAddToPool={() =>
                addToPool.mutate(m.id, {
                  onSuccess: () => toast.success(`Added ${m.name} to your talent pool`),
                  onError: (e) => toast.error((e as Error).message || "Could not add to pool"),
                })
              }
              pending={updateStatus.isPending}
              addingToPool={addToPool.isPending}
            />
          ))
        )}
      </div>

      <SendOutreachModal
        open={outreachTarget !== null}
        onClose={() => setOutreachTarget(null)}
        jobId={id}
        candidateId={outreachTarget?.candidateId ?? ""}
        candidateName={outreachTarget?.name}
      />
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

function MatchProgress({ run }: { run: { status: string; evaluated_count: number; total_candidates: number; selected_count: number; error?: string | null } }) {
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
      {run.status === SourcingRunStatus.COMPLETED && run.selected_count < QUALIFIED_MATCH_TARGET ? (
        <p className="mt-2 text-xs text-amber-300">
          {run.error ?? `Only ${run.selected_count} verified profiles cleared 70%; no lower-scoring profiles were added.`}
        </p>
      ) : null}
    </div>
  );
}

function MatchCard({
  match,
  onStatus,
  onAddToPool,
  onOutreach,
  pending,
  addingToPool,
}: {
  match: JobCandidateMatch;
  onStatus: (status: string) => void;
  onAddToPool: () => void;
  onOutreach: () => void;
  pending: boolean;
  addingToPool: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rec = match.recommendation?.toLowerCase();
  const external = !match.candidate_id; // discovered from an external source
  const isLinkedIn = match.source?.toLowerCase() === "linkedin";
  // Synthetic fixture profiles always live on the non-production "linkedin.mock"
  // host, so a fabricated candidate is always identifiable and labelled. Real
  // approved-partner data is on linkedin.com and is never flagged.
  const isSynthetic = (match.profile_url ?? "").includes("linkedin.mock");

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
            {isLinkedIn ? (
              <Badge tone="info">
                <Linkedin className="mr-1 inline size-3" />
                LinkedIn
              </Badge>
            ) : external ? (
              <Badge tone="plasma">Discovered · {match.source}</Badge>
            ) : (
              <Badge tone="neutral">{match.source}</Badge>
            )}
            {isSynthetic && (
              <Badge tone="warning">Synthetic test data — not a real profile</Badge>
            )}
            {external && match.profile_url && (
              <a
                href={match.profile_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <ExternalLink className="size-3" /> Profile
              </a>
            )}
            {match.email && (
              <a
                href={`mailto:${match.email}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <Mail className="size-3" /> {match.email}
              </a>
            )}
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
          {external && (
            <Button size="sm" variant="brand" disabled={addingToPool} onClick={onAddToPool}>
              {addingToPool ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              Add to pool
            </Button>
          )}
          <Button size="sm" variant={external ? "outline" : "brand"} disabled={pending} onClick={() => onStatus("SAVED")}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => {
              // Pool/applied candidates get a tracked outreach email; purely
              // external profiles (no candidate record) have no mailbox to
              // send to, so fall back to their public profile.
              if (match.candidate_id) {
                onOutreach();
              } else if (match.profile_url) {
                onStatus("CONTACTED");
                window.open(match.profile_url, "_blank");
              } else {
                onStatus("CONTACTED");
              }
            }}
          >
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
