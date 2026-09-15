# Secure CMS — React + ASP.NET Core

## 1. Cel projektu

Zbudować niewielką, ale kompletną aplikację pokazową składającą się z:

- istniejącego frontendu React + TypeScript,
- nowego backendu ASP.NET Core Web API,
- bazy danych,
- uwierzytelniania,
- autoryzacji opartej na rolach,
- operacji CRUD,
- testów,
- procesu CI/CD,
- konfiguracji Docker i Docker Compose.

Projekt ma pokazać cały przepływ:

```text
React → HTTP API → uwierzytelnienie → autoryzacja → walidacja
      → logika aplikacji → baza danych → odpowiedź API → testy → CI/CD
```

Nie budujemy dużego produktu. Pokazujemy sposób myślenia o architekturze, bezpieczeństwie i utrzymaniu serwera.

---

## 2. Kontekst rozmowy rekrutacyjnej

SpecCheck jest najmocniejszym przykładem mojego doświadczenia z dużą aplikacją Vue + .NET, ale kod jest objęty NDA.

Mogę swobodnie omówić:

- architekturę rozwiązania,
- przepływ danych,
- komunikację frontendu z backendem,
- Commands i Queries,
- podział odpowiedzialności,
- migrację Vue 2 → Vue 3,
- optymalizacje,
- problemy i podjęte decyzje.

Nie mogę pokazać:

- kodu źródłowego,
- danych klienta,
- wewnętrznej konfiguracji,
- sekretów i adresów usług,
- własnościowych reguł biznesowych.

Nowa aplikacja będzie implementacją napisaną od początku, we własnej domenie i z własnym designem.

Możemy wykorzystać ogólne koncepcje poznane podczas pracy nad SpecCheck, ale nie kopiujemy kodu ani poufnych reguł biznesowych.

---

## 3. Sposób przedstawienia projektu

> Wiem, że nie oczekiwali Państwo przygotowania nowej aplikacji. Ponieważ głównym tematem rozmowy mają być bezpieczeństwo i rozwój serwera, przygotowałem niewielkie, izolowane demo w React i .NET.
>
> Dzięki temu możemy przejść przez cały przepływ na kodzie, który mogę swobodnie pokazać, bez ograniczeń wynikających z NDA.
>
> Projekt jest celowo mały. Ma pokazać sposób projektowania API, autoryzację, testy i proces budowania, a nie udawać gotowego produktu.

O SpecCheck:

> Najmocniejszym przykładem mojego doświadczenia z dużą aplikacją .NET pozostaje SpecCheck. Z uwagi na NDA mogę omówić architekturę i moje decyzje na schemacie, ale nie mogę pokazać kodu.
>
> Dlatego przygotowałem własny projekt, w którym zastosowałem część ogólnych wzorców architektonicznych we własnej implementacji i domenie.

---

## 4. Zakres MVP

### Frontend

Istniejący frontend React + TypeScript powinien umożliwiać:

- logowanie,
- wyświetlenie listy treści,
- wyświetlenie szczegółów,
- utworzenie elementu,
- edycję,
- usunięcie przez administratora,
- obsługę stanów loading, empty, success i error,
- ukrywanie niedostępnych operacji zależnie od roli.

Ukrycie przycisku w React nie jest zabezpieczeniem. Backend zawsze samodzielnie sprawdza uprawnienia.

### Backend

- ASP.NET Core Web API,
- Entity Framework Core,
- SQLite,
- JWT authentication,
- role-based lub policy-based authorization,
- Dependency Injection,
- operacje asynchroniczne,
- `CancellationToken`,
- walidacja requestów,
- `ProblemDetails`,
- Swagger/OpenAPI,
- testy jednostkowe i integracyjne.

---

## 5. Model danych

### AuditEvent

- `Id`
- `Type`
- `Message`
- `Severity` (`Info`, `Warning`, `Error`)
- `Actor`
- `CreatedAtUtc`
- `UpdatedAtUtc`
- `CreatedByUserId`
- `Version` — optymistyczna kontrola współbieżności

Model zostanie dopasowany do rzeczywistych formularzy i danych istniejącego frontendu.

---

## 6. Endpointy

