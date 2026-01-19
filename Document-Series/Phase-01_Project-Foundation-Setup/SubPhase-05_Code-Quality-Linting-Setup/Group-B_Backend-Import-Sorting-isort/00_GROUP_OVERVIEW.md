# Group B: Backend Import Sorting - isort

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** B of H  
> **Tasks Covered:** 11-18  
> **Group Goal:** Configure isort for consistent Python import ordering

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Backend-Formatter-Setup-Black/](../Group-A_Backend-Formatter-Setup-Black/)
- **→ Next Group:** [../Group-C_Backend-Linting-flake8-Ruff/](../Group-C_Backend-Linting-flake8-Ruff/)

---

## Group Overview

This group configures isort, the Python import sorter that automatically organizes imports into logical sections. The configuration uses Black-compatible settings to ensure both tools work harmoniously without conflicts.

### Key Outcomes
- isort installed as development dependency
- pyproject.toml updated with isort configuration
- Black-compatible profile configured
- Import sections properly defined (STDLIB, THIRDPARTY, FIRSTPARTY, LOCALFOLDER)
- Known first-party packages identified (apps, config)
- Skip patterns for migrations and virtual environments
- All existing imports sorted and verified

### Technology Context
- **Tool:** isort 5.x (latest stable)
- **Configuration:** pyproject.toml [tool.isort] section
- **Profile:** "black" for Black compatibility
- **Line Length:** 88 (matching Black)
- **Sections:** FUTURE, STDLIB, THIRDPARTY, FIRSTPARTY, LOCALFOLDER

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-11-14_isort-Installation.md | 11-14 | Install isort, configure in pyproject.toml, set Black compatibility and sections |
| 02 | 02_Tasks-15-18_isort-Configuration.md | 15-18 | Configure known first party, skip patterns, sort imports, verify |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 11 | Install isort | Task 01 | Simple |
| 12 | Configure isort in pyproject.toml | Task 02, 11 | Medium |
| 13 | Configure Black Compatibility | Task 12 | Simple |
| 14 | Configure Import Sections | Task 12 | Simple |
| 15 | Configure Known First Party | Task 12 | Simple |
| 16 | Configure Skip Patterns | Task 12 | Simple |
| 17 | Sort Existing Imports | Task 16 | Simple |
| 18 | Verify isort Configuration | Task 17 | Simple |

---

## Execution Order

```
01_Tasks-11-14_isort-Installation.md
        │
        ▼
02_Tasks-15-18_isort-Configuration.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── pyproject.toml           # Updated with [tool.isort] section
```

---

## isort Configuration Overview

**pyproject.toml key settings:**
- `profile = "black"` - Black compatibility mode
- `line_length = 88` - Match Black's line length
- `skip = [".venv", "venv", "migrations"]` - Skip directories
- `known_first_party = ["apps", "config"]` - Project packages
- `sections` - Define import ordering sections

---

## Import Order Example

```python
# FUTURE
from __future__ import annotations

# STDLIB
import os
import sys
from pathlib import Path

# THIRDPARTY
from django.conf import settings
from rest_framework import viewsets

# FIRSTPARTY
from apps.core.models import BaseModel

# LOCALFOLDER
from .serializers import UserSerializer
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (pyproject.toml exists)
2. **Profile:** Use "black" profile for Black compatibility
3. **Known First Party:** Include "apps" and "config" packages
4. **Skip Patterns:** Exclude migrations and virtual environments
5. **Verification:** Run isort with --check-only flag
6. **Git Commit:** Commit after completing this group

