# Group D: AuditModel

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Create AuditModel for tracking user actions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_SoftDeleteModel/](../Group-C_SoftDeleteModel/)
- **→ Next Group:** [../Group-E_UUID-TenantScoped-Models/](../Group-E_UUID-TenantScoped-Models/)

---

## Group Overview

This group creates the AuditModel that extends SoftDeleteModel to track which user created and updated each record. It includes an AuditMixin for views and serializers.

### Key Outcomes
- Create audit.py file
- Create AuditModel class extending SoftDeleteModel
- Add created_by ForeignKey to User
- Add updated_by ForeignKey to User
- Configure on_delete as SET_NULL
- Define related_name pattern
- Create AuditManager
- Add filter methods (created_by_user, updated_by_user)
- Create AuditMixin for views
- Add set_created_by method
- Add set_updated_by method
- Create unit tests
- Document usage

### Technology Context
- **Audit Trail:** Who created/updated records
- **User ForeignKey:** Reference to User model
- **SET_NULL:** Preserve records if user deleted

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-52_Model-Fields-Manager.md | 45-52 | File, class, created_by, updated_by, on_delete, related_name, manager, filters |
| 02 | 02_Tasks-53-58_Mixin-Methods-Tests.md | 53-58 | AuditMixin, set_created_by, set_updated_by, tests, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Create audit.py File | Task 44 | Simple |
| 46 | Create AuditModel Class | Task 45 | Medium |
| 47 | Add created_by Field | Task 46 | Medium |
| 48 | Add updated_by Field | Task 47 | Medium |
| 49 | Configure on_delete | Task 48 | Simple |
| 50 | Add related_name Pattern | Task 49 | Simple |
| 51 | Create AuditManager | Task 50 | Medium |
| 52 | Add created_by_user() Filter | Task 51 | Simple |
| 53 | Add updated_by_user() Filter | Task 52 | Simple |
| 54 | Create AuditMixin | Task 53 | Medium |
| 55 | Add set_created_by Method | Task 54 | Medium |
| 56 | Add set_updated_by Method | Task 55 | Medium |
| 57 | Create Audit Tests | Task 56 | Medium |
| 58 | Document AuditModel | Task 57 | Simple |

---

## Execution Order

```
01_Tasks-45-52_Model-Fields-Manager.md
        │
        ▼
02_Tasks-53-58_Mixin-Methods-Tests.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── models/
│   ├── __init__.py       # Updated exports
│   └── audit.py          # AuditModel
├── managers/
│   └── audit.py          # AuditManager
├── mixins/
│   └── audit_mixin.py    # AuditMixin
└── tests/
    └── test_audit.py
```

---

## AuditModel Implementation

```python
# apps/core/models/audit.py
from django.conf import settings
from django.db import models
from .soft_delete import SoftDeleteModel

class AuditModel(SoftDeleteModel):
    """
    Abstract model tracking user actions.
    
    Fields:
        created_by: User who created this record
        updated_by: User who last updated this record
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        help_text="User who created this record"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        help_text="User who last updated this record"
    )
    
    class Meta:
        abstract = True
```

---

## AuditMixin for Views

```python
# apps/core/mixins/audit_mixin.py
class AuditMixin:
    """
    Mixin for views to automatically set audit fields.
    """
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
```

---

## AuditManager Methods

```python
# apps/core/managers/audit.py
class AuditManager(models.Manager):
    def created_by_user(self, user):
        """Filter records created by specific user."""
        return self.filter(created_by=user)
    
    def updated_by_user(self, user):
        """Filter records updated by specific user."""
        return self.filter(updated_by=user)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete
2. **Extends:** SoftDeleteModel
3. **User Reference:** Use settings.AUTH_USER_MODEL
4. **SET_NULL:** Keep records if user deleted
5. **related_name:** Use %(class)s pattern
6. **Git Commit:** Commit after completing this group

