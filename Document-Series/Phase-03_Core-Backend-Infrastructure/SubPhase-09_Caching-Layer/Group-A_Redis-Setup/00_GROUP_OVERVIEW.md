# Group A: Redis Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure Redis connection for caching

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Cache-Backend-Configuration/](../Group-B_Cache-Backend-Configuration/)

---

## Group Overview

This group sets up the Redis connection infrastructure for the LankaCommerce Cloud platform. Redis serves as the primary caching backend, providing high-performance in-memory data storage for session management, query caching, and rate limiting.

### Key Outcomes
- django-redis and redis packages installed
- Redis Docker service verified
- Redis settings module created
- Environment-specific Redis URLs configured
- Connection pool and timeout settings configured

### Technology Context
- **Packages:** django-redis, redis
- **Service:** Redis 7.x (Docker)
- **Settings File:** config/settings/redis.py
- **Default Port:** 6379
- **Connection:** redis://localhost:6379/0

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Redis-Package-Install.md | 01-05 | Install django-redis, pin version, install redis client, verify Docker Redis, test connection |
| 02 | 02_Tasks-06-10_Redis-Settings-URLs.md | 06-10 | Create redis.py settings, configure REDIS_URL, dev/prod URLs, Redis database numbers |
| 03 | 03_Tasks-11-14_Redis-Pool-Integration.md | 11-14 | Configure connection pool, socket timeout, import settings in base.py, verify configuration |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install django-redis | SubPhase-06 | Simple |
| 02 | Pin django-redis Version | Task 01 | Simple |
| 03 | Install redis Package | Task 02 | Simple |
| 04 | Verify Redis Running | Task 03 | Simple |
| 05 | Test Redis Connection | Task 04 | Simple |
| 06 | Create Redis Settings File | Task 05 | Medium |
| 07 | Configure REDIS_URL | Task 06 | Simple |
| 08 | Configure Dev Redis URL | Task 07 | Simple |
| 09 | Configure Prod Redis URL | Task 08 | Simple |
| 10 | Configure Redis Database | Task 09 | Medium |
| 11 | Configure Connection Pool | Task 10 | Medium |
| 12 | Configure Socket Timeout | Task 11 | Simple |
| 13 | Import Redis Settings | Task 12 | Simple |
| 14 | Test Redis Settings | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Redis-Package-Install.md
        │
        ▼
02_Tasks-06-10_Redis-Settings-URLs.md
        │
        ▼
03_Tasks-11-14_Redis-Pool-Integration.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── base.txt              # django-redis, redis added
├── config/
│   └── settings/
│       └── redis.py          # Redis settings module
├── docker-compose.yml        # Redis service verified
└── .env.example              # REDIS_URL added
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-06 complete (Docker with Redis)
2. **Version:** Use django-redis>=5.4.0 for Django 5.x
3. **Database Allocation:** DB 0 = cache, DB 1 = sessions, DB 2 = Celery
4. **Pool Size:** Default 10, increase for high-traffic
5. **Timeout:** 5 seconds for development
6. **Git Commit:** Commit after completing this group
