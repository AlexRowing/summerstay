"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthState } from "@/app/_lib/auth-actions";

const initialState: AuthState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";
const labelClass = "block text-sm font-medium";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Garcia"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
