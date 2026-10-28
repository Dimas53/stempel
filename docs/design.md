# Design System

Fill this file BEFORE writing any UI code.
The agent reads this file before every UI task.

Legend: 🟡 = draft / not confirmed with the team yet (mirrors the convention
used in `notes/stempelmaske-wireframe-v3.html`). Everything else below is
either given directly by the user or pulled verbatim from existing the original project
production CSS.

## Colors

### Brand

| Name | HEX | Usage |
|------|-----|-------|
| `--pep-primary-blue` | `#2A8FD2` | Confirmed brand blue. Main panel fill (80% block), primary buttons, focus rings, links |
| `--pep-primary-blue-hover` 🟡 | `#247AB3` | Derived (~15% darker). Hover/active state for blue elements. Real token name exists in the original project's Bootstrap CSS (`--pep-primary-blue-hover`) — **ask for the actual hex used elsewhere in the app instead of this derived guess** |
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
| `--pep-white` | `#FFFFFF` | Base background, per reference login reference ("white background, blue as an accent, not a fill") |
| `--pep-ink` | `#1A2230` | Primary text |
| `--pep-mute` | `#6B7688` | Secondary text, placeholders |
| `--pep-line` | `#C7CEDB` | Borders, dividers |
| `--pep-line-soft` | `#DFE4EC` | Soft borders, table separators |
| `--pep-panel-gray` | `#EEF1F6` | The ~20% side panel background (see Layout below) — used when that strip isn't pure white |

### Accent — gold (Pause actions)

Pulled **verbatim** from an existing the original project component
(`a reference button`) — not a new invention, so it stays consistent
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
**Resolved — hover behavior**: taken from a real the original project button reference
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

🟡 Not specified yet. Neither reference screenshot (reference login, wireframe)
uses a distinctive custom font — both read as system-default. Proposal:
keep the wireframe's stack until/unless the original project has a brand font:
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

| Role | Size | Weight |
|------|------|--------|
| TBD | TBD | TBD |

## Layout & Composition

