// Shown while a listing detail page fetches from the database.
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="h-4 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 h-9 w-2/3 animate-pulse rounded-lg bg-line" />
      <div className="mt-2 h-5 w-40 animate-pulse rounded bg-line" />
      <div className="mt-6 aspect-[16/9] w-full animate-pulse rounded-2xl bg-line" />
    </div>
  );
}
