# Group A: Virtual Environment Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** A of G  
> **Tasks Covered:** 01-08  
> **Group Goal:** Set up Python virtual environment and requirements structure

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [../../SubPhase-01_Monorepo-Structure-Setup/](../../SubPhase-01_Monorepo-Structure-Setup/)
- **→ Next Group:** [../Group-B_Django-Project-Creation/](../Group-B_Django-Project-Creation/)

---

## Group Overview

This group establishes the Python virtual environment for the Django backend and sets up the requirements file structure. Using pip-tools for dependency management ensures reproducible builds across all environments.

### Key Outcomes
- Python 3.12+ virtual environment created and activated
- pip-tools installed for dependency compilation
- Split requirements files for different environments (base, local, production, test)
- Ready for Django and dependency installation

### Technology Context
- **Python Version:** 3.12+
- **Virtual Environment:** venv (Python built-in)
- **Dependency Management:** pip-tools (pip-compile)
- **Requirements Strategy:** Input files (.in) compiled to lock files (.txt)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Venv-Setup.md | 01-04 | Create virtual environment, activate, upgrade pip, install pip-tools |
| 02 | 02_Tasks-05-08_Requirements-Files.md | 05-08 | Create base.in, local.in, production.in, test.in requirements files |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create Python Virtual Environment | SubPhase-01 | Simple |
| 02 | Activate Virtual Environment | Task 01 | Simple |
| 03 | Upgrade pip | Task 01 | Simple |
| 04 | Install pip-tools | Task 03 | Simple |
| 05 | Create requirements/base.in | Task 04 | Medium |
| 06 | Create requirements/local.in | Task 05 | Simple |
| 07 | Create requirements/production.in | Task 05 | Simple |
| 08 | Create requirements/test.in | Task 05 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Venv-Setup.md
        │
        ▼
02_Tasks-05-08_Requirements-Files.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── .venv/                   # Python virtual environment
│   ├── bin/ (or Scripts/)   # Activation scripts
│   ├── lib/                 # Installed packages
│   └── pyvenv.cfg           # Venv configuration
└── requirements/
    ├── base.in              # Core dependencies input
    ├── local.in             # Development dependencies
    ├── production.in        # Production dependencies
    └── test.in              # Test dependencies
```

---

## Requirements File Strategy

**base.in** - Core dependencies used everywhere:
- Django, DRF, django-tenants, psycopg, etc.

**local.in** - Development only:
- Debug toolbar, dev tools
- Extends: `-r base.in`

**production.in** - Production only:
- Gunicorn, monitoring tools
- Extends: `-r base.in`

**test.in** - Testing only:
- pytest, factory-boy, coverage
- Extends: `-r base.in`

---

## Notes for AI Agents

1. **Start Point:** Requires SubPhase-01 complete (backend/ directory exists)
2. **Python Version:** Must use Python 3.12 or higher
3. **Cross-Platform:** Document activation for Windows, Linux, macOS
4. **pip-tools:** Used instead of pip freeze for better dependency management
5. **Git Commit:** Commit after completing this group
