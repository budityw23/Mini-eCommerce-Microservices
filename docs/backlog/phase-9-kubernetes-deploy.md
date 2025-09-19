# Phase 9 – Kubernetes Deployment Backlog

## Summary
Deploy the stack to a local Kubernetes cluster (kind/minikube), wire the gateway entry point, and document the minimal steps needed to repeat the process.

## Tickets

### Ticket P9-01: Kubernetes Manifests
- **Objective**: Describe all runtime resources needed for the stack.
- **Actions**:
  - Create manifests for namespace, deployments, services, configmaps, and secrets for user, product, order, and gateway components.
  - Define StatefulSets + PVCs for each Postgres instance using the cluster's default StorageClass.
  - Organize files under `k8s/` with clear separation between base manifests and any overrides (optional Kustomize).
- **Owner**: You
- **Artifacts**: `k8s/**` manifests, optional Kustomize overlays.
- **Acceptance Criteria**:
  - [ ] `kubectl apply -k k8s/dev` (or `kubectl apply -f k8s/`) deploys all resources without errors.
  - [ ] ConfigMaps/Secrets provide the same env vars defined in `.env.example` files.
  - [ ] Services resolve each other via cluster DNS (verified via `kubectl exec` curl or port-forward).

### Ticket P9-02: Probes & Migrations
- **Objective**: Keep pods healthy and ensure DB migrations run inside the cluster.
- **Actions**:
  - Configure readiness and liveness probes hitting each service's `/healthz` route; add startup probe if migrations take time.
  - Wrap service deployments so migrations run before the app container starts (init container or entrypoint script).
  - Document probe thresholds and migration strategy in `docs/deployment.md`.
- **Owner**: You
- **Artifacts**: Deployment specs, init container scripts, documentation updates.
- **Acceptance Criteria**:
  - [ ] Pods become Ready only after migrations complete.
  - [ ] Failing readiness probe keeps pod out of service but does not crashloop indefinitely.
  - [ ] Deployment doc explains how probes and migrations work together.

### Ticket P9-03: Gateway Exposure
- **Objective**: Make the stack reachable from the host machine.
- **Actions**:
  - Create NodePort or Ingress resource (depending on cluster) pointing to the gateway service.
  - Document host/port combination or `/etc/hosts` entry required for access.
  - Update end-to-end script/env to target the Kubernetes URL when required.
- **Owner**: You
- **Artifacts**: Ingress/NodePort manifest, docs.
- **Acceptance Criteria**:
  - [ ] Hitting the gateway URL from host routes requests to the services successfully.
  - [ ] Unauthorized requests still blocked appropriately.
  - [ ] Docs outline how to tear down the exposure resource afterward.

### Ticket P9-04: Logging & Metrics Minimum
- **Objective**: Verify you can observe the system once deployed.
- **Actions**:
  - Confirm structured logs appear via `kubectl logs` with request IDs.
  - Optionally expose a `/metrics` endpoint (if using a library) and curl it inside the cluster.
  - Note future enhancements or limitations in `docs/observability.md`.
- **Owner**: You
- **Artifacts**: Observability doc update, optional metrics endpoint.
- **Acceptance Criteria**:
  - [ ] Logs from each service are readable and include request context.
  - [ ] If metrics implemented, endpoint returns counters without error; otherwise, doc states metrics are a future improvement.
  - [ ] Observability doc lists commands to fetch logs/metrics.

### Ticket P9-05: Kubernetes Smoke Test & Notes
- **Objective**: Validate the deployed cluster end to end and record the process.
- **Actions**:
  - Run the end-to-end script (Phase 7) against the gateway URL exposed by Kubernetes.
  - Capture any manual steps required (e.g., port-forward, waiting for pods) in `docs/deployment.md` under a "kind/minikube" section.
  - Tear down the cluster resources with `kubectl delete` and ensure cleanup commands documented.
- **Owner**: You
- **Artifacts**: Test log, deployment doc notes.
- **Acceptance Criteria**:
  - [ ] E2E script passes without manual database tweaks.
  - [ ] Deployment doc provides reproducible steps for future runs.
  - [ ] Cleanup command returns the cluster to a clean state.
