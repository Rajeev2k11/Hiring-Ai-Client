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

/**
 * Conversational AI Job Composer — app/schemas/recruiter/job_composer.py.
 * One-line intent -> guided flow -> composed description.
 */

export interface ComposerStartResponse {
  role: string;
  title_options: string[];
  department_options: string[];
  timeline: string | null;
  note: string;
}

export interface ComposerSkillsResponse {
  required: string[];
  nice_to_have: string[];
}

export interface ComposerSalary {
  currency: string;
  min_amount: number;
  max_amount: number;
  period: string; // "year" | "month"
}

export interface ComposerComposeInput {
  title: string;
  department?: string | null;
  location?: string | null;
  work_mode?: string | null; // Remote | Hybrid | On-site
  employment_type?: string | null; // Full-time | Part-time | Internship | Contract
  skills: string[];
  nice_to_have: string[];
  experience_min?: number | null;
  timeline?: string | null;
  salary?: ComposerSalary | null;
  extra_notes?: string | null;
}

export interface ComposerComposeResponse {
  description: string;
}
