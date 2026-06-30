---
title: Raport architektoniczny — moduł 4 (10xArchitect)
created: 2026-06-30
type: architect-report
sources:
  L2: context/map/repo-map.md
  L3: context/changes/edit-transaction-analysis/research.md
  L4: context/changes/refactor-opportunities/plan.md
  L5: context/domain/
---

# Raport architektoniczny — iSave

> Synteza artefaktów L2–L5. Ok. 2 strony. Braki oznaczone wprost.

---

## 1. Opisane projekty

| Repo | Stack (z artefaktów) | Skala (orientacyjnie) | Artefakty |
|------|----------------------|------------------------|-----------|
| **isave** | Next.js 14, React 18, Prisma/MongoDB, React Query, Zod, NextAuth, axios, Vitest + Playwright | 210 commitów (maj–wrzesień 2024); 195 modułów TS/JS, 668 krawędzi importów; 0 cykli; 1 autor (Pawel Gnat); brak commitów od września 2024 (~21 mies.) | **L2**, **L3**, **L4**, **L5** |

**Uwaga:** Wszystkie wejścia odnoszą się do tego samego repozytorium. Osobnych projektów w artefaktach **BRAK**.

**Braki kontekstowe:** `context/foundation/prd.md` i `context/foundation/tech-stack.md` — **BRAK artefaktu** (potwierdzone w L5).

---

## 2. Mapa projektu (L2)

**isave** — aplikacja Next.js do budżetów personalnych i grupowych: transakcje CRUD, dashboard/statystyki, auth/rejestracja, OCR/AI paragonów.

### Kluczowe wnioski

1. **Strefy ryzyka (TOP):** hub `types/types.ts` (fan-in 27); anomalia `edit-transaction.tsx` (18 zależności, jedyny modal z bezpośrednimi server actions); auth (`getCurrentUser` fan-in 37 + legacy `pages/api/auth/`); dashboard/statystyki (51+ commitów Q3, zero testów); `formValidations.ts` (3 warstwy konsumentów, brak testów); `app/api/ai/` (coupling OpenAI — **unknown** poza repo).

2. **Lokalne centra:** `components/transaction-modal/` (93 zmian git), `types/` + `prisma/schema.prisma` (2 pliki, ogromny zasięg), `actions/` + `app/api/transaction/` (dual path read/write), `app/(root)/layout.tsx` (shell montujący 3 modale + 3 contexty).

3. **Entry pointy:** `app/(root)/layout.tsx` (globalne modale); `personal/` i `group/` routes (główny flow użytkownika); `pages/api/auth/` + `getCurrentUser.ts`; 4× PATCH + 4× POST CRUD w `app/api/transaction/`.

4. **Unknowns poza grafem:** runtime Prisma/deploy/env, coupling testów Playwright/Vitest do prod, aktualność zewnętrznych API (OpenAI, NextAuth) po 21 mies. ciszy, stan produkcyjny i CI poza wzmiankami w commitach.

5. **Struktura kłamie:** `components/shared/actions-panel` importuje `transactions-context`; folder `app/(root)/(routes)/components/` to dashboard (nazwa nieintuicyjna); historyczne rename'y ścieżek API expense.

---

## 3. Analiza ficzera (L3)

### Dlaczego ten przepływ

**Edycja transakcji** — wybrana, bo mapa L2 wskazuje ją jako strefę ryzyka **#2** (`edit-transaction.tsx`: jedyny modal bez wzorca hooks, 4 bezpośrednie server actions, brak unit testów, Ce=26).

### Feature overview

Wejście: klik Eye w `table-columns.tsx` (personal + group) → dispatch `SET_SHOW_EDIT_TRANSACTION_MODAL` w `TransactionsContext`. Modal (globalnie w `layout.tsx`) ładuje rekord przez 4× `get*ById` (server actions → Prisma, konwersja `/100`), hydratuje formularz (`TransactionSchema`). Zapis: `axios.patch` → jeden z 4 route'ów PATCH → update nagłówka + `deleteMany` pozycji + `create` nowych. Odświeżenie: React Query refetch (4 hooki list); zamknięcie: `SET_HIDE_MODAL`.

### Technical debt (TOP 3)

| Ryzyko | Opis | Dowód |
|--------|------|-------|
| **Dual data path** | Read: server actions; write: axios PATCH — jedyny modal tak robiący; Ce=26, niemożliwy sensowny unit test | ast-grep S4–S5: importy `get*ById` **tylko** w `edit-transaction.tsx:17-20` |
| **Luki testowe** | 0 unit na edit/reducer/formValidations/dialogUtils; 0 integration na 4 PATCH; E2E: 2 happy-path expense only | ast-grep S12: 4 handlery PATCH; S24: brak referencji edit w `tests/`/`e2e/` |
| **Blast radius / auth** | Zmiana `TransactionSchema` dotyka 3 modali + 8 route'ów CRUD (API **nie** importuje schema); group read bez owner check vs PATCH 403 | ast-grep S11; S19: `getGroup*ById` bez `userId` w `where` |

---

## 4. Plan refaktoryzacji (L4)

### Co refaktoryzowane

Trzy kandydaty C1–C3 z researchu, na ścieżce edit-transaction:

| Cel | Docelowy kształt |
|-----|------------------|
| **C1** | `useTransactionById(category, type, id)` — React Query zamiast 4 importów w modalu |
| **C2** | `validateTransactionPayload` z `TransactionSchema.safeParse` na 4 PATCH routes |
| **C3** | `prisma.$transaction` opakowujący update + deleteMany + creates |
| **+ Phase 0** | Fix auth group read, `moneyUtils` (`toPln`/`toGrosze`), testy bazowe |

