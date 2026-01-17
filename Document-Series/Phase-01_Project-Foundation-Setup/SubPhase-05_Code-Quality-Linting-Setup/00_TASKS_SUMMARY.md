# SubPhase 05: Code Quality & Linting Setup - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 05 of 08  
> **SubPhase Goal:** Establish consistent code formatting and quality checks  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Docker-Development-Environment](../SubPhase-04_Docker-Development-Environment/)
- **→ Next SubPhase:** [SubPhase-06_Git-Workflow-Standards](../SubPhase-06_Git-Workflow-Standards/)

---

## SubPhase Overview

This sub-phase configures all code quality and linting tools for both backend (Python/Django) and frontend (TypeScript/Next.js). The setup ensures consistent code formatting, catches common errors, and enforces best practices through automated checks.

### Key Outcomes
- Python code formatted with Black and isort
- Python linting with flake8 and Ruff
- Type checking with mypy for Python
- ESLint configured for Next.js/React
- Prettier for consistent code formatting
- Pre-commit hooks for automated checks
- Editor configurations for VS Code

### Tools to Configure
**Backend (Python):**
- Black (code formatter)
- isort (import sorter)
- flake8 (linter)
- Ruff (fast linter - alternative to flake8)
- mypy (static type checker)

**Frontend (TypeScript):**
- ESLint (linter)
- Prettier (formatter)
- TypeScript strict mode

**Automation:**
- pre-commit hooks
- husky (frontend git hooks)
- lint-staged

### Dependencies
- **Requires:** SubPhase-02 (Backend) and SubPhase-03 (Frontend) completed
- **Backend and Frontend projects must be initialized**

---

## Task Execution Order

```
TASK GROUP A: Backend Formatter Setup - Black (Tasks 01-10)
        │
        ▼
TASK GROUP B: Backend Import Sorting - isort (Tasks 11-18)
        │
        ▼
TASK GROUP C: Backend Linting - flake8/Ruff (Tasks 19-30)
        │
        ▼
TASK GROUP D: Backend Type Checking - mypy (Tasks 31-42)
        │
        ▼
TASK GROUP E: Frontend Linting - ESLint (Tasks 43-58)
        │
        ▼
TASK GROUP F: Frontend Formatting - Prettier (Tasks 59-68)
        │
        ▼
TASK GROUP G: Pre-commit Hooks Setup (Tasks 69-82)
        │
        ▼
TASK GROUP H: Editor Configuration & Verification (Tasks 83-94)
```

---

## Task Index

### Group A: Backend Formatter Setup - Black (Tasks 01-10)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Black** | Install Black formatter as dev dependency | SubPhase-02 | 🔴 Not Created |
| 02 | **Create pyproject.toml** | Create/update pyproject.toml for Black config | Task 01 | 🔴 Not Created |
| 03 | **Configure Line Length** | Set line-length = 88 (Black default) | Task 02 | 🔴 Not Created |
| 04 | **Configure Target Python Version** | Set target-version for Python 3.12 | Task 02 | 🔴 Not Created |
| 05 | **Configure Include Patterns** | Define files to format | Task 02 | 🔴 Not Created |
| 06 | **Configure Exclude Patterns** | Exclude migrations, venv, etc. | Task 02 | 🔴 Not Created |
| 07 | **Add Format Script to Makefile** | make format command | Task 01 | 🔴 Not Created |
| 08 | **Format Existing Code** | Run Black on all Python files | Task 06 | 🔴 Not Created |
| 09 | **Verify Black Configuration** | Test Black runs without errors | Task 08 | 🔴 Not Created |
| 10 | **Document Black Usage** | Add Black section to README | Task 01 | 🔴 Not Created |

---

### Group B: Backend Import Sorting - isort (Tasks 11-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 11 | **Install isort** | Install isort as dev dependency | Task 01 | 🔴 Not Created |
| 12 | **Configure isort in pyproject.toml** | Add isort configuration | Task 02, 11 | 🔴 Not Created |
| 13 | **Configure Black Compatibility** | profile = "black" setting | Task 12 | 🔴 Not Created |
| 14 | **Configure Import Sections** | Define THIRD_PARTY, FIRST_PARTY, LOCAL | Task 12 | 🔴 Not Created |
| 15 | **Configure Known First Party** | Set known_first_party packages | Task 12 | 🔴 Not Created |
| 16 | **Configure Skip Patterns** | Skip migrations, venv, etc. | Task 12 | 🔴 Not Created |
| 17 | **Sort Existing Imports** | Run isort on all Python files | Task 16 | 🔴 Not Created |
| 18 | **Verify isort Configuration** | Test isort runs without errors | Task 17 | 🔴 Not Created |

---

