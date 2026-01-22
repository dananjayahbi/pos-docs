# Tasks 09-14: Development Dockerfile Base

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** B - Backend Dockerfile Creation  
> **Document:** 01 of 03  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Docker-Directory-Setup/02_Tasks-05-08_Support-Directories.md](../Group-A_Docker-Directory-Setup/02_Tasks-05-08_Support-Directories.md)
- **→ Next Document:** [02_Tasks-15-19_Dev-Dockerfile-Complete.md](02_Tasks-15-19_Dev-Dockerfile-Complete.md)

---

## Document Overview

This document covers creating the development Dockerfile for the Django backend, including base image selection, environment variables, system dependencies, and requirements setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Create Backend Dockerfile.dev | Medium |
| 10 | Configure Python Base Image | Simple |
| 11 | Set Environment Variables | Simple |
| 12 | Install System Dependencies | Medium |
| 13 | Create Working Directory | Simple |
| 14 | Copy Requirements File | Simple |

---

## Task 09: Create Backend Dockerfile.dev

### Overview
Create the development Dockerfile for the Django backend application.

### Dependencies
- Task 02: Create docker/backend/ Directory

### Instructions

1. **Create Dockerfile.dev**
   - In docker/backend/

2. **Name for development**
   - Distinct from production

3. **Initialize with comment header**
   - Document purpose

### File Location

```
docker/
└── backend/
    └── Dockerfile.dev
```

### Initial Structure

```dockerfile
# ==================================================
# LankaCommerce Cloud - Backend Development Dockerfile
# ==================================================
# Purpose: Development environment with hot reload
# Base: Python 3.12 slim
# ==================================================

# Instructions will follow in subsequent tasks
```

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Hot reload | Yes | No |
| Debug mode | Yes | No |
| Volume mounts | Yes | No |
| Dependencies | All | Production only |
| Image size | Larger | Optimized |

### Expected Outcome
- Dockerfile.dev file created
- Header documentation added

### Verification Checklist
- [ ] File exists at docker/backend/Dockerfile.dev
- [ ] Purpose documented
- [ ] Ready for instructions

---

## Task 10: Configure Python Base Image

### Overview
Configure the Python base image for the backend container.

### Dependencies
- Task 09: Create Backend Dockerfile.dev

### Instructions

1. **Select base image**
   - Python 3.12 slim

2. **Add FROM instruction**
   - First line after comments

3. **Document image choice**
   - Why slim variant

### Base Image Selection

| Variant | Size | Use Case |
|---------|------|----------|
| python:3.12 | ~1GB | Full toolchain |
| python:3.12-slim | ~150MB | Minimal, common |
| python:3.12-alpine | ~50MB | Smallest, compatibility issues |

### Dockerfile Addition

```dockerfile
# Base image - Python 3.12 slim for balance of size and compatibility
FROM python:3.12-slim AS development
```

### Why python:3.12-slim

| Reason | Benefit |
|--------|---------|
| Debian-based | Package compatibility |
| Smaller | Faster builds/pulls |
| Security | Minimal attack surface |
| Maintained | Regular updates |

### Expected Outcome
- Base image configured
- Development stage named

### Verification Checklist
- [ ] FROM instruction added
- [ ] python:3.12-slim selected
- [ ] Stage named "development"

---

## Task 11: Set Environment Variables

### Overview
Configure environment variables for Python and Django behavior in the container.

### Dependencies
- Task 09: Create Backend Dockerfile.dev

### Instructions

1. **Set Python behavior**
   - Unbuffered output
   - No bytecode

2. **Set pip behavior**
   - Disable version check

3. **Set Django settings**
   - Default settings module

### Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| PYTHONDONTWRITEBYTECODE | 1 | No .pyc files |
| PYTHONUNBUFFERED | 1 | Direct stdout |
| PIP_NO_CACHE_DIR | 1 | No pip cache |
| PIP_DISABLE_PIP_VERSION_CHECK | 1 | Skip version check |

### Dockerfile Addition

```dockerfile
# Environment variables for Python behavior
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
```

### Why These Variables

| Variable | Without | With |
|----------|---------|------|
| PYTHONDONTWRITEBYTECODE | .pyc clutter | Clean |
| PYTHONUNBUFFERED | Delayed logs | Real-time logs |
| PIP_NO_CACHE_DIR | Cache in image | Smaller image |

### Expected Outcome
- Python env vars set
- Container optimized

### Verification Checklist
- [ ] ENV instruction added
- [ ] All 4 variables set
- [ ] No bytecode generation
- [ ] Unbuffered output

---

