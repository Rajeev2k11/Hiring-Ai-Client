/**
 * Client-side wrappers around the auth BFF (Next route handlers at /api/auth/*).
 * These are same-origin fetches — the JWT lives in an httpOnly cookie the
 * browser sends automatically; client JS never sees it.
 */
import type { ActorType, Identity } from "@/types";

export type AuthActor = "company" | "candidate";

export interface AuthResult {
  actor_type: ActorType;
  identity: Identity;
}

export interface SessionResult {
  authenticated: boolean;
  actor_type?: ActorType;
  identity?: Identity;
  unreachable?: boolean;
}

export interface CompanyRegisterInput {
  company_name: string;
  name: string;
  email: string;
  password: string;
}
export interface CandidateRegisterInput {
  name: string;
  email: string;
  password: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Request failed");
  }
  return data as T;
}

export const authClient = {
  login(actor: AuthActor, creds: { email: string; password: string }) {
    return postJSON<AuthResult>("/api/auth/login", { actor, ...creds });
  },
  registerCompany(payload: CompanyRegisterInput) {
    return postJSON<AuthResult>("/api/auth/register", {
      actor: "company",
      ...payload,
    });
  },
  registerCandidate(payload: CandidateRegisterInput) {
    return postJSON<AuthResult>("/api/auth/register", {
      actor: "candidate",
      ...payload,
    });
  },
  async logout() {
    await fetch("/api/auth/logout", { method: "POST" });
  },
  async session(): Promise<SessionResult> {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    return res.json();
  },
};
