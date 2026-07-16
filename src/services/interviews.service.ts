import { api } from "@/lib/api-fetch";
import type {
  AvailabilityResponse,
  Interview,
  InterviewCreateInput,
  InterviewUpdateInput,
} from "@/types";

/**
 * Interviews — real backend integration via the authenticated BFF proxy.
 *
 * Maps to the company-scoped recruiter interview routes
 * (/recruiter/interviews/*). Every route derives the company from the
 * authenticated recruiter's token.
 */
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

  /** Single interview by id — GET /recruiter/interviews/{id}. */
  get(id: string): Promise<Interview> {
    return api.get<Interview>(`recruiter/interviews/${id}`);
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

  /** Manage / reschedule / cancel — PATCH /recruiter/interviews/{id}. */
  update(id: string, payload: InterviewUpdateInput): Promise<Interview> {
    return api.patch<Interview>(`recruiter/interviews/${id}`, payload);
  },

  /** Remove an interview — DELETE /recruiter/interviews/{id}. */
  remove(id: string): Promise<void> {
    return api.del<void>(`recruiter/interviews/${id}`);
  },
};
