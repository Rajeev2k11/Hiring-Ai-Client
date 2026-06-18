"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <QueryProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-card/90 !border-border !text-foreground !backdrop-blur-xl",
              },
            }}
          />
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
