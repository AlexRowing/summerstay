// Shown while the listings page fetches from the database. The shapes mirror
// the real grid so the layout doesn't jump when the data arrives.
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-line" />
      <div className="mt-2 h-5 w-40 animate-pulse rounded bg-line" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-line bg-card"
          >
            <div className="aspect-[4/3] animate-pulse bg-line" />
            <div className="space-y-2 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-line" />
              <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
