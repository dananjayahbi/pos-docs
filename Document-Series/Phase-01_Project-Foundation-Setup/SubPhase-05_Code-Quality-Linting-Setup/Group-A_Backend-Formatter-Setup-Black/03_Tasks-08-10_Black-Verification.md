# Tasks 08-10: Black Verification

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** A - Backend Formatter Setup - Black  
> **Document:** 03 of 03  
> **Tasks Covered:** 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-05-07_Black-Patterns-Scripts.md](02_Tasks-05-07_Black-Patterns-Scripts.md)
- **→ Next Group:** [../Group-B_Backend-Import-Sorting-isort/00_GROUP_OVERVIEW.md](../Group-B_Backend-Import-Sorting-isort/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers formatting existing code, verifying configuration, and documenting Black usage.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 08 | Format Existing Code | Simple |
| 09 | Verify Configuration | Simple |
| 10 | Document Usage | Simple |

---

## Task 08: Format Existing Code

### Overview
Run Black on all existing Python code to establish baseline formatting.

### Dependencies
- Task 01-07: Black fully configured

### Instructions

1. **Run Black on codebase**
   - Format all Python files

2. **Review changes**
   - Check modified files

3. **Commit formatted code**
   - Single formatting commit

### Format Commands

```bash
# Preview changes first
black --check --diff .

# Apply formatting
black .

# Format specific directories
black apps/ core/ config/
```

### Expected Output

```
All done! ✨ 🍰 ✨
X files reformatted.
Y files left unchanged.
```

### Files Typically Formatted

| Directory | Files |
|-----------|-------|
| apps/ | App modules |
| core/ | Core utilities |
| config/ | Django settings |

### Files Skipped

| Pattern | Reason |
|---------|--------|
| migrations/ | Auto-generated |
| __pycache__/ | Compiled Python |
| .venv/ | Virtual environment |

### Git Workflow

```bash
# Stage all formatted files
git add -A

# Create dedicated commit
git commit -m "style: format codebase with black"
```

### Initial Run Considerations

| Scenario | Action |
|----------|--------|
| Large changes | Review diff first |
| Team project | Coordinate timing |
| CI failing | Run format-check |

### Expected Outcome
- All Python files formatted
- Consistent code style
- Clean git commit

### Verification Checklist
- [ ] Preview changes reviewed
- [ ] Black applied to codebase
- [ ] No errors during format
- [ ] Committed separately

---

## Task 09: Verify Configuration

### Overview
Verify Black configuration is working correctly.

### Dependencies
- Task 08: Format Existing Code

### Instructions

1. **Test configuration loads**
   - Check Black reads pyproject.toml

2. **Verify line length**
   - Test 88 character limit

3. **Verify exclusions**
   - Confirm patterns work

### Verification Commands

```bash
# Check Black sees configuration
black --config pyproject.toml --check .

# Show what would be formatted
black --check --diff --verbose .

# Check specific exclusion
black migrations/ 2>&1 | grep -i "ignored"
```

### Configuration Test

Create a test file with long line:

```python
# test_black.py
very_long_variable_name = "This is a very long string that definitely exceeds the eighty-eight character limit set in our Black configuration file"
```

Run Black:
```bash
black test_black.py --diff
```

Expected: Line gets split at 88 characters.

### Exclusion Test

```bash
# Try to format migrations (should be skipped)
black migrations/ --verbose

# Expected: No files formatted
```

### Version Test

```bash
# Check Python version target
black --target-version py312 --check .
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Config not found | Check pyproject.toml location |
| Wrong excludes | Verify regex patterns |
| Version mismatch | Update target-version |

### Expected Outcome
- Configuration verified
- Line length working
- Exclusions working

### Verification Checklist
- [ ] pyproject.toml detected
- [ ] Line length 88 working
- [ ] Exclusions confirmed
- [ ] Python 3.12 target working

---

## Task 10: Document Usage

### Overview
Document Black usage for team developers.

### Dependencies
- Task 09: Verify Configuration

### Instructions

1. **Add to README**
   - Developer section

2. **Document commands**
   - Common usage

3. **IDE setup notes**
   - VS Code, PyCharm

### README Addition

Add to `backend/README.md`:

```markdown
## Code Formatting

This project uses [Black](https://black.readthedocs.io/) for Python code formatting.

### Quick Commands

```bash
# Format all code
make format

# Check formatting (CI)
make format-check

# Format specific file
black path/to/file.py
```

### Configuration

Black is configured in `pyproject.toml`:
- Line length: 88 characters
- Target: Python 3.12
- Excludes: migrations, venv, cache

### IDE Setup

#### VS Code
Install Python extension, add to settings.json:
```json
{
    "python.formatting.provider": "black",
    "editor.formatOnSave": true
}
```

#### PyCharm
1. File → Settings → Tools → Black
2. Enable "On code reformat"
3. Set path to Black executable
```

### Developer Workflow

| When | Command |
|------|---------|
| Before commit | `make format` |
| CI check | `make format-check` |
| Single file | `black file.py` |

### IDE Integration Guide

#### VS Code Settings

```json
{
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
        "editor.formatOnSave": true
    },
    "black-formatter.args": [
        "--config",
        "pyproject.toml"
    ]
}
```

#### VS Code Extension

Install: ms-python.black-formatter

#### PyCharm Setup

1. Settings → Tools → Black
2. Path: `<venv>/bin/black`
3. Arguments: `--config pyproject.toml`
4. Enable on save

### CONTRIBUTING.md Update

Add formatting requirements:

```markdown
## Code Style

### Python Formatting
- We use Black for code formatting
- Run `make format` before committing
- CI will reject unformatted code

### Pre-commit (optional)
Black runs automatically via pre-commit hooks.
See Group G for setup instructions.
```

### Team Guidelines

| Rule | Reason |
|------|--------|
| No arguments | Black is opinionated |
| Run before commit | Clean diffs |
| Don't reformat migrations | Auto-generated |

### Expected Outcome
- README updated
- IDE setup documented
- Team guidelines clear

### Verification Checklist
- [ ] README has formatting section
- [ ] Commands documented
- [ ] IDE setup explained
- [ ] CONTRIBUTING.md updated

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 08 | Format Existing Code | Formatted codebase |
| 09 | Verify Configuration | Tested configuration |
| 10 | Document Usage | README and guidelines |

### Group A Complete

All 10 tasks for Black formatter setup are complete:

| Task | Description | Status |
|------|-------------|--------|
| 01 | Install Black | ✅ |
| 02 | Create pyproject.toml | ✅ |
| 03 | Configure Line Length | ✅ |
| 04 | Configure Target Version | ✅ |
| 05 | Configure Include Patterns | ✅ |
| 06 | Configure Exclude Patterns | ✅ |
| 07 | Add Makefile Format Script | ✅ |
| 08 | Format Existing Code | ✅ |
| 09 | Verify Configuration | ✅ |
| 10 | Document Usage | ✅ |

### Final pyproject.toml [tool.black]

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
    \.git
    | \.hg
    | \.venv
    | venv
    | env
    | __pycache__
    | \.pytest_cache
    | \.mypy_cache
    | build
    | dist
    | \.eggs
    | .*\.egg-info
    | migrations
    | \.idea
    | \.vscode
    | htmlcov
    | \.coverage
)/
'''
```

### Makefile Commands

```makefile
.PHONY: format format-check fmt

format:
	black .

format-check:
	black --check --diff .

fmt: format
```

### Next Steps
Proceed to [Group B: Backend Import Sorting - isort](../Group-B_Backend-Import-Sorting-isort/00_GROUP_OVERVIEW.md) for import sorting configuration.

---

## Notes for AI Agents

1. **Initial format:** Single commit for formatting
2. **Git message:** Use `style: format codebase with black`
3. **IDE:** Configure format-on-save
4. **CI/CD:** Use format-check target
5. **Team:** Document in README and CONTRIBUTING
6. **Pre-commit:** Will be set up in Group G
7. **Coordination:** isort must be compatible (next group)
