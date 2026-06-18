import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create a candidate account",
  description: "Create your Hiring OS candidate profile and get matched to roles that fit.",
};

export default function CandidateRegisterPage() {
  return (
    <AuthShell variant="candidate">
      <RegisterForm actor="candidate" />
    </AuthShell>
  );
}
