/**
 * Axios instance + interceptors. This is the single seam between the frontend
 * and the FastAPI backend. While `env.useMocks` is true the service layer never
 * actually calls this (it resolves mock data); it exists so flipping to live
 * data is a one-flag change with auth + error-normalization already wired.
 */
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env, AUTH_STORAGE_KEY } from "./env";
import type { ApiError } from "@/types";

let inMemoryToken: string | null = null;

/** Set/clear the bearer token (called by the auth slice on login/logout). */
export function setAuthToken(token: string | null) {
  inMemoryToken = token;
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  else window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window === "undefined") return null;
  inMemoryToken = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return inMemoryToken;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/** Flatten FastAPI error payloads (string or 422 list) into one message. */
function normalizeError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data as
    | { detail?: unknown }
    | undefined;
  let message = error.message || "Something went wrong";

  const detail = data?.detail;
  if (typeof detail === "string") {
    message = detail;
  } else if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    message = first?.msg ?? "Validation error";
  } else if (status === 0) {
    message = "Network error — is the API reachable?";
  }

  return { status, message, detail };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error))
);
