# Formulator

A web-based form builder for creating multi-page surveys and questionnaires. Authors design **spreads** in the builder, publish **snaps** (immutable snapshots), and send **spills** (per-recipient links). Respondents open a spill URL and fill the form in a separate app.

> **Status:** Active development. The **builder** and **Go API** support spreads, snaps, and spills end to end (create, list, publish, share, submit). The **responder** loads a spill from the API (`GET /spills/{id}?schema=true`), renders text/select/radio/checkbox questions and notes with Angular signal forms, validates **`RSchema`** client-side, submits via **`PATCH /spills/{id}`**, and routes to a thank-you page. Load failures (missing, completed, expired, server error) show dedicated status screens. **Save-and-resume**, hydrating in-progress answers from `rSchema` on load, and server-side semantic validation of `RSchema` are not implemented yet.

---

## Applications

| App                      | npm script                | Dev URL               | Role                                                                                             |
| ------------------------ | ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| **formulator-builder**   | `npm run start:builder`   | http://localhost:4200 | Build workspace (canvas, JSON/rendered preview) and Share workspace (snaps, spills, send survey) |
| **formulator-responder** | `npm run start:responder` | http://localhost:4222 | Public form filler: `/:spillId` (form), `/:spillId/complete` (after submit)                      |

Both apps share **`@formulator/schema`** (`projects/schema`) for the spread document model, **`RSchema`** / response helpers, and validation (`validateNewRSchema`, `validateFinalRSchema`, option bool-map rules).

---

## Domain model

| Term       | Meaning                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| **Spread** | Editable draft form (title, pages, questions, notes). Stored with optimistic concurrency (`version`).                 |
| **Snap**   | Published snapshot of a spread’s schema at a point in time. Used when creating spills.                                |
| **Spill**  | A single recipient instance tied to a snap (email, names, `rSchema`, sent time). The spill **id** is the share token. |

The HTTP API is defined in **`api/openapi.yaml`** (and **`api/openapi.json`**).

| Method  | Path                       | Typical use                                                                                                          |
| ------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/spills/{id}?schema=true` | Responder: spill metadata + `rSchema` + published form **`schema`** from the snap (409 if completed, 410 if expired) |
| `PATCH` | `/spills/{id}`             | Responder: one-shot submit `{ rSchema }` (sets `completedAt`)                                                        |
| `POST`  | `/spills`                  | Builder share: create spill with `snapId`, `email`, initial `rSchema`                                                |

Plain `GET /spills/{id}` (without `schema=true`) returns **`SpillDto`** only—useful for metadata without joining the snap’s form definition.

---

## Tech stack

| Layer           | Technology                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Frontend        | [Angular 22](https://angular.dev) (zoneless default, OnPush)                                   |
| Builder state   | [NgRx Signal Store](https://ngrx.io/guide/signals) + [Immer](https://immerjs.github.io/immer/) |
| Responder forms | Angular [signal forms](https://angular.dev/guide/forms/signals)                                |
| Styling         | [Tailwind CSS v3](https://tailwindcss.com) (root `tailwind.config.js`)                         |
| Language        | TypeScript                                                                                     |
| Backend         | Go 1.25, [chi](https://github.com/go-chi/chi)                                                  |
| Database        | PostgreSQL 16                                                                                  |
| Migrations      | [goose](https://github.com/pressly/goose)                                                      |
| Data access     | [sqlc](https://sqlc.dev)                                                                       |
| API contract    | OpenAPI 3.1 (`api/openapi.yaml`)                                                               |

---

## Architecture

**Builder** — Angular UI over **DomainStore** (spreads, snaps, spills, autosave) and **UiStore** (workspace, modals, selection). HTTP clients live under `projects/formulator-builder/src/external/api/`. Mock data is available via an HTTP interceptor when `APP_MODE` is `mock`.

**Responder** — Routes: **`/:spillId`** (form), **`/:spillId/complete`** (post-submit), **`/`** and unknown paths → **invalid link**. **`spillIdGuard`** validates the UUID param before the shell loads.

- **`AppShell`** (scoped **`AppStore`**) loads **`SpillWithSchema`** via **`SpillService`**, tracks paging and load errors (`400` / `404` / `409` / `410` / `500`).
- **`app/form/`** — **FormParent** + component-scoped **FormService**: maps **`Schema`** → signal form, builds final **`RSchema`**, **`validateFinalRSchema`**, **`PATCH`** submit, then **`Router`** navigates to **`/:spillId/complete`** (destroying the shell store).
- Revisiting a completed spill on **`/:spillId`** hits API **409** and shows an “already submitted” screen (separate from the thank-you page on **`/complete`**).
- HTTP wire types and mappers: `external/api/wire/`. Mock interceptor when `APP_MODE` is `mock`.

**Backend** — chi handlers in `internal/httpapi`, persistence in `internal/store` (including spill ↔ snap join for `?schema=true`), JSON DTOs in `internal/api`, [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807)-style **ProblemDetail** in `internal/apperrors`. Spill create/submit validate **`rSchema`** as JSON on the wire; semantic rules are enforced in TypeScript today.

**Schema package** — Framework-agnostic types for spreads, pages, elements, **`RSchema`**, and validators used by builder, responder, and tests (`npm run test:schema`).

---

## Getting started

### Prerequisites

- **Frontend:** Node.js 20+, npm
- **Full stack:** Go 1.25+, Docker, [goose](https://github.com/pressly/goose), [sqlc](https://sqlc.dev) (for regenerating queries)

### Install

```bash
npm install
```

### Frontend only (mock API)

Set `APP_MODE: 'mock'` in:

- `projects/formulator-builder/src/app/env.ts`
- `projects/formulator-responder/src/app/env.ts` (if running the responder)

```bash
npm run start:builder    # http://localhost:4200
npm run start:responder  # http://localhost:4222
```

Mock interceptors serve in-memory data; no backend required.

### Full stack (Angular + Go API)

```bash
# Postgres
docker compose up -d

