# Phase 6 – Order Service Backlog

## Summary
Implement the Order service data model, repository, read API, and HTTP clients that other phases will build on.

## Tickets

### Ticket P6-01: Orders Schema & Migration
- **Objective**: Create the `orders` table with foreign keys to users and products.
- **Actions**:
  - Write migrations adding `orders(id UUID PK, user_id UUID FK, product_id UUID FK, status, created_at, updated_at)`.
  - Add indexes on `user_id` and `created_at` for list queries.
  - Expose migration scripts in `services/order/package.json` and hook them into Compose startup.
- **Owner**: You
- **Artifacts**: Migration files/config, package scripts, compose entrypoint.
- **Acceptance Criteria**:
  - [ ] `npm run migrate:up --workspace services/order` succeeds locally.
  - [ ] Foreign key constraints enforced (verified via integration test or manual check).
  - [ ] Compose run applies migrations automatically.

### Ticket P6-02: Optional Seed Orders
- **Objective**: Provide demo data for testing the read endpoint.
- **Actions**:
  - Seed a few historical orders linking seeded users/products.
  - Ensure idempotency and document sample IDs for smoke tests.
- **Owner**: You
- **Artifacts**: Seed script, documentation note.
- **Acceptance Criteria**:
  - [ ] Seeding works repeatedly without constraint violations.
  - [ ] Orders show up in GET endpoint once implemented.
  - [ ] Doc lists sample order ID/user/product combos.

### Ticket P6-03: Order Repository
- **Objective**: Abstract database access for future endpoints.
- **Actions**:
  - Implement `listOrdersByUser(userId, { limit, offset })` and `createOrder(orderData)` (creation used in Phase 7).
  - Handle pagination defaults and sorting by newest first.
  - Write unit tests mocking the DB adapter.
- **Owner**: You
- **Artifacts**: Repository module, unit tests.
- **Acceptance Criteria**:
  - [ ] Repository functions return DTOs without leaking raw DB rows.
  - [ ] Errors use shared classes for not-found and validation.
  - [ ] Unit tests cover empty results and invalid parameters.

### Ticket P6-04: GET /orders Endpoint
- **Objective**: Allow authenticated users to view their own orders.
- **Actions**:
  - Implement route using shared auth middleware to require a valid JWT.
  - Use repository to fetch orders by `req.user.id`, return paginated response with metadata (count, limit, offset).
  - Add integration tests covering success, unauthorized, and empty list scenarios.
- **Owner**: You
- **Artifacts**: Route handler, validation schema, integration tests.
- **Acceptance Criteria**:
  - [ ] Unauthorized requests receive 401.
  - [ ] Authenticated requests return only that user's orders.
  - [ ] Integration tests run in CI and pass.

### Ticket P6-05: HTTP Client Stubs
- **Objective**: Prepare order service for cross-service calls in the next phase.
- **Actions**:
  - Create client modules for User and Product services (e.g., `getProduct(productId)`), reading base URLs from env vars.
  - Forward Authorization header where relevant and normalize error responses.
  - Write unit tests stubbing HTTP layer.
- **Owner**: You
- **Artifacts**: Client modules, config, unit tests.
- **Acceptance Criteria**:
  - [ ] Clients handle success, 4xx, and 5xx responses according to shared error scheme.
  - [ ] Environment variables documented in `.env.example` for order service.
  - [ ] Tests validate header forwarding and error mapping.

### Ticket P6-06: Compose Integration & Docs
- **Objective**: Boot the Order service inside the existing stack and document the basics.
- **Actions**:
  - Add service definition + Postgres container to `docker-compose.yml` with proper dependencies.
  - Document commands, ports, and healthcheck in `services/order/README.md`.
  - Run Compose stack end to end and verify `/healthz` and `GET /orders` responses manually.
- **Owner**: You
- **Artifacts**: Compose updates, README updates, manual test notes.
- **Acceptance Criteria**:
  - [ ] Compose boot includes Order service without errors.
  - [ ] Manual smoke test confirms endpoint works with seeded data or empty response.
  - [ ] Documentation matches what you just ran.
