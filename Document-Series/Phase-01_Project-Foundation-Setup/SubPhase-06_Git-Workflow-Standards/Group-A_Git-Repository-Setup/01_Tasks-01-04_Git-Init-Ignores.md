# Tasks 01-04: Git Init and Ignores

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** A - Git Repository Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous SubPhase:** [../../SubPhase-05_Code-Quality-Linting-Setup/Group-H_Editor-Configuration-Verification/03_Tasks-92-94_Final-Verification.md](../../SubPhase-05_Code-Quality-Linting-Setup/Group-H_Editor-Configuration-Verification/03_Tasks-92-94_Final-Verification.md)
- **→ Next Document:** [02_Tasks-05-08_Attributes-Commit.md](02_Tasks-05-08_Attributes-Commit.md)

---

## Document Overview

This document covers Git initialization and base ignore patterns.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Initialize Git Repository | Simple |
| 02 | Create .gitignore (Root) | Medium |
| 03 | Add Python Ignores | Simple |
| 04 | Add Node.js Ignores | Simple |

---

## Task 01: Initialize Git Repository

### Overview
Initialize Git repository at the monorepo root.

### Dependencies
- SubPhase-01: Monorepo structure exists

### Instructions

1. **Navigate to root**
   - Project root directory

2. **Initialize repository**
   - Run git init

3. **Verify initialization**
   - Check .git directory exists

### Initialization Commands

```bash
# Navigate to project root
cd /path/to/lankacommerce-cloud

# Initialize Git repository
git init

# Verify initialization
ls -la .git
```

### Skip If Already Initialized

```bash
# Check if already initialized
if [ -d ".git" ]; then
    echo "Git already initialized"
else
    git init
fi
```

### Initial Configuration

```bash
# Set user name (local)
git config user.name "Developer Name"

# Set user email (local)
git config user.email "developer@example.com"

# Set default branch
git config init.defaultBranch main
```

### Directory Structure After Init

```
/                            # Repository root
├── .git/                    # Git internal directory
│   ├── HEAD
│   ├── config
│   ├── hooks/
│   ├── objects/
│   └── refs/
├── backend/
├── frontend/
└── ...
```

### Expected Outcome
- Git repository initialized
- .git directory created

### Verification Checklist
- [ ] git init successful
- [ ] .git directory exists
- [ ] git status works

---

## Task 02: Create .gitignore (Root)

### Overview
Create comprehensive .gitignore file at repository root.

### Dependencies
- Task 01: Git repository initialized

### Instructions

1. **Create .gitignore**
   - At repository root

2. **Add header**
   - Document sections

3. **Add general patterns**
   - OS files, logs

### Initial .gitignore Structure

```gitignore
# ==================================================
# LankaCommerce Cloud - Git Ignore Patterns
# ==================================================
# Comprehensive ignore patterns for monorepo
# ==================================================

# -------------------------------------------------
# Operating System
# -------------------------------------------------
# macOS
.DS_Store
.AppleDouble
.LSOverride
._*

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk

# Linux
*~
.directory
.Trash-*

# -------------------------------------------------
# Logs and Debugging
# -------------------------------------------------
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
debug/
logs/

# -------------------------------------------------
# Editor Backup Files
# -------------------------------------------------
*.bak
*.backup
*.tmp
*.temp
*~

# -------------------------------------------------
# Temporary Files
# -------------------------------------------------
tmp/
temp/
.tmp/
.temp/
```

### File Location

```
/                            # Repository root
├── .gitignore               # Ignore patterns
├── backend/
├── frontend/
└── ...
```

### Why Root-Level .gitignore

| Reason | Benefit |
|--------|---------|
| Single source | All patterns in one place |
| Easy maintenance | One file to update |
| Coverage | Covers entire monorepo |

### Expected Outcome
- .gitignore created
- Base patterns added

### Verification Checklist
- [ ] File created at root
- [ ] OS patterns added
- [ ] Log patterns added
- [ ] Temp patterns added

---

## Task 03: Add Python Ignores

### Overview
Add Python-specific ignore patterns for the backend.

### Dependencies
- Task 02: .gitignore exists

