"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Star, X } from "lucide-react";
import { MAX_PHOTOS } from "@/app/_lib/format";

type Pending = { id: string; preview: string; progress: number };

// Phone photos are often 4000px and several MB. Shrink to at most 2000px on
// the long edge as JPEG before uploading: faster on campus Wi-Fi, still sharp.
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

function safeName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  return `${base.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo"}.jpg`;
}

// Upload, reorder, and remove listing photos. The first photo is the cover.
// Files go straight from the browser to Vercel Blob via /api/upload; the form
// submits the resulting URLs in a hidden `photos` field.
export default function PhotoUploader({
  initial,
  onChange,
}: {
  initial: string[];
  onChange: (photos: string[]) => void;
}) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // The latest list, for uploads that finish after other changes.
  const latest = useRef(initial);

  function update(next: string[]) {
    latest.current = next;
    setPhotos(next);
    onChange(next);
  }

  async function addFiles(files: File[]) {
    setError(null);
    const images = files.filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
    if (images.length < files.length) {
      setError("Only JPG, PNG, or WebP photos work.");
    }
    const room = MAX_PHOTOS - photos.length - pending.length;
    if (images.length > room) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
    }

    await Promise.all(
      images.slice(0, Math.max(0, room)).map(async (file) => {
        const id = crypto.randomUUID();
        const preview = URL.createObjectURL(file);
        setPending((p) => [...p, { id, preview, progress: 0 }]);
        try {
          const body = await shrink(file);
          const blob = await upload(`listings/${safeName(file.name)}`, body, {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: body.type || file.type,
            onUploadProgress: ({ percentage }) =>
              setPending((p) =>
                p.map((x) =>
                  x.id === id ? { ...x, progress: percentage } : x,
                ),
              ),
          });
          update([...latest.current, blob.url]);
        } catch (e) {
          setError(
            (e as Error).message.includes("Log in")
              ? "Your session expired. Log in again to upload."
              : "A photo didn't upload. Check your connection and try again.",
          );
        } finally {
          setPending((p) => p.filter((x) => x.id !== id));
          URL.revokeObjectURL(preview);
        }
      }),
    );
  }

  const full = photos.length + pending.length >= MAX_PHOTOS;

  return (
    <div>
      <input type="hidden" name="photos" value={JSON.stringify(photos)} />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`grid grid-cols-2 gap-3 rounded-2xl transition-colors sm:grid-cols-3 ${
          dragging
            ? "bg-brand-soft outline-2 outline-dashed outline-brand-ink"
            : ""
        }`}
      >
        {photos.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sunken"
          >
            <Image
              src={url}
              alt={i === 0 ? "Cover photo" : `Photo ${i + 1}`}
              fill
              sizes="200px"
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded-md bg-card/95 px-2 py-0.5 text-xs font-bold text-ink shadow-sm">
                Cover
              </span>
            )}
            <div className="absolute right-2 top-2 flex gap-1">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    update([url, ...photos.filter((p) => p !== url)])
                  }
                  aria-label={`Make photo ${i + 1} the cover`}
                  title="Make cover"
                  className="flex size-8 items-center justify-center rounded-lg bg-card/95 text-ink shadow-sm transition-colors hover:bg-card"
                >
                  <Star className="size-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => update(photos.filter((p) => p !== url))}
                aria-label={`Remove photo ${i + 1}`}
                title="Remove"
                className="flex size-8 items-center justify-center rounded-lg bg-card/95 text-ink shadow-sm transition-colors hover:bg-card"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {pending.map((p) => (
          <div
            key={p.id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sunken"
          >
            {/* A local preview (blob: URL) next/image can't optimize. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.preview}
              alt=""
              className="size-full object-cover opacity-50"
            />
            <div className="absolute inset-x-3 bottom-3 h-1.5 overflow-hidden rounded-full bg-card/80">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-200"
                style={{ width: `${Math.max(8, p.progress)}%` }}
              />
            </div>
            <span className="sr-only">Uploading</span>
          </div>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line-strong text-ink-soft transition-colors hover:border-ink-faint hover:bg-sunken hover:text-ink"
          >
            <ImagePlus className="size-6" aria-hidden="true" />
            <span className="text-sm font-semibold">
              {photos.length === 0 ? "Add photos" : "Add more"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          addFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
      <p className="mt-2 text-[13px] text-ink-soft">
        Up to {MAX_PHOTOS} photos. The first one is the cover; tap the star to
        change it. You can drag photos in on a laptop.
      </p>
    </div>
  );
}
