# Tasks 11-14: isort Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** B - Backend Import Sorting - isort  
> **Document:** 01 of 02  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Backend-Formatter-Setup-Black/03_Tasks-08-10_Black-Verification.md](../Group-A_Backend-Formatter-Setup-Black/03_Tasks-08-10_Black-Verification.md)
- **→ Next Document:** [02_Tasks-15-18_isort-Configuration.md](02_Tasks-15-18_isort-Configuration.md)

---

## Document Overview

This document covers installing isort and configuring Black compatibility in pyproject.toml.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Install isort | Simple |
| 12 | Configure isort in pyproject.toml | Medium |
| 13 | Configure Black Compatibility | Simple |
| 14 | Configure Import Sections | Simple |

---

## Task 11: Install isort

### Overview
Install isort as a development dependency for the Python backend.

### Dependencies
- Task 01: Black installed (Group A)

### Instructions

1. **Add isort to dev dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check version

### Installation Method

Using pip (requirements-dev.txt):
```
isort>=5.13.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
isort = "^5.13.0"
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| isort | >=5.13.0 | Import sorter |

### Verification

```bash
# Check installation
isort --version

# Expected output
isort, version 5.13.x
```

### Why isort 5.x

| Feature | Benefit |
|---------|---------|
| Black profile | Built-in compatibility |
| Sections | Customizable ordering |
| Performance | Fast processing |
| pyproject.toml | Native support |

### Expected Outcome
- isort installed
- Version 5.x available

### Verification Checklist
- [ ] isort in requirements-dev.txt
- [ ] Package installed
- [ ] Version verified

---

## Task 12: Configure isort in pyproject.toml

### Overview
Add isort configuration section to pyproject.toml.

### Dependencies
- Task 02: pyproject.toml exists (Group A)
- Task 11: isort installed

### Instructions

1. **Add tool.isort section**
   - After tool.black section

2. **Set basic options**
   - Profile, line length

3. **Document purpose**
   - Header comments

### Configuration Addition

```toml
# ==================================================
# isort Configuration
# ==================================================
[tool.isort]
# Import sorting configuration
# Configured for Black compatibility
```

### Placement in pyproject.toml

```toml
[tool.black]
# ... Black settings ...

[tool.isort]
# ... isort settings (this section) ...
```

### Key Configuration Options

| Option | Purpose |
|--------|---------|
| profile | Preset configuration |
| line_length | Maximum line length |
| skip | Directories to skip |
| known_first_party | Project packages |
| sections | Import ordering |

### Expected Outcome
- tool.isort section added
- Ready for configuration

### Verification Checklist
- [ ] Section added to pyproject.toml
- [ ] Proper placement after Black
- [ ] Comments added

---

## Task 13: Configure Black Compatibility

### Overview
Configure isort to be compatible with Black formatting.

### Dependencies
- Task 12: tool.isort section exists

### Instructions

1. **Set Black profile**
   - Built-in compatibility

2. **Match line length**
   - Same as Black (88)

3. **Configure multi-line**
   - Black-compatible style

### Configuration Addition

```toml
[tool.isort]
# Use Black profile for compatibility
profile = "black"

# Line length (must match Black)
line_length = 88
```

### Black Profile Effects

| Setting | Value |
|---------|-------|
| multi_line_output | 3 |
| include_trailing_comma | True |
| force_grid_wrap | 0 |
| use_parentheses | True |
| ensure_newline_before_comments | True |

### Why Black Compatibility

| Without Profile | With Profile |
|-----------------|--------------|
| Black and isort conflict | Tools work together |
| Constant reformatting | Stable output |
| CI failures | Clean pipeline |

### Multi-line Import Example

```python
# Black-compatible multi-line import
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
```

### Expected Outcome
- Black profile set
- Line length matches Black
- Tools work together

### Verification Checklist
- [ ] profile = "black" set
- [ ] line_length = 88 set
- [ ] No conflicts with Black

---

## Task 14: Configure Import Sections

### Overview
Configure import section ordering for isort.

### Dependencies
- Task 12: tool.isort section exists

### Instructions

1. **Define section order**
   - Standard Python ordering

2. **Separate sections**
   - Blank lines between

3. **Document sections**
   - Explain each section

### Configuration Addition

```toml
[tool.isort]
profile = "black"
line_length = 88

# Section ordering
sections = [
    "FUTURE",
    "STDLIB",
    "THIRDPARTY",
    "FIRSTPARTY",
    "LOCALFOLDER"
]

# Add blank lines between sections
lines_between_types = 1
lines_after_imports = 2
```

### Section Definitions

| Section | Description | Example |
|---------|-------------|---------|
| FUTURE | Future imports | `from __future__ import annotations` |
| STDLIB | Standard library | `import os`, `import sys` |
| THIRDPARTY | Installed packages | `import django`, `import celery` |
| FIRSTPARTY | Project packages | `from apps.core import models` |
| LOCALFOLDER | Relative imports | `from .models import User` |

### Import Order Example

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
from config.settings import DEBUG

# LOCALFOLDER
from .serializers import UserSerializer
from .views import UserViewSet
```

### Blank Lines Configuration

| Setting | Value | Effect |
|---------|-------|--------|
| lines_between_types | 1 | Between from/import in same section |
| lines_after_imports | 2 | After all imports |

### Expected Outcome
- Section ordering defined
- Clear import grouping
- Consistent spacing

### Verification Checklist
- [ ] Sections defined
- [ ] Ordering matches standard
- [ ] Blank lines configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Install isort | Development dependency |
| 12 | Configure isort in pyproject.toml | Configuration section |
| 13 | Configure Black Compatibility | profile = "black" |
| 14 | Configure Import Sections | Section ordering |

### pyproject.toml Progress

```toml
# ==================================================
# isort Configuration
# ==================================================
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

# Blank line configuration
lines_between_types = 1
lines_after_imports = 2
```

### Next Steps
Proceed to [02_Tasks-15-18_isort-Configuration.md](02_Tasks-15-18_isort-Configuration.md) for first party packages, skip patterns, and verification.

---

## Notes for AI Agents

1. **Profile:** Always use "black" for Black compatibility
2. **Line length:** Must match Black (88)
3. **Sections:** Standard 5-section ordering
4. **Order:** FUTURE → STDLIB → THIRDPARTY → FIRSTPARTY → LOCALFOLDER
5. **Spacing:** lines_after_imports = 2 for PEP 8
6. **Placement:** After [tool.black] in pyproject.toml
