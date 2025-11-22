# LLM Context System

**Purpose:** Complete documentation system for LLM agent interactions, session management, and context continuity.

> This directory contains all LLM-specific documentation and tools that enable seamless agent collaboration, session handoffs, and institutional memory preservation. These files support the 7.1.0 Operations: LLM Context & Protocol document in `/docs/documentation/`.

## Core Documents

### LLM_RULES.md
**Purpose:** Behavior guardrails and communication protocols for all LLM agents
**Scope:** System-wide rules, checkpoint expectations, design system mandates
**Usage:** Required reading for every agent session

### AGENT-ONBOARDING.md
**Purpose:** Quickstart checklist for new agent sessions
**Scope:** 5-minute ramp-up procedure
**Usage:** Start of every session to ensure context continuity

### AGENT-CONTEXT.md
**Purpose:** Current project snapshot and active focus
**Scope:** Active workstreams, milestones, blockers, key links
**Usage:** Updated at session handoffs and workstream changes

## Session Management

### SESSION-LOGS/
**Purpose:** Daily work tracking and session transcripts
**Scope:** Current cycle only (previous days archived)
**Format:** `YYYY-MM-DD-HHMM.md`
**Archive:** Move to `/docs/archive/session-logs/` after 2 days

### count-messages.sh
**Purpose:** Checkpoint enforcement tool
**Usage:** `reset` (start), `increment` (after each reply), `show` (check status)
**Rule:** Checkpoint at 10 messages, hard stop at 15

## Cross-Reference

**System Documentation:**
- [7.1.0 LLM Agents & Protocols](../documentation/7.1.0-llm-agents-and-protocols.md) - Complete protocol guide

**Archive Directory:**
- `/docs/archive/session-logs/` - Historical session logs
- `/docs/archive/system-retired/` - Superseded context documents

---

**Status:** Active LLM Context System
**Last Updated:** 2025-11-04
**Maintained By:** All LLM agents via session handoff protocol