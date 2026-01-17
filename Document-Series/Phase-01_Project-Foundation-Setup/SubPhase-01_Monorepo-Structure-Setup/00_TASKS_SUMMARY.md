# SubPhase 01: Monorepo Structure Setup - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 01 of 08  
> **SubPhase Goal:** Create the root directory structure that organizes both backend and frontend codebases  
> **Total Tasks:** 67 | **Status:** Planning  
> **Estimated Duration:** 3-4 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **→ Next SubPhase:** [SubPhase-02_Backend-Project-Initialization](../SubPhase-02_Backend-Project-Initialization/)

---

## SubPhase Overview

This sub-phase establishes the foundational monorepo structure for LankaCommerce Cloud. The structure follows a clean separation between backend (Django) and frontend (Next.js) while sharing common configurations and utilities. This is the first sub-phase and has no dependencies.

### Key Outcomes
- Complete root directory structure created
- All placeholder directories established
- Root configuration files in place
- Git repository initialized with proper .gitignore
- README with project overview

### Technology Context
- **Repository Type:** Monorepo (single repository for all code)
- **Backend:** Django 5.x (Python 3.12+)
- **Frontend:** Next.js 14+ (TypeScript)
- **Package Management:** pip/Poetry for Python, npm/pnpm for Node.js
- **Containerization:** Docker & Docker Compose

---

## Task Execution Order

```
TASK GROUP A: Repository Initialization (Tasks 01-10)
        │
        ▼
TASK GROUP B: Root Directory Structure (Tasks 11-20)
        │
        ▼
TASK GROUP C: Backend Directory Scaffold (Tasks 21-35)
        │
        ▼
TASK GROUP D: Frontend Directory Scaffold (Tasks 36-50)
        │
        ▼
TASK GROUP E: Shared & Support Directories (Tasks 51-60)
        │
        ▼
TASK GROUP F: Root Configuration Files (Tasks 61-67)
```

---

## Task Index

### Group A: Repository Initialization (Tasks 01-10)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Root Directory** | Create the `lankacommerce-cloud/` root project folder | None | 🔴 Not Created |
| 02 | **Initialize Git Repository** | Run `git init` and configure basic git settings | Task 01 | 🔴 Not Created |
| 03 | **Create Main .gitignore** | Create comprehensive .gitignore for Python, Node.js, IDE files | Task 02 | 🔴 Not Created |
| 04 | **Create .gitattributes** | Configure line endings and file handling for cross-platform | Task 02 | 🔴 Not Created |
| 05 | **Create Root .editorconfig** | Establish consistent coding styles across editors | Task 01 | 🔴 Not Created |
| 06 | **Create Initial README.md** | Root README with project overview and setup instructions | Task 01 | 🔴 Not Created |
| 07 | **Create CONTRIBUTING.md** | Guidelines for contributing to the project | Task 06 | 🔴 Not Created |
| 08 | **Create CODE_OF_CONDUCT.md** | Community standards and behavior expectations | Task 06 | 🔴 Not Created |
| 09 | **Create LICENSE File** | Add appropriate license (MIT/Proprietary) | Task 01 | 🔴 Not Created |
| 10 | **Create CHANGELOG.md** | Initialize changelog following Keep a Changelog format | Task 01 | 🔴 Not Created |

---

### Group B: Root Directory Structure (Tasks 11-20)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 11 | **Create backend/ Directory** | Create main backend directory for Django application | Task 01 | 🔴 Not Created |
| 12 | **Create frontend/ Directory** | Create main frontend directory for Next.js application | Task 01 | 🔴 Not Created |
| 13 | **Create shared/ Directory** | Create directory for shared types, constants, utilities | Task 01 | 🔴 Not Created |
| 14 | **Create docker/ Directory** | Create directory for Docker configuration files | Task 01 | 🔴 Not Created |
| 15 | **Create docs/ Directory** | Create directory for project documentation | Task 01 | 🔴 Not Created |
| 16 | **Create scripts/ Directory** | Create directory for utility and automation scripts | Task 01 | 🔴 Not Created |
| 17 | **Create .github/ Directory** | Create directory for GitHub-specific configurations | Task 01 | 🔴 Not Created |
| 18 | **Create .vscode/ Directory** | Create directory for VS Code workspace settings | Task 01 | 🔴 Not Created |
| 19 | **Create tests/ Directory** | Create root directory for integration/E2E tests | Task 01 | 🔴 Not Created |
| 20 | **Create .env.example File** | Create template for environment variables | Task 01 | 🔴 Not Created |

---

