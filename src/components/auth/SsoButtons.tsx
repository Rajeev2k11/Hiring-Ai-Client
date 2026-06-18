"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Decorative SSO providers — wired to a toast in the mock build. */
export function SsoButtons() {
  const notify = (provider: string) =>
    toast.info(`${provider} SSO is configured per workspace in this demo.`);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" onClick={() => notify("Google")} type="button">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="currentColor"
            d="M12 11v3.2h4.5c-.2 1.2-1.4 3.4-4.5 3.4-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.7 3.2 1.2l2.2-2.1C16.7 4.4 14.6 3.5 12 3.5 7.3 3.5 3.5 7.3 3.5 12s3.8 8.5 8.5 8.5c4.9 0 8.1-3.4 8.1-8.3 0-.6 0-1-.1-1.4H12z"
          />
        </svg>
        Google
      </Button>
      <Button variant="outline" onClick={() => notify("Microsoft")} type="button">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path fill="currentColor" d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z" />
        </svg>
        Microsoft
      </Button>
    </div>
  );
}
