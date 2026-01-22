# Tasks 92-94: Final Verification

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** H - Editor Configuration & Verification  
> **Document:** 03 of 03  
> **Tasks Covered:** 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-89-91_EditorConfig-Setup.md](02_Tasks-89-91_EditorConfig-Setup.md)
- **→ Next SubPhase:** [../../SubPhase-06_Git-Workflow-Standards/00_TASKS_SUMMARY.md](../../SubPhase-06_Git-Workflow-Standards/00_TASKS_SUMMARY.md)

---

## Document Overview

This document covers final verification of all code quality tools.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 92 | Run Full Lint Check | Medium |
| 93 | Verify Pre-commit Works | Medium |
| 94 | Create Initial Commit | Simple |

---

## Task 92: Run Full Lint Check

### Overview
Run all linting and formatting tools to verify configuration.

### Dependencies
- All previous tasks in SubPhase-05

### Instructions

1. **Run backend checks**
   - Black, isort, flake8, mypy

2. **Run frontend checks**
   - ESLint, Prettier

3. **Fix any issues**
   - Resolve errors

### Backend Verification Commands

```bash
cd backend

# Format check (no modifications)
black --check .
isort --check-only .

# Linting
flake8 .
ruff check .

# Type checking
mypy .
```

### Backend Verification with Fixes

```bash
cd backend

# Format and fix
black .
isort .
ruff check --fix .

# Then verify
make lint  # If Makefile configured
```

### Frontend Verification Commands

```bash
cd frontend

# Linting
npm run lint

# Format check
npm run format:check  # or prettier --check .

# Type checking
npm run type-check  # or tsc --noEmit
```

### Frontend Verification with Fixes

```bash
cd frontend

# Fix issues
npm run lint:fix
npm run format

# Then verify clean
npm run lint
```

### Expected Output

| Tool | Success Output |
|------|----------------|
| Black | "would reformat" or nothing |
| isort | nothing (clean) |
| flake8 | nothing (no errors) |
| Ruff | nothing (no errors) |
| mypy | "Success: no issues" |
| ESLint | nothing (no errors) |
| Prettier | nothing (clean) |

### Common Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Import order | isort not run | Run isort |
| Line too long | Exceeded 88 | Black reformats |
| Missing types | No annotations | Add type hints |
| Unused import | Dead code | Remove import |
| Any type | Missing stubs | Install stubs |

### Expected Outcome
- All tools pass
- No errors or warnings

### Verification Checklist
- [ ] Black passes
- [ ] isort passes
- [ ] flake8 passes
- [ ] mypy passes
- [ ] ESLint passes
- [ ] Prettier passes

---

## Task 93: Verify Pre-commit Works

### Overview
Test pre-commit hooks with a real commit.

### Dependencies
- Task 82: Git hooks installed

### Instructions

1. **Install pre-commit hooks**
   - Backend hooks

2. **Install Husky hooks**
   - Frontend hooks

3. **Make test commit**
   - Verify hooks run

### Install Pre-commit Hooks

```bash
# At repository root
cd /path/to/repo

# Install pre-commit hooks
pre-commit install

# Optional: Install commit-msg hook
pre-commit install --hook-type commit-msg

# Verify hooks installed
ls -la .git/hooks/
```

### Run Pre-commit Manually

```bash
# Run on all files (first time)
pre-commit run --all-files

# Run on staged files only
pre-commit run

# Run specific hook
pre-commit run black --all-files
pre-commit run mypy --all-files
```

### Verify Husky Hooks

```bash
cd frontend

# Verify prepare script exists
cat package.json | grep prepare

# Verify hooks directory
ls -la .husky/

# Verify pre-commit hook
cat .husky/pre-commit
```

### Test Commit Workflow

```bash
# Stage a file
echo "# Test" >> test-file.md
git add test-file.md

# Commit (hooks should run)
git commit -m "test: verify pre-commit hooks"

# If hooks fail, fix and retry
# If hooks pass, verify in log
git log --oneline -1

# Clean up test file
git reset HEAD~1
rm test-file.md
```

### Expected Hook Execution

| Stage | Hooks Run |
|-------|-----------|
| Pre-commit (Python) | trailing-whitespace, end-of-file-fixer, check-yaml, isort, black, flake8, mypy |
| Pre-commit (Frontend) | lint-staged → ESLint, Prettier |

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Hooks not running | Run `pre-commit install` |
| Permission denied | `chmod +x .husky/pre-commit` |
| Hook fails | Fix issues, stage, commit again |
| Too slow | Consider running mypy in CI |

### Expected Outcome
- Pre-commit hooks work
- Frontend hooks work

### Verification Checklist
- [ ] pre-commit install successful
- [ ] Husky hooks present
- [ ] Test commit triggers hooks
- [ ] Hooks pass on clean code

---

## Task 94: Create Initial Commit

### Overview
Create initial commit with all linting configuration.

### Dependencies
- Task 93: Pre-commit verified

### Instructions

1. **Stage all files**
   - New configuration files

