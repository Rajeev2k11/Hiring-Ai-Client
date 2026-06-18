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
    detail: (id: string) => ["applications", "detail", id] as const,
    evaluation: (id: string) => ["applications", "evaluation", id] as const,
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
  analytics: {
    overview: ["analytics", "overview"] as const,
  },
  settings: {
    profile: ["settings", "profile"] as const,
    sessions: ["settings", "sessions"] as const,
  },
  team: {
    members: ["team", "members"] as const,
  },
} as const;
