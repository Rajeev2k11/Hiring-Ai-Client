import { QueryClient } from "@tanstack/react-query";

/**
 * Options for "live" queries that must reflect cross-client changes quickly
 * (e.g. a recruiter moving a candidate's stage shows up on the candidate's
 * screen, and a new application shows up for the recruiter — without a reload).
 *
 * We poll every few seconds and treat data as always stale so returning to the
 * tab refetches immediately. The backend has no websocket/SSE push yet, so this
 * polling is the near-real-time stand-in; swap to a socket later for instant.
 *
 * Polling automatically pauses while the tab is hidden (refetchIntervalInBackground
 * defaults to false), so idle background tabs don't hammer the API.
 */
export const LIVE = {
  refetchInterval: 5_000,
  staleTime: 0,
} as const;

/** App-wide React Query defaults. One factory so server + client agree. */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Long stale time → navigating back to a visited page is instant (no refetch).
        staleTime: 5 * 60_000,
        gcTime: 30 * 60_000,
        retry: (failureCount, error) => {
          const status = (error as { status?: number })?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        // Refetch when the user returns to the tab so they see the latest state.
        refetchOnWindowFocus: true,
      },
      mutations: { retry: 0 },
    },
  });
}
