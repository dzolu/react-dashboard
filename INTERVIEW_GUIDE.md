# Secure CMS — scenariusz rozmowy technicznej

## Cel prezentacji

Nie próbuj pokazać każdej klasy. Celem jest udowodnienie, że potrafisz poprowadzić zmianę przez cały system i świadomie podejmujesz decyzje dotyczące bezpieczeństwa, granic odpowiedzialności, testowania i wdrożenia.

Główna historia prezentacji:

```text
React → JWT → autoryzacja → walidacja → przypadek użycia
      → repozytorium → SQLite → ProblemDetails → testy → CI/CD
```

Events jest jednym kompletnym pionowym wycinkiem aplikacji. Pozostałe ekrany nie są rozbudowywane, ponieważ w tym demo jakość jednego przepływu jest ważniejsza od liczby funkcji.

## Proponowany przebieg 40–60 minut

### 0–5 min — kontekst i zakres

Powiedz:

> Najmocniejszym przykładem mojego doświadczenia z dużym systemem Vue i .NET jest SpecCheck. Kod jest objęty NDA, dlatego mogę opowiedzieć o architekturze i decyzjach, ale nie mogę go pokazać. Przygotowałem więc mały, własny projekt, który pozwala przejść przez podobny rodzaj problemów na kodzie, który mogę swobodnie udostępnić.

Następnie podkreśl:

- to jest izolowane demo, nie próba odtworzenia własnościowych reguł SpecCheck,
- zakres został celowo ograniczony do zakładki Events,
- fake Users pozostają mockiem, ponieważ nie wnoszą wartości do omawianego przepływu,
- celem jest pokazanie pionowego przekroju, a nie liczby ekranów.

### 5–10 min — demonstracja zachowania

1. Zaloguj się jako Editor.
2. Pokaż listę zdarzeń i stany loading/error/empty.
3. Utwórz zdarzenie.
4. Edytuj je.
5. Zwróć uwagę, że Editor nie widzi przycisku Delete.
6. Zaloguj się jako Admin i usuń zdarzenie.

Najważniejsze zdanie:

> Ukrycie przycisku jest tylko zachowaniem interfejsu. Bezpieczeństwo zapewnia endpoint, który dla operacji DELETE wymaga roli Admin. Test integracyjny sprawdza, że Editor otrzymuje 403 nawet po ręcznym wysłaniu requestu.

Nie spędzaj dużo czasu na wyglądzie UI. Przejdź szybko do requestu w Network albo Swaggerze.

### 10–20 min — przepływ requestu i bezpieczeństwo

Przejdź kolejno przez:

1. `POST /api/auth/login` — demonstracyjny użytkownik jest walidowany i otrzymuje krótko żyjący JWT.
2. Klient API dodaje `Authorization: Bearer`.
3. Middleware sprawdza podpis, issuer, audience i czas ważności tokenu.
4. Grupa `/api/events` wymaga roli Editor lub Admin.
5. DELETE dodaje bardziej restrykcyjny warunek Admin.
6. Endpoint waliduje dane wejściowe i nie ufa wartościom kontrolowanym przez UI.
7. `CreatedByUserId` pochodzi z tokenu, a nie z requestu.
8. Błędy mają standardowy format `ProblemDetails`.

Warto rozróżnić odpowiedzi:

| Sytuacja | Kod | Znaczenie |
| --- | --- | --- |
| Brak lub błędny token | 401 | Nie wiemy, kim jest klient |
| Editor wywołuje DELETE | 403 | Znamy klienta, ale nie ma uprawnienia |
| Błędny request | 400 | Dane nie spełniają kontraktu |
| Brak zasobu | 404 | Zasób nie istnieje |
| Nieaktualna wersja | 409 | Konflikt współbieżnej edycji |
| Utworzenie | 201 | Zwracamy zasób i jego Location |
| Usunięcie | 204 | Operacja zakończona bez body |

Powiedz otwarcie o uproszczeniu uwierzytelniania:

> Konta i hasła są jawne, ponieważ są wyłącznie fixture'em demonstracyjnym. W produkcji wybrałbym identity providera lub ASP.NET Core Identity. Hasła byłyby hashowane, klucze rotowane, a model sesji zależałby od ryzyka aplikacji.

O przechowywaniu tokenu:

> `localStorage` upraszcza demonstrację Bearer JWT, ale zwiększa skutki XSS. Dla aplikacji internetowej rozważyłbym BFF i cookie HttpOnly/Secure/SameSite wraz z ochroną CSRF. Nie przedstawiam uproszczenia demonstracyjnego jako rozwiązania produkcyjnego.

### 20–30 min — architektura backendu

Pokaż zależności:

```text
API → Application ← Infrastructure
          ↓
        Domain
```

Omów odpowiedzialności:

