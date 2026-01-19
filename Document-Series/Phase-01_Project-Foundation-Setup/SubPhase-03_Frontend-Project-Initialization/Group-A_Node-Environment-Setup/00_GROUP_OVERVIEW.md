# Group A: Node.js Environment Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** A of G  
> **Tasks Covered:** 01-08  
> **Group Goal:** Set up Node.js environment and package management

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [../../SubPhase-02_Backend-Project-Initialization/](../../SubPhase-02_Backend-Project-Initialization/)
- **→ Next Group:** [../Group-B_NextJS-Project-Creation/](../Group-B_NextJS-Project-Creation/)

---

## Group Overview

This group establishes the Node.js environment for the frontend project. It configures the package manager (pnpm), sets up version management, and creates the initial package.json with project metadata.

### Key Outcomes
- Node.js 20.x LTS verified and configured
- pnpm package manager installed and configured
- Version management files created (.nvmrc)
- Initial package.json with scripts
- Frontend-specific .gitignore configured

### Technology Context
- **Node.js Version:** 20.x LTS
- **Package Manager:** pnpm (preferred for monorepo efficiency)
- **Version Manager:** nvm (via .nvmrc)
- **Scripts:** dev, build, start, lint, format

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Node-Setup.md | 01-04 | Verify Node.js, install pnpm, create .nvmrc, .npmrc |
| 02 | 02_Tasks-05-08_Package-Config.md | 05-08 | Initialize package.json, scripts, workspace, .gitignore |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Verify Node.js Version | SubPhase-01 | Simple |
| 02 | Install pnpm | Task 01 | Simple |
| 03 | Create .nvmrc File | Task 01 | Simple |
| 04 | Create .npmrc File | Task 02 | Simple |
| 05 | Initialize package.json | Task 02 | Medium |
| 06 | Configure Package Scripts | Task 05 | Medium |
| 07 | Create pnpm-workspace.yaml | Task 02 | Simple |
| 08 | Create .gitignore (Frontend) | Task 05 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Node-Setup.md
        │
        ▼
02_Tasks-05-08_Package-Config.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── .gitignore               # Frontend-specific ignores
├── .npmrc                   # npm/pnpm configuration
├── .nvmrc                   # Node.js version (20)
├── package.json             # Project metadata and scripts
└── pnpm-workspace.yaml      # Workspace configuration
```

---

## Package.json Scripts

Essential scripts to configure:
- `dev` - Start development server
- `build` - Production build
- `start` - Start production server
- `lint` - Run ESLint
- `lint:fix` - Fix linting issues
- `format` - Run Prettier
- `type-check` - Run TypeScript check

---

## Notes for AI Agents

1. **Start Point:** Requires SubPhase-01 complete (frontend/ directory exists)
2. **Node Version:** Must use Node.js 20.x LTS
3. **pnpm Benefits:** Faster installs, disk space efficiency, strict by default
4. **Cross-Platform:** Scripts should work on Windows, Linux, macOS
5. **Git Commit:** Commit after completing this group
