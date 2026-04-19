# Shopping Admin System - Project Documentation

## 1. Project Overview

This is a **full-stack e-commerce platform** with a dual-interface design:
- **Admin Dashboard** - For administrators and managers to manage products, orders, customers, and view analytics
- **Customer Storefront** - For customers to browse products, add to cart, checkout, and manage their accounts

The system supports two types of users:
- **Admins/Managers** - Access the admin dashboard to manage the entire system
- **Customers** - Shop on the storefront, place orders, and manage their profiles

---

## 2. Technologies Used

### Backend (Java Spring Boot)

| Technology | Purpose |
|------------|---------|
| **Spring Boot 3.1.5** | Main application framework |
| **Spring Security** | Authentication and authorization |
| **JWT (JSON Web Tokens)** | Stateless authentication mechanism |
| **Spring JDBC** | Database access layer (no ORM - plain SQL) |
| **MySQL 8** | Relational database for data persistence |
| **Spring Validation** | Request validation |
| **Spring Actuator** | Health checks and monitoring |
| **SpringDoc OpenAPI** | API documentation (Swagger UI) |
| **jjwt** | JWT token generation and validation |

### Frontend (React)

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router DOM v6** | Client-side routing |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Axios** | HTTP client for API calls |
| **Recharts** | Charts and data visualization |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **clsx + tailwind-merge** | Conditional class name handling |

### Infrastructure & DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-service orchestration |
| **Maven** | Java build and dependency management |
| **npm** | Node.js package management |
| **ESLint + Prettier** | Code linting and formatting |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────┬───────────────────────────────────────────┤
│       Admin Dashboard           │          Customer Storefront              │
│    (React + Tailwind + Charts)  │     (React + Tailwind + Router)           │
│                                 │                                           │
│  • Dashboard with analytics     │  • Product catalog browsing               │
│  • Product management           │  • Shopping cart                          │
│  • Order management             │  • Checkout flow                          │
│  • Customer management          │  • Order history                          │
│  • User management              │  • Account settings                       │
└──────────────┬──────────────────┴───────────────────┬───────────────────────┘
               │                                      │
               │         JWT Authentication           │
               │         (Bearer Token)               │
               │                                      │
               └──────────────────┬─────────────────┘
                                  │
                        ┌─────────▼──────────┐
                        │   Spring Boot API    │
                        │   (Port 8081)        │
                        │                      │
                        │  • Controllers       │
                        │  • Services          │
                        │  • Repositories      │
                        │  • Security Config   │
                        └─────────┬────────────┘
                                  │
                        ┌─────────▼──────────┐
                        │   JDBC + MySQL 8     │
                        │   (Port 3306)        │
                        │                      │
                        │  • 7 Core Tables     │
                        │  • Proper FKs        │
                        │  • Optimized Indexes │
                        └──────────────────────┘
```

---

## 4. Database Schema

The database consists of **7 core tables** with proper foreign key relationships:

### Tables Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| **users** | System administrators and managers | - |
| **customers** | Registered customers | - |
| **sellers** | Product vendors/sellers | - |
| **products** | Product catalog | → sellers |
| **orders** | Customer orders | → customers |
| **order_items** | Individual items in orders | → orders, → products |
| **payments** | Payment records | → orders |
| **reviews** | Product reviews | → products, → customers |

### ER Diagram Relationships

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   sellers   │────<│  products   │>────│   reviews   │
│  (vendors)  │ 1:M │  (catalog)  │ 1:M  │  (ratings)  │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │
                           │             ┌─────┘
                           │             │
                    ┌──────▼──────┐     ┌▼────────────┐
                    │ order_items │     │  customers  │
                    │ (line items)│     │  (shoppers) │
                    └──────┬──────┘     └──────┬──────┘
                           │                    │
                           └────────┬───────────┘
                                    │
                             ┌──────▼──────┐     ┌─────────────┐
                             │    orders   │────<│   payments  │
                             │  (purchases)│ 1:M │ (transactions│
                             └─────────────┘     └─────────────┘
```

### Key Design Decisions

- **ON DELETE RESTRICT** on products and customers to preserve order history
- **ON DELETE CASCADE** on order_items and payments to clean up related data
- **Indexes** on frequently queried columns (category, status, customer_id, created_at)

