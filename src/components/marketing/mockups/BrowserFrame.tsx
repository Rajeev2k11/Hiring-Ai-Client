import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  children: ReactNode;
  url?: string;
  className?: string;
}

/** A macOS-style window/browser chrome wrapper to make mockups read as a product. */
export function BrowserFrame({ children, url = "app.hiringos.ai", className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-elevated backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/30 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <div className="ml-3 flex h-6 flex-1 items-center justify-center rounded-md border border-border/50 bg-background/50 px-3 text-[11px] text-muted-foreground">
          {url}
        </div>
      </div>
      <div className="bg-background/40">{children}</div>
    </div>
  );
}
