/**
 * Server-only helpers for the auth BFF (Next route handlers). These run on the
 * Node server and talk to the FastAPI backend server-to-server (no CORS, and
 * the JWT never reaches client JS — it lives in an httpOnly cookie).
 */
import "server-only";

export const BACKEND_BASE =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api/v1";

export const AUTH_COOKIE = "hos_token";
export const ACTOR_COOKIE = "hos_actor";

/** Cookie lifetime (30 days) — matched to the backend's
 * ACCESS_TOKEN_EXPIRE_MINUTES (43200 = 30 days). /api/auth/session revalidates
 * against /auth/me and clears the cookie if the token is no longer accepted. */
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/** POST JSON to the backend; returns { ok, status, data }. */
export async function backendPost(path: string, body: unknown) {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Flatten a FastAPI error body (string or 422 list) to one message. */
export function backendErrorMessage(data: unknown, fallback = "Request failed") {
  const detail = (data as { detail?: unknown })?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return (detail[0] as { msg?: string })?.msg ?? fallback;
  }
  return fallback;
}
