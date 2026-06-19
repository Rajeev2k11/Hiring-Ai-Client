import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ACTOR_COOKIE, AUTH_COOKIE } from "@/lib/backend";

/** POST /api/auth/logout — clears the auth cookies. */
export async function POST() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  jar.delete(ACTOR_COOKIE);
  return NextResponse.json({ ok: true });
}
