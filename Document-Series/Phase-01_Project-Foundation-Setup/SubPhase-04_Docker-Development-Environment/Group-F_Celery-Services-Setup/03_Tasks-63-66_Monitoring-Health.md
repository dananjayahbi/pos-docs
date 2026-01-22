# Tasks 63-66: Monitoring and Health

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** F - Celery Services Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-59-62_Beat-Flower.md](02_Tasks-59-62_Beat-Flower.md)
- **→ Next Group:** [../Group-G_Docker-Compose-Configuration/00_GROUP_OVERVIEW.md](../Group-G_Docker-Compose-Configuration/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers Flower port and authentication configuration, Celery health checks, and worker restart policies.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Configure Flower Port | Simple |
| 64 | Configure Flower Auth | Simple |
| 65 | Create Celery Health Check | Medium |
| 66 | Configure Worker Restart Policy | Simple |

---

## Task 63: Configure Flower Port

### Overview
Configure the port for the Flower monitoring web interface.

### Dependencies
- Task 62: Create Flower Service Script

### Instructions

1. **Set default port**
   - Standard 5555

2. **Environment override**
   - For custom port

3. **Document access**
   - URL pattern

### Environment Variable

```bash
FLOWER_PORT="${FLOWER_PORT:-5555}"
```

### Port Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Default | 5555 | Standard Flower port |
| Alternative | 5556+ | Multiple environments |

### Docker Compose Port Mapping

```yaml
flower:
  ports:
    - "5555:5555"
```

### Access URL

| Environment | URL |
|-------------|-----|
| Development | http://localhost:5555 |
| With prefix | http://localhost/flower |

### Expected Outcome
- Port configurable
- Default 5555

### Verification Checklist
- [ ] Port variable in script
- [ ] Default value set
- [ ] Docker port mapping

---

## Task 64: Configure Flower Auth

### Overview
Configure basic authentication for the Flower web interface.

### Dependencies
- Task 62: Create Flower Service Script

### Instructions

1. **Set default credentials**
   - Development values

2. **Environment override**
   - For production

3. **Document security**
   - Never use defaults in prod

### Environment Variable

```bash
FLOWER_BASIC_AUTH="${FLOWER_BASIC_AUTH:-admin:admin}"
```

### Authentication Format

```
username:password
```

Multiple users:
```
admin:admin123,viewer:view123
```

### Docker Compose Override

```yaml
flower:
  environment:
    - FLOWER_BASIC_AUTH=${FLOWER_ADMIN}:${FLOWER_PASSWORD}
```

### .env Configuration

```env
FLOWER_ADMIN=lcc_admin
FLOWER_PASSWORD=secure_password_here
```

### Security Levels

| Environment | Auth |
|-------------|------|
| Development | admin:admin |
| Staging | Strong password |
| Production | Strong + HTTPS |

### Expected Outcome
- Authentication enabled
- Configurable credentials

### Verification Checklist
- [ ] basic_auth flag used
- [ ] Environment variable
- [ ] Default for dev
- [ ] Security note added

---

## Task 65: Create Celery Health Check

### Overview
Create a health check script for Celery worker services.

### Dependencies
- Task 55: Create Celery Worker Entrypoint

### Instructions

1. **Create celery-health.sh**
   - In docker/scripts/

2. **Use celery inspect**
   - Ping workers

3. **Return exit codes**
   - 0 for healthy

### File Location

```
docker/
└── scripts/
    ├── celery-worker.sh
    ├── celery-beat.sh
    ├── flower.sh
    └── celery-health.sh
```

### Health Check Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Celery Health Check
# ==================================================
# Purpose: Check Celery worker health
# Usage: Docker HEALTHCHECK instruction
# Exit: 0 = healthy, 1 = unhealthy
# ==================================================

set -e

APP_NAME="${CELERY_APP:-config.celery:app}"
TIMEOUT="${CELERY_HEALTH_TIMEOUT:-5}"

# Check if workers are responding
RESULT=$(celery -A "${APP_NAME}" inspect ping --timeout="${TIMEOUT}" 2>/dev/null)

if echo "${RESULT}" | grep -q "pong"; then
    echo "Celery workers are healthy"
    exit 0
else
    echo "Celery workers are unhealthy"
    exit 1
fi
```

### Alternative Simple Check

Using process check:
```bash
#!/bin/bash
# Check if celery process is running
pgrep -f "celery.*worker" > /dev/null

if [ $? -eq 0 ]; then
    exit 0
else
    exit 1
fi
```

### Docker Compose Integration

```yaml
celery-worker:
  healthcheck:
    test: ["CMD", "/scripts/celery-health.sh"]
    interval: 60s
    timeout: 30s
    retries: 3
    start_period: 30s
```

### Health Check Timing

| Parameter | Value | Reason |
|-----------|-------|--------|
| interval | 60s | Not too frequent |
| timeout | 30s | Allow slow response |
| start_period | 30s | Worker startup time |
| retries | 3 | Tolerate transient issues |

### Expected Outcome
- Health check script created
- Inspect ping used

### Verification Checklist
- [ ] celery-health.sh created
- [ ] celery inspect ping used
- [ ] Exit codes correct
- [ ] Executable permission

---

## Task 66: Configure Worker Restart Policy

### Overview
Configure the restart policy for Celery worker containers.

### Dependencies
- Task 55: Create Celery Worker Entrypoint

### Instructions

1. **Set restart policy**
   - Unless-stopped for dev

2. **Document options**
   - Available policies

3. **Consider dependencies**
   - Redis, PostgreSQL

### Restart Policies

| Policy | Behavior |
|--------|----------|
| no | Never restart |
| always | Always restart |
| on-failure | Restart on error |
| unless-stopped | Restart unless manually stopped |

### Docker Compose Configuration

```yaml
celery-worker:
  restart: unless-stopped
  
celery-beat:
  restart: unless-stopped
  
flower:
  restart: unless-stopped
```

### Development Recommendation

| Service | Policy | Reason |
|---------|--------|--------|
| celery-worker | unless-stopped | Auto-recovery |
| celery-beat | unless-stopped | Keep scheduling |
| flower | unless-stopped | Monitoring available |

### Production Recommendation

| Service | Policy | Additional |
|---------|--------|------------|
| celery-worker | always | With auto-scaling |
| celery-beat | always | Single instance |
| flower | always | Behind proxy |

### Dependency Handling

Restart policy with depends_on:
```yaml
celery-worker:
  restart: unless-stopped
  depends_on:
    redis:
      condition: service_healthy
    postgres:
      condition: service_healthy
```

### Expected Outcome
- Restart policy set
- Auto-recovery enabled

### Verification Checklist
- [ ] Restart policy in compose
- [ ] Unless-stopped for dev
- [ ] All Celery services covered

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Configure Flower Port | Port 5555 |
| 64 | Configure Flower Auth | Basic auth |
| 65 | Create Celery Health Check | celery-health.sh |
| 66 | Configure Worker Restart Policy | unless-stopped |

### Files Created/Modified
| File | Purpose |
|------|---------|
| celery-health.sh | Worker health check |

### Complete Scripts Directory

```
docker/scripts/
├── celery-worker.sh      # Worker entrypoint
├── celery-beat.sh        # Beat entrypoint
├── celery-health.sh      # Health check
└── flower.sh             # Flower entrypoint
```

### Environment Variables Summary

| Variable | Default | Purpose |
|----------|---------|---------|
| CELERY_APP | config.celery:app | App path |
| CELERY_CONCURRENCY | 2 | Worker count |
| CELERY_QUEUES | default,high_priority,low_priority | Queue list |
| CELERY_LOG_LEVEL | info | Logging |
| CELERY_BEAT_SCHEDULER | DatabaseScheduler | Schedule storage |
| FLOWER_PORT | 5555 | Web UI port |
| FLOWER_BASIC_AUTH | admin:admin | Auth credentials |

### Next Steps
Proceed to [../Group-G_Docker-Compose-Configuration/00_GROUP_OVERVIEW.md](../Group-G_Docker-Compose-Configuration/00_GROUP_OVERVIEW.md) for Docker Compose file creation.

---

## Notes for AI Agents

1. **Health check:** Use celery inspect ping
2. **Restart policy:** unless-stopped for development
3. **Flower auth:** Always change in production
4. **Dependencies:** Wait for Redis/Postgres
5. **Permissions:** Set executable on all scripts
6. **Git:** Commit Group F files together
