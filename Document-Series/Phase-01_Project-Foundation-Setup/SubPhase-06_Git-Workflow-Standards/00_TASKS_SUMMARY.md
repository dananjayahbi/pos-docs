# SubPhase 06: Git Workflow & Standards - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 06 of 08  
> **SubPhase Goal:** Define team collaboration standards for version control  
> **Total Tasks:** 76 | **Status:** Planning  
> **Estimated Duration:** 3-4 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Code-Quality-Linting-Setup](../SubPhase-05_Code-Quality-Linting-Setup/)
- **→ Next SubPhase:** [SubPhase-07_Environment-Configuration](../SubPhase-07_Environment-Configuration/)

---

## SubPhase Overview

This sub-phase establishes the Git workflow and collaboration standards for the LankaCommerce Cloud project. The setup includes branching strategy, commit conventions, pull request templates, code review guidelines, and GitHub-specific configurations.

### Key Outcomes
- Branching strategy defined (GitFlow-based)
- Commit message conventions (Conventional Commits)
- Pull request templates created
- Issue templates created
- Code review guidelines documented
- Branch protection rules configured
- GitHub Actions workflow foundations

### Workflow Strategy
- **Main Branches:** main, develop
- **Feature Branches:** feature/*, bugfix/*, hotfix/*
- **Release Branches:** release/*
- **Commit Style:** Conventional Commits

### Dependencies
- **Requires:** SubPhase-01 (Monorepo Structure Setup) completed
- **Git repository must be initialized**

---

## Task Execution Order

```
TASK GROUP A: Git Repository Setup (Tasks 01-08)
        │
        ▼
TASK GROUP B: Branching Strategy Definition (Tasks 09-20)
        │
        ▼
TASK GROUP C: Commit Message Conventions (Tasks 21-32)
        │
        ▼
TASK GROUP D: Pull Request Templates (Tasks 33-44)
        │
        ▼
TASK GROUP E: Issue Templates (Tasks 45-56)
        │
        ▼
TASK GROUP F: Code Review Guidelines (Tasks 57-66)
        │
        ▼
TASK GROUP G: GitHub Configuration & Verification (Tasks 67-76)
```

---

## Task Index

### Group A: Git Repository Setup (Tasks 01-08)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Initialize Git Repository** | git init if not already done | SubPhase-01 | 🔴 Not Created |
| 02 | **Create .gitignore (Root)** | Comprehensive root gitignore | Task 01 | 🔴 Not Created |
| 03 | **Add Python Ignores** | Python-specific patterns | Task 02 | 🔴 Not Created |
| 04 | **Add Node.js Ignores** | Node.js-specific patterns | Task 02 | 🔴 Not Created |
| 05 | **Add IDE Ignores** | VS Code, PyCharm, etc. | Task 02 | 🔴 Not Created |
| 06 | **Add Environment Ignores** | .env files, secrets | Task 02 | 🔴 Not Created |
| 07 | **Create .gitattributes** | Line ending normalization | Task 01 | 🔴 Not Created |
| 08 | **Create Initial Commit** | Initial project commit | Task 07 | 🔴 Not Created |

---

### Group B: Branching Strategy Definition (Tasks 09-20)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 09 | **Document Branching Strategy** | Create BRANCHING.md file | Task 08 | 🔴 Not Created |
| 10 | **Define Main Branch** | Production-ready code | Task 09 | 🔴 Not Created |
| 11 | **Define Develop Branch** | Integration branch | Task 09 | 🔴 Not Created |
| 12 | **Define Feature Branch Pattern** | feature/<ticket>-<description> | Task 09 | 🔴 Not Created |
| 13 | **Define Bugfix Branch Pattern** | bugfix/<ticket>-<description> | Task 09 | 🔴 Not Created |
| 14 | **Define Hotfix Branch Pattern** | hotfix/<version>-<description> | Task 09 | 🔴 Not Created |
| 15 | **Define Release Branch Pattern** | release/<version> | Task 09 | 🔴 Not Created |
| 16 | **Document Branch Lifecycle** | Creation, merge, deletion | Task 12-15 | 🔴 Not Created |
| 17 | **Create Branch from Main** | Create develop branch | Task 10 | 🔴 Not Created |
| 18 | **Document Merge Strategies** | Squash, rebase, merge | Task 16 | 🔴 Not Created |
| 19 | **Create Branch Naming Validation** | Script to validate names | Task 12-15 | 🔴 Not Created |
| 20 | **Add Branching Diagram** | Visual representation | Task 09 | 🔴 Not Created |

---

### Group C: Commit Message Conventions (Tasks 21-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 21 | **Document Commit Conventions** | Create COMMITS.md file | Task 08 | 🔴 Not Created |
| 22 | **Define Commit Format** | type(scope): description | Task 21 | 🔴 Not Created |
| 23 | **Define Commit Types** | feat, fix, docs, style, etc. | Task 22 | 🔴 Not Created |
| 24 | **Define Scope Guidelines** | Optional scope usage | Task 22 | 🔴 Not Created |
| 25 | **Define Subject Guidelines** | Imperative, lowercase | Task 22 | 🔴 Not Created |
| 26 | **Define Body Guidelines** | What and why, not how | Task 22 | 🔴 Not Created |
| 27 | **Define Footer Guidelines** | Breaking changes, issues | Task 22 | 🔴 Not Created |
| 28 | **Install commitlint** | Commit message linting | Task 22 | 🔴 Not Created |
| 29 | **Create commitlint.config.js** | Commitlint configuration | Task 28 | 🔴 Not Created |
| 30 | **Add Commit Message Hook** | Validate on commit | Task 29 | 🔴 Not Created |
| 31 | **Create Commit Examples** | Good and bad examples | Task 21 | 🔴 Not Created |
| 32 | **Install Commitizen** | Interactive commit helper | Task 28 | 🔴 Not Created |

---

### Group D: Pull Request Templates (Tasks 33-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create .github/ Directory** | GitHub configuration directory | Task 01 | 🔴 Not Created |
| 34 | **Create PULL_REQUEST_TEMPLATE.md** | Default PR template | Task 33 | 🔴 Not Created |
| 35 | **Add PR Description Section** | What changes were made | Task 34 | 🔴 Not Created |
| 36 | **Add PR Type Checklist** | Feature, bugfix, etc. | Task 34 | 🔴 Not Created |
| 37 | **Add Testing Checklist** | Tests added/updated | Task 34 | 🔴 Not Created |
| 38 | **Add Documentation Checklist** | Docs updated | Task 34 | 🔴 Not Created |
| 39 | **Add Breaking Changes Section** | Note any breaking changes | Task 34 | 🔴 Not Created |
| 40 | **Add Related Issues Section** | Link to related issues | Task 34 | 🔴 Not Created |
| 41 | **Add Screenshots Section** | For UI changes | Task 34 | 🔴 Not Created |
| 42 | **Create Feature PR Template** | Specific for features | Task 33 | 🔴 Not Created |
| 43 | **Create Bugfix PR Template** | Specific for bugfixes | Task 33 | 🔴 Not Created |
| 44 | **Create Hotfix PR Template** | Specific for hotfixes | Task 33 | 🔴 Not Created |

---

### Group E: Issue Templates (Tasks 45-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create ISSUE_TEMPLATE/ Directory** | Issue templates directory | Task 33 | 🔴 Not Created |
| 46 | **Create Bug Report Template** | bug_report.md | Task 45 | 🔴 Not Created |
| 47 | **Add Bug Description Section** | Describe the bug | Task 46 | 🔴 Not Created |
| 48 | **Add Reproduction Steps** | How to reproduce | Task 46 | 🔴 Not Created |
| 49 | **Add Expected Behavior** | What should happen | Task 46 | 🔴 Not Created |
| 50 | **Add Environment Info** | OS, browser, version | Task 46 | 🔴 Not Created |
| 51 | **Create Feature Request Template** | feature_request.md | Task 45 | 🔴 Not Created |
| 52 | **Add Feature Description** | Describe the feature | Task 51 | 🔴 Not Created |
| 53 | **Add Use Case Section** | Why is this needed | Task 51 | 🔴 Not Created |
| 54 | **Add Alternatives Section** | Alternatives considered | Task 51 | 🔴 Not Created |
| 55 | **Create Task Template** | General task template | Task 45 | 🔴 Not Created |
| 56 | **Create config.yml** | Issue template chooser | Task 45 | 🔴 Not Created |

---

### Group F: Code Review Guidelines (Tasks 57-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create CODE_REVIEW.md** | Code review guidelines | Task 08 | 🔴 Not Created |
| 58 | **Define Review Scope** | What to review | Task 57 | 🔴 Not Created |
| 59 | **Define Code Quality Criteria** | Readability, maintainability | Task 57 | 🔴 Not Created |
| 60 | **Define Security Review Points** | Security considerations | Task 57 | 🔴 Not Created |
| 61 | **Define Performance Review** | Performance considerations | Task 57 | 🔴 Not Created |
| 62 | **Define Review Timeline** | Expected response times | Task 57 | 🔴 Not Created |
| 63 | **Define Approval Requirements** | Number of approvals | Task 57 | 🔴 Not Created |
| 64 | **Create Review Checklist** | Reviewer checklist | Task 58-61 | 🔴 Not Created |
| 65 | **Define Comment Guidelines** | Constructive feedback | Task 57 | 🔴 Not Created |
| 66 | **Create CODEOWNERS File** | Define code ownership | Task 33 | 🔴 Not Created |

---

### Group G: GitHub Configuration & Verification (Tasks 67-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create CONTRIBUTING.md** | Contribution guidelines | Task 08 | 🔴 Not Created |
| 68 | **Create CODE_OF_CONDUCT.md** | Code of conduct | Task 08 | 🔴 Not Created |
| 69 | **Create SECURITY.md** | Security policy | Task 08 | 🔴 Not Created |
| 70 | **Update README.md** | Add workflow sections | Task 08 | 🔴 Not Created |
| 71 | **Create CHANGELOG.md Template** | Changelog structure | Task 08 | 🔴 Not Created |
| 72 | **Document Branch Protection** | Instructions for setup | Task 09 | 🔴 Not Created |
| 73 | **List Required Status Checks** | CI checks to require | Task 72 | 🔴 Not Created |
| 74 | **Define Merge Requirements** | Approval count, etc. | Task 72 | 🔴 Not Created |
| 75 | **Verify All Templates Work** | Test issue/PR creation | Task 56 | 🔴 Not Created |
| 76 | **Create Initial Commit** | Commit all workflow setup | Task 75 | 🔴 Not Created |

---

## Task Details

### Task 02: Create .gitignore (Root)

**Goal:** Create comprehensive root .gitignore file.

**Content:**
```gitignore
# .gitignore

# =====================================
# Python
# =====================================
__pycache__/
*.py[cod]
*$py.class
*.so
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
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
.venv/
ENV/
env/
.env

# Django
*.log
local_settings.py
db.sqlite3
media/
staticfiles/

# =====================================
# Node.js
# =====================================
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.npm

# Next.js
.next/
out/
.swc/

# =====================================
# IDE / Editor
# =====================================
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.swp
*.swo
*~
.project
.pydevproject
.settings/
*.sublime-workspace
*.sublime-project

# =====================================
# Environment
# =====================================
.env
.env.local
.env.*.local
.env.development
.env.test
.env.production
!.env.example
!.env.local.example

# =====================================
# Testing
# =====================================
.coverage
htmlcov/
.pytest_cache/
.tox/
.nox/
coverage.xml
*.cover
.hypothesis/

# =====================================
# Type checking
# =====================================
.mypy_cache/
.dmypy.json
dmypy.json
.ruff_cache/

# =====================================
# Docker
# =====================================
docker-compose.override.yml

# =====================================
# OS
# =====================================
.DS_Store
Thumbs.db
*.bak
*.tmp
*.temp
```

---

### Task 09: Document Branching Strategy

**Goal:** Create BRANCHING.md documentation.

**Content:**
```markdown
# Branching Strategy

## Overview

LankaCommerce Cloud uses a modified GitFlow branching strategy optimized for continuous delivery.

## Main Branches

### `main`
- **Purpose:** Production-ready code
- **Protection:** Protected, requires PR with approvals
- **Deploys to:** Production environment

### `develop`
- **Purpose:** Integration branch for features
- **Protection:** Protected, requires PR
- **Deploys to:** Staging environment

## Supporting Branches

### Feature Branches
- **Pattern:** `feature/<ticket-id>-<short-description>`
- **Created from:** `develop`
- **Merged into:** `develop`
- **Example:** `feature/LCC-123-user-authentication`

### Bugfix Branches
- **Pattern:** `bugfix/<ticket-id>-<short-description>`
- **Created from:** `develop`
- **Merged into:** `develop`
- **Example:** `bugfix/LCC-456-login-redirect-error`

### Hotfix Branches
- **Pattern:** `hotfix/<version>-<short-description>`
- **Created from:** `main`
- **Merged into:** `main` AND `develop`
- **Example:** `hotfix/1.2.1-critical-security-fix`

### Release Branches
- **Pattern:** `release/<version>`
- **Created from:** `develop`
- **Merged into:** `main` AND `develop`
- **Example:** `release/1.3.0`

## Workflow Diagram

```
main ────●────────────────●────────────────●─────
         │                ↑                ↑
         │                │                │
develop ─●────●────●──────●────●────●──────●─────
              ↑    ↑           ↑    ↑
              │    │           │    │
feature/a ────┘    │           │    │
feature/b ─────────┘           │    │
bugfix/c ──────────────────────┘    │
feature/d ──────────────────────────┘
```

## Branch Lifecycle

1. **Create:** Branch from appropriate base
2. **Develop:** Make commits following conventions
3. **Push:** Push to remote regularly
4. **PR:** Open pull request when ready
5. **Review:** Address review comments
6. **Merge:** Squash merge to base branch
7. **Delete:** Delete feature branch after merge
```

---

### Task 22: Define Commit Format

**Goal:** Define Conventional Commits format.

**Content (in COMMITS.md):**
```markdown
# Commit Message Conventions

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type

Must be one of the following:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code change that neither fixes nor adds feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Other changes (tooling, etc.) |
| `revert` | Revert a previous commit |

## Scope (Optional)

The scope indicates the area of the codebase affected:
- `backend` - Django/Python changes
- `frontend` - Next.js/React changes
- `api` - API endpoints
- `db` - Database/migrations
- `auth` - Authentication
- `ui` - User interface
- `docs` - Documentation

## Subject

- Use imperative mood ("add" not "added")
- Don't capitalize the first letter
- No period at the end
- Maximum 50 characters

## Examples

```
feat(auth): add JWT token refresh endpoint

fix(frontend): resolve infinite loop in product list

docs: update API documentation for orders

chore(deps): upgrade Django to 5.1
```
```

---

### Task 34: Create PULL_REQUEST_TEMPLATE.md

**Goal:** Create default pull request template.

**Content:**
```markdown
## Description

<!-- Describe your changes in detail -->

## Type of Change

<!-- Mark with an 'x' the applicable options -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature causing existing functionality to change)
- [ ] 📝 Documentation update
- [ ] ♻️ Refactoring (no functional changes)
- [ ] 🔧 Configuration change
- [ ] 🧪 Test update

## Related Issues

<!-- Link to related issues -->

Fixes #(issue)

## How Has This Been Tested?

<!-- Describe testing performed -->

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist

- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] Any dependent changes have been merged

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Additional Notes

<!-- Any additional information -->
```

---

### Task 46: Create Bug Report Template

**Goal:** Create bug report issue template.

**Content:**
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug, needs-triage
assignees: ''
---

## Bug Description

<!-- A clear and concise description of the bug -->

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

<!-- What you expected to happen -->

## Actual Behavior

<!-- What actually happened -->

## Screenshots

<!-- If applicable, add screenshots -->

## Environment

- **OS:** [e.g., Windows 11, macOS 14]
- **Browser:** [e.g., Chrome 120, Safari 17]
- **Version:** [e.g., 1.2.3]

## Additional Context

<!-- Any other context about the problem -->

## Possible Solution

<!-- Optional: Suggest a fix if you have one -->
```

---

### Task 66: Create CODEOWNERS File

**Goal:** Create CODEOWNERS for automatic review assignment.

**Content:**
```
# CODEOWNERS

# Default owners for everything
* @lankacommerce/core-team

# Backend ownership
/backend/ @lankacommerce/backend-team
/backend/apps/inventory/ @lankacommerce/backend-team @lankacommerce/inventory-owners
/backend/apps/pos/ @lankacommerce/backend-team @lankacommerce/pos-owners

# Frontend ownership
/frontend/ @lankacommerce/frontend-team
/frontend/components/ @lankacommerce/frontend-team @lankacommerce/ui-team

# Infrastructure
/docker/ @lankacommerce/devops-team
/.github/ @lankacommerce/devops-team

# Documentation
/docs/ @lankacommerce/docs-team
*.md @lankacommerce/docs-team

# Configuration files require senior review
*.yml @lankacommerce/senior-engineers
*.yaml @lankacommerce/senior-engineers
pyproject.toml @lankacommerce/senior-engineers
package.json @lankacommerce/senior-engineers
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── task.md
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── workflows/
│       └── (CI files - later phase)
├── docs/
│   ├── BRANCHING.md
│   ├── COMMITS.md
│   ├── CODE_REVIEW.md
│   ├── CONTRIBUTING.md
│   ├── CODE_OF_CONDUCT.md
│   └── SECURITY.md
├── .gitignore
├── .gitattributes
├── CHANGELOG.md
├── commitlint.config.js
└── README.md
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 76 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 76 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Groups A-B first to establish foundation
2. **GitHub Setup:** Some tasks require GitHub repository settings access
3. **Team Structure:** CODEOWNERS uses placeholder team names - update for real teams
4. **Branch Protection:** Documented but requires manual GitHub setup
5. **Commitlint:** Integrates with husky from SubPhase-05
6. **Templates:** Test all templates by creating sample issues/PRs
7. **Documentation:** All .md files should be well-formatted and clear
8. **Verification:** Create a test branch to verify workflow
