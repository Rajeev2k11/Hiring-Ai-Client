import { QueryClient } from "@tanstack/react-query";

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
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}
