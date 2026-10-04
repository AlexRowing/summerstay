"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { register, type AuthState } from "@/app/_lib/auth-actions";
import { collectFieldErrors } from "@/app/_lib/form-validation";
import PasswordInput from "@/app/_components/PasswordInput";
import {
  button,
  field,
  fieldError,
  hint,
  label,
  size,
  textLink,
} from "@/app/_components/ui";

const initialState: AuthState = {};

export default function SignupForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(register, initialState);
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
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="name" className={label}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={field}
        />
        <p className={hint}>Shown on your listings as the host.</p>
      </div>
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
        <label htmlFor="password" className={label}>
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          required
          minLength={8}
          data-label="Password"
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby="password-hint"
          onInput={() => clearError("password")}
        />
        {errors.password ? (
          <p className={fieldError}>{errors.password}</p>
        ) : (
          <p id="password-hint" className={hint}>
            At least 8 characters.
          </p>
        )}
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
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-[13px] leading-relaxed text-ink-soft">
        By signing up you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 hover:text-ink"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-ink"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <p className="text-center text-[15px] text-ink-soft">
        Already have an account?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className={textLink}
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
