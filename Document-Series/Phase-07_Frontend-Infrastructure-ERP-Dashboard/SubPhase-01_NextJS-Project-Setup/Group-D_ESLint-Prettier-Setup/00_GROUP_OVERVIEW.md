# Group D: ESLint & Prettier Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** D of F  
> **Tasks Covered:** 47-62  
> **Group Goal:** Configure ESLint with TypeScript, React, accessibility rules, and Prettier integration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_App-Router-Structure](../Group-C_App-Router-Structure/)
- **→ Next Group:** [Group-E_Environment-Build-Configuration](../Group-E_Environment-Build-Configuration/)

---

## Group Overview

This group configures ESLint and Prettier for consistent code quality and formatting. Installs ESLint with Next.js config, TypeScript parser, React hooks plugin, import plugin, and accessibility (jsx-a11y) plugin. Creates comprehensive .eslintrc.json with TypeScript, React, import ordering, and accessibility rules. Installs Prettier with .prettierrc configuration and integrates it with ESLint using eslint-config-prettier and eslint-plugin-prettier. Creates ignore files for both tools.

### Key Outcomes

- ESLint core dependencies installed
- TypeScript ESLint plugins installed
- Additional ESLint plugins (import, jsx-a11y)
- .eslintrc.json with Next.js config
- TypeScript-specific linting rules
- React and React Hooks rules
- Import ordering and validation rules
- Accessibility (jsx-a11y) rules
- .eslintignore file created
- Prettier installed
- .prettierrc configuration
- .prettierignore file created
- eslint-config-prettier installed
- eslint-plugin-prettier installed
- ESLint config updated for Prettier
- Linting setup verified

### Technology Context

- **ESLint:** 8.x with flat config support
- **Prettier:** 3.x
- **TypeScript Parser:** @typescript-eslint/parser
- **Rules:** Next.js core-web-vitals base

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-47-55_ESLint-Configuration.md` | Install ESLint and configure rules | 47-55 |
| 02 | `02_Tasks-56-62_Prettier-Integration.md` | Install Prettier and integrate with ESLint | 56-62 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 47 | Install ESLint Dependencies | Low | Task 06 |
| 48 | Install ESLint TypeScript Plugins | Low | Task 47 |
| 49 | Install Additional ESLint Plugins | Low | Task 47 |
| 50 | Create .eslintrc.json Configuration | Medium | Task 49 |
| 51 | Configure ESLint Rules - TypeScript | Low | Task 50 |
| 52 | Configure ESLint Rules - React | Low | Task 50 |
| 53 | Configure ESLint Rules - Import | Low | Task 50 |
| 54 | Configure ESLint Rules - Accessibility | Low | Task 50 |
| 55 | Create .eslintignore File | Low | Task 50 |
| 56 | Install Prettier | Low | Task 06 |
| 57 | Create .prettierrc Configuration | Low | Task 56 |
| 58 | Create .prettierignore File | Low | Task 56 |
| 59 | Install eslint-config-prettier | Low | Task 56 |
| 60 | Install eslint-plugin-prettier | Low | Task 59 |
| 61 | Update ESLint Config for Prettier | Low | Task 60 |
| 62 | Verify Linting Setup | Low | Task 61 |

---

## Execution Order

```
Task 47: Install ESLint Dependencies
    │
    ├──────────────────────┐
    ▼                      ▼
Task 48               Task 49
(TS plugins)          (additional plugins)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 50: Create .eslintrc.json
               │
               ├──────────────────────────────────┐
               ▼                                  ▼
          Tasks 51-54                        Task 55
          (rules config)                     (.eslintignore)
               │                                  │
               └──────────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
          Task 56                       Task 59
          (Prettier)                    (config-prettier)
               │                             │
               ├────────────┐                ▼
               ▼            ▼           Task 60
          Task 57      Task 58          (plugin-prettier)
          (.prettierrc) (.prettierignore)    │
               │            │                │
               └────────────┴────────────────┘
                              │
                              ▼
                         Task 61: Update ESLint for Prettier
                              │
                              ▼
                         Task 62: Verify Setup
```

---

## Expected Deliverables

```
frontend/
├── .eslintignore
├── .eslintrc.json
├── .prettierignore
└── .prettierrc
```

---

## Notes for AI Agents

### ESLint Dependencies (Tasks 47-49)
| Package | Purpose |
|---------|---------|
| eslint | Core linter |
| eslint-config-next | Next.js rules |
| @typescript-eslint/parser | TypeScript parser |
| @typescript-eslint/eslint-plugin | TypeScript rules |
| eslint-plugin-react-hooks | React Hooks rules |
| eslint-plugin-import | Import validation |
| eslint-plugin-jsx-a11y | Accessibility rules |

### TypeScript Rules (Task 51)
| Rule | Setting | Purpose |
|------|---------|---------|
| @typescript-eslint/no-unused-vars | error | Remove unused |
| @typescript-eslint/no-explicit-any | warn | Discourage any |
| @typescript-eslint/explicit-function-return-type | off | Inferred types OK |

### React Rules (Task 52)
| Rule | Setting | Purpose |
|------|---------|---------|
| react-hooks/rules-of-hooks | error | Enforce hook rules |
| react-hooks/exhaustive-deps | warn | Dependency arrays |
| react/react-in-jsx-scope | off | Not needed (React 17+) |

### Import Rules (Task 53)
| Rule | Setting | Purpose |
|------|---------|---------|
| import/order | warn | Consistent ordering |
| import/no-duplicates | error | No duplicate imports |
| import/newline-after-import | warn | Readability |

### Accessibility Rules (Task 54)
| Rule | Setting | Purpose |
|------|---------|---------|
| jsx-a11y/alt-text | error | Image alt text |
| jsx-a11y/anchor-is-valid | warn | Valid anchors |
| jsx-a11y/click-events-have-key-events | warn | Keyboard access |

### .eslintignore Patterns
```
node_modules/
.next/
out/
build/
coverage/
*.config.js
```

### Prettier Configuration (.prettierrc)
| Option | Value | Purpose |
|--------|-------|---------|
| semi | true | Use semicolons |
| singleQuote | true | Single quotes |
| tabWidth | 2 | 2 spaces |
| trailingComma | "es5" | Trailing commas |
| printWidth | 100 | Line width |

### .prettierignore Patterns
```
node_modules/
.next/
out/
build/
pnpm-lock.yaml
```

### Verification Commands (Task 62)
```bash
pnpm lint
pnpm format
```
