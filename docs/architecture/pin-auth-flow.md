# PIN Auth Flow

## What It Does

Handles PIN input, validation, and routing on the `/chronology` screen. This is the entry point for all user interactions — every flow starts here.

## Files

| File | Responsibility |
|------|---------------|
| `src/views/LoginView.vue` | PIN input screen, submit handler, inline error text, checkin/pause-end toasts via `useStatusCard` |
| `src/api/timeClock.ts` | `submitPin()` — validates PIN and DayState against mocks, throws `PinError` (E1–E5); `startPause`/`endPause`/`checkout` take an explicit `stampedAt` |
| `src/mocks/dayState.ts` | In-memory `DayState` store keyed by userId, single access point (`getDayState`/`setDayState`) — see `notes/NOTES-real-api.md` for the real-backend swap plan |
| `src/composables/useSession.ts` | Holds the current logged-in `MockUser` plus `pinEnteredAt` (the PIN-entry moment — see Decisions) across route changes |

No separate `PinInput.vue` component — the input is only used on one screen,
so it's inline in `LoginView.vue` for now. Extract it only if a second
place ends up needing a PIN field.

## Flow

```
User enters PIN → clicks "Absenden"
  ├─ PIN empty → show E1 error
  ├─ PIN not found in MockUser[] → show E2 error
  ├─ same calendar minute as last stamp → show E3 error (see Decisions)
  ├─ checkout done today → show E4 error
  └─ PIN valid → route based on DayState:
       ├─ no checkin yet → checkin, stamped now → toast, stay on /chronology
       ├─ in an active pause → pause ends immediately, stamped now → toast, stay on /chronology
       └─ otherwise → store this moment as pinEnteredAt → navigate to /chronology/check (menu)
```

## Decisions

- PIN field uses `type="tel"` + `inputmode="numeric"`, not `type="password"` — this is a shared kiosk PIN, not a secret to mask
- Validation happens in `submitPin()` (API layer), not in the component — keeps view logic clean and swappable for real API
- **Stamp time = PIN-entry moment, not button-click moment.** Per client feedback, a pause/checkout stamp must reflect when the PIN was entered, even if the user then sits on the menu screen for minutes before tapping Pause or Checkout. `submitPin()`'s `'menu'` result carries `stampedAt`; `LoginView.vue` stores it as `pinEnteredAt` (`useSession.ts`); `CheckView.vue`'s buttons pass it into `startPause`/`checkout` instead of letting those functions read `Date.now()` themselves. Checkout's own button on the summary screen writes no timestamp at all — it's a formality that only saves Notiz, since checkoutAt is already set by then.
- Rate limit (E3) is "once per calendar minute", not a fixed cooldown — see `sameMinute`/`msUntilNextStamp` in `api/timeClock.ts`. Stamped at 09:22:45 → next allowed at 09:23:00, not 09:23:45.
- After every successful action, stay on/return to `/chronology` — kiosk mode requires a neutral state between users

## Gotchas

- PIN comparison must be exact (string match, no trimming of leading zeros)
- Error messages appear below the PIN field (not as toasts) AND as a summary on the strip card up top (`useStatusCard.ts`) — two registers, same underlying `PinErrorCode`
- E3/E4 auto-clear on a timer (2.5s for the field text, same for E4's card; E3's card instead counts down the real remaining cooldown via `retryAfterMs`) since retyping the same PIN can't fix either — E1/E2/E5 only clear once the user edits the field
- `getCurrentDayState()` is `async` (real backend later) — `CheckView.vue`/`CheckoutView.vue` read it via `onMounted` + an `isLoading` state, not synchronously during setup
