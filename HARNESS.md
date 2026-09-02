# HARNESS.md — Stempelmaske

## Entry Point

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port **3001** |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint check |
| `npm run type-check` | TypeScript type check |

Port 3001 chosen because 3000 is occupied by another project (itocook).

## Risk Levels

| Area | Risk | Rationale |
|------|------|-----------|
| PIN authentication | Medium | Kiosk mode, no real auth — but wrong PIN routing breaks entire flow |
| State machine transitions | High | Core business logic — incorrect transitions = wrong stamps, broken demo |
| Checkout confirmation | Medium | New screen added during interview — must not bypass confirmation |
| Error conditions (E1-E5) | Medium | All 5 must trigger correctly per conditions |
| Mock data layer | Low | Will be replaced with real API later — clean interface is key |
| Toast notifications | Low | Display-only, no data mutation |

## Product Contract

<!-- TODO: Fill after prototype is approved -->

## Decisions to Inherit

<!-- TODO: Fill after prototype is approved -->
