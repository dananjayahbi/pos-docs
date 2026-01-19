# Group C: Backend Directory Scaffold

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** C of F  
> **Tasks Covered:** 21-35  
> **Group Goal:** Create the complete Django backend directory structure

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Root-Directory-Structure/](../Group-B_Root-Directory-Structure/)
- **→ Next Group:** [../Group-D_Frontend-Directory-Scaffold/](../Group-D_Frontend-Directory-Scaffold/)

---

## Group Overview

This group scaffolds the complete backend directory structure for the Django application. It creates all necessary subdirectories for apps, configuration, static files, templates, tests, and localization following Django best practices.

### Key Outcomes
- Django apps directory structure created
- Configuration and core utilities directories established
- Static, media, and template directories ready
- Testing infrastructure directories created
- Localization directories for multi-language support
- Backend-specific configuration files created

### Technology Context
- **Framework:** Django 5.x with Python 3.12+
- **Package Management:** pip with requirements files (split by environment)
- **Project Config:** pyproject.toml for modern Python configuration
- **Languages:** English, Sinhala, Tamil support via locale directory

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-21-25_Core-Directories.md | 21-25 | Create apps, config, core, static, media directories |
| 02 | 02_Tasks-26-30_Support-Directories.md | 26-30 | Create templates, tests, fixtures, locale, requirements directories |
| 03 | 03_Tasks-31-35_Config-Files.md | 31-35 | Create .gitkeep files, manage.py, pyproject.toml, README, .env.example |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 21 | Create backend/apps/ Directory | Task 11 | Simple |
| 22 | Create backend/config/ Directory | Task 11 | Simple |
| 23 | Create backend/core/ Directory | Task 11 | Simple |
| 24 | Create backend/static/ Directory | Task 11 | Simple |
| 25 | Create backend/media/ Directory | Task 11 | Simple |
| 26 | Create backend/templates/ Directory | Task 11 | Simple |
| 27 | Create backend/tests/ Directory | Task 11 | Simple |
| 28 | Create backend/fixtures/ Directory | Task 11 | Simple |
| 29 | Create backend/locale/ Directory | Task 11 | Simple |
| 30 | Create backend/requirements/ Directory | Task 11 | Simple |
| 31 | Create backend/.gitkeep Files | Tasks 21-30 | Simple |
| 32 | Create backend/manage.py Placeholder | Task 11 | Simple |
| 33 | Create backend/pyproject.toml | Task 11 | Medium |
| 34 | Create backend/README.md | Task 11 | Medium |
| 35 | Create backend/.env.example | Task 11 | Medium |

---

## Execution Order

```
01_Tasks-21-25_Core-Directories.md
        │
        ▼
02_Tasks-26-30_Support-Directories.md
        │
        ▼
03_Tasks-31-35_Config-Files.md
```

---

## Expected Deliverables

After completing this group, the backend structure will be:

```
backend/
├── apps/                    # Django applications
│   └── .gitkeep
├── config/                  # Django project settings
│   └── .gitkeep
├── core/                    # Core utilities, base models
│   └── .gitkeep
├── fixtures/                # Test fixtures and seed data
│   └── .gitkeep
├── locale/                  # Translation files (i18n)
│   └── .gitkeep
├── media/                   # User uploads (dev only)
│   └── .gitkeep
├── requirements/            # Split requirements files
│   └── .gitkeep
├── static/                  # Static files
│   └── .gitkeep
├── templates/               # Django templates
│   └── .gitkeep
├── tests/                   # Backend tests
│   └── .gitkeep
├── .env.example             # Backend env template
├── manage.py                # Django management (placeholder)
├── pyproject.toml           # Python project config
└── README.md                # Backend documentation
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Task 11 (backend/ directory) from Group B
2. **Parallel Creation:** Tasks 21-30 can all be created in parallel
3. **Sequential Config:** Tasks 31-35 should follow after directories exist
4. **Placeholders:** manage.py is a placeholder - actual Django setup is in SubPhase-02
5. **Git Commit:** Commit with message "chore: scaffold backend directory structure"
