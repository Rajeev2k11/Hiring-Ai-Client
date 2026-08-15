"use client";

/**
 * Add a missing email address to a pool candidate.
 *
 * Most discovered profiles arrive without one — GitHub only exposes an address
 * when the developer chose to publish it, and the majority don't. Nothing in
 * the outreach flow can run without an address, so this is the unblocking step:
 * the recruiter pastes one they found legitimately (portfolio, CV, a reply)
 * and the candidate becomes contactable.
 */

import { useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePoolCandidate } from "@/hooks/usePool";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

interface Props {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  /** Called after a successful save, e.g. to open the send-email modal. */
  onSaved?: () => void;
}

export function AddEmailDialog({
  open,
  onClose,
  candidateId,
  candidateName,
  onSaved,
}: Props) {
  const update = useUpdatePoolCandidate();
  const [email, setEmail] = useState("");

  if (!open) return null;

  const valid = EMAIL_RE.test(email.trim());

  const save = async () => {
    if (!valid) {
      toast.error("Enter a valid email address.");
      return;
    }
    try {
      await update.mutateAsync({
        id: candidateId,
        payload: { email: email.trim() },
      });
      toast.success(`Email saved for ${candidateName}.`);
      setEmail("");
      onClose();
      onSaved?.();
    } catch (e) {
      toast.error((e as Error).message || "Could not save the email.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={() => !update.isPending && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/50 text-electric-soft">
              <Mail className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                Add an email for {candidateName}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                GitHub doesn&apos;t publish this person&apos;s address. Add one you
                found through a legitimate source — their portfolio, CV, or a
                profile where they list it publicly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label htmlFor="add-email">Email address</Label>
          <Input
            id="add-email"
            type="email"
            autoFocus
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && valid && save()}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={update.isPending}>
            Cancel
          </Button>
          <Button variant="brand" onClick={save} disabled={!valid || update.isPending}>
            {update.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save email
          </Button>
        </div>
      </div>
    </div>
  );
}
