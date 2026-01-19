# Group A: Backend Formatter Setup - Black

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** A of H  
> **Tasks Covered:** 01-10  
> **Group Goal:** Install and configure Black code formatter for Python backend

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Backend-Import-Sorting-isort/](../Group-B_Backend-Import-Sorting-isort/)

---

## Group Overview

This group installs and configures Black, the uncompromising Python code formatter. Black automatically formats Python code with a consistent style, eliminating debates about code formatting and ensuring uniformity across the entire backend codebase.

### Key Outcomes
- Black installed as development dependency
- pyproject.toml created/updated with Black configuration
- Line length set to 88 characters (Black default)
- Target Python version set to 3.12
- Include and exclude patterns configured
- Makefile format command added
- All existing code formatted and verified

### Technology Context
- **Formatter:** Black 24.x (latest stable)
- **Configuration:** pyproject.toml [tool.black] section
- **Line Length:** 88 characters (Black default)
- **Python Target:** Python 3.12+
- **Excluded:** migrations, venv, __pycache__, .git

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Black-Installation.md | 01-04 | Install Black, create pyproject.toml, configure line length and target version |
| 02 | 02_Tasks-05-07_Black-Patterns-Scripts.md | 05-07 | Configure include/exclude patterns, add Makefile format script |
| 03 | 03_Tasks-08-10_Black-Verification.md | 08-10 | Format existing code, verify configuration, document usage |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install Black | SubPhase-02 | Simple |
| 02 | Create pyproject.toml | Task 01 | Medium |
| 03 | Configure Line Length | Task 02 | Simple |
| 04 | Configure Target Python Version | Task 02 | Simple |
| 05 | Configure Include Patterns | Task 02 | Simple |
| 06 | Configure Exclude Patterns | Task 02 | Simple |
| 07 | Add Format Script to Makefile | Task 01 | Simple |
| 08 | Format Existing Code | Task 06 | Simple |
| 09 | Verify Black Configuration | Task 08 | Simple |
| 10 | Document Black Usage | Task 01 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Black-Installation.md
        │
        ▼
02_Tasks-05-07_Black-Patterns-Scripts.md
        │
        ▼
03_Tasks-08-10_Black-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── pyproject.toml           # Black configuration [tool.black]
├── Makefile                 # Updated with format command
└── README.md                # Updated with Black usage section
```

---

## Black Configuration Overview

**pyproject.toml key settings:**
- `line-length = 88` - Black's default line length
- `target-version = ['py312']` - Python 3.12 target
- `include = '\.pyi?$'` - Format .py and .pyi files
- `extend-exclude` - Exclude migrations, venv, build directories

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-02 complete (Django project exists)
2. **pyproject.toml:** May already exist; update [tool.black] section
3. **Makefile:** Add format target for convenient usage
4. **Verification:** Run Black with --check flag to verify
5. **Git Commit:** Commit after completing this group

