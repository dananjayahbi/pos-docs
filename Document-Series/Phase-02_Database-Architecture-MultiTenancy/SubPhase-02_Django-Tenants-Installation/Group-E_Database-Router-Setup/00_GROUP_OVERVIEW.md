# Group E: Database Router Setup

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** E of F  
> **Tasks Covered:** 57-68  
> **Group Goal:** Configure database routers for proper schema routing

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Model-Configuration/](../Group-D_Model-Configuration/)
- **→ Next Group:** [../Group-F_Initial-Migration-Verification/](../Group-F_Initial-Migration-Verification/)

---

## Group Overview

This group configures database routers for django-tenants. The router ensures that database operations are directed to the correct schema based on the current tenant context.

### Key Outcomes
- TenantSyncRouter understood
- Router configured in settings
- Custom router created (if needed)
- db_for_read routing logic configured
- db_for_write routing logic configured
- allow_migrate routing configured
- allow_relation logic configured
- Cross-schema foreign keys prevented
- Router logic tested
- Router unit tests created
- Router behavior documented
- Edge cases handled

### Technology Context
- **Router:** TenantSyncRouter
- **Routing:** Schema-based query routing
- **Migrations:** Directed to correct schema
- **Relations:** Cross-schema FK prevention

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-61_Router-Configuration.md | 57-61 | Understand TenantSyncRouter, configure in settings, custom router, db_for_read, db_for_write |
| 02 | 02_Tasks-62-65_Migrate-Relations-Test.md | 62-65 | Configure allow_migrate, allow_relation, prevent cross-schema FK, test router |
| 03 | 03_Tasks-66-68_Tests-Docs-Edge-Cases.md | 66-68 | Create router tests, document behavior, handle edge cases |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 57 | Understand TenantSyncRouter | Task 14 | Simple |
| 58 | Configure Router in Settings | Task 57 | Simple |
| 59 | Create Custom Router | Task 58 | Medium |
| 60 | Configure db_for_read | Task 59 | Simple |
| 61 | Configure db_for_write | Task 59 | Simple |
| 62 | Configure allow_migrate | Task 59 | Medium |
| 63 | Configure allow_relation | Task 59 | Medium |
| 64 | Prevent Cross-Schema FK | Task 63 | Medium |
| 65 | Test Router Logic | Task 64 | Medium |
| 66 | Create Router Tests | Task 65 | Medium |
| 67 | Document Router Behavior | Task 66 | Simple |
| 68 | Handle Edge Cases | Task 65 | Medium |

---

## Execution Order

```
01_Tasks-57-61_Router-Configuration.md
        │
        ▼
02_Tasks-62-65_Migrate-Relations-Test.md
        │
        ▼
03_Tasks-66-68_Tests-Docs-Edge-Cases.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── tenants/
│       └── routers.py       # Custom router (if needed)
└── tests/
    └── tenants/
        └── test_routers.py  # Router unit tests

docs/
└── multi-tenancy/
    └── database-routing.md  # Router documentation
```

---

## TenantSyncRouter Behavior

| Method | Purpose |
|--------|---------|
| db_for_read(model, **hints) | Returns 'default' (schema set by connection) |
| db_for_write(model, **hints) | Returns 'default' (schema set by connection) |
| allow_migrate(db, app_label, model_name, **hints) | Controls which schema gets migration |
| allow_relation(obj1, obj2, **hints) | Prevents cross-schema relationships |

---

## Cross-Schema Prevention

```python
def allow_relation(self, obj1, obj2, **hints):
    # Prevent FK between tenant and shared tables
    if obj1._state.db != obj2._state.db:
        return False
    return True
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete (models exist)
2. **TenantSyncRouter:** Usually sufficient, extend if needed
3. **Cross-Schema FK:** Critical to prevent data leakage
4. **Testing:** Use django-tenants test utilities
5. **Edge Cases:** Handle model_name=None in allow_migrate
6. **Git Commit:** Commit after completing this group

