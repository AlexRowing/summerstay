"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import type { HostFormState } from "@/app/host/actions";
import type { Listing } from "@/app/_lib/listings";
import { collectFieldErrors } from "@/app/_lib/form-validation";
import {
  TERMS,
  formatRange,
  fromDateInput,
  nextTermDates,
  PLACEHOLDER_IMAGE,
  safeImageUrl,
  toDateInput,
  type Term,
} from "@/app/_lib/format";
import ListingCard, { type CardData } from "@/app/_components/ListingCard";
import PhotoUploader from "@/app/_components/PhotoUploader";
import {
  button,
  field,
  fieldError,
  hint,
  label,
  size,
} from "@/app/_components/ui";

type ListingAction = (
  prev: HostFormState,
  formData: FormData,
) => Promise<HostFormState>;

// One-tap amenities that cover most student places. Anything else goes in
// the free-text "Other" field.
const COMMON_AMENITIES = [
  "Furnished",
  "Wi-Fi",
  "Air conditioning",
  "In-unit laundry",
  "Dishwasher",
  "Parking",
  "Utilities included",
  "On the bus line",
  "Pool",
  "Gym",
  "Pet friendly",
  "Private bathroom",
];

// "May 15 - Aug 15, 2027" from the two date inputs, or a placeholder.
function draftDates(start: string, end: string) {
  const s = fromDateInput(start);
  const e = fromDateInput(end);
  return {
    availability: s && e ? formatRange(s, e) : "Dates",
    startDate: s,
  };
}

// Everything the preview card shows except the photo, read from the form.
function readDraft(form: HTMLFormElement): Omit<CardData, "imageUrl"> {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const num = (name: string) => {
    const n = Number(text(name));
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
  };
  return {
    title: text("title") || "Your listing title",
    neighborhood: text("neighborhood") || "Neighborhood",
    distanceToCampus: text("distanceToCampus") || "Distance to campus",
    ...draftDates(text("startDate"), text("endDate")),
    bedrooms: num("bedrooms"),
    bathrooms: num("bathrooms"),
    pricePerMonth: num("pricePerMonth"),
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-line pt-8 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="contents">
        <span className="block text-lg font-bold">{title}</span>
      </legend>
      <p className="mt-1 text-[15px] text-ink-soft">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </fieldset>
  );
}

