# Tasks 64-67: GitHub & VS Code Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** F - Root Configuration Files  
> **Document:** 02 of 02  
> **Tasks Covered:** 64, 65, 66, 67

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-61-63_Docker-Make.md](01_Tasks-61-63_Docker-Make.md)
- **→ Next SubPhase:** [../../SubPhase-02_Backend-Project-Initialization/](../../SubPhase-02_Backend-Project-Initialization/)

---

## Document Overview

This document covers the creation of GitHub workflow and template directories, as well as VS Code workspace settings to complete the monorepo structure setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 64 | Create .github/workflows/ Directory | Simple |
| 65 | Create .github/ISSUE_TEMPLATE/ Directory | Simple |
| 66 | Create .github/PULL_REQUEST_TEMPLATE.md | Medium |
| 67 | Create .vscode/settings.json | Medium |

---

## Task 64: Create .github/workflows/ Directory

### Overview
Create the GitHub Actions workflows directory for CI/CD pipeline configurations.

### Dependencies
- Task 17: Create .github/ Directory (Group B)

### Instructions

1. **Create the workflows directory**
   - Create a directory named `workflows/` inside `.github/`
   - This holds GitHub Actions workflow YAML files

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - CI/CD workflow definitions
   - Automated testing workflows
   - Deployment workflows
   - Code quality checks

### Planned Workflow Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `ci.yml` | Continuous integration |
| `cd.yml` | Continuous deployment |
| `test.yml` | Test automation |
| `lint.yml` | Code linting |
| `security.yml` | Security scanning |

### CI/CD Pipeline Stages

| Stage | Trigger | Actions |
|-------|---------|---------|
| **Lint** | Push, PR | Run linters on code |
| **Test** | Push, PR | Run unit and integration tests |
| **Build** | PR merge | Build Docker images |
| **Deploy** | Tag, Release | Deploy to environment |

### Workflow Triggers

| Trigger | Use Case |
|---------|----------|
| `push` | Run on code push |
| `pull_request` | Run on PR open/update |
| `release` | Run on release creation |
| `workflow_dispatch` | Manual trigger |
| `schedule` | Scheduled runs (cron) |

### Expected Outcome
```
.github/
├── workflows/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `.github/workflows/` directory exists
- [ ] `.gitkeep` file exists inside `workflows/`
- [ ] Directory is tracked by Git

---

## Task 65: Create .github/ISSUE_TEMPLATE/ Directory

### Overview
Create the GitHub issue templates directory for standardized bug reports and feature requests.

### Dependencies
- Task 17: Create .github/ Directory (Group B)

### Instructions

1. **Create the ISSUE_TEMPLATE directory**
   - Create a directory named `ISSUE_TEMPLATE/` inside `.github/`
   - Note: Use uppercase naming as per GitHub convention

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Bug report templates
   - Feature request templates
   - Question templates
   - Custom issue templates

### Planned Template Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `bug_report.yml` | Bug report template |
| `feature_request.yml` | Feature request template |
| `question.yml` | Question template |
| `config.yml` | Template configuration |

### Issue Template Types

| Template | Use Case |
|----------|----------|
| **Bug Report** | Report software bugs |
| **Feature Request** | Suggest new features |
| **Enhancement** | Improve existing features |
| **Documentation** | Documentation updates |
| **Question** | Ask questions |

### Bug Report Template Sections

| Section | Purpose |
|---------|---------|
| **Description** | What is the bug? |
| **Steps to Reproduce** | How to trigger the bug |
| **Expected Behavior** | What should happen |
| **Actual Behavior** | What actually happens |
| **Environment** | OS, browser, version |
| **Screenshots** | Visual evidence |

### Feature Request Template Sections

| Section | Purpose |
|---------|---------|
| **Problem** | What problem does this solve? |
| **Solution** | Proposed solution |
| **Alternatives** | Other solutions considered |
| **Context** | Additional context |
| **Priority** | How important is this? |

### Expected Outcome
```
.github/
├── ISSUE_TEMPLATE/
│   └── .gitkeep
├── workflows/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `.github/ISSUE_TEMPLATE/` directory exists
- [ ] Directory name is uppercase
- [ ] `.gitkeep` file exists inside `ISSUE_TEMPLATE/`
- [ ] Directory is tracked by Git

---

## Task 66: Create .github/PULL_REQUEST_TEMPLATE.md

### Overview
Create a pull request template to standardize PR descriptions and ensure consistent review processes.

