# Artifact 2 — Mapa strukturalna (dependency-cruiser)

> Wygenerowano na podstawie analizy grafu zależności repozytorium **isave** w kontekście aktywnych obszarów z [`artifact-1-territory.md`](./artifact-1-territory.md).  
> Narzędzie: dependency-cruiser v16.10.4, konfiguracja `.dependency-cruiser.js`, tsconfig projektu.

## Zakres analizy

| Metryka | Wartość |
|---------|---------|
| Moduły w grafie | 195 |
| Krawędzie zależności | 668 |
| Reguły walidacji | 4 (`no-circular`, `types-not-importing-up`, `utils-not-importing-ui`, `actions-not-importing-components`) |
| Naruszenia reguł | **0** |
| Okres aktywności (kontekst) | 2024-Q2–Q3, brak commitów od 2024-09 |

**Uwaga:** W repo nie ma folderu `webapp/` — analiza obejmuje aplikację Next.js w katalogu głównym (`app/`, `components/`, `actions/`, `utils/`, `types/`, `contexts/`, `reducers/`, `hooks/`).

---

## Pytanie przewodnie sesji

> Czy najczęściej zmieniane obszary mają bezpieczną strukturę zależności — bez cykli, z przewidywalnymi warstwami — i gdzie zmiana będzie najtrudniejsza do przetestowania w izolacji?

---

## 1. Cykle zależności w aktywnych obszarach

### Wynik

**Brak cykli** w całej aplikacji i we wszystkich TOP 10 folderach z mapy terytorium.

- Reguła `no-circular`: ✔ (0 naruszeń)
- Krawędzie `circular` w JSON: **0**
- Pary dwukierunkowe importów w aktywnych obszarach: **0**
- Cykle 3-węzłowe dotykające aktywnych obszarów: **0**

### Ryzyko mimo braku cykli

Graf jest **acykliczny, ale gwiaździsty** — wysoki fan-in na hubach:

| Hub | fan-in | fan-out | Rola |
|-----|-------:|--------:|------|
| `types/types.ts` | 27 | 0 | Liść — wspólny kontrakt typów |
| `actions/getCurrentUser.ts` | 37 | 2 | Auth → Prisma → NextAuth |
| `contexts/transactions-context.tsx` | 11 | 2 | Globalny stan modala transakcji |

Zmiana w hubie rozchodzi się na wiele obszarów bez tworzenia pętli importów — efekt podobny do cyklu, ale w jedną stronę.

### Łańcuch stanu transakcji (zdrowy, jednokierunkowy)

```
contexts/transactions-context → reducers/transaction-modal-reducer → types/types.ts
```

Konsumenci (personal, group, modale) importują context — nie na odwrót.

---

## 2. Granice warstw

### Skonfigurowane reguły — wszystkie OK

| Reguła | Intencja | Wynik |
|--------|----------|-------|
| `types-not-importing-up` | `types/` nie importuje z UI/app/actions | ✔ 0 naruszeń |
| `utils-not-importing-ui` | `utils/` bez importów z `components/` | ✔ 0 naruszeń |
| `actions-not-importing-components` | Server actions bez Reacta | ✔ 0 naruszeń |

### Dodatkowe granice sprawdzone ad hoc — wszystkie OK

- `components/` → `app/(routes)/`: 0 naruszeń
- `components/ui/` → actions/contexts/app: 0 naruszeń
- `app/api/` → components/contexts/reducers: 0 naruszeń
- `hooks/` → components/app: 0 naruszeń
- `contexts/` → app/modale: 0 naruszeń
- `reducers/` → components/app: 0 naruszeń

### Model warstw w praktyce

```
types → reducers → contexts → hooks → components (ui/shared/feature) → app/(routes)
                ↘ utils ↗                    ↘ actions → lib/prisma
                              app/api → actions + utils + types
```

### Importy legalne, ale zaskakujące przy brownfield

| Miejsce | Wzorzec | Ryzyko |
|---------|---------|--------|
| `edit-transaction.tsx` | Jedyny komponent importujący 4 server actions bezpośrednio (pozostałe modale idą przez hooks) | Niespójność wzorca po 21 mies. ciszy |
| `layout.tsx` | Montuje 3 modale + 3 contexty globalnie | Każdy nowy modal = zmiana shellu |
| `components/shared/actions-panel` | Importuje `transactions-context` | „Shared" sprzęgnięty z domeną transakcji |
| `getCurrentUser.ts` | Import z `pages/api/auth/[...nextauth].ts` | Ukryty coupling auth w warstwie danych |
| `utils/formValidations.ts` | Współdzielony przez modale + register API + transaction API | Zmiana walidacji = regresja cross-warstwowa |

Aktywne obszary korzystają z warstw **przewidywalnie w dół stosu** — personal/group UI: hooks → contexts → types → ui; API: actions + utils + lib.

---

## 3. Ryzyka testowalności

### Istniejące pokrycie

| Warstwa | Testy | Wzorzec |
|---------|-------|---------|
| Unit (Vitest) | 14 plików | Mock hooks (`transactions.test.tsx`) lub mock context provider (`actions-panel.test.tsx`) |
| E2E (Playwright) | 4 specy + AI mock | CRUD transakcji personal/group przez modale |
| Brak testów | Modale (unit), API routes, reducer, dashboard, layout, większość utils | — |

