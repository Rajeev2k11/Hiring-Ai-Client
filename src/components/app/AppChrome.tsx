"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useSession } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { MobileTabBar } from "./MobileTabBar";
import type { AppNavItem } from "@/constants/navigation";
import type { ActorType } from "@/types";

function FullLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <Loader2 className="size-6 animate-spin text-electric-soft" />
    </div>
  );
}

interface AppChromeProps {
  children: ReactNode;
  nav: AppNavItem[];
  subtitle: string;
  searchPlaceholder?: string;
  primaryCta?: { label: string; href: string };
  requiredActor: ActorType;
  otherActorHome: string;
  logoutHref?: string;
  homeHref?: string;
}

export function AppChrome({
  children,
  nav,
  subtitle,
  searchPlaceholder,
  primaryCta,
  requiredActor,
  otherActorHome,
  logoutHref = "/",
  homeHref = "/dashboard",
}: AppChromeProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, isLoading } = useSession();

  const loginPath = requiredActor === "candidate" ? "/candidate/login" : "/login";
  const authedHere =
    session?.authenticated && session.actor_type === requiredActor;

  useEffect(() => {
    if (isLoading || !session) return;
    if (session.authenticated) {
      if (session.actor_type !== requiredActor) {
        router.replace(otherActorHome);
      } else {
        dispatch(
          setSession({
            actorType: session.actor_type,
            identity: session.identity!,
          })
        );
      }
    } else if (!session.unreachable) {
      router.replace(loginPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, session]);

  // Render the shell when validated, or in degraded mode if the backend is
  // momentarily unreachable (middleware already gated the route by cookie).
  const showShell = authedHere || session?.unreachable;

  if (isLoading || !showShell) return <FullLoader />;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        subtitle={subtitle}
        nav={nav}
        primaryCta={primaryCta}
        logoutHref={logoutHref}
        homeHref={homeHref}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          nav={nav}
          subtitle={subtitle}
          searchPlaceholder={searchPlaceholder}
          logoutHref={logoutHref}
        />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
      <MobileTabBar nav={nav} />
    </div>
  );
}
