import type { Metadata } from "next";
import AuthShell from "@/app/_components/AuthShell";
import LoginForm from "@/app/_components/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const posting = next === "/host";

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        posting
          ? "Log in to post your place."
          : "Log in to manage your listings."
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
