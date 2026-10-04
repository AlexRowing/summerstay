"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";

// Listing photos. One photo shows as a wide hero. Several show as a swipeable
// strip on phones and a 1+4 grid on larger screens; any photo opens a
// full-screen viewer (native <dialog>, so Esc and focus trapping come free).
export default function PhotoGallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [stripIndex, setStripIndex] = useState(0);
  const count = photos.length;

  function open(i: number) {
    setIndex(i);
    dialogRef.current?.showModal();
  }
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onKey(e: KeyboardEvent) {
      if (!dialog?.open) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count]);

  const alt = (i: number) => `${title}, photo ${i + 1} of ${count}`;

  if (count <= 1) {
    return (
      <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl bg-sunken sm:aspect-[2/1]">
        <Image
          src={photos[0]}
          alt={title}
          fill
          sizes="(max-width: 1152px) 100vw, 1104px"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const grid = photos.slice(0, 5);
  const hidden = count - grid.length;

  return (
    <>
      {/* Phones: swipe through every photo. */}
      <div className="relative mt-6 sm:hidden">
        <div
          ref={stripRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setStripIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => open(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-sunken"
            >
              <Image
                src={src}
                alt={alt(i)}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
          {stripIndex + 1} / {count}
        </span>
      </div>

      {/* Larger screens: cover + up to four more. */}
      <div className="relative mt-6 hidden h-[clamp(320px,42vw,460px)] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:grid">
        {grid.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            className={`group relative overflow-hidden bg-sunken ${
              i === 0 ? "col-span-2 row-span-2" : ""
            } ${grid.length === 2 && i === 1 ? "col-span-2 row-span-2" : ""} ${
              grid.length === 3 && i > 0 ? "col-span-2" : ""
            } ${grid.length === 4 && i === 3 ? "col-span-2" : ""}`}
          >
            <Image
              src={src}
              alt={alt(i)}
              fill
              sizes={
                i === 0
                  ? "(max-width: 1152px) 50vw, 552px"
                  : "(max-width: 1152px) 25vw, 276px"
              }
              className="object-cover transition-[filter] duration-200 group-hover:brightness-90"
              priority={i === 0}
            />
            {i === grid.length - 1 && hidden > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-bold text-white">
                +{hidden} more
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => open(0)}
          className="absolute bottom-3 right-3 flex h-9 items-center gap-1.5 rounded-lg bg-card px-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-sunken"
        >
          <Grid2x2 className="size-4" aria-hidden="true" />
          All {count} photos
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`Photos of ${title}`}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-black p-0 text-white backdrop:bg-black"
        onClick={(e) => {
          // Clicking the dark area around the photo closes the viewer.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close photos"
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex-1">
            <Image
              key={photos[index]}
              src={photos[index]}
              alt={alt(index)}
              fill
              sizes="100vw"
              className="object-contain motion-safe:animate-[rise-in_180ms_var(--ease-out-quart)]"
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white"
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white"
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="h-6" />
        </div>
      </dialog>
    </>
  );
}
