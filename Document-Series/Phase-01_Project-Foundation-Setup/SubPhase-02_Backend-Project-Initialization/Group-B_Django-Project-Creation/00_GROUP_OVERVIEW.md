# Group B: Django Project Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** B of G  
> **Tasks Covered:** 09-18  
> **Group Goal:** Create Django project with proper configuration structure

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Virtual-Environment-Setup/](../Group-A_Virtual-Environment-Setup/)
- **→ Next Group:** [../Group-C_Settings-Module-Structure/](../Group-C_Settings-Module-Structure/)

---

## Group Overview

This group creates the Django project structure and prepares it for modular settings. The project is created with the config directory as the main configuration module, then restructured for environment-specific settings.

### Key Outcomes
- Django 5.x installed in virtual environment
- Project created with `config` as the configuration module
- Settings restructured to modular format (base, local, production, test)
- WSGI and ASGI entry points configured
- URL routing foundation established
- Installation verified with Django checks

### Technology Context
- **Django Version:** 5.x (latest stable)
- **Project Layout:** Config-centric with settings module
- **Entry Points:** WSGI (sync) and ASGI (async) ready
- **Settings:** Environment-based configuration

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-09-13_Project-Creation.md | 09-13 | Install Django, create project, restructure settings, update manage.py |
| 02 | 02_Tasks-14-18_Config-Verification.md | 14-18 | Update wsgi.py, asgi.py, urls.py, verify installation, test migrations |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 09 | Install Django | Task 01 | Simple |
| 10 | Create Django Project | Task 09 | Medium |
| 11 | Rename settings.py | Task 10 | Medium |
| 12 | Create settings __init__.py | Task 11 | Simple |
| 13 | Update manage.py | Task 12 | Simple |
| 14 | Update wsgi.py | Task 10 | Simple |
| 15 | Update asgi.py | Task 10 | Simple |
| 16 | Create urls.py Structure | Task 10 | Medium |
| 17 | Verify Django Installation | Task 16 | Simple |
| 18 | Create Initial Migration Test | Task 17 | Simple |

---

## Execution Order

```
01_Tasks-09-13_Project-Creation.md
        │
        ▼
02_Tasks-14-18_Config-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   ├── __init__.py
│   ├── asgi.py              # ASGI entry point
│   ├── settings/
│   │   ├── __init__.py      # Settings module init
│   │   └── base.py          # Base settings (renamed from settings.py)
│   ├── urls.py              # Root URL configuration
│   └── wsgi.py              # WSGI entry point
└── manage.py                # Updated for modular settings
```

---

## Settings Module Strategy

The single `settings.py` is converted to a module:

```
config/settings/
├── __init__.py    # Imports based on environment
├── base.py        # Common settings for all environments
├── local.py       # Development overrides (created in Group C)
├── production.py  # Production overrides (created in Group C)
└── test.py        # Test-specific settings (created in Group C)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (virtual environment active)
2. **Project Command:** Use `django-admin startproject config .` (note the dot)
3. **Settings Refactor:** Critical step - don't skip Task 11
4. **DJANGO_SETTINGS_MODULE:** Will point to config.settings.local for dev
5. **Verification:** Run `python manage.py check` after completing
6. **Git Commit:** Commit after completing this group
