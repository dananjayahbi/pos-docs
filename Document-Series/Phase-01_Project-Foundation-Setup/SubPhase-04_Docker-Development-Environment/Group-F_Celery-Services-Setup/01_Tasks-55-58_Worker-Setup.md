# Tasks 55-58: Worker Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** F - Celery Services Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Redis-Container-Setup/02_Tasks-51-54_Logging-Health.md](../Group-E_Redis-Container-Setup/02_Tasks-51-54_Logging-Health.md)
- **→ Next Document:** [02_Tasks-59-62_Beat-Flower.md](02_Tasks-59-62_Beat-Flower.md)

---

## Document Overview

This document covers creating the Celery worker entrypoint script with concurrency, queue, and logging configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create Celery Worker Entrypoint | Medium |
| 56 | Configure Worker Concurrency | Simple |
| 57 | Configure Worker Queues | Simple |
| 58 | Configure Worker Log Level | Simple |

---

## Task 55: Create Celery Worker Entrypoint

### Overview
Create the entrypoint script for the Celery worker service.

### Dependencies
- Task 07: Create docker/scripts/ Directory

### Instructions

1. **Create celery-worker.sh**
   - In docker/scripts/

2. **Add startup logic**
   - Wait for dependencies

3. **Configure celery command**
   - Worker with app

### File Location

```
docker/
└── scripts/
    └── celery-worker.sh
```

### Entrypoint Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Celery Worker Entrypoint
# ==================================================
# Purpose: Start Celery worker for background tasks
# Dependencies: Redis, PostgreSQL
# ==================================================

set -e

# Worker settings
APP_NAME="${CELERY_APP:-config.celery:app}"
CONCURRENCY="${CELERY_CONCURRENCY:-2}"
QUEUES="${CELERY_QUEUES:-default,high_priority,low_priority}"
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
WORKER_NAME="${CELERY_WORKER_NAME:-worker@%h}"

echo "=========================================="
echo "Starting Celery Worker"
echo "=========================================="
echo "App: ${APP_NAME}"
echo "Concurrency: ${CONCURRENCY}"
echo "Queues: ${QUEUES}"
echo "Log Level: ${LOG_LEVEL}"
echo "=========================================="

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
    sleep 1
done
echo "Redis is ready!"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Start Celery worker
exec celery -A "${APP_NAME}" worker \
    --loglevel="${LOG_LEVEL}" \
    --concurrency="${CONCURRENCY}" \
    --queues="${QUEUES}" \
    --hostname="${WORKER_NAME}"
```

### Script Components

| Component | Purpose |
|-----------|---------|
| set -e | Exit on error |
| Environment vars | Configurable settings |
| Dependency wait | Wait for Redis/Postgres |
| exec celery | Start worker process |

### Executable Permission

```bash
chmod +x docker/scripts/celery-worker.sh
```

### Expected Outcome
- Worker entrypoint created
- Dependency wait logic

### Verification Checklist
- [ ] celery-worker.sh created
- [ ] Wait for Redis
- [ ] Wait for PostgreSQL
- [ ] Executable permission

---

## Task 56: Configure Worker Concurrency

### Overview
Configure the number of concurrent worker processes.

### Dependencies
- Task 55: Create Celery Worker Entrypoint

### Instructions

1. **Set default concurrency**
   - Environment variable

2. **Document calculation**
   - Based on resources

3. **Auto-scaling option**
   - Autoscale parameter

### Environment Variable

```bash
CELERY_CONCURRENCY="${CELERY_CONCURRENCY:-2}"
```

### Concurrency Guidelines

| Environment | CPU Cores | Concurrency |
|-------------|-----------|-------------|
| Development | 2-4 | 2 |
| Staging | 4-8 | 4 |
| Production | 8+ | 8-16 |

### Calculation Formula

For CPU-bound tasks:
```
concurrency = CPU cores
```

For I/O-bound tasks:
```
concurrency = (CPU cores * 2) + 1
```

### Auto-Scaling

For production:
```bash
celery -A config.celery worker \
    --autoscale=10,3 \  # Max 10, Min 3
    --loglevel=info
```

### Docker Compose Override

```yaml
celery-worker:
  environment:
    - CELERY_CONCURRENCY=4
