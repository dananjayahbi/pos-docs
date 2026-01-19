# Group B: Root Directory Structure

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** B of F  
> **Tasks Covered:** 11-20  
> **Group Goal:** Create the main directory structure for the monorepo

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Repository-Initialization/](../Group-A_Repository-Initialization/)
- **→ Next Group:** [../Group-C_Backend-Directory-Scaffold/](../Group-C_Backend-Directory-Scaffold/)

---

## Group Overview

This group creates the primary directory structure that organizes the entire monorepo. It establishes clear separation between backend, frontend, shared resources, and supporting infrastructure.

### Key Outcomes
- All main directories created (backend, frontend, shared, docker, docs, scripts)
- GitHub and VS Code configuration directories established
- Root tests directory for integration/E2E tests
- Environment variable template created

### Technology Context
- **Monorepo Structure:** Clear separation of concerns
- **Backend:** Django application directory
- **Frontend:** Next.js application directory
- **Shared:** Cross-platform types and constants
- **Infrastructure:** Docker, scripts, documentation

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-11-15_Main-Directories.md | 11-15 | Create backend, frontend, shared, docker, docs directories |
| 02 | 02_Tasks-16-20_Support-Directories.md | 16-20 | Create scripts, .github, .vscode, tests directories and .env.example |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 11 | Create backend/ Directory | Task 01 | Simple |
| 12 | Create frontend/ Directory | Task 01 | Simple |
| 13 | Create shared/ Directory | Task 01 | Simple |
| 14 | Create docker/ Directory | Task 01 | Simple |
| 15 | Create docs/ Directory | Task 01 | Simple |
| 16 | Create scripts/ Directory | Task 01 | Simple |
| 17 | Create .github/ Directory | Task 01 | Simple |
| 18 | Create .vscode/ Directory | Task 01 | Simple |
| 19 | Create tests/ Directory | Task 01 | Simple |
| 20 | Create .env.example File | Task 01 | Medium |

---

## Execution Order

```
01_Tasks-11-15_Main-Directories.md
        │
        ▼
02_Tasks-16-20_Support-Directories.md
```

---

## Expected Deliverables

After completing this group, the following directories will exist:

```
lankacommerce-cloud/
├── .github/                 # GitHub configurations
├── .vscode/                 # VS Code settings
├── backend/                 # Django application
├── docker/                  # Docker configurations
├── docs/                    # Project documentation
├── frontend/                # Next.js application
├── scripts/                 # Utility scripts
├── shared/                  # Shared resources
├── tests/                   # Integration/E2E tests
└── .env.example             # Environment template
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (Task 01 specifically)
2. **All Parallel:** Tasks 11-19 can be created in parallel (all depend only on Task 01)
3. **Empty Directories:** Add .gitkeep files to track empty directories
4. **Environment Template:** .env.example should document all required variables
5. **Git Commit:** Commit after completing this group with message "chore: create root directory structure"
