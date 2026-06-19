"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AuthDivider } from "./AuthDivider";
import { AuthSwitch } from "./AuthSwitch";
import { SsoButtons } from "./SsoButtons";

const schema = z.object({
  companyName: z.string().optional(),
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof schema>;
type Actor = "company" | "candidate";

const PERKS: Record<Actor, string[]> = {
  company: ["Free 14-day trial", "No credit card", "Cancel anytime"],
  candidate: ["Always free for job seekers", "AI-matched roles", "One profile, every job"],
};

const COPY: Record<Actor, { title: string; subtitle: string; loginHref: string }> = {
  company: {
    title: "Create your company account",
    subtitle: "Start hiring with autonomous agents in minutes.",
    loginHref: "/login",
  },
  candidate: {
    title: "Create your candidate account",
    subtitle: "Build one profile and get matched to roles that fit.",
    loginHref: "/candidate/login",
  },
};

export function RegisterForm({ actor }: { actor: Actor }) {
  const router = useRouter();
  const { registerCompany, registerCandidate } = useAuth();
  const copy = COPY[actor];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      if (actor === "company") {
        if (!values.companyName || values.companyName.length < 2) {
          toast.error("Please enter your company name");
          return;
        }
        await registerCompany.mutateAsync({
          company_name: values.companyName,
          name: values.name,
          email: values.email,
          password: values.password,
        });
      } else {
        await registerCandidate.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password,
        });
      }
      toast.success("Account created — welcome to Hiring OS");
      router.push(actor === "company" ? "/dashboard" : "/portal");
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? "Registration failed";
      if (/already/i.test(msg)) {
        toast.error("This email is already registered — try signing in instead.", {
          action: { label: "Sign in", onClick: () => router.push(copy.loginHref) },
        });
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div>
      <AuthSwitch active={actor} mode="register" />

      <h1 className="mt-7 font-display text-2xl font-bold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {PERKS[actor].map((p) => (
          <span key={p} className="flex items-center gap-1.5 text-xs text-foreground/75">
            <Check className="size-3.5 text-emerald-400" /> {p}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {actor === "company" && (
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input id="companyName" placeholder="Acme Inc." {...register("companyName")} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="rname">Full name</Label>
          <Input id="rname" placeholder="Jordan Lee" {...register("name")} />
          {errors.name && <p className="text-xs font-medium text-red-300">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="remail">{actor === "company" ? "Work email" : "Email"}</Label>
          <Input id="remail" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs font-medium text-red-300">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rpassword">Password</Label>
          <Input id="rpassword" type="password" placeholder="At least 8 characters" {...register("password")} />
          {errors.password && (
            <p className="text-xs font-medium text-red-300">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Create account <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <AuthDivider />
      <SsoButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={copy.loginHref} className="font-medium text-electric-soft hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
