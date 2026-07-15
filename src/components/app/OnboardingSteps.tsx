import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "company", label: "Company profile" },
  { key: "invite", label: "Invite your team" },
];

export function OnboardingSteps({ current }: { current: "company" | "invite" }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center gap-3">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs font-semibold transition-colors",
                  done && "bg-electric/20 text-electric-soft",
                  active && "bg-brand-gradient text-white",
                  !done && !active && "bg-secondary text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="h-px w-8 bg-border" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
