# Stempelmaske — Project Rules

> Global rules live in `~/.config/opencode/AGENTS.md` and apply to all projects.
> This file contains Stempelmaske-specific rules only. In case of conflict — this file wins.

---

## Stack Skills (load on every session start)

After loading `using-agent-skills`, immediately load these stack skills:

# Installed (load on every session start):
~/.config/opencode/skills/vue/SKILL.md
~/.config/opencode/skills/frontend-ui-engineering/SKILL.md
~/.config/opencode/skills/interface-kit/SKILL.md

# Missing — install before next session:
# ❌ pinia → https://mcpmarket.com/tools/skills
# ❌ vite → https://www.skills.sh/

---

## Framework Structure (MANDATORY)

- **Vue 3** (plain, no Nuxt)
- **TypeScript** required
- **Vite** for build
- **Pinia** or composable for state management
- Routing: `vue-router` with routes `/chronology`, `/chronology/check`, `/chronology/checkout`

---

## Project File Map

| What | Path |
|------|------|
| Source root | `src/` |
| Components | `src/components/` |
| Pages / Views | `src/views/` |
| Mock data | `src/mocks/` |
| API layer | `src/api/` |
| Store | `src/stores/` or `src/composables/` |
| Global styles | `src/styles/` |
| Design reference | `docs/design.md` |
| Progress log | `PROGRESS.md` |
| Roadmap | `docs/roadmap.md` |
| Architecture overview | `docs/ARCHITECTURE.md` |
| Domain glossary | `docs/CONTEXT.md` |
| Skills reference | `docs/skills-cheatsheet.md` |
| Global skills | `~/.config/opencode/skills/` |

---

## Task Context (loaded during the Session Start step that loads skills and task context)

When starting a task, load the relevant doc based on what you are working on:

| Task area | Read before starting |
|-----------|---------------------|
| Any UI / frontend work | `docs/design.md` |
| PIN input / Login flow | `docs/architecture/pin-auth-flow.md` |
| State machine (checkin/pause/checkout) | `docs/architecture/state-machine.md` |
| Toast notifications | `docs/architecture/toast-system.md` |
| Error handling | `docs/architecture/error-states.md` |
| Overall architecture or new feature | `docs/ARCHITECTURE.md` |

---

## Definition of Done — Stempelmaske Specific

**Runs IN ADDITION to global Definition of Done (global AGENTS.md).**

### Architecture file mapping — for each item in SESSION SCAN, find its doc:

```
docs/architecture/pin-auth-flow.md — PIN input, validation, routing
docs/architecture/state-machine.md — checkin/pause/checkout transitions
docs/architecture/toast-system.md — toast notifications after actions
docs/architecture/error-states.md — E1-E5 error conditions and display

New feature with NO matching file above  →  CREATE docs/architecture/feature-name.md
```

### CONTEXT.md — update if SESSION SCAN includes any of:
```
[ ] New module, service, or composable name introduced
[ ] New technical pattern discovered (e.g. new gotcha, workaround)
[ ] New external service or MCP connected
[ ] New domain concept that future agent would need to know
```

### Hard rules — no exceptions:
```
RULE 1: "I only deployed, I didn't create it" — NOT accepted.
        Deploy = same doc update as create. SESSION SCAN catches it.

RULE 2: "I'll update docs next session" — NOT accepted.
        Docs update happens NOW, in this session, before saying done.

RULE 3: "It's a small change" — only CSS tweaks and typo fixes are exempt.
        Any logic, flow, collection, or route change requires doc update.
```

### Scope and reporting (T-J8)

The requested scope IS the deliverable — do not narrow it silently.
Blocked on part of it? Finish everything else in full, then say exactly
  what is missing and why. Cutting scope is the user's decision.
Tests failed — say so, with the output. Step skipped — say which.
  Done and verified — say it plainly, no hedging.

---

## Git Workflow

### When to commit
- After completing a full Milestone or major feature (new page, new component, new flow)
- Never commit broken or half-done code
- Small fixes (warnings, typos, minor CSS) — make changes, wait for explicit commit instruction

### Commit message format
```
<type>(<scope>): <what was done>
```
Types: `feat`, `fix`, `docs`, `chore`, `refactor`

### After every commit — immediately update PROGRESS.md
```
## Git log
- `<hash>` — commit message
```

### "Commit and push" sequence
When user says "commit and push" (or equivalent) — do NOT execute both at once.
Follow this exact order:
1. Create the commit
2. Run the full Definition of Done (see global AGENTS.md)
3. Only after DoD is verified — run `git push`

---

## MCP Servers Available

| MCP | Use for |
|-----|---------|
| `filesystem` | Read/write any project file |
| `git` | Git operations |
| `context7` | Live framework docs — always prefer over training data |
| `fetch` | External HTTP requests |
| `sequential-thinking` | Complex multi-step reasoning |
| `playwright` | E2E tests, explore mode, screenshots |
| `chrome-devtools` | Console errors, network requests, Lighthouse |

---

## Framework-Specific Gotchas

- Vue 3 Composition API — use `<script setup>` syntax
- TypeScript strict mode always
- Reactive destructuring: use `toRefs()` or `storeToRefs()` when destructuring from store
- Autocomplete off for PIN field: `autocomplete="off"` + `type="password"`
- Touch-friendly UI: buttons minimum 44x44px, spaced to prevent accidental taps

---

## UI Rules

- No UI code without reading `docs/design.md` first
- Use only color tokens from `docs/design.md` (when created)
- TypeScript required in all source files
- Kiosk mode: PIN field without autofill, masked input
- After every completed action — automatic redirect to `/chronology`
- Minimum 1 minute between stamps — enforced in state machine

---

## Operational Notes

- Dev server: `npm run dev` (port 3001, as 3000 is occupied by another project)
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
- Type check: `npm run type-check`

---

## Docs Update Matrix

| File | Updated by | Trigger |
|------|-----------|---------|
| `PROGRESS.md` | Agent — automatic | Every commit + push |
| `docs/roadmap.md` | Agent — automatic | Phase completed |
| `docs/architecture/*.md` | Agent — automatic | Architecture changed |
| `docs/CONTEXT.md` | Agent — on request | Documentation Session |
| `docs/specs/*.md` | Agent — on request | Before new feature |
| `docs/design.md` | Developer manually | Design decision changed |
| `docs/audits/*.md` | Agent — on request | Audit session |
| `docs/skills-cheatsheet.md` | Agent — automatic | New skill installed |
