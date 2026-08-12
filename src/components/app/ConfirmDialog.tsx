"use client";

/**
 * Confirmation gate for destructive actions.
 *
 * Deleting a role or a pool candidate wipes records the recruiter cannot get
 * back, so every such action routes through here rather than firing on click.
 * `requireTyping` raises the bar further for the truly unrecoverable ones: the
 * recruiter has to type the record's name, which makes an accidental
 * confirm-by-reflex impossible.
 */

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** What exactly is about to happen, including anything deleted alongside. */
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When set, the confirm button unlocks only once this text is typed back. */
  requireTyping?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  requireTyping,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");

  // Start each opening from a clean slate — a stale confirmation typed for a
  // previous record must never carry over and unlock this one.
  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const unlocked =
    !requireTyping || typed.trim().toLowerCase() === requireTyping.trim().toLowerCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={() => !pending && onCancel()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-destructive/30 bg-destructive/10 text-red-300">
            <AlertTriangle className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-dialog-title" className="font-display text-base font-semibold">
              {title}
            </h2>
            <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          </div>
        </div>

        {requireTyping && (
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="confirm-typing">
              Type <span className="font-semibold text-foreground">{requireTyping}</span> to confirm
            </Label>
            <Input
              id="confirm-typing"
              autoFocus
              autoComplete="off"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && unlocked && !pending) onConfirm();
              }}
              placeholder={requireTyping}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={pending || !unlocked}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
