# Group D: Backend Type Checking - mypy

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** D of H  
> **Tasks Covered:** 31-42  
> **Group Goal:** Configure mypy static type checking for Python backend

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Backend-Linting-flake8-Ruff/](../Group-C_Backend-Linting-flake8-Ruff/)
- **→ Next Group:** [../Group-E_Frontend-Linting-ESLint/](../Group-E_Frontend-Linting-ESLint/)

---

## Group Overview

This group configures mypy, the static type checker for Python. With Django and DRF stubs, mypy enables type-safe development, catching type errors before runtime and improving code documentation through type annotations.

### Key Outcomes
- mypy installed as development dependency
- Django-stubs and DRF-stubs for Django type support
- mypy.ini configuration file created
- Strict mode enabled for maximum type safety
- Plugin configuration for Django support
- Per-module overrides for migrations and tests
- Initial type check run and issues addressed

### Technology Context
- **Type Checker:** mypy 1.x (latest stable)
- **Django Support:** django-stubs with mypy plugin
- **DRF Support:** djangorestframework-stubs
- **Configuration:** mypy.ini file
- **Mode:** Strict type checking enabled

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-35_mypy-Installation.md | 31-35 | Install mypy, Django stubs, DRF stubs, create mypy.ini, configure version |
| 02 | 02_Tasks-36-39_mypy-Configuration.md | 36-39 | Configure strict mode, plugins, ignore missing imports, per-module overrides |
| 03 | 03_Tasks-40-42_mypy-Verification.md | 40-42 | Run initial type check, add type annotations, document usage |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Install mypy | Task 01 | Simple |
| 32 | Install Django Stubs | Task 31 | Simple |
| 33 | Install DRF Stubs | Task 31 | Simple |
| 34 | Create mypy.ini | Task 31 | Medium |
| 35 | Configure Python Version | Task 34 | Simple |
| 36 | Configure Strict Mode | Task 34 | Simple |
| 37 | Configure Plugins | Task 32, 34 | Medium |
| 38 | Configure Ignore Missing Imports | Task 34 | Simple |
| 39 | Configure Per-Module Overrides | Task 34 | Medium |
| 40 | Run Initial Type Check | Task 39 | Medium |
| 41 | Add Type Annotations | Task 40 | Complex |
| 42 | Document mypy Usage | Task 31 | Simple |

---

## Execution Order

```
01_Tasks-31-35_mypy-Installation.md
        │
        ▼
02_Tasks-36-39_mypy-Configuration.md
        │
        ▼
03_Tasks-40-42_mypy-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── mypy.ini                 # mypy configuration
└── README.md                # Updated with mypy usage section
```

---

## mypy Configuration Overview

**mypy.ini key settings:**
- `python_version = 3.12` - Target Python version
- `plugins = mypy_django_plugin.main` - Django plugin
- `strict = true` - Enable strict type checking
- `ignore_missing_imports = true` - For third-party libraries
- `[mypy.plugins.django-stubs]` - Django settings module
- `[mypy-*.migrations.*]` - Ignore migration errors

---

## Type Annotation Example

```python
from typing import Optional
from django.db.models import QuerySet
from apps.users.models import User

def get_active_users(limit: Optional[int] = None) -> QuerySet[User]:
    queryset = User.objects.filter(is_active=True)
    if limit:
        queryset = queryset[:limit]
    return queryset
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (pyproject.toml exists)
2. **Django Settings:** Configure django_settings_module correctly
3. **Strict Mode:** Start with strict=true; add ignores as needed
4. **Migrations:** Always ignore errors in migration files
5. **Tests:** May want looser typing in test files
6. **Git Commit:** Commit after completing this group

