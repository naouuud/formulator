# Formulator

A web-based form builder for creating multi-page surveys and questionnaires. Add questions and notes, organise them across pages, and publish structured forms — all from a clean drag-and-drop-free interface.

> **Status:** Active development. Core builder is functional; renderer, validation UI, and publishing are in progress.

---

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Framework        | [Angular 21](https://angular.dev)                  |
| State management | [NgRx Signal Store](https://ngrx.io/guide/signals) |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com)         |
| Language         | TypeScript                                         |

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app runs at `http://localhost:4200` and uses a mock API layer by default — no backend required for local development.

---

## Project Structure

```
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
