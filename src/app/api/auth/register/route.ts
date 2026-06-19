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
 * POST /api/auth/register
 * body (company):   { actor: "company", company_name, name, email, password }
 * body (candidate): { actor: "candidate", name, email, password }
 */
export async function POST(req: Request) {
  let body: Record<string, string | undefined>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const actor = body.actor === "candidate" ? "candidate" : "company";
  const path = `/auth/${actor}/register`;
  const payload =
    actor === "candidate"
      ? { name: body.name, email: body.email, password: body.password }
      : {
          company_name: body.company_name,
          name: body.name,
          email: body.email,
          password: body.password,
        };

  let result;
  try {
    result = await backendPost(path, payload);
  } catch {
    return NextResponse.json(
      { message: "Cannot reach the server. Is the backend running?" },
      { status: 503 }
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { message: backendErrorMessage(result.data, "Registration failed") },
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
