import { cn } from "@/lib/utils";
import { scoreTone, type Tone } from "@/constants/status";

interface ScoreRingProps {
  score: number; // 0–100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

const toneStroke: Record<Tone, string> = {
  success: "stroke-emerald-400",
  electric: "stroke-electric",
  plasma: "stroke-plasma",
  warning: "stroke-amber-400",
  danger: "stroke-red-400",
  info: "stroke-sky-400",
  neutral: "stroke-muted-foreground",
};
const toneText: Record<Tone, string> = {
  success: "text-emerald-300",
  electric: "text-electric-soft",
  plasma: "text-plasma-soft",
  warning: "text-amber-300",
  danger: "text-red-300",
  info: "text-sky-300",
  neutral: "text-muted-foreground",
};

/** Circular AI-match-score gauge. Tone derives from the score band. */
export function ScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  className,
  showLabel = true,
}: ScoreRingProps) {
  const tone = scoreTone(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("fill-none transition-all duration-700", toneStroke[tone])}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 grid place-items-center">
          <span className={cn("font-display text-sm font-bold", toneText[tone])}>
            {Math.round(score)}
          </span>
        </div>
      )}
    </div>
  );
}
