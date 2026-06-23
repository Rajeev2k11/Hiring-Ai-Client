import { apiClient } from "@/lib/api-client";
import { api } from "@/lib/api-fetch";
import { clone, nowISO, resolve } from "./api-helpers";
import { INTERVIEWS, TEAM } from "./mock/seed";
import type {
  AvailabilityResponse,
  Interview,
  InterviewCreateInput,
  InterviewUpdateInput,
} from "@/types";

export const interviewsService = {
  /**
   * Live integration via the authenticated BFF proxy
   * (`/api/proxy/recruiter/interviews` → FastAPI `GET /api/v1/recruiter/interviews`).
   * Using the proxy means the JWT stays in the httpOnly cookie — the browser
   * sends it automatically and the proxy attaches the Bearer token server-side,
   * so client JS never touches the token. Supports `status`
   * (SCHEDULED | COMPLETED | CANCELLED) plus `skip`/`limit` pagination.
   */
  async list(
    params: { status?: string | null; skip?: number; limit?: number } = {}
  ): Promise<Interview[]> {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.skip != null) qs.set("skip", String(params.skip));
    if (params.limit != null) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const res = await fetch(`/api/proxy/recruiter/interviews${suffix}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Failed to load interviews");
    }
    return res.json();
  },

  /**
   * Live integration via the authenticated BFF proxy
   * (`/api/proxy/recruiter/interviews/availability` →
   * FastAPI `GET /api/v1/recruiter/interviews/availability`).
   * `date` (YYYY-MM-DD) is required; `interviewer_ids` is repeated per id.
   */
  async availability(params: {
    date: string;
    interviewer_ids?: string[];
    duration_minutes?: number;
    timezone?: string;
  }): Promise<AvailabilityResponse> {
    const qs = new URLSearchParams();
    qs.set("date", params.date);
    if (params.duration_minutes)
      qs.set("duration_minutes", String(params.duration_minutes));
    if (params.timezone) qs.set("timezone", params.timezone);
    (params.interviewer_ids ?? []).forEach((id) =>
      qs.append("interviewer_ids", id)
    );
    const res = await fetch(
      `/api/proxy/recruiter/interviews/availability?${qs.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Failed to load availability");
    }
    return res.json();
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

  /**
   * Live integration via the authenticated BFF proxy
   * (`/api/proxy/recruiter/interviews` → FastAPI `POST /api/v1/recruiter/interviews`).
   * Creates the interview, generating a meeting link when
   * `auto_generate_meeting` is set, and returns the created record.
   */
  create(payload: InterviewCreateInput): Promise<Interview> {
    return api.post<Interview>("recruiter/interviews", payload);
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
