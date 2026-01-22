# Tasks 43-48: ESLint Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** E - Frontend Linting - ESLint  
> **Document:** 01 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Backend-Type-Checking-mypy/03_Tasks-40-42_mypy-Verification.md](../Group-D_Backend-Type-Checking-mypy/03_Tasks-40-42_mypy-Verification.md)
- **→ Next Document:** [02_Tasks-49-54_ESLint-Configuration.md](02_Tasks-49-54_ESLint-Configuration.md)

---

## Document Overview

This document covers installing ESLint with all necessary plugins for Next.js/React/TypeScript.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Install ESLint | Simple |
| 44 | Install ESLint Plugins | Simple |
| 45 | Install eslint-plugin-react | Simple |
| 46 | Install eslint-plugin-react-hooks | Simple |
| 47 | Install @typescript-eslint/parser | Simple |
| 48 | Install @typescript-eslint/eslint-plugin | Simple |

---

## Task 43: Install ESLint

### Overview
Install ESLint as a development dependency for frontend linting.

### Dependencies
- SubPhase-03: Frontend Project Initialization

### Instructions

1. **Check existing ESLint**
   - Next.js may include it

2. **Install/update ESLint**
   - Latest stable version

3. **Verify installation**
   - Check version

### Check Existing Installation

Next.js projects typically include ESLint:

```bash
# Check if ESLint is installed
npm list eslint

# Check package.json
cat package.json | grep eslint
```

### Installation Method

If not installed or needs update:

```bash
# Install ESLint
npm install -D eslint@^8.0.0

# Or with pnpm
pnpm add -D eslint@^8.0.0
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| eslint | ^8.0.0 | JavaScript linter |

### Verification

```bash
# Check version
npx eslint --version

# Expected output
v8.x.x
```

### Expected Outcome
- ESLint installed
- Version 8.x available

### Verification Checklist
- [ ] ESLint in package.json devDependencies
- [ ] Version 8.x or higher
- [ ] CLI works

---

## Task 44: Install ESLint Plugins

### Overview
Install essential ESLint plugins for Next.js project.

### Dependencies
- Task 43: ESLint installed

### Instructions

1. **Install eslint-config-next**
   - Next.js configuration

2. **Install import plugin**
   - Import ordering

3. **Verify installations**
   - Check package.json

### Installation Method

```bash
# Install Next.js ESLint config (usually included)
npm install -D eslint-config-next

# Install import plugin
npm install -D eslint-plugin-import

# Or all at once
npm install -D eslint-config-next eslint-plugin-import
```

### Plugin Purposes

| Plugin | Purpose |
|--------|---------|
| eslint-config-next | Next.js rules and core-web-vitals |
| eslint-plugin-import | Import/export linting |

### What eslint-config-next Includes

| Feature | Rule Set |
|---------|----------|
| Core Web Vitals | Performance rules |
| React | React best practices |
| React Hooks | Hooks rules |
| Next.js | Next-specific rules |

### Expected Outcome
- Core plugins installed
- Next.js config available

### Verification Checklist
- [ ] eslint-config-next installed
- [ ] eslint-plugin-import installed
- [ ] Compatible versions

---

## Task 45: Install eslint-plugin-react

### Overview
Install React-specific ESLint plugin for enhanced React linting.

### Dependencies
- Task 43: ESLint installed

### Instructions

1. **Install React plugin**
   - Enhanced React rules

2. **Verify installation**
   - Check package.json

### Installation Method

```bash
# Install React plugin
npm install -D eslint-plugin-react

# Verify
npm list eslint-plugin-react
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| eslint-plugin-react | ^7.0.0 | React-specific rules |

### What React Plugin Provides

| Rule Category | Examples |
|---------------|----------|
| JSX | jsx-uses-react, jsx-key |
| Props | prop-types, require-default-props |
| Components | prefer-stateless-function |
| Hooks | (separate plugin) |

### Note on Next.js

eslint-config-next may already include eslint-plugin-react. Installing explicitly ensures latest version and custom configuration.

### Expected Outcome
- React plugin installed
- React rules available

### Verification Checklist
- [ ] eslint-plugin-react in devDependencies
- [ ] Version 7.x or higher
- [ ] No conflicts with Next.js config

---

## Task 46: Install eslint-plugin-react-hooks

### Overview
Install React Hooks ESLint plugin for hooks rules.

### Dependencies
- Task 43: ESLint installed

### Instructions

1. **Install React Hooks plugin**
   - Hooks-specific rules

