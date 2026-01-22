# Tasks 29-30: Lint Verification

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** C - Backend Linting - flake8/Ruff  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-28_Ruff-Setup.md](02_Tasks-25-28_Ruff-Setup.md)
- **→ Next Group:** [../Group-D_Backend-Type-Checking-mypy/00_GROUP_OVERVIEW.md](../Group-D_Backend-Type-Checking-mypy/)

---

## Document Overview

This document covers running initial lint checks and fixing identified errors.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Run Initial Lint Check | Medium |
| 30 | Fix Linting Errors | Complex |

---

## Task 29: Run Initial Lint Check

### Overview
Run both flake8 and Ruff on the codebase to identify issues.

### Dependencies
- Task 24: flake8 configured
- Task 28: Ruff configured

### Instructions

1. **Run flake8**
   - Check entire codebase

2. **Run Ruff**
   - Check with statistics

3. **Collect issues**
   - Review output

### Run flake8

```bash
# Run flake8 on entire codebase
flake8 .

# With statistics
flake8 --statistics .

# Show source
flake8 --show-source .
```

### Run Ruff

```bash
# Run Ruff check
ruff check .

# With statistics
ruff check --statistics .

# Show fix preview
ruff check --diff .
```

### Expected Output Types

| Output | Meaning |
|--------|---------|
| No output | All checks pass |
| File:line:col: code | Issue found |
| Statistics | Count by error type |

### Example Output

```
apps/accounts/views.py:15:5: F841 local variable 'user' is assigned to but never used
apps/inventory/models.py:42:1: E302 expected 2 blank lines, found 1
Found 2 errors.
```

### Common First-Run Issues

| Code | Issue | Frequency |
|------|-------|-----------|
| F401 | Unused imports | High |
| F841 | Unused variables | Medium |
| E302/E303 | Blank lines | High |
| E501 | Line too long | Should be ignored |

### Makefile Combined Command

```makefile
.PHONY: lint-all
lint-all:
	@echo "Running all linters..."
	@echo "=== flake8 ==="
	flake8 . || true
	@echo ""
	@echo "=== Ruff ==="
	ruff check . || true
	@echo "Linting complete!"
```

### Expected Outcome
- Both linters run successfully
- Issues identified
- Statistics collected

### Verification Checklist
- [ ] flake8 runs without crash
- [ ] Ruff runs without crash
- [ ] Issues documented
- [ ] Exclude patterns working

---

## Task 30: Fix Linting Errors

### Overview
Fix identified linting errors to establish clean baseline.

### Dependencies
- Task 29: Run Initial Lint Check

### Instructions

1. **Auto-fix with Ruff**
   - Fix auto-fixable issues

2. **Manual fixes**
   - Review complex issues

3. **Verify clean**
   - Re-run linters

### Auto-fix with Ruff

```bash
# Fix all auto-fixable issues
ruff check --fix .

# Fix with unsafe fixes (more aggressive)
ruff check --fix --unsafe-fixes .
```

### Safe vs Unsafe Fixes

| Type | Description | Example |
|------|-------------|---------|
| Safe | No behavior change | Import sorting |
| Unsafe | May change behavior | Removing unused variable |

### Common Fixes

| Issue | Fix |
|-------|-----|
| F401 (unused import) | Remove the import |
| F841 (unused variable) | Remove or use with _ prefix |
| E302 (blank lines) | Add/remove blank lines |
| UP035 (deprecated typing) | Use dict instead of typing.Dict |

### Manual Fix Examples

**Unused Import (F401):**
```python
# Before
from django.db import models, transaction  # transaction unused

# After
from django.db import models
```

**Unused Variable (F841):**
```python
# Before
result = expensive_function()  # never used

# Option 1: Use underscore
_ = expensive_function()

# Option 2: Remove if not needed
expensive_function()
```

**Mutable Default (B006):**
```python
# Before
def process(items=[]):
    pass

# After
def process(items=None):
    items = items or []
```

