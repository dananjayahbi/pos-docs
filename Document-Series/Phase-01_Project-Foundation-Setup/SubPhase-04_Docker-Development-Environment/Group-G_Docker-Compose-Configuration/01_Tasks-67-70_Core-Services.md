# Tasks 67-70: Core Services

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** G - Docker Compose Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Celery-Services-Setup/03_Tasks-63-66_Monitoring-Health.md](../Group-F_Celery-Services-Setup/03_Tasks-63-66_Monitoring-Health.md)
- **→ Next Document:** [02_Tasks-71-74_Support-Services.md](02_Tasks-71-74_Support-Services.md)

---

## Document Overview

This document covers creating the main docker-compose.yml file and defining the core services: backend, frontend, and PostgreSQL.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create docker-compose.yml | Complex |
| 68 | Define Backend Service | Medium |
| 69 | Define Frontend Service | Medium |
| 70 | Define PostgreSQL Service | Medium |

---

## Task 67: Create docker-compose.yml

### Overview
Create the main Docker Compose file that orchestrates all development services.

### Dependencies
- Task 01: Initialize docker/ Directory

### Instructions

1. **Create docker-compose.yml**
   - In project root

2. **Add file header**
   - Version and purpose

3. **Structure sections**
   - Services, networks, volumes

### File Location

```
(project root)/
├── docker-compose.yml
├── docker/
├── backend/
└── frontend/
```

### Initial Structure

```yaml
# ==================================================
# LankaCommerce Cloud - Docker Compose Configuration
# ==================================================
# Purpose: Development environment orchestration
# Usage: docker compose up -d
# ==================================================

services:
  # Service definitions will follow

networks:
  lcc-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### Compose v2 Features

| Feature | Purpose |
|---------|---------|
| services | Container definitions |
| networks | Custom networking |
| volumes | Data persistence |
| depends_on with condition | Startup ordering |

### Commands Reference

| Command | Purpose |
|---------|---------|
| docker compose up -d | Start all services |
| docker compose down | Stop all services |
| docker compose logs -f | Follow logs |
| docker compose ps | List services |

### Expected Outcome
- docker-compose.yml created
- Base structure defined

### Verification Checklist
- [ ] File created in root
- [ ] Services section
- [ ] Networks section
- [ ] Volumes section

---

## Task 68: Define Backend Service

### Overview
Define the Django backend service in Docker Compose.

### Dependencies
- Task 22: Complete Backend Dockerfile
- Task 67: Create docker-compose.yml

### Instructions

1. **Add backend service**
   - Build from Dockerfile.dev

2. **Configure ports**
   - Map 8000

3. **Mount volumes**
   - Code and static

4. **Set environment**
   - From .env file

### Service Definition

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.dev
    container_name: lcc-backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - backend-static:/app/staticfiles
      - backend-media:/app/mediafiles
    environment:
      - DEBUG=true
      - DJANGO_SETTINGS_MODULE=config.settings.development
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
```

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| ./backend | /app | Source code |
| backend-static | /app/staticfiles | Static files |
| backend-media | /app/mediafiles | Uploads |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| DEBUG | Enable debugging |
| DJANGO_SETTINGS_MODULE | Settings path |
| DATABASE_URL | Postgres connection |
| REDIS_URL | Redis connection |

### Expected Outcome
- Backend service defined
- Hot reload enabled

### Verification Checklist
- [ ] Build context set
- [ ] Ports mapped
- [ ] Volumes mounted
- [ ] Environment configured
- [ ] Dependencies defined

---

## Task 69: Define Frontend Service

### Overview
Define the Next.js frontend service in Docker Compose.

### Dependencies
- Task 34: Complete Frontend Dockerfile
- Task 67: Create docker-compose.yml

### Instructions

1. **Add frontend service**
   - Build from Dockerfile.dev

2. **Configure ports**
   - Map 3000

3. **Mount volumes**
   - Source code

4. **Set environment**
   - API URL

