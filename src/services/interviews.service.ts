import { apiClient } from "@/lib/api-client";
import { clone, nowISO, resolve, uid } from "./api-helpers";
import { APPLICATIONS, CANDIDATES, INTERVIEWS, JOBS, TEAM } from "./mock/seed";
import { InterviewStatus } from "@/types";
import type {
  Interview,
  InterviewCreateInput,
  InterviewUpdateInput,
  InterviewerSummary,
} from "@/types";

export const interviewsService = {
  list(status?: string | null): Promise<Interview[]> {
    return resolve(
      () =>
        clone(
          INTERVIEWS.filter((i) => (status ? i.status === status : true)).sort(
            (a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at)
          )
        ),
      async () =>
        (
          await apiClient.get("/recruiter/interviews", {
            params: { status: status || undefined },
          })
        ).data
    );
  },

  get(id: string): Promise<Interview> {
    return resolve(
      () => {
        const found = INTERVIEWS.find((i) => i.id === id);
        if (!found) throw { status: 404, message: "Interview not found" };
        return clone(found);
      },
      async () => (await apiClient.get(`/recruiter/interviews/${id}`)).data
    );
  },

  create(payload: InterviewCreateInput): Promise<Interview> {
    return resolve(
      () => {
        const app = APPLICATIONS.find((a) => a.id === payload.application_id);
        const cand = app && CANDIDATES.find((c) => c.id === app.candidate_id);
        const job = app && JOBS.find((j) => j.id === app.job_id);
        const interviewers: InterviewerSummary[] = (payload.interviewer_ids ?? [])
          .map((id) => TEAM.find((t) => t.id === id))
          .filter(Boolean)
          .map((m) => ({ id: m!.id, name: m!.name, email: m!.email }));
        const interview: Interview = {
          id: uid("int"),
          application_id: payload.application_id,
          candidate_id: cand?.id ?? "cand_0",
          candidate_name: cand?.name ?? "Candidate",
          candidate_email: cand?.email ?? "candidate@example.com",
          job_id: job?.id ?? "job_be",
          job_title: job?.title ?? "Role",
          stage: payload.stage,
          scheduled_at: payload.scheduled_at,
          duration_minutes: payload.duration_minutes ?? 60,
          timezone: payload.timezone ?? "UTC",
          platform: payload.platform ?? "OTHER",
          location: payload.location ?? null,
          status: InterviewStatus.SCHEDULED,
          notes: payload.notes ?? null,
          meeting_join_url: payload.auto_generate_meeting
            ? "https://meet.example.com/join"
            : null,
          meeting_host_url: null,
          meeting_external_id: null,
          interviewers,
          created_at: nowISO(),
          updated_at: nowISO(),
        };
        INTERVIEWS.push(interview);
        return clone(interview);
      },
      async () => (await apiClient.post("/recruiter/interviews", payload)).data
    );
  },

  update(id: string, payload: InterviewUpdateInput): Promise<Interview> {
    return resolve(
      () => {
        const interview = INTERVIEWS.find((i) => i.id === id);
        if (!interview) throw { status: 404, message: "Interview not found" };
        Object.assign(interview, payload, { updated_at: nowISO() });
        if (payload.interviewer_ids) {
          interview.interviewers = payload.interviewer_ids
            .map((iid) => TEAM.find((t) => t.id === iid))
            .filter(Boolean)
            .map((m) => ({ id: m!.id, name: m!.name, email: m!.email }));
        }
        return clone(interview);
      },
      async () => (await apiClient.patch(`/recruiter/interviews/${id}`, payload)).data
    );
  },

  remove(id: string): Promise<void> {
    return resolve(
      () => {
        const idx = INTERVIEWS.findIndex((i) => i.id === id);
        if (idx >= 0) INTERVIEWS.splice(idx, 1);
      },
      async () => {
        await apiClient.delete(`/recruiter/interviews/${id}`);
      }
    );
  },
};
