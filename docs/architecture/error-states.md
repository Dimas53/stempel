# Error States

## What It Does

Defines the 5 error conditions (E1-E5) that can occur during PIN submission or stamp actions. Each error has a specific trigger condition and message.

## Files

| File | Responsibility |
|------|---------------|
| `src/api/timeClock.ts` | Error detection logic |
| `src/components/ErrorMessage.vue` | Error display component |
| `src/composables/useErrors.ts` | Error state management |

## Error Conditions

| Code | Trigger | Message | Display Location |
|------|---------|---------|------------------|
| E1 | Empty PIN submitted | "Bitte PIN eingeben." | Login screen, below PIN field |
| E2 | PIN not found in MockUser[] | "PIN nicht erkannt. Bitte erneut versuchen." | Login screen, below PIN field |
| E3 | Last stamp < 60 seconds ago | "Zu schnell. Bitte eine Minute warten und erneut versuchen." | Login screen or current screen |
| E4 | Checkout already done today | "Pro Tag nur ein Checkin möglich. Sie waren heute bereits eingecheckt." | Login screen |
| E5 | Network/session failure (simulated) | "Verbindung fehlgeschlagen. Bitte erneut versuchen." | Any screen |

## Flow

```
PIN submitted → validate:
  ├─ empty → E1
  ├─ no match → E2
  ├─ lastStampAt < 60s → E3
  ├─ checkoutAt exists → E4
  └─ network error → E5

Error shown → user corrects → retry
```

## Decisions

- E1-E4 shown as inline errors below PIN field — keeps context visible, user can retry immediately
- E3 can appear on any screen (check/pause/checkout) — minimum 1 minute rule is global
- E4 text is verbatim from original ticket — do not "fix" wording until Martin/Enrico confirm
- E5 is simulated (dev mode button) — no real network calls in prototype

## Gotchas

- E3 check must happen before state machine routing — applies to all actions
- E4 check must happen after E3 — order matters (fast repeat takes precedence)
- Error messages are in German only (no i18n for prototype)
- E5 simulation: add dev-mode button to trigger network error for testing
