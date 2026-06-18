/** Shared API primitives. */

/** ISO-8601 datetime string as serialized by FastAPI/Pydantic. */
export type ISODateString = string;

/** Standard list-pagination query (skip/limit) used across list endpoints. */
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

/** Normalized error surfaced by the API client to the UI. */
export interface ApiError {
  status: number;
  /** Human-readable message (FastAPI `detail`, flattened if it was a list). */
  message: string;
  /** Raw detail payload when present (e.g. 422 validation errors). */
  detail?: unknown;
}

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";
