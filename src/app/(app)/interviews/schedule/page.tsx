"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  Sparkles,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useCandidate, useCandidates } from "@/hooks/useCandidates";
import { useCreateInterview, useInterviewAvailability } from "@/hooks/useInterviews";
import { useGoogleStatus } from "@/hooks/useIntegrations";
import { useTeam } from "@/hooks/useTeam";
import { InterviewPlatform } from "@/types";
import { cn, initials } from "@/lib/utils";
import { formatTime } from "@/lib/format";
import { APPLICATION_STATUS_META } from "@/constants/status";

const DURATION_MINUTES = 60;
const TIMEZONE = "America/New_York";

const PLATFORM_OPTIONS = [
  { value: InterviewPlatform.ZOOM, label: "Zoom" },
  { value: InterviewPlatform.GOOGLE_MEET, label: "Google Meet" },
];

const STAGES = ["Technical Screen", "Technical Deep Dive", "System Design", "Hiring Manager", "Final Panel"];
const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <ScheduleInner />
    </Suspense>
  );
}

function ScheduleInner() {
  const router = useRouter();
  const params = useSearchParams();
  const paramApp = params.get("application");

  const { data: allCandidates } = useCandidates();
  const [appId, setAppId] = useState<string | null>(paramApp);
  const { data: candidate } = useCandidate(appId ?? "", Boolean(appId));
  const { data: team } = useTeam();
  const { data: googleStatus } = useGoogleStatus();
  const create = useCreateInterview();

  const googleConnected = googleStatus?.connected ?? false;
  const [platformChoice, setPlatformChoice] = useState<string | null>(null);
  // Default follows the Google connection state until the user picks explicitly.
  const platform =
    platformChoice ??
    (googleConnected ? InterviewPlatform.GOOGLE_MEET : InterviewPlatform.ZOOM);

  const [stage, setStage] = useState(STAGES[1]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [panel, setPanel] = useState<string[]>([]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const startPad = first.getDay();
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return cells;
  }, [month]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const {
    data: availability,
    isLoading: slotsLoading,
    isError: slotsError,
    error: slotsErr,
  } = useInterviewAvailability(
    {
      date: dateStr,
      interviewer_ids: panel,
      duration_minutes: DURATION_MINUTES,
      timezone: TIMEZONE,
    },
    Boolean(dateStr)
  );

  const slots = availability?.slots ?? [];

  const selectDate = (d: Date) => {
    setSelectedDate(d);
    setSlot(null);
  };

  const togglePanel = (id: string) => {
    setPanel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setSlot(null);
  };

  const schedule = async () => {
    if (!appId) return toast.error("Select an applicant first.");
    if (!selectedDate) return toast.error("Pick a date first.");
    if (slot === null || !slots[slot]) return toast.error("Pick a time slot.");
    const chosen = slots[slot];
    await create.mutateAsync({
      application_id: appId,
      stage,
      scheduled_at: chosen.start_at,
      duration_minutes: DURATION_MINUTES,
      platform,
      timezone: TIMEZONE,
      interviewer_ids: panel,
      auto_generate_meeting: true,
    });
    toast.success(`Interview scheduled${candidate ? ` for ${candidate.name}` : ""}`);
    router.push("/interviews");
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <Link href="/interviews" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to interviews
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Schedule interview</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Candidate + panel */}
        <div className="space-y-5">
          {!appId ? (
            <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
              <p className="text-sm font-medium">Select an applicant</p>
              <select
                onChange={(e) => setAppId(e.target.value || null)}
                defaultValue=""
                className="mt-3 h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none"
              >
                <option value="">Choose…</option>
                {(allCandidates ?? []).map((c) => (
                  <option key={c.application_id} value={c.application_id} className="bg-popover">
                    {c.candidate_name} — {c.job_title} ·{" "}
                    {APPLICATION_STATUS_META[c.status]?.label ?? c.status}
                  </option>
                ))}
              </select>
            </div>
          ) : !candidate ? (
            <Skeleton className="h-40 w-full rounded-2xl" />
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
              <div className="flex items-center gap-3">
                <UserAvatar seed={candidate.candidate_id} name={candidate.name} size={48} className="rounded-xl border border-border/60" />
                <div>
                  <p className="font-display text-base font-semibold">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{candidate.job_title}</p>
                </div>
              </div>

              <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Interview stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none">
                {STAGES.map((s) => <option key={s} value={s} className="bg-popover">{s}</option>)}
              </select>

              <div className="mt-5 rounded-xl border border-electric/20 bg-electric/5 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-electric-soft">
                  <Sparkles className="size-3.5" /> AI Insight
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">
                  {candidate.name.split(" ")[0]} scores in the top 5% for this role. Recommend a 60-minute block with a principal-level interviewer.
                </p>
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Interviewers</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(team ?? []).slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => togglePanel(m.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                      panel.includes(m.id)
                        ? "border-electric/50 bg-electric/10 text-electric-soft"
                        : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-[9px] font-medium">
                      {initials(m.name)}
                    </span>
                    {m.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-semibold">
              {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon-sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground">
            {WD.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <span key={i} />;
              const disabled = d < today;
              const isSel = selectedDate?.toDateString() === d.toDateString();
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => selectDate(d)}
                  className={cn(
                    "aspect-square rounded-lg text-sm transition-colors",
                    disabled && "text-muted-foreground/30",
                    !disabled && !isSel && "hover:bg-secondary/60",
                    isSel && "bg-brand-gradient font-semibold text-white"
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Times + confirm */}
        <div className="flex flex-col rounded-2xl border border-border/70 bg-card/40 p-5">
          <p className="font-display text-base font-semibold">Available times</p>
          <p className="text-xs text-muted-foreground">
            {selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Pick a date"}
          </p>
          <div className="mt-4 space-y-2.5">
            {!selectedDate ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-6 text-center text-xs text-muted-foreground">
                Select a date to see available time slots.
              </div>
            ) : slotsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
              ))
            ) : slotsError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-xs text-destructive">
                {(slotsErr as { message?: string })?.message ??
                  "Couldn't load availability."}
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-secondary/20 p-6 text-center text-xs text-muted-foreground">
                No available slots for this day. Try another date or adjust the panel.
              </div>
            ) : (
              slots.map((s, i) => {
                const fullyAvailable =
                  s.total_interviewers > 0 &&
                  s.available_count === s.total_interviewers;
                const note = s.is_optimal
                  ? "High interviewer overlap"
                  : fullyAvailable
                  ? "Fully available"
                  : `${s.available_count} of ${s.total_interviewers} interviewer${s.total_interviewers === 1 ? "" : "s"} available`;
                return (
                  <button
                    key={s.start_at}
                    onClick={() => setSlot(i)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-colors",
                      slot === i ? "border-electric/60 bg-electric/10" : "border-border/60 bg-secondary/30 hover:border-electric/40"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {formatTime(s.start_at)} — {formatTime(s.end_at)}
                      </p>
                      <p className={cn("text-xs", s.is_optimal ? "text-electric-soft" : "text-muted-foreground")}>
                        {s.is_optimal && "✦ "}{note}
                      </p>
                    </div>
                    {slot === i && <CheckCircle2 className="size-5 text-electric-soft" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Meeting platform
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPlatformChoice(opt.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                    platform === opt.value
                      ? "border-electric/60 bg-electric/10 text-foreground"
                      : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-electric/40 hover:text-foreground"
                  )}
                >
                  <Video className="size-4 text-electric-soft" />
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {platform === InterviewPlatform.GOOGLE_MEET
                ? googleConnected
                  ? "A Google Meet link will be generated automatically."
                  : "Connect a Google account in Settings to generate the Meet link."
                : "A Zoom meeting link will be generated automatically."}
            </p>
          </div>

          <Button variant="brand" className="mt-5 w-full" onClick={schedule} disabled={create.isPending}>
            {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Schedule interview
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Confirmation will be sent to the candidate and panel.
          </p>
        </div>
      </div>
    </div>
  );
}
