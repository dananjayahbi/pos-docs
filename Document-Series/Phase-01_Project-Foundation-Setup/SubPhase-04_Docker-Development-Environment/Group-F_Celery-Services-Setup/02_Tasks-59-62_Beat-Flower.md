# Tasks 59-62: Beat and Flower Services

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** F - Celery Services Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-58_Worker-Setup.md](01_Tasks-55-58_Worker-Setup.md)
- **→ Next Document:** [03_Tasks-63-66_Monitoring-Health.md](03_Tasks-63-66_Monitoring-Health.md)

---

## Document Overview

This document covers creating the Celery Beat scheduler entrypoint and Flower monitoring service configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 59 | Create Celery Beat Entrypoint | Medium |
| 60 | Configure Beat Schedule Storage | Medium |
| 61 | Configure Beat Log Level | Simple |
| 62 | Create Flower Service Script | Medium |

---

## Task 59: Create Celery Beat Entrypoint

### Overview
Create the entrypoint script for the Celery Beat scheduler service.

### Dependencies
- Task 07: Create docker/scripts/ Directory

### Instructions

1. **Create celery-beat.sh**
   - In docker/scripts/

2. **Add startup logic**
   - Wait for Redis

3. **Configure beat command**
   - With schedule storage

### File Location

```
docker/
└── scripts/
    ├── celery-worker.sh
    └── celery-beat.sh
```

### Entrypoint Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Celery Beat Entrypoint
# ==================================================
# Purpose: Start Celery Beat for scheduled tasks
# Dependencies: Redis, PostgreSQL
# ==================================================

set -e

# Beat settings
APP_NAME="${CELERY_APP:-config.celery:app}"
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
SCHEDULER="${CELERY_BEAT_SCHEDULER:-django_celery_beat.schedulers:DatabaseScheduler}"
SCHEDULE_FILE="${CELERY_BEAT_SCHEDULE:-/tmp/celerybeat-schedule}"
PID_FILE="${CELERY_BEAT_PID:-/tmp/celerybeat.pid}"

echo "=========================================="
echo "Starting Celery Beat"
echo "=========================================="
echo "App: ${APP_NAME}"
echo "Scheduler: ${SCHEDULER}"
echo "Log Level: ${LOG_LEVEL}"
echo "=========================================="

# Wait for Redis
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
    sleep 1
done
echo "Redis is ready!"

# Wait for PostgreSQL (needed for database scheduler)
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Remove stale PID file
rm -f "${PID_FILE}"

# Start Celery Beat
exec celery -A "${APP_NAME}" beat \
    --loglevel="${LOG_LEVEL}" \
    --scheduler="${SCHEDULER}" \
    --pidfile="${PID_FILE}"
```

### Beat Purpose

| Function | Description |
|----------|-------------|
| Scheduling | Trigger tasks at intervals |
| Cron-like | Time-based execution |
| Database sync | Dynamic schedule changes |

### Expected Outcome
- Beat entrypoint created
- Scheduler configured

### Verification Checklist
- [ ] celery-beat.sh created
- [ ] Wait for dependencies
- [ ] Scheduler specified
- [ ] PID file cleanup

---

## Task 60: Configure Beat Schedule Storage

### Overview
Configure how Celery Beat stores its schedule information.

### Dependencies
- Task 59: Create Celery Beat Entrypoint

### Instructions

1. **Use database scheduler**
   - django-celery-beat

2. **Configure scheduler class**
   - DatabaseScheduler

3. **Document alternatives**
   - File vs database

### Scheduler Options

| Scheduler | Storage | Dynamic |
|-----------|---------|---------|
| default | File (celerybeat-schedule) | No |
| DatabaseScheduler | PostgreSQL | Yes |

### Environment Variable

```bash
SCHEDULER="${CELERY_BEAT_SCHEDULER:-django_celery_beat.schedulers:DatabaseScheduler}"
```

### Why Database Scheduler

| Benefit | Description |
|---------|-------------|
| Dynamic | Change without restart |
| Admin UI | Django admin integration |
| Persistence | Survives container restart |
| Multi-instance | Only one beat runs |

### Django Integration

Required in settings:
```python
INSTALLED_APPS = [
    # ...
    'django_celery_beat',
]

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
```

### Admin Interface

django-celery-beat provides:
| Model | Purpose |
|-------|---------|
| PeriodicTask | Task definitions |
| IntervalSchedule | Interval-based |
| CrontabSchedule | Cron-based |
| SolarSchedule | Solar events |

### Expected Outcome
- Database scheduler configured
- Dynamic schedules enabled

### Verification Checklist
- [ ] DatabaseScheduler used
- [ ] Environment variable set
- [ ] Django settings documented

---

## Task 61: Configure Beat Log Level

### Overview
Configure the logging level for Celery Beat.

### Dependencies
- Task 59: Create Celery Beat Entrypoint

### Instructions

1. **Set default log level**
   - Info for development

2. **Share with worker**
   - Same environment variable

3. **Document output**
   - What to expect

### Environment Variable

```bash
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
```

### Beat Logs

| Event | Log Level |
|-------|-----------|
| Task scheduled | INFO |
| Scheduler sync | DEBUG |
| Errors | ERROR |
| Startup | INFO |

### Sample Log Output

```
[INFO/MainProcess] beat: Starting...
[INFO/MainProcess] Scheduler: Sending due task process-daily-orders
[INFO/MainProcess] Scheduler: Sending due task cleanup-expired-carts
```

### Complete Beat Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Celery Beat Entrypoint
# ==================================================
# Purpose: Start Celery Beat for scheduled tasks
# Dependencies: Redis, PostgreSQL
# ==================================================

set -e

# Configuration
APP_NAME="${CELERY_APP:-config.celery:app}"
LOG_LEVEL="${CELERY_LOG_LEVEL:-info}"
SCHEDULER="${CELERY_BEAT_SCHEDULER:-django_celery_beat.schedulers:DatabaseScheduler}"
PID_FILE="${CELERY_BEAT_PID:-/tmp/celerybeat.pid}"

echo "=========================================="
echo "Starting Celery Beat"
echo "=========================================="
echo "App: ${APP_NAME}"
echo "Scheduler: ${SCHEDULER}"
echo "Log Level: ${LOG_LEVEL}"
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

# Clean up stale PID file
rm -f "${PID_FILE}"

# Start Celery Beat
echo "Starting Celery Beat..."
exec celery -A "${APP_NAME}" beat \
    --loglevel="${LOG_LEVEL}" \
    --scheduler="${SCHEDULER}" \
    --pidfile="${PID_FILE}"
```

