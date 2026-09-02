# Skills Cheatsheet

## Core — always in use

| Skill | When to tell the agent |
|---|---|
| `using-agent-skills` | Meta-skill — auto-loads at every session start |
| `brainstorming` | Before a new feature — ask questions first, code after |
| `grill-with-docs` | Before a new feature — stress-test plan, update CONTEXT.md |
| `grill-me` | Stress-test an idea or plan — interrogation without doc writing |
| `interview-me` | Requirements are fuzzy — extract what the user actually needs |
| `incremental-implementation` | Implement step by step, small iterations |
| `planning-and-task-breakdown` | Break task into ordered steps before starting |
| `writing-plans` | Break task into 2-5 minute steps with exact file paths |
| `handoff` | Session is long — pack context for a fresh session |
| `diagnose` | Something is broken — run diagnostic cycle |
| `vue` | Apply Vue 3 / script setup / composables patterns |

---

## Architecture & Documentation

| Skill | When to tell the agent |
|---|---|
| `zoom-out` | Explain this code in context of the whole system |
| `improve-codebase-architecture` | Find architectural improvements |
| `spec-driven-development` | Write spec first, code after |
| `documentation-and-adrs` | Document architecture decisions — ADR, CONTEXT.md, specs |
| `source-driven-development` | Check official docs before implementing |
| `to-prd` | Turn our conversation into a PRD |
| `to-issues` | Break PRD into individual issues |
| `codebase-design` | Vocabulary for deep module design — interface, seam, depth, adapter |
| `domain-modeling` | Refine domain model: clarify terms, create ADR, update CONTEXT.md |
| `research` | Investigate from primary sources via background agent |
| `wayfinder` | Task exceeds one session — break into decision tickets |
| `resolving-merge-conflicts` | Merge/rebase conflict — resolve systematically |

---

## Code Quality

| Skill | When to tell the agent |
|---|---|
| `code-reviewer` | Check your work against checklist before "done" |
| `verification-before-completion` | Verify everything works before saying "done" |
| `tdd` | Write failing test first, then fix |
| `test-driven-development` | Addy Osmani variant of TDD |
| `code-review-and-quality` | Review this code across all quality axes |
| `debugging-and-error-recovery` | Debug systematically: reproduce → minimise → fix |
| `doubt-driven-development` | Adversarial review before critical changes |
| `browser-testing-with-devtools` | Debug/test in browser — console, network, DOM, screenshots |

---

## Stack & Tools

| Skill | When to tell the agent |
|---|---|
| `api-and-interface-design` | Design API by the rules |
| `git-workflow-and-versioning` | Apply git workflow patterns |
| `security` | Security check — auth, secrets, API, infra |
| `security-and-hardening` | Harden against vulnerabilities |
| `make-interfaces-feel-better` | Polish UI — typography, shadows, rounding, micro-animations |
| `interface-kit` | Build stunning, accessible, performant UI |
| `performance-optimization` | Find bottlenecks, optimize |
| `caveman` | Token saving mode — respond briefly |
| `frontend-ui-engineering` | UI task — apply frontend patterns |
| `frontend-behavior` | Audit existing UI for behaviour defects |
| `codebase-health-check` | Codebase health analysis |

---

## Rare but useful

| Skill | When to tell the agent |
|---|---|
| `dispatching-parallel-agents` | 2+ independent tasks — run them in parallel |
| `executing-plans` | Have a ready plan — execute with checkpoints |
| `archify` | Architecture diagrams — workflow, sequence, data-flow, lifecycle |
| `docker-expert` | Docker / docker-compose issues |
| `premortem` | Stress-test a plan/release/decision |

---

## Stack → Required Skills

| Technology | Skill folder | Notes |
|---|---|---|
| Vue 3 | `vue` | Installed |
| TypeScript | covered by `vue` | No standalone skill |
| Vite | — | Not installed — https://www.skills.sh/ |
| Pinia | — | Not installed — https://mcpmarket.com/tools/skills |
| Tailwind | `tailwind-design-system` | Installed (if used) |
| Docker | `docker-expert` | Installed (for future deploy) |
