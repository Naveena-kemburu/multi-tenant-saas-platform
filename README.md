# Multi-Tenant SaaS Platform with Project & Task Management

## Overview

A production-ready, enterprise-grade multi-tenant SaaS platform with complete project and task management capabilities. This application demonstrates advanced architectural patterns including data isolation, JWT-based authentication, role-based access control, and Docker containerization.

## 🚀 Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/Naveena-kemburu/multi-tenant-saas-platform
cd multi-tenant-saas-platform

# Start all services with Docker Compose
docker-compose up -d
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## 📚 Documentation

- [Research Document](docs/research.md) - Multi-tenancy analysis and technology stack justification
- [Product Requirements](docs/PRD.md) - User personas and functional/non-functional requirements
- [Architecture Design](docs/architecture.md) - System architecture and database schema
- [Technical Specification](docs/technical-spec.md) - Setup guide and project structure
- [API Documentation](docs/API.md) - Complete API endpoint reference

## 🔐 Test Credentials

**Super Admin**
- Email: `superadmin@system.com`
- Password: `Admin@123`

**Demo Tenant Admin**
- Email: `admin@demo.com`
- Password: `Demo@123`
- Tenant: `demo`

**Demo Tenant User 1**
- Email: `user1@demo.com`
- Password: `User@123`

## ✨ Features

### Multi-Tenancy
- Complete data isolation between tenants
- Subdomain-based tenant identification
- Shared database with tenant_id isolation

### Authentication & Authorization
- JWT-based stateless authentication (24-hour expiry)
- Three user roles: Super Admin, Tenant Admin, User
- Role-based access control (RBAC) on all endpoints

### Project Management
- Create and manage projects
- Subscription plan limits
- Project status tracking

### Task Management
- Create, assign, and track tasks
- Task prioritization (Low, Medium, High)
- Due date management
- Task status workflow

### Security
- Password hashing with bcrypt
- Data isolation at database level
- Audit logging for compliance
- Input validation and SQL injection prevention

## 🏗️ Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, Axios, React Router |
| Backend | Express.js, Node.js |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt |
| Containerization | Docker, Docker Compose |
| Tools | Postman, Swagger |

## 📊 Database Schema

### Core Tables
- **tenants** - Organization information with subscription plans
- **users** - User accounts with role assignments
- **projects** - Project management
- **tasks** - Task tracking and assignment
- **audit_logs** - Action tracking and compliance

## 🔌 API Endpoints (19 Total)

### Authentication (4 endpoints)
- `POST /api/auth/register-tenant` - Register new tenant
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tenant Management (3 endpoints)
- `GET /api/tenants/:tenantId` - Get tenant details
- `PUT /api/tenants/:tenantId` - Update tenant
- `GET /api/tenants` - List all tenants (super admin)

### User Management (3 endpoints)
- `POST /api/tenants/:tenantId/users` - Add user
- `GET /api/tenants/:tenantId/users` - List users
- `PUT /api/tenants/:tenantId/users/:userId` - Update user

### Project Management (3 endpoints)
- `POST /api/tenants/:tenantId/projects` - Create project
- `GET /api/tenants/:tenantId/projects` - List projects
- `PUT /api/projects/:projectId` - Update project

### Task Management (3 endpoints)
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - List tasks
- `PUT /api/tasks/:taskId` - Update task

### Health Check
- `GET /api/health` - Server health status

## 🐳 Docker Architecture

```
Docker Network
├── database (PostgreSQL:5432)
├── backend (Express.js:5000)
└── frontend (React:3000)
```

All services communicate internally using service names (database, backend, frontend).

## 📋 Subscription Plans

| Plan | Max Users | Max Projects | Price |
|------|-----------|--------------|-------|
| Free | 5 | 3 | $0 |
| Pro | 25 | 15 | $99/month |
| Enterprise | 100 | 50 | Custom |

## 🎯 Project Structure

```
.
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation
│   │   └── utils/            # Helper functions
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Seed data
│   └── package.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── styles/           # CSS/styling
│   └── package.json
├── database/
│   ├── migrations/           # SQL migrations
│   └── seeds/                # Seed data
├── docs/                       # Documentation
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   └── API.md
├── docker-compose.yml         # Docker orchestration
├── submission.json            # Test credentials
└── README.md                  # This file
```

## 🔧 Environment Variables

Core environment variables (configured automatically in Docker):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRY` - Token expiration time (86400 seconds = 24 hours)
- `BACKEND_URL` - Backend API URL
- `FRONTEND_URL` - Frontend URL

## 📝 Development

### Local Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

## ✅ Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register New Tenant
```bash
curl -X POST http://localhost:5000/api/auth/register-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Your Company",
    "subdomain": "yourcompany",
    "adminEmail": "admin@yourcompany.com",
    "adminPassword": "Password@123",
    "adminFullName": "Admin Name"
  }'
```

## 🎬 Demo Video

Watch the complete demo video: [YouTube Link]

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Naveena Kemburu

## 📞 Support

For issues, feature requests, or questions, please open an issue in the GitHub repository.

---

**Status**: ✅ Production Ready
**Last Updated**: December 2025
**Commits**: 30+
