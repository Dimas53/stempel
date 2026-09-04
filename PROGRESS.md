Chat language: ru

## Session 2026-09-02 — Initial Setup

**Done:**
- Initialized harness scaffold (git, hooks, templates)
- Interview completed with user (Q0-Q6 + brainstorming)
- Key decisions:
  - 14 screens (8 main + 1 confirm dialog + 5 errors)
  - Confirm checkout dialog added before final checkout
  - All toast/error texts as in wireframe
  - E4 text verbatim from ticket (open question)
  - Port 3001 (3000 occupied by itocook)
- Files created:
  - `AGENTS.md` — project rules
  - `HARNESS.md` — entry point, risk levels
  - `docs/CONTEXT.md` — domain glossary
  - `docs/ARCHITECTURE.md` — tech stack, flows, decisions
  - `docs/architecture/pin-auth-flow.md`
  - `docs/architecture/state-machine.md`
  - `docs/architecture/toast-system.md`
  - `docs/architecture/error-states.md`
  - `docs/roadmap.md` — 3 phases
  - `docs/specs/phase-1.md` — clickable prototype spec
  - `docs/skills-cheatsheet.md` — updated for Vue 3 stack

**Next:**
- Start M1 (Foundation) from roadmap
- Vue 3 + TypeScript + Vite setup
- Router with 3 routes
- Mock data layer

## Session 2026-09-02 — Design tokens confirmed, M1 scaffold + Login screen

**Done:**
- `docs/design.md` filled in with real values across three passes: brand
  blue `#2A8FD2`, confirmed blue gradient panel, gold gradient (pulled
  verbatim from an existing Pepito component), green `#D2F0C8`, red
  `#FF8C8C`, border-radius `4px`, hover pattern, 80/20 layout, logo asset
  location. Several items still open (hover shades for gold/green, font,
  icons — see file for the current list).
- Vue 3 + TypeScript + Vite scaffold hand-written (repo wasn't empty, so
  skipped the interactive `npm create vite` wizard): `package.json`,
  `vite.config.ts` (port 3001, `@` alias), `tsconfig*.json`.
- `src/mocks/users.ts` (3 test users), `src/mocks/dayState.ts` (in-memory
  `DayState` store, single access point).
- `src/api/timeClock.ts` — `submitPin()` with the full E1–E4 branching
  from the spec, `startPause()`, `endPause()`, `checkout()`.
- `vue-router` with the 3 required routes; `/chronology/check` and
  `/chronology/checkout` are reachable placeholders (full UI is M3/M4).
- `LoginView.vue` — real, styled per `docs/design.md`: 80/20 split, blue
  gradient panel, PIN input, gold "Anmelden" button, inline E1/E2 error
  display, inline "Willkommen" message on checkin (temporary — real Toast
  component is a separate milestone).
