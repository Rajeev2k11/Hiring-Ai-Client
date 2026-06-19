import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE, BACKEND_BASE } from "@/lib/backend";

/**
 * Authenticated BFF proxy. Forwards /api/proxy/<backend-path> to the FastAPI
 * backend with the JWT from the httpOnly cookie attached as a Bearer token —
 * so client JS never handles the token, and every protected backend endpoint
 * (recruiter settings, jobs, candidates, …) is reachable same-origin.
 */
const ALLOWED_PREFIXES = [
  "recruiter/",
  "applications",
  "jobs",
  "ai/",
];

function allowed(target: string) {
  return ALLOWED_PREFIXES.some(
    (p) => target === p || target.startsWith(p)
  );
}

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const target = path.join("/");

  if (!allowed(target)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const url = `${BACKEND_BASE}/${target}${req.nextUrl.search}`;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const init: RequestInit = { method: req.method, headers, cache: "no-store" };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.text();
    if (body) {
      init.body = body;
      headers["Content-Type"] =
        req.headers.get("content-type") ?? "application/json";
    }
  }

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { message: "Cannot reach the server. Is the backend running?" },
      { status: 503 }
    );
  }

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
