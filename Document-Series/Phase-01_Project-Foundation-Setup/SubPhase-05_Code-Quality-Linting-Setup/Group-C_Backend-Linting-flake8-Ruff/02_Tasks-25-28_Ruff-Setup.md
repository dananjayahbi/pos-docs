# Tasks 25-28: Ruff Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** C - Backend Linting - flake8/Ruff  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_flake8-Setup.md](01_Tasks-19-24_flake8-Setup.md)
- **→ Next Document:** [03_Tasks-29-30_Lint-Verification.md](03_Tasks-29-30_Lint-Verification.md)

---

## Document Overview

This document covers installing Ruff and configuring it in pyproject.toml.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Install Ruff | Simple |
| 26 | Configure Ruff in pyproject.toml | Medium |
| 27 | Configure Ruff Rules | Medium |
| 28 | Configure Ruff Ignore | Simple |

---

## Task 25: Install Ruff

### Overview
Install Ruff as a fast alternative to flake8.

### Dependencies
- Task 01: Black installed (Group A)

### Instructions

1. **Add Ruff to dev dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check version

### Installation Method

Using pip (requirements-dev.txt):
```
ruff>=0.5.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
ruff = "^0.5.0"
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| ruff | >=0.5.0 | Fast Python linter |

### Verification

```bash
# Check installation
ruff --version

# Expected output
ruff 0.5.x
```

### Why Ruff

| Feature | Benefit |
|---------|---------|
| 10-100x faster | Instant feedback |
| Rust-based | Native performance |
| All-in-one | Replaces multiple tools |
| pyproject.toml | Native configuration |

### Ruff vs flake8

| Aspect | Ruff | flake8 |
|--------|------|--------|
| Speed | 10-100x faster | Standard |
| Configuration | pyproject.toml | .flake8 |
| Plugin ecosystem | Built-in rules | External plugins |
| Active development | Very active | Stable/mature |

### Expected Outcome
- Ruff installed
- Latest version available

### Verification Checklist
- [ ] ruff in requirements-dev.txt
- [ ] Package installed
- [ ] Version verified

---

## Task 26: Configure Ruff in pyproject.toml

### Overview
Add Ruff configuration section to pyproject.toml.

### Dependencies
- Task 02: pyproject.toml exists (Group A)
- Task 25: Ruff installed

### Instructions

1. **Add tool.ruff section**
   - After tool.isort section

2. **Set basic options**
   - Target version, line length

3. **Document purpose**
   - Header comments

### Configuration Addition

```toml
# ==================================================
# Ruff Configuration (Fast Python Linter)
# ==================================================
[tool.ruff]
# Target Python version
target-version = "py312"

# Line length (must match Black)
line-length = 88

# Fix auto-fixable issues
fix = true

# Show fixes in output
show-fixes = true
```

### Placement in pyproject.toml

```toml
[tool.black]
# ... Black settings ...

[tool.isort]
# ... isort settings ...

[tool.ruff]
# ... Ruff settings (this section) ...
```

### Basic Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| target-version | "py312" | Python syntax level |
| line-length | 88 | Match Black |
| fix | true | Auto-fix issues |
| show-fixes | true | Show what was fixed |

### Expected Outcome
- tool.ruff section added
- Basic options configured

### Verification Checklist
- [ ] Section added to pyproject.toml
- [ ] target-version = "py312"
- [ ] line-length = 88

---

## Task 27: Configure Ruff Rules

### Overview
Configure which linting rules Ruff should check.

### Dependencies
- Task 26: tool.ruff section exists

### Instructions

1. **Define select rules**
   - Error, warning, style codes

2. **Use ruff.lint section**
   - Lint-specific settings

3. **Document each rule set**
   - Comments explain

### Configuration Addition

```toml
[tool.ruff.lint]
# Select linting rules
# See: https://docs.astral.sh/ruff/rules/
select = [
    # Pyflakes (F) - Error detection
    "F",
    # pycodestyle Errors (E)
    "E",
    # pycodestyle Warnings (W)
    "W",
    # isort (I) - Import sorting
    "I",
    # flake8-bugbear (B) - Bug detection
    "B",
    # flake8-comprehensions (C4) - Comprehension improvements
    "C4",
    # pyupgrade (UP) - Upgrade syntax
    "UP",
    # flake8-simplify (SIM) - Simplifications
    "SIM",
    # Pylint (PL) - Selected pylint rules
    "PLC",
    "PLE",
    "PLR",
    "PLW",
]
```

### Rule Sets Explained

| Code | Source | Purpose |
|------|--------|---------|
| F | Pyflakes | Undefined names, unused imports |
| E | pycodestyle | PEP 8 errors |
| W | pycodestyle | PEP 8 warnings |
| I | isort | Import sorting |
| B | flake8-bugbear | Bug patterns |
| C4 | flake8-comprehensions | Comprehension style |
| UP | pyupgrade | Modern Python syntax |
| SIM | flake8-simplify | Code simplification |
| PLC/E/R/W | Pylint | Convention, error, refactor, warning |

### Example Violations

| Code | Issue |
|------|-------|
| F401 | Unused import |
| F841 | Unused variable |
| E501 | Line too long |
| B006 | Mutable default argument |
| UP035 | Replace typing.Dict with dict |
| SIM118 | Use key in dict instead of key in dict.keys() |

### Expected Outcome
- Comprehensive rule selection
- Bug detection enabled

### Verification Checklist
- [ ] F, E, W rules enabled
- [ ] B, C4 rules enabled
- [ ] UP, SIM rules enabled
- [ ] PL rules enabled

---

## Task 28: Configure Ruff Ignore

### Overview
Configure which rules to ignore for Black compatibility.

### Dependencies
- Task 26: tool.ruff section exists

### Instructions

1. **Define ignore rules**
   - Black conflicts

2. **Configure per-file-ignores**
   - __init__.py exceptions

3. **Configure exclude patterns**
   - Migrations, venv

### Configuration Addition

```toml
[tool.ruff.lint]
select = [
    "F", "E", "W", "I", "B", "C4", "UP", "SIM",
    "PLC", "PLE", "PLR", "PLW",
]

