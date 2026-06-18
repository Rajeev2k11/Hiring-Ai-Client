/** app/schemas/recruiter/analytics.py → MetricCard */
export interface MetricCard {
  key: string;
  label: string;
  value: number | null;
  unit: string | null; // "%", "/10", "$", "x"
  available: boolean;
  note: string | null;
}

/** app/schemas/recruiter/analytics.py → FunnelStage */
export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

/** app/schemas/recruiter/analytics.py → SourceQualityItem */
export interface SourceQualityItem {
  source: string;
  applications: number;
  hired: number;
  avg_match_score: number | null;
}

/** GET /recruiter/analytics → AnalyticsResponse */
export interface AnalyticsResponse {
  metrics: MetricCard[];
  funnel: FunnelStage[];
  source_quality: SourceQualityItem[];
  total_applications: number;
  total_jobs: number;
}