2. **Create commit**
   - Descriptive message

3. **Verify commit**
   - Check log

### Files to Commit

Backend:
```
backend/
├── pyproject.toml          # Black, isort, Ruff
├── .flake8                  # flake8 config
├── mypy.ini                 # mypy config
└── requirements-dev.txt     # Dev dependencies
```

Frontend:
```
frontend/
├── .eslintrc.json           # ESLint config
├── .eslintignore            # ESLint ignores
├── .prettierrc              # Prettier config
├── .prettierignore          # Prettier ignores
├── .husky/                  # Husky hooks
│   └── pre-commit
└── package.json             # lint-staged config
```

Repository root:
```
/
├── .pre-commit-config.yaml  # Pre-commit config
├── .editorconfig            # EditorConfig
└── .vscode/
    ├── settings.json        # VS Code settings
    └── extensions.json      # Recommended extensions
```

### Commit Commands

```bash
# Stage all linting config
git add .pre-commit-config.yaml
git add .editorconfig
git add .vscode/

git add backend/pyproject.toml
git add backend/.flake8
git add backend/mypy.ini
git add backend/requirements-dev.txt

git add frontend/.eslintrc.json
git add frontend/.eslintignore
git add frontend/.prettierrc
git add frontend/.prettierignore
git add frontend/.husky/
git add frontend/package.json
git add frontend/package-lock.json

# Verify staged files
git status

# Commit with descriptive message
git commit -m "feat(tooling): add code quality and linting setup

- Configure Black formatter for Python (line-length 88)
- Configure isort with Black-compatible profile
- Add flake8 with bugbear and comprehensions plugins
- Configure Ruff as alternative linter
- Add mypy with strict mode and Django plugin
- Configure ESLint for TypeScript/React
- Add Prettier for frontend formatting
- Set up pre-commit hooks for Python
- Configure Husky and lint-staged for frontend
- Add VS Code workspace settings
- Add EditorConfig for universal editor support

SubPhase-05: Code Quality & Linting Setup complete"
```

### Commit Message Format

Follow conventional commits:
```
feat(tooling): add code quality and linting setup

- Bullet point 1
- Bullet point 2

Footer: SubPhase reference
```

### Verify Commit

```bash
# View commit
git log --oneline -1

# View commit details
git show --stat HEAD

# Verify files in commit
git diff-tree --no-commit-id --name-only -r HEAD
```

### Push to Remote

```bash
# Push to remote (if applicable)
git push origin main

# Or create feature branch
git checkout -b feature/code-quality-setup
git push -u origin feature/code-quality-setup
```

### Expected Outcome
- All config files committed
- Clean git history

### Verification Checklist
- [ ] All files staged
- [ ] Commit message descriptive
- [ ] Commit created successfully
- [ ] Push successful (if applicable)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 92 | Run Full Lint Check | All tools pass |
| 93 | Verify Pre-commit Works | Hooks functional |
| 94 | Create Initial Commit | Config committed |

### SubPhase-05 Complete

All code quality tools are now configured:

| Category | Tool | Config File |
|----------|------|-------------|
| Python Formatting | Black | pyproject.toml |
| Python Imports | isort | pyproject.toml |
| Python Linting | flake8, Ruff | .flake8, pyproject.toml |
| Python Types | mypy | mypy.ini |
| Frontend Linting | ESLint | .eslintrc.json |
| Frontend Formatting | Prettier | .prettierrc |
| Python Hooks | pre-commit | .pre-commit-config.yaml |
| Frontend Hooks | Husky, lint-staged | .husky/, package.json |
| Editor | VS Code, EditorConfig | .vscode/, .editorconfig |

### Full File Structure

```
/                                # Repository root
├── .pre-commit-config.yaml      # Pre-commit hooks
├── .editorconfig                # Universal editor config
├── .vscode/
│   ├── settings.json            # Workspace settings
│   └── extensions.json          # Recommendations
├── backend/
│   ├── pyproject.toml           # Black, isort, Ruff
│   ├── .flake8                  # flake8 config
│   ├── mypy.ini                 # mypy config
│   └── requirements-dev.txt     # Dev dependencies
└── frontend/
    ├── .eslintrc.json           # ESLint config
    ├── .eslintignore            # ESLint ignores
    ├── .prettierrc              # Prettier config
    ├── .prettierignore          # Prettier ignores
    ├── .husky/
    │   └── pre-commit           # Husky hook
    ├── package.json             # lint-staged config
    └── package-lock.json        # Lock file
```

### Next SubPhase
Proceed to [../../SubPhase-06_Git-Workflow-Standards/00_TASKS_SUMMARY.md](../../SubPhase-06_Git-Workflow-Standards/00_TASKS_SUMMARY.md).

---

## Notes for AI Agents

1. **Order:** Lint, then verify hooks, then commit
2. **All files:** Commit all config at once
3. **Message:** Use conventional commits format
4. **Test:** Make sure hooks work before committing
5. **Clean:** All tools should pass before commit
6. **Branch:** Consider feature branch for PR workflow
