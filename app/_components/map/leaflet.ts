"use client";

import type { Map as LeafletMap } from "leaflet";

type Leaflet = typeof import("leaflet");

// Standard OpenStreetMap tiles: free with attribution for light use. Dark mode
// is handled in CSS (globals.css inverts the tile layer), so there's one tile
// source and no theme bookkeeping here.
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Load Leaflet (browser-only, so it's imported lazily) and set up a map on
// `el`. Returns null if `signal` was aborted while Leaflet loaded (the
// component unmounted, or React re-ran the effect), so two maps never get
// attached to the same element.
export async function createMap(
  el: HTMLElement,
  options: import("leaflet").MapOptions,
  signal: AbortSignal,
): Promise<{ L: Leaflet; map: LeafletMap } | null> {
  const L = await import("leaflet");
  if (signal.aborted) return null;
  const map = L.map(el, {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false,
    // Tiles appear at once instead of fading in; the fade relies on
    // animation frames, which background tabs throttle.
    fadeAnimation: false,
    ...options,
  });
  L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
  signal.addEventListener("abort", () => map.remove(), { once: true });
  return { L, map };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
