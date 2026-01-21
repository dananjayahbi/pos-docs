# Group A: Project Initialization

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Initialize Next.js 14+ project with package manager, git hooks, and initial configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_TypeScript-Configuration](../Group-B_TypeScript-Configuration/)

---

## Group Overview

This group initializes the Next.js 14+ frontend application with App Router architecture. Sets up pnpm as the preferred package manager, configures package.json with metadata and scripts, installs core React and TypeScript dependencies, and establishes Git hooks with Husky for pre-commit linting and conventional commit enforcement. Creates development environment files (.nvmrc, .npmrc) and frontend-specific gitignore/gitattributes.

### Key Outcomes

- Next.js 14+ project created with TypeScript template
- pnpm configured as package manager
- package.json with proper metadata and scripts
- Core dependencies installed (react 18.x, next)
- TypeScript dependencies installed
- .nvmrc for Node.js 20.x version
- .npmrc for consistent package resolution
- Git initialized with frontend-specific ignores
- Husky hooks for pre-commit and pre-push
- lint-staged for staged file linting
- commitlint for conventional commits
- Frontend README.md created
- Initial dev server verified

### Technology Context

- **Framework:** Next.js 14+ with App Router
- **Package Manager:** pnpm (preferred), npm fallback
- **Node.js:** 20.x LTS
- **Git Hooks:** Husky 8.x
- **Commit Convention:** Conventional Commits

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Project-PackageManager-Setup.md` | Create Next.js project and configure package manager | 01-08 |
| 02 | `02_Tasks-09-16_Git-Hooks-Documentation.md` | Set up Git configuration, Husky hooks, and README | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Next.js Project | Medium | None |
| 02 | Configure Package Manager | Low | Task 01 |
| 03 | Update package.json Metadata | Low | Task 01 |
| 04 | Configure npm Scripts | Low | Task 03 |
| 05 | Install Core Dependencies | Low | Task 01 |
| 06 | Install TypeScript Dependencies | Low | Task 05 |
| 07 | Create .nvmrc File | Low | Task 01 |
| 08 | Create .npmrc Configuration | Low | Task 02 |
| 09 | Initialize Git for Frontend | Low | Task 01 |
| 10 | Create Frontend .gitignore | Low | Task 09 |
| 11 | Create Frontend .gitattributes | Low | Task 09 |
| 12 | Set Up Husky Git Hooks | Medium | Task 09 |
| 13 | Configure lint-staged | Low | Task 12 |
| 14 | Create commitlint Configuration | Low | Task 12 |
| 15 | Create Frontend README.md | Low | Task 01 |
| 16 | Verify Initial Setup | Low | Task 05 |

---

## Execution Order

```
Task 01: Create Next.js Project
    │
    ├────────────────────┬────────────────────┐
    ▼                    ▼                    ▼
Task 02              Task 05              Task 07
(pnpm)               (core deps)          (.nvmrc)
    │                    │                    
    ▼                    ▼                    
Task 08              Task 06              
(.npmrc)             (TS deps)
    │                    
    ├────────────────────┘
    ▼
Task 03: Update package.json
    │
    ▼
Task 04: Configure npm Scripts
    │
    ▼
Task 09: Initialize Git
    │
    ├──────────────┐
    ▼              ▼
Task 10        Task 11
(.gitignore)   (.gitattributes)
    │              │
    └──────┬───────┘
           ▼
      Task 12: Set Up Husky
           │
           ├──────────────┐
           ▼              ▼
      Task 13        Task 14
      (lint-staged)  (commitlint)
           │              │
           └──────┬───────┘
                  ▼
             Task 15: Create README
                  │
                  ▼
             Task 16: Verify Setup
```

---

## Expected Deliverables

```
frontend/
├── .husky/
│   ├── pre-commit          # Run lint-staged
│   └── pre-push            # Run type-check
├── node_modules/
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc                  # Node.js 20.x
├── commitlint.config.js
├── lint-staged.config.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Notes for AI Agents

### create-next-app Command
```bash
pnpm create next-app@latest frontend --typescript --eslint --tailwind --app --src-dir=false --import-alias "@/*"
```

### package.json Scripts
- dev: next dev (with turbopack)
- build: next build
- start: next start
- lint: next lint
- format: prettier --write .
- type-check: tsc --noEmit

### .nvmrc Content
```
20
```

### .npmrc Recommended Settings
```
auto-install-peers=true
strict-peer-dependencies=false
```

### Husky Pre-commit Hook
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

### lint-staged Configuration
```js
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
```

### commitlint Configuration
```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### Conventional Commit Types
| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting |
| refactor | Code restructuring |
| test | Tests |
| chore | Maintenance |