### Czego świadomie NIE robimy

C5 (4 refetch → `invalidateQueries`), C6 (jawny `transactionType` w wierszach), fixy UX (#5 AbortController, #6 null load, #10 reset form), walidacja POST create (4 pliki), repo-wide konwersja grosze (19 plików), REST GET / deprecacja server actions, `npm test` w CI.

### Fazy (1 linia + weryfikacja)

| Faza | Zakres | Auto | Ręcznie |
|------|--------|------|---------|
| **0** | E2E baseline, unit: reducer/formValidations/dialogUtils/moneyUtils, fix auth group get*ById | `npm test`, lint, build | E2E personal+group budget; non-member nie ładuje group tx |
| **1** | C1: hook + migracja edit modal + `toPln` w get*ById | test, lint, build | edit personal/group load+save; brak regresji add modals |
| **2** | C2: shared validator + rollout 4 PATCH + `toGrosze` | test, lint, build | E2E happy path; błędy API; UI zodResolver bez zmian |
| **3** | C3: `$transaction` + test failure-injection | test, lint, build, atomicity test | edit save personal+group; E2E pass |

**Status implementacji:** wszystkie checkboxy w planie — **pending** (brak commitów w progress).

---

## 5. Domena wg DDD (L5)

### Ubiquitous language (wybór 5)

| Pojęcie | Definicja skrócona | Rozjazd model ↔ kod |
|---------|---------------------|---------------------|
| **Transakcja (nagłówek + pozycje)** | Rekord z datą, sumą, kolekcją line items (4 tabele: personal/group × expense/income) | OK w schema; brak atomowości zapisu (I5) |
| **Wydatek / Przychód** | Konwencja znaku: expense ujemny w DB, income dodatni | Typ **wnioskowany ze znaku kwoty** w UI (`value > 0 ? 'income' : 'expense'`), brak kolumny `type` w DB (R6) |
| **Grosze** | Kwoty jako `Int` w Mongo; UI operuje PLN | Konwersja `/100`/`×100` rozproszona w 19+ plikach bez value object (R4, LEAK-5) |
| **Budżet grupowy + owner/member** | Współdzielony kontener; owner zaprasza, member dodaje tx | README mówi „role-based access", kod: brak enum Role; edit bez bramki owner w UI (R1, R9) |
| **Paragon / AI** | OCR (Tesseract) + ekstrakcja OpenAI, limit 10/dzień | Rdzeń produktu; izolowany w `/api/ai` (LEAK-6 OK) |

### Niezmiennik #1 + agregat

**INV-6 / I5 — Atomowość zapisu transakcji** (nagłówek + pozycje commitują się razem albo wcale).

**Agregat:** **A1 — Transakcja (Expense/Income Entry)** — granice: parent (`PersonalExpenses`/`GroupExpenses`/…Incomes) + kolekcja `*Product`.

Status w kodzie: **ignorowany** — sekwencja `update → deleteMany → create` bez `prisma.$transaction` (4 PATCH routes; grep: 0× `$transaction` w repo).

### Anti-Corruption Layer

**Wybrany przeciek #1:** **LEAK-1 — `@prisma/client`**.

Przecieka przez **4 warstwy:** persistence (`prisma/schema.prisma`) → hub kontraktu (`types/types.ts` importuje modele ORM) → utils/hooks/actions (typy Prisma w sygnaturach) → UI `'use client'` (np. `table-columns.tsx:16` — `PersonalExpenses | PersonalIncomes` w `ColumnDef`).

Dodatkowo **37 plików** importuje runtime `prisma` z `@/lib/prisma` bez mappera — zwracają kształt persistence bezpośrednio.

**Uwaga:** Plan L4 (C1–C3) **nie realizuje** pełnego ACL z L5 doc 03 — to osobny, szerszy refactor (`infrastructure/persistence/prisma/` + domain views).

---

## 6. Decyzje, które należą do mnie

1. **Zakres refaktoru:** Research i destylacja domeny (L5) rankują też ACL Prisma (LEAK-1) i agregat domenowy — **świadomie ograniczyłem L4 do C1–C3 na ścieżce edit**, bez repo-wide money sweep i bez warstwy `domain/` + mapperów.

2. **Kolejność faz:** AI/research sugerowało testowalność (C1) przed walidacją (C2) i atomowością (C3) — **zachowałem tę kolejność**, bo get*ById ma jednego konsumenta (wąski blast radius C1).

3. **Auth group read:** Luka bezpieczeństwa (read bez owner check) — **w Phase 0 przed C1**, żeby hook nie ujawniał danych non-ownerom po refaktorze read path.

4. **C2 — progi walidacji:** Plan review (Fix A) zaproponował API `min(0.01)` zamiast obecnego `<= 0` — **zaakceptowałem świadomą zmianę behawioralną** (zamyka drift UI/API; sub-cent values odrzucone).

5. **Odroczone:** C5/C6, fixy AbortController/null-load, CI test gate, POST validation — **odłożone**, bo to polish lub osobne change'y; E2E pokrywa tylko expense happy path, reszta wymaga ręcznej weryfikacji po każdej fazie.

---

*Źródła: `context/map/repo-map.md` · `context/changes/edit-transaction-analysis/research.md` · `context/changes/refactor-opportunities/plan.md` · `context/domain/01-domain-distillation.md` · `context/domain/02-invariant-aggregate-refactor.md` · `context/domain/03-anti-corruption-layer.md`*
