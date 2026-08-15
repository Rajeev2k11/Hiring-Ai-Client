"use client";

import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Link2,
  Linkedin,
  Loader2,
  Users,
  MapPin,
  Briefcase,
  MailPlus,
  Pencil,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  usePool,
  useUploadPoolResume,
  useEnrichUrl,
  useDeletePoolCandidate,
  useUpdatePoolCandidate,
} from "@/hooks/usePool";
import { LinkedInImportModal } from "@/components/app/LinkedInImportModal";
import {
  BulkAddEmailsDialog,
  type BulkEmailCandidate,
} from "@/components/app/BulkAddEmailsDialog";
import { SendOutreachModal } from "@/components/app/SendOutreachModal";
import {
  usePersistentState,
  useScrollRestoration,
} from "@/hooks/usePersistentState";
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
  RECRUITER_PROVIDED: { label: "Recruiter added", tone: "success" },
};

export default function TalentPoolPage() {
  const [source, setSource] = usePersistentState("pool:source", "");
  const { data: pool, isLoading } = usePool(source || undefined);
  useScrollRestoration("pool", !isLoading);
  const upload = useUploadPoolResume();
  const enrich = useEnrichUrl();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [linkedInOpen, setLinkedInOpen] = useState(false);
  const removeCandidate = useDeletePoolCandidate();
  const [pendingDelete, setPendingDelete] = useState<PoolCandidate | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [outreachTarget, setOutreachTarget] = useState<PoolCandidate | null>(null);

  // Sourced profiles usually arrive with no address, which makes them
  // invisible to every outreach flow until someone fills one in.
  const needEmail = useMemo<BulkEmailCandidate[]>(
    () =>
      (pool ?? [])
        .filter((c) => !c.email)
        .map((c) => ({
          id: c.id,
          name: c.name,
          profileUrl: c.source_url,
          subtitle: c.current_title,
        })),
    [pool]
  );

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

  const onConfirmDelete = () => {
    if (!pendingDelete) return;
    const { id, name } = pendingDelete;
    removeCandidate.mutate(id, {
      onSuccess: () => {
        toast.success(`${name} removed from your pool.`);
        setPendingDelete(null);
      },
      // A 409 here is the backend refusing because the candidate has live
      // applications — surface that reason rather than a generic failure.
      onError: (e) => toast.error((e as Error).message || "Could not remove candidate."),
    });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Sourcing"
        title="Talent Pool"
        description="Build your searchable candidate database. Upload résumés or import from a URL — the AI extracts a structured profile and makes them matchable."
        actions={
          <div className="flex flex-wrap gap-2">
            {needEmail.length > 0 && (
              <Button variant="brand" onClick={() => setBulkEmailOpen(true)}>
                <MailPlus className="size-4" /> Add {needEmail.length} missing email
                {needEmail.length === 1 ? "" : "s"}
              </Button>
            )}
            <Button variant="outline" onClick={() => setLinkedInOpen(true)}>
              <Linkedin className="size-4" /> Add LinkedIn candidate manually
            </Button>
          </div>
        }
      />

      <LinkedInImportModal open={linkedInOpen} onClose={() => setLinkedInOpen(false)} />

      <BulkAddEmailsDialog
        open={bulkEmailOpen}
        onClose={() => setBulkEmailOpen(false)}
        candidates={needEmail}
      />

      {/* No jobId: there is no role in context here, so the modal asks first. */}
      <SendOutreachModal
        open={outreachTarget !== null}
        onClose={() => setOutreachTarget(null)}
        candidateId={outreachTarget?.id ?? ""}
        candidateName={outreachTarget?.name}
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
          pool.map((c) =>
            editingId === c.id ? (
              <PoolEditCard
                key={c.id}
                candidate={c}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <PoolCard
                key={c.id}
                candidate={c}
                onEdit={() => setEditingId(c.id)}
                onDelete={() => setPendingDelete(c)}
                onEmail={() => setOutreachTarget(c)}
              />
            )
          )
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove from talent pool?"
        description={
          <>
            <strong className="text-foreground">{pendingDelete?.name}</strong> and their
            extracted profile will be permanently deleted, and they will stop appearing
            in AI match results. This cannot be undone.
          </>
        }
        confirmLabel="Remove candidate"
        pending={removeCandidate.isPending}
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

/** Inline correction form for an AI-extracted profile. */
function PoolEditCard({
  candidate: c,
  onDone,
}: {
  candidate: PoolCandidate;
  onDone: () => void;
}) {
  const update = useUpdatePoolCandidate();
  const [form, setForm] = useState({
    name: c.name,
    current_title: c.current_title ?? "",
    current_company: c.current_company ?? "",
    location: c.location ?? "",
    email: c.email ?? "",
    experience_years: c.experience_years?.toString() ?? "",
    summary: c.summary ?? "",
    skills: (c.skills ?? [])
      .map((s) => (typeof s === "string" ? s : (s as CandidateSkill).name))
      .join(", "),
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    try {
      await update.mutateAsync({
        id: c.id,
        payload: {
          name: form.name.trim(),
          current_title: form.current_title.trim() || null,
          current_company: form.current_company.trim() || null,
          location: form.location.trim() || null,
          email: form.email.trim() || null,
          experience_years: form.experience_years ? Number(form.experience_years) : null,
          summary: form.summary.trim() || null,
          // Sent as plain strings; the extractor's confidence/evidence metadata
          // no longer applies once a human has corrected the value by hand.
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      toast.success(`${form.name.trim()} updated.`);
      onDone();
    } catch (e) {
      toast.error((e as Error).message || "Could not save changes.");
    }
  };

  return (
    <div className="rounded-2xl border border-electric/40 bg-card/60 p-4">
      <p className="text-sm font-semibold">Edit profile</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Corrections here update the candidate&apos;s match embedding too.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Email" value={form.email} onChange={set("email")} />
        <Field label="Current title" value={form.current_title} onChange={set("current_title")} />
        <Field label="Company" value={form.current_company} onChange={set("current_company")} />
        <Field label="Location" value={form.location} onChange={set("location")} />
        <Field
          label="Years of experience"
          type="number"
          value={form.experience_years}
          onChange={set("experience_years")}
        />
      </div>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor={`skills-${c.id}`}>Skills (comma separated)</Label>
        <Input
          id={`skills-${c.id}`}
          value={form.skills}
          onChange={(e) => set("skills")(e.target.value)}
        />
      </div>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor={`summary-${c.id}`}>Summary</Label>
        <Textarea
          id={`summary-${c.id}`}
          rows={4}
          value={form.summary}
          onChange={(e) => set("summary")(e.target.value)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="brand" size="sm" onClick={save} disabled={update.isPending}>
          {update.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save changes
        </Button>
        <Button variant="ghost" size="sm" onClick={onDone} disabled={update.isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PoolCard({
  candidate: c,
  onEdit,
  onDelete,
  onEmail,
}: {
  candidate: PoolCandidate;
  onEdit: () => void;
  onDelete: () => void;
  onEmail: () => void;
}) {
  const meta = SOURCE_META[c.source_type] ?? { label: c.source_type, tone: "neutral" as Tone };
  const skills = (c.skills ?? []).map((s) =>
    typeof s === "string" ? s : (s as CandidateSkill).name
  );

  return (
    <div className="group rounded-2xl border border-border/70 bg-card/40 p-4">
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

        <div className="flex shrink-0 items-start gap-1">
          {/* Always visible: emailing is the point of building a pool, and
              hiding it behind hover makes it undiscoverable. */}
          <Button
            variant={c.email ? "brand" : "outline"}
            size="sm"
            onClick={onEmail}
            disabled={!c.email}
            title={
              c.email
                ? "Pick a role, preview and send"
                : "Add an email address first"
            }
          >
            <Send className="size-4" /> Email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            onClick={onEdit}
            aria-label={`Edit ${c.name}`}
            title="Edit profile"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-300 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-red-200 focus:opacity-100 group-hover:opacity-100"
            onClick={onDelete}
            aria-label={`Remove ${c.name}`}
            title="Remove from pool"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
