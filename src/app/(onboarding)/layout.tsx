"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { useSession, useAuth } from "@/hooks/useAuth";
import { BRAND } from "@/constants/brand";

function FullLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <Loader2 className="size-6 animate-spin text-electric-soft" />
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isLoading } = useSession();
  const { logout } = useAuth();

  useEffect(() => {
    if (isLoading || !session) return;
    if (session.authenticated) {
      if (session.actor_type !== "company_user") router.replace("/portal");
    } else if (!session.unreachable) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  const ready =
    (session?.authenticated && session.actor_type === "company_user") ||
    session?.unreachable;

  if (isLoading || !ready) return <FullLoader />;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border/60 px-5 py-4 lg:px-8">
        <span className="font-display text-lg font-bold tracking-tight">
          {BRAND.name}
        </span>
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </header>
      <main className="mx-auto w-full max-w-2xl px-5 py-10 lg:py-14">{children}</main>
    </div>
  );
}
