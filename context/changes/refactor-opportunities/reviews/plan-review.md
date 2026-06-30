<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Refactor Opportunities Implementation Plan

- **Plan**: `context/changes/refactor-opportunities/plan.md`
- **Mode**: Deep
- **Date**: 2026-06-27
- **Verdict**: SOUND (after triage fixes)
- **Findings**: 0 critical, 5 warnings, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | WARNING ⚠️ |
| Lean Execution | PASS ✅ |
| Architectural Fitness | WARNING ⚠️ |
| Blind Spots | WARNING ⚠️ |
| Plan Completeness | WARNING ⚠️ |

## Grounding

Grounding: 9/9 paths ✓ (existing files verified; new test/hook paths marked as new), 4/4 symbols ✓ (`TransactionSchema`, `handleApiEditTransactionRoute`, get*ById quartet, PATCH routes), brief↔plan ⚠️ (Phase 0 "unit + route" in brief vs route tests deferred to Phases 2–3).

## Findings

### F1 — C2 unification tightens API for sub-cent values

- **Severity**: ⚠️ WARNING
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: End-State Alignment
- **Location**: Phase 2 — Shared validator
- **Detail**: UI `TransactionSchema` uses `value: z.number().min(0.01)` (`formValidations.ts:50`). All PATCH routes reject only `t.value <= 0`. Values like `0.005` are accepted by API today but rejected by UI. Adopting schema in API without an explicit decision changes production behavior.
- **Fix A ⭐ Recommended**: Document intentional alignment — API adopts `min(0.01)` and Phase 2 characteristic route test asserts rejection of `0.005`.
  - Strength: Eliminates drift; matches UI and money-path intent.
  - Tradeoff: Breaking change for any client sending sub-cent values (likely none in this app).
  - Confidence: HIGH — UI already enforces 0.01; axios payloads come from the same form.
  - Blind spot: Direct API callers outside the UI not surveyed.
- **Fix B**: Preserve API `<= 0` via a separate `TransactionApiSchema` with `min(0.001)` or `positive()` — UI keeps `min(0.01)`.
  - Strength: Zero API behavior change.
  - Tradeoff: Perpetuates UI/API drift the refactor is meant to fix.
  - Confidence: MED — works but undermines C2 goal.
  - Blind spot: Choosing the API floor still arbitrary.
- **Decision**: FIXED via Fix A — API adopts min(0.01); route test for 0.005 rejection added to Phase 2 contract

### F2 — Shared validator needs income/expense message variants

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Architectural Fitness
- **Location**: Phase 2 — validateTransactionPayload
- **Detail**: Personal income PATCH uses `'Nie dodano przychodu'` / `'… każdego przychodu'`; expense uses `'… wydatku'`. Group income PATCH incorrectly copies expense strings (`group/.../income/[transactionId]/route.ts:26,33`). A type-agnostic validator will homogenize or lose route-specific copy unless `transactionType` is passed in.
- **Fix A ⭐ Recommended**: Add `transactionType: 'income' | 'expense'` parameter to `validateTransactionPayload` with a message map per branch; fix group income PATCH to use income strings during C2 rollout.
  - Strength: Preserves personal-route UX; fixes existing group income copy-paste bug.
  - Tradeoff: Validator API slightly wider than plan describes.
  - Confidence: HIGH — messages are stable string literals in routes today.
  - Blind spot: Clients depending on wrong group income strings (unlikely).
- **Fix B**: Keep one generic message set (expense wording) everywhere for simplicity.
  - Strength: Minimal validator surface.
  - Tradeoff: Regresses personal income error copy; leaves group bug unfixed.
  - Confidence: HIGH — clearly worse UX.
  - Blind spot: None significant.
- **Decision**: FIXED via Fix A — transactionType param + income/expense message map; fix group income strings in Phase 2

### F3 — isLoading split between context and hook not specified

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Blind Spots
- **Location**: Phase 1 — Edit modal migration
- **Detail**: Edit uses shared context `isLoading` for fetch (`:109-113`), save (`:178-215`), overlay (`:222`), and LoadingButton (`:255`). `file-input.tsx` and add modals also read context `isLoading`. Plan says remove fetch dispatch "if hook isLoading covers it" but doesn't define merged loading (`queryIsLoading || contextIsLoading`) or update save guard behavior.
- **Fix**: Specify Phase 1 contract: overlay/button use `isFetching || context.isLoading`; save guard stays `if (context.isLoading || !transaction) return`; only remove fetch-specific `SET_IS_LOADING` dispatches.
  - Strength: Preserves UX and cross-modal loading semantics with minimal change.
  - Tradeoff: Two loading signals to combine in JSX.
  - Confidence: HIGH — matches current behavior split (fetch→hook, save→context).
  - Blind spot: Whether `transaction` local state should migrate to hook `data` entirely.
- **Decision**: FIXED — merged loading contract added to Phase 1

### F4 — Hook `enabled` guard under-specified

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 1 — useTransactionById
- **Detail**: Plan sets `enabled = isEditTransactionModalOpen && !!transactionId`. Context resets `transactionType` and `transactionCategory` to `null` on hide (`transaction-modal-reducer.ts:74-75`). Current fetch guard also requires `transactionType` (`edit-transaction.tsx:107`).
- **Fix**: Set `enabled = isEditTransactionModalOpen && !!transactionId && !!transactionType && !!transactionCategory`.
- **Decision**: FIXED — covered by Phase 1 enabled guard update (with F3)

### F5 — Route handler tests are greenfield (no precedent)

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Plan Completeness
- **Location**: Phases 2–3 — tests/api/transaction/
- **Detail**: No existing `tests/api/` directory or route-handler tests. Vitest uses `jsdom` globally (`vitest.config.ts:8`). Plan proposes `patch-validation.test.ts` and `patch-atomicity.test.ts` with mocked prisma/auth but no harness spec.
- **Fix A ⭐ Recommended**: Add Phase 2 setup note: create `tests/api/` with `@vitest-environment node` per file; import `PATCH` directly from route modules; mock `@/lib/prisma` and `@/actions/getCurrentUser` following existing `vi.mock` patterns in `tests/pages/`.
  - Strength: Makes first route test actionable; avoids jsdom mismatch.
  - Tradeoff: Small one-time harness work not in Phase 0.
  - Confidence: HIGH — standard Vitest pattern for Next route handlers.
  - Blind spot: Next.js 15 async params shape if app upgrades.
- **Fix B**: Defer route tests to E2E-only verification.
  - Strength: No new test infrastructure.
  - Tradeoff: Atomicity and validation branches harder to test; contradicts plan success criteria.
  - Confidence: MED — E2E won't cover failure injection.
  - Blind spot: None significant.
- **Decision**: FIXED via Fix A — route test harness added to Phases 2–3 contracts

### F6 — Brief says Phase 0 "unit + route"; plan defers route tests

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Lean Execution
- **Location**: plan-brief.md Key Decisions vs Phase 0
- **Detail**: Brief table lists "Phase 0 baseline (unit + route)" but route tests appear only in Phases 2–3. Phasing is reasonable; brief wording is imprecise.
- **Fix**: Update plan-brief test investment row to "Phase 0 unit baseline; route tests in Phases 2–3".
- **Decision**: FIXED — plan-brief updated
