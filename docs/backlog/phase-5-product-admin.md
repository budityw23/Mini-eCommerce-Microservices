# Phase 5 – Product Admin Backlog

## Summary
Add the admin-only write APIs for the Product service and lock them down with role-based checks.

## Tickets

### Ticket P5-01: Role Claim Support
- **Objective**: Ensure JWTs expose the `role` needed for authorization checks.
- **Actions**:
  - Update user service login/register flow to embed `role` in the token payload.
  - Extend shared auth middleware to surface `req.user.role` with proper typing.
  - Add tests confirming admin vs regular tokens are distinguished.
- **Owner**: You
- **Artifacts**: User service auth handlers, shared middleware, unit tests.
- **Acceptance Criteria**:
  - [ ] Tokens issued during login include the `role` claim.
  - [ ] Middleware rejects missing/invalid tokens and exposes role for valid ones.
  - [ ] Unit tests cover admin and non-admin tokens.

### Ticket P5-02: POST /products (Admin Only)
- **Objective**: Allow admins to add products with strong validation.
- **Actions**:
  - Build route requiring admin role, validate payload (name, description, price >= 0).
  - Convert price to decimal format expected by DB and repository layer.
  - Return 201 with created product payload.
- **Owner**: You
- **Artifacts**: Route handler, validation schema, repository call, integration tests.
- **Acceptance Criteria**:
  - [ ] Non-admin requests receive 403.
  - [ ] Invalid payload returns 400 with helpful error messages.
  - [ ] Created product visible via GET endpoints immediately.

### Ticket P5-03: Optional PATCH /products/:id
- **Objective**: Provide a lightweight update endpoint if needed for demos.
- **Actions**:
  - Accept partial updates (name, description, price) with validation and admin check.
  - Reuse repository to persist changes and return updated entity.
  - Document endpoint as optional in API doc.
- **Owner**: You
- **Artifacts**: Route handler, validation schema, integration tests.
- **Acceptance Criteria**:
  - [ ] PATCH returns 200 with updated product.
  - [ ] 404 returned when product id is unknown.
  - [ ] Tests cover success, missing fields, unauthorized access.

### Ticket P5-04: Admin Logging
- **Objective**: Capture structured logs for catalog mutations.
- **Actions**:
  - Extend logger middleware to include `userId`, `role`, `action`, and `productId` for admin routes.
  - Emit logs at info level so they appear in Docker and Kubernetes outputs.
  - Document log format briefly in `docs/operations.md`.
- **Owner**: You
- **Artifacts**: Logging middleware update, documentation note.
- **Acceptance Criteria**:
  - [ ] Admin operations generate logs with consistent fields.
  - [ ] Log output verified during manual Compose smoke test.
  - [ ] Doc updated so you know what to expect when tailing logs later.

### Ticket P5-05: Authorization Tests & Docs
- **Objective**: Prove admin enforcement via automated tests and document usage.
- **Actions**:
  - Add integration tests verifying 403 for non-admin token and 201/200 for admin token across write endpoints.
  - Update Postman collection (or http file) with admin flows.
  - Expand `docs/api/product-service.md` with examples for create/update endpoints.
- **Owner**: You
- **Artifacts**: Integration tests, Postman/http file, API doc update.
- **Acceptance Criteria**:
  - [ ] CI executes the new tests with the rest of the suite.
  - [ ] Manual testing instructions include how to get an admin token.
  - [ ] API doc matches actual responses.
