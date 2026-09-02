# Roadmap — Stempelmaske

## Phase 1: Clickable Prototype (Current)

**Goal:** Live prototype with all 14 screens clickable, mock data, no real API.

### Milestone 1: Foundation
- [ ] Project setup (Vue 3 + TypeScript + Vite)
- [ ] Router with 3 routes: `/chronology`, `/chronology/check`, `/chronology/checkout`
- [ ] Mock data layer (MockUser[], DayState)
- [ ] API layer skeleton (`src/api/timeClock.ts`)

### Milestone 2: PIN Auth + Checkin
- [ ] Login screen with PIN input (masked, autocomplete off)
- [ ] PIN validation (E1, E2 errors)
- [ ] Checkin flow → Toast "Willkommen" → redirect

### Milestone 3: Pause Flow
- [ ] Menu screen (Pause starten / Zum Checkout)
- [ ] Pause start → Toast "Pause" → redirect
- [ ] Pause end screen → Toast "Pause beendet" → redirect

### Milestone 4: Checkout Flow
- [ ] Checkout overview (Plan vs Stempel table)
- [ ] Confirm checkout dialog
- [ ] Checkout → Toast "Auf Wiedersehen" → redirect

### Milestone 5: Error Handling
- [ ] E3: Too fast repeat (< 1 minute)
- [ ] E4: Already checked out today
- [ ] E5: Network error simulation (dev mode)

### Milestone 6: Polish
- [ ] Touch-friendly UI (buttons ≥ 44x44px)
- [ ] All toasts with dynamic variables
- [ ] Test with 2-3 mock users

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
