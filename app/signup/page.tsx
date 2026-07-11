import SignupForm from "@/app/_components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-ink-soft">
        Sign up to post a place or contact a host.
      </p>
      <SignupForm />
    </div>
  );
}
