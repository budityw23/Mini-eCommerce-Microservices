# Mini eCommerce Monorepo

This repository hosts the user, product, order services and the Nginx API gateway for the mini eCommerce system described in the PRD.

## Getting Started

```bash
npm install
```

### Useful Commands

- `npm run lint` – run ESLint across all workspaces.
- `npm run lint:fix` – fix lint errors where possible.
- `npm run format` – check formatting with Prettier.
- `npm run format:write` – format files in place.
- `npm test` – run the Jest test suite across all workspaces.
- `npm run dev --workspace services/user` – start the user service placeholder server (repeat for other services by swapping the workspace name).

## Workspace Layout

```
services/
  user/
  product/
  order/
gateway/
shared/
```

Each workspace currently exposes a placeholder HTTP server with a `/healthz` endpoint and a minimal test suite to confirm the tooling is wired correctly.

