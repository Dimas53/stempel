# State Machine

## What It Does

Manages the Checkin → Pause → Checkout flow. Determines which screen to show based on the user's current DayState after PIN submission.

## Files

| File | Responsibility |
|------|---------------|
| `src/composables/useTimeClock.ts` | State machine logic, transitions |
| `src/mocks/dayState.ts` | In-memory DayState per user |
| `src/api/timeClock.ts` | `startPause()`, `endPause()`, `checkout()` |

## Flow

```
PIN valid → check DayState:
  ├─ no checkin → checkin() → Toast "Willkommen" → /chronology
  ├─ checkin exists, not paused → /chronology/check (menu)
  │    ├─ "Pause starten" → startPause() → Toast "Pause" → /chronology
  │    └─ "Zum Checkout" → /chronology/checkout
  │         └─ "Checkout" → confirm dialog → checkout() → Toast "Auf Wiedersehen" → /chronology
  └─ in pause → /chronology/check (pause beenden)
       └─ "Pause beenden" → endPause() → Toast "Pause beendet" → /chronology
```

## Decisions

- State is in-memory (DayState object) — resets on page reload, acceptable for prototype
- Minimum 1 minute between stamps enforced in state machine, not UI — prevents race conditions
- Checkout requires confirmation dialog — irreversible action, prevents accidental taps
- After every action, redirect to /chronology — kiosk mode, next user must not see previous user's data

## Gotchas

- `lastStampAt` must be updated after every action (checkin, pause start, pause end, checkout)
- `pauseSeconds` accumulates across multiple pauses in one day
- Checkout sets `checkoutAt` and marks day as complete — any subsequent PIN today triggers E4
- Time format: use ISO strings internally, display as HH:MM in UI
