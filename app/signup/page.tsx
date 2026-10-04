import type { Metadata } from "next";
import AuthShell from "@/app/_components/AuthShell";
import SignupForm from "@/app/_components/SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Create your account"
      subtitle="You need one to post a place. Browsing and messaging hosts is open to everyone."
    >
      <SignupForm next={next} />
    </AuthShell>
  );
}
