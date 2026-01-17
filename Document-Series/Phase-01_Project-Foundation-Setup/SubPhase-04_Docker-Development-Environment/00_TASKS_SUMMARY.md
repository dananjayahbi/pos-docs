# SubPhase 04: Docker Development Environment - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 04 of 08  
> **SubPhase Goal:** Create containerized development environment for consistent development  
> **Total Tasks:** 89 | **Status:** Planning  
> **Estimated Duration:** 6-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Frontend-Project-Initialization](../SubPhase-03_Frontend-Project-Initialization/)
- **→ Next SubPhase:** [SubPhase-05_Code-Quality-Linting-Setup](../SubPhase-05_Code-Quality-Linting-Setup/)

---

## SubPhase Overview

This sub-phase establishes a complete Docker-based development environment using Docker Compose. The setup includes all services required for local development: Django backend with hot reload, PostgreSQL database, Redis for caching/Celery, and Celery workers for background tasks.

### Key Outcomes
- Docker Compose configuration for all services
- Dockerfile for Django backend (development and production)
- Dockerfile for Next.js frontend
- PostgreSQL and Redis containers configured
- Celery worker and Celery beat containers
- Volume mounts for hot reload development
- Network configuration for inter-service communication

### Services to Configure
- **Django Backend:** Python 3.12+, hot reload, debug mode
- **PostgreSQL 15+:** Database with persistent volume
- **Redis 7+:** Caching and Celery message broker
- **Celery Worker:** Background task processing
- **Celery Beat:** Scheduled task scheduler
- **Next.js Frontend:** Node.js 20+, hot reload

### Dependencies
- **Requires:** SubPhase-02 (Backend) and SubPhase-03 (Frontend) completed
- **Backend and Frontend projects must be initialized**

---

## Task Execution Order

```
TASK GROUP A: Docker Directory Setup (Tasks 01-08)
        │
        ▼
TASK GROUP B: Backend Dockerfile Creation (Tasks 09-22)
        │
        ▼
TASK GROUP C: Frontend Dockerfile Creation (Tasks 23-34)
        │
        ▼
TASK GROUP D: PostgreSQL Container Setup (Tasks 35-45)
        │
        ▼
TASK GROUP E: Redis Container Setup (Tasks 46-54)
        │
        ▼
TASK GROUP F: Celery Services Setup (Tasks 55-66)
        │
        ▼
TASK GROUP G: Docker Compose Configuration (Tasks 67-80)
        │
        ▼
TASK GROUP H: Development Scripts & Verification (Tasks 81-89)
```

---

## Task Index

### Group A: Docker Directory Setup (Tasks 01-08)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create docker/ Directory** | Create main docker configuration directory | SubPhase-01 | 🔴 Not Created |
| 02 | **Create docker/backend/ Directory** | Backend Docker files directory | Task 01 | 🔴 Not Created |
| 03 | **Create docker/frontend/ Directory** | Frontend Docker files directory | Task 01 | 🔴 Not Created |
| 04 | **Create docker/postgres/ Directory** | PostgreSQL initialization scripts | Task 01 | 🔴 Not Created |
| 05 | **Create docker/redis/ Directory** | Redis configuration directory | Task 01 | 🔴 Not Created |
| 06 | **Create docker/nginx/ Directory** | Nginx configuration (for production) | Task 01 | 🔴 Not Created |
| 07 | **Create docker/scripts/ Directory** | Utility scripts for containers | Task 01 | 🔴 Not Created |
| 08 | **Create .dockerignore (Root)** | Root dockerignore file | Task 01 | 🔴 Not Created |

---

### Group B: Backend Dockerfile Creation (Tasks 09-22)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 09 | **Create Backend Dockerfile.dev** | Development Dockerfile for Django | Task 02 | 🔴 Not Created |
| 10 | **Configure Python Base Image** | Use python:3.12-slim as base | Task 09 | 🔴 Not Created |
| 11 | **Set Environment Variables** | PYTHONUNBUFFERED, PYTHONDONTWRITEBYTECODE | Task 09 | 🔴 Not Created |
| 12 | **Install System Dependencies** | PostgreSQL client, build essentials | Task 10 | 🔴 Not Created |
| 13 | **Create Working Directory** | Set /app as working directory | Task 10 | 🔴 Not Created |
| 14 | **Copy Requirements File** | Copy requirements.txt first (caching) | Task 13 | 🔴 Not Created |
| 15 | **Install Python Dependencies** | pip install requirements | Task 14 | 🔴 Not Created |
| 16 | **Copy Application Code** | Copy backend source code | Task 15 | 🔴 Not Created |
| 17 | **Create Entrypoint Script** | docker/backend/entrypoint.sh | Task 16 | 🔴 Not Created |
| 18 | **Configure Entrypoint** | Set entrypoint in Dockerfile | Task 17 | 🔴 Not Created |
| 19 | **Expose Backend Port** | Expose port 8000 | Task 18 | 🔴 Not Created |
| 20 | **Create Backend Dockerfile.prod** | Production Dockerfile for Django | Task 09 | 🔴 Not Created |
| 21 | **Configure Production Multi-stage Build** | Optimize production image size | Task 20 | 🔴 Not Created |
| 22 | **Create backend/.dockerignore** | Backend-specific dockerignore | Task 09 | 🔴 Not Created |

