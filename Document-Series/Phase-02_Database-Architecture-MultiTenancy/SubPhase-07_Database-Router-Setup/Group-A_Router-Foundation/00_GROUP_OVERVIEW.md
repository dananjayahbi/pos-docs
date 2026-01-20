# Group A: Router Foundation

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the foundation database router with core methods

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Schema-Routing-Logic/](../Group-B_Schema-Routing-Logic/)

---

## Group Overview

This group creates the foundation database router by extending django-tenants TenantSyncRouter. It implements the core router methods (db_for_read, db_for_write, allow_relation, allow_migrate) and utility functions.

### Key Outcomes
- Review TenantSyncRouter behavior
- Create router module
- Import TenantSyncRouter
- Create custom router class
- Register in DATABASE_ROUTERS
- Verify router order
- Create router utility functions
- Implement db_for_read method
- Implement db_for_write method
- Implement allow_relation method
- Implement allow_migrate method
- Create schema selector function
- Handle default schema fallback
- Document router configuration

### Technology Context
- **Base:** django-tenants TenantSyncRouter
- **Registration:** DATABASE_ROUTERS setting
- **Methods:** db_for_read, db_for_write, allow_relation, allow_migrate
- **Fallback:** Public schema default

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Router-Setup.md | 01-05 | Review, create module, import, custom class, register |
| 02 | 02_Tasks-06-10_Core-Methods.md | 06-10 | Router order, utils, db_for_read, db_for_write, allow_relation |
| 03 | 03_Tasks-11-14_Migrate-Selector-Docs.md | 11-14 | allow_migrate, schema selector, default schema, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Review TenantSyncRouter | SubPhase-06 | Simple |
| 02 | Create Router Module | Task 01 | Simple |
| 03 | Import TenantSyncRouter | Task 02 | Simple |
| 04 | Create Custom Router Class | Task 03 | Medium |
| 05 | Register in DATABASE_ROUTERS | Task 04 | Simple |
| 06 | Verify Router Order | Task 05 | Simple |
| 07 | Create Router Utils | Task 02 | Medium |
| 08 | Implement db_for_read | Task 04 | Medium |
| 09 | Implement db_for_write | Task 04 | Medium |
| 10 | Implement allow_relation | Task 04 | Medium |
| 11 | Implement allow_migrate | Task 04 | Medium |
| 12 | Create Schema Selector | Task 07 | Simple |
| 13 | Handle Default Schema | Task 12 | Simple |
| 14 | Document Router Configuration | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Router-Setup.md
        │
        ▼
02_Tasks-06-10_Core-Methods.md
        │
        ▼
03_Tasks-11-14_Migrate-Selector-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── tenants/
│       └── routers/
│           ├── __init__.py
│           ├── tenant_router.py
│           └── utils.py

config/
└── settings/
    └── base.py              # DATABASE_ROUTERS added

docs/
└── routing/
    └── overview.md
```

---

## Router Configuration

```python
DATABASE_ROUTERS = [
    'django_tenants.routers.TenantSyncRouter',
    # OR custom router
    'apps.tenants.routers.CustomTenantRouter',
]
```

---

## Router Methods

| Method | Purpose |
|--------|---------|
| db_for_read | Determine database for SELECT |
| db_for_write | Determine database for INSERT/UPDATE/DELETE |
| allow_relation | Allow/deny FK between models |
| allow_migrate | Control which apps migrate to which schema |

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-06 complete (middleware sets context)
2. **Order:** Router must be first in list
3. **Default:** Use 'default' database alias
4. **Schema:** Get from thread-local context
5. **Fallback:** Always fall back to public schema
6. **Git Commit:** Commit after completing this group

