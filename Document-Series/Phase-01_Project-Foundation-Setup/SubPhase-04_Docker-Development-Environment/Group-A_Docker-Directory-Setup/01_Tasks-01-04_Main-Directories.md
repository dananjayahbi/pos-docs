# Tasks 01-04: Main Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** A - Docker Directory Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous SubPhase:** [../../SubPhase-03_Frontend-Project-Initialization/Group-G_Core-Dependencies-Config-Files/03_Tasks-80-82_Verification.md](../../SubPhase-03_Frontend-Project-Initialization/Group-G_Core-Dependencies-Config-Files/03_Tasks-80-82_Verification.md)
- **→ Next Document:** [02_Tasks-05-08_Support-Directories.md](02_Tasks-05-08_Support-Directories.md)

---

## Document Overview

This document covers creating the main Docker directory and primary service subdirectories for backend, frontend, and PostgreSQL configurations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create docker/ Directory | Simple |
| 02 | Create docker/backend/ Directory | Simple |
| 03 | Create docker/frontend/ Directory | Simple |
| 04 | Create docker/postgres/ Directory | Simple |

---

## Task 01: Create docker/ Directory

### Overview
Create the main docker directory at the monorepo root to contain all containerization configuration.

### Dependencies
- SubPhase-01: Monorepo Structure Setup (complete)

### Instructions

1. **Create docker directory**
   - At monorepo root level

2. **Add README.md**
   - Document purpose

3. **Add .gitkeep**
   - Ensure tracking

### Directory Location

```
lankacommerce-cloud/
├── backend/
├── frontend/
├── docker/           # NEW
│   └── README.md
├── docs/
└── ...
```

### README Content

```markdown
# Docker Configuration

This directory contains Docker configuration files for the LankaCommerce Cloud development environment.

## Directory Structure

```
docker/
├── backend/     # Backend Dockerfile and related files
├── frontend/    # Frontend Dockerfile and related files
├── nginx/       # Nginx reverse proxy configuration
├── postgres/    # PostgreSQL initialization scripts
├── redis/       # Redis configuration
└── scripts/     # Utility scripts
```

## Usage

Development environment is managed via Docker Compose:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```
```

### Expected Outcome
- docker/ directory exists
- README.md documents structure

### Verification Checklist
- [ ] Directory created at monorepo root
- [ ] README.md added
- [ ] Git tracks directory

---

## Task 02: Create docker/backend/ Directory

### Overview
Create the backend Docker directory for Django application containerization.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create backend directory**
   - Inside docker/

2. **Add placeholder README**
   - Document contents

3. **Plan Dockerfile locations**
   - Development vs production

### Directory Location

```
docker/
└── backend/
    └── README.md
```

### README Content

```markdown
# Backend Docker Configuration

Docker configuration files for the Django backend application.

## Files

- `Dockerfile.dev` - Development Dockerfile with hot reload
- `Dockerfile.prod` - Production Dockerfile with optimizations
- `entrypoint.sh` - Container entrypoint script
- `start-dev.sh` - Development server startup script

## Development Image Features

- Python 3.12 base
- Hot reload with Watchdog
- Debug mode enabled
- Development dependencies included

## Production Image Features

- Multi-stage build
- Minimal dependencies
- Gunicorn WSGI server
- Static files collected
```

### Files to Create Later

| File | Purpose |
|------|---------|
| Dockerfile.dev | Development build |
| Dockerfile.prod | Production build |
| entrypoint.sh | Startup script |
| start-dev.sh | Dev server start |

### Expected Outcome
- backend/ directory exists
- Purpose documented

### Verification Checklist
- [ ] Directory created at docker/backend/
- [ ] README.md added
- [ ] Structure planned

---

## Task 03: Create docker/frontend/ Directory

### Overview
Create the frontend Docker directory for Next.js application containerization.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create frontend directory**
   - Inside docker/

2. **Add placeholder README**
   - Document contents

3. **Plan Dockerfile locations**
   - Development vs production

### Directory Location

```
docker/
└── frontend/
    └── README.md
```

### README Content

```markdown
# Frontend Docker Configuration

Docker configuration files for the Next.js frontend application.

## Files

- `Dockerfile.dev` - Development Dockerfile with hot reload
- `Dockerfile.prod` - Production Dockerfile with optimizations

## Development Image Features

- Node.js 20 LTS base
- pnpm package manager
- Hot reload enabled
- Development dependencies included

## Production Image Features

- Multi-stage build
- Static assets optimized
- Next.js standalone output
- Minimal final image
```

### Files to Create Later

| File | Purpose |
|------|---------|
| Dockerfile.dev | Development build |
| Dockerfile.prod | Production build |

### Expected Outcome
- frontend/ directory exists
- Purpose documented

### Verification Checklist
- [ ] Directory created at docker/frontend/
- [ ] README.md added
- [ ] Structure planned

---

## Task 04: Create docker/postgres/ Directory

### Overview
Create the PostgreSQL Docker directory for database initialization and configuration.

### Dependencies
- Task 01: Create docker/ Directory

### Instructions

1. **Create postgres directory**
   - Inside docker/

2. **Create init directory**
   - For initialization scripts

3. **Add README**
   - Document init script usage

### Directory Location

```
docker/
└── postgres/
    ├── init/
    │   └── .gitkeep
    └── README.md
```

### README Content

```markdown
# PostgreSQL Docker Configuration

Configuration files for the PostgreSQL database container.

## Directory Structure

```
postgres/
├── init/              # Initialization scripts
│   └── 01-init.sql    # Initial database setup
└── README.md
```

## Initialization Scripts

Scripts in `init/` run automatically when the PostgreSQL container starts for the first time, in alphabetical order.

### Script Naming Convention

- `01-init.sql` - Create databases and extensions
- `02-users.sql` - Create application users
- `03-permissions.sql` - Grant permissions

## Multi-Tenant Setup

For django-tenants, the public schema contains:
- Tenant registry table
- Shared lookup tables

Each tenant gets their own schema automatically.
```

### Init Script Order

| Order | Script | Purpose |
|-------|--------|---------|
| 01 | init.sql | Extensions, public schema |
| 02 | users.sql | Application users |
| 03 | permissions.sql | Grant access |

### Expected Outcome
- postgres/ directory exists
- init/ subdirectory ready

### Verification Checklist
- [ ] Directory created at docker/postgres/
- [ ] init/ subdirectory created
- [ ] README.md added
- [ ] .gitkeep in init/

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create docker/ Directory | Main Docker directory |
| 02 | Create docker/backend/ Directory | Backend configs |
| 03 | Create docker/frontend/ Directory | Frontend configs |
| 04 | Create docker/postgres/ Directory | PostgreSQL configs |

### Directories Created

```
docker/
├── README.md
├── backend/
│   └── README.md
├── frontend/
│   └── README.md
└── postgres/
    ├── init/
    │   └── .gitkeep
    └── README.md
```

### Next Steps
Proceed to [02_Tasks-05-08_Support-Directories.md](02_Tasks-05-08_Support-Directories.md) for remaining directories.

---

## Notes for AI Agents

1. **Structure first:** Create directories before files
2. **README files:** Document purpose in each
3. **init/ scripts:** Run once on first container start
4. **Multi-stage builds:** Will use for production
5. **.gitkeep:** Track empty directories
6. **Git:** Do NOT commit yet - complete Group A first
