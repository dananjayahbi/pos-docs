# Tasks 01-04: Black Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** A - Backend Formatter Setup - Black  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous SubPhase:** [../../SubPhase-04_Docker-Development-Environment/Group-H_Development-Scripts-Verification/02_Tasks-86-89_Verification.md](../../SubPhase-04_Docker-Development-Environment/Group-H_Development-Scripts-Verification/02_Tasks-86-89_Verification.md)
- **→ Next Document:** [02_Tasks-05-07_Black-Patterns-Scripts.md](02_Tasks-05-07_Black-Patterns-Scripts.md)

---

## Document Overview

This document covers installing Black code formatter and creating the initial configuration in pyproject.toml.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install Black | Simple |
| 02 | Create pyproject.toml | Medium |
| 03 | Configure Line Length | Simple |
| 04 | Configure Target Python Version | Simple |

---

## Task 01: Install Black

### Overview
Install Black as a development dependency for the Python backend.

### Dependencies
- SubPhase-02: Backend Project Initialization

### Instructions

1. **Add Black to dev dependencies**
   - In requirements-dev.txt or pyproject.toml

2. **Install the package**
   - Using pip or poetry

3. **Verify installation**
   - Check version

### Installation Method

Using pip (requirements-dev.txt):
```
black>=24.0.0
```

Using poetry:
```toml
[tool.poetry.group.dev.dependencies]
black = "^24.0.0"
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| black | >=24.0.0 | Python formatter |

### Verification

```bash
# Check installation
black --version

# Expected output
black, 24.x.x
```

### Docker Consideration

Black is installed in development Dockerfile:
- Included in requirements-dev.txt
- Available in container

### Expected Outcome
- Black installed
- Version 24.x available

### Verification Checklist
- [ ] Black in requirements-dev.txt
- [ ] Package installed
- [ ] Version verified

---

## Task 02: Create pyproject.toml

### Overview
Create or update pyproject.toml with Black configuration section.

### Dependencies
- Task 01: Install Black

### Instructions

1. **Create pyproject.toml**
   - In backend/ directory

2. **Add tool.black section**
   - Configuration block

3. **Document purpose**
   - Header comments

### File Location

```
backend/
└── pyproject.toml
```

### Initial pyproject.toml

```toml
# ==================================================
# LankaCommerce Cloud - Python Project Configuration
# ==================================================
# Purpose: Configuration for Python tools
# Tools: Black, isort, mypy, pytest
# ==================================================

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "lankacommerce-backend"
version = "0.1.0"
description = "LankaCommerce Cloud ERP Backend"
readme = "README.md"
requires-python = ">=3.12"

[tool.black]
# Black formatter configuration
# Settings will be added in subsequent tasks
```

### Why pyproject.toml

| Benefit | Description |
|---------|-------------|
| Standard | PEP 518 standard |
| Unified | All tools in one file |
| Modern | Preferred over setup.cfg |
| Portable | Works across environments |

### Expected Outcome
- pyproject.toml created
- tool.black section added

### Verification Checklist
- [ ] File created in backend/
- [ ] Build system defined
- [ ] Project metadata added
- [ ] tool.black section present

---

## Task 03: Configure Line Length

### Overview
Configure the maximum line length for Black formatting.

### Dependencies
- Task 02: Create pyproject.toml

### Instructions

1. **Set line-length**
   - Use Black's default 88

2. **Document choice**
   - Why 88 characters

3. **Update configuration**
   - In tool.black section

### Configuration Addition

```toml
[tool.black]
# Line length (88 is Black's default)
# 10% shorter than 99, which allows for more side-by-side viewing
line-length = 88
```

### Why 88 Characters

| Reason | Benefit |
|--------|---------|
| Research-based | Optimal readability |
| Side-by-side | Fits in split editors |
| Git diffs | Better diff viewing |
| Default | No debates needed |

### Line Length Comparison

| Standard | Length | Tool |
|----------|--------|------|
| PEP 8 | 79 | Historical |
| Extended | 99-100 | Common |
| Black | 88 | Recommended |

### Expected Outcome
- Line length set to 88
- Documented in comments

### Verification Checklist
- [ ] line-length = 88 added
- [ ] Comment explains choice
- [ ] Consistent with project style

---

## Task 04: Configure Target Python Version

### Overview
Configure the target Python version for Black to use proper syntax.

### Dependencies
- Task 02: Create pyproject.toml

### Instructions

1. **Set target-version**
   - Python 3.12

2. **Use list format**
   - For flexibility

3. **Document version**
   - Match project Python

### Configuration Addition

```toml
[tool.black]
line-length = 88

# Target Python version (must match project Python version)
target-version = ['py312']
```

### Target Version Effects

| Feature | Effect |
|---------|--------|
| Syntax | Uses 3.12 syntax |
| Type hints | Modern annotations |
| f-strings | Full support |
| Match | Pattern matching |

### Available Targets

| Target | Python Version |
|--------|----------------|
| py39 | 3.9 |
| py310 | 3.10 |
| py311 | 3.11 |
| py312 | 3.12 |

### Matching Project Python

From Dockerfile:
```dockerfile
FROM python:3.12-slim
```

Target must match:
```toml
target-version = ['py312']
```

### Expected Outcome
- Target version set
- Matches project Python

### Verification Checklist
- [ ] target-version = ['py312']
- [ ] Matches Dockerfile
- [ ] Comment explains

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Install Black | Development dependency |
| 02 | Create pyproject.toml | Configuration file |
| 03 | Configure Line Length | 88 characters |
| 04 | Configure Target Python Version | Python 3.12 |

### pyproject.toml Progress

```toml
# ==================================================
# LankaCommerce Cloud - Python Project Configuration
# ==================================================

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "lankacommerce-backend"
version = "0.1.0"
description = "LankaCommerce Cloud ERP Backend"
readme = "README.md"
requires-python = ">=3.12"

[tool.black]
# Line length (88 is Black's default)
line-length = 88

# Target Python version
target-version = ['py312']
```

### Next Steps
Proceed to [02_Tasks-05-07_Black-Patterns-Scripts.md](02_Tasks-05-07_Black-Patterns-Scripts.md) for include/exclude patterns and Makefile script.

---

## Notes for AI Agents

1. **Version:** Use Black 24.x (latest stable)
2. **Line length:** 88 is non-negotiable with Black
3. **Target:** Match Dockerfile Python version
4. **pyproject.toml:** Standard configuration location
5. **Dependencies:** requirements-dev.txt or poetry
6. **Git:** Do NOT commit yet - complete Group A first
