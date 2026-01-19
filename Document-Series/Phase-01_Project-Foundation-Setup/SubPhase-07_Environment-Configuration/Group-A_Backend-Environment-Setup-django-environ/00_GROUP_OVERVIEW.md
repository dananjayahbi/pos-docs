# Group A: Backend Environment Setup - django-environ

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** A of G  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up django-environ for backend environment variable management

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Backend-Environment-Variables-Definition/](../Group-B_Backend-Environment-Variables-Definition/)

---

## Group Overview

This group sets up django-environ for the Django backend, creating a robust environment variable management system. The configuration includes creating a utility module, example environment files, and integrating environment variables into Django settings.

### Key Outcomes
- django-environ installed and configured
- config/env.py utility module created
- .env.example and .env.local files created
- Django settings files updated to use env()
- DEBUG, SECRET_KEY, ALLOWED_HOSTS from environment
- Custom environment type casting helpers

### Technology Context
- **Package:** django-environ
- **Configuration File:** .env (not committed)
- **Example File:** .env.example (committed)
- **Utility Module:** config/env.py
- **Settings Integration:** base.py, local.py, production.py

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Django-Environ-Install.md | 01-05 | Install django-environ, create env.py module, initialize Env, configure path, read env file |
| 02 | 02_Tasks-06-10_Env-Files-Settings.md | 06-10 | Create .env.example, .env.local, update base.py, local.py, production.py |
| 03 | 03_Tasks-11-14_Core-Env-Vars.md | 11-14 | Configure DEBUG, SECRET_KEY, ALLOWED_HOSTS from env, add custom helpers |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install django-environ | SubPhase-02 | Simple |
| 02 | Create env.py Module | Task 01 | Medium |
| 03 | Initialize Env Object | Task 02 | Simple |
| 04 | Configure Env File Path | Task 03 | Simple |
| 05 | Read Env File | Task 04 | Simple |
| 06 | Create .env.example (Backend) | Task 01 | Medium |
| 07 | Create .env.local (Backend) | Task 06 | Simple |
| 08 | Update base.py Settings | Task 03 | Medium |
| 09 | Update local.py Settings | Task 08 | Simple |
| 10 | Update production.py Settings | Task 08 | Medium |
| 11 | Configure DEBUG from Env | Task 08 | Simple |
| 12 | Configure SECRET_KEY from Env | Task 08 | Simple |
| 13 | Configure ALLOWED_HOSTS from Env | Task 08 | Simple |
| 14 | Add Env Casting Helpers | Task 02 | Medium |

---

## Execution Order

```
01_Tasks-01-05_Django-Environ-Install.md
        │
        ▼
02_Tasks-06-10_Env-Files-Settings.md
        │
        ▼
03_Tasks-11-14_Core-Env-Vars.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   └── env.py               # Environment utility module
├── .env.example             # Example environment file
├── .env.local               # Local development env (not committed)
└── config/settings/
    ├── base.py              # Updated with env() calls
    ├── local.py             # Development overrides
    └── production.py        # Production settings
```

---

## django-environ Usage Example

```python
# config/env.py
import environ

env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
)
environ.Env.read_env('.env')

# settings/base.py
from config.env import env

DEBUG = env('DEBUG')
SECRET_KEY = env('SECRET_KEY')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-02 complete (Django project exists)
2. **Don't Commit .env:** Add to .gitignore
3. **Commit .env.example:** Template for team members
4. **Type Casting:** Use env.bool(), env.list(), env.int()
5. **Defaults:** Provide sensible defaults for optional variables
6. **Git Commit:** Commit after completing this group