- Verified: `vue-tsc --noEmit` passes clean, `npm run dev` serves
  `/chronology` on :3001 without console/build errors (checked via curl +
  dev server log — visual browser check was requested but the
  claude-in-chrome extension wasn't connected this session).
- Updated `docs/architecture/pin-auth-flow.md` to match what was actually
  built (no separate `PinInput.vue`, added `useSession.ts`/`dayState.ts`
  to the file table, noted the toast/E3-E5 gap).

**Next:**
- M3: Menu screen (Pause starten / Zum Checkout) + Pause beenden UI
- M4: Checkout overview table + confirm dialog
- Real Toast overlay component (replaces the inline placeholder in LoginView)
- Judge green/gold live and lock in hover shades once seen in the browser

## Session 2026-09-02 — Visual feedback pass on LoginView

User ran the app themselves and sent screenshots comparing it to the
references. Fixes applied:
- Panel gradient toned down — `#024→#3ea3dc` looked muddy/"too much" in
  the middle; replaced with a same-family blue gradient (see
  `docs/design.md`).
- Added `--pep-radius-lg` (10px) for kiosk-scale controls (PIN input,
  error banner, Anmelden button) — 4px alone read as sharp-cornered once
  scaled up to touch size.
- Added `ScreenLabel.vue`, small muted label naming the current screen
  ("Login") bottom-left of the blue panel — reversed an earlier call that
  the schematic's "Login" pill was just a mockup-tool label to ignore;
  turns out it's wanted for real. Exact corner is a first guess, flagged
  open in design.md.
- Logo left as-is — asset looks rough scaled up, user will provide a
  better source file.
- Confirmed to the user: the slide/swipe transition between screens is
  **not implemented** yet (instant `router.push()`), and gave them the 3
  mock PINs (1234 / 5678 / 9090) so they can click through the happy path
  themselves.

## Session 2026-09-02 — Browser reconnected, second visual pass, live verify

claude-in-chrome extension reconnected after user relaunched Chrome and
re-logged in. Did a real side-by-side against the MarcoPolo reference
this time instead of working from screenshots alone:
- Panel gradient toned down again — `#3ea3dc→#1b5c86` still read as too
  much contrast; narrowed to `#4bafe0→#1f6fa0`.
- `--pep-radius-lg` dialed back from `10px` to `6px` — 10px overshot into
  "too rounded" once seen next to the reference.
- Moved `ScreenLabel` ("Login" pill) from the blue panel to the white
  strip, bottom-right, with a pale-yellow pill background
  (`--pep-gold-bg-soft`) — matches the original schematic mock, which the
  first placement had gotten wrong.
- Verified live in the browser: E1 (empty PIN), E3 (resubmit under 60s —
  triggered by accident while testing, confirms the guard works), and the
  checkin happy path (PIN `5678` → "Herzlich Willkommen Enrico, du bist
  jetzt eingecheckt" toast, caught on screen). Did not verify the
  checkin→menu transition live (requires waiting out the 60s stamp guard)
  but the code path is the same shape as the toast branch.

## Session 2026-09-02 — Third visual pass: device-frame, icons, footer

Direct side-by-side against the MarcoPolo reference again, five concrete
asks this round:
- Wrapped the whole kiosk in a rounded "device frame" card centered on a
  dark backdrop (`--pep-frame-radius: 28px`, `--pep-stage-bg`) — matches
  the tablet-mockup framing in the reference. Flagged in design.md that
  this may need rethinking once the app runs truly full-screen on a real
  kiosk tablet (no "outside" for the backdrop to show there).
- `ScreenLabel` ("Login" pill) restyled with the same gold gradient as
  the Anmelden button (was pale-yellow), made bigger, raised off the
  bottom edge, pushed toward the strip's right edge.
- Logo re-centered horizontally in the white strip (was pinned top-right).
- Added a small muted footer credit line: "© pepito 2026 · mit ♥ gemacht
  von Ducito & Solvi".
- Added `@lucide/vue` (picked over Phosphor — simpler tree-shakeable API;
  `lucide-vue-next` is deprecated, used the maintained successor instead)
  and put a `Lock` icon inside the PIN input, turns red on error state.
- Re-verified live after the refactor: empty-PIN error (E1) and the red
  error state (including the new icon) both still work correctly.

## Session 2026-09-02 — Reverted device-frame, fourth visual pass

User rejected the device-frame wrapper from the previous round outright
— it only looked intentional at an arbitrary preview size and added a
wrapper around the real page for no reason. Corrected:
- Removed `.stage`/dark backdrop/outer rounded card entirely. Back to
  full-bleed `.kiosk` filling `100vw`/`100vh` directly.
- Rounded only the blue panel's *inner* corners (the two touching the
  white strip) via `border-top-right-radius`/`border-bottom-right-radius:
  var(--pep-frame-radius)` — matches what the user drew by hand on a
  screenshot. Outer edges stay flush/square against the real viewport.
- `ScreenLabel` ("Login" pill) now sits flush against the real right
  edge of the viewport (`right: 0`, right corners squared off, left
  corners still rounded) instead of floating near the edge with padding.
  Verified via computed styles: `right: 1366` === `window.innerWidth`.
- Moved the footer credit line off the (too-narrow) white strip onto the
  blue panel, centered, in white text.
- Re-verified E1 still fires correctly after the refactor.

## Session 2026-09-02 — Anmelden hover effect

User pointed at a real Pepito button (`Demotermin buchen`) as the hover
reference: gradient shifts toward a corner, a light streak sweeps across,
overall reads as darkening. Implemented on `.btn-anmelden`:
`background-position` transitions 30%/30% → 80%/70%, `filter:
brightness(0.92)` darkens it, and a `::before` diagonal-gradient
pseudo-element sweeps from -120% to 120% via `transform`. Verified live
via hover + zoom screenshot. Documented as the reusable recipe for future
gold buttons (Pause starten/beenden) in `docs/design.md`.

## Session 2026-09-02 — Real logo SVG, simplified button hover

- User dropped real Pepito logo files into Downloads
  (`pepito-by-solvi.svg`, `-all-blue.svg`) — found them, replaced the
  low-res raster (`pepito-logo.webp`/`.png`) in `src/assets/` with the
  two-tone vector SVG. Also updated `index.html`'s favicon link and added
  a `*.svg` module shim (`src/shims.d.ts`) since none existed yet. The
  SVG includes a real "by solvi" byline — coincidentally matches the
  placeholder credit text from an earlier session almost exactly.
- Simplified the Anmelden hover effect: removed the `::before` diagonal
  shine-sweep pseudo-element added last round — user tried it live and
  said it was one extra thing happening, wanted just the gradient-shift +
  darken. Kept `background-position` transition and
  `filter: brightness(0.92)`, dropped the sweep entirely.

## Session 2026-09-02 — Logo revert: user's own files, not the found SVG

User clarified the `pepito-by-solvi.svg` I'd picked up from `~/Downloads`
wasn't theirs/wasn't wanted — even though it was genuinely sitting in
that folder, they didn't recognize it and asked it removed. They placed
their own `pepito-logo.png`, `pepito-logo.webp` (better quality than the
originals), and `favicon.ico` directly into `src/assets/`. Reverted:
- Deleted `src/assets/pepito-logo.svg` and the now-unused `*.svg` module
  shim in `src/shims.d.ts`.
- `LoginView.vue` import back to `pepito-logo.webp` (the clean icon+
  wordmark version, no "by solvi" text this asset doesn't have anyway).
- `index.html` favicon link now points at the user's `favicon.ico`
  instead of the removed SVG.
- Left `pepito-logo.png` in `src/assets/` unused but present, per "leave
  it as is" — it's a tighter-crop variant, not currently referenced
  anywhere.

## Session 2026-09-02 — White strip as a message slot

User's idea: don't let the white strip sit empty — use it to show the
checkin welcome text instead of a toast overlay, and give it an idle
prompt the rest of the time so it's never blank. Implemented:
- Removed the blue-panel `.welcome-toast` overlay entirely.
- Added `stripMessage` state to `LoginView.vue`, default
  `"Bitte gib deinen PIN ein, um dich anzumelden."`. On checkin success
  it swaps to the "Herzlich Willkommen ..." text for 2.5s (same timing as
  before), then reverts to the idle prompt — no extra cleanup logic
  needed since it's just local component state.
  message.
- Positioned the message text (`.strip-message`) vertically centered in
  the white strip via `margin: auto 0`, roughly level with the PIN form
  on the blue side, per user's follow-up nudge.
- Verified live: idle prompt shows by default, submitting PIN `9090`
  shows "Herzlich Willkommen Olivia, du bist jetzt eingecheckt" in the
  strip, and it reverts to the idle prompt after the timeout.
- Noted in `docs/design.md` as a follow-up idea: a different contextual
  phrase per screen once Menu/Pause/Checkout exist — not built yet.

## Session 2026-09-02 — Strip card + two-tier typography

User felt the plain message text in the white strip looked "boring" /
too empty on its own. Added `.strip-card`: soft card using
`--pep-primary-blue-soft` (deliberately not gray, to read as a brand
element rather than a random utility box) with two-tier typography —
small uppercase eyebrow label (`stripEyebrow`: "Anmeldung" idle /
"Eingecheckt" after checkin) above the bolder main message. Verified
live: idle card shows correctly, PIN `5678` flips both eyebrow and
message text to the checkin state, reverts after the timeout.

## Session 2026-09-02 — Motion pass via `animate` skill

User felt the card's text swap was too subtle ("you don't even notice
it"), compared to the old toast which clearly popped. Ran this
through the `animate` skill's build sequence rather than guessing at
values:
- **Card state change** — built. Occasional-tier trigger, purpose =
  feedback/state indication. `.strip-card` flips to full
  `--pep-primary-blue` (white text) + `scale(1.04)` while a message is
  active, CSS transition (not keyframes, since state is toggled via a
  class binding). Added `--ease-out: cubic-bezier(0.23,1,0.32,1)` to
  `tokens.css` rather than inlining a magic bezier value.
- **Text slide** (user's follow-up mid-turn ask) — added via Vue
  `<Transition name="strip-msg" mode="out-in">` keyed on the message
  text: new line slides up from `translateY(14px)`/opacity 0, old line
  exits up and out. 200ms, `--ease-out` both directions per the skill's
  entering/exiting rule.
- **Panel slide-left** — explicitly declined to build yet, and said so
  plainly per the skill's philosophy: there's no real second screen for
  it to reveal (checkin loops back to the same route), so it would be
  motion without spatial purpose. Documented as a proper follow-up for
  when the M3 Menu screen exists.
- `prefers-reduced-motion` gating added for both the scale pop and the
  slide (color change stays, movement drops).
- Verified live: checkin now visibly flips the whole card blue with a
  pop and a sliding text handoff; type-check and build clean.

## Session 2026-09-02 — Portrait tablet split ratio

User tried 75/25 in a portrait screenshot and preferred it over the
80/20 landscape ratio, which felt too cramped on the white strip once
taller-than-wide. Added `@media (orientation: portrait) { .panel {
flex-basis: 75%; } }` in `LoginView.vue`. Verified live by resizing the
browser window both ways: 820×1180 (portrait) → panel computes to ~74%
of viewport width (rounding/scrollbar noise, not a bug); 1300×850
(landscape) → exactly 80%.

## Session 2026-09-02 — Strip layout regroup, un-button the Login label

User felt the white strip looked disconnected/empty: logo pinned alone
at the top, card floating in the middle, "Login" pill floating alone at
the bottom looked like a clickable button (it isn't one) and they were
unsure about it. Fixed:
- Grouped logo + card + label into one `.strip-content` flex column
  (`gap: 20px`), vertically centered as a unit — logo now sits right
  above the card instead of pinned to the top corner.
- Logo height 50px → 60px.
- `ScreenLabel.vue` restyled from a gold-gradient pill to a plain
  uppercase caption (`var(--pep-mute)`, no background/shadow) — no
  longer reads as a button to tap.
- Declined to build the "dots under the card" pagination idea yet — user
  was explicitly unsure themselves, and it doesn't map cleanly onto a
  branching state machine (not a fixed-length wizard). Offered a
  decorative (non-literal) version instead; waiting on their call.
- Verified live via screenshot + zoom; type-check and build clean.

## Session 2026-09-02 — Divider between card and Login label

User tweaked some sizes locally (panel back to 75%/70% portrait, logo to
65px, `.strip-content` gap to 30px — left as-is, not reverting). Added a
thin `.strip-divider` (40px × 1px, `var(--pep-line)`) between the card
and the "Login" caption, with its own `margin-bottom: 16px` stacking on
top of the flex `gap` so the label sits further from the divider than
the divider sits from the card. Verified live; type-check and build
clean.

## Session 2026-09-02 — Panel shadow/radius, gold gradient, button states (deferred docs, now confirmed)

User asked to skip doc updates during this round until the look was
confirmed final — they've now signed off ("let's leave it like this for
now"), so recording it all now:
- `.panel`: added `filter: drop-shadow(6px 0 20px rgba(15,50,90,.3))`
  (not `box-shadow` — that would get clipped by the panel's own
  `overflow: hidden`). Radius changed to top-right only
  (`border-bottom-right-radius` removed) per the user's hand-drawn
  annotation on a screenshot.
- `.pin-input` / `.btn-anmelden` got explicit shadows with user-supplied
  exact values (`0 3px 10px rgba(10,40,80,.18)` and
  `rgba(90,60,10,.25)` respectively).
- Gold gradient simplified from the 4-stop repeating-stripe version to a
  plain two-stop diagonal (`#f6d27a → #c9922e`) — the stripe read as an
  unwanted "premium banner" shimmer.
- Button hover/press went through several iterations before landing:
  angle-rotation hover effect (`--pep-gold-gradient-angle`, registered
  via `@property` for smooth interpolation — hit a real bug where
  chaining the animated angle through a second custom property
  (`--pep-gold-gradient`) silently failed to update `background-image`;
  fixed by referencing the angle directly). Added `:active` as the real
  touch-press trigger (`:hover` barely fires on iPad taps) plus a
  `:hover` mirror gated to `(hover: hover) and (pointer: fine)` so touch
  never gets stuck in it. Hit and fixed a genuine hover-flicker bug:
  `transform: translateY()` on `:hover` shifts the hit box under a
  stationary cursor near an edge, flickering hover on/off in a loop —
  verified the fix with a scripted 1.2s `:hover`-toggle-count check
  (0 flickers) rather than just eyeballing it. Settled on the user's
  explicit 3-state spec: default = gradient only, no shadow; hover =
  thin light shadow + `scale(0.985)`; active = shadow gets *more*
  visible/darker/sharper (not fainter) + `scale(0.965)`. Also added a
  `:focus-visible` outline (a state that was simply missing) and fixed
  the PIN input's on-screen keyboard: `type="password"` silently ignores
  `inputmode="numeric"` on iOS Safari, switched to `type="tel"` +
  `-webkit-text-security: disc` for CSS-based masking instead.

## Session 2026-09-02 — CSS consolidated into one file

User asked two things: (1) flagged that responsive/adaptive behavior is
untested below tablet width — recorded as an open question in
`design.md` rather than guessed at, since the ticket's stated target is
iPad only and it's unclear if phone-width support is actually in scope;
(2) explicit directive to stop using per-component `<style scoped>`
blocks and consolidate all CSS into one file.

Did (2): renamed `src/styles/tokens.css` → `src/styles/main.css`, moved
every scoped `<style>` block (`LoginView.vue`, `ScreenLabel.vue`,
`CheckView.vue`, `CheckoutView.vue`) into it organized by section
comments, removed all `<style>` blocks from `.vue` files entirely.
`CheckView`/`CheckoutView`'s identical `.placeholder`/`.hint` rules
merged into one shared `.placeholder-screen`/`.placeholder-hint` pair
instead of duplicating them now that there's no per-component scoping to
rely on. Updated the `main.ts` import. Documented the scoped-CSS
collision trade-off this creates in `design.md`. Verified: 0 `<style>`
tags remain in `src/`, type-check and build clean, visually identical in
the browser, `/chronology/check` placeholder renders correctly with the
new shared classes.

## Session 2026-09-02 — Menu screen (M3), shared shell, route slide

Built the Menu / Pause beenden screen for real (M3), pulling requirements
from the raw ticket text the user pasted in (matches `notes/stempelmaske-tz.md`,
no surprises). Refactored first since a second real screen made the
duplication obvious:
- New `src/components/KioskShell.vue` — extracted the blue panel + white
  strip (logo, status card, divider, screen label, credits) out of
  `LoginView.vue` into a reusable shell taking `screen-label`,
  `status-eyebrow`, `status-message`, `status-active` props and a default
  slot for the panel content. `LoginView.vue` now just supplies the PIN
  form into that slot.
- `.btn-anmelden` renamed to `.btn-gold` (generic, reusable) since Pause
  starten/beenden need the identical gold treatment. Added `.btn-green`
  with the same structural recipe (thin shadow + `scale(0.985)` hover,
  darker/tighter shadow + `scale(0.965)` active) but a flat color swap —
  no second green tone was given to build a gradient from.
- `CheckView.vue` built out fully: reads `getCurrentDayState()` (new
  export in `api/timeClock.ts`) on mount to decide Menu (not paused) vs
  Pause beenden (paused) — two buttons vs one, per the ticket. Toast
  texts match the ticket verbatim for Pause starten
  ("[Vorname] [Nachname], du bist jetzt in der Pause, [Uhrzeit]"); Pause
  beenden's text is still the placeholder from the open-questions list
  (not in the ticket, needs confirmation). `startPause`/`endPause` now
  return the timestamp they stamped so the UI displays exactly what was
  persisted instead of recomputing `new Date()` a second time.
- `CheckoutView.vue` lightly updated to use the shared shell too, so it's
  visually consistent while M4 (the real table) isn't built yet.
- Route-level slide transition finally implemented in `App.vue`
  (`<Transition name="route-slide" mode="out-in">`) — this was explicitly
  deferred earlier for lack of a second real screen; now that Menu exists
  it has real spatial meaning. Sequential, not overlapping — see
  `docs/design.md` Motion section for the trade-off.
- Icons added: `Pause` (Pause starten), `Play` (Pause beenden — "pause-out"),
  `LogOut` (Zum Checkout), all from `@lucide/vue`.

**Verified live, full cycle**, working around the real 60s stamp cooldown
by actually waiting it out (not faking timestamps): PIN → checkin toast →
PIN again → Menu (Thomas Weber, two buttons) → Pause starten → toast →
redirect to Login → PIN again → Pause beenden screen (single yellow
button) → Pause beenden → toast → redirect → PIN again → back to Menu
(confirms `isPaused` correctly flips back false). "Zum Checkout" verified
navigating to the (placeholder) checkout screen in the same shell.

**Debugging note, not a code bug:** both the user and I independently hit
what looked like a stuck E3 ("too fast") that wouldn't clear even after
waiting — root cause was Vite HMR/full-page reloads firing (from me
actively editing files) while testing was happening in the same browser
tab, which resets the in-memory `dayStates` Map and makes the *next* PIN
submission look like a fresh checkin, restarting the 60s clock. Not a
logic error — confirmed by waiting a real, uninterrupted 60s and getting
the correct Menu screen every time.

**Temporary, must revert:** `MIN_STAMP_INTERVAL_MS` in `api/timeClock.ts`
dropped from 60s to 5s purely so manual click-through testing doesn't
require actually waiting a minute at each step. Flagged with a `TEMP`
comment and in `docs/roadmap.md`'s M5 checklist — revert to 60_000
before this is considered done.

Also bumped the toast display duration (2000-2500ms → 3500ms) on
Login/Check per user feedback that the confirmation felt too brief to
trust it had registered — logic unchanged, purely a duration tweak after
explicitly deciding *against* making the login screen show a persistent
per-user greeting (would violate the kiosk's neutral-between-employees
principle established earlier).

## Session 2026-09-02 — CheckView redirect feel + horizontal buttons

That 3.5s bump landed wrong on `CheckView.vue` specifically — felt like
lag on the way *out* rather than confidence. Fixed by separating the two
concerns:
- The Pause starten/beenden button itself now flips its own icon (→
  `Check`) and label (→ "Pause gestartet"/"Pause beendet") the instant
  it's clicked and gets disabled, so confirmation is visible right at the
  point of contact, not only in the status card across the panel.
- `REDIRECT_DELAY_MS` back down to 2000ms (from 3500) — the status card
  still gets read, but the screen doesn't linger.
- `.check-actions` switched from a vertical stack to a horizontal row
  (`flex-direction: row`, `gap: 32px`) — user wanted the buttons side by
  side, not stacked. Added `white-space: nowrap` to `.btn-gold`/
  `.btn-green` so labels stay on one line (were wrapping to two).
- Added a shared `:disabled` style for both button classes
  (opacity .65, `pointer-events: none`) — needed once buttons can be
  disabled after their first tap.
- Verified live: click Pause starten → button shows check+"Pause
  gestartet" within ~50ms, status card shows the ticket's exact toast
  text simultaneously, redirects to Login after ~2s. Buttons confirmed
  laid out horizontally with single-line labels.

## Session 2026-09-02 — Redirect timing tune-up, card layout as a toggle

Two more requests right after the above:
- `REDIRECT_DELAY_MS` in `CheckView.vue`: 2000 → 4500. The 2s value was
  right for "don't make the button feel unresponsive" but wrong once the
  button itself already gives instant feedback — 2s wasn't enough time
  to actually read the (now longer) toast sentence. The instant
  button-level feedback stays; only the overall wait before navigating
  away got longer again.
- `.strip-divider` color: `--pep-line` (gray) → `--pep-primary-blue`.

Bigger one: the "device-frame" card layout the user rejected outright
earlier is back — but explicitly as a **toggle**, not a replacement, per
the user's "let's try it as an option/idea" framing this time. Added:
- `src/composables/useLayoutMode.ts` — shared `'full' | 'card'` ref, one
  toggle affects every view since they all render through `KioskShell`.
- `KioskShell.vue` now wraps everything in a `.kiosk-stage` and renders a
  small fixed corner button (`Minimize2`/`Maximize2` from `@lucide/vue`)
  that flips the mode.
- Card mode CSS (`main.css`): light gray page background (`#f2f3f5`), the
  kiosk becomes a fixed-size card (`min(760px, 92vw)` × `min(460px,
  85vh)`) with its own uniform `border-radius` and drop shadow — the
  panel's individual corner radius/separation-shadow filter (needed for
  full-bleed mode) are reset to nothing since the outer card handles all
  four corners now. Ratio shifts 75/25 → 62/38 (75/25 read too narrow on
  the white side at this much smaller absolute size). Buttons and the PIN
  input stretch to the column's full width instead of staying
  content-sized, and `.check-actions` switches back to a vertical stack
  in this mode specifically (stays horizontal in full-bleed mode).
- Verified live on both Login and Menu: toggle switches cleanly, card
  mode matches the user's reference mock closely (gray backdrop, floating
  rounded card, full-width stacked buttons), full-bleed mode is
  byte-for-byte unchanged when the toggle is off. Type-check and build
  clean.

## Session 2026-09-02/03 — Panel-slide transition finalized, ripple + press-flash for full mode

Long, mostly live-tuned session. Full detail (final CSS structure,
reasoning for each technique) is in `docs/design.md`'s Motion section —
this entry is the narrative of how it got there and what to remember.

**Small fixes first:**
- `.credits` was only on `LoginView.vue` (added when it got pulled out of
  the now-persistent `KioskShell.vue`) — added to `CheckView.vue` and
  `CheckoutView.vue` too. Also gave `.panel-view` `position: relative` —
  without it, `.credits` (`position: absolute`) anchored to the static
  `.panel-content` wrapper instead of the sliding view, so it didn't
  travel with the panel during the slide.
- `useStatusCard` gained a `tone: 'default' | 'positive'` option —
  the "Willkommen zurück" (returning from pause) message now shows on a
  green card (`.strip-card--positive`, reuses `--pep-green`) instead of
  the generic active blue.

**Panel-slide transition — the big one.** Went through: a symmetric
same-edge drawer for both layout modes → user found full-bleed mode's
version physically unpleasant no matter the direction (left, right,
bottom-up, and a full-panel crossfade were all tried and rejected) →
settled on treating card mode and full-bleed mode as two separate motion
languages instead of forcing one animation to work for both:
- **Card mode** kept the drawer, refined into a decaying two-hit bounce
  on entry (hits the white strip, recoils, hits again smaller, settles).
  Key lesson from tuning this: alternating `--ease-out`/`--ease-in` per
  bounce leg is required — using the same `--ease-in-out` on both sides
  of a peak creates a dead zone right at the peak (velocity hits zero
  from both directions at once), which read as an artificial pause
  rather than a continuous bounce.
- **Full-bleed mode** ended up with *no panel motion at all* — this was
  a real, repeatedly-confirmed finding, not a compromise: a full-viewport
  color mass moving in any direction reads as the floor moving rather
  than an object changing place, because (unlike card mode) it has no
  visible edges against a backdrop to read as an object.

**Replacement for full-bleed mode: click-triggered effects, not panel
motion.** Currently wired on `LoginView.vue`'s "Anmelden" button only.
- `.ripple-ring`: a single soft glow spawned at the tap point, reusing
  the panel's own gradient colors (light→dark, matching
  `--pep-panel-gradient`) so it reads as "the blue redistributing," not a
  foreign color. Went through a filled white disc (read as a flash) and
  three white hairline rings (read as objects flying apart) before
  landing here. Real bug found and fixed along the way: `z-index: -1`
  alone doesn't scope to the intended parent — without `isolation:
  isolate` on `.panel-view`, the negative z-index escaped up to `.panel`
  (stacking context from its own `filter`) and rendered the glow *behind
  the panel's background*, fully invisible, for a while with no visible
  symptom other than "nothing shows up."
- `.panel-complete-flash`: a dark inset "pressed" shadow along the
  panel's edges, firing partway through the glow's own duration (tuned
  by feel, currently 17% of a 4s glow) rather than at its literal end —
  the glow visually reads as "arrived" well before its animation
  technically finishes, so anchoring the flash to the real duration left
  a multi-second dead gap.
- **Tooling note for future sessions:** browser-automation screenshots
  were unreliable for verifying any of this — confirmed independently on
  two different bugs (an `animationend` listener never firing despite
  the Web Animations API reporting `playState: "finished"`, and a solid
  opaque test color not appearing in a captured screenshot despite
  `getComputedStyle` confirming correct size/position/background).
  `getComputedStyle` and the Web Animations API were reliable for
  structural checks the whole session; only visual screenshots were not.
  Don't re-attempt screenshot-based visual verification for this kind of
  fine animation tuning — rely on the user's own live browser.

**Not done yet, explicitly deferred to next session:** the ripple/flash
treatment only exists on the Login screen's button. Menu (CheckView) and
Checkout still have plain instant buttons in full-bleed mode. Also on
the list: how the buttons/PIN input themselves should disappear during a
transition (separate from the panel-level effect).

## Session 2026-09-03 — Full-bleed content crossfade, gold "pause started" tone

Picked up exactly where last session left off: "how do the buttons/PIN
input themselves disappear during a transition."

**Full-bleed route transition is no longer an instant swap.** Previously
`.kiosk:not(.kiosk--card)` forced `opacity: 1` / `transform: none` at all
times specifically to avoid the "floor moving" problem documented above.
Root cause of that old problem, found this session: `.panel` (the
persistent wrapper in `KioskShell.vue`) had no background of its own — it
only ever showed color because the routed `.panel-view` child painted the
gradient. So any earlier attempt to fade `.panel-view`'s opacity
necessarily flashed whatever's behind it (the page's default background)
partway through.

Fix: gave `.panel` the same `--pep-panel-gradient` as a permanent
backdrop. Two identical gradients blended at any opacity are
indistinguishable from either alone, so now fading the routed
`.panel-view` between 1 and 0 leaves the background reading as
perfectly static — only the content sitting on top of it (which has no
such backdrop double) visibly crossfades. This is a content-level fade,
not a reintroduction of panel-level motion — the earlier finding (don't
slide/bounce/crossfade the whole full-bleed panel) still stands and
isn't being revisited.

Implementation is a one-line change in scope: full mode's
`panel-slide-enter-from`/`leave-to` now sets `opacity: 0` instead of `1`,
and `enter-active`/`leave-active` get a real `opacity 220ms` transition
instead of `none`. Card mode's bounce is untouched.

**Verification note:** this project's browser-automation tab throttles
CSS transitions/rAF when occluded (same root cause as last session's
`animationend` findings, just a new symptom) — mid-test the DOM would
appear "stuck" mid-fade for several seconds with `transitionend` never
firing, purely because the tab wasn't actually painting, not because the
transition was broken. Forcing a screenshot (which requires a real paint)
each time unstuck it immediately and the sequence always completed
correctly. Don't read a stuck-looking class list as a bug in this
environment without first forcing a paint via screenshot.

**Gold tone for "Pause gestartet".** User noticed the status card flips
to generic active blue when starting a pause, inconsistent with the
green `--positive` tone already used for *returning* from a pause.
Added a third `tone: 'pause'` option to `useStatusCard` (`'default' |
'positive' | 'pause'`), a `.strip-card--pause` class using the
previously-unused `--pep-gold-bg-soft` token, and wired it into
`CheckView.vue`'s `onPauseStarten`. Same dark-ink-text override pattern
as `--positive` (the active-state white-text rule would otherwise win).

**Not done yet:** the ripple/flash click effect still only exists on
Login's "Anmelden" button, not CheckView/CheckoutView's buttons.

**Follow-up in the same session: route change now waits for the ripple.**
The content crossfade above meant the leave-fade started covering the
button almost the instant it was clicked — the ripple barely had time to
grow before the screen was already changing. Fix: `onSubmit` in
`LoginView.vue` now awaits `RIPPLE_VISUALLY_DONE_MS` (the same constant
that times `.panel-complete-flash`) before calling `router.push`, full
mode only — card mode has no ripple and navigates immediately as before.
Tried tuning the ratio down from 0.17 to 0.15 in-session; user reverted
it back to 0.17 afterward since that value is tied to the flash timing —
left as 0.17. Verified by timing the actual route change from click (not
by eyeballing a screenshot): landed close to the expected 4000 × ratio.

**Regression found and fixed: card mode's drawer exit was revealing blue,
not neutral space.** Side effect of the `.panel` backdrop gradient added
above for the full-bleed crossfade — `.panel` is a shared class, so card
mode's slide-out (`.panel-view` translating off to the side) started
revealing that same saturated gradient underneath instead of neutral
page space. Fixed by overriding `.kiosk--card .panel` to a flat
`--pep-primary-blue-soft` (`#e5f2fa`) background instead of the gradient
— card mode's reveal now reads as pale empty space, full-bleed mode is
untouched (different selector scope). User caught this by eye; confirmed
via `getComputedStyle` (`.panel`'s `background-color` is exactly
`rgb(229, 242, 250)` in card mode) since screenshotting the exact
mid-slide frame in this automation environment is unreliable, per the
running note on this project.

**Tooling note:** the user keeps a long-running dev server at
`http://localhost:3001/chronology` — reuse that for any live/browser
verification instead of starting a second `npm run dev`.

**Ripple/flash extracted into `useRippleEffect` and wired onto CheckView's
buttons.** This was the explicitly-deferred item from last session
("Menu/CheckView and Checkout buttons don't have the ripple/flash
treatment yet"). Since the effect was about to be used on 2+ screens
(and Checkout is next), pulled `spawnRipple` out of `LoginView.vue` into
`src/composables/useRippleEffect.ts` verbatim — same glow/flash/cleanup
logic, same tuning constants (`RIPPLE_VISUALLY_DONE_MS` now exported so
callers can reuse it for the route-delay pattern below too). `CheckView.vue`
now spawns the ripple from all three of its buttons (Pause starten, Pause
beenden, Zum Checkout) via a small inline `(e) => { spawnRipple(e);
onX() }` handler per button, and `onZumCheckout` gets the same
`RIPPLE_VISUALLY_DONE_MS` route-delay `onSubmit` already had in
`LoginView.vue` (full mode only). `onPauseStarten`/`onPauseBeenden` didn't
need that delay — their own `REDIRECT_DELAY_MS` (2500ms) already far
outlasts the ripple. Verified live: clicking "Zum Checkout" spawns the
glow from the actual click point and the panel-edge flash, then
navigates to Checkout after the same short hold. Checkout's own buttons
(none exist yet, M4 placeholder screen) are the next candidate once they
exist.

## Session 2026-09-03 — Milestone 4: Checkout screen built

Built out `CheckoutView.vue`, previously an M4 placeholder. Source of
truth: the original Redmine ticket screenshots in Downloads
(`4.Checkout_Übersicht.png` and siblings — same ticket, different
attachment lightboxes open), not a literal "Notes" folder (none exists in
this repo or elsewhere searched) — cross-checked against
`docs/roadmap.md` (Milestone 4 checklist) and `docs/specs/phase-1.md`
(screens #7/#8), which already matched the ticket.

**What the ticket actually asked for**, reading the hand-drawn annotations
on the mockup: a Plan-vs-Stempel table (Checkin/Checkout/Pause/Summe,
Summe bold), a "Notiz" field with an info-icon explanation (replacing an
earlier placeholder about Über-/Unterstunden that's crossed out in the
annotation), a green "Checkout" button (renamed from the mockup's red
"Auschecken"), and — per `docs/CONTEXT.md`'s glossary and
`docs/architecture/state-machine.md`'s already-documented flow — a
confirm dialog before the actual checkout fires, since it's the one
irreversible action in the app.

**Table values:** Plan column reads straight from `MockUser.plan`.
Stempel column reads `DayState` — Checkout shows "–" until actually
checked out (this screen is reached *before* that happens), Summe
(Stempel) is live elapsed time so far (`now - checkinAt - pauseSeconds`)
rather than a final total, since checkout hasn't happened yet when this
screen first renders. Pause is always a finalized total by the time a
user can reach this screen — CheckView only offers "Zum Checkout" outside
an active pause, so there's no "currently mid-pause" case to account for
here.

**Confirm dialog** is a plain `v-if` overlay scoped to `.panel-view`
(not a page-wide Teleport) — dims just the blue panel, not the white
status strip, which stays a neutral kiosk surface. No dedicated dialog
component; it's the only modal in the app so far, doesn't justify one
yet. Added `.btn-outline` (white/bordered) for "Nein" — first non-gold,
non-green button variant, since a decline should carry equal visual
weight to "Ja" (`.btn-green`), not read as a muted afterthought.

**Ripple/flash wired onto the Checkout button too**, reusing
`useRippleEffect` — same `RIPPLE_VISUALLY_DONE_MS` delay before the
confirm dialog opens (so the ripple has a moment to land before the
dialog covers the screen), matching the pattern already established for
route changes. The dialog's own Ja/Nein buttons don't get the ripple —
they're modal actions, not full-bleed panel-level presses, and the glow
would render behind the dialog's opaque backdrop anyway (z-index: -1).

**`useToastRedirect` extracted**, per `toast-system.md`'s own note to
revisit once a third view needed "show status card, then leave" —
Checkout was that third view. `CheckView.vue`'s two call sites
(`onPauseStarten`/`onPauseBeenden`) were refactored to use it too, so the
pattern isn't duplicated a third time; `LoginView.vue`'s checkin case
deliberately still doesn't use it, since it reverts the card in place
rather than navigating away, a genuinely different pattern.

**Verified live** end-to-end on the user's own running dev server
(`localhost:3001`, not a server I started): checkin → menu → Zum
Checkout → table renders correct Plan/Stempel values → Notiz field →
Checkout button spawns the ripple → confirm dialog → "Ja" → toast →
redirect to `/chronology`. Confirmed in both full-bleed and card mode.

**Follow-up, same day: two things the first pass got wrong.** User pasted
the actual (unobscured) ticket text, which the screenshots' lightbox had
partially cut off:
1. The Notiz hint text wasn't a placeholder guess after all — the ticket
   spells it out exactly: "Bitte Gründe für Über- und Unterstunden oder
   Änderungswünsche von Zeiteinträgen angeben." Swapped in verbatim; the
   open question logged in `docs/CONTEXT.md` about what this field is for
   is resolved, removed it.
2. The hint was wired via the native `title` attribute, reasoned as "only
   one tooltip in the app, doesn't justify tooltip infrastructure" — but
   the ticket explicitly asks for a visible hover window
   ("wenn man da drauf hovert, dann [Text]"), and `title` is slow,
   inconsistent, and unstyled, which doesn't read as intentional. Replaced
   with a real CSS hover/focus-visible bubble (`.info-tooltip`,
   `.info-tooltip-bubble` in `main.css`) — dark box, small arrow, appears
   on both mouse hover and keyboard focus (`tabindex="0"` on the wrapper).
   Couldn't get the automation's synthetic hover to hold `:hover` across
   separate tool calls to actually screenshot it lit up (same category of
   flakiness as the animation/`animationend` findings from prior
   sessions) — verified the DOM text and CSS are correct by hand instead;
   left it for the user to eyeball hovering live.

**Second follow-up, same day: four issues from live use.**
1. **Route delay felt too long/unclear.** `ROUTE_DELAY_MS` split out of
   `useRippleEffect.ts` as its own constant (`RIPPLE_VISUALLY_DONE_MS *
   0.8`) rather than lowering the shared ratio again — the flash timing
   stays exactly where the user set it (0.17), only the "how long to
   hold before the next screen/dialog" delay dropped ~20%. Used in
   `LoginView`, `CheckView`, `CheckoutView` wherever a route change or the
   confirm dialog was being held for the ripple.
2. **Checkout's ripple reading as "more visible than before, sitting
   above the button."** Root cause: on Login/Check a click always leads
   to navigating away, which unmounts the ripple well before its 4s
   animation finishes. Checkout's "Checkout" button instead opens a
   dialog ON TOP of the same view — the dialog's backdrop is only 45%
   opaque, so the glow kept animating and showing through it for the
   remaining ~3s. Added `clearRipple()` to `useRippleEffect` (removes any
   `.ripple-ring`/`.panel-complete-flash` still in the DOM), called right
   before the confirm dialog opens.
3. **No delay wanted after "Ja."** `onConfirmJa` no longer goes through
   `useToastRedirect` — straight `checkout()` → `router.push('/chronology')`.
   Also matches a fact that was already true and unnoticed: `LoginView`
   resets the status card to idle unconditionally on mount, so a toast
   message set here would have been overwritten within moments anyway.
4. **Notiz info icon too small to hit on an iPad.** Moved the hover/focus
   trigger (`.info-tooltip`) from just the 14px icon onto a wrapper
   around the whole "Notiz" word + icon, with padding + matching negative
   margin so the hit area is bigger without shifting the visible layout.

**Table redesign, round 2.** User referenced a glassmorphic iPad
lock-screen mockup as a "make it more interesting" direction. Kept round
1's table CSS in `main.css`, commented out rather than deleted, in case
this round doesn't stick either. New version (`.checkout-summary`,
`.checkout-row*`) drops the literal `<table>` for a frosted-glass summary
list: circular icon badges, explicit row labels (Checkin/Checkout/Pause/
Summe) instead of relying on icon recognition, each row's real Stempel
value large/bold with its Plan value small and muted underneath instead
of two equal-weight table columns. `backdrop-filter: blur(16px)` for the
glass effect. One click during testing hit a `CDP dispatchMouseEvent`
timeout ("renderer may be frozen or unresponsive") right after this
landed — a JS-dispatched click immediately after worked fine and
subsequent screenshots rendered normally, so it read as automation flake
rather than a real perf issue, but worth a second look if blur-related
jank ever shows up on the actual iPad hardware.

Verified live on the user's own dev server: table renders with the new
list layout, Checkout → ripple → dialog appears with no lingering glow →
"Ja" → back on `/chronology` in well under a second (vs. the old 2.5s).

**Third follow-up, same day.**
1. **"Notiz" label sitting flush on the input, no gap.** Self-inflicted by
   the previous fix's bigger tap target: `.info-tooltip`'s `margin: -8px
   -10px` shorthand set ALL FOUR margins on the same element `.notiz-label`
   is also applied to — since it's defined later in the cascade, it fully
   overwrote `.notiz-label`'s `margin-bottom: 8px` down to -8px instead of
   just leaving it alone. Changed to `margin-left`/`margin-right` only, so
   the vertical spacing from `.notiz-label` survives untouched.
2. **Checkout's "Ja" reverted back to `showToastThenRedirect`.** Went
   instant-redirect for one round reasoning the message would barely be
   visible before LoginView's mount resets it — turned out the user
   specifically wants that window, same as Pause's toasts: it's the only
   place the actual checkout time is shown. `useToastRedirect` re-added,
   `useRouter`'s direct import removed again (not needed once the
   composable owns navigation).
3. **Checkout table reverted to round 1 (the plain table), TEMPORARILY,
   for a side-by-side compare** — the user never got a screenshot of it
   before round 2 (the glass-card list) replaced it. Both `main.css` and
   `CheckoutView.vue`'s template now have round 2 preserved as comments
   right next to round 1 (currently live) — whichever the user doesn't
   pick, delete the commented copy; until then both stay.

Verified live again: Notiz now has visible breathing room above the
input, the confirm dialog's "Ja" shows "Auf Wiedersehen Anna, du bist
jetzt ausgecheckt, 15:10" for the full ~2.5s before redirecting, and the
round 1 table renders correctly for the comparison.

**Fourth follow-up, same day: decision made, one more small timing tweak.**
User compared both table rounds live and picked round 2 (the frosted-glass
list) — swapped it back to active in both `main.css` and
`CheckoutView.vue`, round 1 back to commented-out. Plans to revisit the
icons/time formatting on round 2 further later. Also trimmed
`ROUTE_DELAY_MS` again, this time explicitly *not* touching the 0.17
ripple/flash ratio: `RIPPLE_VISUALLY_DONE_MS * 0.8` → `* 0.7` (~12.5%
off, within the requested 10–15%) — still its own constant, still leaves
the flash exactly where the user tuned it.

**Fifth follow-up, same day: small polish + one reversal.**
- Summe row icon swapped `Sigma` → `Clock` (plain, less math-y).
- Summe's Stempel value now turns green (`#b7e4a0`, `.summe-value.reached`)
  once actual worked time reaches the planned total — a one-line
  `computed(() => stempelSummeMinutes.value >= planSummeMinutes)`, no new
  architecture. To test it live: this screen computes Summe once on mount
  (not a live-ticking clock — `Date.now()` inside a `computed()` with no
  reactive dependency that changes, so it never re-evaluates on its own),
  so waiting on the page does nothing; temporarily shrinking a user's
  `plan` in `src/mocks/users.ts` (e.g. matching checkin/checkout, 0 pause)
  makes the target ~0 minutes so it's already "reached" the moment the
  page loads. Demoed on Thomas, reverted his plan back to 09:00–17:00/
  00:30 afterward.
- **Reverted the ripple/flash off the Checkout button entirely** (removed
  `useRippleEffect`/`useLayoutMode`/`panelViewRef` from `CheckoutView.vue`
  — nothing else there needed them). User found it looked bad specifically
  there: the button sits low on the screen, and unlike Login/Check (where
  navigating away unmounts the ripple gradually via the content
  crossfade), this button's ripple had to be hard-removed
  (`clearRipple()`) right as the confirm dialog opened, with no fade to
  soften the cutoff. Landed on a principled reason it's fine for this one
  button to be the exception: the confirm dialog is already immediate,
  obvious feedback on click — the ripple's whole job elsewhere is
  covering screens that would otherwise change with zero visual
  acknowledgment, which isn't the case here. `onCheckoutClick` is back to
  a plain synchronous handler, dialog opens instantly, no more
  `ROUTE_DELAY_MS` wait on this specific button.
- **Card mode's entrance bounce gained a third, smaller hit.** Was two
  recoils (-5%, -2%); added a third (-0.8%, ~0.4× the last, continuing
  the existing decay ratio) with the same alternating `--ease-out`
  (leaving an impact) / `--ease-in` (falling into the next one) per leg,
  and each cycle proportionally faster than the last — a real bounce's
  period shrinks along with its height, not just its size. Verified via
  the CSSOM (`document.styleSheets` → the `@keyframes panel-enter-bounce`
  rule's 8 stops) rather than trying to screenshot the animation, per the
  standing note that this channel can't reliably judge motion — feel is
  the user's call from their own browser.

**Sixth follow-up, same day: real bug in the bounce, found by feel.** User
tweaked the numbers themselves (46%→1% overshoot, -4%/-1.8%/-0.6% recoils)
but kept sensing "mini brakes" — the panel visibly slowing down right
before the first hit, not slamming into it. Root cause: the 0% keyframe
never set its own `animation-timing-function`, so the very first leg
(0%→46%, the approach into the first impact) silently inherited
`--ease-out` from the `animation` shorthand — the curve meant for
*leaving* an impact (decelerating away from it), applied backwards to an
*approach*. Every other approach-into-a-hit leg (68%, 88%) already used
`--ease-in` correctly; this one just got missed when the bounce was
first authored, before there was a third hit to make the pattern obvious
by comparison. Fixed by setting `--ease-in` explicitly on 0%. Verified
the same way — read back via CSSOM, not a screenshot.

**Seventh follow-up, same day: the real culprit was the curve shape, not
direction.** The ease-in fix above didn't fix the feel — user still felt
a "mini pause" right at each hit before the recoil started. Actual cause:
the site's `--ease-out`/`--ease-in` tokens are both deliberately "strong"
curves whose two control points share the same y (1,1 for ease-out, 0,0
for ease-in) — nearly all the value change happens in a small fraction
of the segment, then the curve sits almost flat for the rest. That's
fine for one big movement (what they're tuned for elsewhere in the app —
buttons, the panel-slide crossfade), but this bounce's legs are short
and small (1-4% of travel), so the flat tail became visible as an actual
pause at every hit before "resuming" into the next leg. Added two
animation-local tokens instead — `--ease-bounce-out` (`cubic-bezier(0.25,
0.46, 0.45, 0.94)`) / `--ease-bounce-in` (`cubic-bezier(0.55, 0.06, 0.68,
0.19)`), standard smooth easeOutQuad/easeInQuad-style curves without the
flat plateau — and swapped every leg of `@keyframes panel-enter-bounce`
onto them, not touching the global `--ease-out`/`--ease-in` used
elsewhere. Also dropped the now-dead `var(--ease-out)` off
`.panel-slide-enter-active`'s `animation` shorthand, since every keyframe
sets its own timing function explicitly now — a default there was never
going to apply to anything, just noise for the next reader.

Mid-edit, caught the two new custom properties missing from `:root` even
though the keyframes already referenced them (`getComputedStyle`
returned empty strings for both) — re-added them and re-verified via
CSSOM that both resolve correctly now.

**Eighth follow-up, same day: confirm dialog removed, ripple redesigned
for one button.** Two changes, same conversation:
1. Removed Checkout's confirm dialog entirely (`showConfirm`,
   `onConfirmJa`/`onConfirmNein`, `.confirm-overlay`/`.confirm-dialog`/
   `.confirm-text`/`.confirm-actions`, and `.btn-outline` — that variant
   existed only for the dialog's "Nein", nothing else used it, deleted
   rather than commented since this is a real decision, not a
   round-1-vs-round-2 comparison). "Checkout" now calls `checkout()` and
   `showToastThenRedirect` directly, same 2.5s hold as before. Turned out
   redundant once built — the toast is already the "did this register?"
   feedback the dialog was also trying to provide.
2. That left the button with *no* click feedback at all (ripple was
   already off it from an earlier round, dialog now gone too) — visibly
   missing something. Ripple-anchored-to-the-click-point was already
   tried and rejected on this specific button (sits low on screen, read
   badly). Landed on a variant instead: `useRippleEffect` gained
   `spawnRippleAt(x, y)` as the shared internal implementation, with
   `spawnRipple(event)` (existing, click-point-anchored) and a new
   `spawnRippleFromCorner()` (anchors at the panel's own top-left corner,
   `(0, 0)`) both built on top of it. Notably, this reproduces an effect
   the user had already seen and liked by accident: pressing Enter to
   submit `LoginView`'s PIN form fires a browser-synthesized click on the
   submit button whose `clientX`/`clientY` default to 0 — which lands
   almost exactly at the panel's top-left corner, so the glow already
   grew diagonally from there instead of from the button. Wired
   `spawnRippleFromCorner()` onto Checkout's button specifically.
   `clearRipple()` (only needed for hiding the ripple under the now-gone
   dialog) removed as dead code.

Verified live: Checkout → glow visibly grows from the panel's top-left
corner diagonally toward the button → button flips to "Ausgecheckt"
immediately, no dialog → toast → redirect, same as before.

## Session 2026-09-03 — Tablet responsive audit + fixes, fixed focus ring, tooltip reposition

**Done (styles only, `src/styles/main.css` — no logic/markup touched):**

- **Horizontal overflow across iPad breakpoints, root-caused and fixed.**
  `.strip` (flex: 1, no min-width) hit the flexbox min-width:auto trap —
  it refused to shrink below its content's intrinsic width (the logo's
  fixed `height: 65px` implied ~224px), so once `.panel`'s flex-basis
  left less room than that, the kiosk overflowed the viewport — on a
  real touch device this reads as the whole page pannable/draggable
  sideways. Fixed with `.strip { min-width: 0; container-type:
  inline-size; }` plus sizing the logo/strip-card/message from the
  strip's own container-query width instead of fixed px, so everything
  inside shrinks with the column instead of forcing a floor under it.
