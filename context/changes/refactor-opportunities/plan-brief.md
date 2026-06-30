# Refactor Opportunities — Plan Brief

> Full plan: `context/changes/refactor-opportunities/plan.md`
> Research: `context/changes/refactor-opportunities/research.md`

## What & Why

The edit-transaction module carries structural debt: dual read/write transport, duplicated UI/API validation, and non-atomic PATCH writes. This plan implements the top three ranked refactor candidates (C1–C3) from research — in order — with prerequisites that close the group read auth gap and establish a test baseline before touching production paths.

## Starting Point

`EditTransaction` is the only modal importing four `get*ById` server actions for load while saving via `axios.patch`. API PATCH routes use inline validation that diverges from `TransactionSchema` in the UI. All four PATCH handlers run update → deleteMany → create as separate awaits with no `prisma.$transaction`. CI runs lint/format/build only — no automated tests gate merges.

## Desired End State

Edit load goes through a single `useTransactionById` React Query hook (matching add-modal fetch conventions). PATCH routes share `validateTransactionPayload` derived from `TransactionSchema`. Money conversion on the edit path uses `toPln`/`toGrosze` at read/write boundaries. PATCH writes are atomic via `prisma.$transaction`. Group `get*ById` actions enforce owner checks. Unit tests cover reducer, validations, dialog utils, and money helpers; route tests prove partial-write vulnerability and its fix.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| -------- | ------ | ---------------- | ------ |
| Candidates in scope | C1 + C2 + C3 | Full structural cleanup on the edit critical path | Plan |
| Deferred | C5, C6, behavioral fixes, CI test gate | Research ranked these as polish or separate concerns | Research |
| Phase order | C1 → C2 → C3 | Testability first, then validation, then DB atomicity | Research / Plan |
| C2 API surface | 4 PATCH routes only | Matches edit blast radius; POST create stays inline for now | Plan |
| Test investment | Phase 0 unit baseline; route tests in Phases 2–3 | Matches edit-transaction-analysis recommendations | Plan |
| Auth read group (#3) | Phase 0 before C1 | Security hole must close before read-path refactor | Research / Plan |
| C4 money utils | Partial — edit path only (4× get*ById + 4 PATCH) | Reduces drift on touched files without 19-file repo sweep | Plan |

## Scope

**In scope:**
- Phase 0: E2E baseline, unit tests (reducer, formValidations, dialogUtils, moneyUtils), group read auth fix, `utils/moneyUtils.ts`
- Phase 1: `useTransactionById` hook + edit modal migration + `toPln` in get*ById
- Phase 2: `validateTransactionPayload` + rollout to 4 PATCH routes + `toGrosze` in PATCH
- Phase 3: `prisma.$transaction` in 4 PATCH routes + failure-injection route test

**Out of scope:**
- C5 (refetch hook consolidation), C6 (explicit transactionType on table rows)
- Behavioral fixes (#5 AbortController, #6 null load, #10 form reset)
- POST create route validation unification (follow-on after C2)
- Repo-wide money conversion (charts, stats, list actions)
- Adding `npm test` to GitHub Actions
- REST GET endpoint / deprecating server actions (C1 Phase B)

## Architecture / Approach

```
Phase 0: tests + auth + moneyUtils
    ↓
Phase 1: EditTransaction → useTransactionById → existing get*ById (toPln)
    ↓
Phase 2: PATCH routes → validateTransactionPayload(TransactionSchema) → toGrosze
    ↓
Phase 3: PATCH body → prisma.$transaction([update, deleteMany, creates])
```

Write path stays REST throughout. Read path moves behind React Query without changing server action signatures in Phase 1.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 0. Prerequisites | Test harness, auth fix, money utils | New tests may expose unrelated failures |
| 1. C1 Dual data path | `useTransactionById` replaces inline fetch | Hook/query-key mismatch breaks load or refetch |
| 2. C2 Shared validation | Single validator on 4 PATCH routes | Date coercion or error message drift vs current API |
| 3. C3 DB atomicity | Transaction-wrapped PATCH writes | `$transaction` API misuse or missed route copy |

**Prerequisites:** Research verified at commit `1c088f2`; dev DB available for E2E; no archived change folder.

**Estimated effort:** ~4 sessions across 4 phases (Phase 0 is the largest upfront investment).

## Open Risks & Assumptions

- `TransactionSchema` uses `z.date()` — API adoption requires `z.coerce.date()` or equivalent; must be verified against axios JSON payloads before C2 rollout.
- E2E covers edit expense happy path only — income/group edit paths lack automated coverage; manual verification required after Phase 1.
- Existing vitest suite has no edit-transaction coverage; Phase 0 tests are net-new, not extensions.
- Group auth fix changes read behavior (returns null for non-owners) — acceptable; matches PATCH 403 semantics.

## Success Criteria (Summary)

- Edit modal loads and saves via the same user-visible flows; E2E personal-budget and group-budget specs pass.
- PATCH validation errors remain equivalent for the cases currently covered (characteristic route tests).
- Simulated mid-write Prisma failure rolls back entirely after Phase 3.
- No non-owner can load a group transaction by ID through `getGroup*ById`.