Confirmed direction (differs deliberately from the reference login reference,
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
- **Logo**: `src/assets/stempel-logo.svg` — own vector asset (clock-stamp
  icon + "Stempel" wordmark), favicon `public/favicon.svg`. Positioned top-right of the white
  strip (top area; the "Login" pill and footer own the bottom). Opposite
  corner from the reference (logo top-left, inside the form panel) —
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
- 🟡 **Revisited as a toggle, not a replacement.** Same idea as above
  (fixed-size rounded card on a neutral gray page) came back later, this
  time explicitly framed as "let's try it as an option" rather than the
  only look — so it's implemented as a live toggle
  (`useLayoutMode.ts` + a corner button in `KioskShell.vue`), full-bleed
  stays the default and is completely unaffected when the toggle is off.
  Card mode: `#f2f3f5` page background, card sized
  `min(760px, 92vw) × min(460px, 85vh)`, ratio 62/38 (not 75/25 — too
  narrow on the white side at this smaller absolute size), buttons/PIN
  input stretch full-width instead of staying content-sized. Not a
  decision yet — a live A/B to react to.
- **Footer credit line**: removed (the kiosk is not a website, no footer needed).
  The `.credits` CSS and the card-mode bottom padding are leftovers.
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
  speech bubble. Worth noting: the reference app's own "Hej!" login screen already uses
  a bespectacled, bow-tie mascot on the blue panel — reusing *that*
  character instead of designing a new one would tie Stempelmaske
  visually back to the existing original identity rather than
  introducing an unrelated mascot. The latest schematic mock shows no
  mascot at all (just the logo) — treat as dropped for v1 unless the user
  says otherwise.

### Reference comparison

| | reference login (`Hej!` screenshot) | Stempelmaske (this project) |
|---|---|---|
| Blue panel role | Branding / greeting only | Functional — contains the form |
| Blue panel size | ~55% | 80% |
| White panel role | The actual form | Decorative strip + logo |
| Logo position | Top-left, inside white panel | Top-right, inside light strip |

## Motion

The white-strip message card gets a state-indication treatment on every
status change: flips to full `--pep-primary-blue` by default, `--pep-green`
for good-news messages like returning from a pause, or the pale
`--pep-gold-bg-soft` for going *into* a pause (`useStatusCard`'s `tone:
'default' | 'positive' | 'pause'` option) — with a `scale(1.04)` pop, and
the text itself crossfades via `<Transition mode="out-in">`. Gated under
`prefers-reduced-motion`. See `KioskShell.vue` (`.strip-card`,
`.strip-msg-*`).

### Route transitions — `<Transition name="panel-slide" mode="out-in">` in `App.vue`

The blue panel's own route transition went through many rejected shapes
before landing on **two different treatments for the two layout modes**
(`useLayoutMode`) — full-bleed and card mode don't share one animation
language, and forcing them to converge on a single motion made both
worse. All of this lives in `main.css`'s "Panel transition" section.

**Card mode** (`.kiosk--card`): a same-edge drawer. The blue block
(background *and* content together — `.panel-view` carries the gradient
that's actually seen) exits left and stays gone (`.panel-slide-leave-active`,
plain `transition`, `--ease-drawer`). `.panel` itself is overridden to a
flat `--pep-primary-blue-soft` in card mode specifically so that what's
revealed *behind* the sliding `.panel-view` mid-exit reads as neutral
empty space, not a second copy of the saturated gradient (see the
full-bleed note below for why `.panel` has a background at all now — it
didn't used to). The
entrance is where the personality is: the incoming panel travels right,
"hits" the white strip, and does a decaying three-hit bounce — recoils
left, hits again smaller, recoils again even smaller, settles
(`@keyframes panel-enter-bounce`). Each recoil is roughly 0.4× the last
(-5% → -2% → -0.8%) and each cycle is proportionally faster too, not
just smaller — a real bounce's period shrinks along with its height.
Notes for anyone tuning this further:
- Each hit/recoil leg needs **alternating** `--ease-out` (leaving an
  impact) / `--ease-in` (falling into the next one) on the keyframe
  stops, not a uniform `--ease-in-out` — the same curve on both sides of
  a peak zeroes the velocity from both directions at once, which read as
  an artificial "hold" rather than a continuous bounce. This includes the
  very first leg (0% → the first hit) — it's a fall into an impact too,
  same as every approach-to-a-hit leg after it, so it needs `--ease-in`
  set explicitly. Missing this on 0% specifically (it silently inherited
  `--ease-out` from the `animation` shorthand instead) is a real bug that
  shipped for a while — read as the panel "braking" right before the
  first hit instead of slamming into it.
- This works in card mode specifically because the blue block has
  visible edges against the gray page backdrop, so it reads as an
  *object* changing place. It does not work in full-bleed mode (below) —
  a full-viewport color mass doesn't have edges to read as an object, so
  the same motion (in *any* direction: left, right, up, down, or even a
  full-panel crossfade — all tried) reads as the floor moving, not
  something changing place. Don't reintroduce panel-level motion in full
  mode; the finding was consistent across every direction tried.

**Full-bleed mode**: the panel's background/position stays fully static —
that finding (no slide, no bounce, no whole-panel crossfade; every
direction was tried and rejected as "the floor moving") still stands.
What changed: `.panel` (the persistent wrapper in `KioskShell.vue`) now
carries the same `--pep-panel-gradient` as a permanent backdrop, so the
routed `.panel-view`'s own opacity can fade between routes
(`.kiosk:not(.kiosk--card) .panel-slide-enter/leave-active`, `opacity
220ms`) without ever revealing anything behind it — two identical
gradients blended at any opacity are indistinguishable from either alone.
The visible result is a **content crossfade**: the form/buttons/credits
sitting on top of the gradient fade out then in, while the background
itself reads as perfectly static throughout. This is the "how do the
buttons/PIN input themselves disappear during a transition" item flagged
below as deferred — now done, and deliberately scoped to content only,
not a reopening of the panel-level-motion question.

The only *other* motion tied to this screen is two effects fired from
the button click itself, shared across screens via `useRippleEffect.ts`
(`RIPPLE_VISUALLY_DONE_MS`) — wired on `LoginView.vue`'s "Anmelden" and
all three of `CheckView.vue`'s buttons (Pause starten/beenden, Zum
Checkout) via `spawnRipple(event)`, anchored at the click point. Tried
that same click-anchored version on `CheckoutView.vue`'s "Checkout" too
(this screen used to also have a confirm dialog; the dialog's translucent
backdrop meant the ripple had to be hard-removed right as it opened, no
fade to soften it) — but rejected on its own merits once the dialog was
gone too: this button sits low on the screen, and a glow centered there
just read badly. Landed on `spawnRippleFromCorner()` instead — same
effect, anchored at the panel's own top-left corner rather than the tap
point, growing diagonally toward the button. This isn't an arbitrary
choice: it reproduces something the user had already seen and liked by
accident — pressing Enter to submit `LoginView`'s PIN form fires a
browser-synthesized click on the submit button whose `clientX`/`clientY`
default to `0`, landing almost exactly at the panel's top-left corner.
  1. **`.ripple-ring`** — a single soft radial glow spawned at the click
     point (`spawnRipple` in the view), reusing `--pep-panel-gradient`'s
     own light→dark stops so it reads as "the panel's own blue
     redistributing" rather than a foreign color laid over it. Grown via
     `width`/`height` (not `transform: scale`) so its percentage-based
     gradient stops keep their proportions as it expands — the one place
     in the app that knowingly breaks the transform/opacity-only rule,
     for the same reason the accordion-height exception exists (no
     transform equivalent gives what's needed). `z-index: -1` puts it
     behind the button/form, which requires `.panel-view` to have
     `isolation: isolate` — without an explicit stacking context there,
     the negative z-index escapes up to `.panel` (which gets one for
     free from its own `filter: drop-shadow`) and ends up rendering
     *behind the panel's own background*, i.e. fully invisible. Learned
     this the hard way; if a similar glow gets added elsewhere, check
     for this first.
  2. **`.panel-complete-flash`** — a dark inset shadow along the panel's
     edges (matching `.panel`'s own rounded top-right corner via
     `border-top-right-radius`), firing partway through the glow's
     duration rather than at its literal end — the glow's own colors are
     close enough to the panel's gradient that it reads as "arrived"
     well before its animation technically finishes, so timing this off
     the real duration left a long, do-nothing gap before the flash.
     Reads as a light "press" cue (same idea as `.btn-gold`/`.btn-green`
     `:active`, just around the whole panel instead of one button).
     `RIPPLE_VISUALLY_DONE_MS` (currently 15% of the glow's 4s duration —
     tuned down from 17%) marks this "arrived" moment, and does double
     duty: `LoginView.vue`'s `onSubmit` also awaits it (full mode only)
     before calling `router.push`, so the route change — and the content
     crossfade above that comes with it — doesn't start covering the
     button/ripple before the ripple has had a moment to read. Without
     this the content fade began almost the instant the button was
     clicked, cutting the ripple off while it was still tiny.

Both of these were tuned entirely by feel over many iterations — timing,
opacity curve shape, gradient stop placement, blur radius, all landed
through live user feedback, not calculation. **Screenshots taken via
this project's browser-automation tooling proved unreliable for judging
any of it** (confirmed independently: `animationend` not firing despite
`Animation.playState` reporting `"finished"`, a solid opaque test color
not appearing in a captured screenshot despite `getComputedStyle`
confirming correct layout/paint properties) — don't burn time trying to
verify this kind of thing visually through that channel again; rely on
`getComputedStyle`/Web Animations API for structural checks, and the
user's own live browser for anything about feel.

CheckoutView is fully built now (M4 done) — its "Checkout" button
deliberately doesn't get the ripple/flash, see the full-bleed section
above for why.

## Components

### Buttons — shared structural tokens

Extracted from the original project's real Bootstrap-based `.btn` class. These are
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

| Variant | CSS class | Background | Used on |
|---|---|---|---|
| Gold | `.btn-gold` | Gold gradient, see above | "Anmelden", "Pause starten", "Pause beenden" |
| Green | `.btn-green` | `--pep-green` / hover `--pep-green-hover` / active `--pep-green-active` | "Zum Checkout", "Checkout" |
| Danger (red) | — (inline) | `--pep-red` | Error states (E1–E5) |

A fourth variant, `.btn-outline` (white fill, neutral border), briefly
existed for a checkout confirm dialog's "Nein" — removed along with that
dialog (see the Motion section's full-bleed notes), so back down to
three.

Note: the "Primary (blue)" row this table used to have for "Anmelden" was
never actually correct — Anmelden has been gold since the very first
schematic mock, matching the ticket's own gold/yellow instruction for
Pause buttons. There is no plain blue button anywhere in the built UI;
blue is used only as the panel/background accent, per the original brief
("blue as an accent, not a fill"). `.btn-green` reuses the exact same
structural recipe as `.btn-gold` (hover: thin shadow + `scale(0.985)`;
active: darker/tighter shadow + `scale(0.965)`) with a flat color swap
instead of the gradient-angle rotation, since there's no second green
tone to swap toward yet.

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
3. Font family — reuse an existing the original project brand font, or is system-default
   fine for this kiosk app?
4. ~~Icon package~~ — resolved, `@lucide/vue`.
5. Mascot — schematic mock shows none; treat as dropped for v1 unless told
   otherwise.
6. Green (`#D2F0C8`) and gold need to be seen live before calling them
   final — user explicitly wants to judge them in the running app, not on
   paper.
7. ~~Real logo asset~~ — resolved. (A vector SVG was tried and
   reverted per the user's own request — current asset is their
   `stempel-logo.svg`, not a vector.)
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