### Group C: Backend Directory Scaffold (Tasks 21-35)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 21 | **Create backend/apps/ Directory** | Directory for all Django applications | Task 11 | 🔴 Not Created |
| 22 | **Create backend/config/ Directory** | Django project configuration and settings | Task 11 | 🔴 Not Created |
| 23 | **Create backend/core/ Directory** | Core utilities, base models, mixins | Task 11 | 🔴 Not Created |
| 24 | **Create backend/static/ Directory** | Static files for Django admin | Task 11 | 🔴 Not Created |
| 25 | **Create backend/media/ Directory** | User uploaded files (dev only) | Task 11 | 🔴 Not Created |
| 26 | **Create backend/templates/ Directory** | Django templates (emails, admin) | Task 11 | 🔴 Not Created |
| 27 | **Create backend/tests/ Directory** | Backend unit and integration tests | Task 11 | 🔴 Not Created |
| 28 | **Create backend/fixtures/ Directory** | Test fixtures and seed data | Task 11 | 🔴 Not Created |
| 29 | **Create backend/locale/ Directory** | Translation files (Sinhala, Tamil, English) | Task 11 | 🔴 Not Created |
| 30 | **Create backend/requirements/ Directory** | Split requirements files | Task 11 | 🔴 Not Created |
| 31 | **Create backend/.gitkeep Files** | Ensure empty directories are tracked | Task 21-30 | 🔴 Not Created |
| 32 | **Create backend/manage.py Placeholder** | Placeholder for Django management script | Task 11 | 🔴 Not Created |
| 33 | **Create backend/pyproject.toml** | Python project configuration file | Task 11 | 🔴 Not Created |
| 34 | **Create backend/README.md** | Backend-specific documentation | Task 11 | 🔴 Not Created |
| 35 | **Create backend/.env.example** | Backend environment variables template | Task 11 | 🔴 Not Created |

---

### Group D: Frontend Directory Scaffold (Tasks 36-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 36 | **Create frontend/app/ Directory** | Next.js App Router directory | Task 12 | 🔴 Not Created |
| 37 | **Create frontend/components/ Directory** | React components library | Task 12 | 🔴 Not Created |
| 38 | **Create frontend/lib/ Directory** | Utility functions and helpers | Task 12 | 🔴 Not Created |
| 39 | **Create frontend/hooks/ Directory** | Custom React hooks | Task 12 | 🔴 Not Created |
| 40 | **Create frontend/types/ Directory** | TypeScript type definitions | Task 12 | 🔴 Not Created |
| 41 | **Create frontend/styles/ Directory** | Global styles and Tailwind config | Task 12 | 🔴 Not Created |
| 42 | **Create frontend/public/ Directory** | Static assets (images, fonts) | Task 12 | 🔴 Not Created |
| 43 | **Create frontend/stores/ Directory** | State management (Zustand stores) | Task 12 | 🔴 Not Created |
| 44 | **Create frontend/services/ Directory** | API client and service functions | Task 12 | 🔴 Not Created |
| 45 | **Create frontend/constants/ Directory** | Application constants and config | Task 12 | 🔴 Not Created |
| 46 | **Create frontend/__tests__/ Directory** | Frontend unit and component tests | Task 12 | 🔴 Not Created |
| 47 | **Create frontend/.gitkeep Files** | Ensure empty directories are tracked | Task 36-46 | 🔴 Not Created |
| 48 | **Create frontend/package.json Placeholder** | Initial package.json structure | Task 12 | 🔴 Not Created |
| 49 | **Create frontend/README.md** | Frontend-specific documentation | Task 12 | 🔴 Not Created |
| 50 | **Create frontend/.env.example** | Frontend environment variables template | Task 12 | 🔴 Not Created |

---

### Group E: Shared & Support Directories (Tasks 51-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create shared/types/ Directory** | Shared TypeScript types between frontend parts | Task 13 | 🔴 Not Created |
| 52 | **Create shared/constants/ Directory** | Shared constants (status codes, enums) | Task 13 | 🔴 Not Created |
| 53 | **Create shared/README.md** | Documentation for shared resources | Task 13 | 🔴 Not Created |
| 54 | **Create docker/backend/ Directory** | Backend Dockerfile and configs | Task 14 | 🔴 Not Created |
| 55 | **Create docker/frontend/ Directory** | Frontend Dockerfile and configs | Task 14 | 🔴 Not Created |
| 56 | **Create docker/nginx/ Directory** | Nginx configuration for production | Task 14 | 🔴 Not Created |
| 57 | **Create docs/api/ Directory** | API documentation | Task 15 | 🔴 Not Created |
| 58 | **Create docs/architecture/ Directory** | Architecture decision records | Task 15 | 🔴 Not Created |
| 59 | **Create docs/guides/ Directory** | Developer guides and tutorials | Task 15 | 🔴 Not Created |
| 60 | **Create scripts/README.md** | Documentation for utility scripts | Task 16 | 🔴 Not Created |

