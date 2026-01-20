# Group B: Core App Creation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** B of G  
> **Tasks Covered:** 09-22  
> **Group Goal:** Create the core app with base models, utilities, and mixins

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Apps-Directory-Setup/](../Group-A_Apps-Directory-Setup/)
- **→ Next Group:** [../Group-C_Tenant-User-Apps/](../Group-C_Tenant-User-Apps/)

---

## Group Overview

This group creates the core app which provides base models, utilities, mixins, and exceptions used by all other apps. It's the foundation app for the entire system.

### Key Outcomes
- Create core app directory structure
- Create core __init__.py
- Create CoreConfig apps.py
- Create models.py placeholder
- Create admin.py configuration
- Create urls.py patterns
- Create views.py placeholder
- Create serializers.py for DRF
- Create utils/ directory
- Create mixins/ directory
- Create exceptions.py
- Create constants.py
- Create tests/ directory
- Register core in INSTALLED_APPS

### Technology Context
- **Core App:** Shared functionality for all apps
- **Base Models:** TimeStampedModel, UUIDModel
- **Mixins:** Reusable model/view mixins
- **Utilities:** Helper functions

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-09-14_Directory-Config-URLs.md | 09-14 | Directory, __init__, apps.py, models, admin, urls |
| 02 | 02_Tasks-15-19_Views-Serializers-Utils-Mixins.md | 15-19 | Views, serializers, utils/, mixins/, exceptions |
| 03 | 03_Tasks-20-22_Constants-Tests-Register.md | 20-22 | Constants, tests/, INSTALLED_APPS registration |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 09 | Create core App Directory | Task 08 | Simple |
| 10 | Create core __init__.py | Task 09 | Simple |
| 11 | Create core apps.py | Task 10 | Simple |
| 12 | Create core models.py | Task 11 | Simple |
| 13 | Create core admin.py | Task 12 | Simple |
| 14 | Create core urls.py | Task 12 | Simple |
| 15 | Create core views.py | Task 14 | Simple |
| 16 | Create core serializers.py | Task 15 | Simple |
| 17 | Create core utils/ Directory | Task 16 | Simple |
| 18 | Create core mixins/ Directory | Task 17 | Simple |
| 19 | Create core exceptions.py | Task 18 | Simple |
| 20 | Create core constants.py | Task 19 | Simple |
| 21 | Create core tests/ Directory | Task 20 | Simple |
| 22 | Register core in INSTALLED_APPS | Task 21 | Simple |

---

## Execution Order

```
01_Tasks-09-14_Directory-Config-URLs.md
        │
        ▼
02_Tasks-15-19_Views-Serializers-Utils-Mixins.md
        │
        ▼
03_Tasks-20-22_Constants-Tests-Register.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── __init__.py
├── apps.py
├── models.py
├── admin.py
├── urls.py
├── views.py
├── serializers.py
├── constants.py
├── exceptions.py
├── utils/
│   └── __init__.py
├── mixins/
│   └── __init__.py
└── tests/
    └── __init__.py
```

---

## Core App Configuration

```python
# apps/core/apps.py
from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'Core Functionality'
    
    def ready(self):
        # Import signals, etc.
        pass
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete
2. **Foundation:** Core app is used by all other apps
3. **Placeholders:** Models will be implemented in SubPhase-03
4. **Utils/Mixins:** Empty directories with __init__.py
5. **Registration:** Add 'core' to INSTALLED_APPS
6. **Git Commit:** Commit after completing this group

