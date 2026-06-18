"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Panel } from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { sleep } from "@/lib/utils";

export default function PortalProfilePage() {
  const mounted = useMounted();
  const { identity } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
  });
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Product Design"]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (identity) {
      setForm((f) => ({ ...f, name: identity.name, email: identity.email }));
    }
  }, [identity]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
    setSkillInput("");
  };

  const save = async () => {
    setSaving(true);
    await sleep(800);
    setSaving(false);
    toast.success("Profile saved");
  };

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <PageHeader title="Your Profile" description="Keep this current — better profiles get better AI matches." />

      <div className="mt-8 space-y-6">
        <Panel title="Personal information">
          <div className="flex items-center gap-4 border-b border-border/60 pb-5">
            <UserAvatar
              seed={mounted && identity ? identity.email : "you"}
              name={mounted && identity ? identity.name : undefined}
              size={64}
              className="rounded-2xl border border-border/60"
            />
            <Button variant="outline" size="sm"><Upload className="size-4" /> Change photo</Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input value={form.name} onChange={set("name")} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={set("email")} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></Field>
            <Field label="Location"><Input value={form.location} onChange={set("location")} placeholder="City, Country" /></Field>
            <div className="sm:col-span-2">
              <Field label="Headline"><Input value={form.headline} onChange={set("headline")} placeholder="e.g. Senior Product Designer" /></Field>
            </div>
          </div>
        </Panel>

        <Panel title="About you">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Summary</Label>
          <Textarea className="mt-2" rows={5} value={form.summary} onChange={set("summary")} placeholder="A short summary of your experience and what you're looking for…" />

          <Label className="mt-5 block text-xs uppercase tracking-wider text-muted-foreground">Skills</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full border border-electric/30 bg-electric/10 px-2.5 py-1 text-xs text-electric-soft">
                {s}
                <button onClick={() => setSkills((arr) => arr.filter((x) => x !== s))}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill and press Enter"
              className="max-w-xs"
            />
            <Button variant="secondary" onClick={addSkill}>Add</Button>
          </div>
        </Panel>

        <Panel title="Résumé">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-secondary/20 px-6 py-10 text-center">
            <Upload className="size-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Upload your résumé</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF up to 10MB · parsed automatically by AI</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("Résumé upload is mocked in this preview.")}>
              Choose file
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge tone="success">Verified</Badge> Your profile is visible to recruiters.
          </div>
        </Panel>

        <div className="flex justify-end">
          <Button variant="brand" onClick={save} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />} Save profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
