Chat language: ru

## Session 2026-09-02 — Initial Setup

**Done:**
- Initialized harness scaffold (git, hooks, templates)
- Interview completed with user (Q0-Q6 + brainstorming)
- Key decisions:
  - 14 screens (8 main + 1 confirm dialog + 5 errors)
  - Confirm checkout dialog added before final checkout
  - All toast/error texts as in wireframe
  - E4 text verbatim from ticket (open question)
  - Port 3001 (3000 occupied by itocook)
- Files created:
  - `AGENTS.md` — project rules
  - `HARNESS.md` — entry point, risk levels
  - `docs/CONTEXT.md` — domain glossary
  - `docs/ARCHITECTURE.md` — tech stack, flows, decisions
  - `docs/architecture/pin-auth-flow.md`
  - `docs/architecture/state-machine.md`
  - `docs/architecture/toast-system.md`
  - `docs/architecture/error-states.md`
  - `docs/roadmap.md` — 3 phases
  - `docs/specs/phase-1.md` — clickable prototype spec
  - `docs/skills-cheatsheet.md` — updated for Vue 3 stack

**Next:**
- Start M1 (Foundation) from roadmap
- Vue 3 + TypeScript + Vite setup
- Router with 3 routes
- Mock data layer