### Verify Clean Baseline

```bash
# Run both linters
flake8 .
ruff check .

# Expected: No output (all clean)
```

### Final Makefile Commands

```makefile
# ==================================================
# Combined Linting Commands
# ==================================================

.PHONY: lint
lint:
	@echo "Running linters..."
	flake8 .
	ruff check .
	@echo "All checks passed!"

.PHONY: lint-fix
lint-fix:
	@echo "Auto-fixing linting issues..."
	ruff check --fix .
	@echo "Fixes applied!"

.PHONY: lint-full
lint-full: lint-fix format sort-imports
	@echo "Full lint and format complete!"
```

### CI/CD Integration

```yaml
# .github/workflows/lint.yml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Install dependencies
      run: pip install ruff flake8
    - name: Run Ruff
      run: ruff check .
    - name: Run flake8
      run: flake8 .
```

### Documentation Update

Add to backend/README.md:

```markdown
## Linting

We use two linters:
- **flake8**: Traditional linter with plugins
- **Ruff**: Fast, modern linter (preferred)

### Commands

```bash
# Check code
make lint

# Auto-fix issues
make lint-fix

# Full lint, format, and sort
make lint-full
```

### Configuration

- `.flake8`: flake8 configuration
- `pyproject.toml`: Ruff configuration ([tool.ruff])

### Ignored Rules

We ignore:
- E501: Black handles line length
- E203: Black whitespace style
```

### Git Commit

```bash
# Stage fixes
git add -A

# Commit with descriptive message
git commit -m "fix: resolve all linting errors

- Remove unused imports
- Fix blank line issues  
- Apply auto-fixes from Ruff"
```

### Expected Outcome
- All linting errors fixed
- Clean baseline established
- CI/CD ready

### Verification Checklist
- [ ] Ruff auto-fix applied
- [ ] Manual fixes done
- [ ] flake8 passes
- [ ] Ruff passes
- [ ] Documentation updated
- [ ] Changes committed

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Run Initial Lint Check | Issues identified |
| 30 | Fix Linting Errors | Clean codebase |

### Group C Complete

All 12 tasks for linting setup are complete:

| Task | Description | Status |
|------|-------------|--------|
| 19 | Install flake8 | ✅ |
| 20 | Install flake8 Plugins | ✅ |
| 21 | Create .flake8 Configuration | ✅ |
| 22 | Configure Max Line Length | ✅ |
| 23 | Configure Ignore Patterns | ✅ |
| 24 | Configure Exclude Patterns | ✅ |
| 25 | Install Ruff | ✅ |
| 26 | Configure Ruff in pyproject.toml | ✅ |
| 27 | Configure Ruff Rules | ✅ |
| 28 | Configure Ruff Ignore | ✅ |
| 29 | Run Initial Lint Check | ✅ |
| 30 | Fix Linting Errors | ✅ |

### Final Makefile Commands

| Command | Purpose |
|---------|---------|
| `make lint` | Run all linters |
| `make lint-fix` | Auto-fix issues |
| `make lint-full` | Lint + format + sort |

### Files Created/Updated

```
backend/
├── .flake8              # flake8 configuration
├── pyproject.toml       # [tool.ruff] section added
├── Makefile             # Lint commands added
└── README.md            # Linting documentation
```

### Next Steps
Proceed to [Group D: Backend Type Checking - mypy](../Group-D_Backend-Type-Checking-mypy/00_GROUP_OVERVIEW.md) for type checking configuration.

---

## Notes for AI Agents

1. **Ruff first:** Run Ruff for fast feedback
2. **Auto-fix:** Use ruff check --fix liberally
3. **Unsafe fixes:** Review before applying
4. **flake8 backup:** Keep for plugin compatibility
5. **CI/CD:** Run both linters in pipeline
6. **Baseline:** Establish clean before development
7. **Commits:** Separate commit for lint fixes
