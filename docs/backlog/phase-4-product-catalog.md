# Phase 4 – Product Catalog Backlog

## Summary
Implement the Product service schema, seeds, and read-only APIs for browsing products.

## Tickets

### Ticket P4-01: Product Schema & Migrations
- **Objective**: Create the `products` table and migration scripts.
- **Actions**:
  - Write migrations that create `products` with `id UUID`, `name`, `description`, `price NUMERIC(10,2)`, `created_at`, `updated_at`.
  - Add useful indexes (e.g., on `created_at`) for listing queries.
  - Expose `migrate:up`, `migrate:down`, `migrate:reset` scripts in `services/product/package.json`.
- **Owner**: You
- **Artifacts**: Migration files/config, package scripts.
- **Acceptance Criteria**:
  - [ ] `npm run migrate:up --workspace services/product` succeeds against local Postgres.
  - [ ] Rollback removes the table cleanly.
  - [ ] Compose startup runs migrations automatically.

### Ticket P4-02: Seed Sample Products
- **Objective**: Provide predictable catalog data for testing.
- **Actions**:
  - Create seed script inserting several products with realistic fields and prices.
  - Ensure seeds are idempotent using `ON CONFLICT`/UPSERT logic.
  - Document product IDs and descriptions in API docs for quick manual testing.
- **Owner**: You
- **Artifacts**: Seed files, package script `npm run seed --workspace services/product`.
- **Acceptance Criteria**:
  - [ ] Running seeds multiple times does not duplicate rows.
  - [ ] Products appear immediately when calling the GET endpoint.
  - [ ] Seed command integrated into compose workflow (manual or automatic).

### Ticket P4-03: Repository & Query Helpers
- **Objective**: Abstract DB access for listing and fetching products.
- **Actions**:
  - Implement repository functions `listProducts({ limit, offset })` and `getProductById(id)`.
  - Handle price serialization (string vs number) consistently.
  - Write unit tests mocking the DB client and covering empty and error cases.
- **Owner**: You
- **Artifacts**: Repository module, unit tests.
- **Acceptance Criteria**:
  - [ ] Repository returns DTOs suitable for API responses.
  - [ ] Errors use shared error classes (NotFound, DatabaseError, etc.).
  - [ ] Unit tests run in CI and pass reliably.

### Ticket P4-04: Public GET Endpoints
- **Objective**: Expose the read APIs defined in the PRD.
- **Actions**:
  - Build `GET /products` with optional pagination parameters and sensible defaults (e.g., latest first).
  - Build `GET /products/:id` returning single product or 404.
  - Validate query/params using existing validation helper library.
- **Owner**: You
- **Artifacts**: Route handlers, validation schemas, integration tests.
- **Acceptance Criteria**:
  - [ ] Endpoints return 200 with JSON payloads matching documented schema.
  - [ ] Invalid IDs or missing products return 404.
  - [ ] Integration tests cover success and error paths.

### Ticket P4-05: Docs & Compose Verification
- **Objective**: Document and verify the service via Compose.
- **Actions**:
  - Update `docker-compose.yml` to include the product service with env vars and DB dependency.
  - Add API docs in `docs/api/product-service.md` (request/response samples, query params).
  - Run Compose stack, hit endpoints via curl/Postman, and note results in the doc.
- **Owner**: You
- **Artifacts**: Compose updates, API doc entries.
- **Acceptance Criteria**:
  - [ ] Product service container starts cleanly in Compose.
  - [ ] Manual smoke test confirms endpoints behave as expected.
  - [ ] Documentation reflects actual responses.
