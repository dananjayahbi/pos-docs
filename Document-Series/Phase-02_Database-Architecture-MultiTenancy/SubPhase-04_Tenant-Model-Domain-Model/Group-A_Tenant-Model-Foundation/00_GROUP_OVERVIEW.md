# Group A: Tenant Model Foundation

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create the core Tenant model extending TenantMixin

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Tenant-Business-Information/](../Group-B_Tenant-Business-Information/)

---

## Group Overview

This group creates the foundational Tenant model by extending django-tenants TenantMixin. The model includes schema management, status tracking, and custom managers for filtering tenants.

### Key Outcomes
- Tenant model extending TenantMixin created
- Schema name field configured
- Name field (business name) added
- Slug field (URL-safe identifier) added
- Created/updated timestamp fields added
- Is active field added
- Is suspended field with reason added
- auto_create_schema = True configured
- auto_drop_schema = False configured
- Meta class with ordering defined
- __str__ method implemented
- Custom TenantManager created
- Active/suspended querysets added

### Technology Context
- **Base:** django-tenants TenantMixin
- **Schema:** PostgreSQL schema per tenant
- **Managers:** Custom querysets for status filtering
- **Location:** apps/tenants/

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-06_Tenant-Model-Core.md | 01-06 | Extend TenantMixin, schema name, name, slug, timestamps |
| 02 | 02_Tasks-07-12_Status-Schema-Meta.md | 07-12 | Is active, suspended fields, auto_create/drop_schema, meta class |
| 03 | 03_Tasks-13-16_Manager-Querysets.md | 13-16 | __str__, TenantManager, active/suspended querysets |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Extend TenantMixin | SubPhase-03 | Medium |
| 02 | Add Schema Name Field | Task 01 | Simple |
| 03 | Add Name Field | Task 01 | Simple |
| 04 | Add Slug Field | Task 01 | Simple |
| 05 | Add Created At Field | Task 01 | Simple |
| 06 | Add Updated At Field | Task 01 | Simple |
| 07 | Add Is Active Field | Task 01 | Simple |
| 08 | Add Is Suspended Field | Task 01 | Simple |
| 09 | Add Suspended Reason Field | Task 08 | Simple |
| 10 | Add Auto Create Schema | Task 01 | Simple |
| 11 | Add Auto Drop Schema | Task 01 | Simple |
| 12 | Define Meta Class | Task 01 | Simple |
| 13 | Define __str__ Method | Task 12 | Simple |
| 14 | Create Model Manager | Task 01 | Medium |
| 15 | Add Active Queryset | Task 14 | Simple |
| 16 | Add Suspended Queryset | Task 14 | Simple |

---

## Execution Order

```
01_Tasks-01-06_Tenant-Model-Core.md
        │
        ▼
02_Tasks-07-12_Status-Schema-Meta.md
        │
        ▼
03_Tasks-13-16_Manager-Querysets.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── __init__.py
        ├── apps.py
        └── models/
            ├── __init__.py
            ├── tenant.py        # Tenant model
            └── managers/
                └── tenant_manager.py
```

---

## Tenant Model Structure

```python
from django_tenants.models import TenantMixin

class Tenant(TenantMixin):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    is_suspended = models.BooleanField(default=False)
    suspended_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    auto_create_schema = True
    auto_drop_schema = False

    objects = TenantManager()
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-03 complete (SubscriptionPlan exists)
2. **TenantMixin:** Must extend, provides schema_name field
3. **Schema Naming:** Use tenant slug as schema name
4. **Auto Create:** Always True for automatic schema creation
5. **Auto Drop:** Keep False for safety
6. **Git Commit:** Commit after completing this group

