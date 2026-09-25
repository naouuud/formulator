# Formulator

A web-based form builder for creating multi-page surveys and questionnaires. Authors design **spreads** in the builder, publish **snaps** (immutable snapshots), and send **spills** (per-recipient links). Respondents open a spill URL and fill the form in a separate app.

> **Status:** Active development. The builder and Go API support spreads, snaps, and spills end to end. The **responder** loads a spill’s schema from the API and renders most question types with Angular signal forms; **submission** (persisting `RSchema`) and richer error handling for completed/expired spills are still in progress.

---

## Applications

| App                      | npm script                | Dev URL               | Role                                                                                             |
| ------------------------ | ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| **formulator-builder**   | `npm run start:builder`   | http://localhost:4200 | Build workspace (canvas, JSON/rendered preview) and Share workspace (snaps, spills, send survey) |
| **formulator-responder** | `npm run start:responder` | http://localhost:4222 | Public form filler at `/:spillId`                                                                |

Both apps share **`@formulator/schema`** (`projects/schema`) for form structure types and helpers.

---

## Domain model

| Term       | Meaning                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| **Spread** | Editable draft form (title, pages, questions, notes). Stored with optimistic concurrency (`version`).            |
| **Snap**   | Published snapshot of a spread’s schema at a point in time. Used when creating spills.                           |
| **Spill**  | A single recipient instance tied to a snap (email, names, sent time). The responder route uses the spill **id**. |

The HTTP API is defined in **`api/openapi.yaml`** (and generated **`api/openapi.json`**). Notable responder endpoint: **`GET /spills/{id}/schema`** — returns the snap’s schema for an open spill (404/409/410 when missing, completed, or expired).

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

**Responder** — Route `/:spillId` → guard → **AppStore** (hand-rolled `@Injectable` with private signals—not NgRx Signal Store) loads schema via **SpillService** → **FormParent** + component-scoped **FormService** build the signal form from the schema. Notes and questions (text, select, radio, checkbox) are rendered; validation currently focuses on **required** fields.

**Backend** — chi handlers in `internal/httpapi`, persistence and rules in `internal/store`, JSON DTOs in `internal/api`, [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807)-style **ProblemDetail** errors in `internal/apperrors`.

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

### Other commands

```bash
npx ng build formulator-builder
npx ng build formulator-responder
npm run test:schema        # Vitest for projects/schema
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
├── schema/                   # @formulator/schema (shared types)
├── formulator-builder/       # Builder + share UI
│   └── src/
│       ├── app/              # Shell, routes, env
│       ├── domain/           # Models + DomainStore
│       ├── external/         # API services + mock interceptor
│       └── ui/               # UiStore
└── formulator-responder/     # Public form filler
    └── src/
        ├── app/              # Routes, env, config
        ├── components/form/  # FormParent, pages, questions, FormService
        ├── external/         # SpillService + mock interceptor
        └── store/            # AppStore (schema load, paging)
tailwind.config.js            # Shared Tailwind config (both apps)
```

---

## License

[Apache 2.0](./LICENSE)