- Domain przechowuje model i operacje zmieniające jego stan.
- Application opisuje przypadki użycia, kontrakty i port repozytorium.
- Infrastructure implementuje port za pomocą EF Core i SQLite.
- API odpowiada za HTTP, JWT, polityki, mapowanie statusów oraz Dependency Injection.

Ważne zastrzeżenie:

> To mały projekt, dlatego nie dodałem MediatR ani osobnej klasy dla każdego handlera. Zachowałem kierunek zależności i rozdział odpowiedzialności, ale uniknąłem ceremonii, która nie daje jeszcze wartości. Jeśli liczba przypadków użycia wzrośnie, można rozdzielić serwis na osobne command/query handlers bez zmiany warstwy HTTP.

To pokazuje pragmatyzm: wzorce służą rozwiązaniu, a nie są celem samym w sobie.

### 30–38 min — dane, współbieżność i błąd znaleziony podczas testów

Pokaż:

- `AsNoTracking` dla read-only listy,
- filtrowanie wykonywane przed materializacją,
- indeks czasu utworzenia i severity,
- operacje asynchroniczne i przekazywanie `CancellationToken`,
- `Version` jako token optymistycznej współbieżności.

Wyjaśnienie `409 Conflict`:

> Klient wysyła wersję, którą edytował. Jeśli w bazie jest już nowsza wersja, serwer nie nadpisuje zmiany i zwraca 409. UI prosi wtedy o odświeżenie danych.

Opowiedz o wykrytym problemie SQLite:

> Pierwsze testy autoryzacji przechodziły, ale rzeczywisty GET zwrócił 500. SQLite provider nie obsługiwał `ORDER BY` dla `DateTimeOffset`. Zmieniłem reprezentację trwałą na UTC `DateTime` i dodałem test integracyjny autoryzowanego listowania. To dobry przykład, dlaczego sam provider InMemory nie wystarcza — test powinien używać technologii możliwie zbliżonej do produkcyjnej.

Nie ukrywaj błędu. Sposób diagnozy i zabezpieczenie przed regresją są mocniejszym sygnałem niż twierdzenie, że problemów nie było.

### 38–46 min — strategia testów

Rozdziel testy według ryzyka:

- test jednostkowy szybko sprawdza regułę konfliktu wersji i metadane tworzone przez serwer,
- test integracyjny uruchamia prawdziwy pipeline ASP.NET Core przez `WebApplicationFactory`,
- testy integracyjne korzystają z SQLite, a nie z EF InMemory,
- sprawdzane są granice bezpieczeństwa: 401, 403 i uprawnienia Admina,
- frontend sprawdza renderowanie danych i stany ekranu.

Powiedz:

> Nie próbuję uzyskać wysokiego coverage dla samej liczby. W pierwszej kolejności testuję granice zaufania, autoryzację, kontrakt HTTP, zapis danych i zachowania, których regresja byłaby kosztowna.

### 46–53 min — Docker i CI/CD

Docker:

- backend oraz frontend mają wieloetapowe obrazy,
- finalny obraz API nie zawiera SDK,
- proces API działa jako użytkownik non-root,
- SQLite ma trwały named volume,
- frontend przez nginx obsługuje SPA i proxy `/api`,
- frontend czeka na health check API,
- sekret JWT jest wstrzykiwany, a `.env` ignorowany przez Git.

GitHub Actions:

1. Backend: restore w locked mode, build z warningami jako błędami, testy i artifact TRX.
2. Frontend: deterministyczne `npm ci`, lint, format check, testy i build.
3. Security: Trivy skanuje podatności, sekrety i błędną konfigurację.
4. Containers: job uruchamia się dopiero po przejściu trzech quality gates.
5. PR tylko buduje obrazy; push do `main` publikuje API i frontend do GHCR.
6. Obrazy dostają niezmienny tag SHA oraz wygodny tag `latest` dla głównej gałęzi.
7. Dependabot monitoruje NuGet, npm i GitHub Actions.

Istotna granica:

> Pipeline publikuje artefakty, ale nie wdraża ich automatycznie na konkretną infrastrukturę, ponieważ projekt nie ma wybranego środowiska docelowego. Deployment do Azure Container Apps, Kubernetes lub innej platformy byłby osobnym jobem z environment protection, approval i sekretami środowiskowymi.

Nie nazywaj publikacji obrazu pełnym produkcyjnym deploymentem. To świadome i profesjonalne rozróżnienie.

### 53–60 min — decyzje produkcyjne i pytania

Zakończ listą kolejnych kroków, nie implementując ich na pokaz:

- EF Core migrations zamiast `EnsureCreated`,
- zewnętrzny identity provider/BFF,
- paginacja i limit maksymalnej strony,
- structured logging, correlation ID, metryki i tracing,
- rate limiting logowania,
- rotacja kluczy i zarządzanie sekretami,
- CSP oraz pełna polityka nagłówków bezpieczeństwa,
- wdrożenie blue/green lub rolling oraz kontrolowane migracje przed uruchomieniem nowej wersji.

