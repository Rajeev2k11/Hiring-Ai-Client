import type { Accent } from "@/constants/marketing";

interface AccentClasses {
  text: string;
  border: string;
  bg: string;
  iconWrap: string;
  glow: string;
  /** Literal hover-glow class (kept whole so Tailwind's scanner detects it). */
  glowHover: string;
  gradient: string;
  dot: string;
}

/** Centralized accent → Tailwind class mapping for marketing/agent surfaces. */
export const ACCENT: Record<Accent, AccentClasses> = {
  electric: {
    text: "text-electric-soft",
    border: "border-electric/30",
    bg: "bg-electric/10",
    iconWrap: "bg-electric/10 text-electric-soft border-electric/30",
    glow: "shadow-[0_0_40px_-10px_hsl(var(--electric)/0.6)]",
    glowHover: "hover:shadow-[0_0_40px_-10px_hsl(var(--electric)/0.6)]",
    gradient: "from-electric/20",
    dot: "bg-electric",
  },
  plasma: {
    text: "text-plasma-soft",
    border: "border-plasma/30",
    bg: "bg-plasma/10",
    iconWrap: "bg-plasma/10 text-plasma-soft border-plasma/30",
    glow: "shadow-[0_0_40px_-10px_hsl(var(--plasma)/0.6)]",
    glowHover: "hover:shadow-[0_0_40px_-10px_hsl(var(--plasma)/0.6)]",
    gradient: "from-plasma/20",
    dot: "bg-plasma",
  },
  aurora: {
    text: "text-cyan-300",
    border: "border-aurora/30",
    bg: "bg-aurora/10",
    iconWrap: "bg-aurora/10 text-cyan-300 border-aurora/30",
    glow: "shadow-[0_0_40px_-10px_hsl(var(--aurora)/0.55)]",
    glowHover: "hover:shadow-[0_0_40px_-10px_hsl(var(--aurora)/0.55)]",
    gradient: "from-aurora/20",
    dot: "bg-aurora",
  },
};
