# Kubernetes Deployment (Minimal)

1. Build images locally and tag them to match the manifests. Example:
   ```bash
   docker build -t mini-ecommerce-user:latest services/user
   docker build -t mini-ecommerce-product:latest services/product
   docker build -t mini-ecommerce-order:latest services/order
   docker build -t mini-ecommerce-gateway:latest gateway
   ```

2. Create the namespace and supporting resources:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/secret.yaml
   ```

3. Apply database and service deployments:
   ```bash
   kubectl apply -f k8s/user-postgres.yaml
   kubectl apply -f k8s/product-postgres.yaml
   kubectl apply -f k8s/order-postgres.yaml
   kubectl apply -f k8s/user-service.yaml
   kubectl apply -f k8s/product-service.yaml
   kubectl apply -f k8s/order-service.yaml
   kubectl apply -f k8s/gateway.yaml
   ```

4. Verify pods:
   ```bash
   kubectl get pods -n mini-ecommerce
   ```

5. Forward the gateway service for local testing if you do not have an ingress controller:
   ```bash
   kubectl port-forward svc/api-gateway -n mini-ecommerce 8080:80
   ```

6. Hit the gateway endpoints just as you do locally (e.g., `http://localhost:8080/products`).

All manifests use in-memory storage (`emptyDir`) for Postgres and expect the shared JWT secret to stay in `k8s/secret.yaml`. Adjust as needed for production environments.
