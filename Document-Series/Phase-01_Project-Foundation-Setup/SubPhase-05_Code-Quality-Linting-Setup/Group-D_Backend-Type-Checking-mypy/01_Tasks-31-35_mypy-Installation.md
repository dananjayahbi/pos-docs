# Tasks 31-35: mypy Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** D - Backend Type Checking - mypy  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Backend-Linting-flake8-Ruff/03_Tasks-29-30_Lint-Verification.md](../Group-C_Backend-Linting-flake8-Ruff/03_Tasks-29-30_Lint-Verification.md)
- **→ Next Document:** [02_Tasks-36-39_mypy-Configuration.md](02_Tasks-36-39_mypy-Configuration.md)

---

## Document Overview

This document covers installing mypy with Django/DRF stubs and creating the configuration file.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Install mypy | Simple |
| 32 | Install Django Stubs | Simple |
| 33 | Install DRF Stubs | Simple |
| 34 | Create mypy.ini | Medium |
| 35 | Configure Python Version | Simple |

---

## Task 31: Install mypy

### Overview
Install mypy as a development dependency for static type checking.

### Dependencies
- Task 01: Black installed (Group A)

### Instructions

1. **Add mypy to dev dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check version

### Installation Method

Using pip (requirements-dev.txt):
```
mypy>=1.10.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
mypy = "^1.10.0"
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| mypy | >=1.10.0 | Static type checker |

### Verification

```bash
# Check installation
mypy --version

# Expected output
mypy 1.10.x
```

### Why mypy

| Feature | Benefit |
|---------|---------|
| Static analysis | Catch errors before runtime |
| Type hints | Self-documenting code |
| IDE support | Better autocomplete |
| Refactoring | Safer code changes |

### Expected Outcome
- mypy installed
- Version 1.x available

### Verification Checklist
- [ ] mypy in requirements-dev.txt
- [ ] Package installed
- [ ] Version verified

---

## Task 32: Install Django Stubs

### Overview
Install Django stubs for type support in Django code.

### Dependencies
- Task 31: mypy installed

### Instructions

1. **Add django-stubs to dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Include django-stubs-ext

3. **Verify installation**
   - Check package info

### Installation Method

Add to requirements-dev.txt:
```
django-stubs>=5.0.0
django-stubs-ext>=5.0.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
django-stubs = "^5.0.0"
django-stubs-ext = "^5.0.0"
```

### Package Components

| Package | Purpose |
|---------|---------|
| django-stubs | Type hints for Django |
| django-stubs-ext | mypy plugin for Django |

### What Django Stubs Provide

| Feature | Typing Support |
|---------|----------------|
| Models | QuerySet[Model], Model type |
| Views | Request, Response types |
| Forms | Form field types |
| Settings | Setting type validation |

### Verification

```bash
# Check package installed
pip show django-stubs

# Expected: Shows package info
```

### Expected Outcome
- Django stubs installed
- Django type support available

### Verification Checklist
- [ ] django-stubs installed
- [ ] django-stubs-ext installed
- [ ] Package versions compatible

---

## Task 33: Install DRF Stubs

### Overview
Install Django REST Framework stubs for API type support.

### Dependencies
- Task 31: mypy installed
- Task 32: Django stubs installed

### Instructions

1. **Add DRF stubs to dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check package info

### Installation Method

Add to requirements-dev.txt:
```
djangorestframework-stubs>=3.14.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
djangorestframework-stubs = "^3.14.0"
```

### What DRF Stubs Provide

| Feature | Typing Support |
|---------|----------------|
| Serializers | Field types, validated data |
| ViewSets | Action types, request |
| Responses | Response data types |
| Generics | Generic view types |

### Type Example

```python
from rest_framework import serializers
from typing import TypedDict

class UserData(TypedDict):
    id: int
    username: str
    email: str

class UserSerializer(serializers.Serializer[UserData]):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
```

### Complete Dev Dependencies

```
# requirements-dev.txt (type checking section)

