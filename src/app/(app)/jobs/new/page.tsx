"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileEdit,
  Loader2,
  ListChecks,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGenerateRequirements,
  useImproveDescription,
  useSuggestSalary,
} from "@/hooks/useAi";
import { useCreateJob } from "@/hooks/useJobs";
import { JobStatus } from "@/types";
import { cn, formatCompactCurrency } from "@/lib/utils";

const DEPARTMENTS = ["Engineering", "Product", "Design", "AI", "Sales", "Marketing", "Operations", "Customer Success"];

export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const improve = useImproveDescription();
  const requirements = useGenerateRequirements();
  const salary = useSuggestSalary();
  const create = useCreateJob();

  const isAiGenerating = improve.isPending || requirements.isPending || salary.isPending;

  const ctx = () => ({ title, department, location, description });
  const guard = () => {
    if (!title.trim()) {
      toast.error("Add a job title first so the AI has context.");
      return false;
    }
    return true;
  };

  const onImprove = async () => {
    if (!guard()) return;
    const res = await improve.mutateAsync(ctx());
    setDescription(res.improved_description);
    toast.success("Description polished by AI");
  };

  const onRequirements = async () => {
    if (!guard()) return;
    const res = await requirements.mutateAsync(ctx());
    const block = [
      "\n\n## Responsibilities",
      ...res.responsibilities.map((r) => `- ${r}`),
      "\n## Qualifications",
      ...res.qualifications.map((q) => `- ${q}`),
      "\n## Nice to have",
      ...res.nice_to_have.map((n) => `- ${n}`),
    ].join("\n");
    setDescription((d) => d + block);
    toast.success("Requirements generated");
  };

  const onSalary = async () => {
    if (!guard()) return;
    const res = await salary.mutateAsync(ctx());
    toast.success(
      `Suggested: ${formatCompactCurrency(res.min_amount, res.currency)}–${formatCompactCurrency(res.max_amount, res.currency)} / ${res.period}`
    );
    setDescription(
      (d) =>
        d +
        `\n\n## Compensation\n${formatCompactCurrency(res.min_amount, res.currency)} – ${formatCompactCurrency(res.max_amount, res.currency)} per ${res.period}. ${res.rationale}`
    );
  };

  const submit = async (status: string) => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    await create.mutateAsync({
      title,
      department: department || null,
      location: location || null,
      description,
      status,
    });
    toast.success(status === JobStatus.OPEN ? "Job published" : "Draft saved");
    router.push("/jobs");
  };

  const ASSIST = [
    { icon: FileEdit, label: "Improve job description", onClick: onImprove, pending: improve.isPending },
    { icon: ListChecks, label: "Generate requirements", onClick: onRequirements, pending: requirements.isPending },
    { icon: Wallet, label: "Suggested salary range", onClick: onSalary, pending: salary.isPending },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-electric-soft">Create New Job</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Configure Job Opening</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the core details. Our AI will help you polish the description
            and requirements in real-time.
          </p>

          <div className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Product Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dept">Department</Label>
                <select
                  id="dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3.5 text-sm outline-none focus-visible:border-electric/60 focus-visible:ring-2 focus-visible:ring-electric/25"
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-popover">{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loc">Location</Label>
              <Input
                id="loc"
                placeholder="e.g. London, UK (Remote Eligible)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="desc">Description</Label>
                <span className="text-xs text-muted-foreground">Markdown supported</span>
              </div>
              <div className="relative">
                <Textarea
                  id="desc"
                  rows={14}
                  placeholder="Write a brief overview of the role…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isAiGenerating}
                  className={cn(isAiGenerating && "opacity-40")}
                />
                {isAiGenerating && (
                  <div className="absolute inset-0 flex flex-col gap-2.5 rounded-xl border border-electric/30 bg-card/95 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-electric-soft">
                      <Sparkles className="size-4 animate-pulse" />
                      <span>AI is writing</span>
                      <span className="inline-flex gap-0.5">
                        <span className="animate-bounce [animation-delay:0ms]">.</span>
                        <span className="animate-bounce [animation-delay:150ms]">.</span>
                        <span className="animate-bounce [animation-delay:300ms]">.</span>
                      </span>
                    </div>
                    <div className="mt-1 space-y-2.5">
                      <div className="h-3.5 w-[90%] animate-pulse rounded bg-secondary/80" />
                      <div className="h-3.5 w-[75%] animate-pulse rounded bg-secondary/60 [animation-delay:100ms]" />
                      <div className="h-3.5 w-[85%] animate-pulse rounded bg-secondary/70 [animation-delay:200ms]" />
                      <div className="h-3.5 w-[60%] animate-pulse rounded bg-secondary/50 [animation-delay:300ms]" />
                      <div className="h-3.5 w-[70%] animate-pulse rounded bg-secondary/60 [animation-delay:400ms]" />
                      <div className="h-3.5 w-[45%] animate-pulse rounded bg-secondary/40 [animation-delay:500ms]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="brand" onClick={() => submit(JobStatus.OPEN)} disabled={create.isPending}>
                {create.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Save &amp; Publish
              </Button>
              <Button variant="secondary" onClick={() => submit(JobStatus.DRAFT)} disabled={create.isPending}>
                Draft for Later
              </Button>
            </div>
          </div>
        </div>

        {/* AI Recruiter Assist */}
        <aside className="lg:pt-2">
          <div className="sticky top-24 rounded-2xl border border-border/70 bg-card/40 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">AI Recruiter Assist</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                  Always active
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-border/60 bg-secondary/30 p-4 text-sm text-muted-foreground">
              {isAiGenerating ? (
                <span className="flex items-center gap-2 text-electric-soft">
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating content, please wait…
                </span>
              ) : (
                "\"I can help you build a compelling job post. What's next?\""
              )}
            </div>

            <div className="mt-4 space-y-2.5">
              {ASSIST.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  disabled={a.pending}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-electric/40 hover:text-foreground disabled:opacity-60"
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border/60 bg-card text-electric-soft">
                    {a.pending ? <Loader2 className="size-4 animate-spin" /> : <a.icon className="size-4" />}
                  </span>
                  {a.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-3 py-2.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-time candidate matching active
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