```

### Expected Outcome
- Concurrency configurable
- Default value set

### Verification Checklist
- [ ] Environment variable used
- [ ] Default = 2
- [ ] Documentation added

---

## Task 57: Configure Worker Queues

### Overview
Configure the queues the worker will process.

### Dependencies
- Task 55: Create Celery Worker Entrypoint

### Instructions

1. **Define queue names**
   - Comma-separated list

2. **Set priority order**
   - High priority first

3. **Document queue purposes**
   - What goes where

### Environment Variable

```bash
QUEUES="${CELERY_QUEUES:-default,high_priority,low_priority}"
```

### Queue Definitions

| Queue | Purpose | Example Tasks |
|-------|---------|---------------|
| default | Standard tasks | Email, reports |
| high_priority | Urgent tasks | Payments, alerts |
| low_priority | Background tasks | Cleanup, sync |

### Task Routing Example

In Django settings:
```python
CELERY_TASK_ROUTES = {
    'orders.tasks.process_payment': {'queue': 'high_priority'},
    'reports.tasks.generate_report': {'queue': 'low_priority'},
    '*': {'queue': 'default'},
}
```

### Multiple Worker Strategy

For production, separate workers:
```yaml
celery-worker-high:
  environment:
    - CELERY_QUEUES=high_priority
    - CELERY_CONCURRENCY=4

celery-worker-default:
  environment:
    - CELERY_QUEUES=default
    - CELERY_CONCURRENCY=2
```

### Expected Outcome
- Queues configurable
- Multiple queues defined

### Verification Checklist
- [ ] Queue names defined
- [ ] Environment variable used
- [ ] Priority order set

---

## Task 58: Configure Worker Log Level

### Overview
Configure the logging level for the Celery worker.

### Dependencies
- Task 55: Create Celery Worker Entrypoint

### Instructions

1. **Set default log level**
   - Info for development

2. **Environment override**
   - For debugging

3. **Document levels**
   - Available options

### Environment Variable

```bash
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
```

### Log Levels

| Level | Output |
|-------|--------|
| DEBUG | All details |
| INFO | Normal operations |
| WARNING | Issues only |
| ERROR | Errors only |
| CRITICAL | Fatal only |

### Development vs Production

| Environment | Level | Reason |
|-------------|-------|--------|
| Development | INFO | See task execution |
| Production | WARNING | Reduce noise |

### Debug Mode

For troubleshooting:
```yaml
celery-worker:
  environment:
    - CELERY_LOG_LEVEL=debug
```

### Complete Worker Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Celery Worker Entrypoint
# ==================================================
# Purpose: Start Celery worker for background tasks
# Dependencies: Redis, PostgreSQL
# ==================================================

set -e

# Configuration from environment
APP_NAME="${CELERY_APP:-config.celery:app}"
CONCURRENCY="${CELERY_CONCURRENCY:-2}"
QUEUES="${CELERY_QUEUES:-default,high_priority,low_priority}"
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
WORKER_NAME="${CELERY_WORKER_NAME:-worker@%h}"

echo "=========================================="
echo "Starting Celery Worker"
echo "=========================================="
echo "App: ${APP_NAME}"
echo "Concurrency: ${CONCURRENCY}"
echo "Queues: ${QUEUES}"
echo "Log Level: ${LOG_LEVEL}"
echo "Worker Name: ${WORKER_NAME}"
echo "=========================================="

# Wait for Redis
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
    echo "Redis not ready, retrying..."
    sleep 1
done
echo "Redis is ready!"

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
    echo "PostgreSQL not ready, retrying..."
    sleep 1
done
echo "PostgreSQL is ready!"

# Start Celery worker
echo "Starting Celery worker..."
exec celery -A "${APP_NAME}" worker \
    --loglevel="${LOG_LEVEL}" \
    --concurrency="${CONCURRENCY}" \
    --queues="${QUEUES}" \
    --hostname="${WORKER_NAME}" \
    --events
```

### Expected Outcome
- Log level configurable
- Default INFO

### Verification Checklist
- [ ] LOG_LEVEL variable
- [ ] Default = info
- [ ] --loglevel flag used

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 55 | Create Celery Worker Entrypoint | celery-worker.sh |
| 56 | Configure Worker Concurrency | CELERY_CONCURRENCY |
| 57 | Configure Worker Queues | Queue configuration |
| 58 | Configure Worker Log Level | CELERY_LOG_LEVEL |

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| CELERY_APP | config.celery:app | Celery app path |
| CELERY_CONCURRENCY | 2 | Worker processes |
| CELERY_QUEUES | default,high_priority,low_priority | Queues to process |
| CELERY_LOG_LEVEL | info | Logging verbosity |
| CELERY_WORKER_NAME | worker@%h | Worker hostname |

### Next Steps
Proceed to [02_Tasks-59-62_Beat-Flower.md](02_Tasks-59-62_Beat-Flower.md) for beat and Flower configuration.

---

## Notes for AI Agents

1. **Dependency wait:** Use nc (netcat) for checks
2. **exec:** Replaces shell with celery process
3. **Concurrency:** Start low, scale up
4. **Queues:** Comma-separated list
5. **Logging:** INFO for dev, WARNING for prod
6. **Git:** Do NOT commit yet - complete Group F first
