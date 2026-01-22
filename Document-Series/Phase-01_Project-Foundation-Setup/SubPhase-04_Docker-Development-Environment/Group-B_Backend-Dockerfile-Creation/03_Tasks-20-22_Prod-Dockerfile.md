# Tasks 20-22: Production Dockerfile

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** B - Backend Dockerfile Creation  
> **Document:** 03 of 03  
> **Tasks Covered:** 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-15-19_Dev-Dockerfile-Complete.md](02_Tasks-15-19_Dev-Dockerfile-Complete.md)
- **→ Next Group:** [../Group-C_Frontend-Dockerfile-Creation/00_GROUP_OVERVIEW.md](../Group-C_Frontend-Dockerfile-Creation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the production Dockerfile with multi-stage builds and the backend-specific .dockerignore file.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Create Backend Dockerfile.prod | Complex |
| 21 | Configure Production Multi-stage Build | Complex |
| 22 | Create backend/.dockerignore | Simple |

---

## Task 20: Create Backend Dockerfile.prod

### Overview
Create the production Dockerfile for the Django backend with optimizations.

### Dependencies
- Task 09: Create Backend Dockerfile.dev

### Instructions

1. **Create Dockerfile.prod**
   - In docker/backend/

2. **Use multi-stage build**
   - Builder + runtime stages

3. **Optimize for production**
   - Smaller image, security

### File Location

```
docker/
└── backend/
    └── Dockerfile.prod
```

### Multi-Stage Strategy

| Stage | Purpose | Contents |
|-------|---------|----------|
| builder | Install deps | Full toolchain |
| production | Runtime | Minimal + app |

### Benefits of Multi-Stage

| Benefit | How |
|---------|-----|
| Smaller image | No build tools |
| Security | Fewer packages |
| Speed | Faster deployment |
| Clean | No intermediate files |

### Expected Outcome
- Dockerfile.prod created
- Multi-stage structure

### Verification Checklist
- [ ] File created
- [ ] Multi-stage planned
- [ ] Production optimized

---

## Task 21: Configure Production Multi-stage Build

### Overview
Implement the complete multi-stage build for production.

### Dependencies
- Task 20: Create Backend Dockerfile.prod

### Instructions

1. **Builder stage**
   - Install all dependencies
   - Build wheels

2. **Production stage**
   - Copy only wheels
   - Minimal runtime

3. **Security hardening**
   - Non-root user
   - Read-only where possible

### Dockerfile.prod Content

```dockerfile
# ==================================================
# LankaCommerce Cloud - Backend Production Dockerfile
# ==================================================
# Multi-stage build for optimized production image
# ==================================================

# --------------------------------------------------
# Stage 1: Builder
# --------------------------------------------------
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY requirements/ requirements/
RUN pip wheel --no-cache-dir --wheel-dir /build/wheels \
    -r requirements/prod.txt

# --------------------------------------------------
# Stage 2: Production
# --------------------------------------------------
FROM python:3.12-slim AS production

# Labels for container metadata
LABEL maintainer="LankaCommerce Cloud Team" \
      version="1.0.0" \
      description="LCC Backend Production Image"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production \
    APP_HOME=/app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    postgresql-client \
    curl \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1000 appgroup \
    && useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR $APP_HOME

# Copy wheels from builder and install
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/* \
    && rm -rf /wheels

# Copy application code
COPY --chown=appuser:appgroup . .

# Copy entrypoint script
COPY --chown=appuser:appgroup docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Collect static files
RUN python manage.py collectstatic --noinput

# Create directories for static and media
RUN mkdir -p staticfiles mediafiles \
    && chown -R appuser:appgroup staticfiles mediafiles

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Entrypoint and command
ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--worker-class", "sync", \
     "--worker-connections", "1000", \
     "--max-requests", "10000", \
     "--max-requests-jitter", "1000", \
     "--timeout", "30", \
     "--keep-alive", "2", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
```

### Builder vs Production Deps

| Package | Builder | Production |
|---------|---------|------------|
| build-essential | ✓ | ✗ |
| libpq-dev | ✓ | ✗ |
| libpq5 | ✗ | ✓ |
| postgresql-client | ✓ | ✓ |

### Security Features

| Feature | Purpose |
|---------|---------|
| Non-root user | Limit privileges |
| Minimal packages | Reduce attack surface |
| HEALTHCHECK | Container monitoring |
| No pip cache | Smaller image |

### Gunicorn Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| workers | 4 | Parallel requests |
| timeout | 30 | Request timeout |
| max-requests | 10000 | Worker recycling |
| keep-alive | 2 | Connection reuse |

### Image Size Comparison

| Image | Approximate Size |
|-------|-----------------|
| Development | ~500MB |
| Production | ~200MB |

### Expected Outcome
- Production Dockerfile complete
- Optimized image

### Verification Checklist
- [ ] Multi-stage build implemented
- [ ] Wheels built in builder
- [ ] Non-root user configured
- [ ] Gunicorn as CMD
- [ ] HEALTHCHECK added

---

## Task 22: Create backend/.dockerignore

### Overview
Create a backend-specific .dockerignore file for the backend directory.

### Dependencies
- Task 09: Create Backend Dockerfile.dev

### Instructions

1. **Create .dockerignore**
   - In backend/ directory

2. **Exclude development files**
   - Tests, fixtures, docs

3. **Complement root .dockerignore**
   - More specific exclusions

### File Location

```
backend/
└── .dockerignore
```

### .dockerignore Content

```dockerignore
# ==================================================
# LankaCommerce Cloud - Backend .dockerignore
# ==================================================

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
*.egg-info/
.eggs/
dist/
build/

# --------------------------------------------------
# Testing
# --------------------------------------------------
.coverage
.pytest_cache/
htmlcov/
.tox/
tests/
conftest.py
pytest.ini

# --------------------------------------------------
# Development
# --------------------------------------------------
*.log
*.pot
.mypy_cache/
.dmypy.json
fixtures/
seeds/

# --------------------------------------------------
# Environment
# --------------------------------------------------
.env
.env.*
!.env.example

# --------------------------------------------------
# IDE
# --------------------------------------------------
.idea/
.vscode/
*.swp
*.swo

# --------------------------------------------------
# Documentation
# --------------------------------------------------
docs/
*.md
!README.md

# --------------------------------------------------
# Docker (avoid recursive)
# --------------------------------------------------
Dockerfile*
docker-compose*.yml

# --------------------------------------------------
# CI/CD
# --------------------------------------------------
.github/
.gitlab-ci.yml
Makefile

# --------------------------------------------------
# Media & Static (collected separately)
# --------------------------------------------------
staticfiles/
mediafiles/
media/
```

### Why Backend-Specific

| Root .dockerignore | Backend .dockerignore |
|--------------------|----------------------|
| General patterns | Backend-specific |
| node_modules | tests/ |
| .next | fixtures/ |

### Build Context

When building:
```bash
docker build -f docker/backend/Dockerfile.prod backend/
```

The backend/ directory is the build context.

### Expected Outcome
- Backend .dockerignore created
- Production builds cleaner

### Verification Checklist
- [ ] File exists at backend/.dockerignore
- [ ] Tests excluded
- [ ] Fixtures excluded
- [ ] .env files excluded
- [ ] staticfiles excluded

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 20 | Create Backend Dockerfile.prod | Production Dockerfile |
| 21 | Configure Multi-stage Build | Optimized image |
| 22 | Create backend/.dockerignore | Backend exclusions |

### Files Created

```
docker/
└── backend/
    ├── Dockerfile.dev
    ├── Dockerfile.prod
    └── entrypoint.sh

backend/
└── .dockerignore
```

### Group B Complete

All Backend Dockerfile tasks completed:
- Development Dockerfile with hot reload
- Production Dockerfile with multi-stage build
- Entrypoint script with initialization
- Backend-specific .dockerignore

### Image Comparison

| Aspect | Development | Production |
|--------|-------------|------------|
| Size | ~500MB | ~200MB |
| User | root | appuser |
| Server | runserver | gunicorn |
| Debug | enabled | disabled |
| Deps | all | prod only |

### Next Steps
Proceed to [../Group-C_Frontend-Dockerfile-Creation/00_GROUP_OVERVIEW.md](../Group-C_Frontend-Dockerfile-Creation/00_GROUP_OVERVIEW.md) for Frontend Dockerfile.

---

## Notes for AI Agents

1. **Multi-stage:** Builder for wheels, production for runtime
2. **Non-root:** Security best practice
3. **Wheels:** Pre-compiled packages, faster install
4. **HEALTHCHECK:** Enable container orchestration
5. **Gunicorn:** Production-ready WSGI server
6. **Git:** Commit after Group B complete
