"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { CAMPUS, approximate } from "@/app/_lib/format";
import { createMap } from "@/app/_components/map/leaflet";

// Listing-page map: a soft circle around the approximate location (never the
// exact pin) plus the Drillfield, so students can judge the walk.
export default function AreaMap({ lat, lng }: { lat: number; lng: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = new AbortController();
    const center: [number, number] = [approximate(lat), approximate(lng)];

    createMap(el, { center, zoom: 15 }, controller.signal).then((created) => {
      if (!created) return;
      const { L, map } = created;
      const brand = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand")
        .trim();
      L.circle(center, {
        radius: 220,
        color: brand,
        weight: 2,
        fillColor: brand,
        fillOpacity: 0.18,
      }).addTo(map);
      L.marker([CAMPUS.lat, CAMPUS.lng], {
        icon: L.divIcon({
          className: "",
          html: '<div class="ss-campus">Drillfield</div>',
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map);
      map.fitBounds(L.latLngBounds([center, [CAMPUS.lat, CAMPUS.lng]]), {
        padding: [60, 60],
        maxZoom: 15,
      });
    });

    return () => {
      controller.abort();
    };
  }, [lat, lng]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Map showing the approximate area of this place and the Drillfield"
      className="ss-map h-72 w-full overflow-hidden rounded-2xl border border-line bg-sunken"
    />
  );
}