### Service Definition

```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile.dev
    container_name: lcc-frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
      - WATCHPACK_POLLING=true
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      - backend
    restart: unless-stopped
```

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| ./frontend | /app | Source code |
| /app/node_modules | Anonymous | Preserve deps |
| /app/.next | Anonymous | Preserve build |

### Anonymous Volumes

Why exclude node_modules:
| Reason | Benefit |
|--------|---------|
| Platform differences | Linux vs host binaries |
| Performance | Faster I/O |
| Isolation | Container-specific deps |

### Hot Reload

WATCHPACK_POLLING for:
| Platform | Needed |
|----------|--------|
| macOS | Often yes |
| Windows | Yes |
| Linux | Usually no |

### Expected Outcome
- Frontend service defined
- Hot reload working

### Verification Checklist
- [ ] Build context set
- [ ] Port 3000 mapped
- [ ] Volumes configured
- [ ] Anonymous volumes for node_modules
- [ ] Backend dependency

---

## Task 70: Define PostgreSQL Service

### Overview
Define the PostgreSQL database service in Docker Compose.

### Dependencies
- Task 45: Complete PostgreSQL Configuration
- Task 67: Create docker-compose.yml

### Instructions

1. **Add db service**
   - Official postgres image

2. **Configure initialization**
   - Mount init.sql

3. **Configure data persistence**
   - Named volume

4. **Set credentials**
   - From environment

### Service Definition

```yaml
  db:
    image: postgres:15-alpine
    container_name: lcc-postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - ./docker/postgres/postgresql.conf:/etc/postgresql/postgresql.conf:ro
    environment:
      - POSTGRES_DB=lankacommerce
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-dev_password}
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    networks:
      - lcc-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d lankacommerce"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped
```

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| postgres-data | /var/lib/postgresql/data | Database files |
| init.sql | /docker-entrypoint-initdb.d/ | Initialization |
| postgresql.conf | /etc/postgresql/ | Configuration |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| POSTGRES_DB | Default database |
| POSTGRES_USER | Superuser |
| POSTGRES_PASSWORD | Password |

### Health Check

| Component | Purpose |
|-----------|---------|
| pg_isready | Check if accepting connections |
| interval | Check every 10s |
| start_period | Grace period |

### Expected Outcome
- PostgreSQL service defined
- Data persisted

### Verification Checklist
- [ ] Image version set
- [ ] Volumes mounted
- [ ] Init script mounted
- [ ] Config mounted
- [ ] Health check configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Create docker-compose.yml | Compose file |
| 68 | Define Backend Service | Django service |
| 69 | Define Frontend Service | Next.js service |
| 70 | Define PostgreSQL Service | Database service |

### docker-compose.yml Progress

```yaml
# ==================================================
# LankaCommerce Cloud - Docker Compose Configuration
# ==================================================

services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.dev
    container_name: lcc-backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - backend-static:/app/staticfiles
      - backend-media:/app/mediafiles
    environment:
      - DEBUG=true
      - DJANGO_SETTINGS_MODULE=config.settings.development
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile.dev
    container_name: lcc-frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
      - WATCHPACK_POLLING=true
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    container_name: lcc-postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - ./docker/postgres/postgresql.conf:/etc/postgresql/postgresql.conf:ro
    environment:
      - POSTGRES_DB=lankacommerce
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-dev_password}
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    networks:
      - lcc-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d lankacommerce"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

# Networks and volumes to be added
```

### Next Steps
Proceed to [02_Tasks-71-74_Support-Services.md](02_Tasks-71-74_Support-Services.md) for Redis and Celery services.

---

## Notes for AI Agents

1. **Build context:** Relative to compose file
2. **Dockerfile path:** Relative to build context
3. **Anonymous volumes:** Exclude platform-specific dirs
4. **Health checks:** Required for depends_on conditions
5. **env_file:** Shared environment configuration
6. **Git:** Do NOT commit yet - complete Group G first
