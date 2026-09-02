# Toast System

## What It Does

Displays success/error notifications after user actions. Toasts appear as overlays, auto-dismiss after a timeout, then redirect to `/chronology`.

## Files

| File | Responsibility |
|------|---------------|
| `src/components/Toast.vue` | Toast UI component |
| `src/composables/useToast.ts` | Toast state management, auto-dismiss logic |
| `src/views/ToastView.vue` | Route-level wrapper for toast screens |

## Flow

```
Action completed (checkin/pause/checkout)
  → show Toast with message
  → wait 2-3 seconds
  → redirect to /chronology
```

## Toast Types

| Type | Trigger | Message |
|------|---------|---------|
| Success | Checkin | "Herzlich Willkommen [Vorname], du bist jetzt eingecheckt" |
| Warning | Pause start | "[Vorname] [Nachname], du bist jetzt in der Pause, [Uhrzeit]" |
| Success | Pause end | "Willkommen zurück [Vorname], deine Pause endet um [Uhrzeit]" |
| Success | Checkout | "Auf Wiedersehen [Vorname], du bist jetzt ausgecheckt" |
| Error | E1-E5 | See `error-states.md` |

## Decisions

- Toasts are overlays, not separate routes — keeps navigation simple
- Auto-dismiss after 2-3 seconds — user doesn't need to interact, kiosk flow continues
- Messages use dynamic variables (`[Vorname]`, `[Uhrzeit]`) — not hardcoded strings
- Error toasts (E1-E5) shown on login screen, not as overlays — keeps error context visible

## Gotchas

- Toast must not block the UI — use `position: fixed` with `z-index` above content
- Auto-dismiss timer must be cleared on unmount — prevents memory leaks
- Toast text is in German only (no i18n for prototype)
