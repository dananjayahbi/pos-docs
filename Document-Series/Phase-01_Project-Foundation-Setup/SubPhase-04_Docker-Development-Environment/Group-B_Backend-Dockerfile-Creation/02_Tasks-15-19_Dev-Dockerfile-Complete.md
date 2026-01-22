# Tasks 15-19: Development Dockerfile Complete

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** B - Backend Dockerfile Creation  
> **Document:** 02 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-09-14_Dev-Dockerfile-Base.md](01_Tasks-09-14_Dev-Dockerfile-Base.md)
- **→ Next Document:** [03_Tasks-20-22_Prod-Dockerfile.md](03_Tasks-20-22_Prod-Dockerfile.md)

---

## Document Overview

This document completes the development Dockerfile by installing dependencies, copying code, creating the entrypoint script, and exposing the port.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Install Python Dependencies | Simple |
| 16 | Copy Application Code | Simple |
| 17 | Create Entrypoint Script | Medium |
| 18 | Configure Entrypoint | Simple |
| 19 | Expose Backend Port | Simple |

---

## Task 15: Install Python Dependencies

### Overview
Install Python packages from requirements files.

### Dependencies
- Task 14: Copy Requirements File

### Instructions

1. **Run pip install**
   - Install all dependencies

2. **Use dev requirements**
   - Development packages included

3. **Single RUN instruction**
   - Layer optimization

### Dockerfile Addition

```dockerfile
# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements/dev.txt
```

### Requirements Files

| File | Contents |
|------|----------|
| base.txt | Core dependencies |
| dev.txt | Dev tools, includes base |
| prod.txt | Production only, includes base |

### Development Dependencies

| Package | Purpose |
|---------|---------|
| Django | Web framework |
| psycopg2-binary | PostgreSQL |
| django-debug-toolbar | Debug UI |
| pytest-django | Testing |
| black | Formatting |
| flake8 | Linting |

### Why Upgrade pip

```dockerfile
pip install --upgrade pip
```

Ensures latest pip for:
- Security fixes
- Better dependency resolution
- New features

### Expected Outcome
- All dependencies installed
- Dev tools available

### Verification Checklist
- [ ] RUN instruction added
- [ ] pip upgraded first
- [ ] dev.txt installed
- [ ] Single layer

---

## Task 16: Copy Application Code

### Overview
Copy the Django application code into the container.

### Dependencies
- Task 15: Install Python Dependencies

### Instructions

1. **Copy all code**
   - COPY . .

2. **After dependencies**
   - Layer caching

3. **.dockerignore**
   - Excludes junk

### Dockerfile Addition

```dockerfile
# Copy application code
COPY . .
```

### What Gets Copied

With proper .dockerignore:

| Copied | Excluded |
|--------|----------|
| manage.py | .venv/ |
| config/ | __pycache__/ |
| apps/ | *.pyc |
| static/ | .env |
| media/ | .git/ |

### Development vs Production

| Environment | Approach |
|-------------|----------|
| Development | Volume mount overwrites |
| Production | Copied files used |

### Volume Mount Override

In docker-compose:
```yaml
volumes:
  - ./backend:/app
```

This makes COPY effectively ignored during dev.

### Expected Outcome
- Code copied to container
- Ready for production use

### Verification Checklist
- [ ] COPY instruction added
- [ ] After pip install
- [ ] .dockerignore respected

---

## Task 17: Create Entrypoint Script

### Overview
Create the entrypoint script that runs when the container starts.

### Dependencies
- Task 16: Copy Application Code

### Instructions

1. **Create entrypoint.sh**
   - In docker/backend/

2. **Add initialization steps**
   - Wait for database
   - Run migrations
   - Collect static

3. **Execute CMD**
   - Pass through to command

### File Location

```
docker/
└── backend/
    └── entrypoint.sh
```

### entrypoint.sh Content

