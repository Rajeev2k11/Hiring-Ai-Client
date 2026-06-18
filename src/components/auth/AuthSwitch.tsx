import Link from "next/link";
import { Briefcase, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

interface AuthSwitchProps {
  active: "company" | "candidate";
  mode: "login" | "register";
}

/**
 * Always-visible segmented control so the user knows whether they're in the
 * company or candidate flow — and can switch in one click.
 */
export function AuthSwitch({ active, mode }: AuthSwitchProps) {
  const companyHref = mode === "login" ? "/login" : "/register";
  const candidateHref = mode === "login" ? "/candidate/login" : "/candidate/register";

  const seg =
    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors";

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-border/70 bg-secondary/30 p-1">
      <Link
        href={companyHref}
        className={cn(
          seg,
          active === "company"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="size-4" /> I'm hiring
      </Link>
      <Link
        href={candidateHref}
        className={cn(
          seg,
          active === "candidate"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <UserRound className="size-4" /> I'm a job seeker
      </Link>
    </div>
  );
}
