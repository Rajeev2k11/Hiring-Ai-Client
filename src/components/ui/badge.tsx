import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-secondary/60 text-muted-foreground",
        info: "border-sky-500/25 bg-sky-500/10 text-sky-300",
        electric: "border-electric/30 bg-electric/10 text-electric-soft",
        plasma: "border-plasma/30 bg-plasma/10 text-plasma-soft",
        success: "border-success/30 bg-success/10 text-emerald-300",
        warning: "border-warning/30 bg-warning/10 text-amber-300",
        danger: "border-destructive/30 bg-destructive/10 text-red-300",
        outline: "border-border bg-transparent text-foreground/80",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
