# State Machine

## What It Does

Manages the Checkin → Pause → Checkout flow. Determines which screen to show based on the user's current DayState after PIN submission.

## Files

| File | Responsibility |
|------|---------------|
| `src/mocks/dayState.ts` | In-memory DayState per user (`getDayState`/`setDayState`) |
| `src/api/timeClock.ts` | `submitPin()` (the actual branching logic below), `startPause()`, `endPause()`, `checkout()`, `getCurrentDayState()` (read-only accessor for views) |
| `src/views/LoginView.vue` | Calls `submitPin()`, routes on the returned `action` (`checkin` \| `menu` \| `pause`) |
| `src/views/CheckView.vue` | Reads `getCurrentDayState()` on mount to pick Menu vs Pause-beenden (no separate route for each — see Gotchas) |
| `src/views/CheckoutView.vue` | Reads `getCurrentDayState()` for the Plan-vs-Stempel table, calls `checkout()` on the "Checkout" button click |

No dedicated `useTimeClock.ts` composable — the branching lives directly
in `submitPin()` (returns which screen to show) and in `CheckView.vue`'s
`onMounted` (re-derives paused/not-paused from `DayState` rather than
trusting a value passed from the previous screen, so a direct reload of
`/chronology/check` still resolves correctly).

## Flow

```
PIN valid → submitPin() checks DayState:
  ├─ no checkin → checkin() → status card shows "Herzlich Willkommen" → stays on /chronology
  ├─ checkin exists, not paused → /chronology/check (Menu)
  │    ├─ "Pause starten" → startPause() → status card shows the Pause toast → /chronology
  │    └─ "Zum Checkout" → /chronology/checkout
  │         └─ "Checkout" → checkout() → toast → /chronology
  └─ in pause → /chronology/check (Pause beenden — same route as Menu, branches on DayState)
       └─ "Pause beenden" → endPause() → status card shows the toast → /chronology
```

## Decisions

- State is in-memory (DayState object) — resets on page reload, acceptable for prototype
- Minimum 1 minute between stamps enforced in state machine, not UI — prevents race conditions
- Checkout used to require a confirm dialog (irreversible action, prevent accidental taps) — built, then removed: the resulting toast is already clear feedback that it happened, and the extra step just added friction without preventing much (the button itself isn't accidentally tappable — it's the same size/spacing as every other kiosk button here)
- After every action, redirect to /chronology — kiosk mode, next user must not see previous user's data

## Gotchas

- `lastStampAt` must be updated after every action (checkin, pause start, pause end, checkout)
- `pauseSeconds` accumulates across multiple pauses in one day
- Checkout sets `checkoutAt` and marks day as complete — any subsequent PIN today triggers E4
- Time format: use ISO strings internally, display as HH:MM (`de-DE` locale) in UI
- `startPause`/`endPause` return the ISO timestamp they just stamped —
  callers should display that returned value, not call `new Date()`
  again, or the displayed time can drift a few ms from what was persisted
- Menu and Pause-beenden are the SAME route (`/chronology/check`) and the
  same component — don't build a second route for Pause-beenden, branch
  on `DayState.pauseStartAt`/`pauseEndAt` inside `CheckView.vue` instead
- The 60s minimum-stamp-interval (`MIN_STAMP_INTERVAL_MS` in
  `api/timeClock.ts`) is temporarily set to 5s for manual testing
  convenience — **must be reverted to 60000 before this is final**