2. **Verify installation**
   - Check package.json

### Installation Method

```bash
# Install React Hooks plugin
npm install -D eslint-plugin-react-hooks

# Verify
npm list eslint-plugin-react-hooks
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| eslint-plugin-react-hooks | ^4.0.0 | React Hooks rules |

### What React Hooks Plugin Provides

| Rule | Purpose |
|------|---------|
| rules-of-hooks | Enforce Hooks rules |
| exhaustive-deps | Verify effect dependencies |

### Rules of Hooks

| Rule | Description |
|------|-------------|
| Only call at top level | No hooks in loops/conditions |
| Only call from React functions | Components or custom hooks |

### Example Violations

```typescript
// Bad: Hook in condition
if (condition) {
  const [state, setState] = useState(0); // Error
}

// Bad: Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // Warning: userId missing
```

### Expected Outcome
- React Hooks plugin installed
- Hooks rules available

### Verification Checklist
- [ ] eslint-plugin-react-hooks in devDependencies
- [ ] Version 4.x or higher
- [ ] Rules of hooks enabled

---

## Task 47: Install @typescript-eslint/parser

### Overview
Install TypeScript parser for ESLint to understand TypeScript syntax.

### Dependencies
- Task 43: ESLint installed

### Instructions

1. **Install TypeScript parser**
   - TypeScript syntax support

2. **Verify installation**
   - Check package.json

### Installation Method

```bash
# Install TypeScript parser
npm install -D @typescript-eslint/parser

# Verify
npm list @typescript-eslint/parser
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| @typescript-eslint/parser | ^7.0.0 | TypeScript parsing |

### Why Parser is Needed

| Without Parser | With Parser |
|----------------|-------------|
| Syntax errors on TS files | Full TS support |
| No type info | Type-aware rules |
| Limited checking | Complete checking |

### Parser Configuration

Will be configured in .eslintrc.json:
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

### Expected Outcome
- TypeScript parser installed
- Can parse .ts/.tsx files

### Verification Checklist
- [ ] @typescript-eslint/parser in devDependencies
- [ ] Version 7.x or higher
- [ ] Compatible with TypeScript version

---

## Task 48: Install @typescript-eslint/eslint-plugin

### Overview
Install TypeScript ESLint plugin for TypeScript-specific rules.

### Dependencies
- Task 47: TypeScript parser installed

### Instructions

1. **Install TypeScript plugin**
   - TypeScript rules

2. **Verify installation**
   - Check package.json

### Installation Method

```bash
# Install TypeScript plugin
npm install -D @typescript-eslint/eslint-plugin

# Verify
npm list @typescript-eslint/eslint-plugin
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| @typescript-eslint/eslint-plugin | ^7.0.0 | TypeScript rules |

### What TypeScript Plugin Provides

| Rule Category | Examples |
|---------------|----------|
| Type Safety | no-explicit-any, no-unsafe-assignment |
| Best Practices | prefer-nullish-coalescing, no-floating-promises |
| Stylistic | consistent-type-imports, naming-convention |

### Key Rules

| Rule | Purpose |
|------|---------|
| no-unused-vars | Better than ESLint's version |
| explicit-function-return-type | Require return types |
| no-explicit-any | Discourage any type |

### Complete Installation Command

All packages at once:
```bash
npm install -D \
  eslint \
  eslint-config-next \
  eslint-plugin-import \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin
```

### Expected Outcome
- TypeScript plugin installed
- TypeScript rules available

### Verification Checklist
- [ ] @typescript-eslint/eslint-plugin in devDependencies
- [ ] Same version as parser
- [ ] Compatible versions

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 43 | Install ESLint | Base linter |
| 44 | Install ESLint Plugins | Next.js, import |
| 45 | Install eslint-plugin-react | React rules |
| 46 | Install eslint-plugin-react-hooks | Hooks rules |
| 47 | Install @typescript-eslint/parser | TypeScript parsing |
| 48 | Install @typescript-eslint/eslint-plugin | TypeScript rules |

### package.json devDependencies

```json
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

### Next Steps
Proceed to [02_Tasks-49-54_ESLint-Configuration.md](02_Tasks-49-54_ESLint-Configuration.md) for ESLint configuration.

---

## Notes for AI Agents

1. **Next.js:** May already have some packages
2. **Version matching:** Parser and plugin must match
3. **Config-next:** Includes many plugins already
4. **Order:** Install parser before plugin
5. **pnpm/npm:** Use project's package manager
6. **Lock file:** Commit updated lock file
