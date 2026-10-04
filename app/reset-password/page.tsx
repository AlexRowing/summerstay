import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/app/_components/AuthShell";
import ResetPasswordForm from "@/app/_components/ResetPasswordForm";
import { button, size } from "@/app/_components/ui";
import { peekEmailToken } from "@/app/_lib/tokens";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const row = token ? await peekEmailToken(token, "reset_password") : null;

  if (!row) {
    return (
      <AuthShell
        title="This link has expired"
        subtitle="Reset links work once, for 1 hour. Request a fresh one and use the newest email."
      >
        <Link
          href="/forgot-password"
          className={`${button.primary} ${size.lg} mt-8 w-full`}
        >
          Send a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" subtitle={`For ${row.email}.`}>
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
