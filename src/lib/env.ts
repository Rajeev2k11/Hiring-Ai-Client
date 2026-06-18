/** Centralized, typed access to public runtime config. */

export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
  /**
   * When true, the service layer resolves against in-memory mock data instead
   * of the network. Flip to "false" (env) to wire the real FastAPI backend —
   * the service contracts are identical, so nothing else changes.
   */
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true") !== "false",
  isProd: process.env.NODE_ENV === "production",
} as const;

export const AUTH_STORAGE_KEY = "hiring_os_token";
