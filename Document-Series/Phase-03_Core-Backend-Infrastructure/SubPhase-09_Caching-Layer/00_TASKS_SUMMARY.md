# SubPhase 09: Caching Layer - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 09 of 12  
> **SubPhase Goal:** Implement Redis caching with tenant isolation  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 6-7 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_Celery-Task-Queue](../SubPhase-08_Celery-Task-Queue/)
- **→ Next SubPhase:** [SubPhase-10_File-Storage-Configuration](../SubPhase-10_File-Storage-Configuration/)

---

## SubPhase Overview

This sub-phase implements the Redis caching layer for the LankaCommerce Cloud platform. All cache keys are tenant-scoped to ensure data isolation between tenants.

### Key Outcomes
- Redis cache backend configured
- Tenant-scoped cache keys
- Cache invalidation patterns
- Session caching working
- Query result caching
- Rate limit counters
- Cache decorators ready

### Caching Strategy
```
Cache Key Format: tenant:{tenant_id}:{module}:{identifier}

Examples:
- tenant:001:products:list
- tenant:001:products:detail:123
- tenant:001:categories:tree
- tenant:001:user:permissions:456
```

### Dependencies
- **Requires:** SubPhase-06 (Core Middleware Stack)
- **Requires:** Docker setup (Redis)

---

## Task Execution Order

```
TASK GROUP A: Redis Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Cache Backend Configuration (Tasks 15-30)
        │
        ▼
TASK GROUP C: Tenant-Scoped Caching (Tasks 31-46)
        │
        ▼
TASK GROUP D: Cache Decorators & Utilities (Tasks 47-62)
        │
        ▼
TASK GROUP E: Invalidation Patterns (Tasks 63-76)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 77-88)
```

---

## Task Index

### Group A: Redis Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install django-redis** | pip install django-redis | SubPhase-06 | 🔴 Not Created |
| 02 | **Pin django-redis Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Install redis Package** | Redis client library | Task 02 | 🔴 Not Created |
| 04 | **Verify Redis Running** | Docker Redis service | Task 03 | 🔴 Not Created |
| 05 | **Test Redis Connection** | Connection test | Task 04 | 🔴 Not Created |
| 06 | **Create Redis Settings File** | settings/redis.py | Task 05 | 🔴 Not Created |
| 07 | **Configure REDIS_URL** | Environment variable | Task 06 | 🔴 Not Created |
| 08 | **Configure Dev Redis URL** | localhost:6379 | Task 07 | 🔴 Not Created |
| 09 | **Configure Prod Redis URL** | Redis cluster URL | Task 08 | 🔴 Not Created |
| 10 | **Configure Redis Database** | DB number per use | Task 09 | 🔴 Not Created |
| 11 | **Configure Connection Pool** | Pool size settings | Task 10 | 🔴 Not Created |
| 12 | **Configure Socket Timeout** | Connection timeout | Task 11 | 🔴 Not Created |
| 13 | **Import Redis Settings** | In base.py | Task 12 | 🔴 Not Created |
| 14 | **Test Redis Settings** | Verify configuration | Task 13 | 🔴 Not Created |

---

### Group B: Cache Backend Configuration (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Configure CACHES Setting** | Django cache config | Task 14 | 🔴 Not Created |
| 16 | **Add default Cache Backend** | Redis backend | Task 15 | 🔴 Not Created |
| 17 | **Add sessions Cache Backend** | Session storage | Task 16 | 🔴 Not Created |
| 18 | **Configure Cache Locations** | Redis URLs | Task 17 | 🔴 Not Created |
| 19 | **Configure Cache Options** | Backend options | Task 18 | 🔴 Not Created |
| 20 | **Set Default Timeout** | 300 seconds default | Task 19 | 🔴 Not Created |
| 21 | **Configure KEY_PREFIX** | App prefix | Task 20 | 🔴 Not Created |
| 22 | **Configure KEY_FUNCTION** | Custom key function | Task 21 | 🔴 Not Created |
| 23 | **Configure MAX_ENTRIES** | Cache size limit | Task 22 | 🔴 Not Created |
| 24 | **Configure SESSION_ENGINE** | Redis sessions | Task 23 | 🔴 Not Created |
| 25 | **Configure SESSION_CACHE_ALIAS** | sessions alias | Task 24 | 🔴 Not Created |
| 26 | **Configure SESSION_COOKIE_AGE** | Session lifetime | Task 25 | 🔴 Not Created |
| 27 | **Create Cache Timeouts Constants** | Timeout presets | Task 26 | 🔴 Not Created |
| 28 | **Define SHORT_CACHE (5 min)** | Volatile data | Task 27 | 🔴 Not Created |
| 29 | **Define MEDIUM_CACHE (1 hour)** | Standard data | Task 28 | 🔴 Not Created |
| 30 | **Define LONG_CACHE (1 day)** | Stable data | Task 29 | 🔴 Not Created |

