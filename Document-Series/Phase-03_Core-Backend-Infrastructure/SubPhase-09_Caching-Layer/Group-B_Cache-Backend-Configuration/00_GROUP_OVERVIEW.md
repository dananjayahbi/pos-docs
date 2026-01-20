# Group B: Cache Backend Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Configure Django cache backends with Redis

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Redis-Setup/](../Group-A_Redis-Setup/)
- **→ Next Group:** [../Group-C_Tenant-Scoped-Caching/](../Group-C_Tenant-Scoped-Caching/)

---

## Group Overview

This group configures Django's cache framework to use Redis as the backend. It sets up multiple cache aliases for different purposes (default cache, sessions) and defines cache timeout constants for consistent TTL management across the application.

### Key Outcomes
- CACHES setting configured with Redis backend
- Default and sessions cache aliases set up
- Cache options configured (timeout, key prefix, max entries)
- Django sessions configured to use Redis
- Cache timeout constants defined (SHORT, MEDIUM, LONG)

### Technology Context
- **Backend:** django_redis.cache.RedisCache
- **Client:** django_redis.client.DefaultClient
- **Session Engine:** django.contrib.sessions.backends.cache
- **Key Prefix:** lcc (LankaCommerce Cloud)
- **Default Timeout:** 300 seconds

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-19_CACHES-Setting.md | 15-19 | Configure CACHES dict, default backend, sessions backend, cache locations, cache options |
| 02 | 02_Tasks-20-23_Cache-Options.md | 20-23 | Set default timeout, KEY_PREFIX, KEY_FUNCTION, MAX_ENTRIES |
| 03 | 03_Tasks-24-26_Session-Configuration.md | 24-26 | Configure SESSION_ENGINE, SESSION_CACHE_ALIAS, SESSION_COOKIE_AGE |
| 04 | 04_Tasks-27-30_Timeout-Constants.md | 27-30 | Create constants module, define SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Configure CACHES Setting | Task 14 | Medium |
| 16 | Add default Cache Backend | Task 15 | Simple |
| 17 | Add sessions Cache Backend | Task 16 | Simple |
| 18 | Configure Cache Locations | Task 17 | Simple |
| 19 | Configure Cache Options | Task 18 | Medium |
| 20 | Set Default Timeout | Task 19 | Simple |
| 21 | Configure KEY_PREFIX | Task 20 | Simple |
| 22 | Configure KEY_FUNCTION | Task 21 | Medium |
| 23 | Configure MAX_ENTRIES | Task 22 | Simple |
| 24 | Configure SESSION_ENGINE | Task 23 | Simple |
| 25 | Configure SESSION_CACHE_ALIAS | Task 24 | Simple |
| 26 | Configure SESSION_COOKIE_AGE | Task 25 | Simple |
| 27 | Create Cache Timeouts Constants | Task 26 | Simple |
| 28 | Define SHORT_CACHE (5 min) | Task 27 | Simple |
| 29 | Define MEDIUM_CACHE (1 hour) | Task 28 | Simple |
| 30 | Define LONG_CACHE (1 day) | Task 29 | Simple |

---

## Execution Order

```
01_Tasks-15-19_CACHES-Setting.md
        │
        ▼
02_Tasks-20-23_Cache-Options.md
        │
        ▼
03_Tasks-24-26_Session-Configuration.md
        │
        ▼
04_Tasks-27-30_Timeout-Constants.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   └── settings/
│       ├── base.py           # CACHES and SESSION settings
│       └── cache.py          # Cache-specific settings
└── apps/
    └── core/
        └── cache/
            └── constants.py  # SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE
```

---

## Notes for AI Agents

1. **Cache Aliases:** Use "default" for general cache, "sessions" for session storage
2. **Key Prefix:** Use "lcc" to namespace all keys
3. **Session Engine:** django.contrib.sessions.backends.cache
4. **Timeout Constants:** SHORT=300, MEDIUM=3600, LONG=86400
5. **Redis DBs:** default=DB0, sessions=DB1
6. **Git Commit:** Commit after completing this group
