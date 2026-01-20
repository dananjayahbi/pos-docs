# Group C: SoftDeleteModel

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** C of F  
> **Tasks Covered:** 29-44  
> **Group Goal:** Create SoftDeleteModel for recoverable deletions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_TimeStampedModel/](../Group-B_TimeStampedModel/)
- **→ Next Group:** [../Group-D_AuditModel/](../Group-D_AuditModel/)

---

## Group Overview

This group creates the SoftDeleteModel that extends TimeStampedModel to support soft deletion. Records are marked as deleted but can be restored.

### Key Outcomes
- Create soft_delete.py file
- Create SoftDeleteModel class extending TimeStampedModel
- Add is_deleted boolean field
- Add deleted_at timestamp field
- Create SoftDeleteManager
- Override get_queryset to exclude deleted
- Create all_with_deleted manager
- Create deleted_only manager
- Add soft_delete() method
- Add restore() method
- Add hard_delete() method
- Override delete() to use soft_delete
- Add db_index to is_deleted
- Create unit tests
- Document usage

### Technology Context
- **Soft Delete:** Mark as deleted, don't remove
- **Multiple Managers:** Different querysets
- **Recovery:** Ability to restore records

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-35_Model-Fields-Managers.md | 29-35 | File, class, is_deleted, deleted_at, manager, queryset, all_with_deleted |
| 02 | 02_Tasks-36-44_Methods-Index-Tests.md | 36-44 | deleted_only, soft_delete, restore, hard_delete, delete override, index, tests, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Create soft_delete.py File | Task 28 | Simple |
| 30 | Create SoftDeleteModel Class | Task 29 | Medium |
| 31 | Add is_deleted Field | Task 30 | Simple |
| 32 | Add deleted_at Field | Task 31 | Simple |
| 33 | Create SoftDeleteManager | Task 32 | Medium |
| 34 | Override get_queryset | Task 33 | Medium |
| 35 | Create all_with_deleted Manager | Task 34 | Medium |
| 36 | Create deleted_only Manager | Task 35 | Medium |
| 37 | Add soft_delete() Method | Task 36 | Medium |
| 38 | Add restore() Method | Task 37 | Medium |
| 39 | Add hard_delete() Method | Task 38 | Simple |
| 40 | Override delete() Method | Task 39 | Medium |
| 41 | Add db_index to is_deleted | Task 40 | Simple |
| 42 | Export in models __init__.py | Task 41 | Simple |
| 43 | Create SoftDelete Tests | Task 42 | Medium |
| 44 | Document SoftDeleteModel | Task 43 | Simple |

---

## Execution Order

```
01_Tasks-29-35_Model-Fields-Managers.md
        │
        ▼
02_Tasks-36-44_Methods-Index-Tests.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── models/
│   ├── __init__.py       # Updated exports
│   └── soft_delete.py    # SoftDeleteModel
├── managers/
│   └── soft_delete.py    # SoftDeleteManager
└── tests/
    └── test_soft_delete.py
```

---

## SoftDeleteModel Implementation

```python
# apps/core/models/soft_delete.py
from django.db import models
from django.utils import timezone
from .timestamped import TimeStampedModel

class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        """Soft delete all records in queryset."""
        return self.update(
            is_deleted=True,
            deleted_at=timezone.now()
        )
    
    def hard_delete(self):
        """Permanently delete all records."""
        return super().delete()
    
    def restore(self):
        """Restore all soft-deleted records."""
        return self.update(
            is_deleted=False,
            deleted_at=None
        )

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)

class AllObjectsManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db)

class DeletedManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=True)

class SoftDeleteModel(TimeStampedModel):
    """
    Abstract model supporting soft deletion.
    
    Fields:
        is_deleted: Whether the record is soft-deleted
        deleted_at: When the record was deleted
    """
    is_deleted = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Whether this record is soft-deleted"
    )
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When this record was soft-deleted"
    )
    
    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()
    deleted_objects = DeletedManager()
    
    class Meta:
        abstract = True
    
    def soft_delete(self):
        """Mark as deleted without removing from database."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])
    
    def restore(self):
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])
    
    def hard_delete(self):
        """Permanently delete the record."""
        super().delete()
    
    def delete(self, *args, **kwargs):
        """Override delete to use soft_delete."""
        self.soft_delete()
```

---

## Manager Usage

```python
# Default manager excludes deleted
Product.objects.all()  # Only non-deleted

# Include deleted records
Product.all_objects.all()  # All records

# Only deleted records
Product.deleted_objects.all()  # Only deleted
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete
2. **Extends:** TimeStampedModel
3. **Default Manager:** Excludes deleted
4. **db_index:** Index is_deleted for performance
5. **Override delete():** Use soft_delete by default
6. **Git Commit:** Commit after completing this group

