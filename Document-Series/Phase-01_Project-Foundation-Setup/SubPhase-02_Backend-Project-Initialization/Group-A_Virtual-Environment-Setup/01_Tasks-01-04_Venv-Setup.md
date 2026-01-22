# Tasks 01-04: Virtual Environment Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** A - Virtual Environment Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous SubPhase:** [../../SubPhase-01_Monorepo-Structure-Setup/](../../SubPhase-01_Monorepo-Structure-Setup/)
- **→ Next Document:** [02_Tasks-05-08_Requirements-Files.md](02_Tasks-05-08_Requirements-Files.md)

---

## Document Overview

This document covers the creation and configuration of the Python virtual environment for the Django backend, including pip upgrade and pip-tools installation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create Python Virtual Environment | Simple |
| 02 | Activate Virtual Environment | Simple |
| 03 | Upgrade pip | Simple |
| 04 | Install pip-tools | Simple |

---

## Task 01: Create Python Virtual Environment

### Overview
Create a Python 3.12+ virtual environment inside the backend directory using Python's built-in venv module.

### Dependencies
- SubPhase-01 complete (backend/ directory exists)

### Instructions

1. **Verify Python version**
   - Confirm Python 3.12 or higher is installed
   - Check version matches project requirements

2. **Navigate to backend directory**
   - Change directory to the backend folder
   - All Python-related operations happen here

3. **Create virtual environment**
   - Use Python's venv module to create environment
   - Name the environment `.venv` (hidden folder)
   - Place inside backend directory root

4. **Verify creation**
   - Confirm `.venv` directory was created
   - Check for activation scripts in appropriate subfolder

### Python Version Requirements

| Requirement | Version | Reason |
|-------------|---------|--------|
| Minimum | Python 3.12 | Required by project |
| Recommended | Python 3.12.x | Latest stable in 3.12 line |
| Maximum | Python 3.13.x | Tested compatibility |

### Virtual Environment Structure

| Path (Linux/macOS) | Path (Windows) | Purpose |
|--------------------|----------------|---------|
| `.venv/bin/` | `.venv/Scripts/` | Activation scripts |
| `.venv/lib/` | `.venv/Lib/` | Installed packages |
| `.venv/pyvenv.cfg` | `.venv/pyvenv.cfg` | Configuration file |

### Why .venv Directory?
- Hidden by default (starts with dot)
- Standard convention recognized by IDEs
- Easy to exclude from Git (in .gitignore)
- Clear indication of virtual environment

### Expected Outcome
```
backend/
├── .venv/
│   ├── bin/ (or Scripts/)
│   ├── lib/ (or Lib/)
│   └── pyvenv.cfg
└── ...
```

### Verification Checklist
- [ ] Python 3.12+ installed on system
- [ ] Current directory is `backend/`
- [ ] `.venv/` directory exists
- [ ] `pyvenv.cfg` file exists inside `.venv/`
- [ ] Activation scripts exist

---

## Task 02: Activate Virtual Environment

### Overview
Activate the virtual environment to isolate Python packages and ensure all subsequent operations use the virtual environment.

### Dependencies
- Task 01: Create Python Virtual Environment

### Instructions

1. **Identify operating system**
   - Determine if Windows, Linux, or macOS
   - Activation command differs by OS

2. **Activate virtual environment**
   - Use appropriate activation command
   - Prompt should change to show `(.venv)`

3. **Verify activation**
   - Check that prompt shows virtual environment name
   - Verify Python executable points to .venv

4. **Note for IDEs**
   - Configure VS Code to auto-select interpreter
   - Set Python path in workspace settings

### Activation Commands by OS

| Operating System | Shell | Activation Command |
|------------------|-------|-------------------|
| **Windows** | CMD | `.venv\Scripts\activate.bat` |
| **Windows** | PowerShell | `.venv\Scripts\Activate.ps1` |
| **Linux/macOS** | bash/zsh | `source .venv/bin/activate` |
| **Linux/macOS** | fish | `source .venv/bin/activate.fish` |

### Deactivation
To exit the virtual environment:
- Run `deactivate` command (works on all platforms)

### IDE Configuration

| IDE | Setting Location | Configuration |
|-----|------------------|---------------|
| **VS Code** | Command Palette | Python: Select Interpreter |
| **PyCharm** | Settings → Project | Python Interpreter |
| **Sublime Text** | Build System | Set Python path |

### VS Code Workspace Settings

Add to `.vscode/settings.json`:
- Python default interpreter path pointing to `.venv`
- Auto-activate environment in terminal

### Signs of Successful Activation

| Indicator | Description |
|-----------|-------------|
| **Prompt Change** | `(.venv)` prefix in terminal |
| **Python Path** | `which python` shows `.venv/bin/python` |
| **Pip Path** | `which pip` shows `.venv/bin/pip` |

