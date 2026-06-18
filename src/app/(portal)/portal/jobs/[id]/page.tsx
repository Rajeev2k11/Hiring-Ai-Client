"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Briefcase, Check, Loader2, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ScoreRing } from "@/components/shared/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortalJob } from "@/hooks/usePortal";
import { hashUnit, sleep } from "@/lib/utils";

export default function PortalJobDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading } = usePortalJob(id);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (isLoading || !job) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const score = 72 + Math.round(hashUnit(job.id) * 26);

  const apply = async () => {
    setApplying(true);
    await sleep(900);
    setApplying(false);
    setApplied(true);
    toast.success("Application submitted!");
  };

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <Link href="/portal/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to jobs
      </Link>

      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-border/70 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4" /> {job.department ?? "—"}
            <span className="text-border">·</span>
            <MapPin className="size-4" /> {job.location ?? "Remote"}
          </p>
          <Badge tone="electric" className="mt-3">{score}% AI match</Badge>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={score} size={64} />
          {applied ? (
            <Button variant="secondary" disabled className="w-full">
              <Check className="size-4" /> Applied
            </Button>
          ) : (
            <Button variant="brand" onClick={apply} disabled={applying} className="w-full">
              {applying ? <Loader2 className="size-4 animate-spin" /> : null} Apply now
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
          <h2 className="font-display text-base font-semibold">About the role</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
            {job.description}
          </p>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-electric/20 bg-electric/5 p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-electric-soft">
              <Sparkles className="size-4" /> Why you match
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              {["Your experience aligns with the core stack", "Strong signal on the key skills", "Location preference is a fit"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5 text-sm text-muted-foreground">
            Applying takes under a minute — your profile and résumé are sent automatically.
          </div>
        </aside>
      </div>
    </div>
  );
}
