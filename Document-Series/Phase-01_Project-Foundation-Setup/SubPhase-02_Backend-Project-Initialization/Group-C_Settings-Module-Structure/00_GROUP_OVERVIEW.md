# Group C: Settings Module Structure

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** C of G  
> **Tasks Covered:** 19-35  
> **Group Goal:** Create comprehensive modular settings for all environments

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Django-Project-Creation/](../Group-B_Django-Project-Creation/)
- **→ Next Group:** [../Group-D_Core-Dependencies-Installation/](../Group-D_Core-Dependencies-Installation/)

---

## Group Overview

This group builds out the complete settings module with base settings and environment-specific overrides. It covers all Django configuration categories including apps, middleware, templates, database, security, internationalization, and static/media files.

### Key Outcomes
- Complete base.py with all common settings
- local.py for development environment
- production.py for production deployment
- test.py for test environment
- Security settings properly configured per environment
- Sri Lanka localization (timezone, languages)

### Technology Context
- **Settings Pattern:** Environment-based modular settings
- **Secret Management:** Environment variables via django-environ
- **Security:** Progressive security (relaxed in dev, strict in prod)
- **Localization:** Asia/Colombo timezone, English + Sinhala + Tamil

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-19-23_Base-Core.md | 19-23 | Base imports, INSTALLED_APPS, middleware, templates, database placeholder |
| 02 | 02_Tasks-24-28_Base-Config.md | 24-28 | Auth settings, i18n, static files, media files, security defaults |
| 03 | 03_Tasks-29-31_Local-Settings.md | 29-31 | local.py - debug settings, database, email backend |
| 04 | 04_Tasks-32-35_Production-Test.md | 32-35 | production.py - security, database, caching; test.py settings |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 19 | Create base.py - Imports Section | Task 11 | Simple |
| 20 | Create base.py - Installed Apps | Task 19 | Medium |
| 21 | Create base.py - Middleware | Task 19 | Medium |
| 22 | Create base.py - Templates | Task 19 | Simple |
| 23 | Create base.py - Database Placeholder | Task 19 | Simple |
| 24 | Create base.py - Auth Settings | Task 19 | Simple |
| 25 | Create base.py - Internationalization | Task 19 | Simple |
| 26 | Create base.py - Static Files | Task 19 | Simple |
| 27 | Create base.py - Media Files | Task 19 | Simple |
| 28 | Create base.py - Security Defaults | Task 19 | Medium |
| 29 | Create local.py - Debug Settings | Task 19 | Medium |
| 30 | Create local.py - Database | Task 29 | Simple |
| 31 | Create local.py - Email | Task 29 | Simple |
| 32 | Create production.py - Security | Task 19 | Complex |
| 33 | Create production.py - Database | Task 32 | Medium |
| 34 | Create production.py - Caching | Task 32 | Medium |
| 35 | Create test.py | Task 19 | Medium |

---

## Execution Order

```
01_Tasks-19-23_Base-Core.md
        │
        ▼
02_Tasks-24-28_Base-Config.md
        │
        ▼
03_Tasks-29-31_Local-Settings.md
        │
        ▼
04_Tasks-32-35_Production-Test.md
```

---

## Expected Deliverables

After completing this group:

```
backend/config/settings/
├── __init__.py
├── base.py          # ~200 lines - all common settings
├── local.py         # ~50 lines - development overrides
├── production.py    # ~80 lines - production security & config
└── test.py          # ~30 lines - test optimizations
```

---

## Settings Categories in base.py

1. **Imports & Path Configuration** (Task 19)
2. **INSTALLED_APPS** (Task 20)
3. **MIDDLEWARE** (Task 21)
4. **TEMPLATES** (Task 22)
5. **DATABASE** (Task 23) - placeholder for env override
6. **AUTH_PASSWORD_VALIDATORS** (Task 24)
7. **INTERNATIONALIZATION** (Task 25) - Asia/Colombo, en/si/ta
8. **STATIC_FILES** (Task 26)
9. **MEDIA_FILES** (Task 27)
10. **SECURITY** (Task 28) - CSRF, XSS, etc.

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (Django project created)
2. **Environment Variables:** Use django-environ for secrets
3. **Sri Lanka Specific:** TIME_ZONE = 'Asia/Colombo', LANGUAGES includes Sinhala
4. **Security Layering:** local.py relaxed, production.py strict
5. **Test Optimization:** PASSWORD_HASHERS use fast hasher in test.py
6. **Git Commit:** Commit after completing this group
