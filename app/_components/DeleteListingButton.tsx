"use client";

import { deleteListing } from "@/app/host/actions";

// A delete button that asks for confirmation before firing the server action.
// The confirm needs to run in the browser, so this is a small Client Component.
export default function DeleteListingButton({ id }: { id: string }) {
  return (
    <form
      action={deleteListing}
      onSubmit={(e) => {
        if (!confirm("Delete this listing? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="w-full rounded-full border border-red-300 px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
      >
        Delete listing
      </button>
    </form>
  );
}
