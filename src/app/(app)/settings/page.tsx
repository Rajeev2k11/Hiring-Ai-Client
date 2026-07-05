"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Monitor, ShieldAlert, Trash2, Mail, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Panel } from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useProfile,
  useSessions,
  useUpdateProfile,
  useUpdateNotifications,
  useChangePassword,
  useRevokeSession,
  useRevokeOtherSessions,
  useDeleteAccount,
} from "@/hooks/useSettings";
import {
  useTeam,
  useInvitations,
  useInviteMember,
  useRevokeInvite,
} from "@/hooks/useTeam";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS, ROLE_OPTIONS } from "@/constants/roles";
import { UserRole } from "@/types";
import { formatRelative } from "@/lib/format";
import { initials } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: sessions } = useSessions();

  const updateProfile = useUpdateProfile();
  const updateNotifications = useUpdateNotifications();
  const changePassword = useChangePassword();
  const revokeSession = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();
  const deleteAccount = useDeleteAccount();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState({ current: "", next: "" });
  const [delPw, setDelPw] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const isAdmin = profile.role === UserRole.ADMIN;

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <PageHeader title="Settings" description="Manage your profile, notifications, and security." />

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6">
          <Panel title="Profile information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={profile.role} disabled />
              </div>
            </div>
            <Button
              variant="brand"
              className="mt-5"
              disabled={updateProfile.isPending}
              onClick={() =>
                updateProfile.mutate(
                  { name, email },
                  {
                    onSuccess: () => toast.success("Profile updated"),
                    onError: (e) => toast.error((e as Error).message),
                  }
                )
              }
            >
              {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </Panel>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Panel title="Notification preferences">
            <div className="space-y-4">
              <ToggleRow
                title="Email updates"
                desc="Product news, tips, and occasional announcements."
                checked={profile.email_updates}
                onChange={(v) =>
                  updateNotifications.mutate({ email_updates: v }, { onSuccess: () => toast.success("Saved"), onError: (e) => toast.error((e as Error).message) })
                }
              />
              <ToggleRow
                title="Application updates"
                desc="Real-time alerts when candidates move through your pipeline."
                checked={profile.application_updates}
                onChange={(v) =>
                  updateNotifications.mutate({ application_updates: v }, { onSuccess: () => toast.success("Saved"), onError: (e) => toast.error((e as Error).message) })
                }
              />
            </div>
          </Panel>
        </TabsContent>

        {/* Team */}
        {isAdmin && (
          <TabsContent value="team" className="mt-6">
            <TeamPanel />
          </TabsContent>
        )}

        {/* Security */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Panel title="Change password">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cpw">Current password</Label>
                <Input id="cpw" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="npw">New password</Label>
                <Input id="npw" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-5"
              disabled={changePassword.isPending}
              onClick={() => {
                if (pw.next.length < 8) return toast.error("New password must be 8+ characters.");
                changePassword.mutate(
                  { current_password: pw.current, new_password: pw.next },
                  {
                    onSuccess: () => {
                      toast.success("Password changed");
                      setPw({ current: "", next: "" });
                    },
                    onError: (e) => toast.error((e as Error).message),
                  }
                );
              }}
            >
              Update password
            </Button>
          </Panel>

          <Panel
            title="Active sessions"
            action={
              <Button variant="outline" size="sm" onClick={() => revokeOthers.mutate(undefined, { onSuccess: (r) => toast.success(`Revoked ${r.revoked} session(s)`), onError: (e) => toast.error((e as Error).message) })}>
                Sign out others
              </Button>
            }
          >
            <div className="space-y-2.5">
              {(sessions ?? []).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-card text-muted-foreground">
                      <Monitor className="size-4" />
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {s.device_label ?? "Unknown device"}
                        {s.is_current && <Badge tone="success">This device</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.location ?? "—"} · active {formatRelative(s.last_active_at)}
                      </p>
                    </div>
                  </div>
                  {!s.is_current && (
                    <Button variant="ghost" size="sm" className="text-red-300" onClick={() => revokeSession.mutate(s.id, { onSuccess: () => toast.success("Session revoked"), onError: (e) => toast.error((e as Error).message) })}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* Danger */}
        <TabsContent value="danger" className="mt-6">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 text-red-300">
              <ShieldAlert className="size-5" />
              <h3 className="font-display text-base font-semibold">Delete account</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently deletes your account and all associated data. This action
              cannot be undone. Enter your password to confirm.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input
                type="password"
                placeholder="Your password"
                value={delPw}
                onChange={(e) => setDelPw(e.target.value)}
                className="sm:max-w-xs"
              />
              <Button
                variant="destructive"
                disabled={deleteAccount.isPending}
                onClick={() => {
                  if (!delPw) return toast.error("Enter your password to confirm.");
                  deleteAccount.mutate(delPw, {
                    onSuccess: () => {
                      toast.success("Account deleted");
                      logout();
                      router.push("/");
                    },
                    onError: (e) => toast.error((e as Error).message),
                  });
                }}
              >
                <Trash2 className="size-4" /> Delete account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-secondary/20 p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function TeamPanel() {
  const { data: members } = useTeam();
  const { data: invites } = useInvitations();
  const invite = useInviteMember();
  const revoke = useRevokeInvite();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(UserRole.RECRUITER);

  const send = async () => {
    if (!EMAIL_RE.test(email.trim())) return toast.error("Enter a valid email.");
    try {
      await invite.mutateAsync({ email: email.trim(), role });
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Invite a team member">
        <p className="text-sm text-muted-foreground">
          They&apos;ll receive an email to accept the invitation and sign in.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="teammate@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <select
              id="invite-role"
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
          <Button variant="brand" onClick={send} disabled={invite.isPending}>
            {invite.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Invite
          </Button>
        </div>
      </Panel>

      {invites && invites.length > 0 && (
        <Panel title="Pending invitations">
          <div className="space-y-2.5">
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
                    className="text-red-300"
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
        </Panel>
      )}

      <Panel title="Team members">
        <div className="space-y-2.5">
          {(members ?? []).map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-3.5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-medium">
                  {initials(m.name)}
                </span>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <Badge tone="neutral">{ROLE_LABELS[m.role] ?? m.role}</Badge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
