import { createListing } from "@/app/host/actions";

// Shared styles so every field looks the same without repeating classes.
const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";
const labelClass = "block text-sm font-medium";

export default function HostPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">List your place</h1>
      <p className="mt-2 text-ink-soft">
        Post your apartment and find a subletter for the summer.
      </p>

      {/* When submitted, the form hands its fields to the createListing
          Server Action. No client-side JavaScript needed. */}
      <form action={createListing} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
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
            placeholder="https://images.unsplash.com/..."
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Optional. Paste an Unsplash image URL, or leave blank for a
            placeholder photo.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Publish listing
        </button>
      </form>
    </div>
  );
}
