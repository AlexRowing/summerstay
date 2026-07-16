import type { Metadata } from "next";
import SignupForm from "@/app/_components/SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-line bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Sign up to post a place or contact a host.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
