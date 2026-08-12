"use client";

/**
 * Fill in missing email addresses for many candidates in one pass.
 *
 * Discovered profiles almost never carry an address — GitHub only exposes one
 * when the developer chose to publish it — so a freshly sourced pool is mostly
 * uncontactable. Doing that one dialog at a time is the kind of chore people
 * abandon halfway, which leaves the outreach agent with nobody to write to.
 *
 * So: one screen, every unreachable candidate listed with their profile link
 * open-able in a new tab, one input each, one save. Only rows the recruiter
 * actually typed into are sent.
 */

import { useMemo, useState } from "react";
import { ExternalLink, Loader2, MailPlus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { poolService } from "@/services";
import { useQueryClient } from "@tanstack/react-query";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

export interface BulkEmailCandidate {
  id: string;
  name: string;
  /** Public profile to look the address up on, when there is one. */
  profileUrl?: string | null;
  /** Extra context so two similar names are distinguishable. */
  subtitle?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  candidates: BulkEmailCandidate[];
}

export function BulkAddEmailsDialog({ open, onClose, candidates }: Props) {
  const qc = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const filled = useMemo(
    () =>
      Object.entries(drafts)
        .map(([id, email]) => [id, email.trim()] as const)
        .filter(([, email]) => email.length > 0),
    [drafts]
  );
  const invalid = filled.filter(([, email]) => !EMAIL_RE.test(email));
  const valid = filled.filter(([, email]) => EMAIL_RE.test(email));

  if (!open) return null;

  const close = () => {
    if (saving) return;
    setDrafts({});
    onClose();
  };

  const saveAll = async () => {
    if (!valid.length) return;
    setSaving(true);
    // Settled, not all-or-nothing: one rejected address must not discard the
    // other nineteen the recruiter just typed out.
    const results = await Promise.allSettled(
      valid.map(([id, email]) => poolService.update(id, { email }))
    );
    setSaving(false);

    const saved = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - saved;

    qc.invalidateQueries({ queryKey: ["pool"] });
    qc.invalidateQueries({ queryKey: ["matching"] });

    if (saved) {
      toast.success(
        `${saved} email${saved === 1 ? "" : "s"} saved — those candidates can be contacted now.`
      );
    }
    if (failed) {
      toast.error(`${failed} could not be saved. Their inputs are still here.`);
      // Keep only what failed so the recruiter can retry without retyping.
      const failedIds = new Set(
        results
          .map((r, i) => (r.status === "rejected" ? valid[i][0] : null))
          .filter((id): id is string => id !== null)
      );
      setDrafts((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([id]) => failedIds.has(id)))
      );
      return;
    }
    setDrafts({});
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-email-title"
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border/70 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6 pb-4">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/50 text-electric-soft">
              <MailPlus className="size-5" />
            </span>
            <div>
              <h2 id="bulk-email-title" className="font-display text-base font-semibold">
                Add missing email addresses
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {candidates.length} candidate{candidates.length === 1 ? "" : "s"} can&apos;t
                be contacted yet. Open a profile to find their address, paste it in,
                and save. Fill in as many as you like — blanks are skipped.
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
          <div className="space-y-2.5">
            {candidates.map((c) => {
              const value = drafts[c.id] ?? "";
              const bad = value.trim().length > 0 && !EMAIL_RE.test(value.trim());
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <UserAvatar
                    seed={c.id}
                    name={c.name}
                    size={32}
                    className="shrink-0 border border-border/60"
                  />
                  <div className="min-w-0 w-40 shrink-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    {c.profileUrl ? (
                      <a
                        href={c.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-electric-soft hover:underline"
                      >
                        <ExternalLink className="size-2.5" /> Profile
                      </a>
                    ) : c.subtitle ? (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {c.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      aria-label={`Email for ${c.name}`}
                      aria-invalid={bad}
                      value={value}
                      onChange={(e) =>
                        setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                      className={bad ? "border-red-500/60" : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-6 pt-4">
          <p className="text-xs text-muted-foreground">
            {valid.length} ready to save
            {invalid.length > 0 && (
              <span className="text-red-400">
                {" "}
                · {invalid.length} not a valid address
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={saveAll}
              disabled={saving || valid.length === 0 || invalid.length > 0}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save {valid.length || ""} email{valid.length === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
