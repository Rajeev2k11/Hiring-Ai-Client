"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PersistGate } from "redux-persist/integration/react";
import { Loader2 } from "lucide-react";

import { persistor } from "@/store";
import { useAppSelector } from "@/store/hooks";
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
  /** Where to send a logged-in user of the *other* actor type. */
  otherActorHome: string;
  logoutHref?: string;
  /** Where the logo links (workspace home). */
  homeHref?: string;
}

function Guard({
  children,
  requiredActor,
  otherActorHome,
}: {
  children: ReactNode;
  requiredActor: ActorType;
  otherActorHome: string;
}) {
  const router = useRouter();
  const { isAuthenticated, actorType } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (actorType && actorType !== requiredActor) {
      router.replace(otherActorHome);
    }
  }, [isAuthenticated, actorType, requiredActor, otherActorHome, router]);

  if (!isAuthenticated || (actorType && actorType !== requiredActor)) {
    return <FullLoader />;
  }
  return <>{children}</>;
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
  return (
    <PersistGate loading={<FullLoader />} persistor={persistor}>
      <Guard requiredActor={requiredActor} otherActorHome={otherActorHome}>
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
      </Guard>
    </PersistGate>
  );
}