# Type checking
mypy>=1.10.0
django-stubs>=5.0.0
django-stubs-ext>=5.0.0
djangorestframework-stubs>=3.14.0
types-redis>=4.6.0
types-celery>=5.3.0
```

### Expected Outcome
- DRF stubs installed
- API type support available

### Verification Checklist
- [ ] djangorestframework-stubs installed
- [ ] Compatible with django-stubs
- [ ] Types available for DRF

---

## Task 34: Create mypy.ini

### Overview
Create mypy.ini configuration file in backend directory.

### Dependencies
- Task 31: mypy installed

### Instructions

1. **Create mypy.ini file**
   - In backend/ directory

2. **Add header comments**
   - Document purpose

3. **Structure configuration**
   - Section-based

### File Location

```
backend/
└── mypy.ini
```

### Initial mypy.ini

```ini
# ==================================================
# LankaCommerce Cloud - mypy Configuration
# ==================================================
# Purpose: Static type checking configuration
# Python: 3.12
# Frameworks: Django 5.x, DRF
# ==================================================

[mypy]
# Configuration settings will be added in subsequent tasks
```

### Why mypy.ini (not pyproject.toml)

| Reason | Explanation |
|--------|-------------|
| Full support | All options available |
| Sections | Per-module overrides |
| Clarity | Dedicated type config |
| Compatibility | Works with all mypy versions |

### Alternative: pyproject.toml

```toml
# Can also use pyproject.toml
[tool.mypy]
python_version = "3.12"
```

For this project, use mypy.ini for full configuration support.

### Expected Outcome
- mypy.ini file created
- Ready for configuration

### Verification Checklist
- [ ] File created in backend/
- [ ] Header comments added
- [ ] [mypy] section present

---

## Task 35: Configure Python Version

### Overview
Configure the target Python version for mypy.

### Dependencies
- Task 34: mypy.ini file exists

### Instructions

1. **Set python_version**
   - Match project Python (3.12)

2. **Document setting**
   - Comment explains

### Configuration Addition

```ini
[mypy]
# Target Python version
python_version = 3.12
```

### Why Python Version Matters

| Effect | Description |
|--------|-------------|
| Syntax | Enables 3.12 type syntax |
| Features | Uses latest typing features |
| Compatibility | Matches runtime version |
| Type hints | Modern annotation style |

### Python 3.12 Type Features

| Feature | Example |
|---------|---------|
| Type parameters | `def f[T](x: T) -> T` |
| Type aliases | `type Vector = list[float]` |
| Union syntax | `int | str` instead of `Union[int, str]` |
| Optional syntax | `str | None` instead of `Optional[str]` |

### Matching Project Python

| Component | Python Version |
|-----------|----------------|
| Dockerfile | 3.12 |
| pyproject.toml | >=3.12 |
| Black target | py312 |
| Ruff target | py312 |
| mypy python_version | 3.12 |

### Expected Outcome
- Python version configured
- Matches project settings

### Verification Checklist
- [ ] python_version = 3.12 set
- [ ] Matches Dockerfile
- [ ] Matches other tools

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Install mypy | Development dependency |
| 32 | Install Django Stubs | Django type support |
| 33 | Install DRF Stubs | DRF type support |
| 34 | Create mypy.ini | Configuration file |
| 35 | Configure Python Version | python_version = 3.12 |

### requirements-dev.txt Additions

```
# Type Checking
mypy>=1.10.0
django-stubs>=5.0.0
django-stubs-ext>=5.0.0
djangorestframework-stubs>=3.14.0
types-redis>=4.6.0
types-celery>=5.3.0
```

### mypy.ini Progress

```ini
# ==================================================
# LankaCommerce Cloud - mypy Configuration
# ==================================================
# Purpose: Static type checking configuration
# Python: 3.12
# Frameworks: Django 5.x, DRF
# ==================================================

[mypy]
# Target Python version
python_version = 3.12
```

### Next Steps
Proceed to [02_Tasks-36-39_mypy-Configuration.md](02_Tasks-36-39_mypy-Configuration.md) for strict mode, plugins, and overrides.

---

## Notes for AI Agents

1. **Version:** Use mypy 1.10.x (latest stable)
2. **Stubs:** Match stub versions to Django/DRF versions
3. **Python version:** Must match across all tools
4. **mypy.ini:** Preferred for full configuration
5. **types-* packages:** Add as needed for third-party libs
6. **ext package:** django-stubs-ext required for plugin
