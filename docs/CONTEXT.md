# CONTEXT.md — Stempelmaske Domain Glossary

Ubiquitous language for the time clock terminal prototype.

## Core Concepts

| Term | Definition | Related |
|------|-----------|---------|
| Stempelmaske | Time clock terminal in kiosk mode — shared tablet where employees register work time via PIN | PIN, Stamp |
| PIN | Personal identification code used to authenticate employees on the shared terminal (no personal login) | MockUser, Stempelmaske |
| Stamp (Stempel) | Timestamp recorded when an action occurs (checkin, pause start, pause end, checkout) | Checkin, Pause, Checkout |
| Checkin | Action that starts the work day — first stamp of the day | Stamp, DayState |
| Pause | Break during the work day — can be started after checkin, must be ended before checkout | Stamp, DayState |
| Checkout | Action that ends the work day — final stamp, irreversible for the day | Stamp, DayState |
| DayState | Current state of a user for today — tracks checkin/pause/checkout times and accumulated pause seconds | MockUser, Stamp |
| MockUser | Test user with PIN, name, and planned schedule — used for prototype demonstration | PIN, Plan |
| Plan | Scheduled times for checkin, checkout, and pause duration — shown in checkout overview | MockUser, Stempel |
| Toast | Notification shown after each action — displays welcome/pause/checkout messages, then redirects to login | Stempelmaske |
| Kiosk mode | Operating mode where the terminal is shared — no personal login, returns to neutral state after each action | Stempelmaske, PIN |

## Error Conditions

| Term | Definition | Related |
|------|-----------|---------|
| E1 | Empty PIN submitted | PIN |
| E2 | PIN not recognized (no matching MockUser) | PIN, MockUser |
| E3 | Stamp attempted less than 1 minute after previous stamp | Stamp |
| E4 | PIN submitted after checkout already completed today | Checkout, DayState |
| E5 | Network/session failure (simulated) | Stempelmaske |

## Open Questions

- E4 text says "Checkin" but rule is about "one checkout per day" — awaiting confirmation from Martin/Enrico
- Toast texts for "Pause beendet" and "Auf Wiedersehen" — placeholders, need team approval
- Scenario relevance (Checkin → Pause → Checkout) — ticket is ~2 years old, verify with team after demo
