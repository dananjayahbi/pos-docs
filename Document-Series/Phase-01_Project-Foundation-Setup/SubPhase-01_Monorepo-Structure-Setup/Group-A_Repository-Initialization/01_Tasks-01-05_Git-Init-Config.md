# Tasks 01-05: Git Initialization & Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** A - Repository Initialization  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-10_Project-Documentation.md](02_Tasks-06-10_Project-Documentation.md)

---

## Document Overview

This document covers the initial Git repository setup and core configuration files that establish coding standards across the project. These are foundational tasks that must complete before any other work begins.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create Root Directory | Simple |
| 02 | Initialize Git Repository | Simple |
| 03 | Create Main .gitignore | Medium |
| 04 | Create .gitattributes | Simple |
| 05 | Create Root .editorconfig | Simple |

---

## Task 01: Create Root Directory

### Overview
Create the root project directory that will contain the entire LankaCommerce Cloud monorepo codebase.

### Dependencies
- None (this is the first task)

### Instructions

1. **Create the root directory**
   - Create a directory named `lankacommerce-cloud`
   - This will be the top-level folder for the entire project
   - Use lowercase letters with hyphens (kebab-case)

2. **Set as working directory**
   - Navigate into the newly created directory
   - All subsequent tasks assume this as the working directory

### Naming Convention
- **Directory Name:** `lankacommerce-cloud`
- **Format:** Lowercase with hyphens (matches repository naming)
- **Rationale:** Easy to type in terminal, URL-friendly, consistent with Git conventions

### Expected Outcome
```
lankacommerce-cloud/
└── (empty directory ready for initialization)
```

### Verification Checklist
- [ ] Directory `lankacommerce-cloud` exists
- [ ] Directory is empty and ready for use
- [ ] Terminal/shell is now inside this directory

---

## Task 02: Initialize Git Repository

### Overview
Initialize Git version control for the project repository with proper user configuration.

### Dependencies
- Task 01: Create Root Directory

### Instructions

1. **Initialize Git**
   - Run Git initialization command inside the root directory
   - This creates the `.git/` subdirectory for version control

2. **Configure Git user settings (local)**
   - Set the local Git username for this repository
   - Set the local Git email for this repository
   - Use project-specific credentials

3. **Configure default branch name**
   - Set the default branch name to `main`
   - This aligns with modern Git conventions

### Configuration Values
| Setting | Value | Purpose |
|---------|-------|---------|
| user.name | LCC Developer | Display name for commits |
| user.email | dev@lankacommerce.lk | Email for commits |
| init.defaultBranch | main | Default branch name |

### Expected Outcome
```
lankacommerce-cloud/
└── .git/                    # Git repository internals
    ├── HEAD
    ├── config               # Local Git configuration
    ├── objects/
    ├── refs/
    └── ...
```

### Verification Checklist
- [ ] `.git/` directory exists in root
- [ ] Git commands work (e.g., `git status` shows initialized repo)
- [ ] Local user configuration is set correctly
- [ ] Default branch is named `main`

---

## Task 03: Create Main .gitignore

### Overview
Create a comprehensive `.gitignore` file that prevents unnecessary files from being tracked in version control.

### Dependencies
- Task 02: Initialize Git Repository

### Instructions

1. **Create the .gitignore file**
   - Create file named `.gitignore` in the root directory
   - This file tells Git which files/directories to ignore

2. **Include Python-related patterns**
   - Python bytecode files and cache directories
   - Virtual environment directories
   - Package build artifacts
   - Test coverage outputs

3. **Include Node.js-related patterns**
   - Node modules directory
   - Next.js build outputs
   - Package manager lock files (if using alternatives)
   - Build and distribution directories

4. **Include environment and secrets patterns**
   - Environment variable files (all variants)
   - Local configuration overrides
   - Secret keys and credentials

5. **Include IDE and editor patterns**
   - VS Code workspace files (except shared settings)
   - JetBrains IDE files
   - Vim/Neovim swap files
   - macOS and Windows system files

6. **Include build and log patterns**
   - Log files
   - Temporary files
   - Build outputs

### Content Categories to Include

