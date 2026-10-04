"use client";

import { useActionState, useState } from "react";
import { CircleCheck } from "lucide-react";
import { createInquiry, type InquiryState } from "@/app/listings/actions";
import { collectFieldErrors } from "@/app/_lib/form-validation";
import { button, field, fieldError, label, size } from "@/app/_components/ui";

const initialState: InquiryState = { status: "idle" };

export default function ContactForm({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const [state, formAction, pending] = useActionState(
    createInquiry,
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
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="mt-4 rounded-xl bg-success-soft p-5 motion-safe:animate-[rise-in_220ms_var(--ease-out-quart)]"
      >
        <p className="flex items-center gap-2 font-semibold text-ink">
          <CircleCheck className="size-5 text-success" aria-hidden="true" />
          Message sent
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
          Your message is in the host&apos;s SummerStay inbox. They&apos;ll
          reply to the email you gave.
        </p>
      </div>
    );
  }

  const invalid = (name: string) => (errors[name] ? true : undefined);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="mt-4 space-y-4"
    >
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <label htmlFor="name" className={label}>
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          data-label="Name"
          aria-invalid={invalid("name")}
          className={field}
          onInput={() => clearError("name")}
        />
        {errors.name && <p className={fieldError}>{errors.name}</p>}
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
          autoComplete="email"
          data-label="Email"
          placeholder="you@vt.edu"
          aria-invalid={invalid("email")}
          className={field}
          onInput={() => clearError("email")}
        />
        {errors.email && <p className={fieldError}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message" className={label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          data-label="Message"
          aria-invalid={invalid("message")}
          defaultValue={`Hi! Is "${listingTitle}" still available? I'm looking for a place for `}
          className={`${field} resize-y`}
          onInput={() => clearError("message")}
        />
        {errors.message && <p className={fieldError}>{errors.message}</p>}
      </div>
      {state.status === "error" && (
        <p role="alert" className={fieldError}>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} ${size.lg} w-full`}
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