---

### Group C: Tenant-Scoped Caching (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create cache Module** | apps/core/cache/ | Task 30 | 🔴 Not Created |
| 32 | **Create cache __init__.py** | Export utilities | Task 31 | 🔴 Not Created |
| 33 | **Create TenantCache Class** | Tenant-aware cache | Task 32 | 🔴 Not Created |
| 34 | **Add make_key Method** | Tenant-prefixed key | Task 33 | 🔴 Not Created |
| 35 | **Add get Method** | Tenant-scoped get | Task 34 | 🔴 Not Created |
| 36 | **Add set Method** | Tenant-scoped set | Task 35 | 🔴 Not Created |
| 37 | **Add delete Method** | Tenant-scoped delete | Task 36 | 🔴 Not Created |
| 38 | **Add delete_pattern Method** | Pattern-based delete | Task 37 | 🔴 Not Created |
| 39 | **Add get_many Method** | Bulk get | Task 38 | 🔴 Not Created |
| 40 | **Add set_many Method** | Bulk set | Task 39 | 🔴 Not Created |
| 41 | **Add incr Method** | Increment counter | Task 40 | 🔴 Not Created |
| 42 | **Add decr Method** | Decrement counter | Task 41 | 🔴 Not Created |
| 43 | **Create get_tenant_cache** | Get cache instance | Task 42 | 🔴 Not Created |
| 44 | **Handle No Tenant Context** | Fallback handling | Task 43 | 🔴 Not Created |
| 45 | **Export TenantCache** | In __init__.py | Task 44 | 🔴 Not Created |
| 46 | **Test Tenant Cache** | Unit tests | Task 45 | 🔴 Not Created |

---

### Group D: Cache Decorators & Utilities (Tasks 47-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create decorators.py File** | Cache decorators | Task 46 | 🔴 Not Created |
| 48 | **Create cache_response Decorator** | View response cache | Task 47 | 🔴 Not Created |
| 49 | **Add cache_key Parameter** | Custom key name | Task 48 | 🔴 Not Created |
| 50 | **Add timeout Parameter** | Cache duration | Task 49 | 🔴 Not Created |
| 51 | **Add vary_on_tenant** | Tenant variation | Task 50 | 🔴 Not Created |
| 52 | **Add vary_on_user** | User variation | Task 51 | 🔴 Not Created |
| 53 | **Create cache_queryset Decorator** | QuerySet caching | Task 52 | 🔴 Not Created |
| 54 | **Create cache_method Decorator** | Method result cache | Task 53 | 🔴 Not Created |
| 55 | **Create utils.py File** | Cache utilities | Task 54 | 🔴 Not Created |
| 56 | **Create make_cache_key Function** | Key generator | Task 55 | 🔴 Not Created |
| 57 | **Create hash_key Function** | Long key hashing | Task 56 | 🔴 Not Created |
| 58 | **Create cache_get_or_set** | Get or compute | Task 57 | 🔴 Not Created |
| 59 | **Create clear_cache Function** | Manual clear | Task 58 | 🔴 Not Created |
| 60 | **Create cache_stats Function** | Cache statistics | Task 59 | 🔴 Not Created |
| 61 | **Export Decorators** | In __init__.py | Task 60 | 🔴 Not Created |
| 62 | **Test Decorators** | Decorator tests | Task 61 | 🔴 Not Created |

---

