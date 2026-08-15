"use client";

/**
 * Settings → Email: connect the company mailbox used for candidate outreach.
 *
 * SMTP sends the mail (so it comes from the company's real address); IMAP is
 * optional and only needed to pull candidate replies back into Hiring OS.
 * Passwords are write-only — the backend never returns them, so an existing
 * account shows blank password fields meaning "keep what's stored".
 */

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mail, Plug, RefreshCw, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/app/Panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteEmailAccount,
  useEmailAccount,
  useSaveEmailAccount,
  useTestEmailAccount,
} from "@/hooks/useOutreach";
import { formatRelative } from "@/lib/format";

/** Common providers — fills the host/port fields so recruiters don't guess. */
const PRESETS = [
  { label: "Gmail", smtp_host: "smtp.gmail.com", smtp_port: 587, imap_host: "imap.gmail.com", imap_port: 993 },
  { label: "Outlook", smtp_host: "smtp-mail.outlook.com", smtp_port: 587, imap_host: "outlook.office365.com", imap_port: 993 },
  { label: "Zoho", smtp_host: "smtp.zoho.com", smtp_port: 587, imap_host: "imap.zoho.com", imap_port: 993 },
];

const EMPTY = {
  from_name: "",
  from_email: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  smtp_use_tls: true,
  smtp_use_ssl: false,
  imap_host: "",
  imap_port: 993,
  imap_username: "",
  imap_password: "",
  imap_use_ssl: true,
  imap_folder: "INBOX",
};

