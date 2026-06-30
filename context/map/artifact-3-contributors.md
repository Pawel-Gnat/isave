# Artifact 3 — Mapa kontrybutorów

> Wygenerowano na podstawie analizy `git log` repozytorium **isave** w kontekście 5 obszarów wysokiego ryzyka z syntezy [`artifact-1-territory.md`](./artifact-1-territory.md) + [`artifact-2-structure.md`](./artifact-2-structure.md).  
> Metoda: `git log --format` per ścieżka obszaru, normalizacja autorów, klasyfikacja tematyczna commit message, filtr botów/agentów.

## Zakres czasowy

| Metryka | Wartość |
|---------|---------|
| Okres żądany | ostatnie 12 miesięcy (2025-06-26 → 2026-06-26) |
| Commity w okresie (całe repo) | **0** |
| Commity w okresie (5 obszarów) | **0** |
| Okres aktywnego rozwoju | 2024-05-02 → 2024-09-11 |
| Łącznie commitów (repo) | 210 |

**Uwaga:** W żądanym oknie 12 miesięcy **nie ma żadnych commitów** — ani od ludzi, ani od botów. Poniższa analiza kontrybutorów opiera się na **pełnym okresie aktywnego rozwoju** (maj–wrzesień 2024) jako jedynym źródle danych o autorstwie w tych obszarach.

---

## Metodologia filtrowania

### Wykluczone identyfikatory (boty / automatyzacja / agenci)

Commity odrzucone, gdy w `author`, `email` lub `subject` występuje:

- `bot`, `[bot]`, `dependabot`, `github-actions`
- `copilot`, `claude`, `codex`, `cursor agent`

### Wynik filtracji (cała historia repo)

| Kategoria | Liczba commitów |
|-----------|----------------:|
| Przed filtracją | 210 |
| Odfiltrowane (bot/agent) | **0** |
| Po filtracji | 210 |

W historii repozytorium **nie występują** commity agentów AI ani botów CI z wyraźnym autorstwem innego niż człowiek.

### Konsolidacja tożsamości

GitHub rejestruje dwa wpisy tej samej osoby:

| Git author | Email | Commity (repo) | Charakter |
|------------|-------|----------------:|-----------|
| `Pawel Gnat` | `pawel_gnat@o2.pl` | 181 | Lokalne commity + praca feature |
| `Paweł Gnat` | `104066590+Pawel-Gnat@users.noreply.github.com` | 43 | Merge PR z brancha `development` |

**W analizie poniżej traktowane jako jeden kontrybutor:** **Pawel Gnat**.

---

## Wynik — ostatnie 12 miesięcy

| Obszar | Commity | Kontrybutorzy (po filtracji) |
|--------|--------:|------------------------------|
| 1. Integracja AI | 0 | — |
| 2. Auth / rejestracja | 0 | — |
| 3. edit-transaction | 0 | — |
| 4. Dashboard / statystyki | 0 | — |
| 5. Schema + types | 0 | — |

**Brak kluczowych kontrybutorów w oknie 12M** — kontakt wspierający brownfield wymaga odwołania do historii 2024 lub bezpośredniego kontaktu z osobą, która budowała projekt.

---

## Kluczowy kontrybutor (pełna historia aktywności)

### Pawel Gnat

| Pole | Wartość |
|------|---------|
| Email | `pawel_gnat@o2.pl` |
| GitHub | `Pawel-Gnat` (noreply: `104066590+Pawel-Gnat@users.noreply.github.com`) |
| Okres aktywności | 2024-05-02 → 2024-09-11 |
| Commity w 5 obszarach | 104 (wszystkie commity dotykające ścieżek obszarów) |
| Udział w repo | ~100% funkcjonalnej pracy (pozostałe commity = merge PR tej samej osoby) |

**Jedyny autor kodu** we wszystkich pięciu obszarach wysokiego ryzyka. Żaden inny człowiek modyfikował pliki w tych ścieżkach.

---

## Mapowanie obszar → kontrybutor → tematy aktywności

### 1. Integracja AI (paragony) — `app/api/ai/`

| Metryka | Wartość |
|---------|---------|
| Okres | 2024-05-12 → 2024-08-04 |
| Commity | 23 |
| Kontrybutor | **Pawel Gnat** (23) |

**Tematy aktywności (Pawel Gnat):**

| Temat | Commity | Przykładowe commity |
|-------|--------:|---------------------|
| Limity API, model, deploy prod/dev | 6 | `feat: daily api calls limit`, `perf: change openai model to 4o mini`, `feat: block AI functions in dev env` |
| Integracja OpenAI / OCR / image processing | 5 | `feat: image processing`, `feat: openai response`, `feat: remove date from ocr` |
| Iteracja UX modala AI (chore) | 5 | `chore: transaction modal inputs`, `chore: transaction result list - modal` |
| Build / CI / Sentry | 3 | `build: add sentry`, `ci/cd: netlify deploy development` |
| Rdzeń feat | 1 | `feat: transaction modal table` |

