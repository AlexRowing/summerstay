import LoginForm from "@/app/_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-line bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
        <p className="mt-1 text-sm text-ink-soft">Welcome back to SummerStay.</p>
        <LoginForm />
      </div>
    </div>
  );
}
