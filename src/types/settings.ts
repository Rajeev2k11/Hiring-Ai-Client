import type { ISODateString } from "./common";

/** app/schemas/recruiter/settings.py → ProfileResponse */
export interface Profile {
  id: string;
  company_id: string;
  name: string;
  email: string;
  role: string;
  email_updates: boolean;
  application_updates: boolean;
  created_at: ISODateString;
}

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
}

export interface PasswordChangeInput {
  current_password: string;
  new_password: string;
}

export interface NotificationUpdateInput {
  email_updates?: boolean;
  application_updates?: boolean;
}

export interface DeleteAccountInput {
  password: string;
}
