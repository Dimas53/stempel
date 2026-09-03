# Roadmap — Stempelmaske

## Phase 1: Clickable Prototype (Current)

**Goal:** Live prototype with all 14 screens clickable, mock data, no real API.

### Milestone 1: Foundation
- [x] Project setup (Vue 3 + TypeScript + Vite)
- [x] Router with 3 routes: `/chronology`, `/chronology/check`, `/chronology/checkout`
- [x] Mock data layer (MockUser[], DayState)
- [x] API layer skeleton (`src/api/timeClock.ts`)

### Milestone 2: PIN Auth + Checkin
- [x] Login screen with PIN input (masked visually via `type="tel"` +
      `-webkit-text-security`, real numeric keypad on iOS)
- [x] PIN validation (E1, E2 errors) — E3/E4 also wired in, ahead of M5
- [x] Checkin flow → status card shows "Herzlich Willkommen" → reverts to idle

### Milestone 3: Pause Flow
- [x] Menu screen (Pause starten / Zum Checkout) — `CheckView.vue`
- [x] Pause start → status card shows the ticket's exact toast text → redirect
- [x] Pause end screen (same route, branches on `DayState.pauseStartAt`) →
      toast → redirect
- Verified live end-to-end: Login → checkin → Menu → Pause starten →
  Login → Pause beenden screen → Pause beenden → Login → Menu again
      (confirms `isPaused` flips back correctly, not stuck)

### Milestone 4: Checkout Flow
- [x] Checkout overview (Plan vs Stempel table)
- [x] Confirm checkout dialog
- [x] Checkout → Toast "Auf Wiedersehen" → redirect
- Built from the original Redmine ticket's mockup + annotations (see
  PROGRESS.md's 2026-09-03 session). Open question carried into
  `docs/CONTEXT.md`: what the Notiz field is actually for — never
  resolved in the source ticket either.

### Milestone 5: Error Handling
- [x] E3: Too fast repeat (< 1 minute) — cooldown temporarily 5s for
      manual testing convenience, **must revert to 60s before demo/final**
      (see `src/api/timeClock.ts`, `MIN_STAMP_INTERVAL_MS`)
- [x] E4: Already checked out today
- [ ] E5: Network error simulation (dev mode)

### Milestone 6: Polish
- [x] Touch-friendly UI (buttons min-height 56px, generous gap between
      Pause/Checkout buttons per the ticket's accidental-tap concern)
- [x] All toasts with dynamic variables
- [x] Test with 2-3 mock users (manual click-through, not an automated suite)
- [ ] Route slide transition currently sequential (`mode="out-in"`), not
      an overlapping cross-slide — first pass, open to refinement

**Success criteria:** All 14 screens clickable, state machine works correctly, all 5 errors trigger properly.

---

## Phase 2: Design System (After Prototype Approval)

**Goal:** Final visual design based on prototype feedback.

- [ ] Design tokens (colors, typography, spacing)
- [ ] `docs/design.md` with component library
- [ ] Apply design to all screens

---

## Phase 3: Real Backend Integration (Future)

**Goal:** Replace mock layer with real API calls.

- [ ] Backend API endpoints
- [ ] Replace `src/api/timeClock.ts` mock functions with real fetch
- [ ] Authentication (real PIN validation against database)
- [ ] Persistent DayState (database instead of in-memory)
- [ ] Deployment (Docker / Vercel / internal server)

---

## Open Questions (Verify After Demo)

1. E4 text: "Checkin" vs "Checkout" — confirm with Martin/Enrico
2. Toast texts for "Pause beendet" and "Auf Wiedersehen" — team approval needed
3. Scenario relevance (Checkin → Pause → Checkout) — ticket is ~2 years old
4. Who approves final design: Martin, Enrico, or client?