## Task 12: Install System Dependencies

### Overview
Install system-level dependencies required by Python packages.

### Dependencies
- Task 10: Configure Python Base Image

### Instructions

1. **Update package lists**
   - apt-get update

2. **Install build dependencies**
   - Compilers, headers

3. **Install PostgreSQL client**
   - psycopg2 dependencies

4. **Clean up**
   - Remove apt cache

### System Dependencies

| Package | Purpose |
|---------|---------|
| build-essential | C compiler for extensions |
| libpq-dev | PostgreSQL client headers |
| postgresql-client | psql command |
| gettext | Translation support |
| curl | Health checks |
| netcat-openbsd | Port checking |

### Dockerfile Addition

```dockerfile
# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    gettext \
    curl \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

### Why Clean Up

| Step | Purpose |
|------|---------|
| apt-get clean | Remove package cache |
| rm -rf /var/lib/apt/lists/* | Remove package lists |

This reduces image size significantly.

### Expected Outcome
- System deps installed
- Image cleaned

### Verification Checklist
- [ ] RUN instruction added
- [ ] build-essential installed
- [ ] libpq-dev installed
- [ ] Cleanup commands added

---

## Task 13: Create Working Directory

### Overview
Create and set the working directory for the Django application.

### Dependencies
- Task 10: Configure Python Base Image

### Instructions

1. **Create /app directory**
   - Standard location

2. **Set as WORKDIR**
   - All commands run here

3. **Document structure**
   - Planned layout

### Working Directory

```dockerfile
# Set working directory
WORKDIR /app
```

### Directory Structure Inside Container

```
/app/
├── manage.py
├── config/           # Django project settings
├── apps/             # Django applications
├── requirements/     # Requirements files
├── static/           # Static files
└── media/            # User uploads
```

### Why /app

| Option | Pros | Cons |
|--------|------|------|
| /app | Standard, clean | None |
| /code | Also common | Less standard |
| /usr/src/app | Explicit | Longer path |

### Expected Outcome
- Working directory created
- All paths relative to /app

### Verification Checklist
- [ ] WORKDIR instruction added
- [ ] Set to /app
- [ ] Before COPY commands

---

## Task 14: Copy Requirements File

### Overview
Copy the requirements file for dependency installation.

### Dependencies
- Task 13: Create Working Directory

### Instructions

1. **Copy requirements**
   - requirements.txt or requirements/ folder

2. **Use specific path**
   - Before installing

3. **Leverage layer caching**
   - Copy before code

### Requirements Strategy

| Pattern | File(s) |
|---------|---------|
| Single file | requirements.txt |
| Split files | requirements/base.txt, dev.txt, prod.txt |

### Dockerfile Addition (Split Files)

```dockerfile
# Copy requirements files for dependency installation
COPY requirements/ requirements/
```

### Dockerfile Addition (Single File)

```dockerfile
# Copy requirements file for dependency installation
COPY requirements.txt requirements.txt
```

### Layer Caching Benefit

```dockerfile
# Good - requirements cached separately
COPY requirements/ requirements/
RUN pip install -r requirements/dev.txt

# Then copy code (changes more often)
COPY . .
```

| Change | Rebuild |
|--------|---------|
| requirements | Install deps |
| Code only | Skip install |

### Expected Outcome
- Requirements copied
- Layer caching enabled

### Verification Checklist
- [ ] COPY instruction added
- [ ] Correct source path
- [ ] Before pip install

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Create Backend Dockerfile.dev | Dockerfile created |
| 10 | Configure Python Base Image | python:3.12-slim |
| 11 | Set Environment Variables | Python env vars |
| 12 | Install System Dependencies | apt packages |
| 13 | Create Working Directory | /app WORKDIR |
| 14 | Copy Requirements File | Layer caching |

### Dockerfile.dev Progress

```dockerfile
# ==================================================
# LankaCommerce Cloud - Backend Development Dockerfile
# ==================================================

# Base image
FROM python:3.12-slim AS development

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    gettext \
    curl \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements files
COPY requirements/ requirements/
```

### Next Steps
Proceed to [02_Tasks-15-19_Dev-Dockerfile-Complete.md](02_Tasks-15-19_Dev-Dockerfile-Complete.md) to complete the Dockerfile.

---

## Notes for AI Agents

1. **Layer ordering:** Least changing → most changing
2. **Base image:** Slim is best balance
3. **Env vars:** Critical for Python behavior
4. **System deps:** Clean up after install
5. **Requirements:** Copy before code for caching
6. **Git:** Do NOT commit yet - complete Group B first
