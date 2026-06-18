import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ACCENT } from "@/lib/accent";
import type { Accent } from "@/constants/marketing";

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon?: LucideIcon;
  accent?: Accent;
  /** e.g. "+12%" / "-4%" / "0%" */
  delta?: string;
  hint?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "electric",
  delta,
  hint,
  loading,
}: StatCardProps) {
  const a = ACCENT[accent];
  const deltaNum = delta ? parseFloat(delta) : null;
  const deltaPositive = deltaNum !== null && deltaNum > 0;
  const deltaNegative = deltaNum !== null && deltaNum < 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-5">
      <div className="flex items-start justify-between">
        {Icon && (
          <span className={cn("grid h-10 w-10 place-items-center rounded-xl border", a.iconWrap)}>
            <Icon className="size-5" />
          </span>
        )}
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              deltaPositive && "text-emerald-300",
              deltaNegative && "text-red-300",
              !deltaPositive && !deltaNegative && "text-muted-foreground"
            )}
          >
            {deltaPositive && <TrendingUp className="size-3.5" />}
            {deltaNegative && <TrendingDown className="size-3.5" />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-8 w-20" />
      ) : (
        <p className="mt-1 font-display text-3xl font-bold tracking-tight">
          {value ?? "—"}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}
