---
name: SummerStay
description: A student-to-student marketplace for summer sublets near campus.
colors:
  coral: "#e05d3d"
  coral-dark: "#c24b2e"
  coral-soft: "#fdeee9"
  surface: "#faf9f7"
  card: "#ffffff"
  ink: "#1c1917"
  ink-soft: "#78716c"
  line: "#e7e5e4"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  gutter: "24px"
  section: "48px"
  field: "12px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.card}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.coral-dark}"
    textColor: "{colors.card}"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  listing-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
  badge:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: SummerStay

## 1. Overview

**Creative North Star: "The Warm Front Porch"**

SummerStay should feel like being welcomed onto a friend's porch to talk about their apartment: warm, human, and immediately trustworthy, without a trace of corporate coldness or hard-sell flash. It is a marketplace where students hand each other the keys to their summer, so the whole interface leans on quiet warmth and legibility rather than decoration. A near-white warm surface holds the page, real apartment photography carries the emotion, and a single coral accent does all the pointing.

The system is restrained on purpose. There is one saturated color and one type family; hierarchy comes from size, weight, and generous spacing, not from ornament. Depth is a whisper: surfaces sit flat at rest with a hairline border and lift only when you touch them. The register is a product, not a poster, so familiarity is a feature. Search, forms, auth, and navigation all look the way a student already expects them to, which is exactly what makes the site feel legitimate enough to trust with housing.

It explicitly rejects three things: the cluttered, unstyled **cheap-listings-site** look (walls of text, no hierarchy); the **flashy consumer app** (loud gradients, neon, gamified motion competing for attention); and the **generic AI template** (saturated cream backgrounds, tracked-uppercase eyebrows over every section, identical icon-heading-text card grids). It also stays clear of cold, dense, gray enterprise-dashboard energy.

**Key Characteristics:**
- One warm coral accent, used sparingly, on a near-white (or dark-stone) warm-neutral surface.
- A single sans family (Geist) carrying everything from hero to fine print.
- Flat at rest; shadow and lift only on interaction.
- Photography-forward: listing images lead, the UI supports.
- Fully theme-aware (light and dark) through CSS-variable tokens.

## 2. Colors

A warm-neutral system built on the stone family, with a single coral accent as the only saturated voice. Every value is a CSS variable that swaps between light and dark themes; the hex values below are the light theme, with the dark-theme value noted where it differs.

### Primary
- **Summer Coral** (`#e05d3d`): The one accent. Primary buttons, the "S" logo mark, the keyboard focus ring, active/selected states, and small links. It is the same value in light and dark. **Coral Deep** (`#c24b2e`) is its hover/pressed shade. **Coral Wash** (`#fdeee9` light / `#43241c` dark) is the faint tint behind success confirmations and the numbered "how it works" markers.

### Neutral
- **Warm Off-White** (`#faf9f7` light / **Dark Stone** `#1c1917` dark): The body surface. A whisper of warmth, held near-white; never a saturated cream.
- **Card White** (`#ffffff` light / **Stone Card** `#292524` dark): Raised surfaces, sitting one tonal step above the body so cards read without heavy shadow.
- **Ink** (`#1c1917` light / **Off-White Ink** `#f5f5f4` dark): Primary text and headings. Near-black on near-white for maximum readability.
- **Warm Gray** (`#78716c` light / `#a8a29e` dark): Secondary text, labels, placeholders, muted metadata. Holds ~4.5:1 on the surface; never lighten it "for elegance."
- **Hairline** (`#e7e5e4` light / `#44403c` dark): Borders and dividers. The primary way surfaces are separated, in place of shadow.

### Named Rules
**The One Coral Rule.** Coral is the only saturated color in the system and it appears on a small fraction of any screen: primary action, logo mark, focus ring, current selection, small accents. It is never a large fill, never a gradient, never decoration. Its rarity is what makes it read as "the thing to do next."

**The Warm-But-Near-White Rule.** The surface carries warmth as a barely-there tint (very high lightness, minimal chroma), not as a cream, beige, tan, or sand. Warmth in this brand lives in the coral, the photography, and the copy, not in a saturated background.

## 3. Typography

**Display Font:** Geist (with system-ui, sans-serif fallback)
**Body Font:** Geist (same family)
**Label/Mono Font:** Geist Mono is available for code-like contexts but is effectively unused in the UI.

**Character:** One clean, contemporary geometric-humanist sans doing all the work. Warmth and trust come from spacing and weight, not from a display/body pairing. No second family is introduced; contrast is achieved with size and weight within Geist.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, line-height ~1.05, tracking `-0.025em`): The homepage hero headline only ("A summer home near any campus.").
- **Headline** (700, `1.875rem` / text-3xl, tracking-tight): Page titles ("Browse listings", "List your place", "Account").
- **Title** (700, `1.5rem` / text-2xl): Section headings ("How it works", "Featured listings", "About this place").
- **Body** (400, `1rem`–`1.125rem`, line-height ~1.6): Descriptions and prose. Kept to a comfortable measure; long prose caps around 65–75ch.
- **Label** (500, `0.875rem` / text-sm; `0.75rem` / text-xs for the finest metadata): Form labels, buttons, nav links, card metadata, badges.

### Named Rules
**The Single-Family Rule.** Geist carries hero to fine print. Do not introduce a second typeface for "personality"; personality comes from the coral, the photos, and the copy.

**The Tight-Display Rule.** Only large display and heading text gets negative tracking (`-0.02em` to `-0.025em`). Body and labels stay at normal tracking; tightening small text hurts legibility.

## 4. Elevation