```bash
#!/bin/bash
set -e

# ==================================================
# LankaCommerce Cloud - Backend Entrypoint
# ==================================================

echo "🚀 Starting LankaCommerce Cloud Backend..."

# Wait for PostgreSQL to be ready
if [ -n "$DATABASE_HOST" ]; then
    echo "⏳ Waiting for PostgreSQL at $DATABASE_HOST:${DATABASE_PORT:-5432}..."
    while ! nc -z "$DATABASE_HOST" "${DATABASE_PORT:-5432}"; do
        sleep 1
    done
    echo "✅ PostgreSQL is ready!"
fi

# Wait for Redis to be ready
if [ -n "$REDIS_HOST" ]; then
    echo "⏳ Waiting for Redis at $REDIS_HOST:${REDIS_PORT:-6379}..."
    while ! nc -z "$REDIS_HOST" "${REDIS_PORT:-6379}"; do
        sleep 1
    done
    echo "✅ Redis is ready!"
fi

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🔄 Running database migrations..."
    python manage.py migrate --noinput
fi

# Collect static files (production)
if [ "$COLLECT_STATIC" = "true" ]; then
    echo "📦 Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Create superuser if not exists (development)
if [ "$CREATE_SUPERUSER" = "true" ]; then
    echo "👤 Creating superuser if not exists..."
    python manage.py createsuperuser --noinput 2>/dev/null || true
fi

echo "✅ Initialization complete!"
echo "🎯 Executing command: $@"

# Execute the main command
exec "$@"
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| DATABASE_HOST | - | PostgreSQL host |
| DATABASE_PORT | 5432 | PostgreSQL port |
| REDIS_HOST | - | Redis host |
| REDIS_PORT | 6379 | Redis port |
| RUN_MIGRATIONS | false | Auto-migrate |
| COLLECT_STATIC | false | Static files |
| CREATE_SUPERUSER | false | Create admin |

### Script Features

| Feature | Benefit |
|---------|---------|
| set -e | Exit on error |
| nc wait | Service dependency |
| exec "$@" | Pass CMD through |

### Expected Outcome
- Entrypoint script created
- Initialization automated

### Verification Checklist
- [ ] File created at docker/backend/entrypoint.sh
- [ ] Database wait implemented
- [ ] Migration support
- [ ] exec "$@" at end

---

## Task 18: Configure Entrypoint

### Overview
Configure the Dockerfile to use the entrypoint script.

### Dependencies
- Task 17: Create Entrypoint Script

### Instructions

1. **Copy entrypoint**
   - Into container

2. **Make executable**
   - chmod +x

3. **Set ENTRYPOINT**
   - Use exec form

### Dockerfile Addition

```dockerfile
# Copy and configure entrypoint
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
```

### ENTRYPOINT vs CMD

| Instruction | Purpose | Override |
|-------------|---------|----------|
| ENTRYPOINT | Always runs | --entrypoint |
| CMD | Default command | Easy to override |

### Exec Form vs Shell Form

| Form | Syntax | Signal Handling |
|------|--------|-----------------|
| Exec | ["cmd", "arg"] | Correct (PID 1) |
| Shell | cmd arg | Broken (shell PID 1) |

Always use exec form for ENTRYPOINT.

### Expected Outcome
- Entrypoint configured
- Script executable

### Verification Checklist
- [ ] COPY entrypoint added
- [ ] chmod +x executed
- [ ] ENTRYPOINT set
- [ ] Exec form used

---

## Task 19: Expose Backend Port

### Overview
Expose the Django development server port and set the default command.

### Dependencies
- Task 18: Configure Entrypoint

### Instructions

1. **Expose port 8000**
   - Django default port

2. **Set CMD**
   - Development server

3. **Document usage**
   - Port mapping

### Dockerfile Addition

```dockerfile
# Expose Django development server port
EXPOSE 8000

# Default command - Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Port Details

| Port | Service | Protocol |
|------|---------|----------|
| 8000 | Django | HTTP |

### Why 0.0.0.0

```python
# Binds to all interfaces (needed for Docker)
runserver 0.0.0.0:8000

# Only localhost (won't work from outside container)
runserver 127.0.0.1:8000
```

### Development vs Production CMD

| Environment | Command |
|-------------|---------|
| Development | runserver 0.0.0.0:8000 |
| Production | gunicorn config.wsgi:application |

### Expected Outcome
- Port 8000 exposed
- Dev server as default

### Verification Checklist
- [ ] EXPOSE 8000 added
- [ ] CMD uses exec form
- [ ] Binds to 0.0.0.0
- [ ] runserver command

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Install Python Dependencies | pip install |
| 16 | Copy Application Code | COPY . . |
| 17 | Create Entrypoint Script | entrypoint.sh |
| 18 | Configure Entrypoint | ENTRYPOINT instruction |
| 19 | Expose Backend Port | Port 8000, CMD |

### Complete Dockerfile.dev

```dockerfile
# ==================================================
# LankaCommerce Cloud - Backend Development Dockerfile
# ==================================================

FROM python:3.12-slim AS development

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    gettext \
    curl \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements/ requirements/

RUN pip install --upgrade pip \
    && pip install -r requirements/dev.txt

COPY . .

COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Files Created

```
docker/
└── backend/
    ├── Dockerfile.dev
    └── entrypoint.sh
```

### Next Steps
Proceed to [03_Tasks-20-22_Prod-Dockerfile.md](03_Tasks-20-22_Prod-Dockerfile.md) for production Dockerfile.

---

## Notes for AI Agents

1. **Layer order:** deps before code
2. **Entrypoint:** Always use exec form
3. **Port binding:** 0.0.0.0 required
4. **exec "$@":** Pass CMD through entrypoint
5. **Signal handling:** PID 1 matters
6. **Git:** Do NOT commit yet - complete Group B first
