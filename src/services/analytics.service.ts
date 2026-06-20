import { api } from "@/lib/api-fetch";
import type { AnalyticsResponse } from "@/types";

/**
 * Recruiter Analytics — real backend integration via the authenticated BFF
 * proxy. Company-scoped metrics from GET /recruiter/analytics.
 */
export const analyticsService = {
  overview(): Promise<AnalyticsResponse> {
    return api.get<AnalyticsResponse>("recruiter/analytics");
  },
};