### Expected Outcome
- Terminal prompt shows `(.venv)` prefix
- Python commands use virtual environment

### Verification Checklist
- [ ] Virtual environment is activated
- [ ] Terminal prompt shows `(.venv)`
- [ ] `python --version` shows 3.12+
- [ ] `which python` (or `where python`) shows `.venv` path

---

## Task 03: Upgrade pip

### Overview
Upgrade pip to the latest version to ensure access to the newest features and security fixes.

### Dependencies
- Task 01: Create Python Virtual Environment

### Instructions

1. **Ensure virtual environment is active**
   - Verify `(.venv)` in terminal prompt
   - All pip operations should be in venv

2. **Upgrade pip**
   - Use pip to upgrade itself
   - Target the latest available version

3. **Verify upgrade**
   - Check pip version after upgrade
   - Confirm no compatibility warnings

### Why Upgrade pip?
| Reason | Explanation |
|--------|-------------|
| **Security** | Latest security patches |
| **Features** | Newer dependency resolver |
| **Performance** | Faster package installation |
| **Compatibility** | Better error messages |

### pip Version History (Recent)

| Version | Key Feature |
|---------|-------------|
| 23.0+ | Improved resolver |
| 23.2+ | Better backtracking |
| 24.0+ | Latest improvements |

### Expected Outcome
- pip upgraded to latest version
- Ready for package installations

### Verification Checklist
- [ ] Virtual environment is active
- [ ] pip upgrade command completed
- [ ] `pip --version` shows latest version
- [ ] No error messages during upgrade

---

## Task 04: Install pip-tools

### Overview
Install pip-tools package for dependency management, which provides pip-compile for generating locked requirements files.

### Dependencies
- Task 03: Upgrade pip

### Instructions

1. **Ensure virtual environment is active**
   - Verify `(.venv)` in terminal prompt

2. **Install pip-tools**
   - Use pip to install pip-tools package

3. **Verify installation**
   - Check pip-compile is available
   - Check pip-sync is available

4. **Understand pip-tools workflow**
   - Write `.in` files with loose dependencies
   - Compile to `.txt` files with pinned versions
   - Use pip-sync to install exactly what's in `.txt`

### Why pip-tools?

| Feature | pip freeze | pip-tools |
|---------|-----------|-----------|
| **Input files** | None | `.in` files |
| **Lock files** | Manual | Auto-generated |
| **Dependency tree** | Flat | Hierarchical |
| **Upgrades** | Manual | Compile again |
| **Reproducibility** | Poor | Excellent |

### pip-tools Commands

| Command | Purpose |
|---------|---------|
| `pip-compile` | Compile `.in` to `.txt` |
| `pip-sync` | Sync environment to match `.txt` |
| `pip-compile --upgrade` | Upgrade all packages |
| `pip-compile --upgrade-package django` | Upgrade specific package |

### pip-compile Workflow

| Step | Action | Files |
|------|--------|-------|
| 1 | Write dependencies | `requirements/base.in` |
| 2 | Compile | `pip-compile requirements/base.in` |
| 3 | Output | `requirements/base.txt` (auto-generated) |
| 4 | Install | `pip-sync requirements/base.txt` |

### Expected Outcome
- pip-tools installed in virtual environment
- `pip-compile` command available
- `pip-sync` command available

### Verification Checklist
- [ ] Virtual environment is active
- [ ] pip-tools installation completed
- [ ] `pip-compile --version` shows version
- [ ] `pip-sync --version` shows version

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create Python Virtual Environment | `.venv/` directory |
| 02 | Activate Virtual Environment | Active venv with prompt |
| 03 | Upgrade pip | Latest pip version |
| 04 | Install pip-tools | pip-compile and pip-sync |

### Virtual Environment Structure
```
backend/
├── .venv/
│   ├── bin/ (or Scripts/)
│   │   ├── activate
│   │   ├── pip
│   │   ├── pip-compile
│   │   ├── pip-sync
│   │   └── python
│   ├── lib/ (or Lib/)
│   │   └── python3.12/
│   │       └── site-packages/
│   └── pyvenv.cfg
└── ...
```

### Installed Packages
| Package | Purpose |
|---------|---------|
| pip | Package installer (upgraded) |
| pip-tools | Dependency management |
| setuptools | Build system |
| wheel | Package format |

### Next Steps
Proceed to [02_Tasks-05-08_Requirements-Files.md](02_Tasks-05-08_Requirements-Files.md) to create requirements input files.

---

## Notes for AI Agents

1. **Always Activate:** Ensure venv is active before any pip operations
2. **Cross-Platform:** Document covers Windows, Linux, and macOS
3. **pip-tools Strategy:** .in files are input, .txt files are auto-generated
4. **Git Ignore:** .venv/ should already be in .gitignore
5. **Git Commit:** Do NOT commit yet - wait until all Group A tasks are complete
