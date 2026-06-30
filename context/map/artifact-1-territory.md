# Artifact 1 — Mapa terytorium (historia gita)

> Wygenerowano na podstawie analizy historii gita repozytorium **isave**.  
> Metoda: `git log --name-only`, zliczanie modyfikacji plików per commit; analiza współwystępowania plików w commitach.

## Okres analizy

| Metryka | Wartość |
|---------|---------|
| Pierwszy commit | 2024-05-02 |
| Ostatni commit | 2024-09-11 |
| Łącznie commitów | 210 |
| Commity z odfiltrowanymi plikami | 147 |

**Uwaga:** W ostatnich 12 kalendarzowych miesiącach (czerwiec 2025 → czerwiec 2026) **brak commitów**. Cała aktywność mieści się w **2 kwartałach 2024** (maj–wrzesień). Analiza obejmuje pełny okres aktywnego rozwoju.

### Aktywność miesięczna

| Miesiąc | Commity | Dominujący focus |
|---------|--------:|------------------|
| 2024-05 | 32 | Personal budget, transaction modals, UI primitives |
| 2024-06 | 33 | Group budget, typy domenowe |
| 2024-07 | 105 | Dashboard cards, auth/register (szczyt projektu) |
| 2024-08 | 29 | E2E + unit tests |
| 2024-09 | 11 | Mobile/table polish, wind-down |

---

## Metodologia filtrowania szumu

Wykluczone z zliczeń:

- Lockfile'y (`package-lock.json`, `yarn.lock`, …)
- Pliki env (`.env*`)
- Snapshoty testów, raporty Playwright/coverage
- CI (`.github/`), Cursor/course artifacts (`.cursor/`, `context/`, `.agents/`)
- Konfigi: eslint, prettier, tsconfig, next/tailwind/postcss/vitest/playwright config, sentry, `components.json`, `vercel.json`
- Generowane: `.next/`, `next-env.d.ts`, `*.tsbuildinfo`
- Assety: `public/`
- `package.json` — wykluczony z rankingu plików (32 zmiany, głównie chore/build), uwzględniony w analizie hubów

Po filtracji: **929 wpisów zmian**, **272 unikalne pliki**.

---

## TOP 10 folderów / modułów

Głębokość dopasowana do struktury (4 poziomy dla `app/…`, 2 dla `components/`, `actions/` itd.).

| # | Folder | Zmian | Opis |
|---|--------|------:|------|
| 1 | `components/transaction-modal/` | 93 | Wspólne modale dodawania/edycji transakcji |
| 2 | `app/(root)/(routes)/personal/` | 76 | Osobisty budżet — strona + komponenty tabeli |
| 3 | `components/shared/` | 62 | Współdzielone UI (datepicker, notification…) |
| 4 | `components/ui/` | 56 | shadcn/ui — komponenty bazowe |
| 5 | `app/(root)/(routes)/components/` | 51 | Karty dashboardu (personal/group containers, wykresy) |
| 6 | `app/(root)/(routes)/group/` | 50 | Budżety grupowe — lista + widok `[id]` |
| 7 | `actions/` | 45 | Server actions (Prisma queries) |
| 8 | `app/api/transaction/` | 45 | REST API transakcji (personal/group) |
| 9 | `utils/` | 43 | Walidacje formularzy, formatowanie, kategorie |
| 10 | `e2e/` | 25 | Testy Playwright |

### Drill-down — realne obszary hands-on

**Personal budget** (`personal/components/`):

- `transactions.tsx` (13), `table-columns.tsx` (11), `actions-panel.tsx` (10)*, `transaction-table.tsx` (7)*

**Group budget**:

- `group/[id]/` — 22 zmian; `table-columns.tsx`, `transactions.tsx`
- `group/components/` — 21 zmian; `budget.tsx`, `shared-budgets.tsx`

**Transaction API**:

