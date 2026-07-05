"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { OnboardingSteps } from "@/components/app/OnboardingSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetupStatus, useUpdateCompanyProfile } from "@/hooks/useCompany";
import { CompanySize, Industry } from "@/types";

const INDUSTRY_OPTIONS = Object.values(Industry).map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));
const SIZE_OPTIONS = Object.values(CompanySize);

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export default function CompanyProfileSetupPage() {
  const router = useRouter();
  const { data: setup, isLoading } = useSetupStatus();
  const update = useUpdateCompanyProfile();

  const [form, setForm] = useState({
    name: "",
    website_url: "",
    industry: "",
    company_size: "",
    headquarters_location: "",
    timezone: "",
  });

  useEffect(() => {
    if (setup?.profile) {
      const p = setup.profile;
      setForm({
        name: p.name ?? "",
        website_url: p.website_url ?? "",
        industry: p.industry ?? "",
        company_size: p.company_size ?? "",
        headquarters_location: p.headquarters_location ?? "",
        timezone: p.timezone ?? detectTimezone(),
      });
    }
  }, [setup]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Website and Industry are optional; the rest are required.
  const isComplete =
    form.name.trim() !== "" &&
    form.company_size !== "" &&
    form.headquarters_location.trim() !== "";

  const submit = async () => {
    if (!isComplete) return toast.error("Please fill in all required fields.");
    try {
      await update.mutateAsync({
        name: form.name.trim(),
        website_url: form.website_url.trim() || null,
        industry: form.industry || null,
        company_size: form.company_size || null,
        headquarters_location: form.headquarters_location.trim() || null,
        timezone: form.timezone || null,
      });
      toast.success("Company profile saved");
      router.push("/onboarding/invite");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <OnboardingSteps current="company" />

      <h1 className="mt-8 font-display text-2xl font-bold tracking-tight">
        Set up your company profile
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Tell us about your organisation. You can change any of this later in
        Settings.
      </p>

      <div className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-card/40 p-6">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name">Company name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Acme Inc."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="website">
                  Website{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="website"
                  value={form.website_url}
                  onChange={(e) => set("website_url")(e.target.value)}
                  placeholder="https://acme.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry">
                  Industry{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <select
                  id="industry"
                  value={form.industry}
                  onChange={(e) => set("industry")(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none"
                >
                  <option value="">Select…</option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-popover">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="size">Company size</Label>
                <select
                  id="size"
                  value={form.company_size}
                  onChange={(e) => set("company_size")(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm outline-none"
                >
                  <option value="">Select…</option>
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-popover">
                      {s} employees
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Headquarters</Label>
                <Input
                  id="location"
                  value={form.headquarters_location}
                  onChange={(e) => set("headquarters_location")(e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timezone">
                Timezone{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="timezone"
                value={form.timezone}
                onChange={(e) => set("timezone")(e.target.value)}
                placeholder="America/New_York"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="brand"
          onClick={submit}
          disabled={update.isPending || isLoading || !isComplete}
        >
          {update.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          Continue
        </Button>
      </div>
    </div>
  );
}
