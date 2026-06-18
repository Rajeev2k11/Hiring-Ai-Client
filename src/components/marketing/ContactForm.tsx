"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, sleep } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  topic: z.string().min(1, "Select a topic"),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;
const TOPICS = ["Sales", "Product support", "Partnerships", "Press", "Other"];
const fieldError = "text-xs font-medium text-red-300";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await sleep(900);
    // eslint-disable-next-line no-console
    console.info("[contact] submitted", values);
    toast.success("Message sent — we'll get back to you shortly.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-card/60 p-10 text-center backdrop-blur-xl">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-emerald-400">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. We typically respond within a few hours during
          business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cname">Name</Label>
          <Input id="cname" placeholder="Jordan Lee" {...register("name")} />
          {errors.name && <p className={fieldError}>{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cemail">Email</Label>
          <Input
            id="cemail"
            type="email"
            placeholder="you@company.com"
            {...register("email")}
          />
          {errors.email && <p className={fieldError}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="topic">Topic</Label>
        <select
          id="topic"
          defaultValue=""
          {...register("topic")}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-secondary/40 px-3.5 text-sm text-foreground",
            "focus-visible:outline-none focus-visible:border-electric/60 focus-visible:ring-2 focus-visible:ring-electric/25"
          )}
        >
          <option value="" disabled>
            Select…
          </option>
          {TOPICS.map((t) => (
            <option key={t} value={t} className="bg-popover">
              {t}
            </option>
          ))}
        </select>
        {errors.topic && <p className={fieldError}>{errors.topic.message}</p>}
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="cmessage">Message</Label>
        <Textarea
          id="cmessage"
          rows={5}
          placeholder="How can we help?"
          {...register("message")}
        />
        {errors.message && <p className={fieldError}>{errors.message.message}</p>}
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
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
