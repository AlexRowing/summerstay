"use client";

import { useActionState } from "react";
import type { HostFormState } from "@/app/host/actions";
import type { Listing } from "@/app/_lib/listings";

type ListingAction = (
  prev: HostFormState,
  formData: FormData,
) => Promise<HostFormState>;

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";
const labelClass = "block text-sm font-medium";

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

  return (
    <form action={formAction} className="mt-8 space-y-5">
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
          defaultValue={listing?.title}
          placeholder="Sunny 2BR near central campus"
          className={inputClass}
        />
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
            defaultValue={listing?.city}
            placeholder="Ann Arbor, MI"
            className={inputClass}
          />
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
            defaultValue={listing?.neighborhood}
            placeholder="Kerrytown"
            className={inputClass}
          />
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
            defaultValue={listing?.pricePerMonth}
            placeholder="950"
            className={inputClass}
          />
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
            defaultValue={listing?.bedrooms}
            placeholder="2"
            className={inputClass}
          />
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
            defaultValue={listing?.bathrooms}
            placeholder="1"
            className={inputClass}
          />
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
            defaultValue={listing?.distanceToCampus}
            placeholder="0.4 miles from campus"
            className={inputClass}
          />
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
            defaultValue={listing?.availability}
            placeholder="June 1 - Aug 20"
            className={inputClass}
          />
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
          defaultValue={listing?.description}
          placeholder="Tell subletters about the place, the neighborhood, and who it's good for."
          className={inputClass}
        />
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
          defaultValue={listing?.imageUrl}
          placeholder="https://images.unsplash.com/..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Optional. Paste an Unsplash image URL, or leave blank for a
          placeholder photo.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

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