# API (from repo root)
cd backend
cp .env.example .env   # first time only
make migrate-up
make run
```

The API listens on **http://localhost:8080** (`GET /healthz` for health).

Set `APP_MODE: 'api'` and `API_URL: 'http://localhost:8080'` in both env files above, then start the apps:

```bash
npm run start:builder
npm run start:responder
```

### Open a spill in the responder (local dev)

The responder URL is **`http://localhost:4222/{spillId}`**. The spill **`id`** is the share token (UUID returned when the spill is created).

**From the builder (Share workspace)**

1. Publish a snap and open the Share tab on that snap.
2. With DevTools → **Network** open, send the survey to at least one responder.
3. Select the **`POST …/spills`** request (one per recipient) and read **`id`** from the JSON response body.
4. Open **`http://localhost:4222/{id}`** in the browser (works in both **`mock`** and **`api`** modes).

### Other commands

```bash
npx ng build formulator-builder
npx ng build formulator-responder
npm run test:schema        # Vitest: @formulator/schema
npm run test:responder     # Vitest: responder mappers, spill-id guard
cd backend && make test    # Go tests
```

---

## Project structure

```
api/                          # OpenAPI spec (shared contract)
backend/
├── cmd/server/               # API entry point
├── db/
│   ├── migrations/           # goose SQL migrations
│   └── queries/              # sqlc query definitions
└── internal/
    ├── api/                  # Wire DTOs (HTTP JSON shape)
    ├── apperrors/            # ProblemDetail error types
    ├── httpapi/              # chi router and handlers
    └── store/                # Application layer + sqlc-generated repo
projects/
├── schema/                   # @formulator/schema (shared types + RSchema validation)
│   └── src/lib/              # schema, element, question, option, r-schema, …
├── formulator-builder/
│   └── src/
│       ├── app/              # Routes, env, app-shell
│       │   ├── builder/      # Build workspace UI (canvas, editors, preview)
│       │   └── share/        # Share workspace UI (snaps, spills, send survey)
│       ├── domain/           # Models, mappers, DomainStore
│       ├── external/         # external/api/* + mock interceptor
│       └── ui/               # UiStore
└── formulator-responder/
    └── src/
        ├── app/
        │   ├── app-shell/    # Load spill, error/loading UI, form host
        │   ├── app-store.ts  # Spill session state (provided on AppShell)
        │   ├── form/         # FormService, mappers, question/page components
        │   ├── submission-complete/
        │   ├── invalid-link/
        │   ├── app.routes.ts
        │   └── env.ts
        ├── external/
        │   ├── api/          # SpillService, wire DTOs/mappers
        │   └── mock/         # Mock interceptor + mock schema
        ├── guards/           # spillIdGuard, param validation
        └── utils/            # e.g. isUuid
tailwind.config.js            # Shared Tailwind config (both apps)
```

---

## License

[Apache 2.0](./LICENSE)
