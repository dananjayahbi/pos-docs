# Group B: TimeStampedModel

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Create TimeStampedModel with created_at and updated_at fields

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Base-Model-Setup/](../Group-A_Base-Model-Setup/)
- **→ Next Group:** [../Group-C_SoftDeleteModel/](../Group-C_SoftDeleteModel/)

---

## Group Overview

This group creates the TimeStampedModel abstract model that automatically tracks creation and update timestamps. All business models will inherit from this.

### Key Outcomes
- Create timestamped.py file
- Create TimeStampedModel class
- Add created_at field (auto_now_add)
- Add updated_at field (auto_now)
- Set abstract=True
- Configure default ordering
- Create TimeStampedManager
- Add time-based filter methods
- Export in __init__.py
- Create unit tests
- Document usage

### Technology Context
- **auto_now_add:** Set on creation only
- **auto_now:** Updated on every save
- **Abstract Model:** Not a database table

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Model-Class-Meta.md | 15-20 | Create file, class, fields, Meta, ordering |
| 02 | 02_Tasks-21-28_Manager-Methods-Tests.md | 21-28 | Manager, filter methods, export, tests, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create timestamped.py File | Task 14 | Simple |
| 16 | Create TimeStampedModel Class | Task 15 | Medium |
| 17 | Add created_at Field | Task 16 | Simple |
| 18 | Add updated_at Field | Task 17 | Simple |
| 19 | Set Meta abstract=True | Task 18 | Simple |
| 20 | Add ordering by created_at | Task 19 | Simple |
| 21 | Create TimeStampedManager | Task 20 | Medium |
| 22 | Add recent() Method | Task 21 | Simple |
| 23 | Add today() Method | Task 22 | Simple |
| 24 | Add this_week() Method | Task 23 | Simple |
| 25 | Add this_month() Method | Task 24 | Simple |
| 26 | Export in models __init__.py | Task 25 | Simple |
| 27 | Create TimeStamped Tests | Task 26 | Medium |
| 28 | Document TimeStampedModel | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_Model-Class-Meta.md
        │
        ▼
02_Tasks-21-28_Manager-Methods-Tests.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── models/
│   ├── __init__.py       # Updated exports
│   └── timestamped.py    # TimeStampedModel
├── managers/
│   └── timestamped.py    # TimeStampedManager
└── tests/
    └── test_timestamped.py
```

---

## TimeStampedModel Implementation

```python
# apps/core/models/timestamped.py
from django.db import models
from django.utils import timezone

class TimeStampedModel(models.Model):
    """
    Abstract base model with automatic timestamps.
    
    Fields:
        created_at: When the record was created
        updated_at: When the record was last updated
    """
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When this record was last updated"
    )
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
```

---

## TimeStampedManager Methods

```python
# apps/core/managers/timestamped.py
from datetime import timedelta
from django.utils import timezone

class TimeStampedManager(models.Manager):
    def recent(self, days=7):
        """Records from last N days."""
        cutoff = timezone.now() - timedelta(days=days)
        return self.filter(created_at__gte=cutoff)
    
    def today(self):
        """Records created today."""
        return self.filter(created_at__date=timezone.now().date())
    
    def this_week(self):
        """Records from this week."""
        return self.recent(days=7)
    
    def this_month(self):
        """Records from this month."""
        return self.recent(days=30)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete
2. **Auto Fields:** auto_now_add vs auto_now
3. **db_index:** Index created_at for performance
4. **Ordering:** Default descending by created_at
5. **Timezone Aware:** Use django.utils.timezone
6. **Git Commit:** Commit after completing this group

