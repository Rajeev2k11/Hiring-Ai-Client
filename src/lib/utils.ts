import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Initials from a full name, e.g. "Marcus Chen" → "MC". */
export function initials(name?: string | null): string {
  if (!name) return "··";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Deterministic 0..1 hash from a string (stable mock avatars/positions). */
export function hashUnit(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

/** Promise-based delay (used to simulate network latency in mocks). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Format a 0–100 score with no decimals, guarding null. */
export function formatScore(score?: number | null): string {
  if (score === null || score === undefined) return "—";
  return Math.round(score).toString();
}

/** Compact currency, e.g. 145000 → "$145K". */
export function formatCompactCurrency(
  amount: number,
  currency = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