---

## 5. Features

### 5.1 Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based login with role-based access (ADMIN/MANAGER) |
| **Dashboard Analytics** | Revenue charts, order statistics, top products, KPI trends |
| **Product Management** | CRUD operations, category filtering, stock management |
| **Order Management** | View orders, update status, filter by date/status |
| **Customer Management** | View customer list, details, purchase history |
| **Revenue Reports** | Date-range based revenue aggregation |
| **Swagger API Docs** | Interactive API documentation at `/swagger-ui.html` |

### 5.2 Customer Storefront Features

| Feature | Description |
|---------|-------------|
| **Landing Page** | Marketing/entry point with navigation to shop |
| **Product Catalog** | Browse products, filter by category, search |
| **Product Details** | View product info, images, reviews, add to cart |
| **Shopping Cart** | Add/remove items, quantity management, price calculation |
| **Checkout** | Secure checkout with payment method selection |
| **Order Success** | Confirmation page with order summary |
| **Order History** | View past orders and their status |
| **Account Settings** | Update profile information, change password |

---

## 6. How It Works

### 6.1 Authentication Flow

```
┌─────────┐                    ┌──────────────┐                    ┌─────────┐
│  User   │──(login credentials)▶│   Backend    │──────(validate)────▶│  MySQL  │
│         │                    │              │                    │         │
│         │◀──(JWT token)─────│              │◀──────(match)───────│         │
│         │                    │              │                    │         │
│         │──(API request + JWT)▶│              │──────(verify)──────▶│         │
│         │◀──(protected data)──│              │                    │         │
└─────────┘                    └──────────────┘                    └─────────┘
```

1. User submits username/password to `/api/auth/login`
2. Backend validates credentials against database
3. On success, a JWT token is generated and returned
4. Frontend stores token (localStorage) and sends it with subsequent requests
5. Backend validates JWT on protected endpoints

### 6.2 Order Processing Flow

```
1. Customer browses products → GET /api/products
2. Customer adds to cart → Stored in React state (localStorage)
3. Customer proceeds to checkout → POST /api/orders
   - Creates order record
   - Creates order_items records
   - Creates payment record (PENDING)
4. Payment processing → POST /api/payments
   - Updates payment status to SUCCESS
   - Updates order status to PAID
5. Order fulfillment → Admin updates status via PUT /api/orders/{id}
   - PAID → SHIPPED → DELIVERED
```

### 6.3 Admin Dashboard Data Flow

```
1. Dashboard loads → GET /api/dashboard/stats
   - Revenue aggregation SQL queries
   - Order count by status
   - Top selling products
2. Products page → GET /api/products (paginated)
   - Sorting, filtering, pagination handled by backend
3. Orders page → GET /api/orders (paginated + filtered)
4. Customer actions → POST/PUT/DELETE with validation
```

### 6.4 Cart Management (Frontend)

The shopping cart is managed entirely on the frontend:
- Cart state stored in React Context
- Persisted to localStorage for session continuity
- Calculations (subtotal, tax, total) done client-side
- On checkout, cart items sent to backend to create order

---

## 7. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/register` | Register new admin/manager |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Analytics and KPIs |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (paginated, filterable) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/{id}` | Update order |
| DELETE | `/api/orders/{id}` | Delete order |
| GET | `/api/orders/revenue` | Revenue summary |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

### Payments & Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/{orderId}` | Get payment |
| POST | `/api/payments` | Create payment |
| GET | `/api/reviews/{productId}` | Get reviews |
| POST | `/api/reviews` | Create review |

---

## 8. Project Structure

