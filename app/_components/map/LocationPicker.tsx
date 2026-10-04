"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Marker } from "leaflet";
import { MapPin } from "lucide-react";
import { CAMPUS } from "@/app/_lib/format";
import { createMap } from "@/app/_components/map/leaflet";

type Point = { lat: number; lng: number };

// Host form map: click (or drag the pin) to mark where the place is. The
// exact point is stored, but students only ever see an approximate circle.
export default function LocationPicker({ initial }: { initial: Point | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const markerRef = useRef<Marker | null>(null);
  const [point, setPoint] = useState<Point | null>(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = new AbortController();
    const start = initial ?? CAMPUS;

    createMap(
      el,
      { center: [start.lat, start.lng], zoom: initial ? 16 : 14 },
      controller.signal,
    ).then((created) => {
      if (!created) return;
      const { L, map } = created;

      const icon = L.divIcon({
        className: "",
        html: '<div class="ss-drop"></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      const place = (lat: number, lng: number) => {
        const p = {
          lat: Math.round(lat * 1e5) / 1e5,
          lng: Math.round(lng * 1e5) / 1e5,
        };
        if (markerRef.current) {
          markerRef.current.setLatLng([p.lat, p.lng]);
        } else {
          markerRef.current = L.marker([p.lat, p.lng], {
            icon,
            draggable: true,
          })
            .addTo(map)
            .on("dragend", (e) => {
              const ll = (e.target as Marker).getLatLng();
              place(ll.lat, ll.lng);
            });
        }
        setPoint(p);
      };

      if (initial) place(initial.lat, initial.lng);
      map.on("click", (e) => place(e.latlng.lat, e.latlng.lng));
    });

    return () => {
      controller.abort();
      markerRef.current = null;
    };
    // The map is set up once; later pin moves go through `place`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clear() {
    markerRef.current?.remove();
    markerRef.current = null;
    setPoint(null);
  }

  return (
    <div>
      <input type="hidden" name="lat" value={point?.lat ?? ""} />
      <input type="hidden" name="lng" value={point?.lng ?? ""} />
      <div
        ref={ref}
        role="application"
        aria-label="Map. Click to place a pin where your place is."
        className="ss-map h-64 w-full cursor-crosshair overflow-hidden rounded-2xl border border-line-strong bg-sunken"
      />
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[13px] text-ink-soft">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {point
            ? "Pin placed. Drag it to adjust. Students only see the general area, never the exact spot."
            : "Optional: click the map where your place is. Students only see the general area."}
        </p>
        {point && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-[13px] font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Remove pin
          </button>
        )}
      </div>
    </div>
  );
}
