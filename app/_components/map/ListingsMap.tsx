"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { CAMPUS, approximate, formatPrice } from "@/app/_lib/format";
import { createMap, escapeHtml } from "@/app/_components/map/leaflet";

export type MapListing = {
  id: string;
  title: string;
  pricePerMonth: number;
  neighborhood: string;
  imageUrl: string;
  lat: number;
  lng: number;
};

// Browse-page map: a price pill per listing at its approximate location.
// Clicking a pill opens a small card that links to the listing.
export default function ListingsMap({ listings }: { listings: MapListing[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = new AbortController();

    createMap(
      el,
      { center: [CAMPUS.lat, CAMPUS.lng], zoom: 14 },
      controller.signal,
    ).then((created) => {
      if (!created) return;
      const { L, map } = created;

      // Campus marker for orientation.
      L.marker([CAMPUS.lat, CAMPUS.lng], {
        icon: L.divIcon({
          className: "",
          html: '<div class="ss-campus">Drillfield</div>',
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map);

      const points: [number, number][] = [];
      for (const l of listings) {
        const at: [number, number] = [approximate(l.lat), approximate(l.lng)];
        points.push(at);
        L.marker(at, {
          icon: L.divIcon({
            className: "",
            html: `<div class="ss-pin">${escapeHtml(formatPrice(l.pricePerMonth))}</div>`,
            iconSize: [0, 0],
          }),
          title: `${l.title}, ${formatPrice(l.pricePerMonth)} a month`,
          riseOnHover: true,
        })
          .addTo(map)
          .bindPopup(
            `<a class="ss-popup" href="/listings/${encodeURIComponent(l.id)}">
                <img src="${escapeHtml(l.imageUrl)}" alt="" loading="lazy" />
                <span class="ss-popup-body">
                  <strong>${escapeHtml(l.title)}</strong>
                  <span>${escapeHtml(formatPrice(l.pricePerMonth))}/mo · ${escapeHtml(l.neighborhood)}</span>
                </span>
              </a>`,
            {
              closeButton: false,
              offset: [0, -14],
              maxWidth: 260,
              minWidth: 220,
            },
          );
      }
      if (points.length > 0) {
        map.fitBounds(L.latLngBounds([...points, [CAMPUS.lat, CAMPUS.lng]]), {
          padding: [48, 48],
          maxZoom: 15,
        });
      }
    });

    return () => {
      controller.abort();
    };
  }, [listings]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Map of places"
      className="ss-map h-[min(70vh,640px)] w-full overflow-hidden rounded-2xl border border-line bg-sunken"
    />
  );
}
