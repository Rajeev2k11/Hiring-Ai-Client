"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  History,
  LogOut,
  Menu,
  Search,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AssistantDrawer } from "./AssistantDrawer";
import { useAuth } from "@/hooks/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markAllRead, seedNotifications } from "@/store/slices/notificationsSlice";
import { initials, cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import type { AppNavItem } from "@/constants/navigation";

const SEED = [
  { id: "n1", kind: "agent" as const, title: "AI Evaluation complete", body: "15 candidates processed for Product Lead — top 3 flagged.", createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(), read: false },
  { id: "n2", kind: "success" as const, title: "Interview scheduled", body: "Jordan Smith · Technical Screen · tomorrow 10:00 AM.", createdAt: new Date(Date.now() - 3600_000).toISOString(), read: false },
  { id: "n3", kind: "info" as const, title: "New applicant", body: "Alex Rivera applied for Principal Engineer (AI score 98).", createdAt: new Date(Date.now() - 120_000).toISOString(), read: false },
];

interface AppTopbarProps {
  searchPlaceholder?: string;
  nav: AppNavItem[];
  subtitle: string;
  logoutHref?: string;
}

export function AppTopbar({
  searchPlaceholder = "Search candidates, jobs, or reports…",
  nav,
  subtitle,
  logoutHref = "/",
}: AppTopbarProps) {
  const router = useRouter();
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const { identity, logout } = useAuth();
  const notifications = useAppSelector((s) => s.notifications.items);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    dispatch(seedNotifications(SEED));
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    router.push(logoutHref);
  };

  const name = mounted && identity ? identity.name : "";
  const email = mounted && identity ? identity.email : "";

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-secondary/40 lg:hidden">
              <Menu className="size-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border/60 p-5">
              <SheetTitle>
                <Logo href={null} />
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-1 p-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary/60"
                >
                  <item.icon className="size-[18px]" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-border/70 bg-secondary/40 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-electric/50 focus:ring-2 focus:ring-electric/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <AssistantDrawer />

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="size-4" />
                {mounted && unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-electric ring-2 ring-background" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <button
                  onClick={() => dispatch(markAllRead())}
                  className="text-xs text-electric-soft hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    You're all caught up.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 transition-colors hover:bg-secondary/40"
                    >
                      <span
                        className={cn(
                          "mt-1 h-2 w-2 shrink-0 rounded-full",
                          n.read ? "bg-border" : "bg-electric"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        {n.body && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                        )}
                        <p className="mt-1 text-[11px] text-muted-foreground/70">
                          {formatRelative(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <button className="hidden h-9 w-9 place-items-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground sm:grid">
            <History className="size-4" />
          </button>

          {/* User menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-plasma/15 text-plasma-soft">
                    {mounted && name ? initials(name) : "··"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-1.5">
              <div className="border-b border-border/60 px-3 py-2.5">
                <p className="truncate text-sm font-semibold">{name || "Your account"}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary/60"
                >
                  <UserRound className="size-4" /> Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary/60"
                >
                  <SettingsIcon className="size-4" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-destructive/10"
                >
                  <LogOut className="size-4" /> Log out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <span className="sr-only">{subtitle}</span>
    </header>
  );
}
