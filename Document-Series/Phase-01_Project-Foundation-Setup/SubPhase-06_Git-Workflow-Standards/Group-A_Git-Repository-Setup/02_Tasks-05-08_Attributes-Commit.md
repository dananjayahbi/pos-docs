# Tasks 05-08: Attributes and Initial Commit

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** A - Git Repository Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Git-Init-Ignores.md](01_Tasks-01-04_Git-Init-Ignores.md)
- **→ Next Group:** [../Group-B_Branching-Strategy-Definition/00_GROUP_OVERVIEW.md](../Group-B_Branching-Strategy-Definition/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers IDE ignores, environment ignores, .gitattributes, and initial commit.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Add IDE Ignores | Simple |
| 06 | Add Environment Ignores | Simple |
| 07 | Create .gitattributes | Simple |
| 08 | Create Initial Commit | Simple |

---

## Task 05: Add IDE Ignores

### Overview
Add IDE and editor-specific ignore patterns.

### Dependencies
- Task 02: .gitignore exists

### Instructions

1. **Add IDE section**
   - VS Code, JetBrains

2. **Add editor patterns**
   - Vim, Sublime

3. **Exclude settings to track**
   - Use negation patterns

### .gitignore IDE Section

```gitignore
# -------------------------------------------------
# IDE / Editors
# -------------------------------------------------
# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/
*.vsix

# JetBrains IDEs (IntelliJ, PyCharm, WebStorm)
.idea/
*.iml
*.ipr
*.iws
out/
.idea_modules/

# Sublime Text
*.sublime-project
*.sublime-workspace

# Vim
*.swp
*.swo
*.swn
*.vim
*~
Session.vim
.netrwhist
tags

# Emacs
*~
\#*\#
/.emacs.desktop
/.emacs.desktop.lock
*.elc
auto-save-list
tramp
.\#*

# TextMate
*.tmproj
*.tmproject
tmtags

# Notepad++
*.npp
nppBackup/
```

### VS Code Exception Pattern

Keep shared settings but ignore personal:
```gitignore
.vscode/*              # Ignore all
!.vscode/settings.json # Keep workspace settings
!.vscode/extensions.json # Keep recommendations
```

### Why Track Some VS Code Files

| File | Reason to Track |
|------|-----------------|
| settings.json | Team consistency |
| extensions.json | Recommended extensions |
| tasks.json | Shared build tasks |
| launch.json | Debug configurations |

### Expected Outcome
- IDE patterns added
- Shared settings tracked

### Verification Checklist
- [ ] VS Code patterns added
- [ ] JetBrains patterns added
- [ ] Vim/Emacs covered
- [ ] Exception patterns work

---

## Task 06: Add Environment Ignores

### Overview
Add environment and secrets ignore patterns.

### Dependencies
- Task 02: .gitignore exists

### Instructions

1. **Add environment section**
   - .env files

2. **Add secrets**
   - Keys, credentials

3. **Add Docker patterns**
   - Overrides, volumes

### .gitignore Environment Section

```gitignore
# -------------------------------------------------
# Environment Variables
# -------------------------------------------------
# Environment files (contain secrets)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging.local

# Keep example files
!.env.example
!.env.template
!.env.sample

# Secrets and credentials
*.pem
*.key
*.crt
*.cer
*.p12
*.pfx
secrets/
.secrets/
credentials/
.credentials/

# AWS
.aws/
aws-exports.js

# GCP
*.json.enc
service-account*.json

# -------------------------------------------------
# Docker
# -------------------------------------------------
# Docker override files (local customization)
docker-compose.override.yml
docker-compose.local.yml
.docker/

# Docker data volumes
docker-data/
postgres-data/
redis-data/
media/
staticfiles/

# -------------------------------------------------
# Database
# -------------------------------------------------
# SQLite databases
*.sqlite3
*.db
*.sqlite

# Database dumps
*.sql
*.dump
!migrations/*.sql

# -------------------------------------------------
# Media and Uploads
# -------------------------------------------------
media/
uploads/
static/collected/
```

### Environment File Strategy

| File | Track? | Purpose |
|------|--------|---------|
| .env | No | Local secrets |
| .env.example | Yes | Template |
| .env.test | Maybe | Test config |

### Secrets Protection

| Pattern | What it Catches |
|---------|-----------------|
| *.pem | SSL certificates |
| *.key | Private keys |
| secrets/ | Secrets directory |
| service-account*.json | GCP credentials |

### Expected Outcome
- Environment files ignored
- Secrets protected

### Verification Checklist
- [ ] .env ignored
- [ ] .env.example tracked
- [ ] Secrets patterns added
- [ ] Docker patterns added

---

## Task 07: Create .gitattributes

### Overview
Create .gitattributes for line ending normalization.

### Dependencies
- Task 01: Git repository initialized

### Instructions

1. **Create .gitattributes**
   - At repository root

2. **Add text normalization**
   - LF for all text

3. **Add binary markers**
   - Images, fonts

### .gitattributes File

```gitattributes
# ==================================================
# LankaCommerce Cloud - Git Attributes
# ==================================================
# Normalize line endings to LF for all text files
# ==================================================

# Auto detect text files and normalize line endings
* text=auto eol=lf

# -------------------------------------------------
# Source Code
# -------------------------------------------------
*.py text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.vue text eol=lf
*.svelte text eol=lf

# -------------------------------------------------
# Configuration Files
# -------------------------------------------------
*.json text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.toml text eol=lf
*.ini text eol=lf
*.cfg text eol=lf
*.conf text eol=lf
*.env text eol=lf

# -------------------------------------------------
# Documentation
# -------------------------------------------------
*.md text eol=lf
*.txt text eol=lf
*.rst text eol=lf

# -------------------------------------------------
# Shell Scripts
# -------------------------------------------------
*.sh text eol=lf
*.bash text eol=lf
*.zsh text eol=lf

# -------------------------------------------------
# Windows Scripts (require CRLF)
# -------------------------------------------------
*.bat text eol=crlf
*.cmd text eol=crlf
*.ps1 text eol=crlf

# -------------------------------------------------
# Docker
# -------------------------------------------------
Dockerfile text eol=lf
docker-compose*.yml text eol=lf
.dockerignore text eol=lf

# -------------------------------------------------
# Make
# -------------------------------------------------
Makefile text eol=lf
*.mk text eol=lf

# -------------------------------------------------
# Binary Files (do not normalize)
# -------------------------------------------------
# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.webp binary
*.svg text eol=lf

# Fonts
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.otf binary

# Archives
*.zip binary
*.tar binary
*.gz binary
*.7z binary
*.rar binary

# Documents
*.pdf binary
*.doc binary
*.docx binary
*.xls binary
*.xlsx binary

# Other binaries
*.exe binary
*.dll binary
*.so binary
*.dylib binary

# -------------------------------------------------
# Lock Files (exact format)
# -------------------------------------------------
package-lock.json text eol=lf -diff
yarn.lock text eol=lf -diff
pnpm-lock.yaml text eol=lf -diff

# -------------------------------------------------
# Git Files
# -------------------------------------------------
.gitattributes text eol=lf
.gitignore text eol=lf
.gitkeep text eol=lf
```

### Why LF Normalization

| Reason | Benefit |
|--------|---------|
| Consistency | Same on all platforms |
| Diffs | Clean line changes |
| Linux servers | No conversion needed |
| Git best practice | Standard approach |

### Binary vs Text

| Type | Handling |
|------|----------|
| text eol=lf | Normalize to LF |
| binary | No conversion |
| -diff | Hide from diffs |

### Expected Outcome
- Line endings normalized
- Binary files protected

### Verification Checklist
- [ ] * text=auto eol=lf set
- [ ] Source code files covered
- [ ] Binary files marked
- [ ] Windows scripts CRLF

---

## Task 08: Create Initial Commit

### Overview
Create initial commit with all project foundation files.

### Dependencies
- Task 07: .gitattributes created

### Instructions

1. **Stage all files**
   - Foundation files

2. **Verify staged files**
   - Check status

3. **Create commit**
   - Descriptive message

### Files to Stage

```
All files from SubPhase-01 through SubPhase-06:
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .pre-commit-config.yaml
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── backend/
│   ├── pyproject.toml
│   ├── .flake8
│   ├── mypy.ini
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── package.json
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── .husky/
├── docker-compose.yml
├── Makefile
├── README.md
└── docs/
```

### Commit Commands

```bash
# Check repository status
git status

# Stage all files
git add .

# Or stage specific files
git add .gitignore .gitattributes .editorconfig
git add .vscode/ .pre-commit-config.yaml
git add backend/ frontend/
git add docker-compose.yml Makefile README.md

# Verify staged files
git status

# Create initial commit
git commit -m "chore: initialize LankaCommerce Cloud monorepo

- Set up monorepo structure (SubPhase-01)
- Initialize backend Django project (SubPhase-02)
- Initialize frontend Next.js project (SubPhase-03)
- Configure Docker development environment (SubPhase-04)
- Set up code quality and linting tools (SubPhase-05)
- Configure Git workflow standards (SubPhase-06)

Features:
- Python: Black, isort, flake8, Ruff, mypy
- TypeScript: ESLint, Prettier
- Pre-commit hooks: Python and Node.js
- VS Code workspace configuration
- EditorConfig for universal editor support

Ready for development"
```

### Verify Commit

```bash
# View commit log
git log --oneline -1

# View commit details
git show --stat

# Verify no uncommitted changes
git status
```

### Remote Setup

```bash
# Add remote origin
git remote add origin git@github.com:org/lankacommerce-cloud.git

# Push to remote
git push -u origin main
```

### Expected Outcome
- Initial commit created
- All foundation files committed

### Verification Checklist
- [ ] All files staged
- [ ] Commit message descriptive
- [ ] Commit created successfully
- [ ] git status shows clean

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Add IDE Ignores | Editor patterns |
| 06 | Add Environment Ignores | Secrets protection |
| 07 | Create .gitattributes | Line normalization |
| 08 | Create Initial Commit | Foundation committed |

### Complete .gitignore

All sections added:
```
├── Operating System
├── Logs and Debugging
├── Editor Backup Files
├── Temporary Files
├── Python (comprehensive)
├── Node.js (comprehensive)
├── IDE / Editors
├── Environment Variables
├── Docker
└── Database
```

### Group A Complete

```
/                            # Repository root
├── .git/                    # Git repository
├── .gitignore               # Comprehensive ignore patterns
└── .gitattributes           # Line ending normalization
```

### Next Steps
Proceed to [../Group-B_Branching-Strategy-Definition/00_GROUP_OVERVIEW.md](../Group-B_Branching-Strategy-Definition/00_GROUP_OVERVIEW.md) for branching strategy.

---

## Notes for AI Agents

1. **Complete .gitignore:** All sections in one file
2. **Negation:** Use ! for files to track
3. **Gitattributes:** LF for text, binary for images
4. **Initial commit:** Include all SubPhases 01-06
5. **Message format:** Use conventional commits
6. **Remote:** Add after initial commit
