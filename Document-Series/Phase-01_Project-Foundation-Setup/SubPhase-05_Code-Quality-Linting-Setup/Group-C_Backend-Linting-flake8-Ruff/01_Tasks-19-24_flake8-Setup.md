# Tasks 19-24: flake8 Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** C - Backend Linting - flake8/Ruff  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Backend-Import-Sorting-isort/02_Tasks-15-18_isort-Configuration.md](../Group-B_Backend-Import-Sorting-isort/02_Tasks-15-18_isort-Configuration.md)
- **→ Next Document:** [02_Tasks-25-28_Ruff-Setup.md](02_Tasks-25-28_Ruff-Setup.md)

---

## Document Overview

This document covers installing flake8 with plugins and creating the configuration file.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Install flake8 | Simple |
| 20 | Install flake8 Plugins | Simple |
| 21 | Create .flake8 Configuration | Medium |
| 22 | Configure Max Line Length | Simple |
| 23 | Configure Ignore Patterns | Simple |
| 24 | Configure Exclude Patterns | Simple |

---

## Task 19: Install flake8

### Overview
Install flake8 as a development dependency for Python linting.

### Dependencies
- Task 01: Black installed (Group A)

### Instructions

1. **Add flake8 to dev dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check version

### Installation Method

Using pip (requirements-dev.txt):
```
flake8>=7.0.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
flake8 = "^7.0.0"
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| flake8 | >=7.0.0 | Python linter |

### Verification

```bash
# Check installation
flake8 --version

# Expected output
7.x.x (mccabe: x.x.x, pycodestyle: x.x.x, pyflakes: x.x.x)
```

### Expected Outcome
- flake8 installed
- Version 7.x available

### Verification Checklist
- [ ] flake8 in requirements-dev.txt
- [ ] Package installed
- [ ] Version verified

---

## Task 20: Install flake8 Plugins

### Overview
Install useful flake8 plugins for enhanced linting.

### Dependencies
- Task 19: flake8 installed

### Instructions

1. **Add essential plugins**
   - bugbear, comprehensions

2. **Install plugins**
   - Using pip or poetry

3. **Verify plugins**
   - Check flake8 recognizes them

### Plugins to Install

Add to requirements-dev.txt:
```
flake8-bugbear>=24.0.0
flake8-comprehensions>=3.14.0
flake8-simplify>=0.21.0
```

### Plugin Descriptions

| Plugin | Code | Purpose |
|--------|------|---------|
| flake8-bugbear | B | Find likely bugs and design problems |
| flake8-comprehensions | C4 | Better list/dict/set comprehensions |
| flake8-simplify | SIM | Simplify Python code |

### Bugbear Examples

| Code | Issue |
|------|-------|
| B006 | Mutable default argument |
| B008 | Function call in default argument |
| B009 | Getattr with constant attribute |

### Comprehensions Examples

| Code | Issue |
|------|-------|
| C400 | Unnecessary generator in list() |
| C401 | Unnecessary generator in set() |
| C408 | Unnecessary dict call - rewrite as literal |

### Verification

```bash
# Check flake8 plugins
flake8 --version

# Should show additional plugins
# mccabe, pycodestyle, pyflakes, flake8-bugbear, flake8-comprehensions
```

### Expected Outcome
- Essential plugins installed
- flake8 recognizes plugins

### Verification Checklist
- [ ] flake8-bugbear installed
- [ ] flake8-comprehensions installed
- [ ] flake8-simplify installed
- [ ] Plugins appear in version output

---

## Task 21: Create .flake8 Configuration

### Overview
Create .flake8 configuration file in backend directory.

### Dependencies
- Task 19: flake8 installed

### Instructions

1. **Create .flake8 file**
   - In backend/ directory

2. **Add header comments**
   - Document purpose

3. **Structure configuration**
   - Section-based

### File Location

```
backend/
└── .flake8
```

### Initial .flake8

```ini
# ==================================================
# LankaCommerce Cloud - flake8 Configuration
# ==================================================
# Purpose: Python linting configuration
# Compatibility: Black formatter
# ==================================================

[flake8]
# Configuration settings will be added in subsequent tasks
```

### Why .flake8 (not pyproject.toml)

| Reason | Explanation |
|--------|-------------|
| Native format | flake8 uses .flake8 or setup.cfg |
| Plugin support | All plugins read .flake8 |
| Separation | Keeps pyproject.toml cleaner |

### Expected Outcome
- .flake8 file created
- Ready for configuration

### Verification Checklist
- [ ] File created in backend/
- [ ] Header comments added
- [ ] [flake8] section present

---

## Task 22: Configure Max Line Length

### Overview
Configure maximum line length to match Black formatter.

### Dependencies
- Task 21: .flake8 file exists

### Instructions

1. **Set max-line-length**
   - Match Black (88)

2. **Document setting**
   - Comment explains why

### Configuration Addition

```ini
[flake8]
# Line length (must match Black's 88)
max-line-length = 88
```

### Black Compatibility

| Tool | Line Length |
|------|-------------|
| Black | 88 |
| flake8 | 88 (matching) |
| isort | 88 (matching) |

### Why 88

| Reason | Benefit |
|--------|---------|
| Black default | No conflicts |
| Research-based | Optimal readability |
| Side-by-side | Fits in split editors |

### McCabe Complexity

Add complexity limit:
```ini
[flake8]
max-line-length = 88

