# System Architecture
## Multi-Tenant SaaS Platform with Project & Task Management

---

## 1. High-Level System Architecture

The application follows a three-tier architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                  Client Layer (React Frontend)              │
│  - Registration, Login, Dashboard, Projects, Users, Tasks   │
│  - Responsive UI (Desktop, Tablet, Mobile)                  │
│  - State Management & API Integration                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│          API Layer (Express.js Backend Server)              │
│  - Authentication & Authorization                           │
│  - Tenant Management                                        │
│  - User Management                                          │
│  - Project Management                                       │
│  - Task Management                                          │
│  - Audit Logging                                            │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL/JDBC
                     ↓
┌─────────────────────────────────────────────────────────────┐
│    Data Layer (PostgreSQL Database with Multi-Tenancy)      │
│  - Tenants Table                                            │
│  - Users Table (with tenant isolation)                      │
│  - Projects Table (with tenant isolation)                   │
│  - Tasks Table (with tenant isolation)                      │
│  - Audit Logs Table                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenancy Architecture

### Approach: Shared Database with Shared Schema (Tenant Column)

We use the "Shared Database + Shared Schema" approach where:

- **Single PostgreSQL database** serves all tenants
- **All tables** have a `tenant_id` column for isolation
- **Row-level security** is enforced through SQL queries
- **Cost-efficient** with minimal infrastructure overhead

**Isolation Strategy**:
```sql
-- All queries include tenant_id filtering
SELECT * FROM users WHERE tenant_id = $1 AND id = $2;
SELECT * FROM projects WHERE tenant_id = $1 AND id = $2;
SELECT * FROM tasks WHERE tenant_id = $1 AND project_id = $2;
```

**Subdomain-based Tenant Identification**:
```
User accesses: demo.saasplatform.com
     → Subdomain 'demo' is extracted
     → Tenant lookup: SELECT * FROM tenants WHERE subdomain = 'demo'
     → tenant_id is used for all subsequent queries
```

---

## 3. Database Schema (Entity Relationship Diagram)

### Core Tables

#### tenants
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('active', 'suspended', 'trial'),
  subscription_plan ENUM('free', 'pro', 'enterprise'),
  max_users INTEGER,
  max_projects INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'tenant_admin', 'user'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
```

#### projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'archived', 'completed'),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
```

#### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'completed'),
  priority ENUM('low', 'medium', 'high'),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
```

---

## 4. API Architecture

### 19 RESTful Endpoints

#### Authentication Endpoints (4)
- POST /api/auth/register-tenant
- POST /api/auth/login  
- GET /api/auth/me
- POST /api/auth/logout

#### Tenant Management (3)
- GET /api/tenants/:tenantId
- PUT /api/tenants/:tenantId
- GET /api/tenants

#### User Management (3)
- POST /api/tenants/:tenantId/users
- GET /api/tenants/:tenantId/users
- PUT /api/tenants/:tenantId/users/:userId

#### Project Management (4)
- POST /api/tenants/:tenantId/projects
- GET /api/tenants/:tenantId/projects
- PUT /api/projects/:projectId
- GET /api/projects/:projectId

#### Task Management (4)
- POST /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks
- PUT /api/tasks/:taskId
- GET /api/tasks/:taskId

#### Health Check (1)
- GET /api/health

### Response Format

All APIs return consistent response format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* entity data */ }
}
```

---

## 5. Authentication & Authorization Flow

### JWT-Based Authentication

```
1. User submits email, password, and tenant subdomain
   ↓
2. Backend verifies tenant exists and is active
   ↓
3. Backend queries users table: WHERE tenant_id = $1 AND email = $2
   ↓
4. Backend verifies bcrypt password hash matches
   ↓
5. Backend generates JWT token with payload:
   {
     userId: uuid,
     tenantId: uuid,
     role: 'tenant_admin',
     iat: timestamp,
     exp: timestamp + 24h
   }
   ↓
6. Token sent to client in response
   ↓
7. Client includes token in Authorization header for subsequent requests
   ↓
8. Backend validates token signature and expiration
   ↓
9. Token claims (userId, tenantId, role) extracted for authorization
```

### Authorization Middleware Stack

```
Request
   ↓
[Auth Middleware] - Verify JWT token, extract claims
   ↓
[Tenant Isolation] - Filter queries by tenant_id from JWT
   ↓
[RBAC Middleware] - Check role-based permissions
   ↓
[Route Handler]
   ↓
Response
```

---

## 6. Security Architecture

### Security Measures

1. **Password Security**
   - bcrypt hashing with 10+ salt rounds
   - No plaintext passwords stored
   - Password validation on registration (min 8 chars)

2. **Data Isolation**
   - Every query includes tenant_id filtering
   - Super admin must explicitly bypass isolation (audited)
   - Database-level foreign key constraints

3. **JWT Security**
   - HMAC-SHA256 signing
   - 24-hour token expiration
   - Token claims validation
   - No sensitive data in JWT payload

4. **CORS Configuration**
   - Backend accepts requests from frontend URL only
   - Prevents CSRF attacks
   - Credentials included in requests

5. **Input Validation**
   - All inputs validated with Joi
   - SQL injection prevention through parameterized queries
   - XSS prevention through React escaping

6. **Audit Logging**
   - All critical actions logged
   - IP address captured
   - Timestamp and user tracking
   - Non-repudiation capabilities

---

## 7. Deployment Architecture

### Docker Compose Setup

```yaml
Services:
  database (PostgreSQL)
    ├─ Port: 5432
    ├─ Volume: postgres_data
    └─ Env: DB credentials
  
  backend (Express.js)
    ├─ Port: 5000
    ├─ Depends on: database
    ├─ Volume: source code
    └─ Env: DB URL, JWT secret
  
  frontend (React)
    ├─ Port: 3000
    ├─ Depends on: backend
    └─ Env: API URL
```

### Network Configuration

- Internal Docker network: `saas-network`
- Backend communicates with DB using: `postgresql://database:5432`
- Frontend communicates with backend using: `http://backend:5000`
- All services on the same Docker network for inter-service communication

---

## 8. Technology Stack

| Component | Technology | Version |
|-----------|-----------|----------|
| Database | PostgreSQL | 12+ |
| Backend | Express.js | ^4.18.2 |
| Frontend | React | 18 |
| Authentication | JWT | RS256/HS256 |
| Password Hashing | bcrypt | ^5.1.1 |
| Validation | Joi | ^17.11.0 |
| Database Client | node-postgres (pg) | ^8.11.0 |
| HTTP Client | Axios | ^1.x |
| Containerization | Docker | Latest |
| Orchestration | Docker Compose | 3.8+ |

---

## 9. Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend (JWT)
   - No server-side sessions
   - Can add multiple backend instances
   - Database acts as single source of truth

2. **Performance Optimization**
   - Database indexes on tenant_id
   - Connection pooling for DB
   - Request caching where applicable
   - Pagination for list endpoints

3. **Future Enhancements**
   - Redis caching layer
   - Message queue for async operations
   - Database read replicas
   - CDN for static assets

