import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          {typeof title === "string" ? (
            <h2 className="font-display text-base font-semibold">{title}</h2>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
