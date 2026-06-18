import type { ActorType } from "./enums";
import type { ISODateString } from "./common";

/** app/schemas/auth.py → CompanyUserResponse */
export interface CompanyUser {
  id: string;
  company_id: string;
  email: string;
  name: string;
  role: string;
}

/** app/schemas/auth.py → CandidateResponse (auth identity, minimal) */
export interface CandidateIdentity {
  id: string;
  name: string;
  email: string;
}

export type Identity = CompanyUser | CandidateIdentity;

/** app/schemas/auth.py → TokenResponse */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  actor_type: ActorType;
  identity: Identity;
}

/** app/schemas/auth.py → MeResponse */
export interface MeResponse {
  actor_type: ActorType;
  identity: Identity;
}

/** POST /auth/company/register */
export interface CompanyRegisterRequest {
  company_name: string;
  name: string;
  email: string;
  password: string;
}

/** POST /auth/candidate/register */
export interface CandidateRegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** POST /auth/{company,candidate}/login */
export interface LoginRequest {
  email: string;
  password: string;
}

export function isCompanyUser(identity: Identity): identity is CompanyUser {
  return (identity as CompanyUser).company_id !== undefined;
}

/** app/models/user_session.py / SessionResponse — Active Sessions row */
export interface UserSession {
  id: string;
  device_label: string | null;
  location: string | null;
  ip_address: string | null;
  created_at: ISODateString;
  last_active_at: ISODateString;
  is_current: boolean;
}