- **Panel/strip ratio**: was two disconnected rules (75/25 full-bleed,
  70/30 portrait-only; 62/38 fixed in card mode, no orientation
  awareness at all). Added width+orientation-tiered breakpoints (≤900px,
  ≤780px+portrait) so Air/mini get relatively more strip room instead of
  the status message wrapping to 3 lines.
- **Card mode height** (`.kiosk--card`): was a flat `500px` for all
  three screens (Login/Check/Checkout) — fit Login, too short for
  Checkout's content, which then collided with `.credits` (absolutely
  positioned, doesn't yield to in-flow content). Bumped to `min(620px,
  90vh)` — same height on all three screens on purpose (they swap via a
  swipe transition, so a per-view auto-height would visibly resize the
  card mid-swipe). `.credits` stays pinned-to-bottom (position: absolute,
  matching full-bleed mode's look) rather than pushed into flow —
  overlap is instead made structurally impossible by reserving bottom
  padding on `.kiosk--card .panel-view` so centered content can't reach
  down into where `.credits` sits.
- Verified live via Chrome device-size emulation across all 12
  combinations (iPad Pro/Air/mini × portrait/landscape × full/card) on
  Login, Check, and Checkout with a real logged-in user (name + filled
  table) — no horizontal or vertical scroll, no overlap, anywhere.
- **Fixed focus ring** on `.pin-input`/`.notiz-input`: neither had an
  explicit `:focus-visible` rule, so the ring users saw was whatever the
  browser/OS defaulted to that session (Chrome's own blue, an autofill
  highlight, a non-default macOS accent color) — reported as "sometimes
  yellow, blue again after reload." Added an explicit `:focus-visible`
  outline in a new `--pep-focus-ring` token (`#175378`, darkened further
  from `--pep-panel-gradient`'s own darkest stop) so it's fixed
  regardless of browser/OS state, matching the pattern already used on
  `.btn-gold`/`.btn-green`/`.info-tooltip`.