### Dependencies
- Task 17: Create .github/ Directory (Group B)

### Instructions

1. **Create the PR template file**
   - Create a file named `PULL_REQUEST_TEMPLATE.md` in the `.github/` directory

2. **Add description section**
   - What changes were made
   - Why these changes are needed
   - Link to related issues

3. **Add type of change section**
   - Checkboxes for change types
   - Bug fix, feature, breaking change, docs

4. **Add testing section**
   - What tests were added
   - How was it tested
   - Test coverage

5. **Add checklist section**
   - Code follows style guidelines
   - Self-review completed
   - Documentation updated
   - Tests added/updated

### PR Template Sections

| Section | Purpose |
|---------|---------|
| **Description** | What and why |
| **Related Issues** | Link to issues |
| **Type of Change** | Categorize the PR |
| **How Tested** | Testing approach |
| **Checklist** | Quality checks |
| **Screenshots** | Visual changes |

### Type of Change Options

| Type | Description |
|------|-------------|
| 🐛 Bug fix | Non-breaking fix |
| ✨ Feature | New functionality |
| 💥 Breaking change | Incompatible change |
| 📚 Documentation | Docs only |
| 🎨 Style | Formatting, no code change |
| ♻️ Refactor | Code change, no feature |
| ⚡ Performance | Optimization |
| 🧪 Test | Test additions |

### PR Checklist Items

| Item | Purpose |
|------|---------|
| Code follows guidelines | Style compliance |
| Self-review done | Author reviewed own code |
| Comments added | Complex logic explained |
| Docs updated | Documentation current |
| Tests added | Coverage maintained |
| No warnings | Clean build |
| Migrations included | Database changes |

### Expected Outcome
```
.github/
├── ISSUE_TEMPLATE/
│   └── .gitkeep
├── workflows/
│   └── .gitkeep
├── PULL_REQUEST_TEMPLATE.md     # PR template
└── .gitkeep
```

### Verification Checklist
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` file exists
- [ ] Description section is present
- [ ] Type of change checkboxes included
- [ ] Testing section is present
- [ ] Quality checklist included

---

## Task 67: Create .vscode/settings.json

### Overview
Create VS Code workspace settings for consistent development environment across all team members.

### Dependencies
- Task 18: Create .vscode/ Directory (Group B)

### Instructions

1. **Create the settings.json file**
   - Create a file named `settings.json` in the `.vscode/` directory

2. **Configure editor settings**
   - Set default formatter
   - Enable format on save
   - Set tab size and style
   - Configure line endings

3. **Configure Python settings**
   - Set Python interpreter path
   - Configure linting tools (Ruff)
   - Set up formatting (Black)
   - Configure type checking (Pylance)

4. **Configure TypeScript/JavaScript settings**
   - Set Node.js path
   - Configure ESLint
   - Set up Prettier
   - Enable TypeScript checks

5. **Configure file associations**
   - Associate file types with languages
   - Set specific file icons
   - Configure search exclusions

6. **Configure workspace settings**
   - Set recommended extensions
   - Configure terminal settings
   - Set debug configurations

### VS Code Settings Categories

| Category | Purpose |
|----------|---------|
| **Editor** | General editor behavior |
| **Python** | Python development |
| **TypeScript** | Frontend development |
| **Files** | File handling |
| **Search** | Search exclusions |
| **Terminal** | Terminal settings |

### Editor Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `formatOnSave` | true | Auto-format on save |
| `tabSize` | 4 (Python), 2 (TS) | Indentation |
| `insertSpaces` | true | Spaces over tabs |
| `rulers` | [88, 120] | Line length guides |
| `trimTrailingWhitespace` | true | Clean whitespace |

### Python Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `python.defaultInterpreterPath` | ./backend/.venv/bin/python | Python path |
| `python.linting.enabled` | true | Enable linting |
| `python.formatting.provider` | black | Code formatter |
| `python.analysis.typeCheckingMode` | basic | Type checking |

### TypeScript Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `typescript.preferences.quoteStyle` | single | Quote style |
| `typescript.updateImportsOnFileMove.enabled` | always | Auto-update imports |
| `eslint.validate` | ["javascript", "typescript"] | ESLint validation |

### File Exclusions

| Pattern | Purpose |
|---------|---------|
| `**/__pycache__` | Python cache |
| `**/node_modules` | Node dependencies |
| `**/.venv` | Python virtualenv |
| `**/dist` | Build outputs |
| `**/.next` | Next.js build |

### Recommended Extensions

| Extension | Purpose |
|-----------|---------|
| `ms-python.python` | Python support |
| `ms-python.vscode-pylance` | Python language server |
| `dbaeumer.vscode-eslint` | ESLint integration |
| `esbenp.prettier-vscode` | Prettier formatter |
| `ms-azuretools.vscode-docker` | Docker support |
| `bradlc.vscode-tailwindcss` | Tailwind CSS |

### Expected Outcome
```
.vscode/
├── settings.json            # Workspace settings
└── .gitkeep
```

### Verification Checklist
- [ ] `.vscode/settings.json` file exists
- [ ] Editor settings are configured
- [ ] Python settings are configured
- [ ] TypeScript settings are configured
- [ ] File exclusions are set
- [ ] Recommended extensions listed

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 64 | Create .github/workflows/ Directory | GitHub Actions directory |
| 65 | Create .github/ISSUE_TEMPLATE/ Directory | Issue templates directory |
| 66 | Create .github/PULL_REQUEST_TEMPLATE.md | PR template |
| 67 | Create .vscode/settings.json | VS Code workspace settings |

### Final GitHub & VS Code Structure
```
.github/
├── ISSUE_TEMPLATE/
│   └── .gitkeep
├── workflows/
│   └── .gitkeep
├── PULL_REQUEST_TEMPLATE.md
└── .gitkeep

