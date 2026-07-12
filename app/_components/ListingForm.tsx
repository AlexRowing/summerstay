"use client";

import { useActionState, useState } from "react";
import type { HostFormState } from "@/app/host/actions";
import type { Listing } from "@/app/_lib/listings";
import { collectFieldErrors } from "@/app/_lib/form-validation";

type ListingAction = (
  prev: HostFormState,
  formData: FormData,
) => Promise<HostFormState>;

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";
const labelClass = "block text-sm font-medium";
const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400";

// One form for both "create" and "edit". Pass the matching action; pass an
// existing `listing` to prefill the fields (edit) or omit it (create).
export default function ListingForm({
  action,
  listing,
  submitLabel,
}: {
  action: ListingAction;
  listing?: Listing;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
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

  const err = (name: string) =>
    errors[name] ? <p className={errorClass}>{errors[name]}</p> : null;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 space-y-5"
    >
      {listing && <input type="hidden" name="id" value={listing.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          data-label="Title"
          defaultValue={listing?.title}
          placeholder="Sunny 2BR near central campus"
          className={inputClass}
          onInput={() => clearError("title")}
        />
        {err("title")}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            data-label="City"
            defaultValue={listing?.city}
            placeholder="Ann Arbor, MI"
            className={inputClass}
            onInput={() => clearError("city")}
          />
          {err("city")}
        </div>
        <div>
          <label htmlFor="neighborhood" className={labelClass}>
            Neighborhood
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            required
            data-label="Neighborhood"
            defaultValue={listing?.neighborhood}
            placeholder="Kerrytown"
            className={inputClass}
            onInput={() => clearError("neighborhood")}
          />
          {err("neighborhood")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="pricePerMonth" className={labelClass}>
            Price / month ($)
          </label>
          <input
            id="pricePerMonth"
            name="pricePerMonth"
            type="number"
            min="0"
            required
            data-label="Price"
            defaultValue={listing?.pricePerMonth}
            placeholder="950"
            className={inputClass}
            onInput={() => clearError("pricePerMonth")}
          />
          {err("pricePerMonth")}
        </div>
        <div>
          <label htmlFor="bedrooms" className={labelClass}>
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            required
            data-label="Bedrooms"
            defaultValue={listing?.bedrooms}
            placeholder="2"
            className={inputClass}
            onInput={() => clearError("bedrooms")}
          />
          {err("bedrooms")}
        </div>
        <div>
          <label htmlFor="bathrooms" className={labelClass}>
            Bathrooms
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            required
            data-label="Bathrooms"
            defaultValue={listing?.bathrooms}
            placeholder="1"
            className={inputClass}
            onInput={() => clearError("bathrooms")}
          />
          {err("bathrooms")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="distanceToCampus" className={labelClass}>
            Distance to campus
          </label>
          <input
            id="distanceToCampus"
            name="distanceToCampus"
            type="text"
            required
            data-label="Distance to campus"
            defaultValue={listing?.distanceToCampus}
            placeholder="0.4 miles from campus"
            className={inputClass}
            onInput={() => clearError("distanceToCampus")}
          />
          {err("distanceToCampus")}
        </div>
        <div>
          <label htmlFor="availability" className={labelClass}>
            Availability
          </label>
          <input
            id="availability"
            name="availability"
            type="text"
            required
            data-label="Availability"
            defaultValue={listing?.availability}
            placeholder="June 1 - Aug 20"
            className={inputClass}
            onInput={() => clearError("availability")}
          />
          {err("availability")}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          data-label="Description"
          defaultValue={listing?.description}
          placeholder="Tell subletters about the place, the neighborhood, and who it's good for."
          className={inputClass}
          onInput={() => clearError("description")}
        />
        {err("description")}
      </div>

      <div>
        <label htmlFor="amenities" className={labelClass}>
          Amenities
        </label>
        <input
          id="amenities"
          name="amenities"
          type="text"
          defaultValue={listing?.amenities.join(", ")}
          placeholder="Wi-Fi, Air conditioning, In-unit laundry"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Separate each amenity with a comma.
        </p>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          Photo URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          data-label="Photo URL"
          defaultValue={listing?.imageUrl}
          placeholder="https://images.unsplash.com/..."
          className={inputClass}
          onInput={() => clearError("imageUrl")}
        />
        {err("imageUrl")}
        <p className="mt-1 text-xs text-ink-soft">
          Optional. Paste an Unsplash image URL, or leave blank for a
          placeholder photo.
        </p>
      </div>

      {state.error && <p className={errorClass}>{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
