/**
 * Centralized, type-safe query keys. Keeping every key in one place makes
 * invalidation predictable across the app.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    jobs: (status?: string) => ["dashboard", "jobs", { status }] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    list: (status?: string) => ["jobs", "list", { status }] as const,
    detail: (id: string) => ["jobs", "detail", id] as const,
  },
  candidates: {
    all: ["candidates"] as const,
    list: (filters: { status?: string; job_id?: string }) =>
      ["candidates", "list", filters] as const,
    detail: (applicationId: string) =>
      ["candidates", "detail", applicationId] as const,
  },
  applications: {
    all: ["applications"] as const,
    list: (filters: { job_id?: string; status?: string }) =>
      ["applications", "list", filters] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
    evaluation: (id: string) => ["applications", "evaluation", id] as const,
  },
  resume: {
    detail: (applicationId: string) =>
      ["resume", "detail", applicationId] as const,
  },
  interviews: {
    all: ["interviews"] as const,
    list: (status?: string) => ["interviews", "list", { status }] as const,
    detail: (id: string) => ["interviews", "detail", id] as const,
    availability: (params: Record<string, unknown>) =>
      ["interviews", "availability", params] as const,
  },
  sourcing: {
    providers: ["sourcing", "providers"] as const,
    runs: ["sourcing", "runs"] as const,
    run: (id: string) => ["sourcing", "run", id] as const,
    runCandidates: (id: string, selectedOnly: boolean) =>
      ["sourcing", "run", id, "candidates", { selectedOnly }] as const,
  },
  matching: {
    run: (runId: string) => ["matching", "run", runId] as const,
    candidates: (jobId: string, filters: { min_score?: number; status?: string }) =>
      ["matching", "candidates", jobId, filters] as const,
    match: (matchId: string) => ["matching", "match", matchId] as const,
  },
  pool: {
    list: (source_type?: string) => ["pool", "list", { source_type }] as const,
  },
  analytics: {
    overview: ["analytics", "overview"] as const,
  },
  settings: {
    profile: ["settings", "profile"] as const,
    sessions: ["settings", "sessions"] as const,
  },
  company: {
    status: ["company", "status"] as const,
  },
  team: {
    members: ["team", "members"] as const,
    invites: ["team", "invites"] as const,
  },
} as const;