### Instructions

1. **Add Python section**
   - Bytecode, cache

2. **Add virtual environment**
   - venv patterns

3. **Add build artifacts**
   - dist, eggs

### .gitignore Python Section

```gitignore
# -------------------------------------------------
# Python
# -------------------------------------------------
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual environments
venv/
.venv/
ENV/
env/
.env.venv/

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/
pytest_cache/

# Type checker caches
.mypy_cache/
.dmypy.json
dmypy.json
.pyre/
.ruff_cache/

# Jupyter Notebook
.ipynb_checkpoints

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal

# Celery
celerybeat-schedule
celerybeat.pid
```

### Python Patterns Explained

| Pattern | Purpose |
|---------|---------|
| `__pycache__/` | Compiled Python files |
| `*.py[cod]` | .pyc, .pyo, .pyd files |
| `venv/` | Virtual environment |
| `.mypy_cache/` | Type checker cache |
| `.pytest_cache/` | Test cache |

### Expected Outcome
- Python patterns added
- Build artifacts ignored

### Verification Checklist
- [ ] __pycache__ ignored
- [ ] venv ignored
- [ ] Django files covered
- [ ] Test caches ignored

---

## Task 04: Add Node.js Ignores

### Overview
Add Node.js-specific ignore patterns for the frontend.

### Dependencies
- Task 02: .gitignore exists

### Instructions

1. **Add Node.js section**
   - node_modules

2. **Add build outputs**
   - .next, dist

3. **Add package manager**
   - Lock files (keep main)

### .gitignore Node.js Section

```gitignore
# -------------------------------------------------
# Node.js
# -------------------------------------------------
# Dependencies
node_modules/
.npm/
.pnpm-store/
.yarn/
!.yarn/releases
!.yarn/patches
!.yarn/plugins
!.yarn/sdks
!.yarn/versions

# Build outputs
.next/
out/
dist/
build/
.nuxt/
.turbo/
.vercel/
.output/

# Cache
.cache/
.parcel-cache/
.eslintcache
.stylelintcache
*.tsbuildinfo
next-env.d.ts

# Environment (handled separately)
# .env files in environment section

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Testing
coverage/
.nyc_output/

# TypeScript
*.tsbuildinfo

# Optional npm cache directory
.npm/

# Optional eslint cache
.eslintcache

# Storybook
storybook-static/

# Playwright
playwright-report/
playwright/.cache/
test-results/
```

### Node.js Patterns Explained

| Pattern | Purpose |
|---------|---------|
| `node_modules/` | Dependencies |
| `.next/` | Next.js build |
| `dist/` | Build output |
| `coverage/` | Test coverage |
| `.turbo/` | Turbo cache |

### Lock File Strategy

Keep main lock file:
```gitignore
# Keep lock files (do NOT ignore)
# package-lock.json
# yarn.lock
# pnpm-lock.yaml
```

### Expected Outcome
- Node.js patterns added
- Dependencies ignored

### Verification Checklist
- [ ] node_modules ignored
- [ ] Build outputs ignored
- [ ] Cache files ignored
- [ ] Lock files NOT ignored

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Initialize Git Repository | .git/ directory |
| 02 | Create .gitignore | Base patterns |
| 03 | Add Python Ignores | Backend patterns |
| 04 | Add Node.js Ignores | Frontend patterns |

### .gitignore Progress

```
Sections Added:
├── Operating System (macOS, Windows, Linux)
├── Logs and Debugging
├── Editor Backup Files
├── Temporary Files
├── Python (comprehensive)
└── Node.js (comprehensive)
```

### Next Steps
Proceed to [02_Tasks-05-08_Attributes-Commit.md](02_Tasks-05-08_Attributes-Commit.md) for IDE ignores, environment ignores, .gitattributes, and initial commit.

---

## Notes for AI Agents

1. **Skip init:** If .git exists, skip git init
2. **Single file:** All ignores in root .gitignore
3. **Comments:** Use section headers
4. **Lock files:** Keep package-lock.json
5. **Patterns:** Use patterns, not file lists
6. **Coverage:** Cover all project types
