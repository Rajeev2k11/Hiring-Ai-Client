"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { integrationsService } from "@/services";
import { queryKeys } from "@/lib/query-keys";

/**
 * Google connection status. Refetches on window focus so that returning to the
 * app after completing the OAuth consent flow (in another tab) reflects the
 * newly connected account without a manual refresh.
 */
export function useGoogleStatus() {
  return useQuery({
    queryKey: queryKeys.integrations.google,
    queryFn: () => integrationsService.googleStatus(),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

/**
 * Starts the OAuth flow and opens Google's consent screen in a new tab.
 * The backend handles the redirect callback and stores the refresh token.
 */
export function useConnectGoogle() {
  return useMutation({
    mutationFn: async () => {
      const { authorization_url } = await integrationsService.googleConnect();
      if (typeof window !== "undefined") {
        window.open(authorization_url, "_blank", "noopener,noreferrer");
      }
      return authorization_url;
    },
  });
}

export function useDisconnectGoogle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => integrationsService.googleDisconnect(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.integrations.google }),
  });
}
