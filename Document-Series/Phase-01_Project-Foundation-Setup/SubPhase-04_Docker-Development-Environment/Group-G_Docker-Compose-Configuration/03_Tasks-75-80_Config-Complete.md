# Tasks 75-80: Configuration Complete

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** G - Docker Compose Configuration  
> **Document:** 03 of 03  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-71-74_Support-Services.md](02_Tasks-71-74_Support-Services.md)
- **→ Next Group:** [../Group-H_Development-Scripts-Verification/00_GROUP_OVERVIEW.md](../Group-H_Development-Scripts-Verification/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers completing Docker Compose with volumes, environment files, health checks, dependencies, and production override.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Configure Volumes | Simple |
| 76 | Configure Environment Files | Simple |
| 77 | Configure Health Checks | Medium |
| 78 | Configure Dependencies | Medium |
| 79 | Create docker-compose.override.yml | Medium |
| 80 | Create docker-compose.prod.yml | Complex |

---

## Task 75: Configure Volumes

### Overview
Define named volumes for data persistence across container restarts.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Define named volumes**
   - For persistent data

2. **Document usage**
   - Which service uses which

3. **Configure drivers**
   - Default local driver

### Volumes Definition

```yaml
volumes:
  postgres-data:
    name: lcc-postgres-data
    driver: local
  
  redis-data:
    name: lcc-redis-data
    driver: local
  
  backend-static:
    name: lcc-backend-static
    driver: local
  
  backend-media:
    name: lcc-backend-media
    driver: local
```

### Volume Usage

| Volume | Service | Mount Point |
|--------|---------|-------------|
| postgres-data | db | /var/lib/postgresql/data |
| redis-data | redis | /data |
| backend-static | backend | /app/staticfiles |
| backend-media | backend | /app/mediafiles |

### Data Lifecycle

| Action | Effect |
|--------|--------|
| docker compose down | Volumes preserved |
| docker compose down -v | Volumes deleted |
| docker volume prune | Orphan volumes removed |

### Expected Outcome
- Named volumes defined
- Data persists

### Verification Checklist
- [ ] All volumes named
- [ ] Local driver used
- [ ] Names documented

---

## Task 76: Configure Environment Files

### Overview
Configure environment file integration for service configuration.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Reference .env file**
   - env_file directive

2. **Create .env.example**
   - Template for developers

3. **Document variables**
   - Required and optional

### env_file Usage

```yaml
services:
  backend:
    env_file:
      - .env
      - .env.local  # Optional overrides

  frontend:
    env_file:
      - .env
```

### .env.example Template

```env
# ==================================================
# LankaCommerce Cloud - Environment Configuration
# ==================================================
# Copy to .env and customize values
# ==================================================

# Application
APP_NAME=LankaCommerce
APP_ENV=development
DEBUG=true

# Django
DJANGO_SECRET_KEY=your-secret-key-change-in-production
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database
POSTGRES_DB=lankacommerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev_password_change_me
DATABASE_URL=postgres://lcc_user:dev_password@db:5432/lankacommerce

# Redis
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

# Celery
CELERY_CONCURRENCY=2
CELERY_LOG_LEVEL=info

# Flower
FLOWER_BASIC_AUTH=admin:admin

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sri Lanka Specific
TZ=Asia/Colombo
DEFAULT_CURRENCY=LKR
DEFAULT_COUNTRY=LK
```

### Git Ignore

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Keep example
!.env.example
```

### Expected Outcome
- Environment integration
- Template for developers

### Verification Checklist
- [ ] env_file in services
- [ ] .env.example created
- [ ] .gitignore updated
- [ ] Variables documented

---

## Task 77: Configure Health Checks

### Overview
Configure health checks for all services.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Add health checks**
   - To all services

2. **Configure timing**
   - Appropriate intervals

3. **Document commands**
   - Health check methods

### Health Check Summary

```yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d lankacommerce"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 5s

  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  celery-worker:
    healthcheck:
      test: ["CMD", "celery", "-A", "config.celery", "inspect", "ping", "--timeout", "5"]
      interval: 60s
      timeout: 30s
      retries: 3
      start_period: 30s
```

### Health Check Timing

| Parameter | Purpose |
|-----------|---------|
| interval | Time between checks |
| timeout | Max wait for response |
| retries | Failures before unhealthy |
| start_period | Initial grace period |

### Health Endpoints

| Service | Endpoint | Response |
|---------|----------|----------|
| backend | /health/ | 200 OK |
| frontend | /api/health | 200 OK |
| db | pg_isready | Exit 0 |
| redis | PING | PONG |

### Expected Outcome
- All services have health checks
- Proper timing configured

### Verification Checklist
- [ ] All services checked
- [ ] Appropriate intervals
- [ ] Health endpoints documented

---

## Task 78: Configure Dependencies

### Overview
Configure service startup dependencies with conditions.

### Dependencies
- Tasks 68-73: All service definitions

### Instructions

1. **Set depends_on**
   - With conditions

2. **Order services**
   - db → redis → backend → workers

3. **Use service_healthy**
   - Wait for health

### Dependency Configuration

```yaml
services:
  backend:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    depends_on:
      backend:
        condition: service_started

  celery-worker:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      backend:
        condition: service_started

  celery-beat:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  flower:
    depends_on:
      redis:
        condition: service_healthy
```

### Dependency Conditions

| Condition | Behavior |
|-----------|----------|
| service_started | Start immediately |
| service_healthy | Wait for health check |
| service_completed_successfully | Wait for exit 0 |

### Startup Order

```
1. db          (no dependencies)
2. redis       (no dependencies)
3. backend     (after db + redis healthy)
4. celery-beat (after db + redis healthy)
5. celery-worker (after backend started)
6. flower      (after redis healthy)
7. frontend    (after backend started)
```

### Expected Outcome
- Proper startup order
- Health-based waiting

### Verification Checklist
- [ ] All dependencies defined
- [ ] Conditions specified
- [ ] Order documented

---

## Task 79: Create docker-compose.override.yml

### Overview
Create override file for local development customizations.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Create override file**
   - Local customizations

2. **Add development extras**
   - Debug ports

3. **Document usage**
   - Auto-merged

### File Location

```
(project root)/
├── docker-compose.yml
└── docker-compose.override.yml  # Gitignored
```

### Override File

```yaml
# ==================================================
# LankaCommerce Cloud - Development Overrides
# ==================================================
# Purpose: Local development customizations
# Auto-merged with docker-compose.yml
# ==================================================

services:
  backend:
    # Enable debugger port
    ports:
      - "8000:8000"
      - "5678:5678"  # debugpy
    environment:
      - DEBUG=true
      - DJANGO_DEBUG_TOOLBAR=true

  frontend:
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api

  db:
    # Expose for external tools
    ports:
      - "5432:5432"

  redis:
    # Expose for external tools
    ports:
      - "6379:6379"
```

### .gitignore Entry

```gitignore
# Local compose overrides
docker-compose.override.yml
```

### Override Example Template

Create docker-compose.override.example.yml:
```yaml
# Copy to docker-compose.override.yml and customize
services:
  backend:
    ports:
      - "8000:8000"
      - "5678:5678"  # debugpy
```

### Expected Outcome
- Override file created
- Local customization enabled

### Verification Checklist
- [ ] Override file created
- [ ] .gitignore updated
- [ ] Example provided
- [ ] Auto-merge documented

---

## Task 80: Create docker-compose.prod.yml

### Overview
Create production Docker Compose configuration.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Create prod file**
   - Production settings

2. **Use production builds**
   - Dockerfile.prod

3. **Restrict ports**
   - Internal only

4. **Add replicas**
   - Scaling config

### Production Compose

```yaml
# ==================================================
# LankaCommerce Cloud - Production Docker Compose
# ==================================================
# Purpose: Production deployment configuration
# Usage: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# ==================================================

services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.prod
      args:
        - BUILDKIT_INLINE_CACHE=1
    ports:
      - "8000:8000"  # Behind reverse proxy
    environment:
      - DEBUG=false
      - DJANGO_SETTINGS_MODULE=config.settings.production
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile.prod
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"  # Behind reverse proxy
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure

  db:
    ports: []  # No external access
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  redis:
    ports: []  # No external access
    deploy:
      resources:
        limits:
          memory: 512M

  celery-worker:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.prod
    environment:
      - CELERY_CONCURRENCY=4
      - CELERY_LOG_LEVEL=warning
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure

  celery-beat:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.prod
    environment:
      - CELERY_LOG_LEVEL=warning
    deploy:
      replicas: 1  # Must be exactly 1

  flower:
    environment:
      - FLOWER_BASIC_AUTH=${FLOWER_ADMIN}:${FLOWER_PASSWORD}
    ports:
      - "127.0.0.1:5555:5555"  # Localhost only
```

### Production Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Dockerfile | .dev | .prod |
| Debug | true | false |
| Ports | All exposed | Internal only |
| Replicas | 1 | 2+ |
| Logging | info | warning |
| Resources | None | Limits set |

### Usage

```bash
# Production deployment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Expected Outcome
- Production config created
- Security hardened

### Verification Checklist
- [ ] Production Dockerfiles used
- [ ] Ports restricted
- [ ] Resource limits
- [ ] Replicas configured
- [ ] Secrets externalized

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 75 | Configure Volumes | Named volumes |
| 76 | Configure Environment Files | .env integration |
| 77 | Configure Health Checks | All services |
| 78 | Configure Dependencies | Startup order |
| 79 | Create docker-compose.override.yml | Local customization |
| 80 | Create docker-compose.prod.yml | Production config |

### Files Created/Modified
| File | Purpose |
|------|---------|
| docker-compose.yml | Main configuration |
| docker-compose.override.yml | Local overrides |
| docker-compose.prod.yml | Production settings |
| .env.example | Environment template |

### Complete File Structure

```
(project root)/
├── docker-compose.yml
├── docker-compose.override.yml      # Gitignored
├── docker-compose.override.example.yml
├── docker-compose.prod.yml
├── .env                             # Gitignored
├── .env.example
└── docker/
```

### Next Steps
Proceed to [../Group-H_Development-Scripts-Verification/00_GROUP_OVERVIEW.md](../Group-H_Development-Scripts-Verification/00_GROUP_OVERVIEW.md) for development scripts and verification.

---

## Notes for AI Agents

1. **Volumes:** Named for persistence
2. **Environment:** Use .env.example template
3. **Health checks:** Required for depends_on
4. **Override:** Auto-merged, gitignored
5. **Production:** Separate file, merged at deploy
6. **Git:** Commit Group G files together