- **`.info-tooltip-bubble` (Notiz field hint) repositioning**: was
  centered (`left: 50%; transform: translateX(-50%)`) on `.info-tooltip`,
  which sits near the left edge of a narrow column — centering a 240px
  bubble there pushed its left half past the panel's own edge, where
  `overflow: hidden` cropped it. Changed to grow rightward from the icon
  (`left: -6px`, no centering transform) instead, and widened
  (`max-width: min(300px, 78vw)`) so the copy wraps to 2-3 lines instead
  of 4. Arrow (`::after`) repositioned from bubble-center to
  bubble-left-edge to match.

**Not done / explicitly out of scope this session:** a portrait-only
alternate full-bleed layout (blue panel on top, white strip along the
bottom instead of the side, per a sketch) — user wants to prototype this
next; committed the above first as a checkpoint before trying it.

## Session 2026-09-04 — Portrait bottom-bar experiment, error-card polish, desktop device-frame preview

**Done:**

- **Portrait-only alternate layout, iterated live with the user across
  several passes** (`main.css`, scoped to `.kiosk:not(.kiosk--card)`
  inside `@media (orientation: portrait)` — full-bleed only, card mode
  untouched): white strip moved to the top (`column-reverse`), blue panel
  below. Corner rounding follows the panel wherever it currently sits
  (top-left in this layout vs. top-right in the side-strip layout) — had
  to also fix `.panel-complete-flash`'s hardcoded top-right radius to
  match in both this layout and card mode, or the post-ripple flash
  showed a rounded patch bleeding past what's now a square corner.
  `.strip-content` uses CSS Grid (`grid-template-areas: 'logo status' /
  'card card'`) so the logo/page-name row and the status-card row don't
  depend on DOM order.
