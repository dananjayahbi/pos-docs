# Tasks 11-15: Main Directories Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** B - Root Directory Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 11, 12, 13, 14, 15

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Repository-Initialization/](../Group-A_Repository-Initialization/)
- **→ Next Document:** [02_Tasks-16-20_Support-Directories.md](02_Tasks-16-20_Support-Directories.md)

---

## Document Overview

This document covers the creation of the five main application directories that form the core structure of the LankaCommerce Cloud monorepo. These directories separate backend, frontend, shared resources, Docker configuration, and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Create backend/ Directory | Simple |
| 12 | Create frontend/ Directory | Simple |
| 13 | Create shared/ Directory | Simple |
| 14 | Create docker/ Directory | Simple |
| 15 | Create docs/ Directory | Simple |

---

## Task 11: Create backend/ Directory

### Overview
Create the main backend directory that will contain the Django application and all Python-related code.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the backend directory**
   - Create a directory named `backend/` in the root of the project
   - This will be the home for all Django/Python code

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Django project configuration
   - Django applications (apps)
   - Python utilities and helpers
   - API endpoints (DRF)
   - Background tasks (Celery)
   - Database models and migrations

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `apps/` | Django applications |
| `config/` | Django settings and configuration |
| `core/` | Core utilities, base models, mixins |
| `tests/` | Backend unit and integration tests |
| `requirements/` | Python dependency files |
| `locale/` | Translation files |

### Expected Outcome
```
lankacommerce-cloud/
├── backend/
│   └── .gitkeep
└── ... (other root files)
```

### Verification Checklist
- [ ] `backend/` directory exists in project root
- [ ] `.gitkeep` file exists inside `backend/`
- [ ] Directory is tracked by Git

---

## Task 12: Create frontend/ Directory

### Overview
Create the main frontend directory that will contain the Next.js application and all TypeScript/JavaScript code.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the frontend directory**
   - Create a directory named `frontend/` in the root of the project
   - This will be the home for all Next.js/React code

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Next.js application with App Router
   - React components library
   - TypeScript type definitions
   - State management (Zustand)
   - API client services
   - Styles (Tailwind CSS)

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `app/` | Next.js App Router pages |
| `components/` | Reusable React components |
| `lib/` | Utility functions and helpers |
| `hooks/` | Custom React hooks |
| `types/` | TypeScript type definitions |
| `stores/` | State management (Zustand) |
| `services/` | API client functions |
| `styles/` | Global styles, Tailwind config |

### Expected Outcome
```
lankacommerce-cloud/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
└── ... (other root files)
```

### Verification Checklist
- [ ] `frontend/` directory exists in project root
- [ ] `.gitkeep` file exists inside `frontend/`
- [ ] Directory is tracked by Git

---

## Task 13: Create shared/ Directory

### Overview
Create the shared resources directory that will contain types, constants, and utilities shared between different parts of the frontend (POS, Webstore, ERP Dashboard).

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the shared directory**
   - Create a directory named `shared/` in the root of the project
   - This will contain resources shared across frontend applications

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Shared TypeScript type definitions
   - Common constants (status codes, enums)
   - Shared utility functions
   - API response types
   - Common validation schemas

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `types/` | Shared TypeScript interfaces and types |
| `constants/` | Shared constants and enums |
| `utils/` | Shared utility functions (if needed) |

### Use Cases
- **Type Definitions:** Invoice type used by both POS and Webstore
- **Constants:** Order status enums consistent across platforms
- **Validation:** Shared Zod schemas for form validation

### Expected Outcome
```
lankacommerce-cloud/
├── backend/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── shared/
│   └── .gitkeep
└── ... (other root files)
```

### Verification Checklist
- [ ] `shared/` directory exists in project root
- [ ] `.gitkeep` file exists inside `shared/`
- [ ] Directory is tracked by Git

---

## Task 14: Create docker/ Directory

### Overview
Create the Docker configuration directory that will contain Dockerfiles and related configuration for containerization.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the docker directory**
   - Create a directory named `docker/` in the root of the project
   - This will contain all Docker-related configuration

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Dockerfiles for each service
   - Docker-specific configuration files
   - Nginx configuration for production
   - Service-specific entrypoint scripts

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `backend/` | Backend Dockerfile and entrypoint |
| `frontend/` | Frontend Dockerfile and entrypoint |
| `nginx/` | Nginx configuration for reverse proxy |
| `celery/` | Celery worker configuration (optional) |

### Container Architecture
| Service | Base Image | Purpose |
|---------|------------|---------|
| Backend | python:3.12-slim | Django application server |
| Frontend | node:20-alpine | Next.js application server |
| Nginx | nginx:alpine | Reverse proxy (production) |
| PostgreSQL | postgres:15 | Database server |
| Redis | redis:7-alpine | Cache and message broker |

### Expected Outcome
```
lankacommerce-cloud/
├── backend/
│   └── .gitkeep
├── docker/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── shared/
│   └── .gitkeep
└── ... (other root files)
```

### Verification Checklist
- [ ] `docker/` directory exists in project root
- [ ] `.gitkeep` file exists inside `docker/`
- [ ] Directory is tracked by Git

---

## Task 15: Create docs/ Directory

### Overview
Create the documentation directory that will contain project documentation, API references, architecture decisions, and developer guides.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the docs directory**
   - Create a directory named `docs/` in the root of the project
   - This will contain all project documentation

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - API documentation
   - Architecture Decision Records (ADRs)
   - Developer guides and tutorials
   - Deployment guides
   - User documentation

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `api/` | API endpoint documentation |
| `architecture/` | Architecture Decision Records |
| `guides/` | Developer and user guides |
| `deployment/` | Deployment instructions |
| `diagrams/` | System diagrams and flowcharts |

### Documentation Types

| Type | Description | Format |
|------|-------------|--------|
| **API Docs** | REST/GraphQL endpoint documentation | Markdown, OpenAPI |
| **ADRs** | Architecture decisions and rationale | Markdown |
| **Guides** | How-to guides for developers | Markdown |
| **Diagrams** | Visual system architecture | PNG, SVG, Mermaid |

### Expected Outcome
```
lankacommerce-cloud/
├── backend/
│   └── .gitkeep
├── docker/
│   └── .gitkeep
├── docs/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── shared/
│   └── .gitkeep
└── ... (other root files)
```

### Verification Checklist
- [ ] `docs/` directory exists in project root
- [ ] `.gitkeep` file exists inside `docs/`
- [ ] Directory is tracked by Git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Create backend/ Directory | `backend/` with `.gitkeep` |
| 12 | Create frontend/ Directory | `frontend/` with `.gitkeep` |
| 13 | Create shared/ Directory | `shared/` with `.gitkeep` |
| 14 | Create docker/ Directory | `docker/` with `.gitkeep` |
| 15 | Create docs/ Directory | `docs/` with `.gitkeep` |

### Current Directory Structure
```
lankacommerce-cloud/
├── .git/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── backend/
│   └── .gitkeep
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── docker/
│   └── .gitkeep
├── docs/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── LICENSE
├── README.md
└── shared/
    └── .gitkeep
```

### Next Steps
Proceed to [02_Tasks-16-20_Support-Directories.md](02_Tasks-16-20_Support-Directories.md) to create support directories and environment template.

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 11-15 can be executed simultaneously (all depend only on Task 01)
2. **Empty Directories:** Always add `.gitkeep` to ensure Git tracks empty directories
3. **No Code Yet:** These are placeholder directories; actual code comes in later phases
4. **Git Commit:** Do NOT commit yet - wait until all Group B tasks are complete
5. **Verification:** Confirm each directory exists before proceeding
