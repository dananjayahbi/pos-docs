# Tasks 83-88: VS Code Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** H - Editor Configuration & Verification  
> **Document:** 01 of 03  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-G_Pre-commit-Hooks-Setup/03_Tasks-78-82_Husky-Lintstaged.md](../Group-G_Pre-commit-Hooks-Setup/03_Tasks-78-82_Husky-Lintstaged.md)
- **→ Next Document:** [02_Tasks-89-91_EditorConfig-Setup.md](02_Tasks-89-91_EditorConfig-Setup.md)

---

## Document Overview

This document covers VS Code workspace configuration for the project.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 83 | Create .vscode/ Directory | Simple |
| 84 | Create settings.json | Medium |
| 85 | Configure Python Formatter | Simple |
| 86 | Configure Python Linting | Simple |
| 87 | Configure Format on Save | Simple |
| 88 | Create extensions.json | Medium |

---

## Task 83: Create .vscode/ Directory

### Overview
Create .vscode directory at repository root for workspace settings.

### Dependencies
- Task 01: Monorepo structure exists

### Instructions

1. **Create directory**
   - At repository root

2. **Add to git**
   - Track configuration

3. **Create .gitkeep**
   - If directory empty initially

### Directory Structure

```
/                            # Repository root
├── .vscode/                 # VS Code settings
│   └── (files will be added)
├── backend/
├── frontend/
└── ...
```

### Why .vscode in Repository

| Reason | Benefit |
|--------|---------|
| Shared settings | Team consistency |
| Extension recommendations | Easy onboarding |
| Debug configurations | Shared launch configs |
| Task configurations | Common tasks |

### What to Track vs Ignore

| Track | Ignore |
|-------|--------|
| settings.json | *.local.json |
| extensions.json | .history/ |
| launch.json | .browse.vc.db |
| tasks.json | workspaceStorage/ |

### Expected Outcome
- .vscode directory exists
- Ready for settings

### Verification Checklist
- [ ] Directory created
- [ ] At repository root
- [ ] Tracked in git

---

## Task 84: Create settings.json

### Overview
Create workspace settings file with base configuration.

### Dependencies
- Task 83: .vscode directory exists

### Instructions

1. **Create settings.json**
   - In .vscode directory

2. **Add base settings**
   - Editor, files

3. **Add comments**
   - Document sections

### Initial settings.json

```json
{
    // ==================================================
    // LankaCommerce Cloud - VS Code Workspace Settings
    // ==================================================

    // Editor settings
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.rulers": [88, 120],
    "editor.wordWrap": "off",
    "editor.minimap.enabled": false,
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": true,
    "editor.suggest.showStatusBar": true,
    "editor.inlineSuggest.enabled": true,

    // Files settings
    "files.encoding": "utf8",
    "files.eol": "\n",
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true,
    "files.exclude": {
        "**/__pycache__": true,
        "**/.pytest_cache": true,
        "**/*.pyc": true,
        "**/.mypy_cache": true,
        "**/.ruff_cache": true,
        "**/node_modules": true,
        "**/.next": true
    }
}
```

### Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| editor.tabSize | 4 | Default tab size |
| editor.rulers | [88, 120] | Line length guides |
| files.eol | \n | Unix line endings |
| files.insertFinalNewline | true | Ensure final newline |

### Why These Rulers

| Line | Purpose |
|------|---------|
| 88 | Black default |
| 120 | Long lines warning |

### Expected Outcome
- settings.json created
- Base settings configured

### Verification Checklist
- [ ] File created
- [ ] Valid JSON
- [ ] Base settings present

---

## Task 85: Configure Python Formatter

### Overview
Configure Black as the Python formatter in VS Code.

### Dependencies
- Task 84: settings.json exists

### Instructions

1. **Add Python section**
   - Language-specific settings

2. **Set Black formatter**
   - Default formatter

3. **Configure Black extension**
   - Args, path

### settings.json Additions

```json
{
    // Python settings
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
        "editor.tabSize": 4,
        "editor.formatOnSave": true,
        "editor.formatOnType": false,
        "editor.codeActionsOnSave": {
            "source.organizeImports": "explicit"
        }
    },

    // Black formatter settings
    "black-formatter.args": ["--config", "${workspaceFolder}/backend/pyproject.toml"],
    "black-formatter.path": ["black"]
}
```

### Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| editor.defaultFormatter | ms-python.black-formatter | Use Black extension |
| black-formatter.args | --config | Use project config |
| source.organizeImports | explicit | isort on save |

### Why Black Extension

| Option | Method |
|--------|--------|
| black-formatter | VS Code extension (recommended) |
| python.formatting.provider | Legacy (deprecated) |

### Expected Outcome
- Black configured
- Python files formatted

### Verification Checklist
- [ ] Python section added
- [ ] Black formatter set
- [ ] Config path correct

---

## Task 86: Configure Python Linting

### Overview
Configure flake8 and mypy for Python linting in VS Code.

### Dependencies
- Task 84: settings.json exists

### Instructions

1. **Enable Python linting**
   - New extension-based config

2. **Configure flake8**
   - flake8 extension

3. **Configure mypy**
   - mypy extension

### settings.json Additions

