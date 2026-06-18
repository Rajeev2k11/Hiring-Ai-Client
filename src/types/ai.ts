/**
 * AI authoring assist (Create New Job page) — stateless helpers, nothing
 * persisted. app/schemas/recruiter/job_assist.py
 */

export interface JobDraftContext {
  title: string;
  department?: string | null;
  location?: string | null;
  description?: string | null;
}

export interface ImprovedDescriptionResponse {
  improved_description: string;
}

export interface GeneratedRequirementsResponse {
  responsibilities: string[];
  qualifications: string[];
  nice_to_have: string[];
}

export interface SuggestedSalaryResponse {
  currency: string;
  min_amount: number;
  max_amount: number;
  period: string; // "year" | "month"
  rationale: string;
}
