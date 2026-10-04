---
name: SummerStay
description: Student-to-student subleases in Blacksburg, for any term.
colors:
  brand-maroon: "oklch(0.41 0.13 10)"
  brand-hover: "oklch(0.35 0.12 10)"
  brand-soft: "oklch(0.955 0.02 10)"
  accent-orange: "oklch(0.7 0.16 52)"
  surface: "oklch(0.987 0.003 10)"
  sunken: "oklch(0.962 0.005 10)"
  card: "oklch(1 0 0)"
  ink: "oklch(0.2 0.018 10)"
  ink-soft: "oklch(0.46 0.016 10)"
  line: "oklch(0.912 0.007 10)"
  line-strong: "oklch(0.83 0.01 10)"
typography:
  family: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
  display: { fontSize: "4rem (desktop) / 2.5rem (phone)", fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.035em" }
  page-title: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.025em" }
  section: { fontSize: "1.75rem / 1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }
  body: { fontSize: "1rem–1.0625rem", fontWeight: 400, lineHeight: 1.6 }
  label: { fontSize: "0.875rem", fontWeight: 600 }
rounded:
  control: "10px"
  photo-and-panel: "16px"
  cta-band: "24px"
components:
  source: "app/_components/ui.ts (button, size, field, label, hint, fieldError, textLink)"
---

# Design System: SummerStay

## 1. Overview

**North star: "Hand me the keys."** SummerStay is the place a Hokie goes to pass their room to another student, or to find one, for a summer, a semester, or winter break. It should feel like a well-made local product: confident, legible, a little bit Blacksburg, and never like an official university site or a generic template.

Identity comes from three things: a deep **maroon** brand with a small **burnt-orange** second voice (a nod to the town, not a copy of VT's marks), **Schibsted Grotesk** as the single type family, and the **doorway mark** (an arched door with an orange knob) that shows up in the logo, favicon, 404, and the drenched CTA panels.

The register is product. Search, cards, forms, and navigation use familiar, Airbnb-grade patterns; the listings and their photos carry the emotion.

## 2. Color

All tokens live in `app/globals.css` as OKLCH CSS variables with light and `.dark` values, exposed to Tailwind via `@theme inline` (`bg-brand`, `text-ink-soft`, `border-line-strong`, ...). Neutrals carry a faint tint toward the brand hue (h≈10), never toward cream or beige.

- **Maroon (`brand`)**: primary buttons, logo, focus ring, active selections, links (`brand-ink` for text, which lightens in dark mode).
- **Burnt orange (`accent`)**: tiny doses only: the door knob, the "New" badge. Never body text on light backgrounds.
- **Surface / sunken / card**: page, recessed bands (footer, neighborhoods, tips, skeletons), raised panels.
- **Semantic**: `danger`/`danger-soft`, `success`/`success-soft`.

**Rule: Restrained, with one drenched moment per page.** Maroon fills at most one large panel per page (homepage CTA band, auth side panel). Everywhere else it marks the next action.

## 3. Typography

One family, Schibsted Grotesk, loaded with `next/font` (`--font-schibsted`). Hierarchy comes from size and weight. Display and headings get negative tracking (−0.02 to −0.035em); body and labels stay at normal tracking. Headings use `text-wrap: balance`, paragraphs `pretty`. Long prose caps at ~65–68ch.

## 4. Layout and elevation

- Page container `max-w-6xl`, gutters `px-4` on phones and `px-6` above.
- Flat by default: separation by hairlines (`border-line`) and the `sunken` tone. Shadow only on floating things: the search bar, the sticky contact panel, the user menu.
- Listing grids: 1 / 2 / 3 columns, `gap-x-6 gap-y-10`. Cards have no border; the photo is the card.

## 5. Components

- **Buttons** (`button.primary | secondary | ghost | danger | dangerOutline` × `size.sm | md | lg`): 10px radius, semibold, 150ms color transitions, 1px press nudge.
- **Fields** (`field`, `label`, `hint`, `fieldError`): 10px radius, strong hairline, maroon border + soft halo on focus, `aria-invalid` turns the border red. Validation is inline under the field; native popups are off (`noValidate`).
- **SearchBar**: segmented GET form (Where / Max rent / Bedrooms / Search) used on home and browse. Works without JavaScript; every search is a URL.
- **ListingCard**: 4:3 photo with term badge ("Summer", "Fall", ...) and "New" badge, then title, neighborhood + distance, dates + beds/baths, price. Doubles as the live preview in the host form (no `id` → not a link).
- **Detail page**: wide photo, icon fact row, description, amenities with checks, "Posted by" host block, a "Before you pay anything" safety box, sticky contact panel on desktop, sticky price bar on phones.
- **Host form**: four fieldsets (The place / Dates and price / Details / Photo), term presets for dates, toggle chips for amenities, live card preview.
- **Empty states** teach the next step (icon, one-line heading, specific suggestion, one action).

## 6. Motion

150–250ms, `--ease-out-quart`. Motion only conveys state: hover (photo eases to 1.03 scale), menu open, success and confirm reveals. Everything collapses under `prefers-reduced-motion`.

## 7. Don'ts

- No VT logos, the "VT" monogram, or the HokieBird; we're not affiliated.
- No cream/beige backgrounds, gradient text, glass cards, side-stripe borders, or uppercase tracked eyebrows over sections.
- No second typeface. No decorative animation.
- Don't promise what the product doesn't do (e.g. message delivery to hosts until it exists).
