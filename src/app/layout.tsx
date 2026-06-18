import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";

import { AppProviders } from "@/providers/AppProviders";
import { BRAND } from "@/constants/brand";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.descriptor}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Hiring OS is the AI-first recruitment operating system. Source, screen, schedule, and hire with a system of autonomous agents. The future of autonomous hiring.",
  keywords: [
    "AI recruiting",
    "hiring software",
    "applicant tracking system",
    "autonomous hiring",
    "AI sourcing",
    "AI screening",
    "talent acquisition",
  ],
  authors: [{ name: BRAND.name }],
  metadataBase: new URL(`https://${BRAND.domain}`),
  openGraph: {
    title: `${BRAND.name} — ${BRAND.descriptor}`,
    description: "The future of autonomous hiring.",
    type: "website",
    siteName: BRAND.name,
  },
  twitter: { card: "summary_large_image", title: BRAND.name },
};

export const viewport: Viewport = {
  themeColor: "#070a16",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          inter.variable,
          sora.variable,
          jetbrains.variable,
          "min-h-screen bg-background font-sans text-foreground antialiased"
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
