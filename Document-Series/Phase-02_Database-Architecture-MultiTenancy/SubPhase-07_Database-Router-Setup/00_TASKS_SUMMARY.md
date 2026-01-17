# SubPhase 07: Database Router Setup - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 07 of 10  
> **SubPhase Goal:** Configure routers to direct queries to correct schema  
> **Total Tasks:** 78 | **Status:** Planning  
> **Estimated Duration:** 4-5 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Tenant-Middleware-Configuration](../SubPhase-06_Tenant-Middleware-Configuration/)
- **→ Next SubPhase:** [SubPhase-08_Migration-Strategy](../SubPhase-08_Migration-Strategy/)

---

## SubPhase Overview

This sub-phase configures the Django database routers that ensure queries are directed to the correct PostgreSQL schema based on the current tenant context. The router is essential for maintaining data isolation between tenants.

### Key Outcomes
- TenantSyncRouter configured correctly
- Database queries routed to correct schema
- Cross-schema queries prevented
- Connection reuse optimized
- Read replica routing prepared (future)
- Query logging and monitoring ready

### Key Tasks
- Create TenantSyncRouter
- Handle cross-schema queries prevention
- Configure read replica routing (future)
- Set up connection reuse
- Implement query logging

### Dependencies
- **Requires:** SubPhase-06 (Tenant Middleware Configuration)
- **Middleware must set tenant context for router to use**

---

## Task Execution Order

```
TASK GROUP A: Router Foundation (Tasks 01-14)
        │
        ▼
TASK GROUP B: Schema Routing Logic (Tasks 15-28)
        │
        ▼
TASK GROUP C: Cross-Schema Prevention (Tasks 29-42)
        │
        ▼
TASK GROUP D: Connection Management (Tasks 43-56)
        │
        ▼
TASK GROUP E: Monitoring & Optimization (Tasks 57-68)
        │
        ▼
TASK GROUP F: Testing & Verification (Tasks 69-78)
```

---

## Task Index

### Group A: Router Foundation (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Review TenantSyncRouter** | Understand django-tenants router | SubPhase-06 | 🔴 Not Created |
| 02 | **Create Router Module** | Create apps/tenants/routers.py | Task 01 | 🔴 Not Created |
| 03 | **Import TenantSyncRouter** | Import from django_tenants | Task 02 | 🔴 Not Created |
| 04 | **Create Custom Router Class** | Extend TenantSyncRouter if needed | Task 03 | 🔴 Not Created |
| 05 | **Register in DATABASE_ROUTERS** | Add to settings | Task 04 | 🔴 Not Created |
| 06 | **Verify Router Order** | Ensure correct router priority | Task 05 | 🔴 Not Created |
| 07 | **Create Router Utils** | Helper functions for routing | Task 02 | 🔴 Not Created |
| 08 | **Implement db_for_read** | Read query routing | Task 04 | 🔴 Not Created |
| 09 | **Implement db_for_write** | Write query routing | Task 04 | 🔴 Not Created |
| 10 | **Implement allow_relation** | Control cross-schema relations | Task 04 | 🔴 Not Created |
| 11 | **Implement allow_migrate** | Control migration behavior | Task 04 | 🔴 Not Created |
| 12 | **Create Schema Selector** | Function to get current schema | Task 07 | 🔴 Not Created |
| 13 | **Handle Default Schema** | Fallback to public schema | Task 12 | 🔴 Not Created |
| 14 | **Document Router Configuration** | Router setup documentation | Task 13 | 🔴 Not Created |

---

