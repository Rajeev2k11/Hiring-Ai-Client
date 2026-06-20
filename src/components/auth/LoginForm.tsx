"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AuthDivider } from "./AuthDivider";
import { AuthSwitch } from "./AuthSwitch";
import { SsoButtons } from "./SsoButtons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

type Actor = "company" | "candidate";

const COPY: Record<Actor, { title: string; subtitle: string; registerHref: string }> = {
  company: {
    title: "Sign in to your workspace",
    subtitle: "Welcome back. Your agents have been busy.",
    registerHref: "/register",
  },
  candidate: {
    title: "Sign in as a candidate",
    subtitle: "Pick up where you left off on your job search.",
    registerHref: "/candidate/register",
  },
};

export function LoginForm({ actor }: { actor: Actor }) {
  const router = useRouter();
  const { loginCompany, loginCandidate } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const copy = COPY[actor];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (actor === "company") await loginCompany.mutateAsync(values);
      else await loginCandidate.mutateAsync(values);
      toast.success("Welcome back");
      router.push(actor === "company" ? "/dashboard" : "/portal");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Login failed");
    }
  };

  return (
    <div>
      <AuthSwitch active={actor} mode="login" />

      <h1 className="mt-7 font-display text-2xl font-bold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <p className="text-xs font-medium text-red-300">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-electric-soft hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-300">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <AuthDivider />
      <SsoButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Hiring OS?{" "}
        <Link href={copy.registerHref} className="font-medium text-electric-soft hover:underline">
          {actor === "company" ? "Create a company account" : "Create a candidate account"}
        </Link>
      </p>
    </div>
  );
}
