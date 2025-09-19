# Local Development

## Setup

```bash
npm install
cp .env.example .env
cp services/user/.env.example services/user/.env
cp services/product/.env.example services/product/.env
cp services/order/.env.example services/order/.env
cp gateway/.env.example gateway/.env
```

Adjust secrets like `JWT_SECRET` and the seeded admin credentials in `services/user/.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) to your preference.

## Run Individual Services

Use npm workspaces to start each placeholder server:

```bash
npm run dev --workspace services/user
npm run dev --workspace services/product
npm run dev --workspace services/order
npm run dev --workspace gateway
```

Every service exposes `GET /healthz` for basic checks.

## Run Everything with Docker Compose

```bash
npm run compose:up
```

Exposed ports:

- User service: http://localhost:3001/healthz
- Product service: http://localhost:3002/healthz
- Order service: http://localhost:3003/healthz
- API Gateway: http://localhost:8080/healthz

Stop the stack with:

```bash
npm run compose:down
```

## Troubleshooting

- **Port already in use**: Stop the conflicting process or override ports in `.env`.
- **Database reset**: Remove the named volumes if you want a clean database.
  ```bash
  docker volume rm mini-ecommerce_user-db-data mini-ecommerce_product-db-data mini-ecommerce_order-db-data
  ```
