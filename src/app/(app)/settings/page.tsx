"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Lock,
  Mail,
  Monitor,
  Pencil,
  PauseCircle,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Unplug,
  UserPlus,
  X,
} from "lucide-react";
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
import {
  useGoogleStatus,
  useConnectGoogle,
  useDisconnectGoogle,
} from "@/hooks/useIntegrations";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, ROLE_OPTIONS } from "@/constants/roles";
import { UserRole } from "@/types";

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

  // Profile
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Security
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Danger Zone
  const [deleteStep, setDeleteStep] = useState<"idle" | "otp" | "password">("idle");
  const [otp, setOtp] = useState("");
  const [delPw, setDelPw] = useState("");
  const [showDelPw, setShowDelPw] = useState(false);

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

  const handleSaveProfile = () => {
    updateProfile.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          setEditing(false);
        },
        onError: (e) => toast.error((e as Error).message),
      }
    );
  };

  const handleChangePassword = () => {
    if (pw.next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return toast.error("Passwords do not match.");
    changePassword.mutate(
      { current_password: pw.current, new_password: pw.next },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          setPw({ current: "", next: "", confirm: "" });
          setShowPwForm(false);
        },
        onError: (e) => toast.error((e as Error).message),
      }
    );
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      setDeleteStep("password");
      setOtp("");
    } else {
      toast.error("Invalid OTP. Please enter 1234.");
    }
  };

  const handlePermanentDelete = () => {
    if (!delPw) return toast.error("Enter your password to confirm.");
    deleteAccount.mutate(delPw, {
      onSuccess: () => {
        toast.success("Account permanently deleted");
        logout();
        router.push("/");
      },
      onError: (e) => toast.error((e as Error).message),
    });
  };

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <PageHeader title="Settings" description="Manage your profile, notifications, and security." />

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* ─── Profile ─── */}
        <TabsContent value="profile" className="mt-6">
          <Panel
            title="Profile information"
            action={
              !editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
              ) : undefined
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="cursor-not-allowed opacity-60"
                />
                <p className="text-[11px] text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={profile.role} disabled />
              </div>
            </div>
            {editing && (
              <div className="mt-5 flex gap-2">
                <Button
                  variant="brand"
                  disabled={updateProfile.isPending}
                  onClick={handleSaveProfile}
                >
                  {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
                  Save changes
                </Button>
                <Button variant="ghost" onClick={() => { setEditing(false); setName(profile.name); }}>
                  Cancel
                </Button>
              </div>
            )}
          </Panel>
        </TabsContent>

        {/* ─── Notifications ─── */}
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

        {/* ─── Integrations ─── */}
        <TabsContent value="integrations" className="mt-6">
          <GoogleIntegrationPanel />
        </TabsContent>

        {/* ─── Team ─── */}
        {isAdmin && (
          <TabsContent value="team" className="mt-6">
            <TeamPanel />
          </TabsContent>
        )}

        {/* ─── Security ─── */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Panel title="Password">
            {!showPwForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
                <Button variant="secondary" onClick={() => setShowPwForm(true)}>
                  <Lock className="size-4" /> Update your password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cpw">Current password</Label>
                  <PasswordInput
                    id="cpw"
                    value={pw.current}
                    onChange={(e) => setPw({ ...pw, current: e.target.value })}
                    show={showCurrent}
                    onToggle={() => setShowCurrent((v) => !v)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="npw">New password</Label>
                  <PasswordInput
                    id="npw"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    show={showNew}
                    onToggle={() => setShowNew((v) => !v)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cpw2">Confirm new password</Label>
                  <PasswordInput
                    id="cpw2"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="text-sm text-electric-soft hover:underline"
                    onClick={() => toast.info("Password reset email would be sent.")}
                  >
                    Forgot your password?
                  </button>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => { setShowPwForm(false); setPw({ current: "", next: "", confirm: "" }); }}>
                      Cancel
                    </Button>
                    <Button
                      variant="brand"
                      disabled={changePassword.isPending}
                      onClick={handleChangePassword}
                    >
                      {changePassword.isPending && <Loader2 className="size-4 animate-spin" />}
                      Change password
                    </Button>
                  </div>
                </div>
              </div>
            )}
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

        {/* ─── Danger Zone ─── */}
        <TabsContent value="danger" className="mt-6 space-y-6">
          {/* Temporarily Deactivate */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <div className="flex items-center gap-2 text-amber-400">
              <PauseCircle className="size-5" />
              <h3 className="font-display text-base font-semibold">Temporarily Deactivate</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Temporarily deactivate your account. Your data will be preserved and you can
              reactivate anytime by logging back in.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              onClick={() => toast.info("Temporary deactivation is not available yet. Coming soon!")}
            >
              <PauseCircle className="size-4" /> Deactivate account
            </Button>
          </div>

          {/* Permanent Delete */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 text-red-300">
              <ShieldAlert className="size-5" />
              <h3 className="font-display text-base font-semibold">Permanently Delete Account</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently deletes your account and all associated data. This action
              cannot be undone. You will need to verify with OTP and your password.
            </p>

            {deleteStep === "idle" && (
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => setDeleteStep("otp")}
              >
                <Trash2 className="size-4" /> Delete account permanently
              </Button>
            )}

            {deleteStep === "otp" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangle className="size-4 text-amber-400" />
                    OTP Verification
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the verification code sent to your email.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="max-w-[200px]"
                      maxLength={4}
                    />
                    <Button variant="secondary" onClick={handleVerifyOtp}>
                      Verify
                    </Button>
                    <Button variant="ghost" onClick={() => { setDeleteStep("idle"); setOtp(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {deleteStep === "password" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-300">
                    <ShieldAlert className="size-4" />
                    Final confirmation — Enter your password
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This is irreversible. Your account and all data will be permanently deleted.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <div className="relative max-w-xs flex-1">
                      <Input
                        type={showDelPw ? "text" : "password"}
                        placeholder="Your password"
                        value={delPw}
                        onChange={(e) => setDelPw(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDelPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showDelPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <Button
                      variant="destructive"
                      disabled={deleteAccount.isPending}
                      onClick={handlePermanentDelete}
                    >
                      {deleteAccount.isPending && <Loader2 className="size-4 animate-spin" />}
                      <Trash2 className="size-4" /> Delete forever
                    </Button>
                    <Button variant="ghost" onClick={() => { setDeleteStep("idle"); setDelPw(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Helper components ─── */

function PasswordInput({
  id,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
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

function GoogleIntegrationPanel() {
  const { data: status, isLoading, isFetching, refetch } = useGoogleStatus();
  const connect = useConnectGoogle();
  const disconnect = useDisconnectGoogle();

  return (
    <Panel
      title="Google Calendar & Meet"
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        Connect a Google account to auto-generate Google Meet links and place
        interview events on its calendar when scheduling.
      </p>

      {isLoading || !status ? (
        <Skeleton className="mt-4 h-20 w-full rounded-xl" />
      ) : !status.oauth_configured ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-amber-300">OAuth not configured</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              The server is missing its Google OAuth client credentials. Add
              GOOGLE_OAUTH_CLIENT_ID / SECRET / REDIRECT_URI to the backend
              environment and restart it.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border/50 bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-lg border",
                status.connected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-border/60 bg-card text-muted-foreground"
              )}
            >
              {status.connected ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Link2 className="size-5" />
              )}
            </span>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                {status.connected ? "Connected" : "Not connected"}
                {status.connected && <Badge tone="success">Active</Badge>}
              </p>
              <p className="text-xs text-muted-foreground">
                {status.connected && status.connected_email
                  ? status.connected_email
                  : "No Google account linked yet."}
              </p>
            </div>
          </div>

          {status.connected ? (
            <Button
              variant="outline"
              size="sm"
              disabled={disconnect.isPending}
              onClick={() =>
                disconnect.mutate(undefined, {
                  onSuccess: () => toast.success("Google account disconnected"),
                  onError: (e) => toast.error((e as Error).message),
                })
              }
            >
              {disconnect.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Unplug className="size-4" />
              )}
              Disconnect
            </Button>
          ) : (
            <Button
              variant="brand"
              size="sm"
              disabled={connect.isPending}
              onClick={() =>
                connect.mutate(undefined, {
                  onSuccess: () =>
                    toast.success(
                      "Opened Google sign-in in a new tab. Approve access, then return here."
                    ),
                  onError: (e) => toast.error((e as Error).message),
                })
              }
            >
              {connect.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Connect Google
            </Button>
          )}
        </div>
      )}
    </Panel>
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