### Ranking modułów pod kątem trudności izolacji

| # | Moduł | Deps | Strategia |
|---|-------|-----:|-----------|
| 1 | `edit-transaction.tsx` | 18 | **E2E** (jest) → refaktor do hooka → integracja |
| 2 | `getCurrentUser.ts` | fan-in 37 | **Integracja** z mock Prisma; nie przez UI |
| 3 | `add-expense.tsx` / `add-income.tsx` | 12–13 | **E2E** + unit sub-komponentów |
| 4 | `layout.tsx` | 9 | **E2E** only |
| 5 | `personal-container.tsx` | 7 | **Integracja** + unit `chartUtils` |
| 6 | `app/api/ai/route.ts` | 6 | **Integracja** + E2E AI mock |
| 7 | `table-columns.tsx` | 4 | **Integracja** z mock 2 contextów |
| 8 | `transaction-modal-reducer.ts` | 1 | **Unit** — quick win |
| 9 | `formValidations.ts` | 0 | **Unit** — quick win |

### Quick wins (najwyższy ROI testów)

1. `reducers/transaction-modal-reducer.ts` — 1 import (`types`), brak testu
2. `utils/formValidations.ts` — 0 importów, chroni modale + API
3. `utils/dialogUtils.ts`, `utils/chartUtils.ts` — liście utils

---

## 4. Graf — podgraf testowalności

### Pytanie, na które odpowiada graf

> **Dlaczego `edit-transaction.tsx` jest „black hole" mocków — jedynym modułem w TOP aktywnych obszarów, który łączy server actions, hooks, globalny context i utils w jednym komponencie?**

### Parametry renderu

```bash
npx depcruise --config .dependency-cruiser.js \
  --focus "^components/transaction-modal/edit-transaction" \
  --focus-depth 2 \
  --exclude "node_modules" \
  --output-type dot \
  components/transaction-modal actions hooks contexts utils types reducers \
    components/shared components/ui \
  | dot -T svg -o context/map/edit-transaction-testability.svg
```

| Parametr | Wartość |
|----------|---------|
| Węzły w podgrafie | 36 |
| Głębokość focus | 2 (sąsiedzi sąsiadów) |
| Wykluczone | `node_modules` |

### Warstwy w podgrafie

| Warstwa | Węzły |
|---------|------:|
| actions | 9 |
| hooks | 6 |
| components | 13 |
| utils | 3 |
| types | 1 |
| contexts | 1 |
| reducers | 1 |
| lib | 2 |

### Plik wynikowy

📄 [`edit-transaction-testability.svg`](./edit-transaction-testability.svg)

Widać na nim:
- **4 bezpośrednie importy actions** (fetch po ID) — unikalne w modalu
- **4 hooks** (invalidacja cache po zapisie)
- **`transactions-context`** → reducer → types
- **Transitive reach** do `getCurrentUser` → `lib/prisma` (przez hooks/actions w depth 2)

To tłumaczy, czemu unit test tego komponentu wymagałby mockowania dwóch różnych mechanizmów danych naraz — podczas gdy reszta UI mockuje tylko hooks.

---

## Wnioski dla brownfield

### Co jest w porządku

1. **Brak cykli** — można refaktorować moduł po module bez pułapki „co importować pierwsze".
2. **Warstwy trzymane** — types/utils/actions nie ciągną Reacta; components nie importują stron feature'owych.
3. **Spójny wzorzec testów list** — personal/group `transactions.tsx` testowane przez mock hooks.

### Gdzie uważać przy wznowieniu prac

1. **`edit-transaction.tsx`** — odstaje od wzorca (actions + hooks); refaktor przed dodaniem unit testów.
2. **`types/types.ts`** — każda zmiana typu = przejście przez 27 importerów; rozważyć split domenowy.
3. **`getCurrentUser → NextAuth route`** — zmiana auth dotknie całej warstwy danych mimo czystych granic UI.
4. **Dashboard (Q3 focus)** — zero testów unit i E2E mimo 51 historycznych zmian w folderze kart.
5. **Utils współdzielone UI+API** — `formValidations` bez testów mimo użycia w 3 warstwach.

### Kolejność rekomendowanych działań

1. Unit: reducer + formValidations + dialogUtils (szybkie, niski koszt)
2. Integracja: table-columns (mock context), API routes (mock Prisma)
3. Refaktor: edit-transaction → hook `useTransactionById`
4. E2E: dashboard smoke, rejestracja
5. Graf (opcjonalnie): podgraf `getCurrentUser` (fan-in 37) — pokaże zasięg zmian auth

---

## Metadane sesji

| Pole | Wartość |
|------|---------|
| Data analizy | 2026-06-26 |
| Wejście | `artifact-1-territory.md` (TOP foldery, pliki, huby) |
| Konfiguracja | `.dependency-cruiser.js` |
| Artefakty wyjściowe | ten plik + `edit-transaction-testability.svg` |
| Następny krok | `artifact-3-contributors.md` (kto zmieniał te obszary) |
