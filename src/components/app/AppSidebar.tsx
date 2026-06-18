"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HelpCircle, LogOut, Plus } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { AppNavItem } from "@/constants/navigation";

interface AppSidebarProps {
  subtitle: string;
  nav: AppNavItem[];
  primaryCta?: { label: string; href: string };
  /** Where "Log out" sends the user. */
  logoutHref?: string;
  /** Where the logo links (workspace home). */
  homeHref?: string;
}

export function AppSidebar({
  subtitle,
  nav,
  primaryCta,
  logoutHref = "/",
  homeHref = "/dashboard",
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push(logoutHref);
  };

  const isActive = (href: string) =>
    href === pathname || (href !== "/" && pathname.startsWith(href + "/")) ||
    (href !== "/dashboard" && href !== "/portal" && pathname.startsWith(href));

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border/60 bg-card/30 px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo href={homeHref} />
        <p className="mt-1 pl-[2.85rem] text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        {primaryCta && (
          <Button asChild variant="brand" className="w-full">
            <Link href={primaryCta.href}>
              <Plus className="size-4" />
              {primaryCta.label}
            </Link>
          </Button>
        )}
        <div className="space-y-1 border-t border-border/60 pt-3">
          <Link
            href="/resources"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <HelpCircle className="size-[18px]" />
            Help Center
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="size-[18px]" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
