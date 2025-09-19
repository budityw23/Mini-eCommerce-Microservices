# Implementation Strategy - Mini eCommerce Microservices

## Purpose
Provide a lean, technical roadmap to deliver the minimal eCommerce microservices described in the PRD. Each phase produces working code, tests, and deployment assets without extra process overhead.

## Context Snapshot
- Services: User, Product, Order (Node.js + Express) with dedicated PostgreSQL databases, fronted by an Nginx API gateway.
- Core flows: user registration/authentication, admin-managed products, users browsing products, users placing orders.
- Deployment targets: Local Docker Compose for development, Kubernetes for the final deployment proof.

## Phase Plan

### Phase 1 – Repository & Tooling Scaffold
**Goals**: Create a mono-repo structure and automation that keep all services consistent.
- Initialize `package.json` workspaces for `services/user`, `services/product`, `services/order`, `gateway`, and optional `shared` utilities.
- Install and configure ESLint, Prettier, TypeScript (or confirm plain JS) with shared configs.
- Add Jest (or preferred runner) with placeholder tests and coverage setup.
- Wire CI workflow (GitHub Actions or similar) to run install, lint, and tests on each push.

**Exit Checks**
- [ ] `npm install` at repo root installs all workspace dependencies.
- [ ] `npm run lint` and `npm test` succeed locally and in CI.
- [ ] README documents project layout and basic commands.

### Phase 2 – Local Runtime & Shared Modules
**Goals**: Make it easy to run the stack locally and share cross-cutting code.
- Author `docker-compose.yml` with placeholders for each service plus per-service Postgres instances.
- Provide `.env.example` files and document required environment variables.
- Build a `shared/` package for logger, error helpers, config loader, JWT utilities.
- Create Express server bootstrap with common middleware (request ID, JSON handling, error handler) and `/healthz` endpoint for each service.

**Exit Checks**
- [ ] `docker compose up` starts placeholder services and databases without errors.
- [ ] Services expose `/healthz` with basic JSON payload.
- [ ] Shared utilities import cleanly from each service without duplication.

### Phase 3 – User Service (Data + Auth API)
**Goals**: Implement persistence and authentication endpoints for the User service.
- Define migrations for `users` table with `id`, `username`, `password_hash`, `role`, timestamps.
- Add seed script for at least one admin and one regular user.
- Implement password hashing (bcrypt/argon2) and JWT sign/verify helpers.
- Build `POST /users/register`, `POST /users/login`, `GET /users/me` with validation and error handling.
- Cover helpers and routes with unit/integration tests using Supertest and test database.
- Update Docker Compose to run migrations/seeds automatically for the service.

**Exit Checks**
- [ ] All user endpoints return correct responses (positive and error cases) under automated tests.
- [ ] JWT middleware reusable by other services.
- [ ] Service Docker image builds and passes a smoke test (login + me).

### Phase 4 – Product Service (Catalog Foundations)
**Goals**: Deliver product catalog storage and read APIs.
- Create migrations for `products` table with name, description, price, timestamps.
- Seed sample products for local testing.
- Implement repository layer with optional pagination support.
- Build public `GET /products` and `GET /products/:id` endpoints with validation and serialization.
- Add Jest tests for repository and routes, and document API usage.
- Integrate Product service container into Compose with migrations/seeds on startup.

**Exit Checks**
- [ ] Product read endpoints tested and returning seeded data through Compose.
- [ ] Schema and endpoints documented in `docs/api/product-service.md`.
- [ ] Service healthcheck and logging consistent with User service.

### Phase 5 – Product Service (Admin Write APIs)
**Goals**: Enable admin-only catalog management.
- Ensure JWT payload from Phase 3 includes `role` claim and middleware exposes it.
- Implement `POST /products` (and optional `PATCH`/`DELETE`) requiring admin role, with strong payload validation.
- Add structured logs for admin actions (user ID, product ID, action).
- Extend tests to cover authorization failures and successful writes; update Postman collection.

**Exit Checks**
- [ ] Admin token required for write routes (403 for non-admin verified by tests).
- [ ] New products appear via GET endpoints after creation.
- [ ] Admin workflows documented with example curl/Postman requests.

