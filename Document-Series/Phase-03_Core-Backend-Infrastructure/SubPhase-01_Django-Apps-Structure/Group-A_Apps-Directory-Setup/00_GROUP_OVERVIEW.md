# Group A: Apps Directory Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** A of G  
> **Tasks Covered:** 01-08  
> **Group Goal:** Create the apps directory structure and establish conventions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Core-App-Creation/](../Group-B_Core-App-Creation/)

---

## Group Overview

This group creates the base apps directory structure, configures the Python path, and establishes naming conventions and templates for creating new Django apps.

### Key Outcomes
- Create backend/apps/ directory
- Create apps __init__.py
- Update PYTHONPATH in settings
- Create apps README documentation
- Create app template for consistency
- Define app naming conventions
- Create management command folder
- Document app creation process

### Technology Context
- **Django Apps:** Modular application components
- **PYTHONPATH:** Python module path configuration
- **Templates:** Consistent app structure
- **Naming:** Lowercase, singular (except users)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Directory-Path-README.md | 01-04 | Create apps dir, __init__, PYTHONPATH, README |
| 02 | 02_Tasks-05-08_Template-Naming-Commands-Docs.md | 05-08 | App template, naming convention, commands folder, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create apps Directory | Phase-02 | Simple |
| 02 | Create apps __init__.py | Task 01 | Simple |
| 03 | Update Python Path | Task 02 | Simple |
| 04 | Create Apps README | Task 02 | Simple |
| 05 | Create App Template | Task 04 | Medium |
| 06 | Define App Naming Convention | Task 04 | Simple |
| 07 | Create Management Command Folder | Task 06 | Simple |
| 08 | Document App Creation Process | Task 07 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Directory-Path-README.md
        │
        ▼
02_Tasks-05-08_Template-Naming-Commands-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   ├── __init__.py
│   └── README.md
└── config/
    └── settings/
        └── base.py           # Updated PYTHONPATH
```

---

## Python Path Configuration

```python
# config/settings/base.py
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Add apps directory to Python path
sys.path.insert(0, str(BASE_DIR / 'apps'))
```

---

## App Naming Conventions

| Convention | Example | Note |
|------------|---------|------|
| Lowercase | `products` | Not `Products` |
| Singular | `product` | Not `products` (exception: `users`) |
| Descriptive | `inventory` | Not `inv` |
| No Prefixes | `products` | Not `lcc_products` |

---

## Notes for AI Agents

1. **Dependencies:** Requires Phase-02 complete
2. **PYTHONPATH:** Add apps to path first
3. **README:** Document all apps and purposes
4. **Template:** Create reusable app template
5. **Naming:** Follow established conventions
6. **Git Commit:** Commit after completing this group

