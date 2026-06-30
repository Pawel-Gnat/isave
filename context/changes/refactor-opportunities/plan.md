# Refactor Opportunities Implementation Plan

## Overview

Implement the three highest-ranked structural refactors from `research.md` — dual data path (C1), shared UI/API validation (C2), and atomic PATCH writes (C3) — on the edit-transaction critical path. Work proceeds in four phases with a test-and-security baseline first, partial money-util adoption on touched files, and manual verification gates between phases.

## Current State Analysis

`EditTransaction` (`components/transaction-modal/edit-transaction.tsx`) is the sole consumer of four `get*ById` server actions and the sole modal using `axios.patch` for save. List refresh mounts all four list hooks unconditionally (C5 — deferred). PATCH routes under `app/api/transaction/**/[transactionId]/route.ts` duplicate validation logic that diverges from `TransactionSchema` in `utils/formValidations.ts` (e.g. UI `min(0.01)` vs API `<= 0`). Replace-all line items run as three separate awaits without `prisma.$transaction`. Group read actions (`getGroupExpenseById`, `getGroupIncomeById`) fetch by ID only — no owner filter — while PATCH routes check `userId`.

## Desired End State

- Edit load: `useTransactionById(category, type, id)` with React Query; no direct `get*ById` imports in the modal.
- Edit read/write money: `toPln` / `toGrosze` from `utils/moneyUtils.ts` at get*ById and PATCH boundaries.
- PATCH validation: shared `validateTransactionPayload` using `TransactionSchema.safeParse` plus async category lookup.
- PATCH persistence: update + deleteMany + creates wrapped in `prisma.$transaction` on all four routes.
- Security: group get*ById returns null when `userId !== currentUser.id`.
- Tests: unit coverage for reducer, formValidations, dialogUtils, moneyUtils; route test proving partial-write fix.

### Key Discoveries

- `get*ById` has exactly one consumer — `edit-transaction.tsx:17-20,88-98` — narrow blast radius for C1 Phase A.
- Hook pattern to follow: `hooks/usePersonalExpenses.ts` — React Query with explicit `queryKey` and server action `queryFn`.
- PATCH owner check pattern for group: `app/api/transaction/group/[groupBudgetId]/expense/[transactionId]/route.ts:64-69`.
- Personal get*ById already filters by `userId` — `actions/getPersonalExpenseById.ts:15-18`.
- CI workflows omit `npm test` — automated verification is local until a separate change adds CI tests.

## What We're NOT Doing

