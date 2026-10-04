// Shown while a listing page loads.
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
      aria-busy="true"
      aria-label="Loading listing"
    >
      <div className="h-6 w-24 animate-pulse rounded bg-sunken" />
      <div className="mt-3 h-10 w-2/3 animate-pulse rounded-lg bg-sunken" />
      <div className="mt-2 h-5 w-56 animate-pulse rounded bg-sunken" />
      <div className="mt-6 aspect-[4/3] w-full animate-pulse rounded-2xl bg-sunken sm:aspect-[2/1]" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="space-y-3">
          <div className="h-6 w-full animate-pulse rounded bg-sunken" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-sunken" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-sunken" />
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-sunken" />
      </div>
    </div>
  );
}
