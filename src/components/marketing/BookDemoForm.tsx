"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sleep } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(2, "Please enter your company"),
  teamSize: z.string().min(1, "Select a team size"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];

const fieldError = "text-xs font-medium text-red-300";

export function BookDemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await sleep(900); // simulate request (mock)
    // eslint-disable-next-line no-console
    console.info("[book-demo] submitted", values);
    toast.success("Demo requested — we'll be in touch within one business day.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-card/60 p-10 text-center backdrop-blur-xl">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-emerald-400">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold">You're all set</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for your interest in Hiring OS. A member of our team will reach
          out within one business day to schedule your personalized walkthrough.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-white">
          <CalendarCheck className="size-5" />
        </span>
        <h2 className="font-display text-lg font-semibold">Book your demo</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jordan Lee" {...register("name")} />
          {errors.name && <p className={fieldError}>{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jordan@company.com"
            {...register("email")}
          />
          {errors.email && <p className={fieldError}>{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Inc." {...register("company")} />
          {errors.company && <p className={fieldError}>{errors.company.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="teamSize">Team size</Label>
          <select
            id="teamSize"
            defaultValue=""
            {...register("teamSize")}
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3.5 text-sm text-foreground",
              "focus-visible:outline-none focus-visible:border-electric/60 focus-visible:ring-2 focus-visible:ring-electric/25"
            )}
          >
            <option value="" disabled>
              Select…
            </option>
            {TEAM_SIZES.map((s) => (
              <option key={s} value={s} className="bg-popover">
                {s}
              </option>
            ))}
          </select>
          {errors.teamSize && <p className={fieldError}>{errors.teamSize.message}</p>}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="message">What would you like to see? (optional)</Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="We're hiring 20 engineers this quarter and want to automate sourcing…"
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="mt-6 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            Request demo <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By submitting, you agree to our privacy policy. No spam, ever.
      </p>
    </form>
  );
}