---

### Group C: Frontend Dockerfile Creation (Tasks 23-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 23 | **Create Frontend Dockerfile.dev** | Development Dockerfile for Next.js | Task 03 | 🔴 Not Created |
| 24 | **Configure Node Base Image** | Use node:20-alpine as base | Task 23 | 🔴 Not Created |
| 25 | **Install pnpm Globally** | Install pnpm package manager | Task 24 | 🔴 Not Created |
| 26 | **Create Working Directory** | Set /app as working directory | Task 24 | 🔴 Not Created |
| 27 | **Copy Package Files** | Copy package.json and lock files | Task 26 | 🔴 Not Created |
| 28 | **Install Node Dependencies** | pnpm install | Task 27 | 🔴 Not Created |
| 29 | **Copy Application Code** | Copy frontend source code | Task 28 | 🔴 Not Created |
| 30 | **Expose Frontend Port** | Expose port 3000 | Task 29 | 🔴 Not Created |
| 31 | **Set Development Command** | pnpm dev as default command | Task 30 | 🔴 Not Created |
| 32 | **Create Frontend Dockerfile.prod** | Production Dockerfile for Next.js | Task 23 | 🔴 Not Created |
| 33 | **Configure Production Multi-stage Build** | Build and serve optimized | Task 32 | 🔴 Not Created |
| 34 | **Create frontend/.dockerignore** | Frontend-specific dockerignore | Task 23 | 🔴 Not Created |

---

### Group D: PostgreSQL Container Setup (Tasks 35-45)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create postgres/init.sql** | Database initialization script | Task 04 | 🔴 Not Created |
| 36 | **Create Main Database** | Create lankacommerce database | Task 35 | 🔴 Not Created |
| 37 | **Create Test Database** | Create test database for testing | Task 35 | 🔴 Not Created |
| 38 | **Create Database User** | Create application user | Task 35 | 🔴 Not Created |
| 39 | **Grant User Permissions** | Grant necessary permissions | Task 38 | 🔴 Not Created |
| 40 | **Enable UUID Extension** | Enable uuid-ossp extension | Task 36 | 🔴 Not Created |
| 41 | **Enable Hstore Extension** | Enable hstore extension | Task 36 | 🔴 Not Created |
| 42 | **Create postgres/postgresql.conf** | PostgreSQL configuration | Task 04 | 🔴 Not Created |
| 43 | **Configure Max Connections** | Set max_connections setting | Task 42 | 🔴 Not Created |
| 44 | **Configure Shared Buffers** | Optimize memory settings | Task 42 | 🔴 Not Created |
| 45 | **Create Backup Script** | postgres/backup.sh for backups | Task 04 | 🔴 Not Created |

---

### Group E: Redis Container Setup (Tasks 46-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 46 | **Create redis/redis.conf** | Redis configuration file | Task 05 | 🔴 Not Created |
| 47 | **Configure Redis Port** | Set port 6379 | Task 46 | 🔴 Not Created |
| 48 | **Configure Max Memory** | Set maxmemory limit | Task 46 | 🔴 Not Created |
| 49 | **Configure Memory Policy** | Set maxmemory-policy | Task 46 | 🔴 Not Created |
| 50 | **Configure Persistence** | Set up RDB/AOF persistence | Task 46 | 🔴 Not Created |
| 51 | **Configure Log Level** | Set loglevel setting | Task 46 | 🔴 Not Created |
| 52 | **Disable Protected Mode** | For development only | Task 46 | 🔴 Not Created |
| 53 | **Create Redis Health Check Script** | redis/healthcheck.sh | Task 05 | 🔴 Not Created |
| 54 | **Configure Save Intervals** | Set save frequency | Task 50 | 🔴 Not Created |

---

