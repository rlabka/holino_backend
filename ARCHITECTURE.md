# 🏗️ Holino Backend Architecture

## 📁 Projektstruktur

```
holino_backend/
├── prisma/                      # Prisma Schema & Migrations
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.js                 # Seed data script
│
├── src/
│   ├── config/                 # Configuration files
│   │   ├── index.js           # Central config management
│   │   └── database.js        # Database connection
│   │
│   ├── controllers/            # Route controllers (business logic)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── service.controller.js
│   │   └── ...
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── validate.js        # Validation middleware
│   │   ├── errorHandler.js    # Error handling
│   │   └── security.js        # Security middleware
│   │
│   ├── models/                 # Database models (Prisma wrappers)
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── ...
│   │
│   ├── routes/                 # API routes
│   │   ├── index.js           # Route aggregator
│   │   ├── auth.js            # Auth routes
│   │   ├── users.js           # User routes
│   │   └── ...
│   │
│   ├── services/              # Business logic layer
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   └── ...
│   │
│   ├── utils/                 # Utility functions
│   │   ├── errors.js         # Custom error classes
│   │   ├── response.js       # API response formatter
│   │   ├── logger.js         # Logging utility
│   │   ├── constants.js      # Application constants
│   │   └── helpers.js        # Helper functions
│   │
│   └── index.js              # Application entry point
│
├── uploads/                   # File uploads directory
├── docker-compose.yml        # Docker configuration
├── Dockerfile               # Docker image definition
├── .env                     # Environment variables (not in git)
├── env.example             # Environment template
└── package.json           # Node.js dependencies

```

## 🔧 Architektur-Prinzipien

### 1. **Separation of Concerns**
- **Routes**: Nur HTTP-Routing, keine Business-Logik
- **Controllers**: Request-Handling und Response-Formatting
- **Services**: Business-Logik und Daten-Operationen
- **Models**: Datenbank-Interaktionen (Prisma)
- **Middleware**: Cross-cutting concerns (Auth, Validation, etc.)

### 2. **Layered Architecture**

```
┌─────────────────────────────────────┐
│         Routes Layer                │  HTTP Endpoints
├─────────────────────────────────────┤
│       Middleware Layer              │  Auth, Validation, Security
├─────────────────────────────────────┤
│      Controllers Layer              │  Request/Response Handling
├─────────────────────────────────────┤
│       Services Layer                │  Business Logic
├─────────────────────────────────────┤
│        Models Layer                 │  Data Access
├─────────────────────────────────────┤
│       Database (PostgreSQL)         │  Data Storage
└─────────────────────────────────────┘
```

### 3. **Error Handling Strategy**

```javascript
// Custom Error Classes
AppError → ValidationError
        → AuthenticationError
        → AuthorizationError
        → NotFoundError
        → ConflictError
        → DatabaseError

// Global Error Handler
- Catches all errors
- Formats error responses
- Logs errors
- Handles Prisma errors
- Handles JWT errors
```

### 4. **API Response Format**

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-10-24T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ],
  "timestamp": "2024-10-24T12:00:00.000Z"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-10-24T12:00:00.000Z"
}
```

## 🔐 Security Features

### 1. **Authentication & Authorization**
- JWT-basierte Authentifizierung
- Access & Refresh Tokens
- Password Hashing (bcrypt)
- Role-based Access Control

### 2. **Security Middleware**
- Helmet (Security Headers)
- CORS Configuration
- Rate Limiting
- Input Sanitization
- XSS Protection

### 3. **Data Validation**
- express-validator
- Custom validation schemas
- Type checking
- Sanitization

## 📊 Database Design

### **Entities:**
- **User**: Benutzer-Accounts
- **Service**: Angebotene Services
- **Booking**: Buchungen
- **Review**: Bewertungen
- **Message**: Nachrichten
- **Favorite**: Favoriten

### **Relationships:**
```
User (1) → (N) Service
User (1) → (N) Booking
User (1) → (N) Review
Service (1) → (N) Booking
Service (1) → (N) Review
User (1) → (N) Message (Sender)
User (1) → (N) Message (Receiver)
User (1) → (N) Favorite
Service (1) → (N) Favorite
```

## 🚀 Skalierbarkeit

### **Horizontal Scaling**
- Stateless API Design
- JWT statt Sessions
- Docker Container Ready
- Load Balancer Ready

### **Vertical Scaling**
- Prisma Connection Pooling
- Async/Await überall
- Effiziente Queries
- Caching-Ready

### **Performance Optimierung**
- Database Indexing
- Pagination für große Datasets
- Lazy Loading
- Query Optimization

## 🧪 Testing Strategy

```
Unit Tests:
├── Models (Data Layer)
├── Services (Business Logic)
└── Utils (Helper Functions)

Integration Tests:
├── API Endpoints
├── Database Operations
└── Authentication Flow

E2E Tests:
└── Complete User Journeys
```

## 📝 Code Standards

### **Naming Conventions**
```javascript
// Files: camelCase
userController.js
authService.js

// Classes: PascalCase
class UserService { }
class ApiResponse { }

// Variables/Functions: camelCase
const userName = 'John';
function getUserById() { }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5000000;
const API_VERSION = 'v1';
```

### **Best Practices**
1. Immer async/await verwenden (nie callbacks)
2. Error-First Approach
3. DRY Prinzip (Don't Repeat Yourself)
4. Single Responsibility Principle
5. Dependency Injection wo möglich
6. Ausführliche Kommentare für komplexe Logik
7. Type Checking mit JSDoc oder TypeScript

## 🔄 Request Flow

```
1. Client Request
   ↓
2. Security Middleware (CORS, Helmet, Rate Limit)
   ↓
3. Request Logger
   ↓
4. Input Sanitization
   ↓
5. Route Handler
   ↓
6. Authentication Middleware (if required)
   ↓
7. Validation Middleware
   ↓
8. Controller
   ↓
9. Service Layer (Business Logic)
   ↓
10. Model Layer (Database)
   ↓
11. Response Formatter
   ↓
12. Client Response
```

## 🌟 Vorteile dieser Architektur

✅ **Wartbarkeit**: Klare Struktur, einfach zu verstehen
✅ **Skalierbarkeit**: Horizontal und vertikal skalierbar
✅ **Testbarkeit**: Jede Schicht einzeln testbar
✅ **Wiederverwendbarkeit**: DRY Code, shared utilities
✅ **Sicherheit**: Multiple Security Layers
✅ **Performance**: Optimierte Queries und Caching-Ready
✅ **Entwicklerfreundlich**: Klare Konventionen und Standards
✅ **Produktionsreif**: Error Handling, Logging, Monitoring

## 🔮 Zukünftige Erweiterungen

- [ ] WebSocket Integration für Real-time Chat
- [ ] Redis für Caching
- [ ] Queue System (Bull/BullMQ)
- [ ] Elasticsearch für erweiterte Suche
- [ ] CDN Integration für File Uploads
- [ ] Monitoring & Analytics (Prometheus, Grafana)
- [ ] CI/CD Pipeline
- [ ] API Documentation (Swagger/OpenAPI)
