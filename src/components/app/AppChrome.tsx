"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useSession } from "@/hooks/useAuth";
import { useSetupStatus } from "@/hooks/useCompany";
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
  /**
   * When true, company users whose onboarding isn't finished are redirected
   * into the onboarding wizard before they can reach the app.
   */
  enforceOnboarding?: boolean;
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
  enforceOnboarding = false,
}: AppChromeProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, isLoading } = useSession();

  const loginPath = requiredActor === "candidate" ? "/candidate/login" : "/login";
  const authedHere =
    session?.authenticated && session.actor_type === requiredActor;

  // Only fetch the setup status when we need to enforce onboarding for a
  // validated company user.
  const onboardingGateActive = enforceOnboarding && Boolean(authedHere);
  const {
    data: setup,
    isLoading: setupLoading,
    isError: setupError,
  } = useSetupStatus(onboardingGateActive);

  const needsOnboarding = Boolean(
    onboardingGateActive && setup && !setup.onboarding.setup_complete
  );
  // Still resolving status (don't flash the dashboard yet). Fail open if the
  // status endpoint errors so users are never trapped on a loader.
  const awaitingSetup = onboardingGateActive && setupLoading && !setupError;

  useEffect(() => {
    if (!needsOnboarding || !setup) return;
    router.replace(
      setup.onboarding.profile_completed
        ? "/onboarding/invite"
        : "/onboarding/company"
    );
  }, [needsOnboarding, setup, router]);

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

  // Hold the loader while the onboarding gate is resolving or a redirect to
  // the wizard is pending, so the dashboard never flashes for an un-onboarded
  // company.
  if (isLoading || !showShell || awaitingSetup || needsOnboarding)
    return <FullLoader />;

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
