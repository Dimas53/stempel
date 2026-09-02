# Design System

Fill this file BEFORE writing any UI code.
The agent reads this file before every UI task.

Legend: 🟡 = draft / not confirmed with the team yet (mirrors the convention
used in `notes/stempelmaske-wireframe-v3.html`). Everything else below is
either given directly by the user or pulled verbatim from existing Pepito
production CSS.

## Colors

### Brand

| Name | HEX | Usage |
|------|-----|-------|
| `--pep-primary-blue` | `#2A8FD2` | Confirmed brand blue. Main panel fill (80% block), primary buttons, focus rings, links |
| `--pep-primary-blue-hover` 🟡 | `#247AB3` | Derived (~15% darker). Hover/active state for blue elements. Real token name exists in Pepito's Bootstrap CSS (`--pep-primary-blue-hover`) — **ask for the actual hex used elsewhere in the app instead of this derived guess** |
| `--pep-primary-blue-soft` 🟡 | `#E5F2FA` | Derived tint (~12% blue over white). Light backgrounds, badges, subtle highlights on white |
| `--pep-focus-ring` 🟡 | `rgba(42,143,210,.5)` | Focus halo, matches Bootstrap pattern `0 0 0 .25rem rgba(color,.5)` |

Panel treatment — **confirmed, use by default**. Toned down twice now
after live feedback: first the original `#024 → #3ea3dc` (near-black navy
to sky blue, muddy middle in sRGB), then again because the darker end
still read as too much contrast next to the MarcoPolo reference's fairly
even blue:
```css
background-image: linear-gradient(135deg, #4bafe0 0%, #2a8fd2 60%, #1f6fa0 100%);
```

### Neutrals (white / gray)

The wireframe's existing neutral scale already sits on the same cool hue
family as `#2A8FD2` (~204° hue) — no need to invent a new gray ramp, just
keep these and treat them as final-ish:

| Name | HEX | Usage |
|------|-----|-------|
| `--pep-white` | `#FFFFFF` | Base background, per ITO login reference ("white background, blue as an accent, not a fill") |
| `--pep-ink` | `#1A2230` | Primary text |
| `--pep-mute` | `#6B7688` | Secondary text, placeholders |
| `--pep-line` | `#C7CEDB` | Borders, dividers |
| `--pep-line-soft` | `#DFE4EC` | Soft borders, table separators |
| `--pep-panel-gray` | `#EEF1F6` | The ~20% side panel background (see Layout below) — used when that strip isn't pure white |

### Accent — gold (Pause actions)

Pulled **verbatim** from an existing Pepito component
(`.pepito-button.primary`) — not a new invention, so it stays consistent
with what the app already ships elsewhere. Ticket calls for "yellow" on
Pause buttons; this gold treatment is a stronger, more premium take on
that same requirement:

| Name | Value | Usage |
|------|-------|-------|
| `--pep-gold` | `#C8A04B` | Base gold, gradient start/end |
| `--pep-gold-mid` | `#DAB264` | Gradient midpoint |
| `--pep-gold-light` | `#E3C996` | Gradient highlight |
| `--pep-gold-glow` | `#C8A04B` | `text-shadow: 0 0 1rem var(--pep-gold-glow)` |
| `--pep-gold-bg-soft` | `#FFFAB4` (`rgb(255 250 180)`) | Pale-yellow soft background variant |

Gradient (shimmer effect), copied as-is:
```css
background-image: linear-gradient(45deg, #C8A04B 30%, #DAB264 45%, #E3C996 58%, #C8A04B 70%);
background-size: 200% 200%;
background-position: 50%;
```
**Resolved — hover behavior**: taken from a real Pepito button reference
(`Demotermin buchen`). Triggered on hover only, two things happen
together: the gradient's `background-position` shifts (30% 30% → 80%
70%) and the whole button darkens (`filter: brightness(0.92)`). First
pass also added a diagonal light-streak sweep via a `::before`
pseudo-element — user tried it live and asked to remove it, it read as
one extra thing happening rather than "just the gradient moves."
Implemented on `.btn-anmelden` in `LoginView.vue` — reuse the same
(simpler) recipe for the future Pause starten/beenden gold buttons.

### Accent — green (Checkout actions)

| Name | HEX | Usage |
|------|-----|-------|
| `--pep-green` | `#D2F0C8` | "Zum Checkout" / "Checkout" buttons |
| `--pep-green-hover` 🟡 | TBD | Not given yet — derive (~15% darker) or ask, same open point as blue-hover |

### Accent — red (errors)

| Name | HEX | Usage |
|------|-----|-------|
| `--pep-red` | `#FF8C8C` | Error badges, error text/border, E1–E5 states |

