"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Check,
  FileText,
  Loader2,
  MapPin,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/app/StatusBadge";
import { usePortalJob, useMyApplicationForJob } from "@/hooks/usePortal";
import { useApplyToJob, useEvaluateApplication } from "@/hooks/useApplications";
import { useResume, useUploadResume } from "@/hooks/useResume";
import { useAppSelector } from "@/store/hooks";
import { APPLICATION_STATUS_META } from "@/constants/status";
import { formatDate } from "@/lib/format";

export default function PortalJobDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading } = usePortalJob(id);

  const identity = useAppSelector((s) => s.auth.identity);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const applyMutation = useApplyToJob();
  const uploadResume = useUploadResume();
  const evaluate = useEvaluateApplication();

  // Has this candidate already applied to this job? (+ did they send a résumé?)
  const { data: myApp } = useMyApplicationForJob(id);
  const { data: resume } = useResume(myApp?.id ?? "", Boolean(myApp?.id));

  const [applied, setApplied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const submitting = applyMutation.isPending || uploadResume.isPending;
  const alreadyApplied = applied || Boolean(myApp);
  const resumeSent = Boolean(resume);

  if (isLoading || !job) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const pickFile = (f: File | null) => {
    if (f && f.type !== "application/pdf") {
      toast.error("Please choose a PDF résumé.");
      return;
    }
    setFile(f);
  };

  const apply = async () => {
    if (!isAuthenticated || !identity) {
      toast.error("Please sign in as a candidate to apply.");
      router.push("/candidate/login");
      return;
    }

    try {
      const application = await applyMutation.mutateAsync({
        jobId: job.id,
        payload: {
          candidate_name: identity.name,
          candidate_email: identity.email,
        },
      });

      if (file) {
        await uploadResume.mutateAsync({ applicationId: application.id, file });
        // Kick off AI evaluation (best-effort: needs extracted résumé text and a
        // configured AI key — recruiters can otherwise run it manually later).
        try {
          await evaluate.mutateAsync(application.id);
        } catch {
          /* non-fatal */
        }
      }

      setApplied(true);
      toast.success(
        file ? "Application + résumé submitted!" : "Application submitted!"
      );
    } catch (e) {
      toast.error((e as Error).message || "Could not submit application");
    }
  };

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <Link
        href="/portal/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
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
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-center">
          {alreadyApplied ? (
            <Button variant="secondary" disabled className="w-full">
              <Check className="size-4" /> Applied
            </Button>
          ) : (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
                disabled={submitting}
                className="w-full"
              >
                {file ? (
                  <>
                    <FileText className="size-4" /> {truncate(file.name)}
                  </>
                ) : (
                  <>
                    <Upload className="size-4" /> Attach résumé (PDF)
                  </>
                )}
              </Button>
              <Button
                variant="brand"
                onClick={apply}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Apply now
              </Button>
            </>
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
          {myApp ? (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Check className="size-4" /> You've applied to this role
              </p>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd><StatusBadge value={myApp.status} meta={APPLICATION_STATUS_META} /></dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Applied</dt>
                  <dd className="font-medium">{formatDate(myApp.created_at)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Résumé</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    {resumeSent ? (
                      <><FileText className="size-3.5 text-emerald-400" /> Sent</>
                    ) : (
                      <span className="text-muted-foreground">Not attached</span>
                    )}
                  </dd>
                </div>
              </dl>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/portal/applications">View my applications</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
              <p className="text-sm font-semibold">How applying works</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" /> Attach your résumé as a PDF (optional).
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" /> We send your profile to the hiring team.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" /> Track status under "My Applications".
                </li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function truncate(name: string, max = 22) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}
