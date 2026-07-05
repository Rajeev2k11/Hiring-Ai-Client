/**
 * LEGACY / UNUSED — kept for reference only.
 *
 * The real auth flow runs entirely through the BFF: components use `useAuth`
 * (src/hooks/useAuth.ts), which calls `authClient` (src/services/auth-client.ts)
 * → the Next route handlers under src/app/api/auth/*. Nothing in the app imports
 * `authService` at a call site anymore (it is only re-exported by the services
 * barrel). Do not wire new code to this module; use `authClient`/`useAuth`.
 */
import { apiClient } from "@/lib/api-client";
import { clone, resolve, uid } from "./api-helpers";
import { COMPANY, TEAM } from "./mock/seed";
import type {
  CandidateRegisterRequest,
  CompanyRegisterRequest,
  CompanyUser,
  LoginRequest,
  MeResponse,
  TokenResponse,
} from "@/types";

const demoUser: CompanyUser = {
  id: TEAM[0].id,
  company_id: COMPANY.id,
  email: TEAM[0].email,
  name: TEAM[0].name,
  role: TEAM[0].role,
};

function mockToken(): string {
  return `mock.${uid("jwt")}.${Date.now()}`;
}

export const authService = {
  loginCompany(payload: LoginRequest): Promise<TokenResponse> {
    return resolve(
      () => ({
        access_token: mockToken(),
        token_type: "bearer",
        actor_type: "company_user",
        identity: { ...demoUser, email: payload.email || demoUser.email },
      }),
      async () =>
        (await apiClient.post("/auth/company/login", payload)).data
    );
  },

  registerCompany(payload: CompanyRegisterRequest): Promise<TokenResponse> {
    return resolve(
      () => ({
        access_token: mockToken(),
        token_type: "bearer",
        actor_type: "company_user",
        identity: {
          ...demoUser,
          name: payload.name,
          email: payload.email,
          role: "ADMIN",
        },
      }),
      async () =>
        (await apiClient.post("/auth/company/register", payload)).data
    );
  },

  loginCandidate(payload: LoginRequest): Promise<TokenResponse> {
    return resolve(
      () => ({
        access_token: mockToken(),
        token_type: "bearer",
        actor_type: "candidate",
        identity: { id: uid("cand"), name: "Jordan Lee", email: payload.email },
      }),
      async () =>
        (await apiClient.post("/auth/candidate/login", payload)).data
    );
  },

  registerCandidate(payload: CandidateRegisterRequest): Promise<TokenResponse> {
    return resolve(
      () => ({
        access_token: mockToken(),
        token_type: "bearer",
        actor_type: "candidate",
        identity: { id: uid("cand"), name: payload.name, email: payload.email },
      }),
      async () =>
        (await apiClient.post("/auth/candidate/register", payload)).data
    );
  },

  me(): Promise<MeResponse> {
    return resolve(
      () => ({ actor_type: "company_user", identity: clone(demoUser) }),
      async () => (await apiClient.get("/auth/me")).data
    );
  },
};