Zapytaj rozmówców, który obszar chcą pogłębić. To pozwoli dopasować pozostały czas.

## Plan awaryjny prezentacji

Jeżeli UI lub Docker nie wystartuje:

1. Pokaż testy integracyjne.
2. Użyj Swaggera lub `SecureCms.Api.http` do loginu i wywołań API.
3. Pokaż kod autoryzacji endpointów.
4. Pokaż workflow GitHub Actions.

Demo nie powinno zależeć od dostępu do Internetu. Przed rozmową miej już pobrane obrazy Docker i pakiety albo uruchom API oraz frontend bez Dockera.

## Pytania, których można się spodziewać

### Dlaczego JWT, a nie cookie?

JWT dobrze pokazuje bezstanowy przepływ do API i role w claimach. Dla przeglądarkowej aplikacji produkcyjnej rozważyłbym cookie HttpOnly/BFF, ponieważ token przechowywany przez JavaScript zwiększa ryzyko po XSS.

### Dlaczego SQLite?

Minimalizuje wymagania uruchomieniowe demo i nadal pozwala pokazać EF Core, constraints oraz integrację z relacyjną bazą. Produkcyjny provider, sposób migracji i indeksy należałoby zweryfikować pod faktyczne obciążenie.

### Dlaczego nie Clean Architecture z większą liczbą projektów i handlerów?

Granice i kierunek zależności są zachowane. Dalsze rozdrobnienie przy jednym zasobie zwiększyłoby głównie liczbę plików. Struktura pozwala je wprowadzić, gdy pojawi się więcej przypadków użycia.

### Czy audit event powinien być edytowalny i usuwalny?

W prawdziwym systemie audyt bezpieczeństwa często powinien być append-only i przechowywany w magazynie odpornym na modyfikację. CRUD został użyty, ponieważ zadaniem demo jest pokazanie pełnego przepływu uprawnień. W domenie produkcyjnej nazwałbym ten zasób inaczej albo ograniczył operacje zgodnie z wymaganiami compliance.

### Jak unieważnić JWT przed jego wygaśnięciem?

Krótki TTL ogranicza okno ryzyka. Przy wymaganiu natychmiastowego unieważnienia można zastosować server-side session, denylistę `jti`, wersję bezpieczeństwa użytkownika albo introspekcję u identity providera. To kosztuje dodatkowy lookup i osłabia pełną bezstanowość.

### Czy aplikacja używa refresh tokenu?

Nie w tym demo. Access token żyje 30 minut. Frontend sprawdza jego `exp` przy odtwarzaniu sesji, a po `401` centralnie czyści sesję i wraca do logowania. Produkcyjny refresh token wymagałby osobnego modelu bezpieczeństwa: rotacji przy każdym użyciu, wykrywania reuse, unieważniania po stronie serwera i bezpiecznego cookie `HttpOnly`, a nie kolejnego długowiecznego tokenu w `localStorage`.

### Jak wykonywać migracje w wielu instancjach?

Nie uruchamiałbym migracji niezależnie w każdej replice aplikacji. Wykonałby je pojedynczy, kontrolowany krok deploymentu z backupem, obserwowalnością i strategią kompatybilności wstecznej.

### Co z paginacją?

Lista demonstracyjna jest mała. Produkcyjnie API przyjmowałoby cursor albo `page/pageSize`, narzucało maksymalny limit i wykonywało sortowanie deterministyczne, np. po `CreatedAtUtc` oraz `Id`.

## Czego nie mówić

- Nie określaj fake haseł jako produkcyjnego uwierzytelniania.
- Nie twierdź, że ukryty przycisk zapewnia autoryzację.
- Nie nazywaj SQLite rozwiązaniem dla każdego obciążenia.
- Nie przedstawiaj `EnsureCreated` jako strategii migracji.
- Nie mów, że wysłanie obrazów do GHCR oznacza działające wdrożenie produkcyjne.
- Nie przepraszaj za mały zakres. Wyjaśnij, że to świadoma decyzja pozwalająca pokazać pełny przepływ.

## Checklista przed rozmową

- [ ] Repozytorium jest wypchnięte i GitHub Actions jest zielony.
- [ ] Docker Desktop działa.
- [ ] `docker compose up --build` przechodzi na czystym środowisku.
- [ ] Logowanie Editor i Admin zostało sprawdzone.
- [ ] Masz przygotowany request pokazujący 403 dla Editora.
- [ ] Swagger działa pod `/swagger`.
- [ ] W repozytorium nie ma `.env`, tokenów ani prawdziwych sekretów.
- [ ] Masz lokalny plan awaryjny bez Internetu.
- [ ] Potrafisz w 2 minuty narysować przepływ requestu.
- [ ] Potrafisz wskazać świadome uproszczenia i produkcyjne alternatywy.
