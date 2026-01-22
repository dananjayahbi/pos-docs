# Tasks 05-08: Support Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** A - Docker Directory Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Main-Directories.md](01_Tasks-01-04_Main-Directories.md)
- **→ Next Group:** [../Group-B_Backend-Dockerfile-Creation/00_GROUP_OVERVIEW.md](../Group-B_Backend-Dockerfile-Creation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the remaining support directories for Redis, Nginx, scripts, and the root .dockerignore file.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Create docker/redis/ Directory | Simple |
| 06 | Create docker/nginx/ Directory | Simple |
| 07 | Create docker/scripts/ Directory | Simple |
| 08 | Create .dockerignore (Root) | Medium |

---

## Task 05: Create docker/redis/ Directory

### Overview
Create the Redis Docker directory for cache and message broker configuration.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create redis directory**
   - Inside docker/

2. **Add README**
   - Document Redis usage

3. **Plan configuration files**
   - redis.conf if needed

### Directory Location

```
docker/
└── redis/
    └── README.md
```

### README Content

```markdown
# Redis Docker Configuration

Configuration files for the Redis container used for caching and Celery message broker.

## Usage

Redis serves two purposes in LCC:
1. **Caching** - Django cache backend
2. **Message Broker** - Celery task queue

## Configuration

For development, default Redis configuration is sufficient.
For production, custom redis.conf may be needed.

## Files (if needed)

- `redis.conf` - Custom Redis configuration (optional)

## Connection

- Host: redis (Docker network)
- Port: 6379
- Database 0: Django cache
- Database 1: Celery broker
```

### Redis Databases

| Database | Purpose |
|----------|---------|
| 0 | Django cache |
| 1 | Celery broker |
| 2 | Celery results |

### Expected Outcome
- redis/ directory exists
- Purpose documented

### Verification Checklist
- [ ] Directory created at docker/redis/
- [ ] README.md added
- [ ] Usage documented

---

## Task 06: Create docker/nginx/ Directory

### Overview
Create the Nginx Docker directory for reverse proxy configuration.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create nginx directory**
   - Inside docker/

2. **Create conf.d subdirectory**
   - For server configurations

3. **Add README**
   - Document Nginx usage

### Directory Location

```
docker/
└── nginx/
    ├── conf.d/
    │   └── .gitkeep
    └── README.md
```

### README Content

```markdown
# Nginx Docker Configuration

Reverse proxy configuration for production deployments.

## Directory Structure

```
nginx/
├── conf.d/               # Server block configurations
│   └── default.conf      # Main site configuration
├── nginx.conf            # Main Nginx configuration
└── README.md
```

## Usage

Nginx is primarily used in production for:
- Reverse proxy to Django (Gunicorn)
- Serving Next.js static files
- SSL termination
- Load balancing

## Development

In development, Nginx is optional. Services are accessed directly:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Production

In production, Nginx routes all traffic:
- / → Next.js frontend
- /api → Django backend
- /static → Static files
- /media → User uploads
```

### Configuration Files

| File | Purpose |
|------|---------|
| nginx.conf | Main config |
| conf.d/default.conf | Site config |
| conf.d/ssl.conf | SSL settings |

### Expected Outcome
- nginx/ directory exists
- conf.d/ subdirectory ready

### Verification Checklist
- [ ] Directory created at docker/nginx/
- [ ] conf.d/ subdirectory created
- [ ] README.md added
- [ ] .gitkeep in conf.d/

---

## Task 07: Create docker/scripts/ Directory

### Overview
Create the scripts directory for Docker utility scripts.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create scripts directory**
   - Inside docker/

2. **Add README**
   - Document script purposes

3. **Plan utility scripts**
   - Health checks, helpers

### Directory Location

```
docker/
└── scripts/
    └── README.md
```

### README Content

```markdown
# Docker Utility Scripts

Utility scripts for managing Docker containers and services.

## Scripts

### Container Management

- `wait-for-it.sh` - Wait for service availability
- `healthcheck.sh` - Container health check script

### Database Management

- `backup-db.sh` - Backup PostgreSQL database
- `restore-db.sh` - Restore database from backup

### Development Helpers

- `reset-dev.sh` - Reset development environment
- `seed-data.sh` - Seed development data

## Usage

Scripts are mounted into containers or run from host:

```bash
# Run from host
./docker/scripts/reset-dev.sh

# Inside container
/scripts/healthcheck.sh
```

## Making Scripts Executable

```bash
chmod +x docker/scripts/*.sh
```
```

### Planned Scripts

| Script | Purpose |
|--------|---------|
| wait-for-it.sh | Wait for dependencies |
| healthcheck.sh | Container health |
| backup-db.sh | Database backup |
| restore-db.sh | Database restore |
| reset-dev.sh | Reset dev env |

### Expected Outcome
- scripts/ directory exists
- Purpose documented

### Verification Checklist
- [ ] Directory created at docker/scripts/
- [ ] README.md added
- [ ] Scripts planned

---

## Task 08: Create .dockerignore (Root)

### Overview
Create the root .dockerignore file to exclude unnecessary files from Docker build context.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create .dockerignore**
   - At monorepo root

2. **Exclude common patterns**
   - Dependencies, caches

3. **Exclude sensitive files**
   - Env files, secrets

4. **Optimize build context**
   - Smaller, faster builds

### File Location

```
lankacommerce-cloud/
├── .dockerignore     # NEW
├── .gitignore
├── docker/
└── ...
```

### .dockerignore Content

```dockerignore
# ==================================================
# LankaCommerce Cloud - Docker Ignore
# ==================================================
# Files and directories to exclude from Docker build context

# --------------------------------------------------
# Git
# --------------------------------------------------
.git
.gitignore
.gitattributes

# --------------------------------------------------
# IDE / Editor
# --------------------------------------------------
.idea/
.vscode/
*.swp
*.swo
*~
.DS_Store

# --------------------------------------------------
# Python
# --------------------------------------------------
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
.venv/
venv/
env/
.env
.env.*
!.env.example
*.egg-info/
.eggs/
dist/
build/
.mypy_cache/
.pytest_cache/
.coverage
htmlcov/
.tox/

# --------------------------------------------------
# Node.js
# --------------------------------------------------
node_modules/
.npm
.pnpm-store/
.next/
out/
.turbo/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# --------------------------------------------------
# Testing
# --------------------------------------------------
coverage/
.nyc_output/
test-results/
playwright-report/

# --------------------------------------------------
# Documentation
# --------------------------------------------------
docs/
*.md
!README.md
LICENSE

# --------------------------------------------------
# Docker (recursive)
# --------------------------------------------------
docker/
Dockerfile*
docker-compose*.yml
.dockerignore

# --------------------------------------------------
# Misc
# --------------------------------------------------
*.log
*.tmp
*.temp
*.bak
*.backup
Thumbs.db
```

### Why Exclude These

| Category | Reason |
|----------|--------|
| .git | Not needed, adds size |
| node_modules | Installed in container |
| __pycache__ | Python bytecode |
| .venv | Installed in container |
| .env | Security, use build args |
| docs | Not needed for runtime |

### Build Context Size

Excluding these files:
- Faster builds
- Smaller context transfer
- Cleaner images

### Expected Outcome
- .dockerignore created
- Optimized build context

### Verification Checklist
- [ ] File exists at root
- [ ] Python exclusions
- [ ] Node.js exclusions
- [ ] Environment files excluded
- [ ] Dependencies excluded

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Create docker/redis/ Directory | Redis configs |
| 06 | Create docker/nginx/ Directory | Nginx configs |
| 07 | Create docker/scripts/ Directory | Utility scripts |
| 08 | Create .dockerignore (Root) | Build context optimization |

### Final Directory Structure

```
lankacommerce-cloud/
├── .dockerignore             # NEW
├── docker/
│   ├── README.md
│   ├── backend/
│   │   └── README.md
│   ├── frontend/
│   │   └── README.md
│   ├── nginx/
│   │   ├── conf.d/
│   │   │   └── .gitkeep
│   │   └── README.md
│   ├── postgres/
│   │   ├── init/
│   │   │   └── .gitkeep
│   │   └── README.md
│   ├── redis/
│   │   └── README.md
│   └── scripts/
│       └── README.md
└── ...
```

### Group A Complete

All Docker directory setup tasks completed:
- Main docker/ directory
- Service-specific subdirectories
- README documentation in each
- Root .dockerignore file

### Next Steps
Proceed to [../Group-B_Backend-Dockerfile-Creation/00_GROUP_OVERVIEW.md](../Group-B_Backend-Dockerfile-Creation/00_GROUP_OVERVIEW.md) for Backend Dockerfile creation.

---

## Notes for AI Agents

1. **Structure first:** Directories before Dockerfiles
2. **README files:** Document each directory purpose
3. **.dockerignore:** Optimizes build context
4. **init/ scripts:** Auto-run on first DB start
5. **conf.d/:** Nginx modular configuration
6. **Git:** Commit after Group A complete
