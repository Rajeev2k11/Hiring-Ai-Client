import { apiClient } from "@/lib/api-client";
import { resolve } from "./api-helpers";
import { APPLICATIONS, JOBS } from "./mock/seed";
import { ApplicationStatus } from "@/types";
import type { AnalyticsResponse, FunnelStage, SourceQualityItem } from "@/types";

const SCREENED = new Set<string>([
  ApplicationStatus.SCREENING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
]);
const INTERVIEWED = new Set<string>([
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
]);
const OFFERED = new Set<string>([ApplicationStatus.OFFER, ApplicationStatus.HIRED]);
const HIRED = new Set<string>([ApplicationStatus.HIRED]);

function pct(n: number, total: number) {
  return total ? Math.round((n / total) * 1000) / 10 : 0;
}

export const analyticsService = {
  overview(): Promise<AnalyticsResponse> {
    return resolve(
      () => {
        const total = APPLICATIONS.length;
        const countIn = (set: Set<string>) =>
          APPLICATIONS.filter((a) => set.has(a.status)).length;
        const screened = countIn(SCREENED);
        const interviewed = countIn(INTERVIEWED);
        const offered = countIn(OFFERED);
        const hired = countIn(HIRED);

        const funnel: FunnelStage[] = [
          { stage: "Applied", count: total, percentage: pct(total, total) },
          { stage: "Screened", count: screened, percentage: pct(screened, total) },
          { stage: "Interviewed", count: interviewed, percentage: pct(interviewed, total) },
          { stage: "Offer", count: offered, percentage: pct(offered, total) },
          { stage: "Hired", count: hired, percentage: pct(hired, total) },
        ];

        const sources = new Map<string, { applications: number; hired: number; scoreSum: number; scoreN: number }>();
        APPLICATIONS.forEach((a) => {
          const key = a.source ?? "Other";
          const agg = sources.get(key) ?? { applications: 0, hired: 0, scoreSum: 0, scoreN: 0 };
          agg.applications += 1;
          if (a.status === ApplicationStatus.HIRED) agg.hired += 1;
          if (a.match_score !== null) {
            agg.scoreSum += a.match_score;
            agg.scoreN += 1;
          }
          sources.set(key, agg);
        });
        const source_quality: SourceQualityItem[] = [...sources.entries()]
          .map(([source, v]) => ({
            source,
            applications: v.applications,
            hired: v.hired,
            avg_match_score: v.scoreN ? Math.round((v.scoreSum / v.scoreN) * 10) / 10 : null,
          }))
          .sort((a, b) => b.applications - a.applications);

        return {
          metrics: [
            {
              key: "offer_acceptance",
              label: "Offer Acceptance",
              value: offered ? pct(hired, offered) : null,
              unit: "%",
              available: offered > 0,
              note: offered ? null : "No offers extended yet.",
            },
            { key: "pipeline_velocity", label: "Pipeline Velocity", value: null, unit: "x", available: false, note: "Requires stage-transition history (not tracked yet)." },
            { key: "quality_of_hire", label: "Quality of Hire", value: null, unit: "/10", available: false, note: "Requires post-hire performance data (not tracked yet)." },
            { key: "cost_per_hire", label: "Cost per Hire", value: null, unit: "$", available: false, note: "Requires recruiting cost data (not tracked yet)." },
          ],
          funnel,
          source_quality,
          total_applications: total,
          total_jobs: JOBS.length,
        };
      },
      async () => (await apiClient.get("/recruiter/analytics")).data
    );
  },
};
