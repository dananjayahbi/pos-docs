# Tasks 61-63: Docker Compose & Makefile

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** F - Root Configuration Files  
> **Document:** 01 of 02  
> **Tasks Covered:** 61, 62, 63

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Shared-Support-Directories/](../Group-E_Shared-Support-Directories/)
- **→ Next Document:** [02_Tasks-64-67_GitHub-VSCode.md](02_Tasks-64-67_GitHub-VSCode.md)

---

## Document Overview

This document covers the creation of Docker Compose configuration files for development and production environments, as well as the Makefile for command shortcuts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create docker-compose.yml | Complex |
| 62 | Create docker-compose.prod.yml | Medium |
| 63 | Create Makefile | Complex |

---

## Task 61: Create docker-compose.yml

### Overview
Create the development Docker Compose configuration file that orchestrates all services needed for local development.

### Dependencies
- Task 14: Create docker/ Directory (Group B)

### Instructions

1. **Create the docker-compose.yml file**
   - Create a file named `docker-compose.yml` in the project root
   - This is the main development orchestration file

2. **Define version and networks**
   - Use Docker Compose version 3.8 or later
   - Define a custom bridge network for service communication

3. **Configure backend service**
   - Use Python 3.12 slim image as base
   - Mount backend directory for hot reload
   - Expose port 8000
   - Set development environment variables
   - Depend on database and Redis services

4. **Configure database service**
   - Use PostgreSQL 15 image
   - Configure persistent volume for data
   - Set database credentials from environment

5. **Configure Redis service**
   - Use Redis 7 Alpine image
   - Configure persistent volume
   - Expose internal port 6379

6. **Configure Celery worker service**
   - Use same image as backend
   - Run Celery worker command
   - Depend on Redis and database

7. **Configure Celery beat service**
   - Use same image as backend
   - Run Celery beat scheduler
   - Depend on Redis and database

8. **Configure frontend service**
   - Use Node 20 Alpine image
   - Mount frontend directory for hot reload
   - Expose port 3000
   - Enable Next.js Fast Refresh

9. **Define volumes**
   - PostgreSQL data volume
   - Redis data volume
   - Node modules volume (for performance)

### Development Services Configuration

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `backend` | python:3.12-slim | 8000 | Django API server |
| `db` | postgres:15-alpine | 5432 | PostgreSQL database |
| `redis` | redis:7-alpine | 6379 | Cache and broker |
| `celery` | python:3.12-slim | - | Background worker |
| `celery-beat` | python:3.12-slim | - | Task scheduler |
| `frontend` | node:20-alpine | 3000 | Next.js dev server |

### Environment Variables

| Variable | Service | Purpose |
|----------|---------|---------|
| `DEBUG` | backend | Enable Django debug mode |
| `DATABASE_URL` | backend | PostgreSQL connection |
| `REDIS_URL` | backend, celery | Redis connection |
| `SECRET_KEY` | backend | Django secret key |
| `POSTGRES_DB` | db | Database name |
| `POSTGRES_USER` | db | Database user |
| `POSTGRES_PASSWORD` | db | Database password |

### Volume Mounts (Development)

| Mount | Purpose |
|-------|---------|
| `./backend:/app` | Backend code hot reload |
| `./frontend:/app` | Frontend code hot reload |
| `postgres_data:/var/lib/postgresql/data` | Database persistence |
| `redis_data:/data` | Redis persistence |

### Network Configuration

| Network | Driver | Purpose |
|---------|--------|---------|
| `lcc_network` | bridge | Internal service communication |

### Expected Outcome
```
lankacommerce-cloud/
├── docker-compose.yml       # Development compose file
└── ...
```

### Verification Checklist
- [ ] `docker-compose.yml` file exists in project root
- [ ] All services are defined (backend, db, redis, celery, frontend)
- [ ] Environment variables are configured
- [ ] Volumes are defined for persistence
- [ ] Network is configured

---

## Task 62: Create docker-compose.prod.yml

### Overview
Create the production Docker Compose override file that extends the development configuration with production-specific settings.

### Dependencies
- Task 61: Create docker-compose.yml

### Instructions

1. **Create the docker-compose.prod.yml file**
   - Create a file named `docker-compose.prod.yml` in the project root
   - This extends docker-compose.yml for production

2. **Override backend service**
   - Use production Dockerfile
   - Remove volume mounts (use built image)
   - Use Gunicorn instead of Django dev server
   - Disable DEBUG mode
   - Set proper worker count

3. **Override frontend service**
   - Use production build
   - Remove volume mounts
   - Build static assets
   - Use standalone Next.js output

4. **Add nginx service**
   - Use nginx:alpine image
   - Configure as reverse proxy
   - Serve static files
   - Handle SSL termination
   - Expose ports 80 and 443

5. **Configure health checks**
   - Add health check for backend
   - Add health check for database
   - Add health check for nginx

6. **Set resource limits**
   - Configure memory limits
   - Configure CPU limits
   - Set restart policies

### Production-Specific Overrides

| Service | Development | Production |
|---------|-------------|------------|
| **backend** | Django dev server | Gunicorn with workers |
| **backend** | Code mounted | Built image |
| **backend** | DEBUG=True | DEBUG=False |
| **frontend** | Next.js dev server | Built static/standalone |
| **frontend** | Hot reload | No hot reload |
| **nginx** | Not present | Reverse proxy |

### Nginx Service Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `image` | nginx:alpine | Lightweight nginx |
| `ports` | 80, 443 | HTTP and HTTPS |
| `volumes` | nginx conf, certs | Configuration |
| `depends_on` | backend, frontend | Wait for upstreams |

