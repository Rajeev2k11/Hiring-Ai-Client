import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  ACTOR_COOKIE,
  AUTH_COOKIE,
  backendErrorMessage,
  backendPost,
  cookieOptions,
} from "@/lib/backend";

/**
 * POST /api/auth/login
 * body: { actor: "company" | "candidate", email, password }
 * Calls the backend, then stores the JWT + actor in httpOnly cookies.
 */
export async function POST(req: Request) {
  let body: { actor?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const actor = body.actor === "candidate" ? "candidate" : "company";
  const path = `/auth/${actor}/login`;

  let result;
  try {
    result = await backendPost(path, {
      email: body.email,
      password: body.password,
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach the server. Is the backend running?" },
      { status: 503 }
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { message: backendErrorMessage(result.data, "Invalid credentials") },
      { status: result.status }
    );
  }

  const { access_token, actor_type, identity } = result.data as {
    access_token: string;
    actor_type: string;
    identity: unknown;
  };

  const jar = await cookies();
  jar.set(AUTH_COOKIE, access_token, cookieOptions());
  jar.set(ACTOR_COOKIE, actor_type, cookieOptions());

  return NextResponse.json({ actor_type, identity });
}
