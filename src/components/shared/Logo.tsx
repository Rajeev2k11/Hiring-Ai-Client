import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND } from "@/constants/brand";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  href?: string | null;
}

/** The Hiring OS mark — an orbiting talent-graph node, drawn as crisp SVG. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 text-white"
        strokeWidth={1.8}
        stroke="currentColor"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="5" cy="6" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
        <circle cx="19" cy="7.5" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
        <circle cx="6.5" cy="18.5" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
        <circle cx="18" cy="18" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
        <path d="M12 12 5 6M12 12l7-4.5M12 12l-5.5 6.5M12 12l6 6" opacity="0.6" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showWordmark = true,
  href = "/",
}: LogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      {showWordmark && (
        <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
          {BRAND.name}
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label={BRAND.name}>
      {content}
    </Link>
  );
}
