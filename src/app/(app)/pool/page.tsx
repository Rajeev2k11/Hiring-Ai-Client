"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Link2,
  Loader2,
  Users,
  MapPin,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { usePool, useUploadPoolResume, useEnrichUrl } from "@/hooks/usePool";
import { cn } from "@/lib/utils";
import type { Tone } from "@/constants/status";
import type { CandidateSkill, PoolCandidate } from "@/types";

const SOURCE_FILTERS = [
  { label: "All", value: "" },
  { label: "Uploaded", value: "INTERNAL" },
  { label: "GitHub", value: "GITHUB" },
  { label: "Portfolio", value: "PORTFOLIO" },
];

const SOURCE_META: Record<string, { label: string; tone: Tone }> = {
  INTERNAL: { label: "Uploaded", tone: "electric" },
  GITHUB: { label: "GitHub", tone: "info" },
  PORTFOLIO: { label: "Portfolio", tone: "plasma" },
  PUBLIC_WEB: { label: "Web", tone: "neutral" },
  ATS_IMPORT: { label: "ATS", tone: "neutral" },
};

export default function TalentPoolPage() {
  const [source, setSource] = useState("");
  const { data: pool, isLoading } = usePool(source || undefined);
  const upload = useUploadPoolResume();
  const enrich = useEnrichUrl();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");

  const onFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const c = await upload.mutateAsync(file);
      toast.success(`Added ${c.name} to the pool.`);
    } catch (e) {
      toast.error((e as Error).message || "Upload failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onEnrich = async () => {
    if (!url.trim()) return;
    try {
      const c = await enrich.mutateAsync(url.trim());
      toast.success(`Added ${c.name} from URL.`);
      setUrl("");
    } catch (e) {
      toast.error((e as Error).message || "Could not enrich from URL.");
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Sourcing"
        title="Talent Pool"
        description="Build your searchable candidate database. Upload résumés or import from a URL — the AI extracts a structured profile and makes them matchable."
      />

      {/* Ingestion */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Resume upload */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
            {upload.isPending ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
          </span>
          <p className="mt-3 text-sm font-semibold">Upload a résumé</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF · drag & drop or browse</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => fileRef.current?.click()}
            disabled={upload.isPending}
          >
            Choose file
          </Button>
        </div>

        {/* URL enrich */}
        <div className="flex flex-col justify-center rounded-2xl border border-border/70 bg-card/30 p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-plasma-soft">
              <Link2 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Import from a URL</p>
              <p className="text-xs text-muted-foreground">Portfolio or public profile</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onEnrich()}
            />
            <Button variant="brand" onClick={onEnrich} disabled={enrich.isPending || !url.trim()}>
              {enrich.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          Candidates
          {pool?.length ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">{pool.length}</span>
          ) : null}
        </h2>
        <div className="flex gap-1.5">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSource(f.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                source === f.value
                  ? "border-electric/50 bg-electric/10 text-electric-soft"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : !pool?.length ? (
          <EmptyState
            icon={Users}
            title="Your pool is empty"
            description="Upload a résumé or import a profile URL to start building your searchable talent database."
          />
        ) : (
          pool.map((c) => <PoolCard key={c.id} candidate={c} />)
        )}
      </div>
    </div>
  );
}

function PoolCard({ candidate: c }: { candidate: PoolCandidate }) {
  const meta = SOURCE_META[c.source_type] ?? { label: c.source_type, tone: "neutral" as Tone };
  const skills = (c.skills ?? []).map((s) =>
    typeof s === "string" ? s : (s as CandidateSkill).name
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
      <div className="flex items-start gap-3.5">
        <UserAvatar seed={c.id} name={c.name} size={44} className="border border-border/60" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{c.name}</span>
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {c.current_title && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="size-3" />
                {c.current_title}
                {c.current_company ? ` · ${c.current_company}` : ""}
              </span>
            )}
            {c.experience_years != null && <span>{c.experience_years} yrs exp</span>}
            {c.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {c.location}
              </span>
            )}
          </div>
          {c.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{c.summary}</p>
          )}
          {skills.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {skills.slice(0, 10).map((s) => (
                <Badge key={s} tone="neutral">{s}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
