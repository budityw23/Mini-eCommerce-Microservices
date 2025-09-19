# Phase 2 – Local Runtime & Shared Utilities Backlog

## Summary
Build the Docker Compose stack, environment templates, and shared modules so every service boots locally with the same plumbing.

## Tickets

### Ticket P2-01: Docker Compose Stack
- **Objective**: Run all services and databases locally with one command.
- **Actions**:
  - Create `docker-compose.yml` defining `user-service`, `product-service`, `order-service`, `api-gateway`, and a Postgres container per service with named volumes.
  - Set up a shared bridge network and default ports; expose environment variables for DB connection strings.
  - Add npm scripts like `npm run compose:up` / `compose:down` (or a lightweight Makefile) to control the stack.
- **Owner**: You
- **Artifacts**: `docker-compose.yml`, optional `.env.docker`, helper scripts.
- **Acceptance Criteria**:
  - [ ] `docker compose up` boots all placeholder containers without crash loops.
  - [ ] Each service responds on `/healthz` while running in the stack.
  - [ ] README documents how to start/stop the stack.

### Ticket P2-02: Environment Templates
- **Objective**: Standardize configuration across services.
- **Actions**:
  - Add `.env.example` for root, each service, and the gateway listing required variables (DB creds, JWT secret, service URLs).
  - Document defaults for local development and note any secrets that must be supplied manually.
  - Update `.gitignore` so `.env` files stay out of source control.
- **Owner**: You
- **Artifacts**: `services/*/.env.example`, `gateway/.env.example`, README/config section.
- **Acceptance Criteria**:
  - [ ] Copying `.env.example` to `.env` gives a working local configuration.
  - [ ] Missing variables trigger clear startup errors (documented in troubleshooting notes).
  - [ ] Secrets are never committed to git.

### Ticket P2-03: Shared Utilities Package
- **Objective**: Reuse logging, error, config, and JWT helpers across services.
- **Actions**:
  - Create `shared/` workspace exporting logger, error classes, config loader, and JWT helper functions.
  - Configure TypeScript path aliases or Node module resolution so services can import from `@mini/shared` (or similar).
  - Write focused unit tests for each helper.
- **Owner**: You
- **Artifacts**: `shared/src/**`, `shared/__tests__/**`, updated workspace config.
- **Acceptance Criteria**:
  - [ ] Services import helpers without relative path hacks.
  - [ ] Logger outputs structured JSON including service name and request ID.
  - [ ] JWT helper passes sign/verify tests including failure cases.

### Ticket P2-04: Express Bootstrap & Healthchecks
- **Objective**: Give every service the same HTTP server baseline.
- **Actions**:
  - Build `createServer()` helper that plugs in body parser, request ID middleware, error handler, and `/healthz` route.
  - Use the helper inside user/product/order service entrypoints with service-specific metadata (name, version).
  - Document healthcheck contract in `docs/operations.md` for Compose and later Kubernetes.
- **Owner**: You
- **Artifacts**: `services/*/src/server.ts`, shared middleware, `docs/operations.md` updates.
- **Acceptance Criteria**:
  - [ ] `curl http://localhost:<port>/healthz` returns 200 and JSON payload for each service.
  - [ ] Error handling produces consistent response shape (status, code, message).
  - [ ] Healthcheck doc kept in sync with actual endpoints.

### Ticket P2-05: Local Dev Notes
- **Objective**: Capture how to run and debug the stack for future reference.
- **Actions**:
  - Write `docs/local-development.md` covering prerequisites, env setup, Compose commands, and running services directly with `npm run dev`.
  - Add quick troubleshooting tips (port already in use, resetting Postgres volume, etc.).
- **Owner**: You
- **Artifacts**: `docs/local-development.md`.
- **Acceptance Criteria**:
  - [ ] Following the doc from a clean clone results in a working stack.
  - [ ] Troubleshooting section covers the first issues you hit while testing the doc.
  - [ ] Doc linked from README for easy discovery.
