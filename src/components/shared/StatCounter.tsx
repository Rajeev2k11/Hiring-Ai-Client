"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  /** Raw display value, e.g. "70%", "5×", "60+", "12.4". */
  value: string;
  label: string;
  sub?: string;
  className?: string;
  valueClassName?: string;
}

/** Animates the leading number of a stat string when scrolled into view. */
export function StatCounter({
  value,
  label,
  sub,
  className,
  valueClassName,
}: StatCounterProps) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : NaN;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? 1 : 0;

  const { ref, value: animated } = useCountUp(
    Number.isNaN(numeric) ? 0 : numeric,
    { decimals }
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <span
        ref={ref}
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          valueClassName
        )}
      >
        {Number.isNaN(numeric) ? value : `${animated}${suffix}`}
      </span>
      <span className="mt-1 text-sm font-medium text-foreground/80">{label}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}
