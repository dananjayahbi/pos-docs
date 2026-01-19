# Group E: Frontend Linting - ESLint

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** E of H  
> **Tasks Covered:** 43-58  
> **Group Goal:** Configure ESLint for Next.js/React/TypeScript frontend

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Backend-Type-Checking-mypy/](../Group-D_Backend-Type-Checking-mypy/)
- **→ Next Group:** [../Group-F_Frontend-Formatting-Prettier/](../Group-F_Frontend-Formatting-Prettier/)

---

## Group Overview

This group configures ESLint with comprehensive rules for Next.js, React, and TypeScript. The setup includes plugins for React hooks, TypeScript-specific rules, and import ordering to ensure consistent, high-quality frontend code.

### Key Outcomes
- ESLint installed with all necessary plugins
- Next.js core-web-vitals configuration extended
- TypeScript parser and plugin configured
- React and React Hooks rules enabled
- Import ordering rules configured
- .eslintignore for build outputs
- Lint script added to package.json
- Initial lint run completed and issues fixed

### Technology Context
- **Linter:** ESLint 8.x (latest stable)
- **Parser:** @typescript-eslint/parser
- **Extends:** next/core-web-vitals, typescript-eslint
- **Plugins:** react, react-hooks, @typescript-eslint, import
- **Configuration:** .eslintrc.json file

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-48_ESLint-Installation.md | 43-48 | Install ESLint, all plugins, React plugin, hooks plugin, TypeScript parser and plugin |
| 02 | 02_Tasks-49-54_ESLint-Configuration.md | 49-54 | Create .eslintrc.json, configure extends, parser, React rules, TypeScript rules, import rules |
| 03 | 03_Tasks-55-58_ESLint-Verification.md | 55-58 | Create .eslintignore, add lint script, run initial lint, fix errors |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Install ESLint | SubPhase-03 | Simple |
| 44 | Install ESLint Plugins | Task 43 | Simple |
| 45 | Install eslint-plugin-react | Task 43 | Simple |
| 46 | Install eslint-plugin-react-hooks | Task 43 | Simple |
| 47 | Install @typescript-eslint/parser | Task 43 | Simple |
| 48 | Install @typescript-eslint/eslint-plugin | Task 47 | Simple |
| 49 | Create .eslintrc.json | Task 44 | Medium |
| 50 | Configure Extends | Task 49 | Simple |
| 51 | Configure Parser Options | Task 49 | Simple |
| 52 | Configure React Rules | Task 49 | Medium |
| 53 | Configure TypeScript Rules | Task 49 | Medium |
| 54 | Configure Import Rules | Task 49 | Medium |
| 55 | Create .eslintignore | Task 49 | Simple |
| 56 | Add Lint Script | Task 49 | Simple |
| 57 | Run Initial Lint | Task 55 | Medium |
| 58 | Fix ESLint Errors | Task 57 | Complex |

---

## Execution Order

```
01_Tasks-43-48_ESLint-Installation.md
        │
        ▼
02_Tasks-49-54_ESLint-Configuration.md
        │
        ▼
03_Tasks-55-58_ESLint-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── .eslintrc.json           # ESLint configuration
├── .eslintignore            # Files to ignore
└── package.json             # Updated with lint scripts
```

---

## ESLint Configuration Overview

**eslintrc.json key settings:**
- `extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"]`
- `parser: "@typescript-eslint/parser"`
- `plugins: ["@typescript-eslint", "react", "react-hooks"]`
- React rules: react-in-jsx-scope off, prop-types off
- TypeScript rules: no-unused-vars error

**eslintignore patterns:**
- node_modules/, .next/, out/, build/, dist/

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-03 complete (Next.js project exists)
2. **Next.js Config:** May already have basic ESLint; extend it
3. **TypeScript Parser:** Required for TypeScript support
4. **React Rules:** Disable prop-types (using TypeScript instead)
5. **Import Order:** Optional but recommended for consistency
6. **Git Commit:** Commit after completing this group

