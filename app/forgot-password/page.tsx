import type { Metadata } from "next";
import AuthShell from "@/app/_components/AuthShell";
import ForgotPasswordForm from "@/app/_components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we'll send you a link to choose a new one."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