### Group F: Celery Services Setup (Tasks 55-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create Celery Worker Entrypoint** | docker/scripts/celery-worker.sh | Task 07 | 🔴 Not Created |
| 56 | **Configure Worker Concurrency** | Set worker processes | Task 55 | 🔴 Not Created |
| 57 | **Configure Worker Queues** | Define queue names | Task 55 | 🔴 Not Created |
| 58 | **Configure Worker Log Level** | Set log level for worker | Task 55 | 🔴 Not Created |
| 59 | **Create Celery Beat Entrypoint** | docker/scripts/celery-beat.sh | Task 07 | 🔴 Not Created |
| 60 | **Configure Beat Schedule Storage** | Database or file-based | Task 59 | 🔴 Not Created |
| 61 | **Configure Beat Log Level** | Set log level for beat | Task 59 | 🔴 Not Created |
| 62 | **Create Flower Service Script** | Celery monitoring UI | Task 07 | 🔴 Not Created |
| 63 | **Configure Flower Port** | Expose port 5555 | Task 62 | 🔴 Not Created |
| 64 | **Configure Flower Auth** | Basic authentication | Task 62 | 🔴 Not Created |
| 65 | **Create Celery Health Check** | docker/scripts/celery-health.sh | Task 55 | 🔴 Not Created |
| 66 | **Configure Worker Restart Policy** | Auto-restart on failure | Task 55 | 🔴 Not Created |

---

### Group G: Docker Compose Configuration (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create docker-compose.yml** | Main Docker Compose file | Task 01 | 🔴 Not Created |
| 68 | **Define Backend Service** | Django service configuration | Task 22, 67 | 🔴 Not Created |
| 69 | **Define Frontend Service** | Next.js service configuration | Task 34, 67 | 🔴 Not Created |
| 70 | **Define PostgreSQL Service** | Database service configuration | Task 45, 67 | 🔴 Not Created |
| 71 | **Define Redis Service** | Cache service configuration | Task 54, 67 | 🔴 Not Created |
| 72 | **Define Celery Worker Service** | Worker service configuration | Task 66, 67 | 🔴 Not Created |
| 73 | **Define Celery Beat Service** | Scheduler service configuration | Task 61, 67 | 🔴 Not Created |
| 74 | **Configure Docker Network** | Create custom bridge network | Task 67 | 🔴 Not Created |
| 75 | **Configure Volumes** | Define named volumes | Task 67 | 🔴 Not Created |
| 76 | **Configure Environment Files** | Link .env files | Task 67 | 🔴 Not Created |
| 77 | **Configure Health Checks** | Add health checks to services | Task 67 | 🔴 Not Created |
| 78 | **Configure Dependencies** | Service dependency order | Task 68-73 | 🔴 Not Created |
| 79 | **Create docker-compose.override.yml** | Development overrides | Task 67 | 🔴 Not Created |
| 80 | **Create docker-compose.prod.yml** | Production overrides | Task 67 | 🔴 Not Created |

---

### Group H: Development Scripts & Verification (Tasks 81-89)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Makefile** | Makefile for common commands | Task 67 | 🔴 Not Created |
| 82 | **Add Make: build** | Build all containers | Task 81 | 🔴 Not Created |
| 83 | **Add Make: up** | Start all services | Task 81 | 🔴 Not Created |
| 84 | **Add Make: down** | Stop all services | Task 81 | 🔴 Not Created |
| 85 | **Add Make: logs** | View service logs | Task 81 | 🔴 Not Created |
| 86 | **Add Make: shell** | Enter container shell | Task 81 | 🔴 Not Created |
| 87 | **Add Make: migrate** | Run Django migrations | Task 81 | 🔴 Not Created |
| 88 | **Verify Full Stack Startup** | Test docker-compose up | Task 80 | 🔴 Not Created |
| 89 | **Create Initial Commit** | Commit all Docker setup | Task 88 | 🔴 Not Created |

---

## Task Details

### Task 09: Create Backend Dockerfile.dev

**Goal:** Create development Dockerfile for Django backend.

**Content:**
```dockerfile
# docker/backend/Dockerfile.dev
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for layer caching)
COPY requirements/base.txt requirements/base.txt
COPY requirements/local.txt requirements/local.txt

# Install Python dependencies
RUN pip install -r requirements/local.txt

# Copy entrypoint script
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy application code
COPY backend/ .

# Expose port
EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Default command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

---

### Task 17: Create Entrypoint Script

**Goal:** Create entrypoint script for Django container.

**Content:**
```bash
#!/bin/bash
# docker/backend/entrypoint.sh

