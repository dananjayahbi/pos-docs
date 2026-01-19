# Group A: Public Schema Planning

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** A of G  
> **Tasks Covered:** 01-12  
> **Group Goal:** Plan and set up the platform app with base model classes

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Subscription-Plans-Model/](../Group-B_Subscription-Plans-Model/)

---

## Group Overview

This group creates the platform Django app and establishes base model classes that will be used throughout the public schema. The setup includes reusable mixins for UUID primary keys, soft deletion, and audit fields.

### Key Outcomes
- platform Django app created
- platform/__init__.py created
- platform/apps.py configured
- Platform app registered in SHARED_APPS
- platform/models/__init__.py created
- Public schema ERD defined
- Base model class created (timestamps)
- UUID mixin created
- Soft delete mixin created
- Audit mixin created (created_by, updated_by)
- Naming conventions documented
- Admin base classes created

### Technology Context
- **App Location:** apps/platform/
- **Mixins:** UUID, SoftDelete, Audit, Timestamp
- **Schema:** Public schema only
- **Admin:** Reusable admin classes

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Platform-App-Setup.md | 01-04 | Create platform app, __init__.py, apps.py, register in SHARED_APPS |
| 02 | 02_Tasks-05-08_Models-Package-Mixins.md | 05-08 | Create models package, define ERD, base model, UUID mixin |
| 03 | 03_Tasks-09-12_Additional-Mixins-Admin.md | 09-12 | Soft delete mixin, audit mixin, naming conventions, admin base classes |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create platform App | SubPhase-02 | Simple |
| 02 | Create platform/__init__.py | Task 01 | Simple |
| 03 | Create platform/apps.py | Task 02 | Simple |
| 04 | Register platform in SHARED_APPS | Task 03 | Simple |
| 05 | Create platform/models/__init__.py | Task 01 | Simple |
| 06 | Define Public Schema ERD | Task 01 | Medium |
| 07 | Create Base Model Class | Task 05 | Medium |
| 08 | Create UUID Mixin | Task 07 | Simple |
| 09 | Create Soft Delete Mixin | Task 07 | Medium |
| 10 | Create Audit Mixin | Task 07 | Medium |
| 11 | Document Naming Conventions | Task 06 | Simple |
| 12 | Create Admin Base Classes | Task 07 | Medium |

---

## Execution Order

```
01_Tasks-01-04_Platform-App-Setup.md
        │
        ▼
02_Tasks-05-08_Models-Package-Mixins.md
        │
        ▼
03_Tasks-09-12_Additional-Mixins-Admin.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        ├── __init__.py
        ├── apps.py
        ├── admin.py         # Base admin classes
        └── models/
            ├── __init__.py
            └── mixins.py    # UUID, SoftDelete, Audit, Timestamp

docs/
└── database/
    ├── public-schema-erd.md     # ERD documentation
    └── naming-conventions.md    # Table/field naming
```

---

## Base Model Mixins

| Mixin | Fields | Purpose |
|-------|--------|---------|
| TimestampMixin | created_at, updated_at | Track creation/modification |
| UUIDMixin | id (UUID) | UUID primary keys |
| SoftDeleteMixin | is_deleted, deleted_at | Soft deletion support |
| AuditMixin | created_by, updated_by | User audit trail |

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-02 complete (django-tenants installed)
2. **SHARED_APPS:** Platform app MUST be in SHARED_APPS
3. **Mixins:** Create reusable for all public models
4. **UUID:** Use uuid_ossp extension for DB-level generation
5. **ERD:** Document all public schema relationships
6. **Git Commit:** Commit after completing this group

