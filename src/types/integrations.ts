/**
 * Recruiter integrations — Google Calendar / Meet OAuth.
 * Maps to /api/v1/recruiter/integrations/google/*.
 */

/** GET /recruiter/integrations/google/status → status payload */
export interface GoogleIntegrationStatus {
  connected: boolean;
  connected_email: string | null;
  /** Whether the backend has OAuth client id/secret configured. */
  oauth_configured: boolean;
}

/** GET /recruiter/integrations/google/connect → authorization URL to open */
export interface GoogleConnectResponse {
  authorization_url: string;
}