- **Status card gets a real error state.** `useStatusCard.ts` gained a
  4th tone, `'error'`, plus `setErrorStatusCard(code, idle, options)` —
  short human-register summaries per PinErrorCode (distinct wording from
  the exact ticket text shown under the PIN field itself — two different
  registers for two different jobs). E3 (rate limit) is special-cased:
  `PinError` now carries `retryAfterMs` (added to `types/timeClock.ts`
  and computed in `api/timeClock.ts`), and the card stays red for exactly
  that long, then flips green with a "try again now" cue — the color
  change itself is the "time's up" signal, not a fixed guessed hold.
  `scheduleRevert()` centralizes every auto-revert timer through one
  `pendingRevert` slot that `setStatusCard` itself clears — fixes a real
  bug where an earlier toast's (e.g. checkin's "Herzlich Willkommen")
  untracked revert timer could fire later and wipe a genuinely current
  error off the card early.
- **E3 masking E4 after checkout, fixed**: `checkout()` also stamps
  `lastStampAt`, so retrying immediately after checking out used to trip
  the rate-limit check (E3, "wait a bit") before the already-checked-out
  check (E4) ever ran — reordered so E4 (more final, more specific) wins.
- **PIN field error text now clears the instant the user edits the
  field** (`LoginView.vue`, `watch(pin, ...)`) instead of only on the
  next submit — was staying stale while the user had already started
  retyping.