### Group B: Schema Routing Logic (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Define Shared Apps List** | Apps that use public schema | Task 14 | 🔴 Not Created |
| 16 | **Define Tenant Apps List** | Apps that use tenant schema | Task 14 | 🔴 Not Created |
| 17 | **Route Shared App Queries** | Direct to public schema | Task 15 | 🔴 Not Created |
| 18 | **Route Tenant App Queries** | Direct to tenant schema | Task 16 | 🔴 Not Created |
| 19 | **Handle Mixed Queries** | Queries spanning both types | Task 17, 18 | 🔴 Not Created |
| 20 | **Get Schema from Context** | Read from thread-local | Task 18 | 🔴 Not Created |
| 21 | **Handle Missing Context** | No tenant in context | Task 20 | 🔴 Not Created |
| 22 | **Set Search Path** | Configure PostgreSQL search_path | Task 20 | 🔴 Not Created |
| 23 | **Handle Schema Switching** | Switch between schemas | Task 22 | 🔴 Not Created |
| 24 | **Create Schema Wrapper** | Context manager for schema | Task 23 | 🔴 Not Created |
| 25 | **Handle Concurrent Requests** | Thread-safe schema handling | Task 24 | 🔴 Not Created |
| 26 | **Validate Schema Exists** | Check schema before routing | Task 25 | 🔴 Not Created |
| 27 | **Handle Invalid Schema** | Error for non-existent schema | Task 26 | 🔴 Not Created |
| 28 | **Document Routing Logic** | Routing behavior documentation | Task 27 | 🔴 Not Created |

---

### Group C: Cross-Schema Prevention (Tasks 29-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Define Cross-Schema Rules** | What's allowed vs blocked | Task 28 | 🔴 Not Created |
| 30 | **Block Cross-Tenant FK** | Prevent FK across tenant schemas | Task 29 | 🔴 Not Created |
| 31 | **Block Cross-Tenant Queries** | Prevent joins across tenants | Task 29 | 🔴 Not Created |
| 32 | **Allow Shared-Tenant FK** | FK from tenant to shared OK | Task 29 | 🔴 Not Created |
| 33 | **Block Tenant-Shared FK** | FK from shared to tenant blocked | Task 29 | 🔴 Not Created |
| 34 | **Implement allow_relation** | Check model schemas | Task 30 | 🔴 Not Created |
| 35 | **Get Model Schema** | Determine model's schema | Task 34 | 🔴 Not Created |
| 36 | **Compare Model Schemas** | Check if same schema | Task 35 | 🔴 Not Created |
| 37 | **Raise Cross-Schema Error** | Clear error message | Task 36 | 🔴 Not Created |
| 38 | **Create Custom Exception** | CrossSchemaViolationError | Task 37 | 🔴 Not Created |
| 39 | **Log Cross-Schema Attempts** | Log blocked queries | Task 38 | 🔴 Not Created |
| 40 | **Handle Raw Queries** | Check raw SQL queries | Task 39 | 🔴 Not Created |
| 41 | **Validate ORM Relations** | Check at model definition | Task 34 | 🔴 Not Created |
| 42 | **Document Cross-Schema Rules** | Prevention documentation | Task 41 | 🔴 Not Created |

---

### Group D: Connection Management (Tasks 43-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Configure Connection Pooling** | PgBouncer integration | Task 42 | 🔴 Not Created |
| 44 | **Set CONN_MAX_AGE** | Connection lifetime setting | Task 43 | 🔴 Not Created |
| 45 | **Configure Pool Size** | Max connections per worker | Task 43 | 🔴 Not Created |
| 46 | **Handle Connection Reuse** | Reuse connections across requests | Task 45 | 🔴 Not Created |
| 47 | **Set Schema on Connection** | Set search_path per connection | Task 46 | 🔴 Not Created |
| 48 | **Reset Schema After Request** | Clear schema context | Task 47 | 🔴 Not Created |
| 49 | **Handle Connection Errors** | Reconnection logic | Task 46 | 🔴 Not Created |
| 50 | **Configure Read Replicas** | Future read replica support | Task 49 | 🔴 Not Created |
| 51 | **Route Reads to Replica** | Direct SELECT to replica | Task 50 | 🔴 Not Created |
| 52 | **Route Writes to Primary** | Direct writes to primary | Task 50 | 🔴 Not Created |
| 53 | **Handle Replica Lag** | Consistency considerations | Task 51 | 🔴 Not Created |
| 54 | **Configure Connection Timeout** | Connection timeout settings | Task 43 | 🔴 Not Created |
| 55 | **Monitor Connection Count** | Track active connections | Task 54 | 🔴 Not Created |
| 56 | **Document Connection Setup** | Connection management docs | Task 55 | 🔴 Not Created |

