# Phase 7 – Order Creation & Gateway Backlog

## Summary
Finish the order creation workflow, connect services through REST calls, configure the Nginx gateway, and validate the whole flow end to end.

## Tickets

### Ticket P7-01: POST /orders Endpoint
- **Objective**: Allow authenticated users to place an order.
- **Actions**:
  - Validate request body (`productId`) and use shared auth middleware to ensure JWT is present.
  - Call Product client to confirm the product exists (and optionally fetch price/name for the response).
  - Persist the order via repository and return 201 with order details.
- **Owner**: You
- **Artifacts**: Route handler, validation schema, integration tests.
- **Acceptance Criteria**:
  - [ ] Missing/invalid token returns 401 and never hits the repository.
  - [ ] Invalid product returns 404 (based on Product service response).
  - [ ] Successful orders return JSON containing order id, product id, timestamp, and user id.

### Ticket P7-02: Cross-Service Error Handling
- **Objective**: Keep failure modes predictable when downstream services misbehave.
- **Actions**:
  - Map Product/User client errors to meaningful HTTP status codes.
  - Add minimal retry/backoff (single retry) for transient 502/503 responses with log output.
  - Surface correlation/request IDs in logs for debugging (reuse middleware from Phase 2).
- **Owner**: You
- **Artifacts**: Client modules, logging updates, tests.
- **Acceptance Criteria**:
  - [ ] Unit tests cover success, 404, and retry scenarios.
  - [ ] Logs show request ID and downstream status when failures occur.
  - [ ] Business errors (invalid product) bubble up with correct HTTP code.

### Ticket P7-03: Nginx Gateway Configuration
- **Objective**: Route all traffic through the gateway entry point.
- **Actions**:
  - Write `gateway/nginx.conf` mapping `/users`, `/products`, `/orders` to the respective services.
  - Forward headers: `Authorization`, `X-Request-ID`, `X-Forwarded-For`.
  - Add Compose service for gateway and hook into CI with `nginx -t` validation.
- **Owner**: You
- **Artifacts**: Nginx config, compose updates, CI step.
- **Acceptance Criteria**:
  - [ ] Requests sent to gateway are routed correctly in Compose environment.
  - [ ] Unauthorized requests to protected paths yield 401.
  - [ ] `nginx -t` passes locally and in CI.

### Ticket P7-04: End-to-End Test Script
- **Objective**: Automate the main user journey end to end.
- **Actions**:
  - Write script (Jest + supertest, newman, or lightweight Node script) that performs: register → login → list products → create order → list orders.
  - Point the script at the gateway base URL.
  - Integrate the script into CI (optional initially) and document how to run locally.
- **Owner**: You
- **Artifacts**: E2E script, optional CI job, documentation snippet.
- **Acceptance Criteria**:
  - [ ] Script passes locally against Compose stack.
  - [ ] Script covers at least one failure path (e.g., invalid product id) asserting correct status.
  - [ ] Instructions for running the script recorded in `docs/testing.md`.

### Ticket P7-05: Gateway Smoke Checklist
- **Objective**: Capture quick manual steps for verifying routing and auth.
- **Actions**:
  - Create checklist with curl/Postman commands for success and error cases per route.
  - Note common troubleshooting tips (e.g., restart order service if HTTP 502).
  - Store checklist in `docs/operations.md` alongside gateway notes.
- **Owner**: You
- **Artifacts**: Smoke checklist doc updates.
- **Acceptance Criteria**:
  - [ ] Checklist validated once during Compose run and boxes ticked.
  - [ ] Troubleshooting section includes at least one real issue encountered while testing.
  - [ ] Doc linked from README or deployment notes for easy access.
