"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AppNavItem } from "@/constants/navigation";

/** App-style fixed bottom navigation — mobile only (sidebar takes over on lg+). */
export function MobileTabBar({ nav }: { nav: AppNavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === pathname || pathname === href || pathname.startsWith(href + "/");

  const showMore = nav.length > 5;
  const primary = showMore ? nav.slice(0, 4) : nav;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl lg:hidden">
      <div
        className="mx-auto flex max-w-md items-stretch justify-around px-2"
        style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))", paddingTop: "0.4rem" }}
      >
        {primary.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-electric-soft" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("size-5", active && "drop-shadow-[0_0_8px_hsl(var(--electric)/0.6)]")} />
              {item.label}
            </Link>
          );
        })}

        {showMore && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-1 flex-col items-center gap-1 py-1.5 text-[10px] font-medium text-muted-foreground">
                <MoreHorizontal className="size-5" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 pb-6">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-secondary/30 p-4 text-xs font-medium",
                      isActive(item.href) ? "text-electric-soft" : "text-foreground/80"
                    )}
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