### Expected Outcome
- Log level configurable
- Consistent with worker

### Verification Checklist
- [ ] LOG_LEVEL variable used
- [ ] Default = info
- [ ] --loglevel flag applied

---

## Task 62: Create Flower Service Script

### Overview
Create the entrypoint script for Flower monitoring service.

### Dependencies
- Task 07: Create docker/scripts/ Directory

### Instructions

1. **Create flower.sh**
   - In docker/scripts/

2. **Configure Flower options**
   - Port, broker, auth

3. **Add startup logic**
   - Wait for Redis

### File Location

```
docker/
└── scripts/
    ├── celery-worker.sh
    ├── celery-beat.sh
    └── flower.sh
```

### Entrypoint Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Flower Entrypoint
# ==================================================
# Purpose: Start Flower web monitoring for Celery
# Dependencies: Redis
# ==================================================

set -e

# Flower settings
BROKER_URL="${CELERY_BROKER_URL:-redis://redis:6379/0}"
FLOWER_PORT="${FLOWER_PORT:-5555}"
FLOWER_BASIC_AUTH="${FLOWER_BASIC_AUTH:-admin:admin}"
FLOWER_URL_PREFIX="${FLOWER_URL_PREFIX:-}"

echo "=========================================="
echo "Starting Flower"
echo "=========================================="
echo "Broker: ${BROKER_URL}"
echo "Port: ${FLOWER_PORT}"
echo "URL Prefix: ${FLOWER_URL_PREFIX:-/}"
echo "=========================================="

# Wait for Redis
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
    sleep 1
done
echo "Redis is ready!"

# Start Flower
if [ -n "${FLOWER_URL_PREFIX}" ]; then
    exec celery --broker="${BROKER_URL}" flower \
        --port="${FLOWER_PORT}" \
        --basic_auth="${FLOWER_BASIC_AUTH}" \
        --url_prefix="${FLOWER_URL_PREFIX}"
else
    exec celery --broker="${BROKER_URL}" flower \
        --port="${FLOWER_PORT}" \
        --basic_auth="${FLOWER_BASIC_AUTH}"
fi
```

### Flower Features

| Feature | Description |
|---------|-------------|
| Task Monitoring | Real-time task status |
| Worker Status | Online/offline workers |
| Task History | Completed task logs |
| Worker Control | Restart, terminate |

### Web Interface

Access at:
```
http://localhost:5555
```

### Expected Outcome
- Flower entrypoint created
- Authentication configured

### Verification Checklist
- [ ] flower.sh created
- [ ] Broker URL configured
- [ ] Port setting
- [ ] Basic auth enabled

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 59 | Create Celery Beat Entrypoint | celery-beat.sh |
| 60 | Configure Beat Schedule Storage | DatabaseScheduler |
| 61 | Configure Beat Log Level | Logging config |
| 62 | Create Flower Service Script | flower.sh |

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| CELERY_BEAT_SCHEDULER | DatabaseScheduler | Schedule storage |
| CELERY_BEAT_PID | /tmp/celerybeat.pid | PID file location |
| FLOWER_PORT | 5555 | Web UI port |
| FLOWER_BASIC_AUTH | admin:admin | Authentication |
| CELERY_BROKER_URL | redis://redis:6379/0 | Broker connection |

### Scripts Created

| Script | Service | Purpose |
|--------|---------|---------|
| celery-beat.sh | Beat | Scheduled tasks |
| flower.sh | Flower | Web monitoring |

### Next Steps
Proceed to [03_Tasks-63-66_Monitoring-Health.md](03_Tasks-63-66_Monitoring-Health.md) for health checks and restart policies.

---

## Notes for AI Agents

1. **Beat singleton:** Only one beat instance
2. **DatabaseScheduler:** Requires django-celery-beat
3. **PID cleanup:** Remove stale PID on start
4. **Flower auth:** Always set in production
5. **URL prefix:** For reverse proxy setups
6. **Git:** Do NOT commit yet - complete Group F first
