# Group F: Frontend Formatting - Prettier

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** F of H  
> **Tasks Covered:** 59-68  
> **Group Goal:** Configure Prettier for consistent frontend code formatting

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Frontend-Linting-ESLint/](../Group-E_Frontend-Linting-ESLint/)
- **→ Next Group:** [../Group-G_Pre-commit-Hooks-Setup/](../Group-G_Pre-commit-Hooks-Setup/)

---

## Group Overview

This group configures Prettier, the opinionated code formatter for JavaScript/TypeScript. The setup includes ESLint integration to prevent conflicts between linting and formatting rules, ensuring a smooth developer experience.

### Key Outcomes
- Prettier installed as development dependency
- ESLint-Prettier integration configured (no conflicts)
- .prettierrc configuration file created
- Consistent formatting options (semi, quotes, tabs, trailing comma)
- .prettierignore for build outputs
- Format script added to package.json

### Technology Context
- **Formatter:** Prettier 3.x (latest stable)
- **ESLint Integration:** eslint-config-prettier, eslint-plugin-prettier
- **Configuration:** .prettierrc JSON file
- **Tab Width:** 2 spaces
- **Line Width:** 80 characters (Prettier default)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-59-62_Prettier-Installation.md | 59-62 | Install Prettier, ESLint integrations, create .prettierrc |
| 02 | 02_Tasks-63-68_Prettier-Configuration.md | 63-68 | Configure semi, tabWidth, singleQuote, trailingComma, create .prettierignore, add format script |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 59 | Install Prettier | SubPhase-03 | Simple |
| 60 | Install eslint-config-prettier | Task 43, 59 | Simple |
| 61 | Install eslint-plugin-prettier | Task 60 | Simple |
| 62 | Create .prettierrc | Task 59 | Simple |
| 63 | Configure Semi | Task 62 | Simple |
| 64 | Configure Tab Width | Task 62 | Simple |
| 65 | Configure Single Quote | Task 62 | Simple |
| 66 | Configure Trailing Comma | Task 62 | Simple |
| 67 | Create .prettierignore | Task 62 | Simple |
| 68 | Add Format Script | Task 62 | Simple |

---

## Execution Order

```
01_Tasks-59-62_Prettier-Installation.md
        │
        ▼
02_Tasks-63-68_Prettier-Configuration.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── .prettierrc              # Prettier configuration
├── .prettierignore          # Files to ignore
├── .eslintrc.json           # Updated with prettier extends
└── package.json             # Updated with format scripts
```

---

## Prettier Configuration Overview

**prettierrc key settings:**
- `semi: true` - Semicolons required
- `singleQuote: true` - Single quotes preferred
- `tabWidth: 2` - 2-space indentation
- `trailingComma: "es5"` - Trailing commas where valid in ES5
- `bracketSpacing: true` - Spaces in object literals
- `endOfLine: "lf"` - Linux line endings

**prettierignore patterns:**
- node_modules/, .next/, out/, build/, dist/, coverage/

---

## ESLint Integration

To prevent conflicts between ESLint and Prettier:

1. Install eslint-config-prettier (disables conflicting rules)
2. Install eslint-plugin-prettier (runs Prettier as ESLint rule)
3. Add "prettier" to ESLint extends array
4. Prettier rules override conflicting ESLint rules

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete (ESLint configured)
2. **ESLint Integration:** Add "prettier" to extends array
3. **Conflict Resolution:** prettier config disables conflicting ESLint rules
4. **Format Script:** npm run format to format all files
5. **Check Script:** npm run format:check for CI
6. **Git Commit:** Commit after completing this group

