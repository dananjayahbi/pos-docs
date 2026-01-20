# Group B: Schema Routing Logic

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Implement schema routing logic for shared and tenant apps

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Router-Foundation/](../Group-A_Router-Foundation/)
- **→ Next Group:** [../Group-C_Cross-Schema-Prevention/](../Group-C_Cross-Schema-Prevention/)

---

## Group Overview

This group implements the schema routing logic that determines which PostgreSQL schema to use for each query. It handles shared apps (public schema), tenant apps (tenant schema), and schema switching.

### Key Outcomes
- Shared apps list defined
- Tenant apps list defined
- Shared app query routing
- Tenant app query routing
- Mixed query handling
- Schema from context retrieval
- Missing context handling
- PostgreSQL search_path configuration
- Schema switching implementation
- Schema context wrapper
- Concurrent request handling
- Schema existence validation
- Invalid schema error handling
- Routing logic documentation

### Technology Context
- **Shared Apps:** Platform, tenants, auth
- **Tenant Apps:** Products, orders, customers, etc.
- **search_path:** PostgreSQL schema selector
- **Thread-Safe:** Handle concurrent requests

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_App-Routing.md | 15-20 | Shared/tenant lists, routing queries, context retrieval |
| 02 | 02_Tasks-21-25_Schema-Switching.md | 21-25 | Missing context, search_path, switching, wrapper, concurrency |
| 03 | 03_Tasks-26-28_Validation-Docs.md | 26-28 | Schema validation, invalid handling, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Define Shared Apps List | Task 14 | Simple |
| 16 | Define Tenant Apps List | Task 14 | Simple |
| 17 | Route Shared App Queries | Task 15 | Medium |
| 18 | Route Tenant App Queries | Task 16 | Medium |
| 19 | Handle Mixed Queries | Task 17, 18 | Medium |
| 20 | Get Schema from Context | Task 18 | Simple |
| 21 | Handle Missing Context | Task 20 | Medium |
| 22 | Set Search Path | Task 20 | Medium |
| 23 | Handle Schema Switching | Task 22 | Medium |
| 24 | Create Schema Wrapper | Task 23 | Medium |
| 25 | Handle Concurrent Requests | Task 24 | Complex |
| 26 | Validate Schema Exists | Task 25 | Medium |
| 27 | Handle Invalid Schema | Task 26 | Simple |
| 28 | Document Routing Logic | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_App-Routing.md
        │
        ▼
02_Tasks-21-25_Schema-Switching.md
        │
        ▼
03_Tasks-26-28_Validation-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── routers/
            ├── tenant_router.py    # Updated with routing logic
            └── utils.py            # Schema helpers

docs/
└── routing/
    └── schema-routing.md
```

---

## App Classification

```python
SHARED_APPS = [
    'django_tenants',
    'django.contrib.contenttypes',
    'apps.platform',
    'apps.tenants',
]

TENANT_APPS = [
    'django.contrib.auth',
    'apps.products',
    'apps.orders',
    'apps.customers',
    # ... all tenant-specific apps
]
```

---

## Schema Wrapper Usage

```python
from apps.tenants.routers.utils import schema_context

# Explicitly use a tenant schema
with schema_context('tenant_shop_a'):
    products = Product.objects.all()
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (router exists)
2. **search_path:** Use SET search_path TO 'schema_name'
3. **Thread-Local:** Store schema in threading.local()
4. **Concurrent:** Each request has its own context
5. **Validation:** Check schema exists before querying
6. **Git Commit:** Commit after completing this group

