"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { MARKETING_NAV } from "@/constants/brand";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1360px] items-center justify-between px-5 transition-all duration-300 lg:px-8",
          scrolled &&
            "mt-2 h-14 max-w-[1180px] rounded-2xl border border-border/70 bg-background/70 px-4 shadow-elevated backdrop-blur-xl"
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {MARKETING_NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full w-[28rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-1 gap-1 rounded-2xl border border-border/70 bg-popover/95 p-2 shadow-elevated backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/70"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {child.label}
                        </div>
                        {child.description && (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {child.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/book-demo">
              Book a demo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-secondary/40 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-3 mt-2 overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-3 shadow-elevated backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col">
              {MARKETING_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary/70"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild variant="brand" size="sm">
                  <Link href="/book-demo" onClick={() => setMobileOpen(false)}>
                    Book a demo
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