**Potencjalny support:** jedyny źródło wiedzy o wyborze modelu (4o mini), limitach dziennych, blokadzie w dev, instancjonowaniu OpenAI w funkcji, flow OCR paragonów.

---

### 2. Auth / rejestracja / getCurrentUser

Ścieżki: `app/api/register/`, `actions/getCurrentUser.ts`, `pages/api/auth/`

| Metryka | Wartość |
|---------|---------|
| Okres | 2024-05-04 → 2024-08-04 |
| Commity | 23 |
| Kontrybutor | **Pawel Gnat** (23) |

**Tematy aktywności (Pawel Gnat):**

| Temat | Commity | Przykładowe commity |
|-------|--------:|---------------------|
| Wysyłka email (Resend → Nodemailer, OAuth2) | 10 | `build: change resend lib to nodemailer`, `build: provide oauth2 email`, `chore: debug email send` |
| Rejestracja i aktywacja konta | 3 | `feat: add register email activation`, `feat: activate account` |
| Rdzeń feat (walidacje, invite) | 3 | `feat: backend form validations`, `build: user inviteId` |
| Build / CI / Sentry | 2 | `build: add sentry`, `build: prisma binaryTargets` |
| Auth infrastruktura (NextAuth, getCurrentUser) | 1 | `feat: navbar…` (initial `getCurrentUser.ts`) |
| Mobile / style | 1 | `style: name uppercase, value fixed` |

**Potencjalny support:** decyzja migracji Resend → Nodemailer + OAuth2 Gmail, flow aktywacji konta, coupling `getCurrentUser` → `pages/api/auth/[...nextauth].ts` (artifact-2), integracja inviteId z rejestracją grupową.

---

### 3. edit-transaction + wzorzec modalów — `components/transaction-modal/edit-transaction.tsx`

| Metryka | Wartość |
|---------|---------|
| Okres | 2024-05-29 → 2024-09-09 |
| Commity | 10 |
| Kontrybutor | **Pawel Gnat** (10) |

**Tematy aktywności (Pawel Gnat):**

| Temat | Commity | Przykładowe commity |
|-------|--------:|---------------------|
| Refaktor modalów, context/reducer | 4 | `refactor: reducers and contexts`, `refactor: context reducer`, `refactor: modal component` |
| Edycja transakcji (personal/group) | 2 | `feat: edit group transaction`, `chore: edit group transaction` |
| Build / Sentry | 2 | `build: add sentry`, `fix: eslint code build errors` |
| Mobile polish | 1 | `style: transaction table modal mobile width` |
| Rdzeń feat (group API) | 1 | `feat: group budget api route` |

**Potencjalny support:** wyjaśnienie, dlaczego `edit-transaction.tsx` importuje server actions bezpośrednio (anomalia z artifact-2) — prawdopodobnie ewolucja z refaktoru context/reducer + dodania edycji group; ostatnia zmiana we wrześniu 2024 (mobile width).

---

### 4. Dashboard i statystyki

Ścieżki: `app/(root)/(routes)/components/`, `app/(root)/(routes)/statistics/`

| Metryka | Wartość |
|---------|---------|
| Okres | 2024-06-28 → 2024-09-02 |
| Commity | 16 |
| Kontrybutor | **Pawel Gnat** (16) |

**Tematy aktywności (Pawel Gnat):**

| Temat | Commity | Przykładowe commity |
|-------|--------:|---------------------|
| Strony statystik (personal/group) | 6 | `chore: personal statistics page`, `feat: group budget statistics page`, `feat: incomes group statistics` |
| Wykresy (bar, doughnut, pie) | 4 | `feat: bar chart`, `feat: add doughnut chart`, `feat: change old chart library` |
| Karty dashboardu i kontenery | 2 | `chore: dashboard page cards`, `feat: details link` |
| Inne / chore (listy, kontenery) | 2 | `chore: transaction list`, `chore: group budget statistics` |
| Mobile polish | 1 | `style: dashboard mobile page` |
| Rdzeń feat | 1 | `feat: bar chart` (pierwszy wykres) |

**Potencjalny support:** logika agregacji w `chartUtils`, zamiana biblioteki wykresów, usunięcie `group-expenses-card` (ostatnie commity lipiec–wrzesień 2024), intencja stron `statistics/personal` vs `statistics/[budgetId]`.

---

### 5. Model domenowy — `prisma/schema.prisma` + `types/types.ts`

