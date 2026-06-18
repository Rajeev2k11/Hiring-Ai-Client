import { Badge } from "@/components/ui/badge";
import type { Tone } from "@/constants/status";

interface StatusMeta {
  label: string;
  tone: Tone;
}

interface StatusBadgeProps {
  value: string;
  meta: Record<string, StatusMeta>;
  withDot?: boolean;
}

/** Renders a status string as a toned Badge via a meta map (job/app/etc.). */
export function StatusBadge({ value, meta, withDot }: StatusBadgeProps) {
  const m = meta[value] ?? { label: value, tone: "neutral" as Tone };
  return (
    <Badge tone={m.tone}>
      {withDot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {m.label}
    </Badge>
  );
}