### Group E: Invalidation Patterns (Tasks 63-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create invalidation.py File** | Invalidation utilities | Task 62 | 🔴 Not Created |
| 64 | **Create CacheInvalidator Class** | Invalidation manager | Task 63 | 🔴 Not Created |
| 65 | **Add invalidate_model Method** | Clear model cache | Task 64 | 🔴 Not Created |
| 66 | **Add invalidate_list Method** | Clear list cache | Task 65 | 🔴 Not Created |
| 67 | **Add invalidate_detail Method** | Clear detail cache | Task 66 | 🔴 Not Created |
| 68 | **Add invalidate_related Method** | Clear related caches | Task 67 | 🔴 Not Created |
| 69 | **Create Model Signals** | Post-save invalidation | Task 68 | 🔴 Not Created |
| 70 | **Create post_save Handler** | Clear on save | Task 69 | 🔴 Not Created |
| 71 | **Create post_delete Handler** | Clear on delete | Task 70 | 🔴 Not Created |
| 72 | **Create CacheMixin for Models** | Auto-invalidation | Task 71 | 🔴 Not Created |
| 73 | **Define Invalidation Rules** | Per-model rules | Task 72 | 🔴 Not Created |
| 74 | **Create invalidate_tenant_cache** | Full tenant clear | Task 73 | 🔴 Not Created |
| 75 | **Create Management Command** | clearcache command | Task 74 | 🔴 Not Created |
| 76 | **Test Invalidation** | Invalidation tests | Task 75 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 77-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create Cache Test Utils** | Test utilities | Task 76 | 🔴 Not Created |
| 78 | **Configure Test Cache Backend** | In-memory for tests | Task 77 | 🔴 Not Created |
| 79 | **Test TenantCache Class** | TenantCache tests | Task 78 | 🔴 Not Created |
| 80 | **Test Cache Isolation** | Tenant isolation | Task 79 | 🔴 Not Created |
| 81 | **Test Cache Decorators** | Decorator tests | Task 80 | 🔴 Not Created |
| 82 | **Test Invalidation Patterns** | Invalidation tests | Task 81 | 🔴 Not Created |
| 83 | **Test Session Caching** | Session tests | Task 82 | 🔴 Not Created |
| 84 | **Create Cache README** | Usage documentation | Task 83 | 🔴 Not Created |
| 85 | **Document Cache Patterns** | Pattern guide | Task 84 | 🔴 Not Created |
| 86 | **Document Invalidation** | Invalidation guide | Task 85 | 🔴 Not Created |
| 87 | **Create Performance Guidelines** | Cache best practices | Task 86 | 🔴 Not Created |
| 88 | **Verify Full Integration** | End-to-end test | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── cache/
│   ├── __init__.py
│   ├── backends.py
│   ├── tenant_cache.py
│   ├── decorators.py
│   ├── utils.py
│   ├── invalidation.py
│   └── constants.py
├── management/
│   └── commands/
│       └── clearcache.py
├── tests/
│   └── test_cache/
│       ├── __init__.py
│       ├── test_tenant_cache.py
│       ├── test_decorators.py
│       └── test_invalidation.py
└── docs/
    └── caching/
        ├── overview.md
        ├── patterns.md
        └── invalidation.md
```

---

## Cache Key Structure

```
┌─────────────────────────────────────────────────────┐
│               CACHE KEY STRUCTURE                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Format: {prefix}:tenant:{id}:{module}:{type}:{id} │
│                                                     │
│  Examples:                                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ lcc:tenant:001:products:list               │   │
│  │ lcc:tenant:001:products:detail:123         │   │
│  │ lcc:tenant:001:products:search:query_hash  │   │
│  │ lcc:tenant:001:categories:tree             │   │
│  │ lcc:tenant:001:user:456:permissions        │   │
│  │ lcc:tenant:001:settings:general            │   │
│  │ lcc:tenant:001:dashboard:stats             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Shared Keys (No Tenant):                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ lcc:shared:plans:list                      │   │
│  │ lcc:shared:countries:list                  │   │
│  │ lcc:ratelimit:ip:192.168.1.1              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Cache TTL Guidelines

```
┌─────────────────────────────────────────────────────┐
│               CACHE TTL GUIDELINES                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SHORT (5 minutes):                                │
│  ├── Dashboard statistics                          │
│  ├── Real-time inventory counts                    │
│  └── Active user sessions                          │
│                                                     │
│  MEDIUM (1 hour):                                  │
│  ├── Product lists                                 │
│  ├── Category trees                                │
│  ├── Search results                                │
│  └── User permissions                              │
│                                                     │
│  LONG (1 day):                                     │
│  ├── Static configuration                          │
│  ├── Country/currency lists                        │
│  ├── Tax rates                                     │
│  └── Payment method configs                        │
│                                                     │
│  PERMANENT (no expiry):                            │
│  ├── Never - always set TTL                        │
│  └── Use longest appropriate TTL                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Tenant Isolation:** All cache keys must be tenant-prefixed
3. **Redis Required:** Ensure Redis is running
4. **Key Length:** Hash long keys (>200 chars)
5. **TTL Required:** Always set cache expiration
6. **Invalidation:** Signal-based auto-invalidation
7. **Testing:** Use LocMemCache for tests
8. **Sessions:** Store in Redis for scalability
9. **Pattern Delete:** Use SCAN, not KEYS in production
