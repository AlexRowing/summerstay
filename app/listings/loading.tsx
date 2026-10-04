// Shown while the listings page loads. The shapes mirror the real page so
// nothing jumps when the data arrives.
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10"
      aria-busy="true"
      aria-label="Loading places"
    >
      <div className="h-10 w-48 animate-pulse rounded-lg bg-sunken" />
      <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-sunken" />
      <div className="mt-6 h-[68px] animate-pulse rounded-2xl bg-sunken" />
      <div className="mt-6 h-9 border-b border-line" />
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-sunken" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-sunken" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-sunken" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-sunken" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
