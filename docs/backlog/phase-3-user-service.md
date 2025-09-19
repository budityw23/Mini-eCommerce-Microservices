# Phase 3 – User Service Backlog

## Summary
Deliver the User service end to end: database schema, auth helpers, REST endpoints, tests, and compose integration.

## Tickets

### Ticket P3-01: User Schema & Migration Commands
- **Objective**: Create the `users` table and migration tooling.
- **Actions**:
  - Implement migrations (Knex/Prisma/Drizzle etc.) creating `users` table with fields `id UUID PK`, `username UNIQUE`, `password_hash`, `role`, `created_at`, `updated_at`.
  - Add npm scripts `migrate:up`, `migrate:down`, and `migrate:reset` to `services/user/package.json`.
  - Ensure migrations run inside Docker Compose on container start (entrypoint or command wrapper).
- **Owner**: You
- **Artifacts**: Migration files, migration config, updated package scripts.
- **Acceptance Criteria**:
  - [ ] `npm run migrate:up --workspace services/user` succeeds against local Postgres.
  - [ ] Rollback command drops the table without manual SQL.
  - [ ] Compose startup runs migrations automatically.

### Ticket P3-02: Seed Admin & Demo Users
- **Objective**: Populate predictable users for testing.
- **Actions**:
  - Create seed script inserting at least one admin and one regular user with hashed passwords.
  - Make seed idempotent (skip/UPSERT existing usernames).
  - Document seeded credentials in `docs/local-development.md`.
- **Owner**: You
- **Artifacts**: Seed files, package script `npm run seed --workspace services/user`.
- **Acceptance Criteria**:
  - [ ] Running the seed twice does not duplicate users.
  - [ ] Admin records include `role = 'admin'`.
  - [ ] Compose flow can trigger seeds when needed (manual or automatic).

### Ticket P3-03: Security Helpers (Password + JWT)
- **Objective**: Provide reusable security utilities.
- **Actions**:
  - Implement `hashPassword`, `verifyPassword` using bcrypt/argon2 with configurable salt rounds.
  - Implement `issueToken`, `verifyToken` in the shared package with issuer/audience/expiry pulled from config.
  - Unit test helper functions including invalid/expired token paths.
- **Owner**: You
- **Artifacts**: `shared/src/security/**`, tests in `shared/__tests__`.
- **Acceptance Criteria**:
  - [ ] Password helper rejects weak passwords with validation errors (min length documented).
  - [ ] JWT helper throws custom errors for invalid or expired tokens.
  - [ ] Test coverage for helpers ≥80%.

### Ticket P3-04: Auth Routes Implementation
- **Objective**: Build `POST /users/register`, `POST /users/login`, `GET /users/me`.
- **Actions**:
  - Add request validation (Joi/Zod/custom) ensuring username/password meet requirements.
  - Register route should hash password, persist user via repository, and return sanitized payload (no hash) plus optional token.
  - Login route verifies credentials and issues JWT with user id + role claim.
  - `GET /users/me` uses auth middleware to return the current user's profile.
- **Owner**: You
- **Artifacts**: Route handlers, validation schemas, middlewares.
- **Acceptance Criteria**:
  - [ ] Invalid payloads return 400 with readable error message.
  - [ ] Wrong credentials return 401 without leaking details.
  - [ ] Successful requests return expected JSON contract documented in API doc.

### Ticket P3-05: Auth Middleware Export
- **Objective**: Make JWT verification reusable by other services.
- **Actions**:
  - Implement middleware that reads `Authorization` header, verifies token, attaches `{ id, role }` to `req.user`.
  - Export middleware from shared package so other services can import it.
  - Add tests covering missing header, invalid token, expired token, and success.
- **Owner**: You
- **Artifacts**: Shared middleware module, tests, updated exports.
- **Acceptance Criteria**:
  - [ ] Middleware rejects unauthenticated requests with 401.
  - [ ] Successful requests expose `req.user` typed for TypeScript (if used).
  - [ ] Other services can import without circular dependency warnings.

### Ticket P3-06: Integration Tests & Compose Verification
- **Objective**: Prove the service works via automated tests and Compose smoke runs.
- **Actions**:
  - Write Supertest (or equivalent) suite covering register, login, me happy paths and failure cases.
  - Reset DB between tests using migrations/transactions.
  - Run service inside Docker Compose, hit endpoints via `curl` or Postman, and document results.
- **Owner**: You
- **Artifacts**: Integration test files, updated `package.json` test scripts, doc snippets in `docs/api/user-service.md`.
- **Acceptance Criteria**:
  - [ ] `npm test --workspace services/user` passes locally and in CI.
  - [ ] Compose smoke test script recorded in docs with sample commands.
  - [ ] API doc includes request/response examples for all three endpoints.
