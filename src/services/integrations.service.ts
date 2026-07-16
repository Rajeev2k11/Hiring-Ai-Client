import { api } from "@/lib/api-fetch";
import type {
  GoogleConnectResponse,
  GoogleIntegrationStatus,
} from "@/types";

/**
 * Recruiter integrations — Google Calendar / Meet OAuth, via the authenticated
 * BFF proxy. Maps 1:1 to /api/v1/recruiter/integrations/google/*.
 *
 * Note: the OAuth `callback` is handled server-side (Google redirects straight
 * to the backend), so the client only needs connect / status / disconnect.
 */
export const integrationsService = {
  /** Current Google connection state for the company. */
  googleStatus(): Promise<GoogleIntegrationStatus> {
    return api.get<GoogleIntegrationStatus>(
      "recruiter/integrations/google/status"
    );
  },

  /** Begin the OAuth flow — returns the Google consent URL to open. */
  googleConnect(): Promise<GoogleConnectResponse> {
    return api.get<GoogleConnectResponse>(
      "recruiter/integrations/google/connect"
    );
  },

  /** Revoke the stored refresh token / disconnect the account. */
  googleDisconnect(): Promise<void> {
    return api.del<void>("recruiter/integrations/google/disconnect");
  },
};
