import { api } from "@/lib/api-fetch";
import type {
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
  /** Company's interviews, optionally filtered by status — GET /recruiter/interviews. */
  list(status?: string | null): Promise<Interview[]> {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return api.get<Interview[]>(`recruiter/interviews${q}`);
  },

  /** Single interview by id — GET /recruiter/interviews/{id}. */
  get(id: string): Promise<Interview> {
    return api.get<Interview>(`recruiter/interviews/${id}`);
  },

  /** Schedule an interview — POST /recruiter/interviews. */
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