| Metoda | Endpoint            | Dostęp        |
| ------ | ------------------- | ------------- |
| POST   | `/api/auth/login`   | publiczny     |
| GET    | `/api/events`       | Editor, Admin |
| GET    | `/api/events/{id}`  | Editor, Admin |
| POST   | `/api/events`       | Editor, Admin |
| PUT    | `/api/events/{id}`  | Editor, Admin |
| DELETE | `/api/events/{id}`  | tylko Admin   |

### Oczekiwane zachowanie

- brak tokenu → `401 Unauthorized`,
- nieprawidłowy token → `401 Unauthorized`,
- Editor próbujący usunąć element → `403 Forbidden`,
- Admin może wykonać wszystkie operacje,
- brak zasobu → `404 Not Found`,
- nieprawidłowe dane → `400 Bad Request`,
- edycja nieaktualnej wersji → `409 Conflict`,
- poprawne utworzenie → `201 Created`,
- poprawne usunięcie → `204 No Content`.

---

## 7. Role

### Editor

Może:

- odczytywać,
- tworzyć,
- edytować.

Nie może:

- usuwać,
- zmieniać uprawnień.

### Admin

Może:

- odczytywać,
- tworzyć,
- edytować,
- usuwać.

Uprawnienia są sprawdzane na serwerze niezależnie od interfejsu React.

---

## 8. Proponowana architektura

```text
src/
  SecureCms.Api/
    Endpoints/
    Authentication/
    Middleware/
    Configuration/

  SecureCms.Application/
    Content/
      Commands/
      Queries/
      Contracts/
      Validators/
    Common/

  SecureCms.Domain/
    Content/
    Users/

  SecureCms.Infrastructure/
    Persistence/
    Authentication/
    Mappings/

tests/
  SecureCms.UnitTests/
  SecureCms.IntegrationTests/

react-dashboard/
  # Istniejąca aplikacja React + TypeScript zostanie skopiowana tutaj.
```

Zależności pomiędzy warstwami powinny być skierowane do środka:

```text
Api → Application ← Infrastructure
          ↓
        Domain
```

- `Domain` nie zależy od pozostałych projektów.
- `Application` zawiera przypadki użycia i kontrakty, ale nie zna szczegółów HTTP ani bazy danych.
- `Infrastructure` implementuje dostęp do danych i usługi techniczne.
- `Api` odpowiada za transport HTTP, konfigurację aplikacji i składanie zależności.

---

## 9. Docker

Projekt powinien uruchamiać się lokalnie jednym poleceniem przez Docker Compose.

### Planowane kontenery

| Usługa | Odpowiedzialność | Port lokalny |
| ------ | ---------------- | ------------ |
| `frontend` | build i serwowanie aplikacji React | `3000` |
| `api` | ASP.NET Core Web API | `8080` |

SQLite pozostaje plikiem używanym przez kontener API. Plik bazy będzie przechowywany w nazwanym wolumenie Dockera, dzięki czemu dane przetrwają ponowne utworzenie kontenera.

### Planowane pliki

```text
Dockerfile                 # wieloetapowy build backendu
frontend/Dockerfile        # wieloetapowy build React + serwer statyczny
docker-compose.yml
.dockerignore
.env.example               # wyłącznie przykładowe, niesekretne wartości
```

### Założenia bezpieczeństwa

- klucz podpisujący JWT nie trafia do repozytorium ani obrazu,
- sekret JWT jest przekazywany do kontenera przez zmienną środowiskową lub mechanizm secrets środowiska docelowego,
- repozytorium zawiera tylko `.env.example`, nigdy właściwy plik `.env`,
- kontenery produkcyjne działają jako użytkownik bez uprawnień root,
- obrazy są budowane wieloetapowo i zawierają tylko artefakty potrzebne w runtime,
- API udostępnia endpoint health check wykorzystywany przez Docker Compose,
- Swagger może być ograniczony do środowiska developerskiego,
- konfiguracja CORS wskazuje jawnie dozwolone originy,
- połączenia produkcyjne powinny używać HTTPS za reverse proxy lub load balancerem.

### Docelowe uruchomienie lokalne

```bash
cp .env.example .env
docker compose up --build
```

Po uruchomieniu:

- frontend: `http://localhost:3000`,
- API: `http://localhost:8080`,
- Swagger w środowisku developerskim: `http://localhost:8080/swagger`.

