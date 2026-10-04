import type { Metadata } from "next";
import AuthShell from "@/app/_components/AuthShell";
import LoginForm from "@/app/_components/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;
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
      {reset === "1" && (
        <p
          role="status"
          className="mt-6 rounded-xl bg-success-soft px-4 py-3 text-[15px] font-medium"
        >
          Password updated. Log in with your new one.
        </p>
      )}
      <LoginForm next={next} />
    </AuthShell>
  );
}
