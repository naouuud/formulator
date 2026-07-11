# Formulator

A web-based form builder for creating multi-page surveys and questionnaires. Add questions and notes, organise them across pages, and publish structured forms — all from a clean drag-and-drop-free interface.

> **Status:** Active development. Core builder is functional; renderer, validation UI, and publishing are in progress.

---

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Frontend         | [Angular 21](https://angular.dev)                  |
| State management | [NgRx Signal Store](https://ngrx.io/guide/signals) |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com)         |
| Language         | TypeScript                                         |
| Backend          | Go, [chi](https://github.com/go-chi/chi)           |
| Database         | PostgreSQL                                         |
| Migrations       | [goose](https://github.com/pressly/goose)          |
| Data access      | [sqlc](https://sqlc.dev)                           |
| API contract     | OpenAPI 3.1 (`api/openapi.yaml`)                   |

---

## Getting Started

### Frontend only (mock API)

**Prerequisites:** Node.js 20+

```bash
npm install
npm start
```

The app runs at `http://localhost:4200`. With `APP_MODE: 'mock'` in `src/app/env.ts`, a mock HTTP interceptor handles API calls — no backend required.

### Full stack (Angular + Go API)

**Prerequisites:** Node.js 20+, Go 1.25+, Docker, [goose](https://github.com/pressly/goose), [sqlc](https://sqlc.dev)

```bash
# Start Postgres
docker compose up -d

# Run migrations and start the API
cd backend
cp .env.example .env   # first time only
make migrate-up
make run
```

The API listens on `http://localhost:8080`. Set `APP_MODE: 'api'` in `src/app/env.ts`, then start the frontend:

```bash
npm start
```

---

## Project Structure

```
api/                    # OpenAPI spec (shared contract)
backend/
├── cmd/server/         # API entry point
├── db/
│   ├── migrations/     # goose SQL migrations
│   └── queries/        # sqlc query definitions
└── internal/
    ├── api/            # Wire DTOs (HTTP JSON shape)
    ├── apperrors/      # ProblemDetail error types
    ├── httpapi/        # chi router and handlers
    └── store/          # Application layer + sqlc-generated repo
src/
├── app/
│   └── builder/        # Form builder UI components
├── domain/
│   ├── model/          # Domain types and factories
│   └── store/          # NgRx Signal Store (state + mutations)
├── external/
│   ├── api/            # HTTP service layer
│   └── mock/           # Mock interceptor for local development
└── ui/
    └── store/          # UI-only state (saving indicators, errors)
```

---

## License

[Apache 2.0](./LICENSE)
