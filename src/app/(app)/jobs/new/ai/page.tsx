"use client";

/**
 * Conversational AI Job Composer.
 *
 * The recruiter types one line ("I need a React JS developer in 30 days") and
 * the AI guides them step by step: title options -> department -> location ->
 * work mode + employment type -> skills -> experience -> salary -> a fully
 * composed professional description they review, edit, and post.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Clock,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useComposerCompose,
  useComposerSkills,
  useComposerStart,
  useSuggestSalary,
} from "@/hooks/useAi";
import { useCreateJob } from "@/hooks/useJobs";
import { JobStatus } from "@/types";
import type { ComposerSalary, ComposerStartResponse } from "@/types";
import { cn, formatCompactCurrency } from "@/lib/utils";

type Phase =
  | "intent"
  | "title"
  | "department"
  | "location"
  | "details"
  | "skills"
  | "experience"
  | "salary"
  | "composing"
  | "review";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const EXPERIENCE_OPTIONS = [
  { label: "Any", value: null },
  { label: "1+ yrs", value: 1 },
  { label: "2+ yrs", value: 2 },
  { label: "3+ yrs", value: 3 },
  { label: "5+ yrs", value: 5 },
  { label: "8+ yrs", value: 8 },
];
const FALLBACK_DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "Operations"];

interface Draft {
  prompt: string;
  role: string;
  timeline: string | null;
  title: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  skills: string[];
  niceToHave: string[];
  experienceMin: number | null;
  salary: ComposerSalary | null;
}

const EMPTY_DRAFT: Draft = {
  prompt: "",
  role: "",
  timeline: null,
  title: "",
  department: "",
  location: "",
  workMode: "",
  employmentType: "",
  skills: [],
  niceToHave: [],
  experienceMin: null,
  salary: null,
};

export default function AiJobComposerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intent");
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [start, setStart] = useState<ComposerStartResponse | null>(null);
  const [skillOptions, setSkillOptions] = useState<{ required: string[]; nice: string[] }>({ required: [], nice: [] });
  const [description, setDescription] = useState("");

  const startMut = useComposerStart();
  const skillsMut = useComposerSkills();
  const composeMut = useComposerCompose();
  const salaryMut = useSuggestSalary();
  const create = useCreateJob();

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [phase]);

  // ---- step handlers -------------------------------------------------------
  const onIntent = async (prompt: string) => {
    try {
      const res = await startMut.mutateAsync(prompt);
      setStart(res);
      setDraft((d) => ({ ...d, prompt, role: res.role, timeline: res.timeline }));
      setPhase("title");
    } catch (e) {
      toast.error((e as Error).message || "Could not analyze your request.");
    }
  };

  const onTitle = (title: string) => {
    setDraft((d) => ({ ...d, title }));
    setPhase("department");
  };

  const onDepartment = (department: string) => {
    setDraft((d) => ({ ...d, department }));
    setPhase("location");
  };

  const onLocation = (location: string) => {
    setDraft((d) => ({ ...d, location }));
    setPhase("details");
  };

  const onDetails = async (workMode: string, employmentType: string) => {
    setDraft((d) => ({ ...d, workMode, employmentType }));
    setPhase("skills");
    // Fetch skill suggestions while the recruiter reads the question.
    try {
      const res = await skillsMut.mutateAsync({ title: draft.title, department: draft.department || null });
      setSkillOptions({ required: res.required, nice: res.nice_to_have });
      // Pre-select all AI-recommended core skills; recruiter can deselect.
      setDraft((d) => ({ ...d, skills: res.required }));
    } catch (e) {
      toast.error((e as Error).message || "Could not suggest skills — add them manually.");
    }
  };

  const onSkillsDone = () => {
    if (draft.skills.length === 0) {
      toast.error("Select at least one skill.");
      return;
    }
    setPhase("experience");
  };

  const onExperience = (experienceMin: number | null) => {
    setDraft((d) => ({ ...d, experienceMin }));
    setPhase("salary");
  };

  const onSalaryDone = async (salary: ComposerSalary | null) => {
    const finalDraft = { ...draft, salary };
    setDraft(finalDraft);
    setPhase("composing");
    try {
      const res = await composeMut.mutateAsync({
        title: finalDraft.title,
        department: finalDraft.department || null,
        location: finalDraft.location || null,
        work_mode: finalDraft.workMode || null,
        employment_type: finalDraft.employmentType || null,
        skills: finalDraft.skills,
        nice_to_have: finalDraft.niceToHave,
        experience_min: finalDraft.experienceMin,
        timeline: finalDraft.timeline,
        salary,
      });
      setDescription(res.description);
      setPhase("review");
    } catch (e) {
      toast.error((e as Error).message || "Could not compose the description.");
      setPhase("salary");
    }
  };

  const submit = async (status: string) => {
    if (!draft.title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    const locationLabel = [draft.location, draft.workMode].filter(Boolean).join(" · ");
    try {
      await create.mutateAsync({
        title: draft.title,
        department: draft.department || null,
        location: locationLabel || null,
        description,
        status,
      });
      toast.success(status === JobStatus.OPEN ? "Job published 🎉" : "Draft saved");
      router.push("/jobs");
    } catch (e) {
      toast.error((e as Error).message || "Could not save the job.");
    }
  };

  // ---- answered-step summary rows -----------------------------------------
  const answers: { icon: typeof Check; label: string; value: string; phase: Phase }[] = [];
  if (phase !== "intent" && draft.prompt)
    answers.push({ icon: Sparkles, label: "Your need", value: draft.prompt, phase: "intent" });
  if (draft.title && !["intent", "title"].includes(phase))
    answers.push({ icon: Briefcase, label: "Title", value: draft.title, phase: "title" });
  if (!["intent", "title", "department"].includes(phase) && draft.department)
    answers.push({ icon: Building2, label: "Department", value: draft.department, phase: "department" });
  if (!["intent", "title", "department", "location"].includes(phase) && draft.location)
    answers.push({ icon: MapPin, label: "Location", value: draft.location, phase: "location" });
  if (["skills", "experience", "salary", "composing", "review"].includes(phase) && draft.workMode)
    answers.push({ icon: Clock, label: "Setup", value: `${draft.workMode} · ${draft.employmentType}`, phase: "details" });
  if (["experience", "salary", "composing", "review"].includes(phase) && draft.skills.length)
    answers.push({ icon: Check, label: "Skills", value: draft.skills.slice(0, 6).join(", ") + (draft.skills.length > 6 ? "…" : ""), phase: "skills" });
  if (["salary", "composing", "review"].includes(phase))
    answers.push({ icon: Clock, label: "Experience", value: draft.experienceMin ? `${draft.experienceMin}+ years` : "Any", phase: "experience" });
  if (["composing", "review"].includes(phase) && draft.salary)
    answers.push({
      icon: Wallet,
      label: "Salary",
      value: `${formatCompactCurrency(draft.salary.min_amount, draft.salary.currency)}–${formatCompactCurrency(draft.salary.max_amount, draft.salary.currency)} / ${draft.salary.period}`,
      phase: "salary",
    });

  return (
    <div className="mx-auto max-w-[860px] px-5 py-8 lg:px-8">
      <nav className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          <Link href="/jobs" className="hover:text-foreground">Jobs</Link>
          <span className="mx-2">/</span>
          <span className="text-electric-soft">AI Job Composer</span>
        </div>
        <Link href="/jobs/new" className="text-xs hover:text-foreground hover:underline">
          Fill manually instead →
        </Link>
      </nav>

      {phase === "intent" && (
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white">
            <Sparkles className="size-7" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
            Who do you need to hire?
          </h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Describe it in one line — I&apos;ll ask a few quick questions and build
            the whole job post for you.
          </p>
        </div>
      )}

      {/* Answered steps (chat history) */}
      {answers.length > 0 && (
        <div className="mb-5 space-y-2">
          {answers.map((a) => (
            <button
              key={a.label}
              onClick={() => !["composing"].includes(phase) && setPhase(a.phase)}
              className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card/30 px-4 py-2.5 text-left transition-colors hover:border-electric/30"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary/60 text-electric-soft">
                <a.icon className="size-3.5" />
              </span>
              <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">{a.label}</span>
              <span className="min-w-0 flex-1 truncate text-sm">{a.value}</span>
              <Pencil className="size-3 shrink-0 text-muted-foreground/60" />
            </button>
          ))}
        </div>
      )}

      {/* Current step */}
      <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
        {phase === "intent" && <IntentStep onSubmit={onIntent} pending={startMut.isPending} />}
        {phase === "title" && start && (
          <TitleStep start={start} onPick={onTitle} />
        )}
        {phase === "department" && (
          <ChoiceStep
            question="Which department is this role in?"
            hint={start?.note}
            options={[...new Set([...(start?.department_options ?? []), ...FALLBACK_DEPARTMENTS])].slice(0, 6)}
            manualPlaceholder="Or type a department…"
            onPick={onDepartment}
            allowSkip
            onSkip={() => onDepartment("")}
          />
        )}
        {phase === "location" && (
          <LocationStep onSubmit={onLocation} />
        )}
        {phase === "details" && <DetailsStep onSubmit={onDetails} />}
        {phase === "skills" && (
          <SkillsStep
            loading={skillsMut.isPending}
            required={skillOptions.required}
            nice={skillOptions.nice}
            selected={draft.skills}
            selectedNice={draft.niceToHave}
            onToggle={(s) =>
              setDraft((d) => ({
                ...d,
                skills: d.skills.includes(s) ? d.skills.filter((x) => x !== s) : [...d.skills, s],
              }))
            }
            onToggleNice={(s) =>
              setDraft((d) => ({
                ...d,
                niceToHave: d.niceToHave.includes(s) ? d.niceToHave.filter((x) => x !== s) : [...d.niceToHave, s],
              }))
            }
            onAddCustom={(s) =>
              setDraft((d) => (d.skills.includes(s) ? d : { ...d, skills: [...d.skills, s] }))
            }
            onDone={onSkillsDone}
          />
        )}
        {phase === "experience" && (
          <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
            <StepQuestion text="How much experience should candidates have?" />
            <div className="mt-4 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((o) => (
                <ChipButton key={o.label} onClick={() => onExperience(o.value)}>
                  {o.label}
                </ChipButton>
              ))}
            </div>
          </div>
        )}
        {phase === "salary" && (
          <SalaryStep
            onDone={onSalaryDone}
            onGenerate={async () => {
              const res = await salaryMut.mutateAsync({
                title: draft.title,
                department: draft.department || null,
                location: [draft.location, draft.workMode].filter(Boolean).join(" · ") || null,
                description: `${draft.employmentType} role. Skills: ${draft.skills.join(", ")}`,
              });
              return {
                currency: res.currency,
                min_amount: res.min_amount,
                max_amount: res.max_amount,
                period: res.period,
              };
            }}
            generating={salaryMut.isPending}
          />
        )}
        {phase === "composing" && <ComposingStep />}
        {phase === "review" && (
          <ReviewStep
            draft={draft}
            setDraft={setDraft}
            description={description}
            setDescription={setDescription}
            onPublish={() => submit(JobStatus.OPEN)}
            onDraft={() => submit(JobStatus.DRAFT)}
            saving={create.isPending}
          />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

/* ---------------------------------- steps --------------------------------- */

function StepQuestion({ text, hint }: { text: string; hint?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white">
        <Sparkles className="size-4" />
      </span>
      <div>
        <p className="pt-1.5 text-[15px] font-semibold">{text}</p>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

function ChipButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-electric/60 bg-electric/15 text-electric-soft"
          : "border-border/60 bg-secondary/30 hover:border-electric/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function IntentStep({ onSubmit, pending }: { onSubmit: (v: string) => void; pending: boolean }) {
  const [value, setValue] = useState("");
  const go = () => value.trim().length >= 3 && onSubmit(value.trim());
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <div className="flex gap-2.5">
        <Input
          autoFocus
          placeholder='e.g. "I need a React JS developer in 30 days"'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          disabled={pending}
          className="h-12 text-[15px]"
        />
        <Button variant="brand" className="h-12" onClick={go} disabled={pending || value.trim().length < 3}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
        </Button>
      </div>
      {pending && (
        <p className="mt-3 flex items-center gap-2 text-sm text-electric-soft">
          <Sparkles className="size-3.5 animate-pulse" /> Understanding your need…
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "I need a React JS developer in 30 days",
          "Hiring a senior data scientist for our ML team",
          "Looking for a UI/UX designer, remote",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setValue(s)}
            className="rounded-full border border-border/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-electric/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function TitleStep({ start, onPick }: { start: ComposerStartResponse; onPick: (t: string) => void }) {
  const [custom, setCustom] = useState("");
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion
        text="Got it! Which job title should we post?"
        hint={start.note || `Suggestions for a ${start.role} role${start.timeline ? ` (timeline: ${start.timeline})` : ""}:`}
      />
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {start.title_options.map((t) => (
          <button
            key={t}
            onClick={() => onPick(t)}
            className="rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-electric/50 hover:bg-electric/5"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Or write your own title…"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && custom.trim() && onPick(custom.trim())}
        />
        <Button variant="outline" onClick={() => custom.trim() && onPick(custom.trim())} disabled={!custom.trim()}>
          Use this
        </Button>
      </div>
    </div>
  );
}

function ChoiceStep({
  question,
  hint,
  options,
  manualPlaceholder,
  onPick,
  allowSkip,
  onSkip,
}: {
  question: string;
  hint?: string | null;
  options: string[];
  manualPlaceholder: string;
  onPick: (v: string) => void;
  allowSkip?: boolean;
  onSkip?: () => void;
}) {
  const [custom, setCustom] = useState("");
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion text={question} />
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((o) => (
          <ChipButton key={o} onClick={() => onPick(o)}>{o}</ChipButton>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder={manualPlaceholder}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && custom.trim() && onPick(custom.trim())}
        />
        <Button variant="outline" onClick={() => custom.trim() && onPick(custom.trim())} disabled={!custom.trim()}>
          Use this
        </Button>
        {allowSkip && (
          <Button variant="ghost" onClick={onSkip}>Skip</Button>
        )}
      </div>
    </div>
  );
}

function LocationStep({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion text="Where is this role based?" hint="City / country — or skip if it's fully remote." />
      <div className="mt-4 flex gap-2">
        <Input
          autoFocus
          placeholder="e.g. Bangalore, India"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value.trim())}
        />
        <Button variant="brand" onClick={() => onSubmit(value.trim())} disabled={!value.trim()}>
          Next
        </Button>
        <Button variant="ghost" onClick={() => onSubmit("")}>Skip</Button>
      </div>
    </div>
  );
}

function DetailsStep({ onSubmit }: { onSubmit: (workMode: string, employmentType: string) => void }) {
  const [workMode, setWorkMode] = useState("");
  const [empType, setEmpType] = useState("");
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion text="How will this role work?" />
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Work mode</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {WORK_MODES.map((m) => (
          <ChipButton key={m} active={workMode === m} onClick={() => setWorkMode(m)}>{m}</ChipButton>
        ))}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Employment type</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {EMPLOYMENT_TYPES.map((t) => (
          <ChipButton key={t} active={empType === t} onClick={() => setEmpType(t)}>{t}</ChipButton>
        ))}
      </div>
      <Button
        variant="brand"
        className="mt-5"
        disabled={!workMode || !empType}
        onClick={() => onSubmit(workMode, empType)}
      >
        Next <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function SkillsStep({
  loading,
  required,
  nice,
  selected,
  selectedNice,
  onToggle,
  onToggleNice,
  onAddCustom,
  onDone,
}: {
  loading: boolean;
  required: string[];
  nice: string[];
  selected: string[];
  selectedNice: string[];
  onToggle: (s: string) => void;
  onToggleNice: (s: string) => void;
  onAddCustom: (s: string) => void;
  onDone: () => void;
}) {
  const [custom, setCustom] = useState("");
  const customsAdded = selected.filter((s) => !required.includes(s));
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion
        text="Which skills should candidates have?"
        hint="I've pre-selected the core skills for this role — tap to adjust, or add your own."
      />
      {loading ? (
        <div className="mt-5 flex items-center gap-2 text-sm text-electric-soft">
          <Loader2 className="size-4 animate-spin" /> Picking the right skills for this role…
        </div>
      ) : (
        <>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Required skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {required.map((s) => (
              <ChipButton key={s} active={selected.includes(s)} onClick={() => onToggle(s)}>
                {selected.includes(s) && <Check className="mr-1 inline size-3" />}
                {s}
              </ChipButton>
            ))}
            {customsAdded.map((s) => (
              <ChipButton key={s} active onClick={() => onToggle(s)}>
                <X className="mr-1 inline size-3" />
                {s}
              </ChipButton>
            ))}
          </div>
          {nice.length > 0 && (
            <>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nice to have (optional)</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {nice.map((s) => (
                  <ChipButton key={s} active={selectedNice.includes(s)} onClick={() => onToggleNice(s)}>
                    {selectedNice.includes(s) && <Check className="mr-1 inline size-3" />}
                    {s}
                  </ChipButton>
                ))}
              </div>
            </>
          )}
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Add another skill…"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && custom.trim()) {
                  onAddCustom(custom.trim());
                  setCustom("");
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (custom.trim()) {
                  onAddCustom(custom.trim());
                  setCustom("");
                }
              }}
              disabled={!custom.trim()}
            >
              <Plus className="size-4" /> Add
            </Button>
          </div>
          <Button variant="brand" className="mt-5" onClick={onDone} disabled={selected.length === 0}>
            Next <ArrowRight className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}

function SalaryStep({
  onDone,
  onGenerate,
  generating,
}: {
  onDone: (salary: ComposerSalary | null) => void;
  onGenerate: () => Promise<ComposerSalary>;
  generating: boolean;
}) {
  const [currency, setCurrency] = useState("USD");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [period, setPeriod] = useState("year");

  const generate = async () => {
    try {
      const s = await onGenerate();
      setCurrency(s.currency);
      setMin(String(s.min_amount));
      setMax(String(s.max_amount));
      setPeriod(s.period);
      toast.success("AI suggested a salary range — adjust if needed.");
    } catch (e) {
      toast.error((e as Error).message || "Could not suggest a salary.");
    }
  };

  const next = () => {
    const minN = parseInt(min, 10);
    const maxN = parseInt(max, 10);
    if (!min && !max) return onDone(null);
    if (Number.isNaN(minN) || Number.isNaN(maxN) || minN > maxN) {
      toast.error("Enter a valid salary range (min ≤ max), or leave both empty.");
      return;
    }
    onDone({ currency, min_amount: minN, max_amount: maxN, period });
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <StepQuestion
        text="What's the salary range?"
        hint="Type a range, let AI suggest one, or skip to leave it out of the post."
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Currency</Label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none focus-visible:border-electric/60"
          >
            {["USD", "EUR", "GBP", "INR"].map((c) => (
              <option key={c} value={c} className="bg-popover">{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Minimum</Label>
          <Input type="number" placeholder="60000" value={min} onChange={(e) => setMin(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Maximum</Label>
          <Input type="number" placeholder="90000" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Period</Label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none focus-visible:border-electric/60"
          >
            <option value="year" className="bg-popover">per year</option>
            <option value="month" className="bg-popover">per month</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={generate} disabled={generating}>
          {generating ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
          Generate with AI
        </Button>
        <Button variant="brand" onClick={next}>
          Compose the job post <Sparkles className="size-4" />
        </Button>
        <Button variant="ghost" onClick={() => onDone(null)}>Skip salary</Button>
      </div>
    </div>
  );
}

function ComposingStep() {
  return (
    <div className="rounded-2xl border border-electric/30 bg-card/60 p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-electric-soft">
        <Sparkles className="size-4 animate-pulse" />
        <span>Writing your job post</span>
        <span className="inline-flex gap-0.5">
          <span className="animate-bounce [animation-delay:0ms]">.</span>
          <span className="animate-bounce [animation-delay:150ms]">.</span>
          <span className="animate-bounce [animation-delay:300ms]">.</span>
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {[90, 75, 85, 60, 70, 82, 45, 65].map((w, i) => (
          <div
            key={i}
            className="h-3.5 animate-pulse rounded bg-secondary/70"
            style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewStep({
  draft,
  setDraft,
  description,
  setDescription,
  onPublish,
  onDraft,
  saving,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  description: string;
  setDescription: (v: string) => void;
  onPublish: () => void;
  onDraft: () => void;
  saving: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
      <div className="flex items-center gap-2">
        <Check className="size-5 text-emerald-400" />
        <p className="text-[15px] font-semibold">Your job post is ready — review &amp; edit anything below.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Job Title</Label>
          <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Department</Label>
          <Input value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Location</Label>
          <Input value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {draft.workMode && <Badge tone="electric">{draft.workMode}</Badge>}
        {draft.employmentType && <Badge tone="neutral">{draft.employmentType}</Badge>}
        {draft.timeline && <Badge tone="plasma">Hire in {draft.timeline}</Badge>}
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <span className="text-xs text-muted-foreground">Markdown supported — edit freely</span>
        </div>
        <Textarea rows={18} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="brand" onClick={onPublish} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Publish job
        </Button>
        <Button variant="secondary" onClick={onDraft} disabled={saving}>
          Save as draft
        </Button>
      </div>
    </div>
  );
}