### Phase 6 – Order Service (Data & Query)
**Goals**: Establish order persistence and retrieval for authenticated users.
- Create migrations for `orders` table with `user_id`, `product_id`, status, timestamps, and foreign keys.
- Implement repository for creating and listing orders (pagination-ready).
- Build `GET /orders` that returns orders for the authenticated user using shared auth middleware.
- Stub HTTP clients for User/Product services with configuration-driven base URLs.
- Add tests for repository, clients (mocked), and route handler.
- Integrate Order service container and database into Compose with migrations.

**Exit Checks**
- [ ] `GET /orders` requires valid JWT and returns only the caller's orders.
- [ ] Client stubs handle auth header forwarding and error mapping in tests.
- [ ] Compose stack starts all three services and databases concurrently without conflicts.

### Phase 7 – Order Creation & Gateway Integration
**Goals**: Complete cross-service workflow for placing orders and route traffic through Nginx.
- Implement `POST /orders` that validates input, verifies JWT, fetches product details, and persists the order.
- Handle downstream errors (missing product, service unavailable) with clear HTTP responses and minimal retry logic.
- Author Nginx configuration routing `/users`, `/products`, `/orders` to respective services and forward required headers.
- Create end-to-end test script covering register → login → list products → create order → list orders via gateway URL.
- Update documentation describing gateway usage and troubleshooting.

**Exit Checks**
- [ ] End-to-end tests pass locally (via Compose) hitting gateway endpoints only.
- [ ] Gateway blocks unauthorized requests and forwards trace/request IDs.
- [ ] Failure scenarios (invalid product, expired token) produce expected status codes in tests.

### Phase 8 – Container Hardening & Continuous Delivery
**Goals**: Prepare production-ready images and automation for builds/tests.
- Convert service Dockerfiles to multi-stage builds with non-root execution.
- Add healthcheck commands where applicable and reduce image size (e.g., `npm prune --production`).
- Update CI to build images on main branch and optionally push to local registry (if available).
- Document image build/publish commands in `docs/deployment.md`.

**Exit Checks**
- [ ] Docker images build cleanly with lint/test stages passing beforehand.
- [ ] Security scan (e.g., `docker scout` or `npm audit`) produces acceptable results or documented follow-ups.
- [ ] Deployment doc lists exact commands to build and run all images.

### Phase 9 – Kubernetes Deployment Minimal Viable Setup
**Goals**: Demonstrate the stack running in Kubernetes with basic observability.
- Create manifests (or Kustomize overlays) for namespace, deployments, services, and ConfigMaps/Secrets for each service plus Postgres.
- Configure PersistentVolumeClaims for databases (using hostPath or local-path provisioner for kind/minikube).
- Add readiness/liveness probes using `/healthz` endpoints and optional startup probes.
- Deploy to kind/minikube, run smoke tests through gateway Ingress/NodePort, and verify logs.
- Document deployment steps, teardown, and troubleshooting notes.

**Exit Checks**
- [ ] `kubectl apply` brings the stack up with all pods Ready and services reachable.
- [ ] Gateway URL serves the full happy path with the E2E script against the cluster.
- [ ] `docs/deployment.md` updated with Kubernetes instructions and known limitations.

## Master Checklist
- [ ] Repo scaffold, lint/test harness, and CI pipeline in place (Phase 1).
- [ ] Local Compose stack, env templates, and shared utilities ready (Phase 2).
- [ ] User service schema, auth endpoints, and tests complete (Phase 3).
- [ ] Product read APIs implemented with docs/tests (Phase 4).
- [ ] Product admin write APIs live with authorization enforcement (Phase 5).
- [ ] Order service data layer and GET endpoint finished (Phase 6).
- [ ] Order creation workflow and gateway integration validated end-to-end (Phase 7).
- [ ] Hardened Docker images and build automation ready (Phase 8).
- [ ] Kubernetes manifests deployed and verified via smoke tests (Phase 9).
- [ ] Documentation current for APIs, local setup, and deployment paths.

## Notes
- Keep scope tight: no payment processing, inventory, or advanced auth flows beyond the PRD.
- Prefer simple, explicit solutions (e.g., REST calls, direct SQL) before introducing extra infrastructure.
- Add tests alongside features to avoid late-stage stabilization work.
