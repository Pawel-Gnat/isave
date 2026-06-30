---
change_id: refactor-opportunities
doc_type: research
created: 2026-06-27
last_updated: 2026-06-27
verified_at: 2026-06-27
verified_commit: 1c088f2
tags:
  - verified
tools:
  - ast-grep 0.44.0
---

# Research: Możliwości refaktoru (dług edit-transaction)

> **Change:** `refactor-opportunities`  
> **Data:** 2026-06-27 (weryfikacja ast-grep: 2026-06-27, commit `1c088f2`)  
> **Zakres:** kandydaci na refaktor strukturalny wyprowadzeni z `context/changes/edit-transaction-analysis/research.md`  
> **Źródła:** wcześniejsza analiza (traktowana jako zebrane dowody), inspekcja kodu, archeologia gita, konfiguracja CI/testów, trzy sub-agenty eksploracyjne (read-only), **ast-grep 0.44.0**  
> **Granica:** tylko eksploracja — bez zmian w kodzie, bez decyzji implementacyjnych

---

## Inwentarz problemów i klasyfikacja

Każdy problem zapisany w analizie edit-transaction, niezależnie od etykiety (dług, ryzyko, hotspot, znalezisko). Klasyfikacja: **KANDYDAT** = naprawa zmieniłaby strukturę kodu; **poza kandydatami** = luka w testach, poprawka bezpieczeństwa, fix UX lub notatka utrzymaniowa — zachowane jako wejście do oceny wykonalności i kosztu.

