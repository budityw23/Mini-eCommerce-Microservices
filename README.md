# Mini eCommerce Monorepo

This repository hosts the user, product, order services and the API gateway for the mini eCommerce system described in the PRD.

## Getting Started

```bash
npm install
cp .env.example .env
cp services/user/.env.example services/user/.env
cp services/product/.env.example services/product/.env
cp services/order/.env.example services/order/.env
cp gateway/.env.example gateway/.env
```

The default user service configuration seeds an admin account using the credentials in `services/user/.env` (update them before running in shared environments).

## Useful Commands

- `npm run lint` – lint all workspaces.
- `npm run lint:fix` – fix lint issues where possible.
- `npm run format` – format check.
- `npm run format:write` – apply formatting.
- `npm test` – run the Jest suites.
- `npm run dev --workspace services/user` – run a service locally (swap workspace name as needed).
- `npm run compose:up` / `npm run compose:down` – start or stop the local Docker Compose stack.

## Workspace Layout

```
services/
  user/
  product/
  order/
gateway/
shared/
```

Each workspace exposes an Express server providing `GET /healthz` for smoke tests. The user service implements minimal auth endpoints (`/users/register`, `/users/login`, `/users/me`) backed by Postgres. The product service publishes catalog read endpoints (`/products`, `/products/:id`) plus admin-only write endpoints (`POST /products`, `PATCH /products/:id`) secured via JWT role claims. The order service exposes authenticated history via `GET /orders` and accepts new orders via `POST /orders`, validating the product against the product service before persisting. Core utilities for config loading, logging, and HTTP bootstrap live in the `shared` package.

## Docs

- [`docs/local-development.md`](docs/local-development.md)
- [`docs/standards.md`](docs/standards.md)
- [`docs/implementation strategy.md`](docs/implementation strategy.md)
