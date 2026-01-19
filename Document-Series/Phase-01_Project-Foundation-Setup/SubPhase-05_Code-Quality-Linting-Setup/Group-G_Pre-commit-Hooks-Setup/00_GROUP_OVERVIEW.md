# Group G: Pre-commit Hooks Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** G of H  
> **Tasks Covered:** 69-82  
> **Group Goal:** Configure automated pre-commit hooks for code quality enforcement

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Frontend-Formatting-Prettier/](../Group-F_Frontend-Formatting-Prettier/)
- **→ Next Group:** [../Group-H_Editor-Configuration-Verification/](../Group-H_Editor-Configuration-Verification/)

---

## Group Overview

This group configures pre-commit hooks for both Python (using pre-commit framework) and JavaScript/TypeScript (using Husky and lint-staged). These hooks ensure code quality checks run automatically before each commit, preventing problematic code from entering the repository.

### Key Outcomes
- pre-commit framework installed for Python
- .pre-commit-config.yaml with Black, isort, flake8, mypy hooks
- Trailing whitespace and end-of-file hooks added
- YAML validation hook configured
- Husky installed for Node.js git hooks
- lint-staged configured for staged file checking
- ESLint and Prettier run on staged files
- All hooks installed and tested

### Technology Context
- **Python Hooks:** pre-commit framework
- **Node.js Hooks:** Husky + lint-staged
- **Configuration:** .pre-commit-config.yaml, package.json
- **Hooks Location:** .git/hooks/ (managed by tools)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-69-74_Precommit-Python.md | 69-74 | Install pre-commit, create config, add Black, isort, flake8, mypy hooks |
| 02 | 02_Tasks-75-77_Precommit-Utility.md | 75-77 | Add trailing whitespace, end-of-file, YAML check hooks |
| 03 | 03_Tasks-78-82_Husky-Lintstaged.md | 78-82 | Install Husky, configure lint-staged, add ESLint and Prettier, install hooks |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 69 | Install pre-commit | Task 01 | Simple |
| 70 | Create .pre-commit-config.yaml | Task 69 | Medium |
| 71 | Add Black Hook | Task 70 | Simple |
| 72 | Add isort Hook | Task 70 | Simple |
| 73 | Add flake8 Hook | Task 70 | Simple |
| 74 | Add mypy Hook | Task 70 | Simple |
| 75 | Add Trailing Whitespace Hook | Task 70 | Simple |
| 76 | Add End of File Hook | Task 70 | Simple |
| 77 | Add YAML Check Hook | Task 70 | Simple |
| 78 | Install Husky (Frontend) | Task 59 | Medium |
| 79 | Configure lint-staged | Task 78 | Medium |
| 80 | Add ESLint to lint-staged | Task 79 | Simple |
| 81 | Add Prettier to lint-staged | Task 79 | Simple |
| 82 | Install Pre-commit Hooks | Task 77 | Simple |

---

## Execution Order

```
01_Tasks-69-74_Precommit-Python.md
        │
        ▼
02_Tasks-75-77_Precommit-Utility.md
        │
        ▼
03_Tasks-78-82_Husky-Lintstaged.md
```

---

## Expected Deliverables

After completing this group:

```
/                            # Repository root
├── .pre-commit-config.yaml  # Python pre-commit hooks
├── .husky/                  # Husky hooks directory
│   └── pre-commit           # Pre-commit hook script
└── frontend/
    └── package.json         # Updated with lint-staged config
```

---

## Pre-commit Configuration Overview

**.pre-commit-config.yaml repos:**
- pre-commit/pre-commit-hooks (trailing-whitespace, end-of-file-fixer, check-yaml)
- psf/black (Black formatter)
- pycqa/isort (import sorting)
- pycqa/flake8 (linting)
- pre-commit/mirrors-mypy (type checking)

**lint-staged configuration:**
- `*.{js,jsx,ts,tsx}` - ESLint --fix, Prettier --write
- `*.{json,md,css,scss}` - Prettier --write

---

## Notes for AI Agents

1. **Dependencies:** Requires Groups A-F complete (all linting tools installed)
2. **Pre-commit:** Works at repository root level
3. **Husky:** Works at frontend directory level
4. **Hook Versions:** Use latest stable versions in config
5. **mypy Hook:** May need additional_dependencies for stubs
6. **Installation:** Run `pre-commit install` to activate hooks
7. **Git Commit:** Commit after completing this group

