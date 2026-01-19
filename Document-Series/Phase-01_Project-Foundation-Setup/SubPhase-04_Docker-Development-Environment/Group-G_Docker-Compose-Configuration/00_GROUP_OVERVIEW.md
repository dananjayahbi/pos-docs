# Group G: Docker Compose Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** G of H  
> **Tasks Covered:** 67-80  
> **Group Goal:** Create comprehensive Docker Compose configuration for all services

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Celery-Services-Setup/](../Group-F_Celery-Services-Setup/)
- **→ Next Group:** [../Group-H_Development-Scripts-Verification/](../Group-H_Development-Scripts-Verification/)

---

## Group Overview

This group creates the main docker-compose.yml file that orchestrates all services for the development environment. It defines service configurations, networks, volumes, health checks, and inter-service dependencies.

### Key Outcomes
- Complete docker-compose.yml with all services
- Service definitions for backend, frontend, database, cache, and workers
- Custom Docker network for service communication
- Named volumes for data persistence
- Environment file integration
- Health checks and dependency ordering

### Technology Context
- **Compose Version:** v2 specification
- **Network:** Custom bridge network
- **Volumes:** Named volumes for PostgreSQL, Redis
- **Environment:** .env file for configuration

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-67-70_Core-Services.md | 67-70 | Create compose file, backend, frontend, PostgreSQL services |
| 02 | 02_Tasks-71-74_Support-Services.md | 71-74 | Redis, Celery worker, Celery beat, network configuration |
| 03 | 03_Tasks-75-80_Config-Complete.md | 75-80 | Volumes, env files, health checks, dependencies, production override |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 67 | Create docker-compose.yml | Task 01 | Complex |
| 68 | Define Backend Service | Tasks 22, 67 | Medium |
| 69 | Define Frontend Service | Tasks 34, 67 | Medium |
| 70 | Define PostgreSQL Service | Tasks 45, 67 | Medium |
| 71 | Define Redis Service | Tasks 54, 67 | Medium |
| 72 | Define Celery Worker Service | Tasks 66, 67 | Medium |
| 73 | Define Celery Beat Service | Tasks 61, 67 | Medium |
| 74 | Configure Docker Network | Task 67 | Simple |
| 75 | Configure Volumes | Task 67 | Simple |
| 76 | Configure Environment Files | Task 67 | Simple |
| 77 | Configure Health Checks | Task 67 | Medium |
| 78 | Configure Dependencies | Tasks 68-73 | Medium |
| 79 | Create docker-compose.override.yml | Task 67 | Medium |
| 80 | Create docker-compose.prod.yml | Task 67 | Complex |

---

## Execution Order

```
01_Tasks-67-70_Core-Services.md
        │
        ▼
02_Tasks-71-74_Support-Services.md
        │
        ▼
03_Tasks-75-80_Config-Complete.md
```

---

## Expected Deliverables

```
(root)/
├── docker-compose.yml           # Main compose file
├── docker-compose.override.yml  # Local overrides
└── docker-compose.prod.yml      # Production compose
```

---

## Service Overview

| Service | Image/Build | Ports | Purpose |
|---------|-------------|-------|---------|
| backend | ./docker/backend | 8000 | Django API |
| frontend | ./docker/frontend | 3000 | Next.js app |
| db | postgres:15 | 5432 | Database |
| redis | redis:7-alpine | 6379 | Cache/Broker |
| celery-worker | ./docker/backend | - | Task worker |
| celery-beat | ./docker/backend | - | Scheduler |
| flower | ./docker/backend | 5555 | Monitoring |

---

## Notes for AI Agents

1. **Dependencies:** Requires all previous groups complete
2. **Service Order:** db → redis → backend → celery → frontend
3. **Health Checks:** All services should have health checks
4. **Volumes:** Use named volumes for data persistence
5. **Override:** docker-compose.override.yml for local customization
6. **Git Commit:** Commit after completing this group