| Category | Patterns to Ignore | Rationale |
|----------|-------------------|-----------|
| **Python** | `__pycache__/`, `*.pyc`, `*.pyo`, `.venv/`, `venv/`, `*.egg-info/`, `.eggs/` | Compiled files, virtual envs |
| **Node.js** | `node_modules/`, `.next/`, `out/`, `.turbo/`, `dist/` | Dependencies, builds |
| **Environment** | `.env`, `.env.local`, `.env.*.local`, `.env.development.local`, `.env.production.local` | Secrets, local config |
| **Testing** | `.coverage`, `htmlcov/`, `.pytest_cache/`, `.nyc_output/`, `coverage/` | Test artifacts |
| **IDE** | `.idea/`, `*.swp`, `*.swo`, `.vscode/*`, `!.vscode/settings.json`, `!.vscode/extensions.json` | Editor-specific files |
| **System** | `.DS_Store`, `Thumbs.db`, `*.log`, `*.tmp` | OS files, logs |
| **Build** | `build/`, `dist/`, `*.egg`, `.eggs/` | Build artifacts |
| **Docker** | `*.log`, `.docker/` | Container logs |
| **Database** | `*.sqlite3`, `*.db` | Local databases |

### Special Considerations
- **Keep VS Code shared settings:** Use negation pattern `!.vscode/settings.json`
- **Keep VS Code extensions list:** Use negation pattern `!.vscode/extensions.json`
- **Media files in dev:** Ignore `media/` as it's for development only

### Expected Outcome
```
lankacommerce-cloud/
├── .git/
└── .gitignore               # Comprehensive ignore patterns
```

### Verification Checklist
- [ ] `.gitignore` file exists in root directory
- [ ] Python patterns are included
- [ ] Node.js patterns are included
- [ ] Environment file patterns are included
- [ ] IDE patterns are included (with VS Code exceptions)
- [ ] Running `git status` no longer shows ignored files

---

## Task 04: Create .gitattributes

### Overview
Create a `.gitattributes` file to ensure consistent file handling across different operating systems and developers.

### Dependencies
- Task 02: Initialize Git Repository

### Instructions

1. **Create the .gitattributes file**
   - Create file named `.gitattributes` in the root directory
   - This file controls how Git handles specific file types

2. **Configure line ending normalization**
   - Set default behavior for text files
   - Ensure consistent line endings across platforms (Windows, macOS, Linux)

3. **Configure binary file handling**
   - Mark image files as binary
   - Mark font files as binary
   - Mark other non-text files as binary

4. **Configure merge strategies**
   - Set lock files to use union merge strategy
   - Prevent conflicts in auto-generated files

5. **Configure diff behavior**
   - Enable better diff for specific file types
   - Improve code review experience

### Configuration Patterns to Include

| Pattern | Attribute | Purpose |
|---------|-----------|---------|
| `*` | `text=auto` | Auto-detect text files, normalize line endings |
| `*.py` | `text diff=python` | Python files with Python diff |
| `*.js` | `text` | JavaScript as text |
| `*.ts` | `text` | TypeScript as text |
| `*.tsx` | `text` | TSX as text |
| `*.jsx` | `text` | JSX as text |
| `*.json` | `text` | JSON as text |
| `*.md` | `text diff=markdown` | Markdown with markdown diff |
| `*.html` | `text diff=html` | HTML with HTML diff |
| `*.css` | `text` | CSS as text |
| `*.scss` | `text` | SCSS as text |
| `*.yml` | `text` | YAML as text |
| `*.yaml` | `text` | YAML as text |
| `*.sh` | `text eol=lf` | Shell scripts with LF endings |
| `*.bat` | `text eol=crlf` | Batch files with CRLF endings |
| `*.png` | `binary` | PNG images |
| `*.jpg` | `binary` | JPEG images |
| `*.jpeg` | `binary` | JPEG images |
| `*.gif` | `binary` | GIF images |
| `*.ico` | `binary` | Icon files |
| `*.svg` | `text` | SVG as text (XML) |
| `*.woff` | `binary` | Web fonts |
| `*.woff2` | `binary` | Web fonts |
| `*.ttf` | `binary` | TrueType fonts |
| `*.eot` | `binary` | Embedded OpenType fonts |
| `*.pdf` | `binary` | PDF documents |
| `package-lock.json` | `text -diff` | Lock file, no diff (too large) |
| `pnpm-lock.yaml` | `text -diff` | Lock file, no diff |
| `poetry.lock` | `text -diff` | Lock file, no diff |

### Expected Outcome
```
lankacommerce-cloud/
├── .git/
├── .gitignore
└── .gitattributes           # File handling configuration
```

### Verification Checklist
- [ ] `.gitattributes` file exists in root directory
- [ ] Text normalization is configured
- [ ] Binary files are properly marked
- [ ] Lock files have appropriate settings
- [ ] Shell scripts enforce LF line endings

