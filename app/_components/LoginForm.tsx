"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { authenticate, type AuthState } from "@/app/_lib/auth-actions";
import { collectFieldErrors } from "@/app/_lib/form-validation";
import PasswordInput from "@/app/_components/PasswordInput";
import {
  button,
  field,
  fieldError,
  label,
  size,
  textLink,
} from "@/app/_components/ui";

const initialState: AuthState = {};

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    authenticate,
    initialState,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = collectFieldErrors(e.currentTarget);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setErrors(found);
    }
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 space-y-5"
    >
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          data-label="Email"
          autoComplete="email"
          placeholder="you@vt.edu"
          aria-invalid={errors.email ? true : undefined}
          className={field}
          onInput={() => clearError("email")}
        />
        {errors.email && <p className={fieldError}>{errors.email}</p>}
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className={label}>
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[13px] font-semibold text-brand-ink underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          required
          data-label="Password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          onInput={() => clearError("password")}
        />
        {errors.password && <p className={fieldError}>{errors.password}</p>}
      </div>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-[15px] font-medium text-danger"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} ${size.lg} w-full`}
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-[15px] text-ink-soft">
        New here?{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className={textLink}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