- **Status card's active-blue state now uses the panel's own gradient**
  (`background-image: var(--pep-panel-gradient)`) instead of flat
  `--pep-primary-blue` — the flat color read as an off/wrong blue sitting
  right next to the panel's actual gradient.
- **Screen-status breadcrumb redesigned**, twice, per live feedback: the
  old `ScreenLabel.vue` caption (small caps, present on every screen in
  the white strip) read as a tappable button sitting there for no reason.
  First pass moved it inline into `LoginView`'s own form; final version
  (`KioskShell.vue`) is a plain low-contrast breadcrumb (`Zeiterfassung /
  {screen}`, thin weight, no caps/tracking, `rgba(255,255,255,.5)`) pinned
  to the panel's own top-left/top-right corner (whichever is square, so
  it doesn't crowd the rounded one), applied uniformly across all
  screens. `ScreenLabel.vue` and its CSS deleted as dead code once
  nothing referenced it anymore.
- **Desktop device-frame preview** (`DeviceFrame.vue`, new; a few lines
  in `main.ts`): a colleague opening the raw dev/deploy link on a laptop
  used to see the kiosk UI full-bleed and badly proportioned. `main.ts`
  now checks `pointer: coarse` OR `navigator.maxTouchPoints` at boot —
  touch devices (and the `?embedded=1`-marked copy running inside the
  frame's own `<iframe>`) mount the real app as before; anything else
  mounts `DeviceFrame` instead, an iPad-ish bezel around a real `<iframe>`
  of the same URL. Real iframe, not a static mockup, on purpose: it's an
  actual nested viewport, so the app's own orientation-based CSS respons
  correctly when the frame's rotate button swaps the iframe's
  width/height. Device picker (iPad mini/Air/Pro + one Android reference,
  Galaxy Tab S4) uses the same CSS-viewport sizes already validated
  earlier this session. A `matchMedia('(pointer: coarse)')` change
  listener reloads the page so toggling touch emulation in devtools
  doesn't leave a stale frame/no-frame choice on screen — registered
  unconditionally (not just in the "frame shown" branch), since the
  first version only ever caught touch turning on, never off.
- **Vercel/Netlify deploy prep**: `vercel.json` + `public/_redirects`
  (SPA rewrite-to-index.html rules for both) so a quick `npx vercel` or
  Netlify-drop deploy doesn't 404 on a direct/refreshed deep link into
  `/chronology/check` etc. — no GitHub push required either way.

**Not done / open:** the API-readiness prep items agreed earlier this
session (`getCurrentDayState` → async, wiring the Notiz field into
`checkout()`, formal network-error handling beyond the E5 status-card
path) — conversation stayed on UI/UX polish instead; still pending.
