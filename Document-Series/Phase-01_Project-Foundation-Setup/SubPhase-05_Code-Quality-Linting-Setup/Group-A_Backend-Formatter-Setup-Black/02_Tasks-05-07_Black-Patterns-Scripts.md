# Tasks 05-07: Black Patterns and Scripts

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** A - Backend Formatter Setup - Black  
> **Document:** 02 of 03  
> **Tasks Covered:** 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Black-Installation.md](01_Tasks-01-04_Black-Installation.md)
- **→ Next Document:** [03_Tasks-08-10_Black-Verification.md](03_Tasks-08-10_Black-Verification.md)

---

## Document Overview

This document covers configuring include/exclude patterns and creating Makefile format scripts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Configure Include Patterns | Simple |
| 06 | Configure Exclude Patterns | Medium |
| 07 | Add Makefile Format Script | Simple |

---

## Task 05: Configure Include Patterns

### Overview
Configure which file patterns Black should format.

### Dependencies
- Task 02: Create pyproject.toml

### Instructions

1. **Define include pattern**
   - Python file extensions

2. **Use regex format**
   - Black's include syntax

3. **Add to configuration**
   - In tool.black section

### Configuration Addition

```toml
[tool.black]
line-length = 88
target-version = ['py312']

# Include pattern (Python files only)
include = '\.pyi?$'
```

### Include Pattern Explanation

| Pattern | Matches |
|---------|---------|
| `\.py$` | .py files |
| `\.pyi$` | .pyi stub files |
| `\.pyi?$` | Both .py and .pyi |

### Why Include Pattern

| Benefit | Description |
|---------|-------------|
| Explicit | Clear intent |
| Stubs | Type stub support |
| Filter | Skip non-Python |

### Expected Outcome
- Include pattern configured
- Matches Python files

### Verification Checklist
- [ ] Include pattern added
- [ ] Regex correct
- [ ] Documented in config

---

## Task 06: Configure Exclude Patterns

### Overview
Configure directories and files Black should ignore.

### Dependencies
- Task 02: Create pyproject.toml

### Instructions

1. **Identify excluded paths**
   - Migrations, venv, cache

2. **Build exclude pattern**
   - Regex format

3. **Add to configuration**
   - Comprehensive exclusions

### Configuration Addition

```toml
[tool.black]
line-length = 88
target-version = ['py312']
include = '\.pyi?$'

# Exclude patterns
# Using regex to match directories and files to skip
extend-exclude = '''
/(
    # Version control
    \.git
    | \.hg
    
    # Virtual environments
    | \.venv
    | venv
    | env
    
    # Cache directories
    | __pycache__
    | \.pytest_cache
    | \.mypy_cache
    
    # Build outputs
    | build
    | dist
    | \.eggs
    | .*\.egg-info
    
    # Django generated files
    | migrations
    
    # IDE directories
    | \.idea
    | \.vscode
    
    # Coverage reports
    | htmlcov
    | \.coverage
)/
'''
```

### Exclude Patterns Explained

| Pattern | Purpose |
|---------|---------|
| `.git` | Version control |
| `.venv, venv, env` | Virtual environments |
| `__pycache__` | Python cache |
| `migrations` | Django migrations |
| `build, dist` | Build outputs |
| `.mypy_cache` | Type checker cache |

### Why extend-exclude

| Option | Behavior |
|--------|----------|
| `exclude` | Replaces defaults |
| `extend-exclude` | Adds to defaults |

Using `extend-exclude` preserves Black's sensible defaults.

### Migration Exclusion

Django migrations should NOT be reformatted:
- Auto-generated code
- Dependency ordering matters
- Consistency with makemigrations

### Expected Outcome
- All cache directories excluded
- Migrations excluded
- Virtual environments excluded

### Verification Checklist
- [ ] extend-exclude configured
- [ ] Migrations excluded
- [ ] Virtual envs excluded
- [ ] Cache dirs excluded
- [ ] Build outputs excluded

---

## Task 07: Add Makefile Format Script

### Overview
Add convenient make commands for running Black.

### Dependencies
- Task 01: Install Black
- SubPhase-01 Group B: Makefile exists

### Instructions

1. **Add format target**
   - Run Black on codebase

2. **Add format-check target**
   - Check without changes

3. **Add to help section**
   - Document commands

### File Location

```
backend/
└── Makefile
```

### Makefile Additions

```makefile
# ==================================================
# Code Formatting
# ==================================================

# Format all Python code with Black
.PHONY: format
format:
	@echo "Formatting Python code with Black..."
	black .
	@echo "Formatting complete!"

# Check formatting without making changes
.PHONY: format-check
format-check:
	@echo "Checking Python code formatting..."
	black --check --diff .
	@echo "Format check complete!"

# Quick format (alias)
.PHONY: fmt
fmt: format
```

### Make Commands Summary

| Command | Action |
|---------|--------|
| `make format` | Format all code |
| `make format-check` | Check formatting |
| `make fmt` | Alias for format |

### Command Options Explained

| Option | Purpose |
|--------|---------|
| `--check` | Exit with error if changes needed |
| `--diff` | Show what would change |
| `.` | Current directory |

### CI/CD Usage

```yaml
# In CI pipeline
steps:
  - name: Check formatting
    run: make format-check
```

### Help Section Update

```makefile
.PHONY: help
help:
	@echo "Code Quality Commands:"
	@echo "  make format        - Format code with Black"
	@echo "  make format-check  - Check formatting"
	@echo "  make fmt           - Alias for format"
```

### Docker Integration

```makefile
# Format code in Docker container
.PHONY: docker-format
docker-format:
	docker compose exec backend black .

.PHONY: docker-format-check
docker-format-check:
	docker compose exec backend black --check --diff .
```

### Expected Outcome
- Make commands available
- Easy formatting

### Verification Checklist
- [ ] format target added
- [ ] format-check target added
- [ ] Aliases added
- [ ] Help updated
- [ ] Docker variants added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Configure Include Patterns | .py and .pyi files |
| 06 | Configure Exclude Patterns | Migrations, venv, cache |
| 07 | Add Makefile Format Script | make format commands |

### Complete pyproject.toml [tool.black]

```toml
[tool.black]
# Line length (88 is Black's default)
line-length = 88

# Target Python version
target-version = ['py312']

# Include pattern (Python files only)
include = '\.pyi?$'

# Exclude patterns
extend-exclude = '''
/(
    # Version control
    \.git
    | \.hg
    
    # Virtual environments
    | \.venv
    | venv
    | env
    
    # Cache directories
    | __pycache__
    | \.pytest_cache
    | \.mypy_cache
    
    # Build outputs
    | build
    | dist
    | \.eggs
    | .*\.egg-info
    
    # Django generated files
    | migrations
    
    # IDE directories
    | \.idea
    | \.vscode
    
    # Coverage reports
    | htmlcov
    | \.coverage
)/
'''
```

### Makefile Commands Added

| Command | Purpose |
|---------|---------|
| `make format` | Format all Python files |
| `make format-check` | Check without changing |
| `make fmt` | Alias for format |
| `make docker-format` | Format in container |

### Next Steps
Proceed to [03_Tasks-08-10_Black-Verification.md](03_Tasks-08-10_Black-Verification.md) for formatting code and verification.

---

## Notes for AI Agents

1. **extend-exclude:** Use instead of exclude to keep defaults
2. **Migrations:** Always exclude Django migrations
3. **Regex:** Black uses Python regex syntax
4. **Makefile:** Keep targets simple and composable
5. **Docker:** Provide container variants for consistency
6. **CI/CD:** Use format-check in pipelines
