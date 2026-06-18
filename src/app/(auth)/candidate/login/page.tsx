import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Candidate sign in",
  description: "Sign in to your Hiring OS candidate account and track your applications.",
};

export default function CandidateLoginPage() {
  return (
    <AuthShell variant="candidate">
      <LoginForm actor="candidate" />
    </AuthShell>
  );
}
