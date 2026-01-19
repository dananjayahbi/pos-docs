# Group C: Backend Linting - flake8/Ruff

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** C of H  
> **Tasks Covered:** 19-30  
> **Group Goal:** Configure Python linting with flake8 and Ruff

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Backend-Import-Sorting-isort/](../Group-B_Backend-Import-Sorting-isort/)
- **→ Next Group:** [../Group-D_Backend-Type-Checking-mypy/](../Group-D_Backend-Type-Checking-mypy/)

---

## Group Overview

This group configures Python linting tools - both flake8 (traditional linter) and Ruff (fast, modern alternative). These tools catch common errors, enforce coding standards, and improve overall code quality by identifying issues before runtime.

### Key Outcomes
- flake8 installed with useful plugins (bugbear, comprehensions)
- .flake8 configuration file created with Black-compatible settings
- Ruff installed as fast alternative linter
- Ruff configured in pyproject.toml with comprehensive rule selection
- Exclude patterns for migrations and virtual environments
- Initial lint checks run and issues fixed

### Technology Context
- **Traditional Linter:** flake8 7.x with plugins
- **Modern Linter:** Ruff (10-100x faster than flake8)
- **Configuration:** .flake8 for flake8, pyproject.toml for Ruff
- **Line Length:** 88 (Black compatible)
- **Max Complexity:** 10 (McCabe complexity)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-19-24_flake8-Setup.md | 19-24 | Install flake8 and plugins, create .flake8, configure options |
| 02 | 02_Tasks-25-28_Ruff-Setup.md | 25-28 | Install Ruff, configure in pyproject.toml, set rules and ignores |
| 03 | 03_Tasks-29-30_Lint-Verification.md | 29-30 | Run initial lint check, fix identified errors |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 19 | Install flake8 | Task 01 | Simple |
| 20 | Install flake8 Plugins | Task 19 | Simple |
| 21 | Create .flake8 Configuration | Task 19 | Medium |
| 22 | Configure Max Line Length | Task 21 | Simple |
| 23 | Configure Ignore Patterns | Task 21 | Simple |
| 24 | Configure Exclude Patterns | Task 21 | Simple |
| 25 | Install Ruff | Task 01 | Simple |
| 26 | Configure Ruff in pyproject.toml | Task 02, 25 | Medium |
| 27 | Configure Ruff Rules | Task 26 | Medium |
| 28 | Configure Ruff Ignore | Task 26 | Simple |
| 29 | Run Initial Lint Check | Task 24, 26 | Medium |
| 30 | Fix Linting Errors | Task 29 | Complex |

---

## Execution Order

```
01_Tasks-19-24_flake8-Setup.md
        │
        ▼
02_Tasks-25-28_Ruff-Setup.md
        │
        ▼
03_Tasks-29-30_Lint-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── .flake8                  # flake8 configuration
└── pyproject.toml           # Updated with [tool.ruff] section
```

---

## Linting Configuration Overview

**flake8 key settings (.flake8):**
- `max-line-length = 88` - Black compatible
- `extend-ignore = E203, E266, E501, W503` - Black compatibility
- `max-complexity = 10` - McCabe complexity limit
- `exclude` - migrations, venv, __pycache__
- `per-file-ignores` - __init__.py:F401

**Ruff key settings (pyproject.toml):**
- `select = ["E", "W", "F", "I", "B", "C4", "UP"]` - Enabled rules
- `ignore = ["E501"]` - Rules to ignore
- `target-version = "py312"` - Python version

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (pyproject.toml exists)
2. **Dual Configuration:** Configure both flake8 and Ruff
3. **Black Compatibility:** Use 88 line length, ignore E203, E501, W503
4. **Ruff Preference:** Ruff is preferred for speed; flake8 for compatibility
5. **Fix Errors:** Some errors may require code changes
6. **Git Commit:** Commit after completing this group

