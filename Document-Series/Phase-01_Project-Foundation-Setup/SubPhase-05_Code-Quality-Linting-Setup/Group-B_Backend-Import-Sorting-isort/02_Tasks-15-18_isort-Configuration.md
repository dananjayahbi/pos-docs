# Tasks 15-18: isort Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** B - Backend Import Sorting - isort  
> **Document:** 02 of 02  
> **Tasks Covered:** 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-11-14_isort-Installation.md](01_Tasks-11-14_isort-Installation.md)
- **→ Next Group:** [../Group-C_Backend-Linting-flake8-Ruff/00_GROUP_OVERVIEW.md](../Group-C_Backend-Linting-flake8-Ruff/)

---

## Document Overview

This document covers configuring first party packages, skip patterns, sorting imports, and verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Configure Known First Party | Simple |
| 16 | Configure Skip Patterns | Simple |
| 17 | Sort Existing Imports | Simple |
| 18 | Verify isort Configuration | Simple |

---

## Task 15: Configure Known First Party

### Overview
Configure project-specific packages as first-party imports.

### Dependencies
- Task 12: tool.isort section exists

### Instructions

1. **Identify project packages**
   - apps, config, core

2. **Add known_first_party**
   - List of package names

3. **Document packages**
   - Explain why first party

### Configuration Addition

```toml
[tool.isort]
profile = "black"
line_length = 88
sections = ["FUTURE", "STDLIB", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]
lines_between_types = 1
lines_after_imports = 2

# Known first party packages (project-specific)
known_first_party = [
    "apps",
    "config",
    "core",
    "utils",
]
```

### Project Package Structure

```
backend/
├── apps/             # Django applications
│   ├── accounts/
│   ├── inventory/
│   └── orders/
├── config/           # Django configuration
│   ├── settings/
│   └── urls.py
├── core/             # Shared utilities
└── utils/            # Helper functions
```

### Why First Party Matters

| Without first_party | With first_party |
|---------------------|------------------|
| `from apps.core` in THIRDPARTY | `from apps.core` in FIRSTPARTY |
| Confusing ordering | Clear project structure |
| Inconsistent | Consistent |

### Import Example

```python
# THIRDPARTY
from django.conf import settings
from rest_framework import viewsets

# FIRSTPARTY (correctly grouped)
from apps.accounts.models import User
from config.settings import DEBUG
from core.mixins import TimestampMixin
```

### Expected Outcome
- Project packages identified
- Correct import grouping

### Verification Checklist
- [ ] known_first_party configured
- [ ] All project roots listed
- [ ] Test import sorting

---

## Task 16: Configure Skip Patterns

### Overview
Configure directories that isort should skip.

### Dependencies
- Task 12: tool.isort section exists

### Instructions

1. **Identify skip directories**
   - Migrations, venv, cache

2. **Add skip configuration**
   - List of patterns

3. **Match Black excludes**
   - Consistency

### Configuration Addition

```toml
[tool.isort]
profile = "black"
line_length = 88

# Skip directories
skip = [
    ".git",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "build",
    "dist",
    "migrations",
]

# Skip glob patterns
skip_glob = [
    "**/migrations/*",
    "**/venv/*",
]
```

### Skip vs Skip_glob

| Setting | Purpose | Example |
|---------|---------|---------|
| skip | Exact directory names | `migrations` |
| skip_glob | Glob patterns | `**/migrations/*` |

### Migration Exclusion

Django migrations must be skipped:
- Auto-generated imports
- Order matters for dependencies
- Don't modify generated code

### Matching Black Configuration

| Black exclude | isort skip |
|---------------|------------|
| `.git` | `.git` |
| `.venv` | `.venv` |
| `venv` | `venv` |
| `migrations` | `migrations` |
| `__pycache__` | `__pycache__` |

### Expected Outcome
- All cache directories skipped
- Migrations skipped
- Virtual environments skipped

### Verification Checklist
- [ ] skip list configured
- [ ] skip_glob patterns added
- [ ] Matches Black excludes

---

## Task 17: Sort Existing Imports

### Overview
Run isort on all existing Python code to establish baseline.

### Dependencies
- Task 16: Skip patterns configured

### Instructions

1. **Preview changes**
   - Check what would change

2. **Run isort**
   - Sort all imports

3. **Commit changes**
   - Separate commit

### Sort Commands

```bash
# Preview changes (check mode)
isort --check-only --diff .

# Sort all imports
isort .

# Sort specific directory
isort apps/ config/
```

### Expected Output

```
Fixing apps/accounts/views.py
Fixing apps/inventory/models.py
Skipping migrations/0001_initial.py
```

### Makefile Commands

Add to backend/Makefile:

