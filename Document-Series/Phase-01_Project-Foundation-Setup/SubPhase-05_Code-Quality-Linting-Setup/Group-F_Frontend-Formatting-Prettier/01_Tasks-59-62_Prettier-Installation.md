# Tasks 59-62: Prettier Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** F - Frontend Formatting - Prettier  
> **Document:** 01 of 02  
> **Tasks Covered:** 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Frontend-Linting-ESLint/03_Tasks-55-58_ESLint-Verification.md](../Group-E_Frontend-Linting-ESLint/03_Tasks-55-58_ESLint-Verification.md)
- **→ Next Document:** [02_Tasks-63-68_Prettier-Configuration.md](02_Tasks-63-68_Prettier-Configuration.md)

---

## Document Overview

This document covers installing Prettier with ESLint integration packages.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 59 | Install Prettier | Simple |
| 60 | Install eslint-config-prettier | Simple |
| 61 | Install eslint-plugin-prettier | Simple |
| 62 | Create .prettierrc | Simple |

---

## Task 59: Install Prettier

### Overview
Install Prettier as a development dependency for code formatting.

### Dependencies
- SubPhase-03: Frontend Project Initialization

### Instructions

1. **Install Prettier**
   - Latest stable version

2. **Verify installation**
   - Check version

3. **Check CLI**
   - Ensure available

### Installation Method

```bash
# Install Prettier
npm install -D prettier

# Or with pnpm
pnpm add -D prettier
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| prettier | ^3.0.0 | Code formatter |

### Verification

```bash
# Check version
npx prettier --version

# Expected output
3.x.x
```

### Why Prettier

| Feature | Benefit |
|---------|---------|
| Opinionated | No style debates |
| Consistent | Same output every time |
| Wide support | JS, TS, CSS, JSON, MD |
| IDE integration | Format on save |

### Expected Outcome
- Prettier installed
- Version 3.x available

### Verification Checklist
- [ ] prettier in devDependencies
- [ ] Version 3.x or higher
- [ ] CLI works

---

## Task 60: Install eslint-config-prettier

### Overview
Install ESLint config that disables rules conflicting with Prettier.

### Dependencies
- Task 43: ESLint installed (Group E)
- Task 59: Prettier installed

### Instructions

1. **Install config package**
   - Disables conflicting rules

2. **Understand purpose**
   - Prevents ESLint-Prettier conflicts

3. **Update ESLint extends**
   - Add to .eslintrc.json

### Installation Method

```bash
# Install eslint-config-prettier
npm install -D eslint-config-prettier
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| eslint-config-prettier | ^9.0.0 | Disable conflicts |

### How It Works

| Without Config | With Config |
|----------------|-------------|
| ESLint and Prettier fight | Rules coexist |
| Constant reformatting | Stable output |
| Confusing errors | Clean workflow |

### Conflicting Rules Disabled

| ESLint Rule | Prettier Handles |
|-------------|------------------|
| semi | ✅ |
| quotes | ✅ |
| indent | ✅ |
| comma-dangle | ✅ |
| max-len | ✅ |

### Update ESLint Configuration

Add "prettier" to extends array in .eslintrc.json:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ]
}
```

**Important:** "prettier" must be LAST in extends array.

### Expected Outcome
- Config installed
- ESLint extends updated

### Verification Checklist
- [ ] eslint-config-prettier installed
- [ ] "prettier" added to extends
- [ ] "prettier" is last in array

---

## Task 61: Install eslint-plugin-prettier

### Overview
Install ESLint plugin that runs Prettier as an ESLint rule.

### Dependencies
- Task 60: eslint-config-prettier installed

### Instructions

1. **Install plugin package**
   - Runs Prettier via ESLint

2. **Configure in ESLint**
   - Add to plugins

3. **Enable rule**
   - Set to error

### Installation Method

```bash
# Install eslint-plugin-prettier
npm install -D eslint-plugin-prettier
```

### Version Requirements

| Package | Version | Purpose |
|---------|---------|---------|
| eslint-plugin-prettier | ^5.0.0 | Run Prettier in ESLint |

### How It Works

| Without Plugin | With Plugin |
|----------------|-------------|
| Run ESLint and Prettier separately | Single command |
| Two different outputs | Unified output |
| IDE shows different issues | All in one |

### Update ESLint Configuration

Add to .eslintrc.json:

```json
{
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "import",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### Alternative: Recommended Config

Can use recommended config instead:

```json
{
  "extends": [
    "...",
    "plugin:prettier/recommended"
  ]
}
```

This automatically:
- Extends "prettier"
- Adds "prettier" to plugins
- Sets "prettier/prettier" to "error"

### Complete Installation Command

All Prettier packages at once:
```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

### Expected Outcome
- Plugin installed
- ESLint runs Prettier

### Verification Checklist
- [ ] eslint-plugin-prettier installed
- [ ] Plugin added to ESLint
- [ ] Rule enabled
- [ ] ESLint shows Prettier errors

---

## Task 62: Create .prettierrc

### Overview
Create Prettier configuration file in frontend directory.

### Dependencies
- Task 59: Prettier installed

### Instructions

1. **Create .prettierrc file**
   - In frontend/ directory

2. **Add base structure**
   - JSON format

3. **Schema for IntelliSense**
   - VS Code support

### File Location

```
frontend/
└── .prettierrc
```

### Initial .prettierrc

```json
{
  "$schema": "https://json.schemastore.org/prettierrc"
}
```

### Configuration File Options

| File Name | Format |
|-----------|--------|
| .prettierrc | JSON |
| .prettierrc.json | JSON |
| .prettierrc.js | JavaScript |
| prettier.config.js | JavaScript |

Using .prettierrc (JSON) for simplicity.

### Why JSON Configuration

| Benefit | Description |
|---------|-------------|
| Simple | Easy to understand |
| Schema | IDE IntelliSense |
| Standard | Most common format |
| Portable | Works everywhere |

### Expected Outcome
- .prettierrc created
- Ready for configuration

### Verification Checklist
- [ ] File created in frontend/
- [ ] Valid JSON format
- [ ] Schema included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 59 | Install Prettier | Formatter installed |
| 60 | Install eslint-config-prettier | Conflict resolution |
| 61 | Install eslint-plugin-prettier | ESLint integration |
| 62 | Create .prettierrc | Configuration file |

### package.json devDependencies

```json
{
  "devDependencies": {
    "prettier": "^3.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0"
  }
}
```

### Updated .eslintrc.json

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ]
}
```

### Next Steps
Proceed to [02_Tasks-63-68_Prettier-Configuration.md](02_Tasks-63-68_Prettier-Configuration.md) for Prettier options.

---

## Notes for AI Agents

1. **Version:** Use Prettier 3.x (latest stable)
2. **Order:** "prettier" must be last in extends
3. **Recommended config:** Use plugin:prettier/recommended
4. **Integration:** Runs Prettier through ESLint
5. **Format:** Use JSON for configuration
6. **Schema:** Include for IntelliSense
