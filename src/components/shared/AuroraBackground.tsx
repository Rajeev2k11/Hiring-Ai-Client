import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  /** Show the faint engineering grid behind the aurora. */
  grid?: boolean;
  /** Intensity of the glow blobs. */
  intensity?: "subtle" | "normal" | "vivid";
}

/**
 * The signature ambient backdrop: drifting electric/plasma aurora blobs over an
 * optional faint grid, masked to fade at the edges. Purely decorative.
 */
export function AuroraBackground({
  className,
  grid = true,
  intensity = "normal",
}: AuroraBackgroundProps) {
  const opacity =
    intensity === "vivid" ? "opacity-90" : intensity === "subtle" ? "opacity-40" : "opacity-70";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {grid && (
        <div className="absolute inset-0 bg-grid mask-radial opacity-[0.35]" />
      )}
      <div className={cn("absolute inset-0", opacity)}>
        <div className="absolute -left-[10%] top-[-15%] h-[42rem] w-[42rem] rounded-full bg-electric/25 blur-[120px] animate-aurora-drift" />
        <div className="absolute right-[-15%] top-[5%] h-[38rem] w-[38rem] rounded-full bg-plasma/25 blur-[130px] animate-aurora-drift [animation-delay:-6s]" />
        <div className="absolute bottom-[-25%] left-[25%] h-[34rem] w-[34rem] rounded-full bg-aurora/15 blur-[120px] animate-aurora-drift [animation-delay:-10s]" />
      </div>
    </div>
  );
}