---

## Task 05: Create Root .editorconfig

### Overview
Create an `.editorconfig` file to maintain consistent coding styles across different editors and IDEs used by team members.

### Dependencies
- Task 01: Create Root Directory

### Instructions

1. **Create the .editorconfig file**
   - Create file named `.editorconfig` in the root directory
   - This file is recognized by most modern editors

2. **Set root indicator**
   - Mark this as the root EditorConfig file
   - Prevents editors from looking for parent EditorConfig files

3. **Configure default settings**
   - Set default indentation style and size
   - Set default charset
   - Set default line ending preference
   - Configure trailing whitespace handling
   - Configure final newline requirement

4. **Configure Python-specific settings**
   - Python uses 4-space indentation (PEP 8)
   - Maximum line length guideline

5. **Configure JavaScript/TypeScript settings**
   - Frontend uses 2-space indentation (common convention)
   - Maximum line length guideline

6. **Configure Markdown settings**
   - Preserve trailing whitespace (used for line breaks)

7. **Configure Makefile settings**
   - Makefiles require tab indentation

### Configuration Settings

| File Pattern | Setting | Value | Rationale |
|--------------|---------|-------|-----------|
| **Default (all files)** | | | |
| `[*]` | `root` | `true` | Stop searching for EditorConfig |
| `[*]` | `indent_style` | `space` | Spaces over tabs (default) |
| `[*]` | `indent_size` | `4` | Default 4 spaces |
| `[*]` | `charset` | `utf-8` | Unicode support |
| `[*]` | `end_of_line` | `lf` | Unix-style line endings |
| `[*]` | `trim_trailing_whitespace` | `true` | Clean trailing spaces |
| `[*]` | `insert_final_newline` | `true` | POSIX standard |
| **Python Files** | | | |
| `[*.py]` | `indent_size` | `4` | PEP 8 standard |
| `[*.py]` | `max_line_length` | `88` | Black formatter default |
| **JavaScript/TypeScript** | | | |
| `[*.{js,jsx,ts,tsx}]` | `indent_size` | `2` | Common frontend convention |
| `[*.{js,jsx,ts,tsx}]` | `max_line_length` | `100` | Prettier default |
| **JSON/YAML** | | | |
| `[*.{json,yml,yaml}]` | `indent_size` | `2` | Common convention |
| **Markdown** | | | |
| `[*.md]` | `trim_trailing_whitespace` | `false` | Preserve for line breaks |
| `[*.md]` | `max_line_length` | `off` | Allow long lines |
| **Makefile** | | | |
| `[Makefile]` | `indent_style` | `tab` | Make requires tabs |
| **Shell Scripts** | | | |
| `[*.sh]` | `end_of_line` | `lf` | Unix scripts need LF |

### Expected Outcome
```
lankacommerce-cloud/
├── .git/
├── .gitignore
├── .gitattributes
└── .editorconfig            # Editor configuration
```

### Verification Checklist
- [ ] `.editorconfig` file exists in root directory
- [ ] Root indicator is set to `true`
- [ ] Python settings specify 4-space indentation
- [ ] JavaScript/TypeScript settings specify 2-space indentation
- [ ] Makefile settings specify tab indentation
- [ ] UTF-8 charset is configured
- [ ] LF line endings are the default

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create Root Directory | `lankacommerce-cloud/` directory |
| 02 | Initialize Git Repository | `.git/` directory with configuration |
| 03 | Create Main .gitignore | `.gitignore` with comprehensive patterns |
| 04 | Create .gitattributes | `.gitattributes` for file handling |
| 05 | Create Root .editorconfig | `.editorconfig` for coding standards |

### Current Directory Structure
```
lankacommerce-cloud/
├── .git/                    # Git repository
├── .editorconfig            # Editor configuration
├── .gitattributes           # Git file handling
└── .gitignore               # Ignored files
```

### Next Steps
Proceed to [02_Tasks-06-10_Project-Documentation.md](02_Tasks-06-10_Project-Documentation.md) to create project documentation files.

---

## Notes for AI Agents

1. **Execution Order:** Tasks 01-05 must be executed sequentially
2. **No Code Generation:** These instructions describe WHAT to do, not HOW to code it
3. **Git Commit:** Do NOT commit yet - wait until all Group A tasks are complete
4. **Verification:** Run each verification checklist before proceeding
5. **Configuration Files:** Content descriptions provide structure; actual implementation is AI's responsibility
