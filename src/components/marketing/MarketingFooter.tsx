import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { BRAND, FOOTER_NAV } from "@/constants/brand";

const socialIcons = { twitter: Twitter, linkedin: Linkedin, github: Github };

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-card/20">
      <div className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI hiring operating system. Source, screen, schedule, and hire
              with a system of autonomous agents.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {(
                [
                  { icon: Twitter, href: "https://x.com", label: "X" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: Github, href: "https://github.com", label: "GitHub" },
                ] as const
              ).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground transition-colors hover:border-electric/40 hover:text-electric-soft"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/resources#security" className="hover:text-foreground">
              Security
            </Link>
            <Link href="/resources" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/resources" className="hover:text-foreground">
              Terms
            </Link>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Oversized brand wordmark watermark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="bg-gradient-to-b from-foreground/[0.04] to-transparent bg-clip-text text-center font-display text-[18vw] font-extrabold leading-none text-transparent">
          {BRAND.name}
        </div>
      </div>
    </footer>
  );
}
