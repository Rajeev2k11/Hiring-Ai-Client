"use client";

import dynamic from "next/dynamic";

/**
 * Client-only entry points for all 3D. `ssr: false` keeps three.js / R3F /
 * cobe entirely out of the server bundle (R3F touches React internals that
 * break SSR prerendering), and code-splits them into their own client chunks.
 */

function SceneFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-24 w-24 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-xl" />
    </div>
  );
}

function GlobeFallback() {
  return (
    <div className="aspect-square w-full max-w-[520px] animate-pulse rounded-full bg-electric/10 blur-md" />
  );
}

export const LazyPricingScene = dynamic(
  () => import("./scenes").then((m) => m.PricingScene),
  { ssr: false, loading: () => <SceneFallback /> }
);

export const LazyCompanyScene = dynamic(
  () => import("./scenes").then((m) => m.CompanyScene),
  { ssr: false, loading: () => <SceneFallback /> }
);

export const LazyCandidateScene = dynamic(
  () => import("./scenes").then((m) => m.CandidateScene),
  { ssr: false, loading: () => <SceneFallback /> }
);

export const LazyGlobe = dynamic(() => import("./Globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => <GlobeFallback />,
});
