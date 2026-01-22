# Tasks 09-13: Django Project Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** B - Django Project Creation  
> **Document:** 01 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Virtual-Environment-Setup/](../Group-A_Virtual-Environment-Setup/)
- **→ Next Document:** [02_Tasks-14-18_Config-Verification.md](02_Tasks-14-18_Config-Verification.md)

---

## Document Overview

This document covers installing Django, creating the project, and restructuring settings to a modular format.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Install Django | Simple |
| 10 | Create Django Project | Medium |
| 11 | Rename settings.py | Medium |
| 12 | Create settings __init__.py | Simple |
| 13 | Update manage.py | Simple |

---

## Task 09: Install Django

### Overview
Install Django 5.x into the virtual environment as the first major dependency.

### Dependencies
- Task 01: Create Python Virtual Environment (Group A)

### Instructions

1. **Ensure virtual environment is active**
   - Verify `(.venv)` in terminal prompt
   - All pip operations use virtual environment

2. **Install Django**
   - Use pip to install Django 5.x
   - Specify version constraint for compatibility

3. **Verify installation**
   - Check Django is importable
   - Confirm version is 5.x

### Django Version Selection

| Version | Status | Recommendation |
|---------|--------|----------------|
| 5.0.x | Current stable | ✅ Recommended |
| 5.1.x | Latest | ✅ If available |
| 4.2.x | LTS | ❌ Not for new projects |

### Why Django 5.x?

| Feature | Benefit |
|---------|---------|
| **Async Views** | Native async support |
| **Type Hints** | Better IDE support |
| **Simplified Templates** | Template improvements |
| **Field Defaults** | Database-computed defaults |

### Verification Commands

| Check | Expected Result |
|-------|-----------------|
| Import Django | No errors |
| Django version | 5.0+ |
| django-admin available | Command works |

### Expected Outcome
- Django 5.x installed in virtual environment
- `django-admin` command available

### Verification Checklist
- [ ] Virtual environment is active
- [ ] Django installation completed
- [ ] Django version is 5.x
- [ ] `django-admin` command works

---

## Task 10: Create Django Project

### Overview
Create the Django project using django-admin with `config` as the configuration directory name.

### Dependencies
- Task 09: Install Django

### Instructions

1. **Navigate to backend directory**
   - Ensure current directory is `backend/`
   - All Django commands run from here

2. **Create project with config directory**
   - Use django-admin startproject command
   - Name the project `config`
   - Use dot (.) to create in current directory

3. **Verify project structure**
   - Check config/ directory was created
   - Verify manage.py exists in backend/

### Project Creation Command

The command creates the project in the current directory:
- Project configuration module: `config/`
- Management script: `manage.py`

### Why "config" Name?

| Reason | Explanation |
|--------|-------------|
| **Clarity** | Clear purpose - configuration |
| **Convention** | Common Django pattern |
| **Avoids Conflicts** | Not a reserved name |
| **Import Friendly** | `from config.settings import *` |

### Generated Project Structure

```
backend/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py        # Will be restructured
│   ├── urls.py
│   └── wsgi.py
└── manage.py
```

### Expected Outcome
- `config/` directory created with Django files
- `manage.py` exists in `backend/`

### Verification Checklist
- [ ] Current directory is `backend/`
- [ ] `config/` directory exists
- [ ] `config/__init__.py` exists
- [ ] `config/settings.py` exists
- [ ] `manage.py` exists in `backend/`

---

## Task 11: Rename settings.py to base.py

### Overview
Convert the single settings.py file to a settings module by creating a settings directory and renaming settings.py to base.py.

### Dependencies
- Task 10: Create Django Project

### Instructions

1. **Create settings directory**
   - Create a directory named `settings/` inside `config/`
   - This will be the settings module

2. **Move and rename settings.py**
   - Move `config/settings.py` to `config/settings/base.py`
   - This becomes the base settings file

3. **Delete original settings.py**
   - Remove the original `config/settings.py`
   - Settings module replaces it

4. **Update BASE_DIR in base.py**
   - Adjust BASE_DIR to account for new directory level
   - Add one more `.parent` to the path

### Settings Module Structure

| Before | After |
|--------|-------|
| `config/settings.py` | `config/settings/` (directory) |
| Single file | `config/settings/base.py` |

### BASE_DIR Adjustment

The BASE_DIR path needs adjustment because settings moved one level deeper:

| Original | New |
|----------|-----|
| `Path(__file__).resolve().parent.parent` | `Path(__file__).resolve().parent.parent.parent` |

### base.py Key Modifications

