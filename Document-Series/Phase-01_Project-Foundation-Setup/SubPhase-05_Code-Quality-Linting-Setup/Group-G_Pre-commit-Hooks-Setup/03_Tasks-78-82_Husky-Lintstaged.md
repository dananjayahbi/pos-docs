# Tasks 78-82: Husky and lint-staged Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** G - Pre-commit Hooks Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-75-77_Precommit-Utility.md](02_Tasks-75-77_Precommit-Utility.md)
- **→ Next Group:** [../Group-H_Editor-Configuration-Verification/00_GROUP_OVERVIEW.md](../Group-H_Editor-Configuration-Verification/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers setting up Husky and lint-staged for frontend hooks.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 78 | Install Husky | Simple |
| 79 | Configure lint-staged | Medium |
| 80 | Add ESLint to lint-staged | Simple |
| 81 | Add Prettier to lint-staged | Simple |
| 82 | Install Git Hooks | Simple |

---

## Task 78: Install Husky

### Overview
Install Husky for Git hooks in the frontend project.

### Dependencies
- Task 03: Frontend project initialized (Phase-01, SubPhase-03)

### Instructions

1. **Navigate to frontend**
   - Change to frontend directory

2. **Install Husky**
   - Add as dev dependency

3. **Initialize Husky**
   - Create .husky directory

### Installation Commands

```bash
cd frontend

# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky init
```

### Package.json Addition

```json
{
  "devDependencies": {
    "husky": "^9.0.0"
  }
}
```

### Directory Structure After Init

```
frontend/
├── .husky/
│   ├── _/
│   │   └── husky.sh
│   └── pre-commit
├── package.json
└── ...
```

### Husky Features

| Feature | Description |
|---------|-------------|
| Fast | Native Git hooks |
| Modern | No dependencies at runtime |
| Portable | Works on all platforms |
| Simple | Easy configuration |

### Version Requirements

| Package | Version | Notes |
|---------|---------|-------|
| husky | >=9.0.0 | Latest major version |
| Node.js | >=18.0.0 | Required for Husky 9 |

### Expected Outcome
- Husky installed
- .husky directory created

### Verification Checklist
- [ ] husky in devDependencies
- [ ] .husky directory exists
- [ ] .husky/_/husky.sh exists

---

## Task 79: Configure lint-staged

### Overview
Install and configure lint-staged for running linters on staged files.

### Dependencies
- Task 78: Husky installed

### Instructions

1. **Install lint-staged**
   - Add as dev dependency

2. **Add configuration**
   - In package.json

3. **Define file patterns**
   - TypeScript, JavaScript

### Installation Command

```bash
npm install --save-dev lint-staged
```

### Package.json Addition

```json
{
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [],
    "*.{json,css,scss,md}": []
  }
}
```

### What lint-staged Does

| Feature | Description |
|---------|-------------|
| Staged only | Runs on git staged files |
| Fast | Only changed files |
| Multiple linters | Chain commands |
| Partial staging | Handles partial stages |

### File Patterns

| Pattern | Files Matched |
|---------|---------------|
| `*.{js,jsx,ts,tsx}` | JavaScript/TypeScript |
| `*.{json,css,scss,md}` | Data and style files |
| `*.{html,vue}` | Template files |

### Alternative: Separate Config File

Can use .lintstagedrc.json:
```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

### Expected Outcome
- lint-staged installed
- Configuration added

### Verification Checklist
- [ ] lint-staged in devDependencies
- [ ] Configuration in package.json
- [ ] File patterns defined

---

## Task 80: Add ESLint to lint-staged

### Overview
Configure lint-staged to run ESLint on staged JavaScript/TypeScript files.

### Dependencies
- Task 79: lint-staged configured

### Instructions

1. **Add ESLint command**
   - For JS/TS files

2. **Include fix flag**
   - Auto-fix issues

3. **Max warnings**
   - Fail on warnings

### Package.json Update

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings=0"
    ]
  }
}
```

### ESLint Options

| Option | Purpose |
|--------|---------|
| --fix | Auto-fix issues |
| --max-warnings=0 | Fail on warnings |

### Why --max-warnings=0

| Without | With |
|---------|------|
| Warnings pass | Warnings fail |
| Noise accumulates | Clean codebase |

### Excluding Files

ESLint uses .eslintignore:
```
node_modules/
.next/
out/
dist/
coverage/
```

### Expected Outcome
- ESLint runs on staged files
- Auto-fixes applied

### Verification Checklist
- [ ] ESLint command added
- [ ] --fix flag included
- [ ] --max-warnings=0 set

---

## Task 81: Add Prettier to lint-staged

### Overview
Configure lint-staged to run Prettier on staged files.

### Dependencies
- Task 79: lint-staged configured

### Instructions

1. **Add Prettier command**
   - For all supported files

2. **Include write flag**
   - Modify files

3. **Check ignores**
   - Respect .prettierignore

### Package.json Update

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "*.{json,css,scss,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Execution Order

lint-staged runs commands in order:
1. ESLint --fix (for JS/TS)
2. Prettier --write (for all)

### Prettier Options

| Option | Purpose |
|--------|---------|
| --write | Modify files in place |
| --ignore-unknown | Skip unsupported files |

### File Coverage

| Pattern | Prettier Runs |
|---------|---------------|
| *.js, *.jsx | Yes |
| *.ts, *.tsx | Yes |
| *.json | Yes |
| *.css, *.scss | Yes |
| *.md | Yes |
| *.yml, *.yaml | Yes |

### Expected Outcome
- Prettier runs on staged files
- Files formatted

### Verification Checklist
- [ ] Prettier command added
- [ ] --write flag included
- [ ] All file types covered

---

## Task 82: Install Git Hooks

### Overview
Configure the pre-commit hook to run lint-staged.

### Dependencies
- Task 81: lint-staged fully configured

### Instructions

1. **Edit pre-commit hook**
   - In .husky/pre-commit

2. **Add lint-staged command**
   - Run on commit

3. **Test the hook**
   - Make a test commit

### .husky/pre-commit File

```bash
#!/usr/bin/env sh

# LankaCommerce Cloud - Pre-commit Hook
# Runs lint-staged on staged files

npx lint-staged
```

### Alternative: Package.json Script

Add prepare script:
```json
{
  "scripts": {
    "prepare": "husky",
    "lint-staged": "lint-staged"
  }
}
```

### How It Works

1. Developer stages files
2. Runs `git commit`
3. Husky triggers pre-commit
4. lint-staged runs on staged files
5. ESLint and Prettier run
6. Commit completes or fails

### Testing the Hook

```bash
# Stage a file
git add src/App.tsx

# Try to commit
git commit -m "Test commit"

# Should see lint-staged output
```

### Bypassing Hooks

For emergencies:
```bash
git commit --no-verify -m "Emergency fix"
```

### Expected Outcome
- Git hooks installed
- Pre-commit runs lint-staged

### Verification Checklist
- [ ] pre-commit hook created
- [ ] npx lint-staged command
- [ ] Test commit works

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 78 | Install Husky | Git hooks framework |
| 79 | Configure lint-staged | Staged file linting |
| 80 | Add ESLint | JS/TS linting |
| 81 | Add Prettier | Formatting |
| 82 | Install Git Hooks | Pre-commit hook |

### Complete Frontend Configuration

**Package.json additions:**
```json
{
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "*.{json,css,scss,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

**.husky/pre-commit:**
```bash
#!/usr/bin/env sh
npx lint-staged
```

### Frontend Structure After Setup

```
frontend/
├── .husky/
│   ├── _/
│   │   └── husky.sh
│   └── pre-commit
├── .eslintrc.json
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── package.json
└── ...
```

### Next Steps
Proceed to [../Group-H_Editor-Configuration-Verification/00_GROUP_OVERVIEW.md](../Group-H_Editor-Configuration-Verification/00_GROUP_OVERVIEW.md) for editor setup.

---

## Notes for AI Agents

1. **Directory:** All commands in frontend/
2. **Order:** Husky → lint-staged → hooks
3. **ESLint first:** Run before Prettier
4. **Versions:** Husky 9.x, lint-staged 15.x
5. **Testing:** Always test with real commit
6. **Bypass:** Use --no-verify for emergencies
