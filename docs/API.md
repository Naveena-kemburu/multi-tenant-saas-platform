# API Documentation
## Multi-Tenant SaaS Platform

Complete reference for all 19 REST API endpoints.

---

## Authentication Endpoints

### 1. POST /api/auth/register-tenant
Register a new tenant organization.

**Request:**
```json
{
  "tenantName": "Acme Corp",
  "subdomain": "acme",
  "adminEmail": "admin@acme.com",
  "adminPassword": "SecurePass@123",
  "adminFullName": "John Admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "uuid",
    "subdomain": "acme",
    "adminUser": {
      "id": "uuid",
      "email": "admin@acme.com",
      "fullName": "John Admin",
      "role": "tenant_admin"
    }
  }
}
```

### 2. POST /api/auth/login
User login with email, password, and tenant subdomain.

**Request:**
```json
{
  "email": "admin@acme.com",
  "password": "SecurePass@123",
  "tenantSubdomain": "acme"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@acme.com",
      "fullName": "John Admin",
      "role": "tenant_admin",
      "tenantId": "uuid"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### 3. GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@acme.com",
    "fullName": "John Admin",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "uuid",
      "name": "Acme Corp",
      "subdomain": "acme",
      "subscriptionPlan": "pro",
      "maxUsers": 25,
      "maxProjects": 15
    }
  }
}
```

### 4. POST /api/auth/logout
Logout current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Tenant Management Endpoints

### 5. GET /api/tenants/:tenantId
Get tenant details (accessible by tenant_admin or super_admin).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "subdomain": "acme",
    "status": "active",
    "subscriptionPlan": "pro",
    "maxUsers": 25,
    "maxProjects": 15,
    "stats": {
      "totalUsers": 8,
      "totalProjects": 3,
      "totalTasks": 42
    }
  }
}
```

### 6. PUT /api/tenants/:tenantId
Update tenant information.

**Request:**
```json
{
  "name": "Acme Corporation Updated"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": { /* updated tenant */ }
}
```

### 7. GET /api/tenants
List all tenants (super_admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `subscriptionPlan` (optional): Filter by plan

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tenants": [ /* array of tenants */ ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTenants": 47,
      "limit": 10
    }
  }
}
```

---

## User Management Endpoints

### 8. POST /api/tenants/:tenantId/users
Add new user to tenant.

**Request:**
```json
{
  "email": "newuser@acme.com",
  "password": "SecurePass@123",
  "fullName": "Jane Doe",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { /* user object */ }
}
```

### 9. GET /api/tenants/:tenantId/users
List all users in tenant.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [ /* array of users */ ],
    "total": 8
  }
}
```

### 10. PUT /api/tenants/:tenantId/users/:userId
Update user information.

**Request:**
```json
{
  "fullName": "Jane Smith",
  "role": "user"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated user */ }
}
```

---

## Project Management Endpoints

### 11. POST /api/tenants/:tenantId/projects
Create new project.

**Request:**
```json
{
  "name": "Project Alpha",
  "description": "Q4 Product Development"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* project object */ }
}
```

### 12. GET /api/tenants/:tenantId/projects
List all projects in tenant.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [ /* array of projects */ ],
    "total": 3
  }
}
```

### 13. PUT /api/projects/:projectId
Update project.

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated project */ }
}
```

### 14. GET /api/projects/:projectId
Get project details.

**Response (200):**
```json
{
  "success": true,
  "data": { /* project with stats */ }
}
```

---

## Task Management Endpoints

### 15. POST /api/projects/:projectId/tasks
Create new task.

**Request:**
```json
{
  "title": "Implement authentication",
  "description": "Set up JWT authentication system",
  "priority": "high",
  "dueDate": "2025-01-31"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* task object */ }
}
```

### 16. GET /api/projects/:projectId/tasks
List project tasks.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [ /* array of tasks */ ],
    "total": 15
  }
}
```

### 17. PUT /api/tasks/:taskId
Update task.

**Request:**
```json
{
  "status": "in_progress",
  "assignedTo": "user-uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated task */ }
}
```

### 18. GET /api/tasks/:taskId
Get task details.

**Response (200):**
```json
{
  "success": true,
  "data": { /* task object */ }
}
```

---

## Health Check

### 19. GET /api/health
Server health status.

**Response (200):**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "uptime": 3600,
    "database": "connected",
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Server Error

---

## Authentication

All endpoints except `/api/auth/register-tenant` and `/api/auth/login` require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "userId": "uuid",
  "tenantId": "uuid",
  "role": "tenant_admin",
  "iat": 1704110400,
  "exp": 1704196800
}
```

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

