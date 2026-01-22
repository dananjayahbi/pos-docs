# Tasks 63-68: Prettier Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** F - Frontend Formatting - Prettier  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-59-62_Prettier-Installation.md](01_Tasks-59-62_Prettier-Installation.md)
- **→ Next Group:** [../Group-G_Pre-commit-Hooks-Setup/00_GROUP_OVERVIEW.md](../Group-G_Pre-commit-Hooks-Setup/)

---

## Document Overview

This document covers configuring Prettier options, creating .prettierignore, and adding format scripts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Configure Semi | Simple |
| 64 | Configure Tab Width | Simple |
| 65 | Configure Single Quote | Simple |
| 66 | Configure Trailing Comma | Simple |
| 67 | Create .prettierignore | Simple |
| 68 | Add Format Script | Simple |

---

## Task 63: Configure Semi

### Overview
Configure semicolon usage in Prettier.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Set semi option**
   - Use semicolons

2. **Document choice**
   - Why semicolons

### Configuration Addition

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true
}
```

### Semicolon Options

| Value | Behavior |
|-------|----------|
| true | Add semicolons |
| false | Remove semicolons |

### Why Semicolons

| Reason | Benefit |
|--------|---------|
| ASI issues | Avoid automatic semicolon insertion problems |
| Clarity | Explicit statement ends |
| TypeScript | Common convention |
| Safety | Prevent edge cases |

### ASI Edge Case

```javascript
// Without semicolons - potential issue
return
  value  // This returns undefined!

// With semicolons - clear
return value;
```

### Expected Outcome
- Semicolons required
- Consistent style

### Verification Checklist
- [ ] semi = true set
- [ ] Matches team convention

---

## Task 64: Configure Tab Width

### Overview
Configure indentation width in Prettier.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Set tabWidth option**
   - 2 spaces

2. **Set useTabs option**
   - Spaces, not tabs

### Configuration Addition

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "tabWidth": 2,
  "useTabs": false
}
```

### Tab Width Options

| Option | Value | Purpose |
|--------|-------|---------|
| tabWidth | 2 | Spaces per indent |
| useTabs | false | Use spaces |

### Why 2 Spaces

| Reason | Benefit |
|--------|---------|
| Standard | React/Next.js convention |
| Readability | Compact but clear |
| Nesting | Less horizontal scroll |
| Consistency | Matches most projects |

### Expected Outcome
- 2-space indentation
- Spaces, not tabs

### Verification Checklist
- [ ] tabWidth = 2 set
- [ ] useTabs = false set
- [ ] Matches editor settings

---

## Task 65: Configure Single Quote

### Overview
Configure quote style in Prettier.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Set singleQuote option**
   - Single quotes for JS

2. **Set jsxSingleQuote option**
   - Double quotes for JSX

### Configuration Addition

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "jsxSingleQuote": false
}
```

### Quote Options

| Option | Value | Result |
|--------|-------|--------|
| singleQuote | true | `'string'` |
| singleQuote | false | `"string"` |
| jsxSingleQuote | false | `<div className="class">` |

### Why Different for JSX

| Context | Quote | Reason |
|---------|-------|--------|
| JavaScript | Single | Cleaner, fewer escapes |
| JSX | Double | HTML convention |

### Example

```tsx
// JavaScript - single quotes
const name = 'LankaCommerce';

// JSX - double quotes
<Button className="primary" onClick={handleClick}>
  {name}
</Button>
```

### Expected Outcome
- Single quotes in JS
- Double quotes in JSX

### Verification Checklist
- [ ] singleQuote = true
- [ ] jsxSingleQuote = false
- [ ] Consistent throughout

---

## Task 66: Configure Trailing Comma

### Overview
Configure trailing comma behavior in Prettier.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Set trailingComma option**
   - ES5 compatible

2. **Document choice**
   - Why ES5

### Configuration Addition

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "es5"
}
```

### Trailing Comma Options

| Value | Behavior |
|-------|----------|
| "none" | No trailing commas |
| "es5" | Trailing commas in arrays, objects |
| "all" | Trailing commas everywhere (including functions) |

### Why ES5

| Reason | Benefit |
|--------|---------|
| Compatibility | Works in all browsers |
| Git diffs | Cleaner diffs |
| Safe | No edge cases |

### Git Diff Benefit

Without trailing comma:
```diff
  const config = {
    name: 'app',
-   version: '1.0'
+   version: '1.0',
+   author: 'LCC'
  };
```

With trailing comma:
```diff
  const config = {
    name: 'app',
    version: '1.0',
+   author: 'LCC',
  };
```

### Additional Options

```json
{
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "printWidth": 80
}
```

### Expected Outcome
- Trailing commas in ES5 contexts
- Clean git diffs

### Verification Checklist
- [ ] trailingComma = "es5"
- [ ] Cleaner diffs achieved

---

## Task 67: Create .prettierignore

### Overview
Create .prettierignore file to exclude directories from formatting.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Create .prettierignore file**
   - In frontend/ directory