The system is flat by default and separates surfaces with tone and a hairline border, not with resting shadows. The body surface is warm off-white; cards step up to card-white (or dark-stone → stone-card in dark mode). A `shadow-sm` sits under cards as the faintest possible lift, and heavier shadow is reserved for interaction and floating layers.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` / Tailwind `shadow-sm`): The barely-there base under listing cards.
- **Lift** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` / `shadow-lg`): A listing card on hover, and floating layers (the user-menu dropdown).

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat with a hairline border at rest. Shadow is a response to state: cards lift 4px and deepen their shadow on hover; dropdowns float on `shadow-lg`. Nothing casts a heavy resting shadow.

## 5. Components

The vocabulary is small and repeated everywhere: pill buttons, hairline-bordered cards, soft-cornered inputs, and one coral accent. Consistency across screens is the point.

### Buttons
- **Shape:** Full pill (`border-radius: 9999px`, `rounded-full`).
- **Primary:** Coral fill, white text, `padding: 12px 24px`, weight 500. Hover shifts to Coral Deep (`#c24b2e`); disabled drops to 60% opacity. The full-width form submit is the same button stretched to 100%.
- **Outline (secondary):** Card background, ink text, hairline border, same pill shape and padding. Hover darkens the border to Warm Gray. Used for the secondary hero action, "Edit listing", "Clear filters".
- **Text link:** Warm Gray, weight 500, `hover:` shifts to Ink. Used for nav and inline links.
- **Nav variant:** The primary pill at `padding: 8px 16px`, `text-sm`, sized down to sit in the header bar.
- **Focus:** All interactive elements share one keyboard focus ring: a 2px coral outline at 2px offset, shown only on `:focus-visible`.

### Chips / Pills
- **Amenity pill:** Card background, ink text, hairline border, `rounded-full`, `padding: 6px 16px`, `text-sm`. Read-only tags on the listing detail page.
- **Availability badge:** A frosted pill (`bg-card/90` + `backdrop-blur`) pinned to the top-left of a listing photo, showing the date range.

### Cards / Containers
- **Corner Style:** `16px` (`rounded-2xl`) for listing cards and content panels; `12px` (`rounded-xl`) for the dropdown and inner stat blocks; `8px` (`rounded-lg`) for inputs.
- **Background:** Card White on the warm surface (dark: Stone Card on Dark Stone).
- **Shadow Strategy:** `shadow-sm` at rest, `shadow-lg` on hover (see Elevation).
- **Border:** Hairline (`1px` Line) on every card. Full borders only; never a colored side-stripe.
- **Internal Padding:** `20px` (`p-5`) on listing cards, `24px`–`32px` (`p-6`/`p-8`) on panels and auth cards.

### Inputs / Fields
- **Style:** `8px` radius, hairline border, card background, `padding: 8px 12px`, `text-sm`. Label above in weight 500.
- **Focus:** Border shifts to Warm Gray, plus the shared coral focus ring on keyboard focus.
- **Validation:** Inline, in-app messages under each field (`text-red-600` / dark `text-red-400`); native browser validation popups are suppressed with `noValidate`. Errors clear as the user types.

### Navigation
- **Top bar:** Sticky, hairline bottom border, translucent card background with `backdrop-blur` (frosted glass, used here purposefully, not decoratively). Left: the coral "S" mark + wordmark. Right: text links, the coral "List your place" pill, and either a "Log in" link or the user menu.
- **User menu:** A coral avatar (initial) with the name; opens a `rounded-xl` dropdown (`shadow-lg`) with Account, My listings, and Log out. Closes on outside click.
- **Mobile:** Secondary text links hide below `sm`; the brand, primary pill, and user avatar remain.

### Listing Card (signature component)
The core object of the product. A `rounded-2xl` hairline-bordered card: a 4:3 photo on top with a frosted availability badge, then title, location, "N bd · N ba · distance", and price with the dollar amount emphasized and "/ month" muted. On hover the whole card lifts 4px (300ms) and the photo slowly zooms 5% (500ms) — two speeds, so the card feels reactive and the image feels expensive.

## 6. Do's and Don'ts

### Do:
- **Do** keep coral to a small fraction of any screen: primary action, logo mark, focus ring, selection. If coral is filling large areas, it is wrong.
- **Do** let listing photography carry the emotional weight; keep the surrounding UI quiet and near-white.
- **Do** separate surfaces with the hairline border and a one-step tonal lift first; add shadow only on hover or for floating layers.
- **Do** use one Geist family throughout, with size and weight for hierarchy.
- **Do** give every interactive element the shared 2px coral `:focus-visible` ring and hold WCAG AA contrast (Warm Gray text stays ~4.5:1, never lighter).
- **Do** show validation inline, in-app, under the field.

### Don't:
- **Don't** look like a **cheap listings site** (Craigslist / Facebook Marketplace): walls of unstyled text, no hierarchy, no trust.
- **Don't** look like a **flashy consumer app**: no loud gradients, neon, gamified UI, or motion that competes for attention.
- **Don't** look like a **generic AI template**: no saturated cream/beige/sand background, no tracked-uppercase eyebrow over every section, no identical icon-heading-text card grids.
- **Don't** drift **cold and corporate**: avoid dense gray enterprise-dashboard energy.
- **Don't** use gradient text, glassmorphism as decoration, or a colored `border-left`/`border-right` stripe as an accent.
- **Don't** push the warm surface toward a saturated cream; keep it near-white with only a whisper of warmth.
- **Don't** introduce a second type family or animate for decoration; motion conveys state (hover lift, pending, reveal) and nothing else.