```json
{
    // Python linting settings (extension-based)
    "flake8.args": ["--config", "${workspaceFolder}/backend/.flake8"],
    "flake8.cwd": "${workspaceFolder}/backend",
    "flake8.enabled": true,

    // mypy settings
    "mypy-type-checker.args": ["--config-file", "${workspaceFolder}/backend/mypy.ini"],
    "mypy-type-checker.cwd": "${workspaceFolder}/backend",

    // Ruff settings (if using Ruff instead of flake8)
    "ruff.args": ["--config", "${workspaceFolder}/backend/pyproject.toml"],
    "ruff.organizeImports": true,
    "ruff.fixAll": true
}
```

### Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| flake8.args | --config | Use .flake8 config |
| flake8.cwd | backend/ | Working directory |
| mypy-type-checker.args | --config-file | Use mypy.ini |

### Choosing flake8 vs Ruff

| Tool | Pros |
|------|------|
| flake8 | Mature, many plugins |
| Ruff | Fast, replaces multiple tools |

### Expected Outcome
- Linting enabled
- Errors shown in editor

### Verification Checklist
- [ ] flake8 configured
- [ ] mypy configured
- [ ] Config paths correct

---

## Task 87: Configure Format on Save

### Overview
Enable format on save for all languages.

### Dependencies
- Task 84: settings.json exists

### Instructions

1. **Enable for Python**
   - Already in Task 85

2. **Enable for TypeScript**
   - Prettier formatter

3. **Enable for other files**
   - JSON, CSS, Markdown

### settings.json Additions

```json
{
    // TypeScript/JavaScript settings
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": "explicit"
        }
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": "explicit"
        }
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },

    // Other file types
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[css]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[scss]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
    "[markdown]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "editor.wordWrap": "on"
    },
    "[yaml]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    }
}
```

### Format on Save Summary

| Language | Formatter |
|----------|-----------|
| Python | Black |
| TypeScript/React | Prettier |
| JavaScript | Prettier |
| JSON | Prettier |
| CSS/SCSS | Prettier |
| Markdown | Prettier |
| YAML | Prettier |

### ESLint Fix on Save

| Setting | Value | Effect |
|---------|-------|--------|
| source.fixAll.eslint | explicit | Run ESLint --fix |

### Expected Outcome
- All files format on save
- ESLint fixes applied

### Verification Checklist
- [ ] Python formats with Black
- [ ] TypeScript formats with Prettier
- [ ] ESLint fixes on save

---

## Task 88: Create extensions.json

### Overview
Create recommended extensions file for team.

### Dependencies
- Task 83: .vscode directory exists

### Instructions

1. **Create extensions.json**
   - In .vscode directory

2. **Add recommendations**
   - Python, TypeScript tools

3. **Add unwanted**
   - Conflicting extensions

### extensions.json

```json
{
    // Recommended extensions for LankaCommerce Cloud development
    "recommendations": [
        // Python extensions
        "ms-python.python",
        "ms-python.vscode-pylance",
        "ms-python.black-formatter",
        "ms-python.flake8",
        "ms-python.mypy-type-checker",
        "ms-python.isort",
        "charliermarsh.ruff",

        // JavaScript/TypeScript extensions
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",

        // General development
        "editorconfig.editorconfig",
        "eamodio.gitlens",
        "usernamehw.errorlens",
        "gruntfuggly.todo-tree",

        // Docker
        "ms-azuretools.vscode-docker",

        // Database
        "mtxr.sqltools",
        "mtxr.sqltools-driver-pg",

        // API development
        "humao.rest-client",
        "42crunch.vscode-openapi"
    ],
    "unwantedRecommendations": [
        // Avoid conflicts with project linters
        "hookyqr.beautify",
        "HookyQR.minify"
    ]
}
```

### Extension Categories

| Category | Extensions |
|----------|------------|
| Python | python, pylance, black-formatter, flake8, mypy, isort, ruff |
| JavaScript | eslint, prettier, tailwindcss |
| General | editorconfig, gitlens, errorlens, todo-tree |
| Docker | vscode-docker |
| Database | sqltools, pg driver |
| API | rest-client, openapi |

### Why These Extensions

| Extension | Purpose |
|-----------|---------|
| errorlens | Inline error display |
| gitlens | Git superpowers |
| todo-tree | Find TODO comments |
| rest-client | Test APIs in VS Code |

### Expected Outcome
- extensions.json created
- Team sees recommendations

### Verification Checklist
- [ ] File created
- [ ] Python extensions listed
- [ ] TypeScript extensions listed
- [ ] Unwanted list present

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 83 | Create .vscode/ Directory | Directory structure |
| 84 | Create settings.json | Base settings |
| 85 | Configure Python Formatter | Black formatter |
| 86 | Configure Python Linting | flake8/mypy |
| 87 | Configure Format on Save | All languages |
| 88 | Create extensions.json | Recommendations |

### VS Code Files Created

```
/.vscode/
├── settings.json           # Workspace settings
└── extensions.json         # Recommended extensions
```

### Next Steps
Proceed to [02_Tasks-89-91_EditorConfig-Setup.md](02_Tasks-89-91_EditorConfig-Setup.md) for EditorConfig setup.

---

## Notes for AI Agents

1. **Location:** All files in .vscode/ at repo root
2. **Paths:** Use ${workspaceFolder} for paths
3. **Extensions:** Use new extension-based linting
4. **Format on save:** Enable for all languages
5. **Recommendations:** Include all team tools
6. **JSON Comments:** Use // for comments in settings.json
