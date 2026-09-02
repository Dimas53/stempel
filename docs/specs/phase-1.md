# Phase 1 Spec — Clickable Prototype

## Overview

Build a clickable prototype of the Stempelmaske time clock terminal with all 14 screens functional. Mock data only, no real API.

## Screens (14 total)

### Main Flow (8 screens)

1. **Login / PIN Input** (`/chronology`)
   - PIN field (masked, autocomplete off)
   - "Anmelden" button
   - Error messages below field (E1-E4)

2. **Toast: Willkommen** (overlay)
   - "Herzlich Willkommen [Vorname], du bist jetzt eingecheckt"
   - Auto-dismiss → redirect to /chronology

3. **Menu** (`/chronology/check`)
   - User name displayed
   - "Pause starten" button (yellow)
   - "Zum Checkout" button (green)
   - Buttons visually separated (touch safety)

4. **Toast: Pause** (overlay)
   - "[Vorname] [Nachname], du bist jetzt in der Pause, [Uhrzeit]"
   - Auto-dismiss → redirect to /chronology

5. **Pause Beenden** (`/chronology/check`)
   - User name displayed
   - "Pause beenden" button (yellow)

6. **Toast: Pause Beendet** (overlay)
   - "Willkommen zurück [Vorname], deine Pause endet um [Uhrzeit]"
   - Auto-dismiss → redirect to /chronology

7. **Checkout Overview** (`/chronology/checkout`)
   - Table: Checkin/Checkout/Pause/Summe (Plan vs Stempel)
   - "Notiz" field with info icon
   - "Checkout" button (green)

8. **Confirm Checkout** (dialog)
   - "Sie sind dabei, den Arbeitstag zu beenden. Möchten Sie wirklich auschecken?"
   - "Ja" / "Nein" buttons
   - "Ja" → proceed to checkout
   - "Nein" → return to checkout overview

9. **Toast: Auf Wiedersehen** (overlay)
   - "Auf Wiedersehen [Vorname], du bist jetzt ausgecheckt"
   - Auto-dismiss → redirect to /chronology

### Error States (5 screens)

- **E1**: Empty PIN → "Bitte PIN eingeben."
- **E2**: Invalid PIN → "PIN nicht erkannt. Bitte erneut versuchen."
- **E3**: Too fast (< 1 min) → "Zu schnell. Bitte eine Minute warten und erneut versuchen."
- **E4**: Already checked out → "Pro Tag nur ein Checkin möglich. Sie waren heute bereits eingecheckt."
- **E5**: Network error → "Verbindung fehlgeschlagen. Bitte erneut versuchen."

## State Machine Logic

```
PIN submitted → validate:
  ├─ empty → E1
  ├─ no match → E2
  ├─ lastStampAt < 60s → E3
  ├─ checkoutAt exists → E4
  └─ valid → check DayState:
       ├─ no checkin → checkin() → Toast → /chronology
       ├─ checkin, not paused → /chronology/check (menu)
       └─ in pause → /chronology/check (pause beenden)
```

## Mock Data

### MockUser

```typescript
interface MockUser {
  id: string;
  pin: string;
  firstName: string;
  lastName: string;
  plan: {
    checkin: string;  // "09:00"
    checkout: string; // "17:00"
    pause: string;    // "00:30"
  };
}
```

2-3 test users with different PINs.

### DayState

```typescript
interface DayState {
  userId: string;
  checkinAt: string | null;
  checkoutAt: string | null;
  pauseStartAt: string | null;
  pauseEndAt: string | null;
  pauseSeconds: number;
  lastStampAt: string | null;
}
```

In-memory, resets on page reload.

## API Layer

```typescript
// src/api/timeClock.ts
submitPin(pin: string): Promise<{ user: MockUser; action: 'checkin' | 'menu' | 'pause' }>
startPause(userId: string): Promise<void>
endPause(userId: string): Promise<void>
checkout(userId: string): Promise<void>
```

Mock implementation now, real fetch later.

## Technical Requirements

- Vue 3 + TypeScript (strict mode)
- Vite dev server on port 3001
- vue-router with 3 routes
- Pinia or composable for state
- PIN field: `type="password"`, `autocomplete="off"`
- Touch-friendly: buttons ≥ 44x44px, separated
- Minimum 1 minute between stamps (enforced in state machine)
- All toasts auto-dismiss after 2-3 seconds
- Redirect to /chronology after every action

## Out of Scope

- Real API integration
- Final visual design
- Multi-language support
- History for past days
- Multi-tenancy (companies/departments)

## Success Criteria

- All 14 screens clickable
- State machine transitions work correctly
- All 5 errors trigger under correct conditions
- Kiosk mode: returns to neutral state after each action
- No browser autofill on PIN field
