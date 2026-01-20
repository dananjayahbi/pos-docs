# Group E: UUID & TenantScoped Models

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** E of F  
> **Tasks Covered:** 59-74  
> **Group Goal:** Create UUIDModel and TenantScopedModel for multi-tenancy

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_AuditModel/](../Group-D_AuditModel/)
- **→ Next Group:** [../Group-F_Validators-Utilities/](../Group-F_Validators-Utilities/)

---

## Group Overview

This group creates UUIDModel for UUID-based primary keys and TenantScopedModel for automatic tenant filtering in the multi-tenant architecture.

### Key Outcomes
- Create uuid_model.py file
- Create UUIDModel class
- Add uuid field as primary key
- Configure uuid4 default
- Set editable=False
- Create UUID tests
- Create tenant_scoped.py file
- Create TenantScopedModel class
- Create TenantScopedManager
- Override get_queryset for tenant filtering
- Integrate with django-tenants
- Add for_tenant() method
- Create TenantScoped tests
- Export all in __init__.py
- Document usage

### Technology Context
- **UUID:** Universally unique identifiers
- **django-tenants:** Multi-tenant library
- **connection.tenant:** Current tenant context

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-59-66_UUID-TenantScoped-Base.md | 59-66 | UUID file, class, field, default, editable, tests, tenant file, class |
| 02 | 02_Tasks-67-74_Manager-Integration-Tests.md | 67-74 | TenantScopedManager, queryset, django-tenants, for_tenant, tests, exports, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 59 | Create uuid_model.py File | Task 58 | Simple |
| 60 | Create UUIDModel Class | Task 59 | Medium |
| 61 | Add uuid Field | Task 60 | Simple |
| 62 | Configure uuid Default | Task 61 | Simple |
| 63 | Set editable=False | Task 62 | Simple |
| 64 | Create UUID Tests | Task 63 | Simple |
| 65 | Create tenant_scoped.py File | Task 64 | Simple |
| 66 | Create TenantScopedModel Class | Task 65 | Medium |
| 67 | Create TenantScopedManager | Task 66 | Medium |
| 68 | Override get_queryset | Task 67 | Medium |
| 69 | Integrate with django-tenants | Task 68 | Medium |
| 70 | Create for_tenant() Method | Task 69 | Simple |
| 71 | Add tenant Field | Task 70 | Medium |
| 72 | Create TenantScoped Tests | Task 71 | Medium |
| 73 | Export All in __init__.py | Task 72 | Simple |
| 74 | Document UUID & TenantScoped | Task 73 | Simple |

---

## Execution Order

```
01_Tasks-59-66_UUID-TenantScoped-Base.md
        │
        ▼
02_Tasks-67-74_Manager-Integration-Tests.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── models/
│   ├── __init__.py        # Updated exports
│   ├── uuid_model.py      # UUIDModel
│   └── tenant_scoped.py   # TenantScopedModel
├── managers/
│   └── tenant_scoped.py   # TenantScopedManager
└── tests/
    ├── test_uuid.py
    └── test_tenant_scoped.py
```

---

## UUIDModel Implementation

```python
# apps/core/models/uuid_model.py
import uuid
from django.db import models

class UUIDModel(models.Model):
    """
    Abstract model with UUID as primary key.
    
    Use for models that need globally unique identifiers,
    especially useful for API responses.
    """
    uuid = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this record"
    )
    
    class Meta:
        abstract = True
```

---

## TenantScopedModel Implementation

```python
# apps/core/models/tenant_scoped.py
from django.db import models, connection

class TenantScopedManager(models.Manager):
    """Manager that automatically filters by current tenant."""
    
    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(connection, 'tenant'):
            # In a tenant context
            return qs.filter(tenant=connection.tenant)
        return qs
    
    def for_tenant(self, tenant):
        """Explicitly filter by tenant."""
        return super().get_queryset().filter(tenant=tenant)

class TenantScopedModel(models.Model):
    """
    Abstract model that automatically scopes queries to current tenant.
    
    Note: This is optional - django-tenants handles schema isolation.
    Use this only if you need explicit tenant field references.
    """
    tenant = models.ForeignKey(
        'tenants.Tenant',
        on_delete=models.CASCADE,
        related_name='%(class)s_set',
        null=True,
        blank=True
    )
    
    objects = TenantScopedManager()
    unscoped = models.Manager()  # All records regardless of tenant
    
    class Meta:
        abstract = True
    
    def save(self, *args, **kwargs):
        if not self.tenant_id and hasattr(connection, 'tenant'):
            self.tenant = connection.tenant
        super().save(*args, **kwargs)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete
2. **UUID:** Use uuid4, not uuid1
3. **django-tenants:** Use connection.tenant
4. **Schema Isolation:** django-tenants handles this
5. **TenantScopedModel:** Optional explicit tenant field
6. **Git Commit:** Commit after completing this group

