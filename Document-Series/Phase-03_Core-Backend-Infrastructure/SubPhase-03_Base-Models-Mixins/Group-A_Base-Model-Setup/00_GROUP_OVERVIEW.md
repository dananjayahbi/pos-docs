# Group A: Base Model Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the foundational directory structure and base classes

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_TimeStampedModel/](../Group-B_TimeStampedModel/)

---

## Group Overview

This group creates the directory structure for models, managers, and mixins in the core app. It also establishes the BaseManager and BaseQuerySet classes that other managers will extend.

### Key Outcomes
- Create models/ directory structure
- Create models __init__.py
- Create base.py file
- Create managers/ directory
- Create managers __init__.py
- Create BaseManager class
- Create BaseQuerySet class
- Create mixins/ directory structure
- Define naming conventions
- Create documentation template
- Verify base structure

### Technology Context
- **Abstract Models:** Reusable model classes
- **Custom Managers:** Filter and query logic
- **Mixins:** Reusable functionality

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-07_Directory-Structure.md | 01-07 | Create models/, managers/ directories, __init__.py files, BaseManager |
| 02 | 02_Tasks-08-14_QuerySet-Mixins-Standards.md | 08-14 | BaseQuerySet, mixins/, naming conventions, documentation template, verify |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create models Directory | SubPhase-01 | Simple |
| 02 | Create models __init__.py | Task 01 | Simple |
| 03 | Create base.py File | Task 02 | Simple |
| 04 | Import Django Models | Task 03 | Simple |
| 05 | Create managers Directory | Task 04 | Simple |
| 06 | Create managers __init__.py | Task 05 | Simple |
| 07 | Create BaseManager Class | Task 06 | Medium |
| 08 | Create BaseQuerySet Class | Task 07 | Medium |
| 09 | Create mixins Directory | Task 08 | Simple |
| 10 | Create mixins __init__.py | Task 09 | Simple |
| 11 | Define Model Naming Convention | Task 10 | Simple |
| 12 | Define Field Naming Convention | Task 11 | Simple |
| 13 | Create Model Documentation Template | Task 12 | Simple |
| 14 | Verify Base Structure | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-07_Directory-Structure.md
        │
        ▼
02_Tasks-08-14_QuerySet-Mixins-Standards.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── models/
│   ├── __init__.py
│   └── base.py
├── managers/
│   ├── __init__.py
│   └── base.py
└── mixins/
    └── __init__.py
```

---

## BaseManager & BaseQuerySet

```python
# apps/core/managers/base.py
from django.db import models

class BaseQuerySet(models.QuerySet):
    """Base QuerySet with common methods."""
    
    def active(self):
        """Filter active records."""
        return self.filter(is_active=True)

class BaseManager(models.Manager):
    """Base Manager using BaseQuerySet."""
    
    def get_queryset(self):
        return BaseQuerySet(self.model, using=self._db)
    
    def active(self):
        return self.get_queryset().active()
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Model | PascalCase, singular | `Product`, `OrderItem` |
| Field | snake_case | `created_at`, `is_active` |
| Manager | PascalCase + Manager | `ProductManager` |
| QuerySet | PascalCase + QuerySet | `ProductQuerySet` |

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-01 complete
2. **Directory First:** Create directories before files
3. **Imports:** Export all from __init__.py
4. **Abstract:** Base models are abstract=True
5. **Documentation:** Use consistent docstrings
6. **Git Commit:** Commit after completing this group