```
DBMS/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/shopping/
│   │   ├── ShoppingApplication.java   # Entry point
│   │   ├── config/                  # Security, CORS, Web config
│   │   ├── controller/              # 11 REST controllers
│   │   ├── service/                 # 10 Business logic services
│   │   ├── repository/              # 11 JDBC repositories
│   │   ├── model/                   # 9 Entity classes
│   │   ├── dto/                     # 19 Request/Response DTOs
│   │   ├── security/                # JWT filter, token provider
│   │   ├── exception/               # Global exception handling
│   │   └── util/                    # Utility classes
│   ├── src/test/java/               # Unit tests
│   ├── pom.xml                      # Maven dependencies
│   └── Dockerfile                   # Backend container
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # Entry point
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.jsx        # Admin dashboard
│   │   │   ├── Products.jsx         # Product management
│   │   │   ├── Orders.jsx           # Order management
│   │   │   ├── Customers.jsx        # Customer management
│   │   │   ├── Login.jsx            # Admin login
│   │   │   ├── LandingPage.jsx      # Marketing page
│   │   │   └── storefront/          # Customer-facing pages
│   │   │       ├── StorefrontHome.jsx
│   │   │       ├── ProductCatalog.jsx
│   │   │       ├── ProductDetails.jsx
│   │   │       ├── Cart.jsx
│   │   │       ├── Checkout.jsx
│   │   │       ├── OrderSuccess.jsx
│   │   │       ├── OrderHistory.jsx
│   │   │       └── AccountSettings.jsx
│   │   ├── components/
│   │   │   ├── layout/              # Layout components
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   ├── storefront/            # Storefront-specific
│   │   │   ├── ProtectedRoute.jsx     # Auth guard
│   │   │   └── AdminRoute.jsx         # Admin guard
│   │   ├── lib/                     # Utilities, API client
│   │   └── styles.css               # Global styles
│   ├── package.json                 # npm dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   ├── Dockerfile                   # Frontend container
│   └── dist/                        # Production build
│
├── db/                               # Database
│   ├── schema.sql                   # Table definitions
│   └── data.sql                     # Seed data
│
├── docker-compose.yml                # Full stack orchestration
├── .env.example                      # Environment template
├── run-backend.ps1                   # Backend start script
├── run-frontend.ps1                  # Frontend start script
└── README.md                         # Quick start guide
```

---

## 9. Security Implementation

### Authentication
- **JWT Tokens**: Stateless authentication with configurable expiration
- **BCrypt**: Password hashing for secure storage
- **Role-based Access**: ADMIN and MANAGER roles for dashboard access

### API Security
- **Spring Security**: All `/api/**` endpoints protected (except login/register)
- **CORS Configuration**: Configurable allowed origins
- **Input Validation**: @Valid annotations on DTOs
- **SQL Injection Prevention**: Parameterized queries via JDBC

### Frontend Security
- **Protected Routes**: React Router guards for authenticated pages
- **Token Storage**: JWT stored in localStorage (with XSS considerations)
- **Axios Interceptors**: Automatic token attachment to requests

---

## 10. Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8 (or Docker)

### Local Development

1. **Database Setup**:
   ```bash
   mysql -u root -p < db/schema.sql
   mysql -u root -p < db/data.sql
   ```

2. **Environment Variables** (create `.env` file):
   ```
   DB_URL=jdbc:mysql://localhost:3306/shopping_system
   DB_USERNAME=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_base64_encoded_secret
   JWT_EXPIRATION_MS=86400000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

3. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   # API available at http://localhost:8081
   ```

4. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   # App available at http://localhost:5173
   ```

### Docker Deployment

```bash
# Start all services
docker compose --env-file .env up --build

# Services:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8081
# - MySQL: localhost:3306
```

---

## 11. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Plain JDBC over JPA/Hibernate** | Full control over SQL, better performance for complex aggregations |
| **JWT over Session** | Stateless authentication, easier horizontal scaling |
| **Separate Customer/Users tables** | Clean separation of concerns, different data requirements |
| **Frontend Cart (not DB)** | Better UX (instant), reduces DB load, common e-commerce pattern |
| **RESTful API** | Standard HTTP methods, easy to document and consume |
| **Docker Compose** | One-command full stack deployment, consistent environments |

---

## 12. Future Enhancements

- Email notifications for order status updates
- Inventory management with low-stock alerts
- Product image upload (S3/cloud storage)
- Advanced search with Elasticsearch
- Payment gateway integration (Stripe/PayPal)
- Real-time order tracking
- Mobile app (React Native)
- Multi-language support

---

*Generated for Shopping Admin System - A full-stack e-commerce platform*