.vscode/
├── settings.json
└── .gitkeep
```

---

## Group F Complete

### All Group F Tasks Completed
| Task # | Task Name | Status |
|--------|-----------|--------|
| 61 | Create docker-compose.yml | ✅ Complete |
| 62 | Create docker-compose.prod.yml | ✅ Complete |
| 63 | Create Makefile | ✅ Complete |
| 64 | Create .github/workflows/ Directory | ✅ Complete |
| 65 | Create .github/ISSUE_TEMPLATE/ Directory | ✅ Complete |
| 66 | Create .github/PULL_REQUEST_TEMPLATE.md | ✅ Complete |
| 67 | Create .vscode/settings.json | ✅ Complete |

### Group F Deliverables Summary
```
lankacommerce-cloud/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── .gitkeep
│   ├── workflows/
│   │   └── .gitkeep
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── .gitkeep
├── .vscode/
│   ├── settings.json
│   └── .gitkeep
├── docker-compose.prod.yml
├── docker-compose.yml
└── Makefile
```

---

## SubPhase 01 Complete! 🎉

### All Groups Completed
| Group | Name | Tasks | Status |
|-------|------|-------|--------|
| A | Repository Initialization | 01-10 | ✅ Complete |
| B | Root Directory Structure | 11-20 | ✅ Complete |
| C | Backend Directory Scaffold | 21-35 | ✅ Complete |
| D | Frontend Directory Scaffold | 36-50 | ✅ Complete |
| E | Shared & Support Directories | 51-60 | ✅ Complete |
| F | Root Configuration Files | 61-67 | ✅ Complete |

### Final Monorepo Structure

```
lankacommerce-cloud/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
│   └── settings.json
├── backend/
│   ├── apps/
│   ├── config/
│   ├── core/
│   ├── fixtures/
│   ├── locale/
│   ├── media/
│   ├── requirements/
│   ├── static/
│   ├── templates/
│   ├── tests/
│   ├── manage.py
│   ├── pyproject.toml
│   ├── README.md
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   ├── __tests__/
│   ├── package.json
│   ├── README.md
│   └── .env.example
├── shared/
│   ├── constants/
│   ├── types/
│   └── README.md
├── docker/
│   ├── backend/
│   ├── frontend/
│   └── nginx/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── guides/
├── scripts/
│   └── README.md
├── tests/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── Makefile
├── README.md
├── docker-compose.prod.yml
├── docker-compose.yml
└── .env.example
```

### Next Steps
Proceed to [SubPhase-02: Backend Project Initialization](../../SubPhase-02_Backend-Project-Initialization/) to set up Django project.

---

## Notes for AI Agents

1. **SubPhase Complete:** All 67 tasks of SubPhase-01 are now documented
2. **No Orphan Tasks:** Every task in the summary is covered in documents
3. **Proper Navigation:** All documents have parent, previous, and next links
4. **Git Commit:** Final commit: "docs: Complete SubPhase-01 Monorepo Structure Setup documentation"
5. **Ready for Execution:** These documents guide the actual repository creation
