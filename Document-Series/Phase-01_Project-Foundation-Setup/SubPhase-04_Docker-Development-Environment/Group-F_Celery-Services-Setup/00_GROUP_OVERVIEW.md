# Group F: Celery Services Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** F of H  
> **Tasks Covered:** 55-66  
> **Group Goal:** Configure Celery worker, beat, and monitoring services

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Redis-Container-Setup/](../Group-E_Redis-Container-Setup/)
- **→ Next Group:** [../Group-G_Docker-Compose-Configuration/](../Group-G_Docker-Compose-Configuration/)

---

## Group Overview

This group creates the entrypoint scripts and configuration for Celery services: the worker for processing background tasks, beat for scheduled tasks, and Flower for monitoring. These services are essential for async operations in the ERP system.

### Key Outcomes
- Celery worker entrypoint with concurrency settings
- Celery beat entrypoint with scheduler configuration
- Flower monitoring service configuration
- Health check scripts for Celery services
- Restart policies for reliability

### Technology Context
- **Celery Version:** 5.x
- **Broker:** Redis
- **Result Backend:** Redis or Django database
- **Monitoring:** Flower web UI
- **Scheduler:** Celery Beat with database storage

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-55-58_Worker-Setup.md | 55-58 | Worker entrypoint, concurrency, queues, log level |
| 02 | 02_Tasks-59-62_Beat-Flower.md | 59-62 | Beat entrypoint, schedule storage, Flower service, port |
| 03 | 03_Tasks-63-66_Monitoring-Health.md | 63-66 | Flower auth, health check, restart policy |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 55 | Create Celery Worker Entrypoint | Task 07 | Medium |
| 56 | Configure Worker Concurrency | Task 55 | Simple |
| 57 | Configure Worker Queues | Task 55 | Simple |
| 58 | Configure Worker Log Level | Task 55 | Simple |
| 59 | Create Celery Beat Entrypoint | Task 07 | Medium |
| 60 | Configure Beat Schedule Storage | Task 59 | Medium |
| 61 | Configure Beat Log Level | Task 59 | Simple |
| 62 | Create Flower Service Script | Task 07 | Medium |
| 63 | Configure Flower Port | Task 62 | Simple |
| 64 | Configure Flower Auth | Task 62 | Simple |
| 65 | Create Celery Health Check | Task 55 | Medium |
| 66 | Configure Worker Restart Policy | Task 55 | Simple |

---

## Execution Order

```
01_Tasks-55-58_Worker-Setup.md
        │
        ▼
02_Tasks-59-62_Beat-Flower.md
        │
        ▼
03_Tasks-63-66_Monitoring-Health.md
```

---

## Expected Deliverables

```
docker/scripts/
├── celery-beat.sh           # Beat entrypoint
├── celery-health.sh         # Health check script
├── celery-worker.sh         # Worker entrypoint
└── flower.sh                # Flower entrypoint
```

---

## Celery Services Overview

| Service | Purpose | Port |
|---------|---------|------|
| Worker | Process background tasks | - |
| Beat | Schedule periodic tasks | - |
| Flower | Web monitoring UI | 5555 |

---

## Notes for AI Agents

1. **Dependencies:** Requires docker/scripts/ directory
2. **Worker Concurrency:** Set based on available CPU cores
3. **Beat Storage:** Use django-celery-beat for database storage
4. **Flower Auth:** Basic auth for development
5. **Health Check:** Uses celery inspect ping
6. **Git Commit:** Commit after completing this group
