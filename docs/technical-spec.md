# Technical Specification
## Multi-Tenant SaaS Platform

---

## Project Structure

```
multi-tenant-saas-platform/
├── backend/
│   ├── src/
│   │   ├── app.js (Express server)
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├─┐ middleware/
│   │   │   ├─┐ auth.js
│   │   │   ├─┐ validation.js
│   │   │   └─┐ errorHandler.js
│   │   ├─┐ routes/
│   │   │   ├─┐ auth.js
│   │   │   ├─┐ tenants.js
│   │   │   ├─┐ users.js
│   │   │   ├─┐ projects.js
│   │   │   └─┐ tasks.js
│   │   ├─┐ controllers/
│   │   │   ├─┐ authController.js
│   │   │   ├─┐ tenantController.js
│   │   │   ├─┐ userController.js
│   │   │   ├─┐ projectController.js
│   │   │   └─┐ taskController.js
│   │   ├─┐ utils/
│   │   │   ├─┐ database.js
│   │   │   ├─┐ jwt.js
│   │   │   └─┐ auditLog.js
│   ├─┐ migrations/
│   ├─┐ seeds/
│   ├─┐ Dockerfile
│   ├─┐ package.json
│   └─┐ .dockerignore
├─┐ frontend/
│   ├─┐ src/
│   │   ├─┐ components/
│   │   ├─┐ pages/
│   │   ├─┐ services/
│   │   ├─┐ utils/
│   │   └─┐ App.jsx
│   ├─┐ public/
│   ├─┐ Dockerfile
│   ├─┐ package.json
│   └─┐ .dockerignore
├─┐ database/
│   ├─┐ 001_init_schema.sql
│   └─┐ 002_seed_data.sql
├─┐ docs/
│   ├─┐ research.md
│   ├─┐ PRD.md
│   ├─┐ architecture.md
│   ├─┐ technical-spec.md
│   └─┐ API.md
├─┐ docker-compose.yml
├─┐ .env
├─┐ README.md
├─┐ submission.json
└─┐ LICENSE
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker and Docker Compose
- Git

### Backend Setup

```bash
cd backend
npm install
npm run dev  # Starts with nodemon for development
```

### Frontend Setup

```bash
cd frontend
npm install
npm start    # Starts React dev server
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## Environment Variables

See `.env` file for complete configuration. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - Token expiration in seconds (86400 = 24 hours)
- `NODE_ENV` - production/development
- `BACKEND_PORT` - Backend API port (5000)
- `REACT_APP_API_URL` - Frontend API endpoint

---

## Database Setup

Database migrations run automatically on application startup:

1. Execute `001_init_schema.sql` - Creates all tables and indexes
2. Execute `002_seed_data.sql` - Inserts test data

For manual setup:

```sql
psql -U saas_user -d saas_db -f database/001_init_schema.sql
psql -U saas_user -d saas_db -f database/002_seed_data.sql
```

---

## Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### API Testing

Use Postman or curl for API testing:

```bash
# Health check
curl http://localhost:5000/api/health

# Tenant registration
curl -X POST http://localhost:5000/api/auth/register-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Company",
    "subdomain": "test",
    "adminEmail": "admin@test.com",
    "adminPassword": "TestPass@123",
    "adminFullName": "Test Admin"
  }'
```

---

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Verify services are running
docker-compose ps

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Production Considerations

- Update JWT_SECRET with a strong random value
- Set NODE_ENV=production
- Use HTTPS with SSL certificates
- Configure database backups
- Set up monitoring and logging
- Implement rate limiting
- Use environment-specific configuration

---

## Performance Tuning

- Database indexes on `tenant_id` columns
- Connection pooling (default 20 connections)
- Query optimization with SELECT only needed columns
- Pagination for list endpoints (default limit: 10, max: 100)
- Caching for frequently accessed data

---

## Security Best Practices

- All passwords hashed with bcrypt (salt rounds: 10+)
- JWT tokens validated on every protected endpoint
- Input validation on all API endpoints
- SQL injection prevention through parameterized queries
- CORS configured to accept requests from frontend only
- Audit logging of all critical operations
- Error messages don't expose sensitive information