export function EmailIntegrationPanel() {
  const { data: account, isLoading } = useEmailAccount();
  const save = useSaveEmailAccount();
  const test = useTestEmailAccount();
  const remove = useDeleteEmailAccount();

  const [form, setForm] = useState({ ...EMPTY });

  // Prefill from the saved account (never passwords — those stay server-side).
  useEffect(() => {
    if (!account) return;
    setForm({
      from_name: account.from_name,
      from_email: account.from_email,
      smtp_host: account.smtp_host,
      smtp_port: account.smtp_port,
      smtp_username: account.smtp_username,
      smtp_password: "",
      smtp_use_tls: account.smtp_use_tls,
      smtp_use_ssl: account.smtp_use_ssl,
      imap_host: account.imap_host ?? "",
      imap_port: account.imap_port,
      imap_username: account.imap_username ?? "",
      imap_password: "",
      imap_use_ssl: account.imap_use_ssl,
      imap_folder: account.imap_folder,
    });
  }, [account]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const applyPreset = (preset: (typeof PRESETS)[number]) =>
    setForm((f) => ({
      ...f,
      smtp_host: preset.smtp_host,
      smtp_port: preset.smtp_port,
      imap_host: preset.imap_host,
      imap_port: preset.imap_port,
    }));

  const onSave = async () => {
    if (!form.from_name.trim() || !form.from_email.trim() || !form.smtp_host.trim()) {
      toast.error("Sender name, sender email and SMTP host are required.");
      return;
    }
    if (!account && !form.smtp_password) {
      toast.error("Enter the SMTP password (use an App Password for Gmail/Outlook).");
      return;
    }
    try {
      await save.mutateAsync({
        ...form,
        smtp_username: form.smtp_username || form.from_email,
        smtp_password: form.smtp_password || null,
        imap_host: form.imap_host || null,
        imap_username: form.imap_username || form.smtp_username || form.from_email,
        imap_password: form.imap_password || null,
      });
      toast.success("Email account connected and verified");
      setForm((f) => ({ ...f, smtp_password: "", imap_password: "" }));
    } catch (e) {
      toast.error((e as Error).message || "Could not connect the email account.");
    }
  };

  const onTest = async () => {
    try {
      await test.mutateAsync();
      toast.success("Connection is working");
    } catch (e) {
      toast.error((e as Error).message || "Connection test failed.");
    }
  };

  const onDisconnect = async () => {
    if (!window.confirm("Disconnect this mailbox? Sent history and replies are kept.")) return;
    try {
      await remove.mutateAsync();
      setForm({ ...EMPTY });
      toast.success("Email account disconnected");
    } catch (e) {
      toast.error((e as Error).message || "Could not disconnect.");
    }
  };

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  return (
    <Panel
      title="Outreach email account"
      action={
        account ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onTest} disabled={test.isPending}>
              {test.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              Test
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisconnect} disabled={remove.isPending}>
              <Trash2 className="size-3.5" /> Disconnect
            </Button>
          </div>
        ) : undefined
      }
    >
      {/* Status */}
      {account && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {account.status === "CONNECTED" ? (
            <Badge tone="success">
              <CheckCircle2 className="mr-1 inline size-3" /> Connected
            </Badge>
          ) : (
            <Badge tone="danger">
              <TriangleAlert className="mr-1 inline size-3" /> {account.status}
            </Badge>
          )}
          {account.reply_tracking_enabled ? (
            <Badge tone="electric">Reply tracking on</Badge>
          ) : (
            <Badge tone="warning">Send only — add IMAP to see replies</Badge>
          )}
          {account.last_polled_at && (
            <span className="text-xs text-muted-foreground">
              Inbox checked {formatRelative(account.last_polled_at)}
            </span>
          )}
          {account.last_error && (
            <p className="w-full text-xs text-red-400">{account.last_error}</p>
          )}
        </div>
      )}

      <p className="mb-4 text-sm text-muted-foreground">
        Outreach is sent from your own mailbox, so candidates see your company as the sender
        and replies land in your real inbox. Add IMAP details to have those replies show up here.
      </p>

      {/* Presets */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Quick fill:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-electric/40 hover:text-foreground"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* Sender identity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="from_name">Sender name</Label>
            <Input
              id="from_name"
              placeholder="Acme Talent Team"
              value={form.from_name}
              onChange={(e) => set("from_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="from_email">Sender email</Label>
            <Input
              id="from_email"
              type="email"
              placeholder="careers@acme.com"
              value={form.from_email}
              onChange={(e) => set("from_email", e.target.value)}
            />
          </div>
        </div>

        {/* SMTP */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Mail className="size-3.5" /> SMTP — sending
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="smtp_host">Host</Label>
              <Input id="smtp_host" value={form.smtp_host} onChange={(e) => set("smtp_host", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp_port">Port</Label>
              <Input
                id="smtp_port"
                type="number"
                value={form.smtp_port}
                onChange={(e) => set("smtp_port", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp_username">Username</Label>
              <Input
                id="smtp_username"
                placeholder="Defaults to the sender email"
                value={form.smtp_username}
                onChange={(e) => set("smtp_username", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp_password">Password</Label>
              <Input
                id="smtp_password"
                type="password"
                placeholder={account ? "Leave blank to keep saved password" : "App Password"}
                value={form.smtp_password}
                onChange={(e) => set("smtp_password", e.target.value)}
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={form.smtp_use_ssl}
              onChange={(e) => {
                set("smtp_use_ssl", e.target.checked);
                set("smtp_use_tls", !e.target.checked);
              }}
              className="size-3.5 accent-current"
            />
            Use implicit SSL (port 465). Leave off for STARTTLS on port 587.
          </label>
        </div>

        {/* IMAP */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            IMAP — reading replies (optional)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="imap_host">Host</Label>
              <Input
                id="imap_host"
                placeholder="Leave blank to send only"
                value={form.imap_host}
                onChange={(e) => set("imap_host", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imap_port">Port</Label>
              <Input
                id="imap_port"
                type="number"
                value={form.imap_port}
                onChange={(e) => set("imap_port", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imap_username">Username</Label>
              <Input
                id="imap_username"
                placeholder="Defaults to the SMTP username"
                value={form.imap_username}
                onChange={(e) => set("imap_username", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imap_password">Password</Label>
              <Input
                id="imap_password"
                type="password"
                placeholder={account ? "Leave blank to keep saved password" : "App Password"}
                value={form.imap_password}
                onChange={(e) => set("imap_password", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Gmail / Outlook:</strong> use an{" "}
          <em>App Password</em>, not your normal login password (2-Step Verification must be on).
        </div>

        <Button variant="brand" onClick={onSave} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plug className="size-4" />}
          {account ? "Save & re-verify" : "Connect & verify"}
        </Button>
      </div>
    </Panel>
  );
}