🟡 This is a mid-tone pastel, lighter than a typical "danger red" — good as
a soft background or border, but plain white text directly on it may not
pass contrast for body copy. Default to using it for backgrounds/borders
and keep error *text* in `--pep-ink`, not white, unless tested otherwise.

## Typography

🟡 Not specified yet. Neither reference screenshot (ITO login, wireframe)
uses a distinctive custom font — both read as system-default. Proposal:
keep the wireframe's stack until/unless Pepito has a brand font:
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

| Role | Size | Weight |
|------|------|--------|
| TBD | TBD | TBD |

## Layout & Composition

Confirmed direction (differs deliberately from the ITO login reference,
see comparison below):

- **Split screen, 80 / 20** in landscape, **75 / 25** in portrait — not
  50/50. Confirmed live: 80% blue reads too cramped on the white strip
  once the viewport is taller than it is wide (portrait tablet). Applied
  via `@media (orientation: portrait) { .panel { flex-basis: 75%; } }`.
  - **Left, 80% (75% portrait)** — `--pep-primary-blue` panel. This is
    the *functional* surface: PIN input, all buttons, the menu screen,
    the checkout table — every interactive screen lives inside this blue
    block.
  - **Right, 20% (25% portrait)** — `--pep-white`, confirmed flat white
    for now (no mascot or gray tint yet in the schematic mock).
- **Logo**: `src/assets/pepito-logo.webp` — user's own asset, placed
  directly in `src/assets/`. (A vector `pepito-by-solvi.svg` was found in
  `~/Downloads` and tried briefly — user didn't recognize/want it, reverted.
  `pepito-logo.png` also sits unused in `src/assets/`, a tighter-crop
  variant, kept per "leave it as is.") Positioned top-right of the white
  strip (top area; the "Login" pill and footer own the bottom). Opposite
  corner from the ITO reference (logo top-left, inside the form panel) —
  intentional, not an oversight.
- Confirmed via schematic mock (`Screenshot 2026-09-02 at 13.05.50.jpg`):
  panel ratio reads close to 80/20, PIN field is a single plain input
  (not segmented boxes), "Anmelden" sits directly below it, both roughly
  centered in the blue panel rather than pinned to a corner.
