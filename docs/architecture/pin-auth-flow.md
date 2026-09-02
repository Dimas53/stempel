# PIN Auth Flow

## What It Does

Handles PIN input, validation, and routing on the `/chronology` screen. This is the entry point for all user interactions — every flow starts here.

## Files

| File | Responsibility |
|------|---------------|
| `src/views/LoginView.vue` | PIN input screen, submit handler |
| `src/components/PinInput.vue` | Masked input field with autocomplete off |
| `src/api/timeClock.ts` | `submitPin()` — validates PIN against mock users |

## Flow

```
User enters PIN → clicks "Anmelden"
  ├─ PIN empty → show E1 error on same screen
  ├─ PIN not found in MockUser[] → show E2 error on same screen
  ├─ last stamp < 60s → show E3 error
  ├─ checkout done today → show E4 error
  └─ PIN valid → route based on DayState:
       ├─ no checkin yet → perform checkin → show Toast → redirect to /chronology
       ├─ checkin exists, not paused → navigate to /chronology/check (menu)
       └─ in pause → navigate to /chronology/check (pause beenden)
```

## Decisions

- PIN field uses `type="password"` and `autocomplete="off"` — prevents browser autofill in kiosk mode
- Validation happens in `submitPin()` (API layer), not in the component — keeps view logic clean and swappable for real API
- After every successful action, redirect to `/chronology` — kiosk mode requires neutral state between users

## Gotchas

- Do not use `v-model` with `type="password"` and `autocomplete="off"` without testing — some browsers still try to autofill
- PIN comparison must be exact (string match, no trimming of leading zeros)
- Error messages appear below the PIN field, not as toasts — keeps the login screen stable
