# Group C: Commit Message Conventions

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** C of G  
> **Tasks Covered:** 21-32  
> **Group Goal:** Establish Conventional Commits standard with automated validation

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Branching-Strategy-Definition/](../Group-B_Branching-Strategy-Definition/)
- **→ Next Group:** [../Group-D_Pull-Request-Templates/](../Group-D_Pull-Request-Templates/)

---

## Group Overview

This group establishes commit message conventions using the Conventional Commits specification. The setup includes documentation, commitlint for automated validation, and Commitizen for interactive commit creation, ensuring consistent and meaningful commit history.

### Key Outcomes
- COMMITS.md documentation with format and guidelines
- Conventional Commits format adopted (type(scope): description)
- Commit types defined (feat, fix, docs, style, refactor, test, chore)
- commitlint installed and configured
- Commit message validation hook added
- Commitizen installed for interactive commits
- Good and bad commit examples documented

### Technology Context
- **Standard:** Conventional Commits 1.0.0
- **Linting:** commitlint with conventional config
- **Interactive:** Commitizen (cz-conventional-changelog)
- **Format:** `type(scope): description`

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-21-25_Commit-Format.md | 21-25 | Create COMMITS.md, define format, types, scope, subject guidelines |
| 02 | 02_Tasks-26-29_Commit-Body-Linting.md | 26-29 | Define body guidelines, footer, install commitlint, create config |
| 03 | 03_Tasks-30-32_Commit-Hooks-Tools.md | 30-32 | Add commit hook, create examples, install Commitizen |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 21 | Document Commit Conventions | Task 08 | Medium |
| 22 | Define Commit Format | Task 21 | Simple |
| 23 | Define Commit Types | Task 22 | Simple |
| 24 | Define Scope Guidelines | Task 22 | Simple |
| 25 | Define Subject Guidelines | Task 22 | Simple |
| 26 | Define Body Guidelines | Task 22 | Simple |
| 27 | Define Footer Guidelines | Task 22 | Simple |
| 28 | Install commitlint | Task 22 | Medium |
| 29 | Create commitlint.config.js | Task 28 | Simple |
| 30 | Add Commit Message Hook | Task 29 | Medium |
| 31 | Create Commit Examples | Task 21 | Simple |
| 32 | Install Commitizen | Task 28 | Simple |

---

## Execution Order

```
01_Tasks-21-25_Commit-Format.md
        │
        ▼
02_Tasks-26-29_Commit-Body-Linting.md
        │
        ▼
03_Tasks-30-32_Commit-Hooks-Tools.md
```

---

## Expected Deliverables

After completing this group:

```
/                            # Repository root
├── docs/
│   └── COMMITS.md           # Commit conventions documentation
├── commitlint.config.js     # commitlint configuration
├── .husky/
│   └── commit-msg           # Commit message validation hook
└── package.json             # Updated with commitlint, commitizen
```

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

**Examples:**
- `feat(auth): add JWT token refresh endpoint`
- `fix(pos): resolve cart total calculation error`
- `docs(api): update authentication documentation`

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (Git repo exists)
2. **Conventional Commits:** Follow specification strictly
3. **Commitlint:** Install at repository root
4. **Husky Hook:** Add commit-msg hook for validation
5. **Commitizen:** Optional but helpful for team
6. **Git Commit:** Commit after completing this group

