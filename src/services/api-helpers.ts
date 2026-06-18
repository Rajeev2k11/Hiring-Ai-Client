/**
 * The seam between mock data and the real backend.
 *
 * Every service function is written as `resolve(mockFactory, httpFactory)`.
 * While `env.useMocks` is true we return the mock (with a little simulated
 * latency so loading/skeleton states are real). Flip NEXT_PUBLIC_USE_MOCKS to
 * "false" and each service transparently calls the FastAPI endpoint instead —
 * no component changes required.
 */
import { env } from "@/lib/env";
import { sleep } from "@/lib/utils";

const MIN_LATENCY = 40;
const MAX_LATENCY = 130;

function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
}

export async function resolve<T>(
  mockFactory: () => T | Promise<T>,
  httpFactory: () => Promise<T>
): Promise<T> {
  if (env.useMocks) {
    await sleep(randomLatency());
    return mockFactory();
  }
  return httpFactory();
}

/** Deep clone so callers can't mutate the in-memory mock store by reference. */
export function clone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