// One form for both "create" and "edit". Pass the matching action; pass an
// existing `listing` to prefill the fields (edit) or omit it (create). A live
// card preview beside the form shows exactly what students will see.
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
  const [draft, setDraft] = useState<CardData>(() => ({
    title: listing?.title || "Your listing title",
    neighborhood: listing?.neighborhood || "Neighborhood",
    distanceToCampus: listing?.distanceToCampus || "Distance to campus",
    availability: listing?.availability || "Dates",
    startDate: listing?.startDate ?? null,
    bedrooms: listing?.bedrooms ?? 0,
    bathrooms: listing?.bathrooms ?? 0,
    pricePerMonth: listing?.pricePerMonth ?? 0,
    imageUrl: safeImageUrl(listing?.imageUrl ?? ""),
  }));

  const initialAmenities = listing?.amenities ?? [];
  const [picked, setPicked] = useState<string[]>(
    initialAmenities.filter((a) => COMMON_AMENITIES.includes(a)),
  );
  const [otherAmenities, setOtherAmenities] = useState(
    initialAmenities.filter((a) => !COMMON_AMENITIES.includes(a)).join(", "),
  );
  const [startDate, setStartDate] = useState(toDateInput(listing?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(listing?.endDate));
  const today = toDateInput(new Date());

  function applyTerm(term: Term) {
    const [start, end] = nextTermDates(term);
    setStartDate(start);
    setEndDate(end);
    clearError("startDate");
    clearError("endDate");
    setDraft((d) => ({ ...d, ...draftDates(start, end) }));
  }
  const activeTerm = TERMS.find((t) => {
    const [start, end] = nextTermDates(t);
    return start === startDate && end === endDate;
  });

  const amenities = [
    ...picked,
    ...otherAmenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
  ].join(", ");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = collectFieldErrors(e.currentTarget);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setErrors(found);
      // Bring the first problem into view.
      const first = e.currentTarget.querySelector<HTMLElement>(
        `[name="${Object.keys(found)[0]}"]`,
      );
      first?.focus();
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

  function toggleAmenity(name: string) {
    setPicked((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  }

  // Props shared by every validated text input.
  const bind = (name: string, fieldLabel: string) => ({
    id: name,
    name,
    "data-label": fieldLabel,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onInput: () => clearError(name),
  });
  const err = (name: string) =>
    errors[name] ? (
      <p id={`${name}-error`} className={fieldError}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
      <form
        action={formAction}
        onSubmit={handleSubmit}
        onChange={(e) => {
          const form = e.currentTarget;
          setDraft((d) => ({ ...d, ...readDraft(form) }));
        }}
        noValidate
        className="space-y-10"
      >
        {listing && <input type="hidden" name="id" value={listing.id} />}
        <input type="hidden" name="amenities" value={amenities} />

        <Section title="The place" description="The basics students search by.">
          <div>
            <label htmlFor="title" className={label}>
              Listing title
            </label>
            <input
              {...bind("title", "Title")}
              type="text"
              required
              maxLength={80}
              defaultValue={listing?.title}
              placeholder="Sunny 2BR near the Drillfield"
              className={field}
            />
            {err("title")}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="neighborhood" className={label}>
                Neighborhood or complex
              </label>
              <input
                {...bind("neighborhood", "Neighborhood")}
                type="text"
                required
                defaultValue={listing?.neighborhood}
                placeholder="Foxridge"
                className={field}
              />
              {err("neighborhood")}
            </div>
            <div>
              <label htmlFor="city" className={label}>
                City
              </label>
              <input
                {...bind("city", "City")}
                type="text"
                required
                defaultValue={listing?.city ?? "Blacksburg, VA"}
                className={field}
              />
              {err("city")}
            </div>
          </div>
          <div>
            <label htmlFor="distanceToCampus" className={label}>
              Distance to campus
            </label>
            <input
              {...bind("distanceToCampus", "Distance to campus")}
              type="text"
              required
              defaultValue={listing?.distanceToCampus}
              placeholder="0.5 miles from campus"
              className={field}
            />
            {err("distanceToCampus")}
          </div>
        </Section>

        <Section
          title="Dates and price"
          description="Be specific. Clear dates get more replies."
        >
          <div>
            <span className={label} id="dates-label">
              Dates
            </span>
            <div
              role="group"
              aria-label="Fill in typical dates for a term"
              className="mb-3 flex flex-wrap gap-2"
            >
              {TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  aria-pressed={activeTerm === term}
                  onClick={() => applyTerm(term)}
                  className={`h-8 rounded-lg border px-3 text-sm font-medium transition-colors ${
                    activeTerm === term
                      ? "border-brand-ink bg-brand-soft text-brand-ink"
                      : "border-line-strong text-ink-soft hover:border-ink-faint hover:text-ink"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-1 block text-[13px] text-ink-soft"
                >
                  Move-in
                </label>
                <input
                  {...bind("startDate", "Move-in date")}
                  type="date"
                  required
                  min={listing ? undefined : today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={field}
                />
                {err("startDate")}
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-1 block text-[13px] text-ink-soft"
                >
                  Move-out
                </label>
                <input
                  {...bind("endDate", "Move-out date")}
                  type="date"
                  required
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={field}
                />
                {err("endDate")}
              </div>
            </div>
            <p className={hint}>
              Pick a term to fill typical dates, then adjust. The listing comes
              down on its own after the move-out date.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="pricePerMonth" className={label}>
                Rent per month
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
                  $
                </span>
                <input
                  {...bind("pricePerMonth", "Rent")}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  required
                  defaultValue={listing?.pricePerMonth}
                  placeholder="750"
                  className={`${field} pl-7`}
                />
              </div>
              {err("pricePerMonth")}
            </div>
            <div>
              <label htmlFor="bedrooms" className={label}>
                Bedrooms
              </label>
              <input
                {...bind("bedrooms", "Bedrooms")}
                type="number"
                inputMode="numeric"
                min="0"
                required
                defaultValue={listing?.bedrooms}
                placeholder="2"
                className={field}
              />
              {err("bedrooms")}
            </div>
            <div>
              <label htmlFor="bathrooms" className={label}>
                Bathrooms
              </label>
              <input
                {...bind("bathrooms", "Bathrooms")}
                type="number"
                inputMode="numeric"
                min="0"
                required
                defaultValue={listing?.bathrooms}
                placeholder="1"
                className={field}
              />
              {err("bathrooms")}
            </div>
          </div>
        </Section>

        <Section
          title="Details"
          description="What would you want to know before moving in?"
        >
          <div>
            <label htmlFor="description" className={label}>
              Description
            </label>
            <textarea
              {...bind("description", "Description")}
              required
              rows={5}
              defaultValue={listing?.description}
              placeholder="Who are the roommates? What's the walk to class like? Is parking included?"
              className={`${field} resize-y`}
            />
            {err("description")}
          </div>
          <div>
            <span className={label} id="amenities-label">
              Amenities
            </span>
            <div
              role="group"
              aria-labelledby="amenities-label"
              className="flex flex-wrap gap-2"
            >
              {COMMON_AMENITIES.map((name) => {
                const on = picked.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAmenity(name)}
                    className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
                      on
                        ? "border-brand-ink bg-brand-soft text-brand-ink"
                        : "border-line-strong text-ink-soft hover:border-ink-faint hover:text-ink"
                    }`}
                  >
                    {on && (
                      <Check
                        className="size-3.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}
                    {name}
                  </button>
                );
              })}
            </div>
            <label htmlFor="otherAmenities" className="sr-only">
              Other amenities
            </label>
            <input
              id="otherAmenities"
              type="text"
              value={otherAmenities}
              onChange={(e) => setOtherAmenities(e.target.value)}
              placeholder="Anything else? Separate with commas"
              className={`${field} mt-3`}
            />
          </div>
        </Section>

        <Section
          title="Photos"
          description="Listings with real photos get far more interest. Show the bedroom, the common space, and the outside."
        >
          <PhotoUploader
            initial={
              listing?.photos.filter((p) => p !== PLACEHOLDER_IMAGE) ?? []
            }
            onChange={(photos) =>
              setDraft((d) => ({
                ...d,
                imageUrl: photos[0] ?? PLACEHOLDER_IMAGE,
              }))
            }
          />
        </Section>

        <div className="border-t border-line pt-8">
          {state.error && (
            <p role="alert" className={`${fieldError} mb-4 text-[15px]`}>
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className={`${button.primary} ${size.lg} w-full sm:w-auto sm:min-w-48`}
          >
            {pending ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>

      <aside className="hidden lg:block" aria-label="Preview">
        <div className="sticky top-24">
          <p className="mb-3 text-sm font-semibold text-ink-soft">
            How students will see it
          </p>
          <ListingCard listing={draft} />
          <p className="mt-6 rounded-xl bg-sunken p-4 text-[15px] leading-relaxed text-ink-soft">
            Tip: mention roommates, the walk or bus to campus, and whether
            utilities are included. Those are the first questions you&apos;ll
            get.
          </p>
        </div>
      </aside>
    </div>
  );
}
