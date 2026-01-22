# Tasks 54-56: Docker Configuration Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** E - Shared & Support Directories  
> **Document:** 02 of 03  
> **Tasks Covered:** 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-53_Shared-Directory.md](01_Tasks-51-53_Shared-Directory.md)
- **→ Next Document:** [03_Tasks-57-60_Docs-Scripts.md](03_Tasks-57-60_Docs-Scripts.md)

---

## Document Overview

This document covers the creation of Docker configuration subdirectories for containerizing the backend, frontend, and nginx services in the development environment.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 54 | Create docker/backend/ Directory | Simple |
| 55 | Create docker/frontend/ Directory | Simple |
| 56 | Create docker/nginx/ Directory | Simple |

---

## Task 54: Create docker/backend/ Directory

### Overview
Create the backend Docker configuration directory for storing Django/Python container configuration files.

### Dependencies
- Task 14: Create docker/ Directory (Group B)

### Instructions

1. **Create the backend directory**
   - Create a directory named `backend/` inside `docker/`
   - This holds Django container configuration

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Backend Dockerfile
   - Backend-specific entrypoint scripts
   - Django configuration for Docker
   - Development and production variants

### Planned Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `Dockerfile` | Backend container definition |
| `Dockerfile.dev` | Development variant |
| `entrypoint.sh` | Container startup script |
| `wait-for-db.sh` | Database readiness check |
| `.dockerignore` | Files to exclude from build |

### Backend Container Configuration

| Configuration | Development | Production |
|---------------|-------------|------------|
| **Base Image** | python:3.12-slim | python:3.12-slim |
| **Port** | 8000 | 8000 |
| **Hot Reload** | Yes | No |
| **Debug Mode** | Enabled | Disabled |
| **Static Files** | Django served | Nginx served |
| **Workers** | 1 | gunicorn (4+) |

### Backend Services (Docker Compose)

| Service | Purpose | Port |
|---------|---------|------|
| `web` | Django application | 8000 |
| `db` | PostgreSQL database | 5432 |
| `redis` | Cache and Celery broker | 6379 |
| `celery` | Background task worker | - |
| `celery-beat` | Scheduled tasks | - |

### Expected Outcome
```
docker/
├── backend/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `docker/backend/` directory exists
- [ ] `.gitkeep` file exists inside `backend/`
- [ ] Directory is tracked by Git

---

## Task 55: Create docker/frontend/ Directory

### Overview
Create the frontend Docker configuration directory for storing Next.js container configuration files.

### Dependencies
- Task 14: Create docker/ Directory (Group B)

### Instructions

1. **Create the frontend directory**
   - Create a directory named `frontend/` inside `docker/`
   - This holds Next.js container configuration

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Frontend Dockerfile
   - Frontend-specific configuration
   - Multi-stage build definitions
   - Development and production variants

### Planned Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `Dockerfile` | Frontend container definition |
| `Dockerfile.dev` | Development variant |
| `entrypoint.sh` | Container startup script |
| `.dockerignore` | Files to exclude from build |

### Frontend Container Configuration

| Configuration | Development | Production |
|---------------|-------------|------------|
| **Base Image** | node:20-alpine | node:20-alpine |
| **Port** | 3000 | 3000 |
| **Hot Reload** | Yes (Fast Refresh) | No |
| **Build** | Dev server | Static build |
| **Output** | - | Standalone |

### Next.js Docker Considerations

| Aspect | Description |
|--------|-------------|
| **Multi-stage** | Build stage + Production stage |
| **Standalone** | Uses Next.js standalone output |
| **Dependencies** | Only production deps in final |
| **Size** | Optimized final image size |
| **Caching** | Layer caching for node_modules |

### Frontend Services (Docker Compose)

| Service | Purpose | Port |
|---------|---------|------|
| `pos` | POS application | 3000 |
| `webstore` | Webstore application | 3001 |
| `dashboard` | ERP dashboard | 3002 |

### Expected Outcome
```
docker/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `docker/frontend/` directory exists
- [ ] `.gitkeep` file exists inside `frontend/`
- [ ] Directory is tracked by Git

---

## Task 56: Create docker/nginx/ Directory

### Overview
Create the nginx Docker configuration directory for storing reverse proxy and static file serving configuration.

### Dependencies
- Task 14: Create docker/ Directory (Group B)

### Instructions

1. **Create the nginx directory**
   - Create a directory named `nginx/` inside `docker/`
   - This holds nginx container configuration

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Nginx configuration files
   - SSL certificate storage
   - Virtual host configurations
   - Custom error pages

### Planned Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `Dockerfile` | Nginx container definition |
| `nginx.conf` | Main nginx configuration |
| `conf.d/` | Virtual host configs |
| `ssl/` | SSL certificates (dev) |
| `html/` | Custom error pages |

### Nginx Container Configuration

| Configuration | Development | Production |
|---------------|-------------|------------|
| **Base Image** | nginx:alpine | nginx:alpine |
| **Port** | 80 | 80, 443 |
| **SSL** | Optional | Required |
| **Caching** | Disabled | Enabled |
| **Gzip** | Enabled | Enabled |

### Nginx Routing (Planned)

| Path | Upstream | Service |
|------|----------|---------|
| `/api/*` | backend:8000 | Django API |
| `/admin/*` | backend:8000 | Django Admin |
| `/static/*` | filesystem | Static files |
| `/media/*` | filesystem | Media files |
| `/pos/*` | pos:3000 | POS app |
| `/*` | webstore:3001 | Webstore app |

### Multi-Tenant Routing

| Subdomain Pattern | Service | Example |
|-------------------|---------|---------|
| `*.pos.domain.com` | POS | tenant1.pos.lcc.lk |
| `*.admin.domain.com` | Dashboard | tenant1.admin.lcc.lk |
| `*.domain.com` | Webstore | tenant1.lcc.lk |
| `api.domain.com` | Backend | api.lcc.lk |

### Expected Outcome
```
docker/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── nginx/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `docker/nginx/` directory exists
- [ ] `.gitkeep` file exists inside `nginx/`
- [ ] Directory is tracked by Git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 54 | Create docker/backend/ Directory | `docker/backend/` with `.gitkeep` |
| 55 | Create docker/frontend/ Directory | `docker/frontend/` with `.gitkeep` |
| 56 | Create docker/nginx/ Directory | `docker/nginx/` with `.gitkeep` |

### Final Docker Directory Structure
```
docker/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── nginx/
│   └── .gitkeep
└── .gitkeep
```

### Docker Compose Services Overview

| Service | Directory | Technology | Port |
|---------|-----------|------------|------|
| web | docker/backend/ | Django 5.x | 8000 |
| db | - | PostgreSQL 15+ | 5432 |
| redis | - | Redis 7+ | 6379 |
| celery | docker/backend/ | Celery | - |
| pos | docker/frontend/ | Next.js 14+ | 3000 |
| webstore | docker/frontend/ | Next.js 14+ | 3001 |
| dashboard | docker/frontend/ | Next.js 14+ | 3002 |
| nginx | docker/nginx/ | Nginx | 80/443 |

### Next Steps
Proceed to [03_Tasks-57-60_Docs-Scripts.md](03_Tasks-57-60_Docs-Scripts.md) to create documentation and scripts directories.

---

## Notes for AI Agents

1. **Docker Purpose:** These directories hold container configuration files
2. **Compose File:** docker-compose.yml lives in project root, not these directories
3. **Service Split:** Backend, frontend, and nginx are separate containers
4. **Dev vs Prod:** Development uses different Dockerfile variants than production
5. **Git Commit:** Do NOT commit yet - wait until all Group E tasks are complete
