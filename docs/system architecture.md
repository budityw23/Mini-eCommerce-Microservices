                  ┌────────────────────┐
                  │   Client (API)     │
                  │  (Browser / Postman│
                  └─────────┬──────────┘
                            │
                     ┌──────▼──────┐
                     │  Nginx API  │
                     │   Gateway   │
                     └───┬───┬───┬─┘
                         │   │   │
      ┌──────────────────┘   │   └─────────────────┐
      │                      │                     │
┌─────▼──────┐        ┌─────▼──────┐       ┌──────▼──────┐
│ User       │        │ Product    │       │ Order       │
│ Service    │        │ Service    │       │ Service     │
│ (Node.js)  │        │ (Node.js)  │       │ (Node.js)   │
└─────┬──────┘        └─────┬──────┘       └──────┬──────┘
      │                     │                    │
┌─────▼─────┐         ┌─────▼─────┐        ┌─────▼─────┐
│ Postgres  │         │ Postgres  │        │ Postgres   │
│ users_db  │         │ products_db│       │ orders_db  │
└───────────┘         └───────────┘        └───────────┘

[ Kubernetes ]
- Each box (service + DB) runs in its own Deployment/Pod
- Nginx handles routing (/users/*, /products/*, /orders/*)
- ClusterIP services for inter-service communication