---

### Group E: Monitoring & Optimization (Tasks 57-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create Query Logger** | Log all tenant queries | Task 56 | 🔴 Not Created |
| 58 | **Log Query Schema** | Include schema in logs | Task 57 | 🔴 Not Created |
| 59 | **Log Query Time** | Query execution time | Task 57 | 🔴 Not Created |
| 60 | **Create Query Metrics** | Prometheus/StatsD metrics | Task 59 | 🔴 Not Created |
| 61 | **Track Queries Per Tenant** | Per-tenant query counts | Task 60 | 🔴 Not Created |
| 62 | **Track Slow Queries** | Identify slow queries | Task 60 | 🔴 Not Created |
| 63 | **Create Router Middleware** | Additional query tracking | Task 62 | 🔴 Not Created |
| 64 | **Optimize Common Queries** | Cache frequent queries | Task 63 | 🔴 Not Created |
| 65 | **Create Query Analyzer** | Analyze query patterns | Task 64 | 🔴 Not Created |
| 66 | **Configure Query Caching** | Cache query results | Task 65 | 🔴 Not Created |
| 67 | **Create Debug Toolbar Plugin** | Django Debug Toolbar integration | Task 66 | 🔴 Not Created |
| 68 | **Document Monitoring Setup** | Monitoring documentation | Task 67 | 🔴 Not Created |

---

### Group F: Testing & Verification (Tasks 69-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Router Tests** | Unit tests for router | Task 68 | 🔴 Not Created |
| 70 | **Test Schema Routing** | Verify correct schema used | Task 69 | 🔴 Not Created |
| 71 | **Test Cross-Schema Block** | Verify prevention works | Task 69 | 🔴 Not Created |
| 72 | **Test Connection Reuse** | Verify connections reused | Task 69 | 🔴 Not Created |
| 73 | **Test Concurrent Requests** | Multi-request isolation | Task 69 | 🔴 Not Created |
| 74 | **Test Schema Fallback** | Public schema fallback | Task 69 | 🔴 Not Created |
| 75 | **Create Integration Tests** | End-to-end router tests | Task 74 | 🔴 Not Created |
| 76 | **Run Performance Tests** | Benchmark router performance | Task 75 | 🔴 Not Created |
| 77 | **Document Test Results** | Testing documentation | Task 76 | 🔴 Not Created |
| 78 | **Create Initial Commit** | Commit router code | Task 77 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   └── tenants/
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── tenant_router.py
│       │   ├── replica_router.py
│       │   └── utils.py
│       ├── exceptions.py
│       └── logging/
│           ├── __init__.py
│           └── query_logger.py
├── config/
│   └── settings/
│       └── base.py (DATABASE_ROUTERS updated)
└── docs/
    └── routing/
        ├── overview.md
        ├── cross-schema-prevention.md
        ├── connection-pooling.md
        └── monitoring.md
```

---

## Router Decision Flow

```
Query Received
       │
       ▼
┌─────────────────────┐
│ Is Model in         │ ──(yes)──► Route to Public Schema
│ SHARED_APPS?        │
└─────────────────────┘
       │ (no)
       ▼
┌─────────────────────┐
│ Is Tenant Context   │ ──(no)──► Raise Error / Use Public
│ Available?          │
└─────────────────────┘
       │ (yes)
       ▼
┌─────────────────────┐
│ Get Current Schema  │ ──────────► Route to Tenant Schema
│ from Context        │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Is Read Replica     │ ──(yes, SELECT)──► Route to Replica
│ Enabled?            │
└─────────────────────┘
       │ (no)
       ▼
    Execute Query
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 78 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 78 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **TenantSyncRouter First:** django-tenants provides base router
3. **Search Path Critical:** PostgreSQL search_path controls schema
4. **Thread-Local Context:** Schema stored in thread-local
5. **Cross-Schema Blocked:** Never allow cross-tenant queries
6. **Connection Pooling:** Essential for multi-tenant performance
7. **Read Replicas Future:** Prepare but don't implement yet
8. **Monitoring Essential:** Track queries per tenant
9. **Test Isolation:** Verify data cannot leak between tenants
