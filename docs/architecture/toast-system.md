# Toast System

## What It Does

Displays success notifications after user actions. Not a floating overlay
— reuses the status card already living in the white strip
(`KioskShell.vue`) that otherwise shows an idle prompt. On checkin, the
card flips in place (no navigation needed, already on `/chronology`); on
Pause and Checkout actions, the card shows the message on the current
view first, then it navigates to `/chronology` after the delay.

## Files

| File | Responsibility |
|------|---------------|
| `src/components/KioskShell.vue` | Renders the status card (`status-eyebrow`/`status-message`/`status-active` props), including the enter/exit text transition |
| `src/views/LoginView.vue` | Owns the checkin message state, flips `strip-card--active`, reverts to the idle prompt after the timeout — the one case that doesn't use `useToastRedirect` below, since it reverts in place instead of navigating away |
| `src/composables/useToastRedirect.ts` | `showToastThenRedirect(card, to?)` — sets the status card, then `router.push` after `REDIRECT_DELAY_MS` (2500ms). Extracted once a third view (Checkout) needed the same "show status card, then leave" pattern this file previously said to wait for |
| `src/views/CheckView.vue` | Pause starten/beenden call `showToastThenRedirect` |
| `src/views/CheckoutView.vue` | "Checkout" button click calls `showToastThenRedirect` directly |

## Flow

```
Action completed:
  checkin   → status card flips to the message in place (still /chronology)
              → after 3.5s, reverts to the idle prompt (no navigation)
  pause     → status card shows the message on /chronology/check
              → after 2.5s, router.push('/chronology') (idle prompt shown fresh)
  checkout  → status card shows the message on /chronology/checkout
              → after 2.5s, router.push('/chronology')
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

- Not an overlay/route — reuses the always-present status card, which
  otherwise idles on a prompt ("Bitte gib deinen PIN ein...", "Pause
  starten oder auschecken?" etc.) — avoids building a separate toast
  component for something that only ever occupies the same slot
- Checkin's in-place revert waits 3.5s (bumped up from an initial 2-2.5s —
  user felt the shorter duration didn't feel confident the action
  registered); the redirect-then-navigate cases (pause, checkout) use a
  separate 2.5s (`REDIRECT_DELAY_MS` in `useToastRedirect.ts`) — not
  unified into one constant since one reverts in place and the other
  navigates away, different enough moments that they were never tuned to
  match
- Messages use dynamic variables (`[Vorname]`, `[Uhrzeit]`) — not hardcoded strings
- Considered making the Login screen's idle prompt show a persistent
  "Hallo [Vorname], du bist im System" while checked in — **explicitly
  rejected**: the login screen is a shared, neutral kiosk surface any
  employee can approach next; showing the previous person's name/status
  there is both a privacy leak and meaningless to whoever taps next
- Error toasts (E1-E5) shown inline below the PIN field, not in the
  status card — keeps the error next to the field that caused it
- Checkout briefly had a "Sie sind dabei, den Arbeitstag zu beenden..."
  confirm dialog (Ja/Nein) between the "Checkout" button and this toast —
  removed after building it: the toast itself is already the "did this
  register?" feedback, and the ticket's own `phase-1.md` spec listing it
  as a separate screen turned out not to reflect what the user actually
  wanted once they saw it live. "Checkout" now calls `checkout()` and
  shows this toast directly, same as Pause starten/beenden never had a
  confirm step either.

## Gotchas

- Auto-dismiss timer (`setTimeout`) isn't explicitly cleared on unmount —
  fine today since nothing unmounts these views mid-timer in the current
  flow, but worth adding a cleanup if that changes
- Toast text is in German only (no i18n for prototype)
- Pause beenden's message text is a placeholder, not from the ticket —
  see the open questions in `docs/CONTEXT.md`