### Production Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | Database persistence |
| `redis_data` | Redis persistence |
| `static_files` | Django static files |
| `media_files` | Uploaded media files |
| `nginx_certs` | SSL certificates |

### Resource Limits (Example)

| Service | Memory Limit | CPU Limit |
|---------|--------------|-----------|
| `backend` | 1G | 1.0 |
| `db` | 2G | 1.0 |
| `redis` | 512M | 0.5 |
| `celery` | 1G | 1.0 |
| `nginx` | 256M | 0.5 |

### Expected Outcome
```
lankacommerce-cloud/
├── docker-compose.prod.yml  # Production overrides
├── docker-compose.yml       # Development compose
└── ...
```

### Production Usage Command
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Verification Checklist
- [ ] `docker-compose.prod.yml` file exists in project root
- [ ] Backend uses Gunicorn
- [ ] Frontend uses production build
- [ ] Nginx service is configured
- [ ] Health checks are defined
- [ ] Resource limits are set

---

## Task 63: Create Makefile

### Overview
Create a Makefile with common development commands and shortcuts for easier project management.

### Dependencies
- Task 01: Initialize Git Repository (Group A)

### Instructions

1. **Create the Makefile**
   - Create a file named `Makefile` in the project root
   - Use proper Makefile syntax with tabs for indentation

2. **Add help command**
   - Default target that shows available commands
   - Use self-documenting pattern with comments

3. **Add Docker commands**
   - `up`: Start all containers
   - `down`: Stop all containers
   - `build`: Build containers
   - `logs`: View container logs
   - `restart`: Restart containers

4. **Add development commands**
   - `dev`: Start development environment
   - `shell`: Open Django shell
   - `dbshell`: Open database shell
   - `migrate`: Run migrations
   - `makemigrations`: Create migrations

5. **Add testing commands**
   - `test`: Run all tests
   - `test-backend`: Run backend tests
   - `test-frontend`: Run frontend tests
   - `coverage`: Run tests with coverage

6. **Add code quality commands**
   - `lint`: Run all linters
   - `lint-backend`: Run Python linters
   - `lint-frontend`: Run frontend linters
   - `format`: Format all code

7. **Add utility commands**
   - `clean`: Clean temporary files
   - `seed`: Seed database
   - `backup`: Backup database
   - `restore`: Restore database

### Makefile Command Categories

| Category | Commands |
|----------|----------|
| **Docker** | up, down, build, logs, restart, ps |
| **Development** | dev, shell, dbshell, migrate, makemigrations |
| **Testing** | test, test-backend, test-frontend, coverage |
| **Quality** | lint, lint-backend, lint-frontend, format |
| **Utilities** | clean, seed, backup, restore, help |

### Essential Make Targets

| Target | Description | Command |
|--------|-------------|---------|
| `help` | Show available commands | Display formatted help |
| `dev` | Start development | docker compose up -d |
| `up` | Start containers | docker compose up -d |
| `down` | Stop containers | docker compose down |
| `logs` | View logs | docker compose logs -f |
| `migrate` | Run migrations | docker compose exec backend python manage.py migrate |
| `shell` | Django shell | docker compose exec backend python manage.py shell |
| `test` | Run all tests | Run backend and frontend tests |
| `lint` | Run linters | Run all configured linters |

### Self-Documenting Pattern

Each target should have a comment that describes it:
```makefile
## Start development environment
dev: up
	@echo "Development environment started"
```

### Phony Targets

Declare all non-file targets as PHONY:
```makefile
.PHONY: help dev up down build logs test lint format
```

### Expected Outcome
```
lankacommerce-cloud/
├── docker-compose.prod.yml
├── docker-compose.yml
├── Makefile                 # Command shortcuts
└── ...
```

### Common Make Commands Reference

| Command | What It Does |
|---------|--------------|
| `make` | Show help (default) |
| `make dev` | Start development environment |
| `make up` | Start all containers |
| `make down` | Stop all containers |
| `make logs` | View container logs |
| `make migrate` | Run database migrations |
| `make shell` | Open Django shell |
| `make test` | Run all tests |
| `make lint` | Run all linters |
| `make format` | Format all code |
| `make clean` | Clean temporary files |

### Verification Checklist
- [ ] `Makefile` file exists in project root
- [ ] `make help` shows available commands
- [ ] Docker commands work correctly
- [ ] Development commands are functional
- [ ] Tab characters are used (not spaces)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 61 | Create docker-compose.yml | Development Docker orchestration |
| 62 | Create docker-compose.prod.yml | Production Docker overrides |
| 63 | Create Makefile | Command shortcuts |

### Final Structure After This Document
```
lankacommerce-cloud/
├── docker-compose.prod.yml  # Production overrides
├── docker-compose.yml       # Development compose
├── Makefile                 # Command shortcuts
└── ...
```

### Docker Services Summary

| Environment | Services |
|-------------|----------|
| **Development** | backend, db, redis, celery, celery-beat, frontend |
| **Production** | All above + nginx |

### Next Steps
Proceed to [02_Tasks-64-67_GitHub-VSCode.md](02_Tasks-64-67_GitHub-VSCode.md) to complete GitHub and VS Code configurations.

---

## Notes for AI Agents

1. **Makefile Syntax:** Must use tabs, not spaces, for command indentation
2. **Docker Compose:** Use version 3.8+ for modern features
3. **Production Overrides:** docker-compose.prod.yml extends the base file
4. **Environment Variables:** Use .env file for sensitive values
5. **Git Commit:** Do NOT commit yet - wait until all Group F tasks are complete
