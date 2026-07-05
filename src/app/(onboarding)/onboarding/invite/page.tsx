"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Plus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { OnboardingSteps } from "@/components/app/OnboardingSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useInvitations,
  useInviteMember,
  useResendInvite,
  useRevokeInvite,
} from "@/hooks/useTeam";
import { useCompleteSetup, useSkipTeam } from "@/hooks/useCompany";
import { ROLE_LABELS, ROLE_OPTIONS } from "@/constants/roles";
import { UserRole } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteTeamPage() {
  const router = useRouter();
  const { data: invites } = useInvitations();
  const invite = useInviteMember();
  const revoke = useRevokeInvite();
  const resend = useResendInvite();
  const skipTeam = useSkipTeam();
  const complete = useCompleteSetup();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(UserRole.RECRUITER);

  const sendInvite = async () => {
    if (!EMAIL_RE.test(email.trim())) return toast.error("Enter a valid email.");
    try {
      await invite.mutateAsync({ email: email.trim(), role });
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const finishing = complete.isPending || skipTeam.isPending;

  const finish = async (skip: boolean) => {
    try {
      if (skip) await skipTeam.mutateAsync();
      await complete.mutateAsync();
      router.push("/dashboard");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <OnboardingSteps current="invite" />

      <h1 className="mt-8 font-display text-2xl font-bold tracking-tight">
        Invite your team
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Add recruiters, hiring managers, and interviewers. They&apos;ll get an
        email to accept the invitation and join your workspace. You can do this
        later from Settings.
      </p>

      <div className="mt-8 rounded-2xl border border-border/70 bg-card/40 p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              placeholder="teammate@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none sm:w-48"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value} className="bg-popover">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="secondary" onClick={sendInvite} disabled={invite.isPending}>
            {invite.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Invite
          </Button>
        </div>

        {invites && invites.length > 0 && (
          <div className="mt-6 space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pending invitations
            </p>
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-border/60 bg-card text-muted-foreground">
                    <Mail className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_LABELS[inv.role] ?? inv.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="warning">{inv.status}</Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Resend invitation"
                    onClick={() =>
                      resend.mutate(inv.id, {
                        onSuccess: () => toast.success("Invitation resent"),
                        onError: (e) => toast.error((e as Error).message),
                      })
                    }
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-red-300"
                    title="Revoke invitation"
                    onClick={() =>
                      revoke.mutate(inv.id, {
                        onSuccess: () => toast.success("Invitation revoked"),
                        onError: (e) => toast.error((e as Error).message),
                      })
                    }
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => finish(true)} disabled={finishing}>
          Skip for now
        </Button>
        <Button variant="brand" onClick={() => finish(false)} disabled={finishing}>
          {finishing && <Loader2 className="size-4 animate-spin" />}
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
