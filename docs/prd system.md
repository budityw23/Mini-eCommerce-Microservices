# Product Requirements Document (PRD)

## Project
Mini eCommerce Microservices (User, Product, Order)

**Tech Stack**: Node.js (Express), PostgreSQL (one DB per service), Docker, Kubernetes, Nginx (API Gateway)

---

## 1. Objective
Build a minimal microservices-based eCommerce system for learning purposes. The system allows:
- Users to register and log in.
- Admins to create products.
- Users to browse products.
- Users to place orders.

Focus is on demonstrating service isolation, communication, and deployment with Docker + Kubernetes.

---

## 2. Scope
### In Scope
- User Service: Authentication, JWT, user management.
- Product Service: CRUD operations for products.
- Order Service: Place orders, view user orders.
- API Gateway (Nginx): Route requests to the right service.
- Containerization (Docker).
- Kubernetes deployments.

### Out of Scope
- Payment gateway integration.
- Inventory/stock management.
- Advanced security (OAuth, RBAC).
- Complex order flows.

---

## 3. Functional Requirements

### User Service
**Endpoints**
- `POST /users/register` → Create user.
- `POST /users/login` → Authenticate, return JWT.
- `GET /users/me` → Return profile (JWT required).

**Database (users)**
- `id (uuid)`
- `username (string)`
- `password (hashed string)`

---

### Product Service
**Endpoints**
- `POST /products` → Add product (admin-only).
- `GET /products` → List all products.
- `GET /products/:id` → Get single product.

**Database (products)**
- `id (uuid)`
- `name (string)`
- `price (decimal)`
- `created_at (timestamp)`

---

### Order Service
**Endpoints**
- `POST /orders` → Create new order. Requires JWT.
  - Calls User Service to validate JWT.
  - Calls Product Service to check product exists.
- `GET /orders` → Get orders of logged-in user.

**Database (orders)**
- `id (uuid)`
- `user_id (uuid)`
- `product_id (uuid)`
- `created_at (timestamp)`

---

## 4. Non-Functional Requirements
- **Security**: JWT for authentication.
- **Scalability**: Services run independently, scale in Kubernetes.
- **Resilience**: Services fail independently.
- **Observability**: Logs per service (stdout).

---

## 5. Architecture Overview

**Components**
- User Service (Node.js + Postgres)
- Product Service (Node.js + Postgres)
- Order Service (Node.js + Postgres)
- API Gateway (Nginx)
- Kubernetes cluster

**Communication**
- Inter-service communication via REST (ClusterIP in Kubernetes).
- Example: Order Service → Product Service: `http://product-service/products/:id`.

---

## 6. Deployment

### Docker
- Each service has its own `Dockerfile`.
- `docker-compose.yaml` for local development.

### Kubernetes
- **Namespace:** `mini-ecommerce`
- **Deployments:** user, product, order, api-gateway
- **Services:** ClusterIP for internal, NodePort/Ingress for external
- **Postgres:** StatefulSet per service with Persistent Volume
- **API Gateway (Nginx):** Ingress routes:
  - `/users/*` → User Service
  - `/products/*` → Product Service
  - `/orders/*` → Order Service

---

## 7. Example User Flow
1. User registers (`POST /users/register`).
2. User logs in → receives JWT.
3. User lists products (`GET /products`).
4. User creates order (`POST /orders` with JWT + product_id).
5. Order service validates and saves order.
