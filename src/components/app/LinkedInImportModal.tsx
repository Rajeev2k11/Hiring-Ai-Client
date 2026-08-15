"use client";

/**
 * "Add LinkedIn candidate manually" — consented-profile import.
 *
 * COMPLIANCE: this form only captures data the recruiter already holds a lawful
 * basis for. The profile URL is stored as a reference; Hiring OS never fetches,
 * crawls or scrapes LinkedIn, and no LinkedIn session/cookie is ever involved.
 */

import { useState } from "react";
import { Loader2, Plus, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useImportLinkedInCandidate } from "@/hooks/usePool";
import { cn } from "@/lib/utils";

const LINKEDIN_HOST = /^https?:\/\/([a-z0-9-]+\.)*linkedin\.com\//i;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LinkedInImportModal({ open, onClose }: Props) {
  const importCandidate = useImportLinkedInCandidate();

  const [profileUrl, setProfileUrl] = useState("");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [consent, setConsent] = useState(false);

  if (!open) return null;

  const reset = () => {
    setProfileUrl("");
    setName("");
    setHeadline("");
    setLocation("");
    setExperience("");
    setSummary("");
    setEmail("");
    setSkills([]);
    setSkillDraft("");
    setConsent(false);
  };

  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value) return;
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSkillDraft("");
  };

  const urlValid = LINKEDIN_HOST.test(profileUrl.trim());
  const canSubmit = urlValid && name.trim().length > 0 && consent;

  const submit = async () => {
    if (!urlValid) {
      toast.error("The profile URL must be a linkedin.com address.");
      return;
    }
    if (!name.trim()) {
      toast.error("Candidate name is required.");
      return;
    }
    if (!consent) {
      toast.error("Confirm the lawful basis before importing.");
      return;
    }
    try {
      const created = await importCandidate.mutateAsync({
        profile_url: profileUrl.trim(),
        name: name.trim(),
        headline: headline.trim() || null,
        location: location.trim() || null,
        experience_years: experience ? Number(experience) : null,
        skills,
        summary: summary.trim() || null,
        email: email.trim() || null,
        consent_confirmed: consent,
      });
      toast.success(`${created.name} added to your talent pool`);
      reset();
      onClose();
    } catch (e) {
      toast.error((e as Error).message || "Could not import this candidate.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Add LinkedIn candidate manually</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              For candidates whose data you already hold a lawful basis to store.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Compliance notice — this flow never touches LinkedIn */}
        <div className="mt-4 flex gap-2.5 rounded-xl border border-electric/25 bg-electric/5 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-electric-soft" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Hiring OS <span className="font-medium text-foreground">never fetches or scrapes</span>{" "}
            this URL — it is stored as a reference only. Enter details you already have permission
            to keep. Automatic LinkedIn sourcing requires an approved LinkedIn Talent Solutions
            partner integration.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="li-url">LinkedIn profile URL *</Label>
            <Input
              id="li-url"
              placeholder="https://www.linkedin.com/in/example"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className={cn(profileUrl && !urlValid && "border-red-500/60")}
            />
            {profileUrl && !urlValid && (
              <p className="text-xs text-red-400">Must be a linkedin.com URL.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="li-name">Candidate name *</Label>
            <Input id="li-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-headline">Headline</Label>
            <Input
              id="li-headline"
              placeholder="Senior Frontend Engineer"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-location">Location</Label>
            <Input id="li-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="li-exp">Experience (years)</Label>
            <Input
              id="li-exp"
              type="number"
              min={0}
              max={60}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="li-skills">Skills</Label>
            <div className="flex gap-2">
              <Input
                id="li-skills"
                placeholder="Add a skill and press Enter"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSkill} disabled={!skillDraft.trim()}>
                <Plus className="size-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <button key={s} type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))}>
                    <Badge tone="electric">
                      {s} <X className="ml-1 inline size-3" />
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="li-summary">Summary</Label>
            <Textarea
              id="li-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="li-email">Email</Label>
            <Input
              id="li-email"
              type="email"
              placeholder="Only if you have permission to store it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Consent gate — submission is blocked until confirmed */}
        <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border/60 bg-secondary/30 p-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-4 accent-current"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            I confirm I have this candidate&apos;s consent, or another lawful basis, to store the
            details entered above in Hiring OS. *
          </span>
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="brand" onClick={submit} disabled={!canSubmit || importCandidate.isPending}>
            {importCandidate.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Add to talent pool
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={importCandidate.isPending}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