set -e

echo "Waiting for PostgreSQL..."
while ! pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER; do
    sleep 1
done
echo "PostgreSQL is ready!"

echo "Waiting for Redis..."
while ! redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; do
    sleep 1
done
echo "Redis is ready!"

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
if [ "$DJANGO_ENV" = "production" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Execute the command
exec "$@"
```

---

### Task 67: Create docker-compose.yml

**Goal:** Create main Docker Compose configuration.

**Content:**
```yaml
# docker-compose.yml
version: "3.9"

services:
  backend:
    build:
      context: .
      dockerfile: docker/backend/Dockerfile.dev
    container_name: lcc_backend
    volumes:
      - ./backend:/app
      - backend_static:/app/staticfiles
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.local
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - lcc_network

  frontend:
    build:
      context: .
      dockerfile: docker/frontend/Dockerfile.dev
    container_name: lcc_frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
    depends_on:
      - backend
    networks:
      - lcc_network

  postgres:
    image: postgres:15-alpine
    container_name: lcc_postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRES_USER=${DATABASE_USER:-postgres}
      - POSTGRES_PASSWORD=${DATABASE_PASSWORD:-postgres}
      - POSTGRES_DB=${DATABASE_NAME:-lankacommerce}
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - lcc_network

  redis:
    image: redis:7-alpine
    container_name: lcc_redis
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - lcc_network

  celery_worker:
    build:
      context: .
      dockerfile: docker/backend/Dockerfile.dev
    container_name: lcc_celery_worker
    command: celery -A config worker -l INFO
    volumes:
      - ./backend:/app
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.local
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
    env_file:
      - .env
    depends_on:
      - backend
      - redis
    networks:
      - lcc_network

  celery_beat:
    build:
      context: .
      dockerfile: docker/backend/Dockerfile.dev
    container_name: lcc_celery_beat
    command: celery -A config beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler
    volumes:
      - ./backend:/app
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.local
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
    env_file:
      - .env
    depends_on:
      - backend
      - redis
      - postgres
    networks:
      - lcc_network

networks:
  lcc_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  backend_static:
```

---

### Task 81: Create Makefile

**Goal:** Create Makefile for common Docker commands.

**Content:**
```makefile
# Makefile

.PHONY: help build up down restart logs shell migrate test clean

# Default target
help:
	@echo "LankaCommerce Cloud - Development Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build      Build all Docker containers"
	@echo "  up         Start all services"
	@echo "  down       Stop all services"
	@echo "  restart    Restart all services"
	@echo "  logs       View all logs"
	@echo "  shell      Enter backend container shell"
	@echo "  migrate    Run Django migrations"
	@echo "  test       Run all tests"
	@echo "  clean      Remove all containers and volumes"

# Build containers
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start with logs
up-logs:
	docker-compose up

# Stop all services
down:
	docker-compose down

# Restart all services
restart: down up

# View logs
logs:
	docker-compose logs -f

# Enter backend shell
shell:
	docker-compose exec backend bash

# Run migrations
migrate:
	docker-compose exec backend python manage.py migrate

# Create superuser
superuser:
	docker-compose exec backend python manage.py createsuperuser

# Run tests
test:
	docker-compose exec backend python manage.py test

# Clean everything
clean:
	docker-compose down -v --rmi all
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── docker/
│   ├── backend/
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   └── entrypoint.sh
│   ├── frontend/
│   │   ├── Dockerfile.dev
│   │   └── Dockerfile.prod
│   ├── postgres/
│   │   ├── init.sql
│   │   ├── postgresql.conf
│   │   └── backup.sh
│   ├── redis/
│   │   ├── redis.conf
│   │   └── healthcheck.sh
│   ├── nginx/
│   │   └── nginx.conf
│   └── scripts/
│       ├── celery-worker.sh
│       ├── celery-beat.sh
│       ├── celery-health.sh
│       └── flower.sh
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── Makefile
└── .dockerignore
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 89 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 89 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before Group B, etc.
2. **Dependencies:** Verify SubPhase-02 and SubPhase-03 are complete
3. **Docker Version:** Ensure Docker 24+ and Docker Compose v2
4. **Volume Mounts:** Use proper paths for hot reload
5. **Health Checks:** All critical services must have health checks
6. **Network:** Use custom bridge network for inter-service communication
7. **Environment:** Never commit real secrets to .env files
8. **Testing:** Run `docker-compose up` to verify all services start
9. **Ports:** Ensure no port conflicts with local services
