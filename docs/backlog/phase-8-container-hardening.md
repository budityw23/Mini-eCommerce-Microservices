# Phase 8 – Container Hardening Backlog

## Summary
Polish Docker images and CI workflows so builds are predictable, secure enough for demos, and ready to ship to a registry.

## Tickets

### Ticket P8-01: Multi-Stage Dockerfiles
- **Objective**: Optimize service Docker images for size and security.
- **Actions**:
  - Convert each service Dockerfile to a multi-stage build (dependencies → build → runtime).
  - Ensure runtime image runs as non-root user and only contains production dependencies.
  - Add healthcheck commands where useful.
- **Owner**: You
- **Artifacts**: Updated Dockerfiles under `services/*/Dockerfile` and `gateway/Dockerfile`.
- **Acceptance Criteria**:
  - [ ] `docker build` succeeds for each service using new Dockerfiles.
  - [ ] Final image size reduced vs initial version (document numbers in commit message or notes).
  - [ ] Containers start successfully using new images in Compose.

### Ticket P8-02: Build Scripts & CI Updates
- **Objective**: Automate image builds alongside lint/tests.
- **Actions**:
  - Add npm scripts (or Make targets) to build all service images with consistent tags (e.g., `mini-<service>:local`).
  - Update CI workflow to optionally build images on main branch and run `docker build --pull` to catch issues early.
  - Cache Docker layers if CI supports it.
- **Owner**: You
- **Artifacts**: Build scripts, CI workflow changes.
- **Acceptance Criteria**:
  - [ ] Running the build script locally produces all service images with expected tags.
  - [ ] CI job builds at least one image and fails if Docker build fails.
  - [ ] Documentation notes how to run the build script manually.

### Ticket P8-03: Basic Image Scanning
- **Objective**: Catch obvious dependency or OS vulnerabilities.
- **Actions**:
  - Run `docker scout` / `docker scan` / `trivy` (pick one available) against built images.
  - Record any high/critical findings and either patch or document follow-up tasks.
  - Add optional scan step to CI (can be allow-fail if tooling is noisy).
- **Owner**: You
- **Artifacts**: Scan reports, CI step (optional), notes in repo.
- **Acceptance Criteria**:
  - [ ] Scan executed at least once per service and results documented (even if accepted risk for now).
  - [ ] Updated dependency versions if easy wins are identified.
  - [ ] Instructions added to `docs/deployment.md` on how to rerun scans.

### Ticket P8-04: Runtime Configuration Audit
- **Objective**: Confirm containers read config/environment variables consistently.
- **Actions**:
  - Verify each Dockerfile/entrypoint loads env vars from Compose/Kubernetes defaults.
  - Ensure secrets like JWT keys are only read from env, not hardcoded.
  - Document required runtime variables in `docs/deployment.md`.
- **Owner**: You
- **Artifacts**: Dockerfiles, entrypoint scripts, deployment doc updates.
- **Acceptance Criteria**:
  - [ ] Each service starts with only documented env vars (no surprises).
  - [ ] Missing env var surfaces a clear error message.
  - [ ] Deployment doc lists required env vars per service.

### Ticket P8-05: Compose Regression Test
- **Objective**: Re-run the Compose stack using new images to confirm nothing regressed.
- **Actions**:
  - Rebuild images, run `docker compose up` using those images (may need `--build`).
  - Execute the end-to-end script from Phase 7 to confirm functionality.
  - Capture notes on runtime performance or differences.
- **Owner**: You
- **Artifacts**: Test log, short note in docs/testing or commit message.
- **Acceptance Criteria**:
  - [ ] Compose stack works using hardened images.
  - [ ] E2E script still passes.
  - [ ] Any regressions logged as TODOs for follow-up.
