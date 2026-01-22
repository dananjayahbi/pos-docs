# Tasks 69-74: Pre-commit Python

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** G - Pre-commit Hooks Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Frontend-Formatting-Prettier/02_Tasks-63-68_Prettier-Configuration.md](../Group-F_Frontend-Formatting-Prettier/02_Tasks-63-68_Prettier-Configuration.md)
- **→ Next Document:** [02_Tasks-75-77_Precommit-Utility.md](02_Tasks-75-77_Precommit-Utility.md)

---

## Document Overview

This document covers installing pre-commit framework and adding Python quality hooks.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 69 | Install pre-commit | Simple |
| 70 | Create .pre-commit-config.yaml | Medium |
| 71 | Add Black Hook | Simple |
| 72 | Add isort Hook | Simple |
| 73 | Add flake8 Hook | Simple |
| 74 | Add mypy Hook | Simple |

---

## Task 69: Install pre-commit

### Overview
Install pre-commit framework as a development dependency.

### Dependencies
- Task 01: Black installed (Group A)

### Instructions

1. **Add pre-commit to dev dependencies**
   - In requirements-dev.txt

2. **Install the package**
   - Using pip

3. **Verify installation**
   - Check version

### Installation Method

Add to requirements-dev.txt:
```
pre-commit>=3.7.0
```

Install:
```bash
pip install pre-commit
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| pre-commit | >=3.7.0 | Git hooks framework |

### Verification

```bash
# Check installation
pre-commit --version

# Expected output
pre-commit 3.x.x
```

### What pre-commit Does

| Feature | Description |
|---------|-------------|
| Hooks | Runs before git commit |
| Multi-language | Python, JS, Shell, etc. |
| Caching | Fast repeated runs |
| Configuration | YAML-based |

### Expected Outcome
- pre-commit installed
- Framework ready

### Verification Checklist
- [ ] pre-commit in requirements-dev.txt
- [ ] Package installed
- [ ] CLI works

---

## Task 70: Create .pre-commit-config.yaml

### Overview
Create pre-commit configuration file at repository root.

### Dependencies
- Task 69: pre-commit installed

### Instructions

1. **Create config file**
   - At repository root

2. **Add base structure**
   - repos, default_stages

3. **Document purpose**
   - Header comments

### File Location

```
/                               # Repository root
├── .pre-commit-config.yaml     # Pre-commit config
├── backend/
└── frontend/
```

### Initial .pre-commit-config.yaml

```yaml
# ==================================================
# LankaCommerce Cloud - Pre-commit Configuration
# ==================================================
# Purpose: Automated code quality checks before commits
# ==================================================

# Default stages to run hooks
default_stages: [commit]

# Fail fast - stop on first failure
fail_fast: false

# Hook repositories
repos:
  # Python hooks will be added below
```

### Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| default_stages | [commit] | When to run |
| fail_fast | false | Continue on failure |
| repos | list | Hook definitions |

### Why Repository Root

Pre-commit runs at repository level:
- Covers all directories
- Single configuration
- Works with monorepo

### Expected Outcome
- Config file created
- Ready for hooks

### Verification Checklist
- [ ] File at repository root
- [ ] Valid YAML syntax
- [ ] Base structure present

---

## Task 71: Add Black Hook

### Overview
Add Black formatter hook to pre-commit configuration.

### Dependencies
- Task 70: .pre-commit-config.yaml exists

### Instructions

1. **Add Black repository**
   - Use official mirror

2. **Configure hook**
   - Set version, files

3. **Backend files only**
   - Python files

### Configuration Addition

```yaml
repos:
  # Black - Python formatter
  - repo: https://github.com/psf/black
    rev: 24.4.2  # Use latest stable
    hooks:
      - id: black
        name: black
        description: Format Python code with Black
        language_version: python3.12
        files: ^backend/
        args: ['--config', 'backend/pyproject.toml']
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| repo | psf/black | Official repository |
| rev | 24.4.2 | Version to use |
| files | ^backend/ | Only backend directory |
| args | --config | Use project config |

### Alternative: Local Hook

Can use locally installed Black:
```yaml
- repo: local
  hooks:
    - id: black
      name: black
      entry: black
      language: system
      types: [python]
      files: ^backend/
```

### Expected Outcome
- Black runs on commit
- Backend files formatted

### Verification Checklist
- [ ] Black hook added
- [ ] Correct version
- [ ] Files pattern correct
- [ ] Config path correct

---

## Task 72: Add isort Hook

### Overview
Add isort import sorting hook to pre-commit configuration.

### Dependencies
- Task 70: .pre-commit-config.yaml exists

### Instructions

1. **Add isort repository**
   - Use official mirror

2. **Configure hook**
   - Set version, files

3. **Black profile**
   - Ensure compatibility

### Configuration Addition

```yaml
  # isort - Python import sorting
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2  # Use latest stable
    hooks:
      - id: isort
        name: isort
        description: Sort Python imports
        files: ^backend/
        args: ['--settings-path', 'backend/pyproject.toml']
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| repo | pycqa/isort | Official repository |
| rev | 5.13.2 | Version to use |
| files | ^backend/ | Only backend directory |
| args | --settings-path | Use project config |

### Order Matters

isort should run before Black:
```yaml
repos:
  - repo: https://github.com/pycqa/isort  # First
    ...
  - repo: https://github.com/psf/black    # Second
    ...
