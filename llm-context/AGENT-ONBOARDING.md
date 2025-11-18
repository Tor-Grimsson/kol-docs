# Agent Onboarding Playbook

Use this playbook before starting any implementation work. It compresses the required project memory into a lightweight loop so new agents can ramp up fast without trawling through months of logs.

## 1. Quickstart Checklist (5 Minutes)
1. **Read** `LLM_RULES.md` → confirms global guardrails (do *not* skip).
2. **Scan** `docs/RULES_STRUCTURE.md` → verifies naming, routing, and styling constraints.
3. **Review** `docs/AGENT-CONTEXT.md` section *“Current Focus”* → high-level project status.
4. **Open** the latest file in `docs/SESSION-LOGS/` (current cycle only) for tactical details.
5. **Check** `docs/status/architectural-decisions-log.md` for architectural constraints or open questions.
6. **Confirm** any task-specific briefs in `docs/components/components-hierarchy-migration-plan.md` or other living planning docs (search `docs/` for “Status: In Progress”).

> ⚡️ **Tip:** The `docs/archive/README.md` explains where older context lives if you need deep history. Start in the active docs above before digging into the archive.

## 2. Session Logging Protocol (Lean Version)
- Log every **major milestone** or **context hand-off** using `docs/SESSION-LOGS/TEMPLATE.md`.
- Keep only the **latest working day’s checkpoints** in `docs/SESSION-LOGS/`.
- Move earlier entries to `docs/archive/session-logs/<year>/` once a new cycle begins.
- Always add a “Next Steps” section so the next agent can resume without rereading the entire log.
- Track checkpoint cadence with `scripts/count-messages.sh` (run `reset` at session start, `increment` after each reply).

## 3. Memory Sources & Ownership
- **Canonical status:** `docs/AGENT-CONTEXT.md` – update after shipping a feature or closing a workstream.
- **Decisions:** `docs/status/architectural-decisions-log.md` – add (or supersede) entries whenever you make cross-cutting choices.
- **Working docs:** Keep active plans in `docs/` root; move completed or superseded docs into `docs/archive/`.
- **Research:** Store exploratory notes in `docs/archive/research/` once they feed into a decision or implementation.
- **Reference library:** `docs/system/` (design tokens, typography, CSS layers), `docs/components/` (feature/component guides), `docs/operations/` (workspace cheat sheet, `llm-context-system.md`), `docs/status/` (migration board + decisions).

## 4. Updating the Context Stack
| Trigger | Action |
|--------|--------|
| Finished a feature | Update `docs/AGENT-CONTEXT.md` → “Active Focus” + adjust milestone notes |
| Architectural decision | Append entry to `docs/status/architectural-decisions-log.md` |
| Large refactor plan drafted | Keep in root while active → archive when completed |
| Daily work session end | Create checkpoint log in `docs/SESSION-LOGS/` + roll older logs into archive |

## 5. Known Pain Points & Fixes
- **Rule Duplication:** `LLM_RULES.md` repeats instructions already captured elsewhere. When editing, keep `LLM_RULES.md` as the single source for behavioural rules and point to this playbook for workflow.
- **Long AGENT-CONTEXT:** Trim completed milestones quarterly and rely on links to archived logs for deep history. When updating, move finished phases into a `## Completed Milestones` section to keep “Current Focus” short.
- **Message Counting:** Use `scripts/count-messages.sh` instead of a mental tally—warnings trigger automatically at 10 and 15 responses.

## 6. Handoff Bundle
Before ending a session:
1. Confirm your checkpoint log is written and the latest.
2. Update `docs/AGENT-CONTEXT.md` (status + current focus).
3. Note unresolved questions at the end of your log and, if architectural, in `docs/status/architectural-decisions-log.md`.
4. Move any newly stale docs into `docs/archive/`.

Following this loop keeps the active context tight while preserving the full audit trail in the archive for future reference.
