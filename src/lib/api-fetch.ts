/**
 * Client helper for authenticated backend calls via the BFF proxy
 * (/api/proxy/*). Same-origin fetch — the httpOnly auth cookie is sent
 * automatically; the JWT is attached to the backend request server-side.
 */

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

function flattenError(data: unknown, fallback: string): string {
  const d = data as { detail?: unknown; message?: string } | null;
  if (!d) return fallback;
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail) && d.detail.length > 0) {
    return (d.detail[0] as { msg?: string })?.msg ?? fallback;
  }
  return d.message ?? fallback;
}

async function call<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/proxy/${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(flattenError(data, "Request failed"));
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => call<T>("GET", path),
  post: <T>(path: string, body?: unknown) => call<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => call<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => call<T>("PUT", path, body),
  del: <T>(path: string, body?: unknown) => call<T>("DELETE", path, body),
};