---

### Group F: Root Configuration Files (Tasks 61-67)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create docker-compose.yml** | Development Docker Compose configuration | Task 14 | 🔴 Not Created |
| 62 | **Create docker-compose.prod.yml** | Production Docker Compose override | Task 61 | 🔴 Not Created |
| 63 | **Create Makefile** | Common commands and shortcuts | Task 01 | 🔴 Not Created |
| 64 | **Create .github/workflows/ Directory** | GitHub Actions workflow directory | Task 17 | 🔴 Not Created |
| 65 | **Create .github/ISSUE_TEMPLATE/ Directory** | Issue templates for GitHub | Task 17 | 🔴 Not Created |
| 66 | **Create .github/PULL_REQUEST_TEMPLATE.md** | PR template for GitHub | Task 17 | 🔴 Not Created |
| 67 | **Create .vscode/settings.json** | VS Code workspace settings | Task 18 | 🔴 Not Created |

---

## Task Details

### Task 01: Create Root Directory

**Goal:** Initialize the root project directory with proper naming convention.

**Implementation:**
```bash
mkdir lankacommerce-cloud
cd lankacommerce-cloud
```

**Naming Convention:**
- Use lowercase with hyphens
- Matches repository name
- Easy to type in terminal

**Verification:**
- [ ] Directory exists
- [ ] Current working directory is set

---

### Task 02: Initialize Git Repository

**Goal:** Set up Git for version control.

**Implementation:**
```bash
git init
git config user.name "LCC Developer"
git config user.email "dev@lankacommerce.lk"
```

**Verification:**
- [ ] `.git/` directory created
- [ ] Git commands work in directory

---

### Task 03: Create Main .gitignore

**Goal:** Ignore all unnecessary files for Python, Node.js, and IDE.

**File Content Categories:**
- Python: `__pycache__/`, `*.pyc`, `.venv/`, `*.egg-info/`
- Node.js: `node_modules/`, `.next/`, `out/`
- Environment: `.env`, `.env.local`, `.env.*.local`
- IDE: `.idea/`, `*.swp`, `.DS_Store`
- Build: `dist/`, `build/`, `*.log`
- Testing: `.coverage`, `htmlcov/`, `.pytest_cache/`

---

### Task 06: Create Initial README.md

**Goal:** Provide project overview and quick start instructions.

**Sections:**
1. Project Title and Description
2. Features Overview
3. Tech Stack
4. Prerequisites
5. Quick Start Guide
6. Project Structure
7. Development Commands
8. Contributing Link
9. License

---

### Task 20: Create .env.example File

**Goal:** Document all required environment variables.

**Categories:**
```env
# Database
DATABASE_URL=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# Django
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=

# Redis
REDIS_URL=

# Frontend
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=

# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

---

### Task 61: Create docker-compose.yml

**Goal:** Define development services.

**Services:**
```yaml
services:
  backend:
    build: ./docker/backend
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  frontend:
    build: ./docker/frontend
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

### Task 63: Create Makefile

**Goal:** Provide convenient command shortcuts.

**Commands:**
```makefile
.PHONY: help dev up down logs migrate shell test lint format

help:           ## Show this help
dev:            ## Start development environment
up:             ## Start containers in background
down:           ## Stop all containers
logs:           ## View container logs
migrate:        ## Run database migrations
shell:          ## Open Django shell
test:           ## Run all tests
lint:           ## Run linters
format:         ## Format code
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── .git/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
│   └── settings.json
├── backend/
│   ├── apps/
│   ├── config/
│   ├── core/
│   ├── fixtures/
│   ├── locale/
│   ├── media/
│   ├── requirements/
│   ├── static/
│   ├── templates/
│   ├── tests/
│   ├── .env.example
│   ├── manage.py (placeholder)
│   ├── pyproject.toml
│   └── README.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   ├── __tests__/
│   ├── .env.example
│   ├── package.json (placeholder)
│   └── README.md
├── shared/
│   ├── constants/
│   ├── types/
│   └── README.md
├── docker/
│   ├── backend/
│   ├── frontend/
│   └── nginx/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── guides/
├── scripts/
│   └── README.md
├── tests/
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── docker-compose.prod.yml
├── docker-compose.yml
├── LICENSE
├── Makefile
└── README.md
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 67 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 67 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks should be executed in numerical order within each group
2. **Dependencies:** Check task dependencies before starting
3. **Verification:** Each task should verify its completion
4. **Placeholders:** Some files are placeholders to be filled in later sub-phases
5. **Git Commits:** Commit after completing each task group (not individual tasks)