| Metryka | Wartość |
|---------|---------|
| Okres | 2024-05-02 → 2024-07-25 |
| Commity | 32 |
| Kontrybutor | **Pawel Gnat** (32) |

**Tematy aktywności (Pawel Gnat):**

| Temat | Commity | Przykładowe commity |
|-------|--------:|---------------------|
| Ewolucja modelu Prisma | 8 | `build: primsa schema`, `chore: rework db collections`, `feat: invitenotification prisma model` |
| Rdzeń feat (encje group/personal) | 7 | `feat: add group income`, `feat: add userId to group transactions`, `feat: notifications api routes` |
| Inne / chore schema | 6 | `chore: change prisma schema`, `chore: add icons, transaction expense items` |
| Kontrakt typów TypeScript | 2 | cross-feature w `types/types.ts` |
| Rejestracja / invite (schema) | 2 | `feat: add register email activation`, `build: user inviteId` |
| Refaktor modalów (types) | 2 | `refactor: reducers and contexts` |
| Cross-feature (AI, charts, edit) | 5 | rozproszone commity łączące schema/types z AI, wykresami, edycją |

**Potencjalny support:** historia ewolucji modelu (personal → group → notifications → invite), uzasadnienie scentralizowanego `types/types.ts` (hub 27 importerów), planowane vs porzucone pola w schema.

---

## Macierz supportu — kto zaoferuje pomoc w obszarze

| Obszar | Pierwszy kontakt | Pokrycie commitów | Ocena gotowości do supportu |
|--------|------------------|------------------:|----------------------------|
| 1. AI / paragony | Pawel Gnat | 100% (23/23) | **Wysoka** — autor całego endpointu i iteracji prod |
| 2. Auth / register | Pawel Gnat | 100% (23/23) | **Wysoka** — autor flow rejestracji, email, NextAuth bootstrap |
| 3. edit-transaction | Pawel Gnat | 100% (10/10) | **Wysoka** — autor refaktorów i ostatniej zmiany (wrzesień 2024) |
| 4. Dashboard / stats | Pawel Gnat | 100% (16/16) | **Wysoka** — autor wykresów i stron statystik |
| 5. Schema + types | Pawel Gnat | 100% (32/32) | **Wysoka** — autor modelu od pierwszego commita |

**Brak alternatywnych kontrybutorów** w żadnym z pięciu obszarów — kontakt z Pawłem Gnatem jest jedyną ścieżką do tribal knowledge.

---

## Wnioski dla brownfield

### Co wiemy

1. **Monolit autorstwa** — jedna osoba zbudowała cały projekt; brak rozproszonej wiedzy domenowej w zespole.
2. **Cisza 21+ miesięcy** — ostatnie commity we wrześniu 2024; kontekst sprzed ~2 lat może wymagać odświeżenia (np. zmiany w OpenAI API, NextAuth App Router).
3. **Czysta historia** — zero commitów botów/agentów; cała analiza opiera się na ludzkim autorstwie bez szumu automatizacji.

### Rekomendowane pytania per obszar (do Pawla Gnata)

| Obszar | Kluczowe pytania |
|--------|------------------|
| AI | MVP vs core? Limity kosztów? Dlaczego OCR bez daty? Plan na fallback |
| Auth | Dlaczego Nodemailer+OAuth2? Migracja NextAuth do App Router? Rate limiting rejestracji |
| edit-transaction | Świadomy coupling actions vs hooks? Planowany `useTransactionById`? |
| Dashboard | Dlaczego usunięty `group-expenses-card`? Must-have metryki wykresów |
| Schema/types | Plan split `types/types.ts`? Nieużywane pola w Prisma? Zasady personal vs group |

### Kolejność kontaktu

1. **Schema + types** — najwyższy blast radius (27 importerów); ustalenie kontraktu przed refaktorem
2. **Auth** — bezpieczeństwo i coupling `getCurrentUser`
3. **edit-transaction** — przed dodaniem testów unit (artifact-2)
4. **AI** — zewnętrzne zależności i koszty
5. **Dashboard** — produktowe decyzje UX przy braku testów

---

## Metadane sesji

| Pole | Wartość |
|------|---------|
| Data analizy | 2026-06-26 |
| Wejście | 5 obszarów z syntezy artifact-1 + artifact-2 |
| Okno czasowe żądane | 2025-06-26 → 2026-06-26 (12 miesięcy) |
| Okno faktyczne (dane) | 2024-05-02 → 2024-09-11 |
| Komenda bazowa | `git log --format='%H|%an|%ae|%ai|%s' -- <ścieżki obszaru>` |
| Następny krok | Synteza repo map (`artifact-*` → `context/map/repo-map.md`) lub `/10x-shape` brownfield |
