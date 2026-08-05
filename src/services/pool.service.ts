import { api } from "@/lib/api-fetch";
import type { LinkedInManualImportInput, PoolCandidate } from "@/types";

/**
 * Candidate talent pool — real backend via the authenticated BFF proxy.
 * Builds the company's sourced pool that the matching engine ranks.
 */
export const poolService = {
  /** List the company's pool candidates — GET /recruiter/pool. */
  list(sourceType?: string): Promise<PoolCandidate[]> {
    const q = sourceType ? `?source_type=${encodeURIComponent(sourceType)}` : "";
    return api.get<PoolCandidate[]>(`recruiter/pool${q}`);
  },

  /** Upload a resume -> create a pool candidate — POST /recruiter/pool/upload-resume. */
  uploadResume(file: File): Promise<PoolCandidate> {
    const form = new FormData();
    form.append("file", file);
    return api.upload<PoolCandidate>("recruiter/pool/upload-resume", form);
  },

  /** Create/enrich a pool candidate from a URL — POST /recruiter/pool/enrich-url. */
  enrichUrl(url: string): Promise<PoolCandidate> {
    return api.post<PoolCandidate>("recruiter/pool/enrich-url", { url });
  },

  /**
   * Add a recruiter-entered, consented LinkedIn profile to the pool —
   * POST /recruiter/pool/linkedin-import. The URL is only stored as a
   * reference; nothing is fetched from LinkedIn.
   */
  importLinkedIn(input: LinkedInManualImportInput): Promise<PoolCandidate> {
    return api.post<PoolCandidate>("recruiter/pool/linkedin-import", input);
  },
};