- C5: replacing four refetch hooks with `invalidateQueries`
- C6: explicit `transactionType` on merged table rows
- Behavioral fixes: AbortController signal wiring (#5), null-load error UI (#6), form reset on close (#10)
- C2 extension to POST create routes (4 files)
- Repo-wide `/100` and `*100` replacement (charts, stats, list actions — 19 files)
- C1 Phase B: REST GET endpoints and server action deprecation
- Adding `npm test` to GitHub Actions

## Implementation Approach

Incremental, phase-gated refactors with unchanged user-visible behavior. Each phase completes automated checks, pauses for manual confirmation, then proceeds. Phase 0 establishes safety nets and shared utilities; Phases 1–3 each deliver one ranked candidate. Money utils ship in Phase 0 and apply to consumers as those files are touched in Phases 1–2.

## Phase 0: Prerequisites — Tests, Auth, Money Utils

### Overview

Establish automated baselines, close the group read auth gap, and introduce money conversion helpers before any structural edit-modal changes.

### Changes Required

#### 1. E2E baseline documentation

**File**: `context/changes/refactor-opportunities/` (verification note in commit message or phase log — no new doc file required)

**Intent**: Record results of running existing E2E specs so later phases have a known-good baseline.

**Contract**: Run `npm run test:e2e -- e2e/personal-budget.spec.ts e2e/group-budget.spec.ts` and note pass/fail in the phase completion log.

#### 2. Unit tests — transaction modal reducer

**File**: `tests/reducers/transaction-modal-reducer.test.ts` (new)

**Intent**: Lock reducer behavior before edit-modal refactor touches dispatch paths.

**Contract**: Cover all action types in `reducers/transaction-modal-reducer.ts` — especially `SET_SHOW_EDIT_TRANSACTION_MODAL` (stores `transactionId`, `transactionType`, `transactionCategory`, `groupBudgetId`) and `SET_HIDE_MODAL` (resets edit state).

#### 3. Unit tests — form validations

**File**: `tests/utils/formValidations.test.ts` (new)

**Intent**: Baseline `TransactionSchema` behavior before C2 extracts shared validator.

**Contract**: Happy path; reject empty title, value below 0.01, missing categoryId; date required.

#### 4. Unit tests — dialog utils

**File**: `tests/utils/dialogUtils.test.ts` (new)

**Intent**: Protect route builder contracts used by edit save.

**Contract**: `handleApiEditTransactionRoute` returns correct URLs for all four category/type combinations (personal/group × income/expense) matching `utils/dialogUtils.ts:54-68`.

#### 5. Money utils

**File**: `utils/moneyUtils.ts` (new)

**Intent**: Centralize grosze ↔ PLN conversion on the edit path; preserve expense sign convention (parent expense values stored negative).

**Contract**: Export `toPln(grosze: number): number` and `toGrosze(pln: number, options?: { negate?: boolean }): number`. Round-trip and expense-negation cases covered in unit tests.

#### 6. Unit tests — money utils

**File**: `tests/utils/moneyUtils.test.ts` (new)

**Intent**: Prevent regression on money boundaries before replacing inline `/100` and `*100`.

**Contract**: Line-item conversion, parent sum with expense negation, round-trip integrity.

#### 7. Group read auth fix

**Files**: `actions/getGroupExpenseById.ts`, `actions/getGroupIncomeById.ts`

**Intent**: Align read authorization with PATCH — non-owners must not load group transactions by ID.

**Contract**: After `findUnique`, return null when record exists but `userId !== currentUser.id` (mirror PATCH check at `group/.../expense/[transactionId]/route.ts:68-69`). Do not change personal get*ById — already owner-scoped.

#### 8. Unit tests — group auth (optional integration-style)

**File**: `tests/actions/getGroupById.auth.test.ts` (new, or equivalent mocking prisma + getCurrentUser)

**Intent**: Prove non-owner receives null without exposing data.

**Contract**: Owner sees transaction; non-owner with valid session gets null.

### Success Criteria

#### Automated Verification

- Unit tests pass: `npm test`
- Lint passes: `npm run lint`
- Build passes: `npm run build`

#### Manual Verification

- E2E baseline recorded: personal-budget and group-budget specs pass locally
- Group auth: non-member cannot hydrate edit modal for another user's group transaction ID (manual or unit test)

**Implementation Note**: Pause for human confirmation after automated checks before Phase 1.

---

## Phase 1: C1 — Dual Data Path via `useTransactionById`

### Overview

Replace inline `getSpecificTransaction` branching and direct server action imports with a single React Query hook. Apply `toPln` in the four get*ById actions as partial C4.

### Changes Required

#### 1. Transaction-by-id hook

**File**: `hooks/useTransactionById.ts` (new)

**Intent**: Provide one fetch abstraction for edit load, mirroring list-hook conventions.

**Contract**: Signature `useTransactionById(category: TransactionCategory, type: TransactionType, id: string, enabled?: boolean)`. `queryKey`: `['transaction', category, type, id]`. `queryFn` delegates to the correct existing `get*ById` based on category/type matrix (same branching as `edit-transaction.tsx:83-100`). Return `{ data, isLoading, isFetching, error, refetch }`. `enabled` defaults false when `id`, `category`, or `type` is empty/null.

#### 2. Edit modal migration

**File**: `components/transaction-modal/edit-transaction.tsx`

**Intent**: Remove dual transport for read — hook owns fetch lifecycle; write path unchanged.

**Contract**: Remove imports of four `get*ById` actions and `getSpecificTransaction`. Use `useTransactionById(transactionCategory, transactionType, transactionId, isEditTransactionModalOpen && !!transactionId && !!transactionType && !!transactionCategory)`. Sync form via `reset` when `data` arrives. Keep four list refetch hooks and `axios.patch` save as-is (C5 deferred). Remove fetch-specific `SET_IS_LOADING` dispatches only; overlay and LoadingButton use `isFetching || isLoading` (hook fetch + context save); save guard stays `if (isLoading || !transaction) return`.

#### 3. Apply toPln in get*ById actions

**Files**: `actions/getPersonalExpenseById.ts`, `actions/getPersonalIncomeById.ts`, `actions/getGroupExpenseById.ts`, `actions/getGroupIncomeById.ts`

**Intent**: Replace inline `/100` with shared helper (partial C4).

**Contract**: Parent `value` and each line item `value` converted via `toPln`. No behavior change in returned shape.

#### 4. Hook unit test (optional but recommended)

**File**: `tests/hooks/useTransactionById.test.ts` (new)

**Intent**: Verify correct action invoked per quadrant without mounting full edit modal.

**Contract**: Mock four get*ById modules; assert queryFn routing for each category/type pair.

### Success Criteria

#### Automated Verification

- Unit tests pass: `npm test`
- Lint passes: `npm run lint`
- Build passes: `npm run build`

#### Manual Verification

- Edit personal expense: modal loads existing line items, save updates table (E2E or manual)
- Edit group expense/income: load works for owner; non-owner sees empty/error state after Phase 0 auth fix
- No regression in add expense/income modals

**Implementation Note**: Pause for human confirmation before Phase 2.

---

## Phase 2: C2 — Shared Validation on PATCH Routes

### Overview

Extract `validateTransactionPayload` from `TransactionSchema`, resolve date coercion for JSON bodies, and replace inline checks in four PATCH routes. Apply `toGrosze` in those routes (partial C4 completion on write path).

### Changes Required

#### 1. Shared validator

**File**: `utils/validateTransactionPayload.ts` (new) or extend `utils/formValidations.ts`

**Intent**: Single validation entry point for UI and API on the transaction money path.

**Contract**: Export synchronous `validateTransactionPayload(body: unknown, transactionType: 'income' | 'expense')` returning `{ success: true, data: { date: Date, transactions: Transaction[] } } | { success: false, error: string, status: number }`. Use `TransactionSchema` with `date: z.coerce.date()` (or dedicated API schema extending base). **Intentional alignment:** API adopts UI's `min(0.01)` — values `0 < x < 0.01` that PATCH currently accepts will be rejected (closes drift). Map Zod errors to income/expense-specific Polish strings via `transactionType` (e.g. `'Nie dodano przychodu'` vs `'Nie dodano wydatku'`); fix group income PATCH copy-paste bug (currently uses expense strings). Async category validation remains a separate step in route handlers (DB lookup via existing `getExpenseCategories` / `getIncomeCategories`).

#### 2. Unit tests — shared validator

**File**: `tests/utils/validateTransactionPayload.test.ts` (new)

**Intent**: Lock validation contract before route replacement.

**Contract**: ISO date string accepted; reject missing date, empty transactions array, zero/negative values, empty titles; reject `0.005` (sub-cent) to confirm API aligns with UI `min(0.01)`; preserve parity with current PATCH responses for representative cases.

#### 3. Rollout — personal expense PATCH (pilot)

**File**: `app/api/transaction/personal/expense/[transactionId]/route.ts`

**Intent**: Prove validator integration on one route before copying.

**Contract**: Replace inline checks (`:21-56`) with `validateTransactionPayload`; early return on failure with same status codes. Replace `* 100` with `toGrosze` for line items and parent sum (expense negation).

#### 4. Rollout — remaining three PATCH routes

**Files**:
- `app/api/transaction/personal/income/[transactionId]/route.ts`
- `app/api/transaction/group/[groupBudgetId]/expense/[transactionId]/route.ts`
- `app/api/transaction/group/[groupBudgetId]/income/[transactionId]/route.ts`

**Intent**: Complete C2 on edit write path.

**Contract**: Same validator + `toGrosze` pattern as pilot; income routes use positive parent values (no negation). Auth and owner checks unchanged.

#### 5. Characteristic route test

**File**: `tests/api/transaction/patch-validation.test.ts` (new)

**Intent**: Document and guard validation responses post-C2.

**Contract**: At least one test per major rejection branch (missing date, empty array, invalid value, sub-cent `0.005`) on personal expense PATCH with mocked auth/prisma. **Harness:** new `tests/api/` directory; each route test file declares `@vitest-environment node`; import `PATCH` directly from route module; mock `@/lib/prisma` and `@/actions/getCurrentUser` via `vi.mock` (no jsdom).

### Success Criteria

#### Automated Verification

- Unit tests pass: `npm test`
- Lint passes: `npm run lint`
- Build passes: `npm run build`

#### Manual Verification

- Edit save still succeeds for personal expense (E2E happy path)
- API returns expected error messages for invalid payload (manual curl or test client)
- UI zodResolver behavior unchanged in modals

**Implementation Note**: Pause for human confirmation before Phase 3.

---

## Phase 3: C3 — Atomic PATCH via `prisma.$transaction`

### Overview

Wrap replace-all line item logic in database transactions on all four PATCH routes. Prove vulnerability before and atomicity after with a failure-injection route test.

### Changes Required

#### 1. Failure-injection test (pre-refactor characterization)

**File**: `tests/api/transaction/patch-atomicity.test.ts` (new)

**Intent**: Demonstrate partial-write risk with current sequential awaits (or document expected failure mode after wrap).

**Contract**: Mock Prisma so `create` throws on second line item; assert parent/children state is inconsistent before fix; after Phase 3 changes, assert full rollback. Use same `tests/api/` harness as Phase 2 (`@vitest-environment node`, direct route import, mocked prisma/auth).

#### 2. Wrap personal expense PATCH

**File**: `app/api/transaction/personal/expense/[transactionId]/route.ts`

**Intent**: Atomic update + deleteMany + creates.

**Contract**: Replace sequential `await` block (`:75-104`) with `prisma.$transaction` containing the same operations. Interactive transaction or array form — either is acceptable if all ops commit or roll back together.

#### 3. Replicate to three remaining PATCH routes

**Files**: Same four PATCH paths as Phase 2

**Intent**: Consistent atomicity on all edit write handlers.

**Contract**: Identical transaction wrapping pattern; table/field names differ per route (personalIncomeProduct, groupExpenseProduct, groupIncomeProduct).

### Success Criteria

#### Automated Verification

- Unit and route tests pass: `npm test`
- Lint passes: `npm run lint`
- Build passes: `npm run build`
- Atomicity test passes (rollback on simulated failure)

#### Manual Verification

- Edit save happy path still works (personal + group)
- No visible behavior change on successful save
- E2E personal-budget and group-budget specs pass

**Implementation Note**: Final phase — mark change ready for archive after all checks.

---

## Testing Strategy

### Unit Tests

- Reducer: all action types, edit open/hide state transitions
- `TransactionSchema` / `validateTransactionPayload`: edge cases from research §C2
- `dialogUtils`: edit route URL matrix
- `moneyUtils`: grosze/PLN round-trip, expense negation
- `useTransactionById`: quadrant routing (mocked actions)

### Integration / Route Tests

- PATCH validation characteristic responses (Phase 2)
- PATCH atomicity failure-injection (Phase 3)
- Group get*ById auth (Phase 0)

### Manual Testing Steps

1. Run E2E baseline before Phase 0; re-run after each phase
2. Edit personal expense — change amount, verify table refresh
3. Edit group transaction as owner — verify load and save
4. Attempt edit on group transaction as non-member — verify blocked load
5. Send invalid PATCH payload — verify error message unchanged in spirit
6. (Optional) Edit personal income — no E2E coverage; manual only

## Performance Considerations

C1 hook adds React Query caching for single-transaction fetch — negligible vs prior direct await. C3 `$transaction` adds minimal overhead vs three separate round-trips; acceptable for edit save frequency. C5 (four list hooks mounted) remains deferred — no perf work in this plan.

## Migration Notes

No database schema changes. No data migration. Behavioral change: non-owners can no longer read group transactions by ID through server actions (security fix). Rollback per phase: revert commits for that phase; Phase 0 tests remain valuable even if later phases revert.

## References

- Related research: `context/changes/refactor-opportunities/research.md`
- Upstream analysis: `context/changes/edit-transaction-analysis/research.md`
- Edit modal: `components/transaction-modal/edit-transaction.tsx`
- Hook pattern: `hooks/usePersonalExpenses.ts`
- PATCH pilot: `app/api/transaction/personal/expense/[transactionId]/route.ts`
- Group auth pattern: `app/api/transaction/group/[groupBudgetId]/expense/[transactionId]/route.ts:64-69`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 0: Prerequisites — Tests, Auth, Money Utils

#### Automated

- [ ] 0.1 Unit tests pass: `npm test`
- [ ] 0.2 Lint passes: `npm run lint`
- [ ] 0.3 Build passes: `npm run build`

#### Manual

- [ ] 0.4 E2E baseline recorded: personal-budget and group-budget specs pass locally
- [ ] 0.5 Group auth: non-member cannot hydrate edit modal for another user's group transaction ID

### Phase 1: C1 — Dual Data Path via useTransactionById

#### Automated

- [ ] 1.1 Unit tests pass: `npm test`
- [ ] 1.2 Lint passes: `npm run lint`
- [ ] 1.3 Build passes: `npm run build`

#### Manual

- [ ] 1.4 Edit personal expense: modal loads and save updates table
- [ ] 1.5 Edit group expense/income: owner load works; non-owner blocked
- [ ] 1.6 No regression in add expense/income modals

### Phase 2: C2 — Shared Validation on PATCH Routes

#### Automated

- [ ] 2.1 Unit tests pass: `npm test`
- [ ] 2.2 Lint passes: `npm run lint`
- [ ] 2.3 Build passes: `npm run build`

#### Manual

- [ ] 2.4 Edit save succeeds for personal expense (E2E happy path)
- [ ] 2.5 API returns expected errors for invalid payload
- [ ] 2.6 UI zodResolver behavior unchanged in modals

### Phase 3: C3 — Atomic PATCH via prisma.$transaction

#### Automated

- [ ] 3.1 Unit and route tests pass: `npm test`
- [ ] 3.2 Lint passes: `npm run lint`
- [ ] 3.3 Build passes: `npm run build`
- [ ] 3.4 Atomicity test passes (rollback on simulated failure)

#### Manual

- [ ] 3.5 Edit save happy path works (personal + group)
- [ ] 3.6 E2E personal-budget and group-budget specs pass
