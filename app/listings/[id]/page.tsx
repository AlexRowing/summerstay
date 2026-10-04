import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  Footprints,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/auth";
import ContactForm from "@/app/_components/ContactForm";
import DeleteListingButton from "@/app/_components/DeleteListingButton";
import { button, size } from "@/app/_components/ui";
import { formatPrice, shortDistance, termFor } from "@/app/_lib/format";
import { getListingById, getListingWithHost } from "@/app/_lib/listings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: listing.title,
    description: `${formatPrice(listing.pricePerMonth)}/mo · ${listing.bedrooms} bd · ${listing.neighborhood}, ${listing.city} · ${listing.availability}`,
    openGraph: { images: [listing.imageUrl] },
  };
}

const safetyTips = [
  "See the place (or a live video tour) before you send any money.",
  "Check that the lease allows subletting and use your complex's sublease form.",
  "Never pay by wire, gift card, or crypto. Scammers ask for these.",
];

// In Next.js 16, `params` is a Promise, so it must be awaited before use.
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getListingWithHost(id);
  if (!result) notFound();
  const { listing, host } = result;

  const session = await auth();
  const isOwner = !!session?.user && session.user.id === listing.ownerId;
  const term = termFor(listing.availability);

  const facts = [
    {
      icon: BedDouble,
      label: `${listing.bedrooms} ${listing.bedrooms === 1 ? "bedroom" : "bedrooms"}`,
    },
    {
      icon: Bath,
      label: `${listing.bathrooms} ${listing.bathrooms === 1 ? "bath" : "baths"}`,
    },
    { icon: Footprints, label: shortDistance(listing.distanceToCampus) },
    { icon: CalendarDays, label: listing.availability },
  ];

  const hostName = host?.name?.trim() || "A SummerStay member";
  const memberSince = host?.memberSince.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 lg:pb-20">
      <Link
        href="/listings"
        className="-ml-1 inline-flex items-center gap-0.5 rounded-lg py-1 pr-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        All places
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.025em] sm:text-[2.25rem]">
          {listing.title}
        </h1>
        <p className="text-ink-soft">
          {listing.neighborhood}, {listing.city}
          {term && <> · {term} sublease</>}
        </p>
      </div>

      <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl bg-sunken sm:aspect-[2/1]">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="(max-width: 1152px) 100vw, 1104px"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 font-medium">
                <Icon className="size-5 text-ink-soft" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <section className="border-b border-line py-8">
            <h2 className="text-xl font-bold tracking-[-0.01em]">
              About this place
            </h2>
            <p className="mt-3 max-w-[65ch] whitespace-pre-line text-[17px] leading-relaxed text-ink">
              {listing.description}
            </p>
          </section>

          {listing.amenities.length > 0 && (
            <section className="border-b border-line py-8">
              <h2 className="text-xl font-bold tracking-[-0.01em]">
                What&apos;s included
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {listing.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3">
                    <Check
                      className="size-[18px] shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {host && (
            <section className="border-b border-line py-8">
              <h2 className="text-xl font-bold tracking-[-0.01em]">
                Posted by
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-ink">
                  {hostName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold">{hostName}</p>
                  <p className="text-[15px] text-ink-soft">
                    On SummerStay since {memberSince}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="pt-8">
            <div className="rounded-2xl bg-sunken p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <ShieldCheck
                  className="size-5 text-success"
                  aria-hidden="true"
                />
                Before you pay anything
              </h2>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-soft">
                {safetyTips.map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] size-1 shrink-0 rounded-full bg-ink-faint"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Contact panel. Sticky on desktop so it stays beside the details as
            they scroll past. */}
        <aside id="contact" className="scroll-mt-24">
          <div className="sticky top-24 rounded-2xl border border-line bg-card p-6 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.14)]">
            <p className="text-[1.75rem] font-bold tracking-[-0.02em]">
              {formatPrice(listing.pricePerMonth)}
              <span className="text-base font-normal tracking-normal text-ink-soft">
                {" "}
                / month
              </span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-soft">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>{listing.availability}</span>
            </p>

            {isOwner ? (
              <div className="mt-6 space-y-3 border-t border-line pt-6">
                <p className="text-[15px] text-ink-soft">
                  This is your listing.
                </p>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className={`${button.secondary} ${size.md} w-full`}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit listing
                </Link>
                <DeleteListingButton id={listing.id} />
              </div>
            ) : (
              <div className="mt-6 border-t border-line pt-6">
                <h2 className="font-bold">Interested? Say hi.</h2>
                <ContactForm
                  listingId={listing.id}
                  listingTitle={listing.title}
                />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Phone-only action bar: price and the contact button stay in reach
          without scrolling to the form. Owners don't see it. */}
      {!isOwner && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="font-bold">
                {formatPrice(listing.pricePerMonth)}
                <span className="text-sm font-normal text-ink-soft">
                  {" "}
                  / month
                </span>
              </p>
              <p className="text-[13px] text-ink-soft">
                {listing.availability}
              </p>
            </div>
            <a href="#contact" className={`${button.primary} ${size.md}`}>
              Message host
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
