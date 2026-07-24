import { NextResponse, type NextRequest } from "next/server";

// Kept in sync with src/lib/backend.ts (duplicated so the edge middleware
// doesn't import the server-only backend helper).
const AUTH_COOKIE = "hos_token";
const ACTOR_COOKIE = "hos_actor";

const COMPANY_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/jobs",
  "/pool",
  "/shortlist",
  "/candidates",
  "/interviews",
  "/analytics",
  "/settings",
];
const CANDIDATE_PREFIXES = ["/portal"];
const AUTH_PAGES = [
  "/login",
  "/register",
  "/candidate/login",
  "/candidate/register",
  "/forgot-password",
];

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(p + "/"));

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const actor = req.cookies.get(ACTOR_COOKIE)?.value; // "company_user" | "candidate"

  const isCompanyRoute = matches(pathname, COMPANY_PREFIXES);
  const isCandidateRoute = matches(pathname, CANDIDATE_PREFIXES);
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Not signed in → block protected areas, send to the right login.
  if (!token) {
    if (isCompanyRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (isCandidateRoute) {
      const url = req.nextUrl.clone();
      url.pathname = "/candidate/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Signed in → never let them sit on an auth page; send to their home.
  const home = actor === "candidate" ? "/portal" : "/dashboard";
  if (isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = home;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Enforce actor separation: company token can't enter the candidate portal
  // and vice-versa.
  if (isCompanyRoute && actor !== "company_user") {
    const url = req.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }
  if (isCandidateRoute && actor !== "candidate") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