### Group C: Backend Linting - flake8/Ruff (Tasks 19-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Install flake8** | Install flake8 as dev dependency | Task 01 | 🔴 Not Created |
| 20 | **Install flake8 Plugins** | flake8-bugbear, flake8-comprehensions | Task 19 | 🔴 Not Created |
| 21 | **Create .flake8 Configuration** | Create .flake8 config file | Task 19 | 🔴 Not Created |
| 22 | **Configure Max Line Length** | max-line-length = 88 (Black compatible) | Task 21 | 🔴 Not Created |
| 23 | **Configure Ignore Patterns** | Ignore specific error codes | Task 21 | 🔴 Not Created |
| 24 | **Configure Exclude Patterns** | Exclude migrations, venv, etc. | Task 21 | 🔴 Not Created |
| 25 | **Install Ruff** | Install Ruff (fast alternative) | Task 01 | 🔴 Not Created |
| 26 | **Configure Ruff in pyproject.toml** | Add Ruff configuration | Task 02, 25 | 🔴 Not Created |
| 27 | **Configure Ruff Rules** | Select linting rules | Task 26 | 🔴 Not Created |
| 28 | **Configure Ruff Ignore** | Ignore specific rules | Task 26 | 🔴 Not Created |
| 29 | **Run Initial Lint Check** | Check existing code | Task 24, 26 | 🔴 Not Created |
| 30 | **Fix Linting Errors** | Fix identified issues | Task 29 | 🔴 Not Created |

---

### Group D: Backend Type Checking - mypy (Tasks 31-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Install mypy** | Install mypy as dev dependency | Task 01 | 🔴 Not Created |
| 32 | **Install Django Stubs** | django-stubs type definitions | Task 31 | 🔴 Not Created |
| 33 | **Install DRF Stubs** | djangorestframework-stubs | Task 31 | 🔴 Not Created |
| 34 | **Create mypy.ini** | Create mypy configuration file | Task 31 | 🔴 Not Created |
| 35 | **Configure Python Version** | python_version = 3.12 | Task 34 | 🔴 Not Created |
| 36 | **Configure Strict Mode** | Enable strict type checking | Task 34 | 🔴 Not Created |
| 37 | **Configure Plugins** | mypy_django_plugin.main | Task 32, 34 | 🔴 Not Created |
| 38 | **Configure Ignore Missing Imports** | For third-party libraries | Task 34 | 🔴 Not Created |
| 39 | **Configure Per-Module Overrides** | Specific module settings | Task 34 | 🔴 Not Created |
| 40 | **Run Initial Type Check** | mypy on existing code | Task 39 | 🔴 Not Created |
| 41 | **Add Type Annotations** | Add types to critical modules | Task 40 | 🔴 Not Created |
| 42 | **Document mypy Usage** | Add mypy section to README | Task 31 | 🔴 Not Created |

---

### Group E: Frontend Linting - ESLint (Tasks 43-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Install ESLint** | Install eslint as dev dependency | SubPhase-03 | 🔴 Not Created |
| 44 | **Install ESLint Plugins** | Next.js, React, TypeScript plugins | Task 43 | 🔴 Not Created |
| 45 | **Install eslint-plugin-react** | React specific rules | Task 43 | 🔴 Not Created |
| 46 | **Install eslint-plugin-react-hooks** | React hooks rules | Task 43 | 🔴 Not Created |
| 47 | **Install @typescript-eslint/parser** | TypeScript parser | Task 43 | 🔴 Not Created |
| 48 | **Install @typescript-eslint/eslint-plugin** | TypeScript rules | Task 47 | 🔴 Not Created |
| 49 | **Create .eslintrc.json** | ESLint configuration file | Task 44 | 🔴 Not Created |
| 50 | **Configure Extends** | next/core-web-vitals, typescript | Task 49 | 🔴 Not Created |
| 51 | **Configure Parser Options** | ECMAScript version, sourceType | Task 49 | 🔴 Not Created |
| 52 | **Configure React Rules** | react/prop-types, react/react-in-jsx-scope | Task 49 | 🔴 Not Created |
| 53 | **Configure TypeScript Rules** | @typescript-eslint rules | Task 49 | 🔴 Not Created |
| 54 | **Configure Import Rules** | import/order, import/no-unresolved | Task 49 | 🔴 Not Created |
| 55 | **Create .eslintignore** | Files to ignore | Task 49 | 🔴 Not Created |
| 56 | **Add Lint Script** | package.json lint script | Task 49 | 🔴 Not Created |
| 57 | **Run Initial Lint** | eslint on existing code | Task 55 | 🔴 Not Created |
| 58 | **Fix ESLint Errors** | Fix identified issues | Task 57 | 🔴 Not Created |

---

