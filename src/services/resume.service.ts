import { api } from "@/lib/api-fetch";
import type { Resume } from "@/types";

/**
 * Résumés — real backend integration via the authenticated BFF proxy. One
 * résumé per application: upload a PDF (multipart) and read it back. Maps to
 * /applications/{application_id}/resume.
 */
export const resumeService = {
  /** Get the résumé for an application — GET /applications/{id}/resume. */
  get(applicationId: string): Promise<Resume> {
    return api.get<Resume>(`applications/${applicationId}/resume`);
  },

  /** Upload a PDF résumé — POST /applications/{id}/resume (multipart). */
  upload(applicationId: string, file: File): Promise<Resume> {
    const form = new FormData();
    form.append("file", file);
    return api.upload<Resume>(`applications/${applicationId}/resume`, form);
  },
};
