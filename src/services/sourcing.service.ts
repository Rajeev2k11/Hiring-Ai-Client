import { apiClient } from "@/lib/api-client";
import { clone, nowISO, resolve, uid } from "./api-helpers";
import { SOURCING_MATCHES, SOURCING_RUNS } from "./mock/seed";
import { SourcingRunStatus } from "@/types";
import type {
  ProvidersResponse,
  SourcingMatch,
  SourcingRun,
  SourcingRunCreateInput,
} from "@/types";

export const sourcingService = {
  providers(): Promise<ProvidersResponse> {
    return resolve(
      () => ({ providers: ["internal", "github"] }),
      async () => (await apiClient.get("/recruiter/sourcing/providers")).data
    );
  },

  listRuns(): Promise<SourcingRun[]> {
    return resolve(
      () =>
        clone(
          [...SOURCING_RUNS].sort(
            (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
          )
        ),
      async () => (await apiClient.get("/recruiter/sourcing/runs")).data
    );
  },

  getRun(id: string): Promise<SourcingRun> {
    return resolve(
      () => {
        const run = SOURCING_RUNS.find((r) => r.id === id);
        if (!run) throw { status: 404, message: "Run not found" };
        return clone(run);
      },
      async () => (await apiClient.get(`/recruiter/sourcing/runs/${id}`)).data
    );
  },

  runCandidates(id: string, selectedOnly = false): Promise<SourcingMatch[]> {
    return resolve(
      () => {
        const matches = SOURCING_MATCHES[id] ?? [];
        return clone(
          matches
            .filter((m) => (selectedOnly ? m.selected : true))
            .sort((a, b) => b.score - a.score)
        );
      },
      async () =>
        (
          await apiClient.get(`/recruiter/sourcing/runs/${id}/candidates`, {
            params: { selected_only: selectedOnly },
          })
        ).data
    );
  },

  startRun(payload: SourcingRunCreateInput): Promise<SourcingRun> {
    return resolve(
      () => {
        const run: SourcingRun = {
          id: uid("run"),
          job_id: payload.job_id,
          threshold: payload.threshold ?? 80,
          status: SourcingRunStatus.PENDING,
          total_candidates: 0,
          evaluated_count: 0,
          selected_count: 0,
          error: null,
          created_at: nowISO(),
          completed_at: null,
        };
        SOURCING_RUNS.unshift(run);
        return clone(run);
      },
      async () => (await apiClient.post("/recruiter/sourcing/runs", payload)).data
    );
  },
};