- `app/api/transaction/group/` — 22
- `app/api/transaction/expense/` — 12 (historyczna ścieżka; patrz mapa rename'ów)
- `app/api/transaction/personal/` — 8

**Poza TOP 10, istotne:**

- `app/api/ai/` — 23 (kategoryzacja paragonów AI)
- `app/api/register/` — 20
- `prisma/` + `types/` — 39 łącznie

\* pliki przeniesione — patrz sekcja „Mapa rename'ów".

---

## TOP 10 plików

(bez `package.json`)

| # | Plik | Zmian | Rola |
|---|------|------:|------|
| 1 | `app/api/ai/route.ts` | 23 | Integracja AI (skanowanie paragonów) |
| 2 | `app/(root)/layout.tsx` | 20 | Layout główny aplikacji |
| 3 | `app/api/register/route.ts` | 20 | API rejestracji |
| 4 | `prisma/schema.prisma` | 20 | Model bazy danych |
| 5 | `types/types.ts` | 19 | Centralne typy TypeScript |
| 6 | `app/(root)/(routes)/personal/page.tsx` | 17 | Strona osobistego budżetu |
| 7 | `app/(root)/(routes)/personal/components/transactions.tsx` | 13 | Lista transakcji personal |
| 8 | `app/(root)/(routes)/personal/components/table-columns.tsx` | 11 | Definicje kolumn tabeli |
| 9 | `components/transaction-modal/add-income.tsx` | 11 | Modal dodawania przychodu |
| 10 | `components/transaction-modal/edit-transaction.tsx` | 10 | Modal edycji transakcji |

**Wszystkie 10 plików nadal istnieje w repo i jest tracked.**

---

## Dynamika kwartalna

| Kwartał | Commity | Zmian plików* |
|---------|--------:|--------------:|
| **2024-Q2** (maj–cze) | 65 | 549 |
| **2024-Q3** (lip–wrz) | 145 | 321 |
| 2024-Q4 – 2026-Q2 | 0 | — |

### Shift Q2 → Q3

| Obszar | Q2 | Q3 | Trend |
|--------|---:|---:|-------|
| Personal budget UI | 17% | 8% | ↓ MVP zbudowany |
| Transaction modals | 13% | 7% | ↓ stabilizacja |
| UI primitives (shadcn) | 9% | 2% | ↓ |
| Dashboard cards | 1% | 14% | ↑ główny focus Q3 |
| Auth / register | 4% | 10% | ↑ |
| E2E tests | 0% | 9% | ↑ nowa faza |
| Schema & types | 6% | 2% | ↓ model ustabilizowany |

### TOP foldery per kwartał

**2024-Q2** (budowa rdzenia):

1. `components/transaction-modal/` (69)
2. `app/(root)/(routes)/personal/` (68)
3. `components/ui/` (48)

**2024-Q3** (productize & harden):

1. `app/(root)/(routes)/components/` (44)
2. `e2e/` (25)
3. `components/transaction-modal/` (24)

### Narracja

1. **Q2 2024 — greenfield sprint:** personal budget, wspólne modale transakcji, schema Prisma, shadcn/ui od zera.
2. **Q3 2024 — productize & harden:** dashboard jako centrum UX, rejestracja + AI, statystyki, testy E2E/unit, mobile polish.
3. **Q4 2024 – dziś — cisza:** brak commitów przez ~21 miesięcy.

---

## Współzmiany — wspólny mianownik

Analiza: w każdym commicie zliczono, z ilu **różnych obszarów funkcjonalnych** współwystępuje dany plik (min. 5 commitów).

### Brak pliku i18n / tłumaczeń / generowanych klientów

Repo jest monolingwalne. Nie ma centralnego pliku tłumaczeń ani wygenerowanego klienta API.

### Hub files — pliki zmieniające się razem z wieloma obszarami

| Plik | Obszary co-commit | Commity | Charakter |
|------|------------------:|--------:|-----------|
| `package.json` | 27 | 32 | Chore/build — każdy feature dodaje zależność |
| `prisma/schema.prisma` | 27 | 20 | Model danych — każda nowa encja/relacja |
| `app/(root)/layout.tsx` | 26 | 20 | Shell aplikacji (navbar, providery) |
| **`types/types.ts`** | **25** | **19** | **Główny hub domenowy w TS** |
| `app/api/register/route.ts` | 25 | 20 | Auth hub w dużych commitach cross-feature |

**Wniosek:** najbliżej „wspólnego mianownika hands-on" jest **`types/types.ts`**. W commicie z jego zmianą średnio **7.2 inne obszary** — personal, group, modale, API AI, auth, reducery, contexty.

Typowe współzmiany z `types/types.ts`:

- `app/api/ai/route.ts` (5×)
- `utils/dialogUtils.ts`, `reducers/alert-reducer.ts` (5×)
- `personal/page.tsx`, `table-columns.tsx`, `add-income.tsx` (4–5×)
- `contexts/transactions-context.tsx`, `reducers/transaction-modal-reducer.ts` (4×)

Drugie miejsce: `app/(root)/layout.tsx` (infrastruktura UI, nie logika biznesowa).

---

## Weryfikacja — czy sprzężone pliki nadal istnieją?

### Podsumowanie

| Metryka | Wynik |
|---------|-------|
| TOP 10 plików z rankingu | **10/10 OK** (istnieją, tracked) |
| Pliki-hub (20 kandydatów) | **20/20 OK** |
| TOP 50 historycznych plików | **42/50 (84%)** nadal na dysku |

### Pliki z TOP 50 „zniknięte" — mapa rename'ów

Większość to **przeniesienia (git rename)**, nie usunięcia funkcjonalności:

| Historyczna ścieżka | Zmian | Aktualny odpowiednik |
|---------------------|------:|----------------------|
| `personal/.../actions-panel.tsx` | 10 | `components/shared/actions-panel.tsx` |
| `transaction-modal/new-transaction-expense-modal.tsx` | 8 | `components/transaction-modal/add-expense.tsx` |
| `app/api/transaction/expense/personal/route.ts` | 8 | `app/api/transaction/personal/expense/route.ts` |
| `personal/.../transaction-table.tsx` | 7 | `components/table/transaction-table.tsx` |
| `personal/.../transaction-modal.tsx` | 7 | `components/transaction-modal/transaction-modal.tsx` |
| `[statistics]/personal/page.tsx` | 5 | `statistics/personal/page.tsx` |
| `components/shared/modal.tsx` | 7 | zastąpiony przez `components/ui/*` + `components/dialog/*` |
| `routes/components/group-expenses-card.tsx` | 5 | usunięty — brak bezpośredniego następcy |

**36 plików** historycznie (≥3 zmiany) nie istnieje pod starą ścieżką — głównie refaktory maj–wrzesień 2024.

### Bezpieczne kotwice do dalszej analizy brownfield

1. `types/types.ts` — wspólny kontrakt typów
2. `prisma/schema.prisma` — model danych
3. `app/(root)/layout.tsx` — shell aplikacji
4. `components/transaction-modal/*` — wspólna logika transakcji

**Uwaga:** przy analizie historycznej używaj `git log --follow` lub mapy rename'ów powyżej — ścieżki API i modali uległy reorganizacji w czerwcu–lipcu 2024.

---

## Klastry funkcjonalne (cała historia)

| Obszar | Zmian |
|--------|------:|
| Personal budget UI | 118 |
| Transaction modals (shared) | 93 |
| Auth / register | 62 |
| UI primitives (shadcn) | 56 |
| Group budget UI | 50 |
| Transaction API | 45 |
| Server actions | 45 |
| E2E tests | 30 |
| AI endpoint | 23 |
| Unit tests | 20 |
| Data model & types | 39 |
