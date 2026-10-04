"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { reportListing, type ReportState } from "@/app/listings/actions";
import { REPORT_REASONS } from "@/app/_lib/format";
import { button, field, fieldError, label, size } from "@/app/_components/ui";

const initialState: ReportState = { status: "idle" };

// A quiet "Report this listing" link that expands into a short inline form.
export default function ReportListing({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    reportListing,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <p role="status" className="text-[15px] text-ink-soft">
        Thanks. A moderator will take a look.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
      >
        <Flag className="size-4" aria-hidden="true" />
        Report this listing
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-line p-5 motion-safe:animate-[rise-in_180ms_var(--ease-out-quart)]"
    >
      <input type="hidden" name="listingId" value={listingId} />
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset>
        <legend className="font-bold">
          What&apos;s wrong with this listing?
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(REPORT_REASONS).map(([value, text]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-[15px] transition-colors hover:bg-sunken has-[:checked]:border-brand-ink has-[:checked]:bg-brand-soft"
            >
              <input
                type="radio"
                name="reason"
                value={value}
                required
                className="accent-[var(--brand)]"
              />
              {text}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4">
        <label htmlFor="report-details" className={label}>
          Details <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <textarea
          id="report-details"
          name="details"
          rows={3}
          maxLength={1000}
          className={`${field} resize-y`}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="report-email" className={label}>
          Your email{" "}
          <span className="font-normal text-ink-soft">
            (optional, if we should follow up)
          </span>
        </label>
        <input id="report-email" name="email" type="email" className={field} />
      </div>
      {state.status === "error" && (
        <p role="alert" className={fieldError}>
          {state.error}
        </p>
      )}
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className={`${button.primary} ${size.md}`}
        >
          {pending ? "Sending…" : "Send report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={`${button.ghost} ${size.md}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
