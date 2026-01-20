# Group D: Connection Management

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** D of F  
> **Tasks Covered:** 43-56  
> **Group Goal:** Configure connection pooling and read replica routing

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Cross-Schema-Prevention/](../Group-C_Cross-Schema-Prevention/)
- **→ Next Group:** [../Group-E_Monitoring-Optimization/](../Group-E_Monitoring-Optimization/)

---

## Group Overview

This group configures database connection management including connection pooling (PgBouncer), connection reuse, schema setting per connection, and preparation for read replica routing.

### Key Outcomes
- PgBouncer connection pooling configured
- CONN_MAX_AGE setting configured
- Connection pool size configured
- Connection reuse implemented
- Schema set on each connection
- Schema reset after request
- Connection error handling
- Read replica configuration (future)
- Read routing to replica
- Write routing to primary
- Replica lag handling
- Connection timeout configuration
- Connection count monitoring
- Connection setup documentation

### Technology Context
- **Pooling:** PgBouncer for connection pooling
- **Reuse:** Persistent connections
- **Replicas:** Future read scaling
- **Timeout:** Connection timeouts

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-49_Pooling-Reuse.md | 43-49 | PgBouncer, CONN_MAX_AGE, pool size, reuse, schema per connection, errors |
| 02 | 02_Tasks-50-56_Replicas-Monitoring.md | 50-56 | Read replicas, routing, lag handling, timeout, monitoring, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Configure Connection Pooling | Task 42 | Medium |
| 44 | Set CONN_MAX_AGE | Task 43 | Simple |
| 45 | Configure Pool Size | Task 43 | Simple |
| 46 | Handle Connection Reuse | Task 45 | Medium |
| 47 | Set Schema on Connection | Task 46 | Medium |
| 48 | Reset Schema After Request | Task 47 | Simple |
| 49 | Handle Connection Errors | Task 46 | Medium |
| 50 | Configure Read Replicas | Task 49 | Medium |
| 51 | Route Reads to Replica | Task 50 | Medium |
| 52 | Route Writes to Primary | Task 50 | Simple |
| 53 | Handle Replica Lag | Task 51 | Medium |
| 54 | Configure Connection Timeout | Task 43 | Simple |
| 55 | Monitor Connection Count | Task 54 | Medium |
| 56 | Document Connection Setup | Task 55 | Simple |

---

## Execution Order

```
01_Tasks-43-49_Pooling-Reuse.md
        │
        ▼
02_Tasks-50-56_Replicas-Monitoring.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── tenants/
│       └── routers/
│           ├── tenant_router.py    # Updated
│           └── replica_router.py   # Future replicas

config/
└── settings/
    ├── base.py                 # Connection settings
    └── production.py           # PgBouncer config

docs/
└── routing/
    └── connection-pooling.md
```

---

## Connection Configuration

```python
DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),  # PgBouncer
        'PORT': env('DB_PORT', default='6432'),  # PgBouncer port
        'CONN_MAX_AGE': 60,  # Reuse connections for 60 seconds
        'OPTIONS': {
            'connect_timeout': 10,
        },
    },
    # Future: read replica
    # 'replica': { ... }
}
```

---

## PgBouncer Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| pool_mode | transaction | Transaction pooling |
| max_client_conn | 1000 | Max clients |
| default_pool_size | 20 | Connections per pool |
| reserve_pool_size | 5 | Extra connections |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (prevention works)
2. **PgBouncer:** Use transaction pooling mode
3. **CONN_MAX_AGE:** Set to 60 seconds or more
4. **Schema Reset:** Critical to reset after each request
5. **Replicas:** Prepare infrastructure for future
6. **Git Commit:** Commit after completing this group