```

### Expected Outcome
- isort runs on commit
- Imports sorted

### Verification Checklist
- [ ] isort hook added
- [ ] Runs before Black
- [ ] Settings path correct
- [ ] Files pattern correct

---

## Task 73: Add flake8 Hook

### Overview
Add flake8 linting hook to pre-commit configuration.

### Dependencies
- Task 70: .pre-commit-config.yaml exists

### Instructions

1. **Add flake8 repository**
   - Use official mirror

2. **Configure hook**
   - Set version, files

3. **Add plugins**
   - Additional dependencies

### Configuration Addition

```yaml
  # flake8 - Python linting
  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0  # Use latest stable
    hooks:
      - id: flake8
        name: flake8
        description: Check Python code with flake8
        files: ^backend/
        args: ['--config', 'backend/.flake8']
        additional_dependencies:
          - flake8-bugbear>=24.0.0
          - flake8-comprehensions>=3.14.0
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| repo | pycqa/flake8 | Official repository |
| rev | 7.0.0 | Version to use |
| additional_dependencies | list | Plugins to install |

### Plugins

| Plugin | Purpose |
|--------|---------|
| flake8-bugbear | Bug detection |
| flake8-comprehensions | Better comprehensions |

### Alternative: Use Ruff

Can use Ruff instead (faster):
```yaml
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.0
    hooks:
      - id: ruff
        files: ^backend/
        args: ['--fix']
      - id: ruff-format
        files: ^backend/
```

### Expected Outcome
- flake8 runs on commit
- Lint errors caught

### Verification Checklist
- [ ] flake8 hook added
- [ ] Plugins included
- [ ] Config path correct
- [ ] Files pattern correct

---

## Task 74: Add mypy Hook

### Overview
Add mypy type checking hook to pre-commit configuration.

### Dependencies
- Task 70: .pre-commit-config.yaml exists

### Instructions

1. **Add mypy repository**
   - Use mirrors-mypy

2. **Configure hook**
   - Set version, files

3. **Add stubs**
   - Django, DRF dependencies

### Configuration Addition

```yaml
  # mypy - Python type checking
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.10.0  # Use latest stable
    hooks:
      - id: mypy
        name: mypy
        description: Check Python types with mypy
        files: ^backend/
        args: ['--config-file', 'backend/mypy.ini']
        additional_dependencies:
          - django-stubs>=5.0.0
          - djangorestframework-stubs>=3.14.0
          - types-redis>=4.6.0
          - types-celery>=5.3.0
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| repo | mirrors-mypy | Pre-commit mirror |
| additional_dependencies | list | Type stubs |

### Required Stubs

| Package | Purpose |
|---------|---------|
| django-stubs | Django types |
| djangorestframework-stubs | DRF types |
| types-redis | Redis types |
| types-celery | Celery types |

### Performance Note

mypy can be slow on large codebases. Options:
- Run only on changed files (default)
- Skip in pre-commit, run in CI
- Use cached results

### Alternative: Skip in Pre-commit

If too slow, run in CI only:
```yaml
- id: mypy
  stages: [manual]  # Only run manually
```

### Expected Outcome
- mypy runs on commit
- Type errors caught

### Verification Checklist
- [ ] mypy hook added
- [ ] All stubs included
- [ ] Config path correct
- [ ] Files pattern correct

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 69 | Install pre-commit | Framework installed |
| 70 | Create .pre-commit-config.yaml | Configuration file |
| 71 | Add Black Hook | Formatting hook |
| 72 | Add isort Hook | Import sorting hook |
| 73 | Add flake8 Hook | Linting hook |
| 74 | Add mypy Hook | Type checking hook |

### .pre-commit-config.yaml Progress

```yaml
# ==================================================
# LankaCommerce Cloud - Pre-commit Configuration
# ==================================================

default_stages: [commit]
fail_fast: false

repos:
  # isort - Import sorting
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        files: ^backend/
        args: ['--settings-path', 'backend/pyproject.toml']

  # Black - Formatting
  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black
        files: ^backend/
        args: ['--config', 'backend/pyproject.toml']

  # flake8 - Linting
  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        files: ^backend/
        args: ['--config', 'backend/.flake8']
        additional_dependencies:
          - flake8-bugbear>=24.0.0
          - flake8-comprehensions>=3.14.0

  # mypy - Type checking
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.10.0
    hooks:
      - id: mypy
        files: ^backend/
        args: ['--config-file', 'backend/mypy.ini']
        additional_dependencies:
          - django-stubs>=5.0.0
          - djangorestframework-stubs>=3.14.0
```

### Next Steps
Proceed to [02_Tasks-75-77_Precommit-Utility.md](02_Tasks-75-77_Precommit-Utility.md) for utility hooks.

---

## Notes for AI Agents

1. **Repository root:** Config at root level
2. **Order:** isort → Black → flake8 → mypy
3. **Files pattern:** Use ^backend/ for Python
4. **Versions:** Use latest stable versions
5. **Stubs:** Include all required type stubs
6. **Performance:** mypy may be slow; consider CI only
