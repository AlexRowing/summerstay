import LoginForm from "@/app/_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
      <p className="mt-2 text-ink-soft">Welcome back to SummerStay.</p>
      <LoginForm />
    </div>
  );
}