```makefile
# ==================================================
# Import Sorting
# ==================================================

.PHONY: sort-imports
sort-imports:
	@echo "Sorting imports with isort..."
	isort .
	@echo "Import sorting complete!"

.PHONY: sort-imports-check
sort-imports-check:
	@echo "Checking import sorting..."
	isort --check-only --diff .
	@echo "Import check complete!"
```

### Git Workflow

```bash
# Stage sorted files
git add -A

# Create dedicated commit
git commit -m "style: sort imports with isort"
```

### Combine with Black

```makefile
# Format and sort in one command
.PHONY: lint-fix
lint-fix:
	@echo "Formatting and sorting..."
	isort .
	black .
	@echo "Complete!"
```

### Expected Outcome
- All imports sorted
- Consistent ordering
- Clean git commit

### Verification Checklist
- [ ] Preview reviewed
- [ ] isort applied
- [ ] Migrations skipped
- [ ] Committed separately

---

## Task 18: Verify isort Configuration

### Overview
Verify isort configuration works correctly with Black.

### Dependencies
- Task 17: Sort Existing Imports

### Instructions

1. **Test Black compatibility**
   - Run both tools

2. **Verify section ordering**
   - Check import groups

3. **Document usage**
   - Update README

### Verification Commands

```bash
# Check isort then Black (no changes expected)
isort .
black .

# Check mode (should pass)
isort --check-only .
black --check .
```

### Compatibility Test

Create test file:
```python
# test_imports.py
from __future__ import annotations
import os
from django.conf import settings
from apps.core.models import BaseModel
from .utils import helper
```

Run both tools:
```bash
isort test_imports.py
black test_imports.py
isort --check test_imports.py  # Should pass
black --check test_imports.py  # Should pass
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Black reformats isort | Ensure profile = "black" |
| Wrong section | Add to known_first_party |
| File not skipped | Check skip_glob pattern |

### README Update

Add to backend/README.md:

```markdown
## Import Sorting

This project uses [isort](https://pycqa.github.io/isort/) for import sorting.

### Quick Commands

```bash
# Sort all imports
make sort-imports

# Check sorting (CI)
make sort-imports-check
```

### Configuration

isort is configured in `pyproject.toml`:
- Profile: black (compatible)
- Sections: STDLIB → THIRDPARTY → FIRSTPARTY → LOCAL
- First party: apps, config, core
- Skips: migrations, venv

### Combined Workflow

```bash
# Format and sort
make lint-fix
```
```

### Expected Outcome
- Configuration verified
- Black compatibility confirmed
- Documentation updated

### Verification Checklist
- [ ] isort + Black work together
- [ ] Sections correct
- [ ] Skip patterns working
- [ ] README updated

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Configure Known First Party | Project packages |
| 16 | Configure Skip Patterns | Skip migrations, venv |
| 17 | Sort Existing Imports | Sorted codebase |
| 18 | Verify isort Configuration | Tested with Black |

### Group B Complete

All 8 tasks for isort setup are complete:

| Task | Description | Status |
|------|-------------|--------|
| 11 | Install isort | ✅ |
| 12 | Configure in pyproject.toml | ✅ |
| 13 | Configure Black Compatibility | ✅ |
| 14 | Configure Import Sections | ✅ |
| 15 | Configure Known First Party | ✅ |
| 16 | Configure Skip Patterns | ✅ |
| 17 | Sort Existing Imports | ✅ |
| 18 | Verify Configuration | ✅ |

### Final pyproject.toml [tool.isort]

```toml
[tool.isort]
# Use Black profile for compatibility
profile = "black"

# Line length (must match Black)
line_length = 88

# Section ordering
sections = [
    "FUTURE",
    "STDLIB",
    "THIRDPARTY",
    "FIRSTPARTY",
    "LOCALFOLDER"
]

# Known first party packages
known_first_party = [
    "apps",
    "config",
    "core",
    "utils",
]

# Skip directories
skip = [
    ".git",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "build",
    "dist",
    "migrations",
]

skip_glob = [
    "**/migrations/*",
    "**/venv/*",
]

# Blank line configuration
lines_between_types = 1
lines_after_imports = 2
```

### Makefile Commands Added

| Command | Purpose |
|---------|---------|
| `make sort-imports` | Sort all imports |
| `make sort-imports-check` | Check sorting |
| `make lint-fix` | Format + sort |

### Next Steps
Proceed to [Group C: Backend Linting - flake8/Ruff](../Group-C_Backend-Linting-flake8-Ruff/00_GROUP_OVERVIEW.md) for linting configuration.

---

## Notes for AI Agents

1. **Profile:** "black" is essential for compatibility
2. **First party:** List all project root packages
3. **Skip:** Must match Black exclusions
4. **Order:** isort before black in lint-fix
5. **Migrations:** Always skip (auto-generated)
6. **Testing:** Run both tools, should produce no changes
7. **Git:** Separate commit for import sorting