# McCabe complexity threshold
max-complexity = 10
```

### Expected Outcome
- Line length set to 88
- Matches Black configuration

### Verification Checklist
- [ ] max-line-length = 88
- [ ] max-complexity = 10
- [ ] Comments explain settings

---

## Task 23: Configure Ignore Patterns

### Overview
Configure error codes to ignore for Black compatibility.

### Dependencies
- Task 21: .flake8 file exists

### Instructions

1. **Identify Black conflicts**
   - E203, E266, E501, W503

2. **Add extend-ignore**
   - List of ignored codes

3. **Configure per-file-ignores**
   - __init__.py exceptions

### Configuration Addition

```ini
[flake8]
max-line-length = 88
max-complexity = 10

# Ignore codes that conflict with Black
extend-ignore =
    # Whitespace before ':' (Black handles this)
    E203,
    # Too many leading '#' for block comment
    E266,
    # Line too long (Black handles this)
    E501,
    # Line break before binary operator (Black prefers this)
    W503,

# Per-file ignores
per-file-ignores =
    # Allow unused imports in __init__.py (re-exports)
    __init__.py:F401
```

### Ignored Codes Explained

| Code | Description | Reason |
|------|-------------|--------|
| E203 | Whitespace before ':' | Black does `a[1 : 2]` |
| E266 | Too many # in comment | Style preference |
| E501 | Line too long | Black handles this |
| W503 | Line break before operator | Black's style |

### Per-file Ignores

| File | Code | Reason |
|------|------|--------|
| __init__.py | F401 | Re-exports are common |

### F401 Example

```python
# __init__.py
from .models import User, Product  # F401: imported but unused
# These are re-exports for convenience, not unused
```

### Expected Outcome
- Black conflicts ignored
- Clean linting output

### Verification Checklist
- [ ] extend-ignore configured
- [ ] E203, E266, E501, W503 ignored
- [ ] per-file-ignores for __init__.py

---

## Task 24: Configure Exclude Patterns

### Overview
Configure directories that flake8 should skip.

### Dependencies
- Task 21: .flake8 file exists

### Instructions

1. **Identify exclude directories**
   - Migrations, venv, cache

2. **Add exclude option**
   - List of patterns

3. **Match Black and isort**
   - Consistency

### Configuration Addition

```ini
[flake8]
max-line-length = 88
max-complexity = 10

extend-ignore =
    E203,
    E266,
    E501,
    W503,

per-file-ignores =
    __init__.py:F401

# Exclude directories from linting
exclude =
    # Version control
    .git,
    # Virtual environments
    .venv,
    venv,
    env,
    # Cache directories
    __pycache__,
    .pytest_cache,
    .mypy_cache,
    # Build outputs
    build,
    dist,
    *.egg-info,
    # Django generated
    migrations,
    # IDE directories
    .idea,
    .vscode,
```

### Matching Other Tools

| Tool | Exclusions |
|------|------------|
| Black | extend-exclude in pyproject.toml |
| isort | skip in pyproject.toml |
| flake8 | exclude in .flake8 |

All tools skip the same directories.

### Add Makefile Commands

```makefile
# ==================================================
# Linting
# ==================================================

.PHONY: lint
lint:
	@echo "Running flake8..."
	flake8 .
	@echo "Linting complete!"

.PHONY: lint-stats
lint-stats:
	@echo "Linting statistics..."
	flake8 --statistics .
```

### Expected Outcome
- All cache directories excluded
- Migrations excluded
- Virtual environments excluded

### Verification Checklist
- [ ] exclude configured
- [ ] Migrations excluded
- [ ] Virtual envs excluded
- [ ] Matches Black/isort

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Install flake8 | Development dependency |
| 20 | Install flake8 Plugins | bugbear, comprehensions |
| 21 | Create .flake8 Configuration | Configuration file |
| 22 | Configure Max Line Length | 88 characters |
| 23 | Configure Ignore Patterns | Black compatibility |
| 24 | Configure Exclude Patterns | Skip migrations, venv |

### Complete .flake8

```ini
# ==================================================
# LankaCommerce Cloud - flake8 Configuration
# ==================================================
# Purpose: Python linting configuration
# Compatibility: Black formatter
# ==================================================

[flake8]
# Line length (must match Black's 88)
max-line-length = 88

# McCabe complexity threshold
max-complexity = 10

# Ignore codes that conflict with Black
extend-ignore =
    E203,
    E266,
    E501,
    W503,

# Per-file ignores
per-file-ignores =
    __init__.py:F401

# Exclude directories from linting
exclude =
    .git,
    .venv,
    venv,
    env,
    __pycache__,
    .pytest_cache,
    .mypy_cache,
    build,
    dist,
    *.egg-info,
    migrations,
    .idea,
    .vscode,
```

### Makefile Commands Added

| Command | Purpose |
|---------|---------|
| `make lint` | Run flake8 |
| `make lint-stats` | Show statistics |

### Next Steps
Proceed to [02_Tasks-25-28_Ruff-Setup.md](02_Tasks-25-28_Ruff-Setup.md) for Ruff linter configuration.

---

## Notes for AI Agents

1. **Version:** Use flake8 7.x (latest stable)
2. **Plugins:** Essential: bugbear, comprehensions
3. **Line length:** Must match Black (88)
4. **Ignore:** E203, E266, E501, W503 for Black
5. **Exclude:** Match Black and isort patterns
6. **File:** Use .flake8, not pyproject.toml
7. **Complexity:** 10 is good starting point
