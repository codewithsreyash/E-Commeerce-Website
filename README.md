# Shopping Admin System

For full-stack public hosting with HTTPS, see [DEPLOYMENT.md](DEPLOYMENT.md).
For hosting the complete application on Render, see [DEPLOY-RENDER.md](DEPLOY-RENDER.md).

Production-ready shopping administration platform built with Spring Boot 3.1.5, plain JDBC, MySQL, React, Vite, Tailwind CSS, and shadcn-style UI components.

## Architecture

```text
┌───────────────┐      JWT + JSON       ┌─────────────────────┐      JDBC       ┌─────────────────────┐
│ React + Vite  │  ─────────────────▶  │ Spring Boot API     │  ───────────▶  │ MySQL 8            │
│ Tailwind UI   │  ◀─────────────────  │ Security + Services │  ◀───────────  │ shopping_system    │
│ Recharts      │                      │ Validation + Docs   │                │ schema + indexes   │
└───────────────┘                      └─────────────────────┘                └─────────────────────┘
        │                                         │
        └──────────── Docker / Compose ───────────┘
```

## Highlights

- JWT authentication with `/api/auth/login` and `/api/auth/register`
- Spring Security route protection for `/api/**`
- Global validation and structured JSON error handling
- Pageable list APIs with sorting and filtering
- Dashboard analytics endpoint with SQL aggregations
- Tailwind + shadcn-inspired responsive admin UI
- Axios auth interceptor, protected routes, skeleton loading, and toast feedback
- Swagger UI at `/swagger-ui.html`
- Actuator health and info endpoints
- Dockerized MySQL, backend, and frontend services

## Project Structure

```text
.
├── backend/        Spring Boot API, security, services, tests, Dockerfile
├── frontend/       React app, Tailwind UI, charts, lint config, Dockerfile
├── db/             MySQL schema and seed scripts
├── docker-compose.yml
└── .env.example
```

## Environment Variables

Copy `.env.example` to `.env` and adjust values before local or Docker runs.

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | Yes | JDBC connection string for the Spring Boot backend |
| `DB_USERNAME` | Yes | Database username used by the backend |
| `DB_PASSWORD` | Yes | Database password used by MySQL and the backend |
| `MYSQL_HOST_PORT` | No | Host port published by the Docker MySQL container; use `3307` if local MySQL already occupies `3306` |
| `JWT_SECRET` | Yes | Base64-encoded JWT signing secret that decodes to at least 32 bytes |
| `JWT_EXPIRATION_MS` | Yes | JWT lifetime in milliseconds |
| `CORS_ALLOWED_ORIGIN` | No | Allowed frontend origin for credentialed CORS requests; defaults to `http://localhost:5173` |
| `ADMIN_USERNAME` | Yes | Seeded admin username created on startup when missing |
| `ADMIN_PASSWORD` | Yes | Seeded admin password created on startup when missing |

## Local Development

### 1. Database

Run the SQL files in order:

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/data.sql
```

### 2. Backend

Set environment variables, then start the API from `backend/`.

```bash
cd backend
mvn spring-boot:run
```

Default backend URL: `http://localhost:8081`

Public endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /swagger-ui.html`
- `GET /actuator/health`
- `GET /actuator/info`

The app seeds an admin user on startup when the configured username does not already exist.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Docker

Build and run the full stack:

```bash
docker compose --env-file .env up --build
```

Service URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- MySQL: `localhost:${MYSQL_HOST_PORT}` (defaults to `3306`, set `3307` to avoid a local MySQL conflict)

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `POST` | `/api/auth/register` | Register a customer and receive JWT; privileged roles are rejected |
| `GET` | `/api/dashboard/stats` | Revenue, order status totals, top products, KPI trends |
| `GET` | `/api/products` | Paginated products with category and price filters |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |
| `GET` | `/api/orders` | Paginated orders with status and date filters |
| `GET` | `/api/orders/revenue` | Revenue summary for selected date range |
| `POST` | `/api/orders` | Create order |
| `PUT` | `/api/orders/{id}` | Update order status/details |
| `DELETE` | `/api/orders/{id}` | Delete order |
| `GET` | `/api/customers` | Paginated customers with search |
| `POST` | `/api/customers` | Create customer |
| `PUT` | `/api/customers/{id}` | Update customer |
| `DELETE` | `/api/customers/{id}` | Delete customer |
| `GET` | `/api/sellers` | Paginated sellers |
| `POST` | `/api/sellers` | Create seller |
| `GET` | `/api/payments/{orderId}` | Fetch payment by order |
| `POST` | `/api/payments` | Create payment |
| `GET` | `/api/reviews/{productId}` | Paginated product reviews |
| `POST` | `/api/reviews` | Create review |

## Quality Checks

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
mvn test
```

Note: this workspace currently does not include a Maven wrapper, so a local Maven installation is required.

## Screenshot Placeholders

- `[Login Page Screenshot]`
- `[Dashboard Screenshot]`
- `[Products Page Screenshot]`
- `[Orders Page Screenshot]`
- `[Customers Page Screenshot]`
