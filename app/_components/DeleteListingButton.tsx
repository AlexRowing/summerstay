"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteListing } from "@/app/host/actions";
import { button, size } from "@/app/_components/ui";

function ConfirmDelete() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${button.danger} ${size.sm} flex-1`}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

// A two-step delete: the first click reveals an inline confirm (no native
// popup, no modal); the second runs the server action.
export default function DeleteListingButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`${button.dangerOutline} ${size.md} w-full`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Delete listing
      </button>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby="delete-title"
      className="rounded-xl border border-danger/30 bg-danger-soft p-4 motion-safe:animate-[rise-in_180ms_var(--ease-out-quart)]"
    >
      <p id="delete-title" className="font-semibold text-ink">
        Delete this listing?
      </p>
      <p className="mt-0.5 text-sm text-ink-soft">
        It comes down right away, along with any messages. This can&apos;t be
        undone.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          autoFocus
          onClick={() => setConfirming(false)}
          className={`${button.secondary} ${size.sm} flex-1`}
        >
          Keep it
        </button>
        <form action={deleteListing} className="flex flex-1">
          <input type="hidden" name="id" value={id} />
          <ConfirmDelete />
        </form>
      </div>
    </div>
  );
}
