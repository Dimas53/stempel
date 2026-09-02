# ARCHITECTURE.md — Stempelmaske

## Overview

Stempelmaske is a Vue 3 + TypeScript single-page application that replaces a physical time clock terminal. It runs in kiosk mode on a shared tablet — employees authenticate via PIN, register checkin/pause/checkout stamps, and the app returns to a neutral login state after each action.

This iteration is a clickable prototype with mock data. The mock layer is designed to be swapped for real API calls later without changing component code.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Vue 3 (plain, no Nuxt) | Lightweight SPA, no SSR needed for kiosk |
| Language | TypeScript (strict) | Type safety for state machine logic |
| Build | Vite | Fast dev server, standard for Vue 3 |
| State | Pinia or composable | Simple session state, no backend |
| Router | vue-router | 3 routes: `/chronology`, `/chronology/check`, `/chronology/checkout` |
| Data | Mock layer (`src/mocks/`) | 2-3 test users, in-memory DayState |
| API | `src/api/timeClock.ts` | Unified data access layer — mock now, real fetch later |

## Architecture Layers

```
src/
├── api/              ← Data access layer (mock → real API swap point)
│   └── timeClock.ts  ← submitPin(), startPause(), endPause(), checkout()
├── mocks/            ← Mock data (MockUser[], DayState)
├── components/       ← Reusable UI (PinInput, Toast, Button, Table)
├── views/            ← Route-level screens (Login, CheckMenu, CheckoutOverview)
├── composables/      ← State machine logic, timer, toast management
├── stores/           ← Pinia store (if used) for session state
├── styles/           ← Global styles, design tokens
└── types/            ← TypeScript interfaces (MockUser, DayState, etc.)
```

## Key Flows

### State Machine (after PIN submit)

```
PIN submitted
  ├─ empty → E1
  ├─ no match → E2
  ├─ last stamp < 60s → E3
  ├─ checkout done today → E4
  ├─ no checkin yet → checkin → Toast "Willkommen" → redirect to /chronology
  ├─ checkin exists, not paused → Show menu (Pause starten / Zum Checkout)
  └─ in pause → Show "Pause beenden" button

From menu:
  ├─ "Pause starten" → Toast "Pause" → redirect to /chronology
  └─ "Zum Checkout" → Checkout overview

From "Pause beenden":
  └─ click → Toast "Pause beendet" → redirect to /chronology

From Checkout overview:
  └─ "Checkout" → Confirm dialog → Toast "Auf Wiedersehen" → redirect to /chronology
```

### Routes

| Route | Purpose |
|-------|---------|
| `/chronology` | Login / PIN input — default screen, all flows return here |
| `/chronology/check` | Menu (Pause starten / Zum Checkout) OR Pause beenden |
| `/chronology/checkout` | Checkout overview with Plan vs Stempel table |

## Design Decisions

### Why mock layer instead of direct API calls?

The prototype needs to be clickable without a backend. The `src/api/timeClock.ts` module provides a unified interface — components call `submitPin()`, `startPause()`, etc. Today these functions read from mock data; tomorrow they make real HTTP requests. Only the function bodies change, not the callers.

### Why return to /chronology after every action?

This is a kiosk, not a personal app. Multiple employees share one tablet throughout the day. If the app stayed on a user's dashboard, the next person would see someone else's data. Returning to a neutral PIN input ensures isolation between users.

### Why confirmation dialog before checkout?

Checkout is irreversible for the day. Without confirmation, an accidental tap ends the work day. The dialog ("Sie sind dabei, den Arbeitstag zu beenden. Möchten Sie wirklich auschecken?") prevents this.

### Why port 3001?

Port 3000 is occupied by another project (itocook). Vite dev server runs on 3001 to avoid conflicts.

## Gotchas

- PIN field must have `autocomplete="off"` and `type="password"` — browsers love to autofill kiosk PINs
- Minimum 1 minute between stamps — enforced in state machine, not just UI
- Toast texts use dynamic variables (`[Vorname]`, `[Uhrzeit]`) — not literal strings
- E4 error text is verbatim from the original ticket — do not "fix" the wording until Martin/Enrico confirm
