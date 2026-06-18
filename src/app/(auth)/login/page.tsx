import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Company sign in",
  description: "Sign in to your Hiring OS company workspace.",
};

export default function CompanyLoginPage() {
  return (
    <AuthShell variant="company">
      <LoginForm actor="company" />
    </AuthShell>
  );
}
