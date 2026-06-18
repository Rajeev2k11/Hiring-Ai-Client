import { cn, hashUnit, initials } from "@/lib/utils";

interface UserAvatarProps {
  /** Used for the deterministic gradient and (if no name) nothing rendered. */
  seed: string;
  /** When present, initials are shown. */
  name?: string | null;
  size?: number;
  className?: string;
}

/**
 * Zero-network avatar: a deterministic gradient + initials. Replaces remote
 * avatar services so list/kanban pages don't fire dozens of image requests.
 */
export function UserAvatar({ seed, name, size = 40, className }: UserAvatarProps) {
  const hue = Math.floor(hashUnit(seed || name || "x") * 360);
  const bg = `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 48) % 360} 72% 42%))`;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-medium text-white",
        className
      )}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
    >
      {name ? initials(name) : null}
    </span>
  );
}