| Setting | Modification |
|---------|--------------|
| `BASE_DIR` | Add one more `.parent` |
| `SECRET_KEY` | Keep as is (will be env variable later) |
| `DEBUG` | Keep as is (will be overridden) |

### Expected Outcome
```
config/
├── __init__.py
├── asgi.py
├── settings/
│   └── base.py             # Renamed from settings.py
├── urls.py
└── wsgi.py
```

### Verification Checklist
- [ ] `config/settings/` directory exists
- [ ] `config/settings/base.py` exists
- [ ] Original `config/settings.py` is removed
- [ ] `BASE_DIR` is updated in base.py

---

## Task 12: Create settings __init__.py

### Overview
Create the `__init__.py` file for the settings module to make it a proper Python package.

### Dependencies
- Task 11: Rename settings.py

### Instructions

1. **Create __init__.py file**
   - Create `__init__.py` inside `config/settings/`
   - This makes settings a Python package

2. **Add environment detection**
   - Import settings based on environment
   - Default to local settings for development

3. **Add import logic**
   - Check for DJANGO_ENV environment variable
   - Import appropriate settings module

### __init__.py Purpose

| Purpose | Description |
|---------|-------------|
| **Package Init** | Makes settings/ a Python package |
| **Environment Detection** | Selects correct settings file |
| **Clean Imports** | Allows `from config.settings import *` |

### Environment-Based Import Logic

| DJANGO_ENV Value | Settings Module |
|------------------|-----------------|
| `production` | `config.settings.production` |
| `test` | `config.settings.test` |
| `local` (default) | `config.settings.local` |

### Settings Import Pattern

The __init__.py should:
- Check DJANGO_ENV environment variable
- Default to 'local' if not set
- Import all settings from the appropriate module

### Expected Outcome
```
config/
├── __init__.py
├── asgi.py
├── settings/
│   ├── __init__.py         # Environment-based imports
│   └── base.py
├── urls.py
└── wsgi.py
```

### Verification Checklist
- [ ] `config/settings/__init__.py` exists
- [ ] Environment detection logic is present
- [ ] Default fallback to local settings
- [ ] Import statement is correct

---

## Task 13: Update manage.py

### Overview
Update manage.py to use the modular settings module instead of the old settings path.

### Dependencies
- Task 12: Create settings __init__.py

### Instructions

1. **Open manage.py**
   - Located in `backend/manage.py`

2. **Update DJANGO_SETTINGS_MODULE**
   - Change from `config.settings` to `config.settings`
   - The __init__.py handles environment detection

3. **Verify default settings path**
   - Ensure path points to settings module
   - Environment variable will override if set

### manage.py Modification

| Setting | Original | Updated |
|---------|----------|---------|
| `DJANGO_SETTINGS_MODULE` | `config.settings` | `config.settings` (unchanged, but now uses __init__.py) |

### Alternative: Direct Environment Setting

For explicit control, manage.py can set a specific environment:

| Use Case | Settings Module |
|----------|-----------------|
| Development | `config.settings.local` |
| Testing | `config.settings.test` |
| CI/CD | `config.settings.test` |

### Expected Outcome
- manage.py updated to use settings module
- Django commands use correct settings

### Verification Checklist
- [ ] manage.py has correct DJANGO_SETTINGS_MODULE
- [ ] No syntax errors in manage.py
- [ ] Ready for Django commands

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Install Django | Django 5.x in venv |
| 10 | Create Django Project | config/ directory |
| 11 | Rename settings.py | config/settings/base.py |
| 12 | Create settings __init__.py | Environment detection |
| 13 | Update manage.py | Correct settings path |

### Current Project Structure
```
backend/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings/
│   │   ├── __init__.py     # Environment detection
│   │   └── base.py         # Base settings
│   ├── urls.py
│   └── wsgi.py
└── manage.py
```

### Settings Module Benefits

| Benefit | Description |
|---------|-------------|
| **Separation** | Different settings per environment |
| **Security** | Production secrets not in base |
| **Flexibility** | Easy to add new environments |
| **Clarity** | Clear which settings apply where |

### Next Steps
Proceed to [02_Tasks-14-18_Config-Verification.md](02_Tasks-14-18_Config-Verification.md) to update entry points and verify installation.

---

## Notes for AI Agents

1. **Project Command:** Use `django-admin startproject config .` (dot at end)
2. **BASE_DIR:** Must update path with additional .parent
3. **Settings Module:** __init__.py handles environment selection
4. **DJANGO_SETTINGS_MODULE:** Points to config.settings (module, not file)
5. **Git Commit:** Do NOT commit yet - wait until all Group B tasks are complete
