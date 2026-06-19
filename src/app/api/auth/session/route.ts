import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ACTOR_COOKIE, AUTH_COOKIE, BACKEND_BASE } from "@/lib/backend";

/**
 * GET /api/auth/session
 * Reads the httpOnly token cookie and validates it against the backend
 * /auth/me. Returns the resolved identity, or { authenticated:false } and
 * clears the cookie if the token is missing/expired/revoked.
 */
export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    // Backend unreachable — don't destroy the session, just report unknown.
    return NextResponse.json(
      { authenticated: false, unreachable: true },
      { status: 200 }
    );
  }

  if (!res.ok) {
    jar.delete(AUTH_COOKIE);
    jar.delete(ACTOR_COOKIE);
    return NextResponse.json({ authenticated: false });
  }

  const me = await res.json();
  return NextResponse.json({
    authenticated: true,
    actor_type: me.actor_type,
    identity: me.identity,
  });
}
