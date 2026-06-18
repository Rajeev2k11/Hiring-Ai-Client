import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create a company account",
  description: "Create your Hiring OS company account and start hiring with autonomous agents.",
};

export default function CompanyRegisterPage() {
  return (
    <AuthShell variant="company">
      <RegisterForm actor="company" />
    </AuthShell>
  );
}
