# Group A: Git Repository Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** A of G  
> **Tasks Covered:** 01-08  
> **Group Goal:** Initialize Git repository with comprehensive ignore patterns and attributes

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Branching-Strategy-Definition/](../Group-B_Branching-Strategy-Definition/)

---

## Group Overview

This group initializes the Git repository and creates comprehensive configuration files including .gitignore and .gitattributes. The setup ensures consistent handling of files across different development environments and platforms.

### Key Outcomes
- Git repository initialized
- Comprehensive .gitignore with Python, Node.js, IDE, and environment patterns
- .gitattributes for line ending normalization
- Initial commit with project foundation
- Clean repository state ready for team collaboration

### Technology Context
- **Version Control:** Git
- **Hosting:** GitHub
- **Line Endings:** LF normalization
- **Ignores:** Python, Node.js, IDE files, environment variables

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Git-Init-Ignores.md | 01-04 | Initialize repo, create .gitignore, add Python and Node.js patterns |
| 02 | 02_Tasks-05-08_Attributes-Commit.md | 05-08 | Add IDE ignores, environment ignores, create .gitattributes, initial commit |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Initialize Git Repository | SubPhase-01 | Simple |
| 02 | Create .gitignore (Root) | Task 01 | Medium |
| 03 | Add Python Ignores | Task 02 | Simple |
| 04 | Add Node.js Ignores | Task 02 | Simple |
| 05 | Add IDE Ignores | Task 02 | Simple |
| 06 | Add Environment Ignores | Task 02 | Simple |
| 07 | Create .gitattributes | Task 01 | Simple |
| 08 | Create Initial Commit | Task 07 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Git-Init-Ignores.md
        │
        ▼
02_Tasks-05-08_Attributes-Commit.md
```

---

## Expected Deliverables

After completing this group:

```
/                            # Repository root
├── .git/                    # Git repository
├── .gitignore               # Comprehensive ignore patterns
└── .gitattributes           # Line ending normalization
```

---

## .gitignore Categories

**Python patterns:** `__pycache__/`, `*.py[cod]`, `venv/`, `.venv/`, `*.egg-info/`
**Node.js patterns:** `node_modules/`, `.next/`, `dist/`, `*.log`
**IDE patterns:** `.vscode/`, `.idea/`, `*.swp`, `*.swo`
**Environment patterns:** `.env`, `.env.local`, `*.secret`

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-01 complete (folder structure exists)
2. **Git Init:** Skip if already initialized
3. **Gitignore:** Combine all patterns in single file
4. **Gitattributes:** Normalize line endings to LF
5. **Initial Commit:** Commit all project foundation files
6. **Git Commit:** This group ends with initial commit

