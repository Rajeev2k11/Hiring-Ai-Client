import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Hiring OS password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell variant="company">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