| # | Problem (z analizy) | Etykieta w źródle | Klasa |
|---|---------------------|-------------------|-------|
| 1 | Dual data path — edit czyta przez 4 server actions, zapisuje przez axios PATCH; modale add używają hooks + POST | Dług techniczny §1 (krytyczny) | **KANDYDAT** |
| 2 | Duplikacja walidacji UI/API — `TransactionSchema` (Zod) tylko w UI; API używa inline checks | Dług techniczny §2 (krytyczny) | **KANDYDAT** |
| 3 | Asymetria auth read/write — group — `getGroup*ById` bez filtra właściciela; PATCH ma owner check | Dług techniczny §3 (krytyczny) | poza kandydatami |
| 4 | Brak testów na krytycznej ścieżce — 0 unit na edit/reducer/formValidations/dialogUtils; 0 integracji API; cienkie E2E | Dług techniczny §4 (wysoki) | poza kandydatami |
| 5 | AbortController utworzony, ale nie przekazany do `axios.patch` w edit | Dług techniczny §5 (średni) | poza kandydatami |
| 6 | Cichy failure gdy `get*ById` zwraca null — pusty modal, brak feedbacku | Dług techniczny §6 (średni) | poza kandydatami |
| 7 | Replace-all line items — PATCH: update → `deleteMany` → pętla create; brak `prisma.$transaction` | Dług techniczny §7 (średni) | **KANDYDAT** |
| 8 | Rozproszona konwersja grosze/PLN — `/100` w actions, `×100` w API, brak wspólnej utility | Dług techniczny §8 (średni) | **KANDYDAT** |
| 9 | Wszystkie 4 hooki refetch zamontowane bezwarunkowo w modalu edit | Dług techniczny §9 (niski) | **KANDYDAT** |
| 10 | Brak resetu formularza przy zamknięciu modala (edit vs add) | Dług techniczny §10 (niski) | poza kandydatami |
| 11 | Współdzielony `TransactionSchema` z modalami add — stały koszt utrzymania | Dług techniczny §11 (informacyjny) | poza kandydatami |
| 12 | Drift walidacji UI vs API (ścieżka auth/pieniądze) | Luki w testach § krytyczne | poza kandydatami (objaw #2) |
| 13 | `getGroup*ById` czytelny dla każdego zalogowanego znającego ID | Luki w testach § krytyczne | poza kandydatami (to samo co #3) |
| 14 | 4 route PATCH bez testów (pieniądze, auth, replace line items) | Luki w testach § krytyczne | poza kandydatami |
| 15 | Auth 401/403 na PATCH bez testów | Luki w testach § krytyczne | poza kandydatami |
| 16 | Gałęzie walidacji API bez testów (date, empty, value, category) | Luki w testach § wysokie | poza kandydatami |
| 17 | Komponent `EditTransaction` bez testów w izolacji (Ce=26) | Luki w testach § wysokie | poza kandydatami (objaw #1) |
| 18 | Gałęzie błędów `saveData` bez testów | Luki w testach § wysokie | poza kandydatami |
| 19 | Load failure / null transaction bez testów | Luki w testach § wysokie | poza kandydatami |
| 20 | Ścieżki edit income bez testów (personal + group) | Luki w testach § wysokie | poza kandydatami |
| 21 | Fallback pustego stringa `handleApiEditTransactionRoute` bez testów | Luki w testach § średnie | poza kandydatami |
| 22 | Akcje reducera edit bez testów | Luki w testach § średnie | poza kandydatami |
| 23 | `handleRefetch` — 2/4 gałęzi pokryte E2E | Luki w testach § średnie | poza kandydatami |
| 24 | Cleanup AbortController vs brak signal w patch | Luki w testach § średnie | poza kandydatami (to samo co #5) |
| 25 | Typ wnioskowany ze znaku kwoty — `value > 0 ? 'income' : 'expense'` w 4 miejscach UI | ast-grep S26 | **KANDYDAT** |
| 26 | Coupling cross-layer przez hub `types/types.ts` (fan-in 27) | repo-map ryzyko #1 | poza kandydatami (repo-wide; poza zakresem edit) |
| 27 | Hub `getCurrentUser` (fan-in 37) | repo-map ryzyko #3 | poza kandydatami (zakres migracji auth) |
| 28 | Dashboard/statystyki bez testów | repo-map ryzyko #4 | poza kandydatami |
| 29 | `formValidations.ts` bez testów mimo 3 warstw konsumentów | repo-map ryzyko #5 | poza kandydatami (objaw #2 + #4) |
| 30 | Globalny mount modala w `layout.tsx` | checklista blast radius | poza kandydatami (świadomy wzorzec shellu) |
| 31 | Route POST create odzwierciedlają inline walidację PATCH | blast radius / S13 | poza kandydatami (wkład w zakres #2, nie osobna struktura) |
| 32 | E2E pokrywa tylko happy path edit expense (zmiana kwoty) | wnioski §4 | poza kandydatami |

### Lista kandydatów (audyt)

| ID | Kandydat | Docelowy kształt refaktoru (jedna linia) |
|----|----------|------------------------------------------|
| **C1** | Dual data path | Hook `useTransactionById(...)` (React Query) zamiast bezpośrednich importów `get*ById` w modalu edit |
| **C2** | Duplikacja walidacji UI/API | Wspólny `validateTransactionPayload` z `TransactionSchema` (+ async category checks) importowany przez UI i API |
| **C3** | Replace-all line items bez `$transaction` | Opakowanie istniejących ciał PATCH w `prisma.$transaction`; opcjonalnie wydzielony helper |
| **C4** | Rozproszona konwersja grosze/PLN | `utils/moneyUtils.ts` (`toPln` / `toGrosze`) na granicach read/write |
| **C5** | 4 hooki refetch zamontowane | Zamiana 4 subskrypcji hooków na `queryClient.invalidateQueries` z istniejącymi query keys |
| **C6** | Typ wnioskowany ze znaku kwoty | Jawne `transactionType` na scalonych wierszach tabeli; usunięcie inferencji ze znaku przy dispatch |

**Poza kandydatami — zachowane dla wykonalności:** #3/#13 (auth read group — fix bezpieczeństwa), #4–#24 (luki testów), #5/#6/#10 (UX behawioralny), #11 (informacyjny). **Wniosek CI:** GitHub Actions uruchamia tylko lint + format + build — bez `npm test` ani E2E w CI (`deploy-vercel-development.yml`, `deploy-vercel-production.yml`).

---

## C1 — Dual data path

### Obecny kształt (oparty na dowodach)

`EditTransaction` miesza trzy warstwy transportu w jednym komponencie: React Context dla stanu modala, cztery server actions `'use server'` do load-by-id oraz `axios.patch` do zapisu.

| Warstwa | Edit | Modale add (wzorzec referencyjny) |
|---------|------|-----------------------------------|
| Odczyt pojedynczego rekordu | 4× server actions `get*ById`, gałęzie na `transactionCategory` + `transactionType` | Brak — puste domyślne wartości formularza |
| Zapis | `axios.patch` via `handleApiEditTransactionRoute` | `axios.post` via `handleExpenseApiPostRoute` / `handleIncomeApiPostRoute` |
| Odświeżenie po zapisie | 4 hooki list (patrz C5) | 2 hooki list w zakresie typu |

**Kluczowe cytaty:**

- Importy: `edit-transaction.tsx:17-20` — cztery akcje `get*ById` (**dowód**)
- Gałąź fetch: `edit-transaction.tsx:83-103 (raport: 83-100)` — macierz category/type (**dowód**)
- Zapis: `edit-transaction.tsx:185-193` — `axios.patch` (**dowód**)
- Builder URL: `dialogUtils.ts:54-68` — `handleApiEditTransactionRoute` (**dowód**)
- Kontrast z add: `add-expense.tsx:162-166`, `add-income.tsx:106-110` — tylko POST, bez server actions (**dowód**)
- Jedyny konsument `get*ById`: tylko `edit-transaction.tsx` je importuje (**dowód** — wcześniejsza analiza S4–S5, zweryfikowane)

**Wniosek:** Brak wspólnej abstrakcji read/write między edit a add; edit to jedyny modal sprzęgający UI bezpośrednio z server actions do odczytu.

### Werdykt intencjonalności

**Przypadkowa złożoność** (średnia pewność).

| Faza | Zdarzenie | Tag |
|------|-----------|-----|
| 2024-05-25 `391759c` | Modal podglądu — pierwszy odczyt przez server action w context provider | dowód |
| 2024-05-26 `94e0431` | Pierwszy route PATCH; narodziny podziału read/write | dowód |
| 2024-05-28 `da7f322` | Modal edit przechodzi na inline `axios.patch` | dowód |
| 2024-06-09 `c999f1c` | Odczyt przeniesiony context → component; bezpośrednie importy actions | dowód |
| 2024-06-19–20 `02672cb`/`40d24b6` | Dodane `getGroup*ById` + group PATCH | dowód |

Zapis przez REST od początku zgodny z konwencją modalów add. Odczyt przez actions zaczął się w feature preview i był relokowany dwukrotnie; nigdy nie ujednolicono. Brak ADR w repo (**dowód**). Świadomy wybór stałego dual path przez autora: **nieznane**.

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | **Faza A (rekomendowana):** `useTransactionById(category, type, id)` opakowujący istniejące actions w React Query — rozszerza warstwę hooks, actions bez zmian. Odwracalne. **Faza B:** GET na route API (dziś brak) + deprecacja actions — większy zakres, nowa powierzchnia. |
| **Blast radius** | Głównie: `edit-transaction.tsx` (Ce=26). Actions read: 4 pliki, 1 konsument. Ścieżka write bez zmian w Fazie A. Types/context/layout nietknięte. |
| **Osłony** | 2 specy E2E pokrywają save+refresh (tylko expense). Brak testu load/hydration i wrong-quadrant fetch. CI nie uruchamia testów. |
| **Współwymóg** | Asymetria auth read group (#3) powinna być naprawiona w `get*ById` przed lub razem ze zmianą ścieżki read — nie kandydat strukturalny, ale prerequisite bezpieczeństwa. |
| **Pierwszy krok-prerekwizyt** | Uruchomić baseline E2E (`e2e/personal-budget.spec.ts`, `e2e/group-budget.spec.ts`); dodać minimalny test ścieżki load (mock hooka lub rozszerzone E2E). |

---

## C2 — Duplikacja walidacji UI/API

### Obecny kształt (oparty na dowodach)

- **UI:** `TransactionSchema` w `formValidations.ts:44-54` — `zodResolver` we wszystkich 3 modalach (`edit-transaction.tsx:141`, `add-expense.tsx:74`, `add-income.tsx:67`) (**dowód**)
- **API:** Inline imperative checks w każdym route PATCH (~`:21-56`) — date, pusta tablica, title via `normalizeString`, `value <= 0`, lookup kategorii w DB (**dowód** — `personal/expense/[transactionId]/route.ts:21-56`)
- **API nie importuje `TransactionSchema`** — w transaction API występuje tylko `CreateBudgetFormSchema` (`group/route.ts:8`) (**dowód** — wcześniejsza analiza S11)
- **Rozjazd:** UI `min(0.01)` vs API `<= 0`; UI wymaga `id` pozycji, pętla create w API ignoruje `id` klienta (**dowód**)
- Route POST create odzwierciedlają ten sam inline pattern (**dowód**)

### Werdykt intencjonalności

**Przypadkowa złożoność** (wysoka pewność).

- 2024-05-29 `ea1a9ee` / `5a70184` — UI Zod + manualne checks API tego samego dnia (**dowód**)
- 2024-06-27 `ba5f0fe` — Zod w API tylko dla register + group budget; route transakcji pominięte (**dowód**)
- Świadoma stała polityka „nigdy nie dziel schema”: **wniosek: nie** — wygląda na odłożone, nie wykluczone z projektu

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | Wydzielić `validateTransactionPayload` w `utils/` z `TransactionSchema.safeParse`; wdrożyć w jednym route PATCH; rozwinąć na 3 PATCH + opcjonalnie 4 POST. Checks kategorii w DB zostają jako warstwa po schema. |
| **Reguły warstw** | `app/api/` → `utils/formValidations` jest **dozwolone** — precedens w `register/route.ts`, `group/route.ts` (**dowód**); dependency-cruiser nie zabrania |
| **Blast radius** | Zmiana pól schema → 3 modale + 8 route CRUD po ujednoliceniu. Zmiany komunikatów błędów nie testowane E2E. |
| **Uwaga** | `TransactionSchema` używa `z.date()`; axios wysyła ISO stringi — potrzebne `z.coerce.date()` lub equivalent przed adopcją w API (**nieznane** do weryfikacji względem Prisma) |
| **Osłony** | 0 unit testów na `formValidations.ts`; 0 testów walidacji API |
| **Pierwszy krok-prerekwizyt** | Unit testy dla `TransactionSchema` + wspólnego validatora (happy + edge cases); opcjonalnie test charakterystyczny obecnych odpowiedzi 404 PATCH |

---

## C3 — Replace-all line items bez Prisma `$transaction`

### Obecny kształt (oparty na dowodach)

Wszystkie cztery route PATCH `[transactionId]` stosują: (1) `update` parent, (2) `deleteMany` produktów potomnych, (3) pętla `create` per pozycja — osobne top-level `await`, bez opakowania.

- `personal/expense/[transactionId]/route.ts:75-104` (**dowód**)
- Ten sam wzorzec w personal income, group expense, group income PATCH (**dowód** — wcześniejsza analiza S14)
- `prisma.$transaction` nie występuje nigdzie pod `app/api/transaction` (**dowód** — wcześniejsza analiza S15)

**Wniosek:** Częściowy failure może zostawić zaktualizowanego parenta z brakującymi lub częściowymi dziećmi.

### Werdykt intencjonalności

**Przypadkowa złożoność** (wysoka pewność).

- Wzorzec w pierwszej implementacji PATCH `94e0431` (2024-05-26) (**dowód**)
- Skopiowany do income i group routes (**dowód**)
- `prisma.$transaction` nigdy nie używane w historii repo (**dowód**)
- Świadome odrzucenie transakcji DB: **nieznane**

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | Opakować istniejącą logikę w `prisma.$transaction([...])` w jednym route PATCH; replikować na 3 pozostałe. Opcjonalnie później: helper `replaceLineItems`. Zachowanie bez zmian, dodana atomowość. |
| **Blast radius** | Tylko 4 pliki route PATCH. Te same pliki eksponują DELETE — zmiana izolowana do ciała PATCH. Tylko zapis edit w UI. |
| **Osłony** | E2E happy path nie wykryłby korupcji partial-write. Brak testów failure-injection. |
| **Pierwszy krok-prerekwizyt** | Test integracyjny/route z mockiem Prisma failującym na N-tym `create` — dowód podatności przed refaktorem i rollback po |

---

## C4 — Rozproszona konwersja grosze/PLN

### Obecny kształt (oparty na dowodach)

Baza przechowuje grosze jako integer. Konwersja inline na każdej granicy — brak wspólnej utility.

| Kierunek | Gdzie | Przykład |
|----------|-------|----------|
| Odczyt (PLN dla UI) | 4× `get*ById`, actions list, wykresy | `getPersonalExpenseById.ts:29-37` — `/100` na parent + pozycje (**dowód**) |
| Zapis (grosze do DB) | route PATCH/POST | `personal/expense/[transactionId]/route.ts:82-85,99` — `*100`, parent expense negowany (**dowód**) |

**Dowód:** `/100` i `*100` w 19 plikach (raport: ≥16) (actions, API, wykresy, statystyki). Brak util `toGrosze`/`toPln`.

**Wniosek:** Kolumny DB to integer grosze — wniosek z symetrycznego kierunku konwersji.

### Werdykt intencjonalności

**Mieszane — świadome ograniczenie storage, przypadkowa dyspersja** (wysoka pewność).

- 2024-05-24 `0a28461` — rework schema na `value Int` (**świadome ograniczenie** — dowód)
- 2024-05-26 `94e0431` — ten sam commit dodaje `/100` w action i `*100` w PATCH (**dowód**)
- Scentralizowany moduł konwersji nigdy nie wprowadzony (**wniosek:** nigdy nie priorytet)

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | Nowy `utils/moneyUtils.ts`; zastosować w 4× `get*ById` (tylko ścieżka load edit), potem 4 PATCH. Pełna spójność repo (actions list, wykresy, POST) to osobna, szersza faza. |
| **Blast radius** | Edit-krytyczne: 4 get*ById + 4 PATCH + konsument edit modal. Repo-wide: 19 plików (raport: 16+). Konwencja negacji expense musi być zachowana w utility. |
| **Osłony** | E2E asertuje sformatowaną walutę (`-100,00 zł` → `-200,00 zł`) tylko na happy path edit expense |
| **Pierwszy krok-prerekwizyt** | Unit testy helperów money (negacja expense, sumy pozycji, round-trip). Decyzja zakresu: tylko edit vs całe repo |
| **Naturalne połączenie z** | C1 Faza A — sensowne wprowadzić util przy dotykaniu konsumentów `get*ById` |

---

## C5 — Wszystkie 4 hooki refetch zamontowane bezwarunkowo

### Obecny kształt (oparty na dowodach)

`edit-transaction.tsx:64-81` bezwarunkowo wywołuje wszystkie cztery hooki list: `usePersonalExpenses`, `usePersonalIncomes`, `useGroupExpenses`, `useGroupIncomes`. Brak guarda `enabled`. Modal zawsze zamontowany w `layout.tsx:24`.

- `handleRefetch` wybiera jeden refetch wg aktywnej category/type (`edit-transaction.tsx:159-175`) (**dowód**)
- Add-expense montuje 2 hooki; add-income montuje 2 — połowa macierzy (**dowód**)
- Hooki używają React Query z kluczami typu `['personalExpenses', from, to]` (`usePersonalExpenses.ts:12`) (**dowód**)

**Wniosek:** Przy mount layoutu rejestrują się wszystkie cztery query; na stronach personal nadal subskrybowane są group hooki z `groupBudgetId` z contextu (często `''`).

### Werdykt intencjonalności

**Przypadkowa złożoność** (średnia pewność).

- 2024-06-09 `c999f1c` — dodane 2 personal hooki (**dowód**)
- 2024-06-19 `02672cb` — +2 group hooki dla group edit (**dowód**)
- Świadomy wybór perf zawsze subskrybować: **nieznane**

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | Warunkowe wywołania hooków **niedozwolone** (Rules of Hooks). Wykonalne: `queryClient.invalidateQueries` z istniejącymi query keys, lub composite hook (te same 4 subskrypcje, czystsze API). Lazy-mount edit modal = wyższy blast radius. |
| **Blast radius** | Głównie: `edit-transaction.tsx`. Query keys muszą pozostać kompatybilne z hookami na stronie, inaczej tabele się nie odświeżą. |
| **Osłony** | E2E pośrednio weryfikuje refetch po save. Brak testów liczby query. |
| **Pierwszy krok-prerekwizyt** | Udokumentować klucze React Query; PoC `invalidateQueries` dla jednego kwadrantu pod E2E |
| **Koszt długu vs koszt zmiany** | Niska ważność wg wcześniejszej analizy §9; zmiana to opcjonalny polish |

---

## C6 — Typ wnioskowany ze znaku kwoty

### Obecny kształt (oparty na dowodach)

Scalone tabele transakcji personal/group łączą wiersze income i expense. Przyciski Edit i Delete wyprowadzają `transactionType` ze znaku wartości wiersza:

- `personal/table-columns.tsx:154-155` — EditButton + DeleteButton (**dowód**)
- `group/[id]/components/table-columns.tsx:183,189` — ten sam wzorzec (**dowód**)
- Dokładnie 4 miejsca z `value > 0 ? 'income' : 'expense'` w codebase (**dowód** — wcześniejsza analiza S26)
- Wnioskowany typ trafia do dispatch reducera → gałąź `getSpecificTransaction` → builder route API (**dowód**)
- Kolumna typu w UI używa tej samej reguły znaku (`personal/table-columns.tsx:79-93`) (**dowód**)
- Wartości parent expense zapisywane ujemne w API (`personal/expense PATCH :82-85`) (**dowód**)

**Wniosek:** `value === 0` klasyfikuje jako `'expense'`. Czy w produkcji istnieją wiersze z wartością 0: **nieznane**.

### Werdykt intencjonalności

**Świadome ograniczenie** (wysoka pewność).

- Wprowadzone 2024-05-24 `0a28461` ze scaloną tabelą income/expense (**dowód**)
- Kopia group 2024-06-18 `3d3c1a7` (**dowód**)
- Znak koduje income vs expense w modelu domeny — jawna kolumna DB `transactionType` celowo unikana (**wniosek** ze schema + konwencji znaku w API)
- Duplikacja w 4 miejscach to copy-paste, nie świadome odrzucenie DRY (**wniosek**)

**Uwaga graniczna:** Jawne typowanie na scalonych wierszach to higiena strukturalna, nie przeprojektowanie pojęć biznesowych. Zmiana samego modelu opartego na znaku (kolumna type, osobne tabele) to inna, późniejsza analiza.

### Wykonalność migracji

| Aspekt | Ocena |
|--------|-------|
| **Ścieżka inkrementalna** | Otagować wiersze przy merge w `transactions.tsx` jawnym `transactionType`; zastąpić inferencję w obu `table-columns.tsx` (dispatch edit + delete). Reducer już przechowuje `transactionType` (`transaction-modal-reducer.ts:63`). |
| **Blast radius** | Punkty wejścia tabel, merge danych, flow delete (`delete-transaction.tsx`). Możliwy dotyk `types/types.ts` (fan-in 27) jeśli typ wiersza zostanie opublikowany. |
| **Osłony** | Brak E2E edit income; happy path tylko expense nie wykryłby błędów wrong-quadrant routing |
| **Pierwszy krok-prerekwizyt** | E2E edit income (lub equivalent) przed zmianą inferencji; zmienić edit + delete razem |

---

## Weryfikacja twierdzeń (ast-grep)

Twierdzenia **strukturalne** stojące pod rankingiem (liczności, „tylko tutaj", pary lustrzane, call-site'y). Wzorzec ast-grep 0.44.0; wynik zero potwierdzony grepem (`grep`). Commit weryfikacji: `1c088f2`.

| # | Twierdzenie | Werdykt | Dowód (plik:linia) | Metoda |
|---|-------------|---------|-------------------|--------|
| V1 | Import 4× `get*ById` — **tylko** `edit-transaction.tsx` | potwierdzone | `edit-transaction.tsx:17-20` | `-p "import getPersonalExpenseById from '@/actions/getPersonalExpenseById'" -l tsx` (×4 akcje) |
| V2 | Wywołania `await get*ById` — **4 call-site'y, 1 plik** | potwierdzone | `edit-transaction.tsx:88,90,96,98` | `-p 'await getPersonalExpenseById($$$)' -l tsx` (+ ×3 analogicznie) |
| V3 | `get*ById` — **jedyny konsument** poza definicjami actions | potwierdzone | importy+calls wyłącznie w `edit-transaction.tsx` | grep `getPersonalExpenseById\|…` w `*.{ts,tsx}` |
| V4 | `axios.patch` w modałach transakcji — **tylko edit** | potwierdzone | `edit-transaction.tsx:185-193` | `-p 'axios.patch($$$)' -l tsx components/transaction-modal` |
| V5 | Modale add — **0 importów** `@/actions/` | potwierdzone | brak dopasowań poza edit | grep `from '@/actions/'` w `components/transaction-modal/` |
| V6 | Modale add — zapis przez `axios.post` | doprecyzowane | `add-expense.tsx:162-166`, `add-income.tsx:106-110`; dodatkowo `add-expense.tsx:128` (`/api/ai`) | `-p 'axios.post($$$)' -l tsx components/transaction-modal` |
| V7 | `handleApiEditTransactionRoute` — **1 konsument** (edit save) | potwierdzone | definicja `dialogUtils.ts:54-68`; wywołanie `edit-transaction.tsx:186` | `-p 'handleApiEditTransactionRoute' -l tsx .` |
| V8 | Fan-out Ce `edit-transaction` — **26** zależności | potwierdzone | `edit-transaction.tsx` (26 deps) | `dependency-cruiser -m -T json` |
| V9 | `zodResolver(TransactionSchema)` — **3 modale** | potwierdzone | `add-expense.tsx:74`, `add-income.tsx:67`, `edit-transaction.tsx:141` | `-p 'zodResolver(TransactionSchema)' -l tsx` |
| V10 | `TransactionSchema` w `app/api` — **brak** | potwierdzone | brak dopasowań | `-p 'TransactionSchema' -l ts app/api`; grep zero |
| V11 | `formValidations` w API transaction — **tylko** `CreateBudgetFormSchema` | potwierdzone | `app/api/transaction/group/route.ts:8` | grep `formValidations` w `app/api/transaction/` |
| V12 | PATCH handlers transakcji — **4 route'y** | potwierdzone | 4× `[transactionId]/route.ts:16` | `-p 'async function PATCH' -l ts app/api/transaction` |
| V13 | Inline walidacja PATCH (`t.value <= 0`) — **4 PATCH + 4 POST** CRUD | potwierdzone | PATCH `:38` w każdym `[transactionId]/route.ts`; POST `:33` lub `:38` w 4 create routes | grep `t\.value <= 0` w `app/api/transaction/` |
| V14 | `deleteMany` + replace line items — **4 PATCH routes** | potwierdzone | `personalExpenseProduct.deleteMany` `:89`, `personalIncomeProduct` `:89`, `groupExpenseProduct` `:85`, `groupIncomeProduct` `:85` | ast-grep literal `deleteMany` → 0 (parse); grep potwierdza 4 pliki |
| V15 | Brak `prisma.$transaction` pod `app/api/transaction` | potwierdzone | brak dopasowań | `-p '\$transaction' -l ts app/api/transaction`; grep zero |
| V16 | Wzorzec update→deleteMany→create w personal expense PATCH | potwierdzone | `personal/expense/[transactionId]/route.ts:75-104` | inspekcja + ast-grep PATCH handler |
| V17 | Konwersja `/100` — **4× get*ById** (parent + line items) | potwierdzone | po 2 wystąpienia/plik, np. `getPersonalExpenseById.ts:31,36` | `-p '$X / 100' -l ts actions/get*ById.ts` |
| V18 | Konwersja `*100` w PATCH expense | potwierdzone | `personal/expense/[transactionId]/route.ts:83,99` | `-p '$X * 100' -l ts` (ten sam wzorzec w 4 PATCH) |
| V19 | `/100` lub `*100` — **19 plików** (nie 16) | doprecyzowane | 19 plików `*.{ts,tsx}` (actions, API, `chartUtils`, statystyki) | grep `/ 100\|\* 100\|/100\|\*100` |
| V20 | Brak util `toGrosze`/`toPln`/`moneyUtils` | potwierdzone | brak dopasowań | ast-grep + grep `toGrosze\|toPln\|moneyUtils` → zero |
| V21 | Edit montuje **4 hooki** refetch bezwarunkowo | potwierdzone | `edit-transaction.tsx:64-81` | `-p 'usePersonalExpenses($$$)'` (+ 3 hooki) w `components/transaction-modal` |
| V22 | Add-expense **2 hooki**, add-income **2 hooki** | potwierdzone | `add-expense.tsx:49-57`, `add-income.tsx:41-49` | j.w. — edit ma po 2 call-site'y każdego hooka |
| V23 | `handleRefetch` — gałęzie category/type | potwierdzone | `edit-transaction.tsx:159-175` | inspekcja (macierz 2×2 refetch) |
| V24 | `<EditTransaction />` — **1 mount** (layout) | potwierdzone | `app/(root)/layout.tsx:24` | `-p '<EditTransaction $$$/>' -l tsx` |
| V25 | `value > 0 ? 'income' : 'expense'` — **dokładnie 4 miejsca** | potwierdzone | `personal/.../table-columns.tsx:154-155`, `group/.../table-columns.tsx:183,189` | `-p "value > 0 ? 'income' : 'expense'" -l tsx` |
| V26 | Kolumna typu w personal table — inferencja ze **znaku** kwoty | potwierdzone | `personal/.../table-columns.tsx:85,93` (`value > 0` → income/expense) | inspekcja cell `:79-96` |
| V27 | Reducer przechowuje jawny `transactionType` przy open edit | potwierdzone | `transaction-modal-reducer.ts:63` | inspekcja `SET_SHOW_EDIT_TRANSACTION_MODAL` |

**Wpływ na ranking:** żadne twierdzenie strukturalne nie obala kolejności C1–C3 ani werdyktów odroczenia C4–C6. V19 doprecyzowuje blast radius C4 (19 vs ≥16 plików) — zakres repo-wide większy niż w raporcie, bez zmiany werdyktu „odroczyć".

---

## Refactor opportunities

Ranking propozycji na osobną sesję planowania. Ocena na podstawie kosztu długu vs kosztu zmiany, blast radius, siły dowodów i odwracalności inkrementalnej. **To nie decyzja** — planowanie wybiera, co implementować.

### Miejsce 1 — C1: Dual data path → hook `useTransactionById`

| Wymiar | Ocena |
|--------|-------|
| **Obecny → docelowy kształt** | Bezpośrednie importy 4× `get*ById` + gałąź w komponencie → jeden hook React Query (`useTransactionById(category, type, id)`) wzorowany na modalach add; server actions początkowo ukryte za hookiem |
| **Dlaczego to miejsce** | Najwyższy dług testowalności strukturalnej (Ce=26, jedyny modal importujący read actions). Wcześniejsza analiza wniosek #3 wskazuje to jako najtańszy zysk testowalności. `get*ById` ma jednego konsumenta — wąski blast radius Fazy A. Edit zbiega ze ustaloną konwencją fetch w modalach add. |
| **Koszt długu vs koszt zmiany** | Dług: brak sensownego unit testu ścieżki load edit; dwa niezależne kontrakty (actions read, REST write). Zmiana: średnia — jeden hook + zamiana importów w komponencie; write path nietknięty w Fazie A. |
| **Blast radius** | `edit-transaction.tsx` + 4 actions `get*ById` (1 konsument). Types, route PATCH, layout bez zmian w Fazie A. |
| **Szkic ścieżki inkrementalnej** | (1) Baseline E2E. (2) Hook opakowujący jeden kwadrant. (3) Zamiana importów w edit. (4) Opcjonalna Faza B: REST GET + deprecacja actions. |
| **Pierwszy krok-prerekwizyt** | Uruchomić `e2e/personal-budget.spec.ts` + `e2e/group-budget.spec.ts`; dodać test ścieżki load (mock hooka lub rozszerzone E2E). Naprawić auth read group w `get*ById` razem z lub przed zmianami read-path. |

### Miejsce 2 — C2: Walidacja UI/API → wspólny validator

| Wymiar | Ocena |
|--------|-------|
| **Obecny → docelowy kształt** | Zduplikowany Zod (UI) + inline checks (API) → `validateTransactionPayload` w `utils/` z `TransactionSchema.safeParse` + async walidacja kategorii; import w 3 modalach; adopcja route-po-route w 4 PATCH (+ opcjonalnie 4 POST) |
| **Dlaczego to miejsce** | Krytyczne ryzyko driftu na ścieżce pieniężnej — reguły UI nie propagują się do API (wcześniejsza analiza §2, luka testów #12). Precedens: register i group budget już używają Zod z `formValidations` w API. Konsolidacja zapobiega cichemu rozjazdowi walidacji. |
| **Koszt długu vs koszt zmiany** | Dług: każda zmiana schema wymaga ręcznej synchronizacji w 8 route API. Zmiana: średnio-wysoka — wydzielenie + rollout route-po-route; checks kategorii w DB jako osobna warstwa. |
| **Blast radius** | `formValidations.ts`, 3 modale, 4–8 route API. `types/types.ts` przy zmianie pól schema. |
| **Szkic ścieżki inkrementalnej** | (1) Unit testy schema + validator. (2) Rozwiązać date coercion (`z.coerce.date`). (3) Jeden route PATCH. (4) Pozostałe route. |
| **Pierwszy krok-prerekwizyt** | Unit testy `TransactionSchema` + wspólnego validatora przed zastąpieniem jakiegokolwiek inline check w API |

### Miejsce 3 — C3: Atomowość PATCH → `prisma.$transaction`

| Wymiar | Ocena |
|--------|-------|
| **Obecny → docelowy kształt** | Trzy osobne await (update → deleteMany → pętla create) → ta sama logika opakowana w `prisma.$transaction` per route |
| **Dlaczego to miejsce** | Ryzyko integralności danych przy zapisie pieniędzy przy zerowym pokryciu testami. Chirurgiczna zmiana — 4 pliki, bez zmian UI, bez nowych abstrakcji. Niezależne od C1/C2, ale korzysta z testów API dodanych jako prerekwizyt. |
| **Koszt długu vs koszt zmiany** | Dług: partial failure zostawia niespójnego parent/dzieci (wniosek). Zmiana: niska — opakować istniejące ciała; skopiować na 4 route. |
| **Blast radius** | Tylko 4 pliki PATCH `[transactionId]/route.ts`. |
| **Szkic ścieżki inkrementalnej** | (1) Test failure-injection na jednym route. (2) Opakować personal expense PATCH. (3) Replikować na 3 pozostałe. |
| **Pierwszy krok-prerekwizyt** | Test z mockiem Prisma dowodzący podatności przed refaktorem i atomowego rollback po |

---

### Kandydaci rozważeni i odroczeni

| Kandydat | Werdykt | Podsumowanie |
|----------|---------|--------------|
| **C4 — Rozproszone grosze/PLN** | Odroczyć (follow-on do C1 lub osobno) | Realne ryzyko driftu w 16+ plikach, ale repo-wide fix jest duży; util w zakresie edit naturalnie łączy się z C1 Faza A. Poniżej C1–C3, bo sama konwersja nie naprawia testowalności ani driftu walidacji — to infrastruktura wspierająca. Int jako storage jest świadomy; dyspersja przypadkowa. |
| **C5 — 4 hooki refetch** | Odroczyć (niski priorytet) | Przypadkowa złożoność o niskim wpływie widocznym dla użytkownika. Rules of Hooks blokuje naiwny fix; `invalidateQueries` to opcjonalny polish. Nie odblokowuje testów ani integralności danych. Modale add już pokazują węższy mount hooków. |
| **C6 — Typ ze znaku kwoty** | Odroczyć (higiena, nie dług) | **Świadome ograniczenie domenowe** — znak koduje typ w scalonych tabelach od 2024-05-24. Jawne tagowanie wierszy usuwa duplikację, ale nie naprawia najdroższych problemów strukturalnych. Zmiana modelu opartego na znaku (kolumna type) to przeprojektowanie pojęć biznesowych — poza zakresem; stop przed tą linią. Brak E2E edit income czyni to ryzykownym bez prerekwizytu. |

### Poza kandydatami — bez rankingu, ale wpływają na każdy refaktor

| Pozycja | Rola w planowaniu |
|---------|-------------------|
| Brak testów (#4, luki testów) | Poziomy prerekwizyt — wcześniejsza analiza rekomenduje unit testy reducera + `formValidations` + `dialogUtils` przed refaktorem; CI nie blokuje testami |
| Auth read group (#3) | Fix bezpieczeństwa w `get*ById` — współwymóg pracy nad ścieżką read C1, nie refaktor strukturalny |
| AbortController / cichy load / reset formularza | Fixy behawioralne — zaplanować obok lub po pracy strukturalnej, nie jako substytut |
| Baseline E2E | Uruchomić specy `personal-budget` + `group-budget` przed implementacją (wcześniejsza analiza wniosek #4) |

---

## Źródła

| Źródło | Ścieżka |
|--------|---------|
| Wcześniejsza analiza modułu | `context/changes/edit-transaction-analysis/research.md` |
| Mapa repo | `context/map/repo-map.md` |
| Terytorium git | `context/map/artifact-1-territory.md` |
| Graf struktury | `context/map/artifact-2-structure.md` |
| Autorzy | `context/map/artifact-3-contributors.md` |
| CI | `.github/workflows/deploy-vercel-development.yml`, `deploy-vercel-production.yml` |
| Konfiguracja testów | `vitest.config.ts`, `playwright.config.ts`, `package.json` |
| Reguły warstw | `.dependency-cruiser.js` |
| Sub-agenty eksploracji | obecny kształt, archeologia gita, wykonalność migracji (2026-06-27) |