- ~~Gold pill, flush right~~ — **reverted, final(-ish) form below.** Once
  seen live it read as a clickable button (it isn't one) and drew the eye
  for the wrong reason. `ScreenLabel.vue` is now a plain caption: no
  background/pill/shadow, small uppercase muted text
  (`color: var(--pep-mute)`) — reads as a page name, not an affordance.
  Reuse per-view: "Login" here, "Menu"/"Checkout" etc. on the other
  screens.
- **Logo + card + screen label are one centered cluster** (`.strip-content`,
  `gap: 20px`), not three independently-positioned elements. User felt the
  logo pinned to the top corner made the strip read as awkwardly empty —
  grouping them fixed both that and the "Login pill floating alone in a
  corner" problem at once. Logo bumped from 50px → 60px tall while
  regrouping.
- **Logo**: centered horizontally in the white strip (not pinned to the
  top-right corner as first built).
- ~~Device-frame treatment~~ — **tried and rejected**. First attempt
  wrapped the whole app in a rounded card on a dark backdrop, mimicking
  the MarcoPolo tablet-mockup framing. User rejected this outright: it
  only looks intentional at an arbitrary preview size, doesn't tell you
  anything about how it'll actually render full-screen, and there's no
  reason to add a wrapper around the real page. **Corrected**: the app is
  full-bleed (`.kiosk` fills `100vw`/`100vh` directly, no backdrop, no
  outer margin). Only the blue panel's *inner* corners — the two that
  touch the white strip (`border-top-right-radius` /
  `border-bottom-right-radius: var(--pep-frame-radius)`) — are rounded.
  The outer edges sit flush against the real viewport since there's
  nothing to round them against.
- **Footer credit line**: moved from the white strip to the **blue
  panel**, centered horizontally, near the bottom, **white text**
  (`rgba(255,255,255,.8)`) — `© pepito 2026 · mit ♥ gemacht von Ducito &
  Solvi`. The white strip is too narrow for this line without wrapping
  awkwardly; the blue panel has the room.
- **White strip now does double duty as a status message slot**: the
  checkin "Herzlich Willkommen" text moved off the blue-panel toast
  overlay (removed entirely) into the white strip, vertically roughly
  level with the PIN form. Idle state (no PIN submitted yet, or after the
  welcome message times out) shows a prompt: "Bitte gib deinen PIN ein,
  um dich anzumelden." 🟡 Idea to extend later: a different contextual
  phrase per screen (once Menu/Pause/Checkout views exist) — not built
  yet, flagged as a follow-up. Resets to the idle prompt automatically
  since the message is local component state — no separate cleanup
  needed when the kiosk returns to a neutral PIN screen.
- **Strip message card**: the plain text felt too bare/empty on its own
  ("boring" — user's word). Wrapped it in a soft card using
  `--pep-primary-blue-soft` (not gray — a gray plate read as an
  unrelated utility box; the pale-blue tint ties it back to the brand
  color instead) with two-tier typography: a small uppercase "eyebrow"
  label (`ANMELDUNG` / `EINGECHECKT`) above the bolder main message.
  Card: `border-radius: 16px`, `max-width: 260px`, centered in the
  remaining space below the logo.
- **PIN input icon**: `Lock` icon (see Icons section) inside the PIN
  field, left-aligned, turns red on error state along with the input
  outline.
- 🟡 **Mascot** (open idea, not committed): inspired by the MarcoPolo World
  School reference — a character peeking in from the panel edge with a
  speech bubble. Worth noting: ITO's own "Hej!" login screen already uses
  a bespectacled, bow-tie mascot on the blue panel — reusing *that*
  character instead of designing a new one would tie Stempelmaske
  visually back to the existing ITO/Pepito identity rather than
  introducing an unrelated mascot. The latest schematic mock shows no
  mascot at all (just the logo) — treat as dropped for v1 unless the user
  says otherwise.

### Reference comparison

| | ITO login (`Hej!` screenshot) | Stempelmaske (this project) |
|---|---|---|
| Blue panel role | Branding / greeting only | Functional — contains the form |
| Blue panel size | ~55% | 80% |
| White panel role | The actual form | Decorative strip + logo |
| Logo position | Top-left, inside white panel | Top-right, inside light strip |

## Motion

🟡 Draft, not yet prototyped. Described interaction for the PIN screen:
on a **correct** PIN submit, the form doesn't hard-swap — it slides left,
revealing the next screen state sliding in from the right (horizontal
step transition, similar to a wizard). Applies at minimum to
1 → 2 (Willkommen) / 1 → 3 (menu) / 1 → 5 (Pause beenden). Needs a real
prototype pass before locking timing/easing — flag for the `animate`
skill once components exist.

**Status: not implemented yet.** Right now `router.push()` does a hard,
instant swap — no animation at all. This is a separate step to build once
the Menu/Pause/Checkout screens exist to slide *between*.

🟡 **Explicitly deferred (not a bug):** user asked for this panel-slide to
be built now, tied to the checkin message. Declined for now, on purpose —
there's no real second screen for it to reveal yet (checkin loops back to
the same `/chronology` route), so a slide-out-and-back-to-nothing would
be motion without spatial purpose. Build it for real once M3 (Menu
screen) exists — that's the first transition with genuinely different
content on each side.

**What shipped instead** (via the `animate` skill): the white-strip
message card now gets a proper state-indication treatment on checkin —
flips to full `--pep-primary-blue` with white text and a `scale(1.04)`
pop, and the text itself slides up-and-out / in-from-below on each swap
(Vue `<Transition mode="out-in">`, `--ease-out` token, 200ms). Gated
under `prefers-reduced-motion`. See `LoginView.vue` (`.strip-card`,
`.strip-msg-*` transition classes).

## Components

### Buttons — shared structural tokens

Extracted from Pepito's real Bootstrap-based `.btn` class. These are
**structural** tokens (spacing/radius/shadow/transition), reusable across
all three button colors above — only the color variables swap per variant
(`--bs-btn-bg`, `--bs-btn-border-color`, etc. → our blue/gold/green).

| Token | Value | Note |
|---|---|---|
| Font size | `1rem` (16px) | |
| Font weight | `400` | |
| Line height | `1.5` | |
| Padding (desktop default) | `0.375rem 0.75rem` | 🟡 too small for kiosk — see below |
| Border radius | `4px` (`--pep-radius`) for desktop-scale controls; `6px` (`--pep-radius-lg`) for kiosk-scale ones (56px+ tall inputs/buttons) | Went 4px → 10px → 6px after two rounds of live feedback: 4px read sharp-cornered at kiosk size, 10px overshot into "too rounded" |
| Box-shadow (idle) | `inset 0 1px 0 rgba(255,255,255,.15), 0 1px 1px rgba(0,0,0,.075)` | Subtle glossy top highlight + soft drop shadow |
| Box-shadow (active/pressed) | `inset 0 3px 5px rgba(0,0,0,.125)` | Pressed-in, highlight removed |
| Hover | `color/background-color/border-color` swap to `--bs-btn-hover-*` | Confirmed pattern — hover is a flat color swap only, no shape/shadow change: `.btn:hover { color: var(--bs-btn-hover-color); background-color: var(--bs-btn-hover-bg); border-color: var(--bs-btn-hover-border-color); }` |
| Focus ring | `0 0 0 .25rem rgba(<btn-color-rgb>, .5)` | 4px halo at 50% opacity of the button's own color |
| Disabled opacity | `.65` | |
| Transition | `color, background-color, border-color, box-shadow` @ `.15s ease-in-out` | |

🟡 The hover pattern is confirmed, but the actual hover *hex* per variant
is only derived for blue (`--pep-primary-blue-hover`) — gold and green
hover shades aren't defined yet either (see open questions).

🟡 **Kiosk override**: the roadmap already requires touch targets ≥44×44px
(ticket also flags accidental taps as a real problem — "there was a note
about accidental clicks"). The Bootstrap padding above is a *desktop* default and
is too small for a tablet kiosk. Proposal: bump to `padding: 1rem 1.5rem`,
`min-height: 56px`, and keep generous gaps between adjacent buttons (menu
screen: Pause starten / Zum Checkout) rather than relying on padding alone.

### Button variants

| Variant | Background | Used on |
|---|---|---|
| Primary (blue) | `--pep-primary-blue` / hover `--pep-primary-blue-hover` | "Anmelden" |
| Gold (pause) | Gold gradient, see above | "Pause starten", "Pause beenden" |
| Success (green) | `--pep-green` | "Zum Checkout", "Checkout" |
| Danger (red) | `--pep-red` | Error states (E1–E5) |

## CSS organization

**All CSS lives in one file: `src/styles/main.css`** (imported once in
`main.ts`). No `<style scoped>` blocks in `.vue` files — components have
`<script setup>` and `<template>` only, styled by plain global class
names defined in `main.css`, organized by section comments (`/* ===
LoginView === */` etc.).

This was an explicit user decision, reversing the Vue-idiomatic default
(scoped-per-component styles). Trade-off worth knowing: Vue's `scoped`
attribute auto-namespaces class names so two components can reuse the
same class name (e.g. two different `.card`s) without colliding — a
single global file loses that safety net. Mitigation: keep class names
specific/component-prefixed (`strip-card`, `pin-input`, not generic names
like `.card` or `.input`), and when two views need visually identical
elements, share one class (`.placeholder-screen`/`.placeholder-hint`,
used by both `CheckView.vue` and `CheckoutView.vue`) instead of each
defining their own copy.

## Icons

**Package:** `@lucide/vue` (Lucide, the maintained successor to the now-
deprecated `lucide-vue-next`). User asked for Phosphor or Lucide, either
fits — picked Lucide for the simpler tree-shakeable component API. First
use: `Lock` icon inside the PIN input.

## Open questions before this can be treated as final

1. Hover hex for gold and green variants — only blue has a derived guess.
2. Real value of `--pep-primary-blue-hover` — is `#247AB3` close enough,
   or is there an exact production value to copy?
3. Font family — reuse an existing Pepito brand font, or is system-default
   fine for this kiosk app?
4. ~~Icon package~~ — resolved, `@lucide/vue`.
5. Mascot — schematic mock shows none; treat as dropped for v1 unless told
   otherwise.
6. Green (`#D2F0C8`) and gold need to be seen live before calling them
   final — user explicitly wants to judge them in the running app, not on
   paper.
7. ~~Real pepito logo asset~~ — resolved. (A vector SVG was tried and
   reverted per the user's own request — current asset is their
   `pepito-logo.webp`, not a vector.)
8. **Responsive behavior below tablet width — untested, open.** Only
   breakpoint that exists is `@media (orientation: portrait)` (80%→75%
   panel split), aimed at a portrait *iPad*, not narrow phone widths.
   Below that (e.g. a phone-width viewport) nothing has been verified:
   the PIN form (`width: min(360px, 80%)`), strip card
   (`max-width: 260px`), logo (65px), and paddings are all sized for
   tablet-or-larger and haven't been checked at smaller widths. Target
   per the ticket is iPad only (kiosk hardware is fixed), so this may not
   matter — confirm whether phone-width support is actually in scope
   before spending effort on it.

## Resolved this round

Border radius (4px), hover interaction pattern (flat color swap via
`--bs-btn-hover-*`), green accent (`#D2F0C8`), red/error accent
(`#FF8C8C`), logo asset located, right strip confirmed flat white,
overall 80/20 layout + PIN field styling confirmed against a real
schematic mock.