Konta demonstracyjne:

| Rola | Login | Hasło |
| --- | --- | --- |
| Editor | `editor@securecms.local` | `Editor123!` |
| Admin | `admin@securecms.local` | `Admin123!` |

Konta są celowo zapisane w pamięci i służą wyłącznie do prezentacji przepływu JWT oraz autoryzacji. W systemie produkcyjnym zastąpiłby je zewnętrzny identity provider albo ASP.NET Core Identity z bezpiecznym hashowaniem haseł, rotacją kluczy i refresh tokenami.

---

## 10. Testy

### Testy jednostkowe

Powinny obejmować przede wszystkim:

- walidację komend i requestów,
- reguły przypadków użycia,
- mapowanie danych, jeśli zawiera logikę,
- zachowanie dla brakujących zasobów.

### Testy integracyjne

Powinny uruchamiać API przez `WebApplicationFactory` i weryfikować pełny przepływ HTTP, w tym:

- logowanie poprawnymi i błędnymi danymi,
- `401` bez tokenu i z nieprawidłowym tokenem,
- `403` przy próbie usunięcia treści przez Editora,
- CRUD wykonywany przez Admina,
- `400`, `404`, `201` i `204`,
- zapis i odczyt danych przez Entity Framework Core.

---

## 11. CI/CD

Minimalny pipeline powinien wykonywać:

1. przywrócenie zależności backendu i frontendu,
2. build backendu w trybie Release,
3. lint i type-check frontendu,
4. testy jednostkowe i integracyjne,
5. build frontendu,
6. build obrazów Docker,
7. skan zależności lub obrazów pod kątem znanych podatności,
8. opcjonalną publikację obrazów po merge do głównej gałęzi.

Pipeline nie może przechowywać sekretów w plikach repozytorium. Sekrety wdrożeniowe powinny pochodzić z bezpiecznego magazynu używanego przez platformę CI/CD.

Aktualny workflow `.github/workflows/ci.yml` rozdziela backend, frontend i skan bezpieczeństwa na niezależne joby. Po ich poprawnym zakończeniu buduje oba obrazy. Dla pull requestu obrazy są tylko weryfikowane, a push do `main` publikuje je do GitHub Container Registry z tagiem SHA i `latest`. Sam deployment na środowisko docelowe pozostaje osobnym krokiem, ponieważ projekt nie wskazuje jeszcze platformy hostingowej.

---

## 12. Kryteria ukończenia MVP

- aplikacja uruchamia się lokalnie przez Docker Compose,
- użytkownik może się zalogować i otrzymać JWT,
- Editor może odczytywać, tworzyć i edytować zdarzenia,
- Editor otrzymuje `403` przy próbie usunięcia zdarzenia,
- Admin może wykonywać wszystkie operacje CRUD,
- API zwraca spójne odpowiedzi `ProblemDetails`,
- dane są zapisywane w SQLite i zachowywane w wolumenie,
- Swagger dokumentuje dostępne endpointy,
- testy jednostkowe i integracyjne przechodzą,
- pipeline CI wykonuje build oraz testy,
- żadne sekrety ani dane związane ze SpecCheck nie znajdują się w repozytorium.

---

## 13. Świadome uproszczenia demonstracyjne

- Użytkownicy i hasła demonstracyjne są zapisani w pamięci. Produkcyjnie użyjemy identity providera lub ASP.NET Core Identity oraz bezpiecznego hashowania.
- Frontend przechowuje krótko żyjący JWT w `localStorage`, co upraszcza pokaz przepływu Bearer. Dla aplikacji narażonej na Internet preferowany byłby wzorzec BFF albo cookie `HttpOnly`, `Secure`, `SameSite` wraz z ochroną CSRF.
- Baza jest inicjalizowana przez `EnsureCreated` dla szybkiego startu demo. Produkcyjne zmiany schematu powinny używać wersjonowanych migracji EF Core wykonywanych w kontrolowanym kroku wdrożenia.
- Development i testy generują efemeryczny klucz przy starcie. Docker wymaga podania wartości przez `.env`, a środowisko docelowe powinno pobierać sekret z bezpiecznego magazynu i wspierać rotację.