### Group F: Frontend Formatting - Prettier (Tasks 59-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Install Prettier** | Install prettier as dev dependency | SubPhase-03 | 🔴 Not Created |
| 60 | **Install eslint-config-prettier** | Disable conflicting ESLint rules | Task 43, 59 | 🔴 Not Created |
| 61 | **Install eslint-plugin-prettier** | Run Prettier as ESLint rule | Task 60 | 🔴 Not Created |
| 62 | **Create .prettierrc** | Prettier configuration file | Task 59 | 🔴 Not Created |
| 63 | **Configure Semi** | semi: true or false | Task 62 | 🔴 Not Created |
| 64 | **Configure Tab Width** | tabWidth: 2 | Task 62 | 🔴 Not Created |
| 65 | **Configure Single Quote** | singleQuote: true | Task 62 | 🔴 Not Created |
| 66 | **Configure Trailing Comma** | trailingComma: es5 | Task 62 | 🔴 Not Created |
| 67 | **Create .prettierignore** | Files to ignore | Task 62 | 🔴 Not Created |
| 68 | **Add Format Script** | package.json format script | Task 62 | 🔴 Not Created |

---

### Group G: Pre-commit Hooks Setup (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Install pre-commit** | Install pre-commit (Python) | Task 01 | 🔴 Not Created |
| 70 | **Create .pre-commit-config.yaml** | Pre-commit configuration | Task 69 | 🔴 Not Created |
| 71 | **Add Black Hook** | Black formatter hook | Task 70 | 🔴 Not Created |
| 72 | **Add isort Hook** | isort import sorting hook | Task 70 | 🔴 Not Created |
| 73 | **Add flake8 Hook** | flake8 linting hook | Task 70 | 🔴 Not Created |
| 74 | **Add mypy Hook** | mypy type checking hook | Task 70 | 🔴 Not Created |
| 75 | **Add Trailing Whitespace Hook** | Remove trailing whitespace | Task 70 | 🔴 Not Created |
| 76 | **Add End of File Hook** | Ensure newline at end | Task 70 | 🔴 Not Created |
| 77 | **Add YAML Check Hook** | Validate YAML files | Task 70 | 🔴 Not Created |
| 78 | **Install Husky (Frontend)** | Git hooks for Node.js | Task 59 | 🔴 Not Created |
| 79 | **Configure lint-staged** | Run linters on staged files | Task 78 | 🔴 Not Created |
| 80 | **Add ESLint to lint-staged** | Lint staged JS/TS files | Task 79 | 🔴 Not Created |
| 81 | **Add Prettier to lint-staged** | Format staged files | Task 79 | 🔴 Not Created |
| 82 | **Install Pre-commit Hooks** | pre-commit install | Task 77 | 🔴 Not Created |

---

### Group H: Editor Configuration & Verification (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create .vscode/ Directory** | VS Code settings directory | Task 01 | 🔴 Not Created |
| 84 | **Create settings.json** | VS Code workspace settings | Task 83 | 🔴 Not Created |
| 85 | **Configure Python Formatter** | Black as default formatter | Task 84 | 🔴 Not Created |
| 86 | **Configure Python Linting** | Enable flake8/Ruff | Task 84 | 🔴 Not Created |
| 87 | **Configure Format on Save** | Enable for Python and TS | Task 84 | 🔴 Not Created |
| 88 | **Create extensions.json** | Recommended VS Code extensions | Task 83 | 🔴 Not Created |
| 89 | **Create .editorconfig** | Universal editor settings | Task 01 | 🔴 Not Created |
| 90 | **Configure Indent Style** | spaces, size 2 or 4 | Task 89 | 🔴 Not Created |
| 91 | **Configure End of Line** | lf for consistency | Task 89 | 🔴 Not Created |
| 92 | **Run Full Lint Check** | Verify all tools work | All previous | 🔴 Not Created |
| 93 | **Verify Pre-commit Works** | Test commit with hooks | Task 82 | 🔴 Not Created |
| 94 | **Create Initial Commit** | Commit all linting setup | Task 93 | 🔴 Not Created |

---

## Task Details

### Task 02: Create pyproject.toml

**Goal:** Create/update pyproject.toml for Python tool configurations.

**Content:**
```toml
# pyproject.toml

[tool.black]
line-length = 88
target-version = ['py312']
include = '\.pyi?$'
extend-exclude = '''
/(
    \.eggs
    | \.git
    | \.hg
    | \.mypy_cache
    | \.tox
    | \.venv
    | venv
    | _build
    | buck-out
    | build
    | dist
    | migrations
)/
'''

[tool.isort]
profile = "black"
line_length = 88
skip = [".venv", "venv", "migrations"]
known_first_party = ["apps", "config"]
sections = ["FUTURE", "STDLIB", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]
default_section = "THIRDPARTY"

[tool.ruff]
line-length = 88
target-version = "py312"
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
]
ignore = [
    "E501",  # line too long (handled by black)
    "B008",  # do not perform function calls in argument defaults
]
exclude = [
    ".git",
    ".mypy_cache",
    ".ruff_cache",
    "migrations",
    "venv",
    ".venv",
]

[tool.ruff.isort]
known-first-party = ["apps", "config"]
```