2. **Add exclude patterns**
   - Build outputs, node_modules

3. **Match .eslintignore**
   - Consistency

### File Location

```
frontend/
└── .prettierignore
```

### .prettierignore Content

```
# Build outputs
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Cache
.cache/
.turbo/

# Type declarations
*.d.ts

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Testing
coverage/

# Environment files
.env*

# Generated files
*.generated.ts
*.generated.tsx

# Public assets
public/

# Markdown (optional)
*.md
```

### Patterns Explained

| Pattern | Purpose |
|---------|---------|
| .next/ | Next.js build output |
| node_modules/ | Dependencies |
| *.d.ts | Type declarations |
| pnpm-lock.yaml | Lock files |
| coverage/ | Test coverage |

### Match .eslintignore

Patterns should be consistent:

| .eslintignore | .prettierignore |
|---------------|-----------------|
| .next/ | .next/ |
| out/ | out/ |
| node_modules/ | node_modules/ |
| build/ | build/ |

### Expected Outcome
- .prettierignore created
- Build outputs ignored

### Verification Checklist
- [ ] File created
- [ ] Matches .eslintignore patterns
- [ ] Lock files excluded
- [ ] Build outputs excluded

---

## Task 68: Add Format Script

### Overview
Add format scripts to package.json for easy execution.

### Dependencies
- Task 62: .prettierrc exists

### Instructions

1. **Add format script**
   - Format all files

2. **Add format:check script**
   - Check without changing

3. **Document scripts**
   - In README

### package.json Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Script Descriptions

| Script | Purpose | Usage |
|--------|---------|-------|
| format | Format all files | `npm run format` |
| format:check | Check formatting | CI/CD |

### Command Options

| Option | Purpose |
|--------|---------|
| --write | Write changes to files |
| --check | Check without changing |
| --list-different | List files that differ |

### Additional Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "format:list": "prettier --list-different .",
    "format:staged": "prettier --write --staged"
  }
}
```

### Combined Scripts

```json
{
  "scripts": {
    "fix": "npm run lint:fix && npm run format",
    "check": "npm run lint && npm run format:check"
  }
}
```

### Documentation Update

Add to frontend/README.md:

```markdown
## Formatting

This project uses Prettier for code formatting.

### Commands

```bash
# Format all files
npm run format

# Check formatting (CI)
npm run format:check
```

### Configuration

Prettier is configured in `.prettierrc`:
- Semicolons: required
- Quotes: single (JS), double (JSX)
- Tab width: 2 spaces
- Trailing commas: ES5

### IDE Setup

Install Prettier extension and enable format on save.
```

### CI/CD Integration

```yaml
# .github/workflows/format.yml
format:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Install dependencies
      run: npm ci
    - name: Check formatting
      run: npm run format:check
```

### Expected Outcome
- Format scripts added
- Easy to format code

### Verification Checklist
- [ ] format script added
- [ ] format:check script added
- [ ] Scripts work correctly
- [ ] README updated

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Configure Semi | Semicolons required |
| 64 | Configure Tab Width | 2-space indentation |
| 65 | Configure Single Quote | Single/double quotes |
| 66 | Configure Trailing Comma | ES5 trailing commas |
| 67 | Create .prettierignore | Ignore patterns |
| 68 | Add Format Script | npm scripts |

### Group F Complete

All 10 tasks for Prettier setup are complete:

| Task | Description | Status |
|------|-------------|--------|
| 59 | Install Prettier | ✅ |
| 60 | Install eslint-config-prettier | ✅ |
| 61 | Install eslint-plugin-prettier | ✅ |
| 62 | Create .prettierrc | ✅ |
| 63 | Configure Semi | ✅ |
| 64 | Configure Tab Width | ✅ |
| 65 | Configure Single Quote | ✅ |
| 66 | Configure Trailing Comma | ✅ |
| 67 | Create .prettierignore | ✅ |
| 68 | Add Format Script | ✅ |

### Complete .prettierrc

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "printWidth": 80
}
```

### package.json Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "fix": "npm run lint:fix && npm run format",
    "check": "npm run lint && npm run format:check"
  }
}
```

### Files Created

```
frontend/
├── .prettierrc        # Prettier configuration
├── .prettierignore    # Ignore patterns
├── .eslintrc.json     # Updated with prettier
└── package.json       # Updated with format scripts
```

### Next Steps
Proceed to [Group G: Pre-commit Hooks Setup](../Group-G_Pre-commit-Hooks-Setup/00_GROUP_OVERVIEW.md) for pre-commit hooks.

---

## Notes for AI Agents

1. **Opinionated:** Prettier is intentionally opinionated
2. **ES5:** Use for trailing comma compatibility
3. **Quotes:** Single for JS, double for JSX
4. **Tab width:** 2 is JavaScript standard
5. **Ignore:** Match .eslintignore patterns
6. **CI/CD:** Use format:check in pipelines
7. **Integration:** Works through ESLint