# Ignore rules that conflict with Black or are too strict
ignore = [
    # Line too long (Black handles this)
    "E501",
    # Too many arguments
    "PLR0913",
    # Too many statements
    "PLR0915",
    # Magic value comparison
    "PLR2004",
]

# Per-file ignores
per-file-ignores = {"__init__.py" = ["F401", "F403"]}

# Allow certain confusables
allowed-confusables = ["'", "'"]

[tool.ruff.lint.isort]
# Known first party packages (mirror isort config)
known-first-party = ["apps", "config", "core", "utils"]
```

### Ignored Rules Explained

| Code | Description | Reason |
|------|-------------|--------|
| E501 | Line too long | Black handles this |
| PLR0913 | Too many arguments | Django views need many |
| PLR0915 | Too many statements | Long functions sometimes needed |
| PLR2004 | Magic value | Too many false positives |

### Per-file Ignores

| File | Codes | Reason |
|------|-------|--------|
| __init__.py | F401 | Re-exports |
| __init__.py | F403 | Import star |

### Exclude Configuration

```toml
[tool.ruff]
target-version = "py312"
line-length = 88
fix = true
show-fixes = true

# Exclude directories
exclude = [
    ".git",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "build",
    "dist",
    "*.egg-info",
    "migrations",
    ".idea",
    ".vscode",
]
```

### Add Makefile Commands

```makefile
# ==================================================
# Ruff Linting
# ==================================================

.PHONY: ruff
ruff:
	@echo "Running Ruff..."
	ruff check .
	@echo "Ruff check complete!"

.PHONY: ruff-fix
ruff-fix:
	@echo "Running Ruff with auto-fix..."
	ruff check --fix .
	@echo "Ruff fix complete!"
```

### Expected Outcome
- Black conflicts ignored
- __init__.py exceptions
- Excluded directories set

### Verification Checklist
- [ ] E501 ignored
- [ ] per-file-ignores configured
- [ ] exclude patterns set
- [ ] isort settings mirrored

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Install Ruff | Development dependency |
| 26 | Configure Ruff in pyproject.toml | Basic settings |
| 27 | Configure Ruff Rules | Comprehensive selection |
| 28 | Configure Ruff Ignore | Black compatibility |

### Complete pyproject.toml [tool.ruff]

```toml
# ==================================================
# Ruff Configuration (Fast Python Linter)
# ==================================================
[tool.ruff]
# Target Python version
target-version = "py312"

# Line length (must match Black)
line-length = 88

# Fix auto-fixable issues
fix = true

# Show fixes in output
show-fixes = true

# Exclude directories
exclude = [
    ".git",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "build",
    "dist",
    "*.egg-info",
    "migrations",
    ".idea",
    ".vscode",
]

[tool.ruff.lint]
# Select linting rules
select = [
    "F",    # Pyflakes
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "I",    # isort
    "B",    # flake8-bugbear
    "C4",   # flake8-comprehensions
    "UP",   # pyupgrade
    "SIM",  # flake8-simplify
    "PLC",  # Pylint conventions
    "PLE",  # Pylint errors
    "PLR",  # Pylint refactor
    "PLW",  # Pylint warnings
]

# Ignore rules
ignore = [
    "E501",     # Line too long (Black handles)
    "PLR0913",  # Too many arguments
    "PLR0915",  # Too many statements
    "PLR2004",  # Magic value comparison
]

# Per-file ignores
per-file-ignores = {"__init__.py" = ["F401", "F403"]}

[tool.ruff.lint.isort]
known-first-party = ["apps", "config", "core", "utils"]
```

### Makefile Commands Added

| Command | Purpose |
|---------|---------|
| `make ruff` | Run Ruff check |
| `make ruff-fix` | Auto-fix issues |

### Next Steps
Proceed to [03_Tasks-29-30_Lint-Verification.md](03_Tasks-29-30_Lint-Verification.md) for running initial lint check.

---

## Notes for AI Agents

1. **Ruff version:** Use 0.5.x (latest stable)
2. **Target version:** Match Python 3.12
3. **Line length:** Must match Black (88)
4. **Rules:** Start comprehensive, ignore later
5. **Ignore E501:** Black handles line length
6. **Exclude:** Match Black, isort, flake8 patterns
7. **isort section:** Mirror isort known_first_party