---

### Task 21: Create .flake8 Configuration

**Goal:** Create flake8 configuration file.

**Content:**
```ini
# .flake8

[flake8]
max-line-length = 88
extend-ignore = E203, E266, E501, W503
max-complexity = 10
exclude =
    .git,
    __pycache__,
    .mypy_cache,
    .pytest_cache,
    migrations,
    venv,
    .venv,
    build,
    dist,
    *.egg-info
per-file-ignores =
    __init__.py:F401
    tests/*:S101
```

---

### Task 34: Create mypy.ini

**Goal:** Create mypy configuration file.

**Content:**
```ini
# mypy.ini

[mypy]
python_version = 3.12
plugins = mypy_django_plugin.main

# Strict mode settings
strict = true
warn_return_any = true
warn_unused_configs = true
warn_redundant_casts = true
warn_unused_ignores = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
strict_optional = true

# Import discovery
ignore_missing_imports = true
follow_imports = silent

# Error messages
show_error_codes = true
show_column_numbers = true
pretty = true

# Per-module options
[mypy.plugins.django-stubs]
django_settings_module = config.settings.local

[mypy-*.migrations.*]
ignore_errors = true

[mypy-tests.*]
disallow_untyped_defs = false
```

---

### Task 49: Create .eslintrc.json

**Goal:** Create ESLint configuration file.

**Content:**
```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks", "import"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

### Task 62: Create .prettierrc

**Goal:** Create Prettier configuration file.

**Content:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

---

### Task 70: Create .pre-commit-config.yaml

**Goal:** Create pre-commit hooks configuration.

**Content:**
```yaml
# .pre-commit-config.yaml

repos:
  # General hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: check-merge-conflict
      - id: detect-private-key

  # Python - Black
  - repo: https://github.com/psf/black
    rev: 24.1.0
    hooks:
      - id: black
        language_version: python3.12
        args: ['--config', 'pyproject.toml']
        files: ^backend/

  # Python - isort
  - repo: https://github.com/PyCQA/isort
    rev: 5.13.0
    hooks:
      - id: isort
        args: ['--settings-path', 'pyproject.toml']
        files: ^backend/

  # Python - Ruff (fast linter)
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.14
    hooks:
      - id: ruff
        args: ['--fix', '--config', 'pyproject.toml']
        files: ^backend/

  # Python - mypy
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies:
          - django-stubs
          - djangorestframework-stubs
        args: ['--config-file', 'mypy.ini']
        files: ^backend/

ci:
  autofix_commit_msg: |
    [pre-commit.ci] auto fixes from pre-commit hooks
  autoupdate_commit_msg: |
    [pre-commit.ci] pre-commit autoupdate
```

---

### Task 84: Create VS Code settings.json

**Goal:** Create VS Code workspace settings.

**Content:**
```json
{
  // Python settings
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.formatting.provider": "none",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.linting.mypyEnabled": true,

  // TypeScript/JavaScript settings
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.organizeImports": true
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // General settings
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // ESLint settings
  "eslint.workingDirectories": ["./frontend"],
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

### Task 89: Create .editorconfig

**Goal:** Create universal editor configuration.

**Content:**
```ini
# .editorconfig
# https://editorconfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

# Python files
[*.py]
indent_size = 4
max_line_length = 88

# JavaScript/TypeScript files
[*.{js,jsx,ts,tsx}]
indent_size = 2

# JSON files
[*.json]
indent_size = 2

# YAML files
[*.{yml,yaml}]
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false

# Makefiles
[Makefile]
indent_style = tab
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── backend/
│   └── (Python code formatted with Black/isort)
├── frontend/
│   └── (TypeScript code linted with ESLint/Prettier)
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── .editorconfig
├── .flake8
├── .eslintrc.json
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── .pre-commit-config.yaml
├── mypy.ini
└── pyproject.toml
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Groups A-D (Backend) before E-F (Frontend)
2. **Black Compatibility:** All Python tools must use line-length = 88
3. **Pre-commit:** Install hooks after all tool configurations are complete
4. **VS Code:** Settings support both backend and frontend development
5. **Testing:** Run full lint check before committing
6. **CI/CD:** Pre-commit hooks will be integrated with GitHub Actions later
7. **Ruff vs flake8:** Ruff is faster but both can be used
8. **Type Checking:** mypy may show many errors initially - fix gradually
