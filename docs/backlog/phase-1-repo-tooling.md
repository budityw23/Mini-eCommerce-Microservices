# Phase 1 – Repo & Toolchain Scaffold Backlog

## Summary
Stand up the mono-repo, shared tooling, and automation so every service has the same developer experience from the first commit.

## Tickets

### Ticket P1-01: Create Workspace Structure
- **Objective**: Lay out the repo to host all services and shared utilities.
- **Actions**:
  - Add directories `services/user`, `services/product`, `services/order`, `gateway`, and `shared`.
  - Initialize root `package.json` with npm workspaces pointing at those packages.
  - Drop minimal `package.json` files in each package with scripts `dev`, `start`, `lint`, and `test` calling placeholders.
- **Owner**: You
- **Artifacts**: Root `package.json`, service `package.json` files, workspace config, updated README layout section.
- **Acceptance Criteria**:
  - [ ] `npm install` at the root installs dependencies for every workspace.
  - [ ] `npm run dev --workspace services/user` (and other services) runs a placeholder server without crashing.
  - [ ] README lists the directory structure and workspace usage.

### Ticket P1-02: Shared Linting & Formatting
- **Objective**: Enforce one lint/format pipeline across the repo.
- **Actions**:
  - Install ESLint + Prettier (or chosen alternatives) with configs stored at the root.
  - If using TypeScript, add `tsconfig.base.json` and per-service `tsconfig.json` extending it; if staying in JS, document that choice.
  - Wire root scripts `npm run lint` and `npm run format` to run against all workspaces.
- **Owner**: You
- **Artifacts**: `.eslintrc.*`, `.prettierrc`, optional `tsconfig.base.json`, updated scripts.
- **Acceptance Criteria**:
  - [ ] `npm run lint` succeeds across all packages.
  - [ ] Formatting rules documented briefly in `docs/standards.md` (or README section).
  - [ ] Optional: git hook via Husky/lint-staged runs lint/format on staged files.

### Ticket P1-03: Test Harness Baseline
- **Objective**: Make sure every service can execute unit tests from day one.
- **Actions**:
  - Install Jest (or preferred runner) with a shared config at the root.
  - Add one placeholder test per service to confirm wiring.
  - Add `npm test` script at root invoking the workspace tests.
- **Owner**: You
- **Artifacts**: `jest.config.js`, placeholder tests like `services/user/__tests__/placeholder.test.ts`.
- **Acceptance Criteria**:
  - [ ] `npm test` passes locally with placeholder suites.
  - [ ] Coverage reporting configured (even if thresholds are `TODO`).
  - [ ] Instructions for running tests documented in README.

### Ticket P1-04: Continuous Integration Skeleton
- **Objective**: Automatically run install, lint, and tests on push/PR.
- **Actions**:
  - Create `.github/workflows/ci.yml` (or equivalent for chosen CI) with steps: checkout, setup Node, install deps, lint, test.
  - Enable dependency caching to keep pipeline fast.
  - Add badge or status note in README if desired.
- **Owner**: You
- **Artifacts**: CI workflow file, optional status badge in README.
- **Acceptance Criteria**:
  - [ ] CI passes on the default branch using placeholder commands.
  - [ ] Pipeline runs automatically on pull requests and pushes to main.
  - [ ] Failing lint/test causes CI to fail.

### Ticket P1-05: Minimal Standards Doc
- **Objective**: Capture the essentials for future you (or contributors) in one place.
- **Actions**:
  - Write `docs/standards.md` (or README section) summarizing coding style, lint/test commands, and branch expectations.
  - Add a short PR template in `.github/pull_request_template.md` to remind yourself to link tests and docs.
- **Owner**: You
- **Artifacts**: `docs/standards.md`, `.github/pull_request_template.md`.
- **Acceptance Criteria**:
  - [ ] Standards doc committed alongside tooling updates.
  - [ ] PR template auto-populates in GitHub when opening a PR.
  - [ ] Doc references stay up to date with the tooling choices above.
