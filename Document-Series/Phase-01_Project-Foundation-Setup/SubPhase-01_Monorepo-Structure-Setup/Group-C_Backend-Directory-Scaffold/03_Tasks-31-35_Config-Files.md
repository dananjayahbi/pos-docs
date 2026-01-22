# Tasks 31-35: Backend Configuration Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** C - Backend Directory Scaffold  
> **Document:** 03 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-26-30_Support-Directories.md](02_Tasks-26-30_Support-Directories.md)
- **→ Next Group:** [../Group-D_Frontend-Directory-Scaffold/](../Group-D_Frontend-Directory-Scaffold/)

---

## Document Overview

This document covers the creation of backend configuration files including .gitkeep files, manage.py placeholder, pyproject.toml, README, and environment template.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create backend/.gitkeep Files | Simple |
| 32 | Create backend/manage.py Placeholder | Simple |
| 33 | Create backend/pyproject.toml | Medium |
| 34 | Create backend/README.md | Medium |
| 35 | Create backend/.env.example | Medium |

---

## Task 31: Create backend/.gitkeep Files

### Overview
Ensure all backend subdirectories have .gitkeep files so they are tracked by Git even when empty.

### Dependencies
- Tasks 21-30: All backend subdirectories created

### Instructions

1. **Verify existing .gitkeep files**
   - Check that each subdirectory created in Tasks 21-30 has a `.gitkeep` file
   - If any are missing, create them

2. **Purpose of .gitkeep files**
   - Git does not track empty directories
   - `.gitkeep` is a convention to force Git to track them
   - These files can be removed once real content is added

3. **Directories requiring .gitkeep**
   - `apps/`
   - `config/`
   - `core/`
   - `static/`
   - `media/`
   - `templates/`
   - `tests/`
   - `fixtures/`
   - `locale/`
   - `requirements/`

### Verification Process
- Navigate to each directory
- Confirm `.gitkeep` file exists
- File should be empty (0 bytes)

### Expected Outcome
All 10 backend subdirectories contain a `.gitkeep` file:

```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── locale/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── requirements/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
└── tests/
    └── .gitkeep
```

### Verification Checklist
- [ ] All 10 subdirectories have `.gitkeep` files
- [ ] Files are empty (0 bytes)
- [ ] Git status shows directories are tracked

---

## Task 32: Create backend/manage.py Placeholder

### Overview
Create a placeholder manage.py file that will be replaced with the actual Django management script during Django project initialization in SubPhase-02.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the manage.py placeholder**
   - Create a file named `manage.py` in the `backend/` directory
   - This is a placeholder with documentation comments

2. **Placeholder content purpose**
   - Indicate this is a placeholder file
   - Document what will replace it
   - Prevent accidental execution

3. **Content to include**
   - Python shebang line
   - Module docstring explaining placeholder status
   - Reference to SubPhase-02 for actual implementation
   - Placeholder code that exits with message

### Placeholder Structure Elements

| Element | Purpose |
|---------|---------|
| Shebang | `#!/usr/bin/env python` for Unix compatibility |
| Docstring | Explain placeholder status |
| Comment block | Reference to actual implementation phase |
| Main guard | `if __name__ == "__main__":` block |
| Exit message | Print message about placeholder status |

### What manage.py Will Become

| Feature | Description |
|---------|-------------|
| Django CLI | Command-line interface for Django |
| Settings module | Points to `config.settings.development` |
| Commands | runserver, migrate, shell, test, etc. |
| Environment | Loads from `.env` file |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── ... (other directories)
└── manage.py                # Placeholder file
```

### Verification Checklist
- [ ] `backend/manage.py` file exists
- [ ] File contains placeholder documentation
- [ ] File is executable (has shebang)
- [ ] Running file shows placeholder message

---

## Task 33: Create backend/pyproject.toml

### Overview
Create the Python project configuration file using the modern pyproject.toml format for project metadata, dependencies, and tool configuration.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the pyproject.toml file**
   - Create a file named `pyproject.toml` in the `backend/` directory
   - Follow PEP 518 and PEP 621 specifications

2. **Configure project metadata section**
   - Project name, version, description
   - Authors and maintainers
   - License information
   - Python version requirement
   - Project URLs

3. **Configure build system section**
   - Specify build backend (setuptools)
   - Build requirements

4. **Configure tool-specific sections**
   - Black (code formatter)
   - isort (import sorter)
   - pytest (testing)
   - mypy (type checking)
   - coverage (test coverage)

### Configuration Sections

#### [project] Section
| Field | Value | Purpose |
|-------|-------|---------|
| name | lankacommerce-backend | Package name |
| version | 0.1.0 | Semantic version |
| description | LankaCommerce Cloud Backend | Short description |
| readme | README.md | Readme file path |
| license | { text = "MIT" } | License type |
| requires-python | >=3.12 | Python version |
| authors | [{ name = "LCC Team" }] | Author info |

#### [tool.black] Section
| Setting | Value | Purpose |
|---------|-------|---------|
| line-length | 88 | Max line length |
| target-version | ["py312"] | Python version |
| include | '\.pyi?$' | Files to format |
| exclude | migrations | Skip migrations |

#### [tool.isort] Section
| Setting | Value | Purpose |
|---------|-------|---------|
| profile | black | Compatible with Black |
| line_length | 88 | Match Black |
| known_django | django | Django imports group |
| known_first_party | apps,config,core | Local imports |
| sections | FUTURE,STDLIB,DJANGO,THIRDPARTY,FIRSTPARTY,LOCALFOLDER | Import order |

#### [tool.pytest.ini_options] Section
| Setting | Value | Purpose |
|---------|-------|---------|
| DJANGO_SETTINGS_MODULE | config.settings.testing | Test settings |
| python_files | test_*.py | Test file pattern |
| python_classes | Test* | Test class pattern |
| python_functions | test_* | Test function pattern |
| addopts | -v --tb=short | Default options |

#### [tool.mypy] Section
| Setting | Value | Purpose |
|---------|-------|---------|
| python_version | 3.12 | Python version |
| plugins | mypy_django_plugin.main | Django plugin |
| ignore_missing_imports | true | Ignore missing stubs |
| strict | false | Not strict mode (initial) |

#### [tool.coverage.run] Section
| Setting | Value | Purpose |
|---------|-------|---------|
| source | apps,core | Coverage source |
| omit | */migrations/*,*/tests/* | Exclude patterns |
| branch | true | Branch coverage |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── ... (other directories)
├── manage.py
└── pyproject.toml           # Python project config
```

### Verification Checklist
- [ ] `backend/pyproject.toml` file exists
- [ ] Project metadata is complete
- [ ] Tool configurations are included
- [ ] Python version 3.12+ is required
- [ ] File follows TOML syntax

---

## Task 34: Create backend/README.md

### Overview
Create backend-specific documentation that explains the Django application structure, setup instructions, and development guidelines.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the README.md file**
   - Create a file named `README.md` in the `backend/` directory

2. **Add overview section**
   - Brief description of the backend
   - Technology stack summary
   - Link to main project README

3. **Add directory structure section**
   - Explain each subdirectory's purpose
   - Clear mapping of Django components

4. **Add setup instructions section**
   - Prerequisites (Python, PostgreSQL, Redis)
   - Virtual environment setup
   - Dependency installation
   - Environment configuration
   - Database setup
   - Running the development server

5. **Add development commands section**
   - Common Django commands
   - Testing commands
   - Code quality commands

6. **Add architecture section**
   - Multi-tenancy explanation
   - App organization strategy
   - API design principles

7. **Add testing section**
   - How to run tests
   - Writing new tests
   - Coverage requirements

### Content Sections

| Section | Description |
|---------|-------------|
| **Overview** | Backend purpose and tech stack |
| **Directory Structure** | Explanation of folders |
| **Prerequisites** | Required software |
| **Setup** | Step-by-step setup guide |
| **Commands** | Common development commands |
| **Architecture** | Design decisions |
| **Testing** | Testing guidelines |
| **API** | API documentation links |

### Technology Stack Summary

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12+ | Programming language |
| Django | 5.x | Web framework |
| DRF | 3.15+ | REST API framework |
| PostgreSQL | 15+ | Database |
| Redis | 7+ | Cache and message broker |
| Celery | 5.x | Task queue |
| django-tenants | 3.x | Multi-tenancy |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── ... (other directories)
├── manage.py
├── pyproject.toml
└── README.md                # Backend documentation
```

### Verification Checklist
- [ ] `backend/README.md` file exists
- [ ] Overview section is present
- [ ] Directory structure is documented
- [ ] Setup instructions are included
- [ ] Development commands are listed
- [ ] Links to main README are included

---

## Task 35: Create backend/.env.example

### Overview
Create a backend-specific environment variable template that documents all required configuration for the Django application.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the .env.example file**
   - Create a file named `.env.example` in the `backend/` directory
   - This is specific to backend configuration

2. **Organize by category**
   - Group related variables with section comments
   - Provide example values where safe
   - Leave sensitive values empty

3. **Include all Django-specific settings**
   - Django configuration
   - Database settings
   - Cache/Redis settings
   - Celery settings
   - Email settings
   - Multi-tenancy settings

### Environment Variable Categories

#### Django Core Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Secret key for cryptographic signing | (generate locally) |
| `DJANGO_DEBUG` | Debug mode | True |
| `DJANGO_ALLOWED_HOSTS` | Allowed host headers | localhost,127.0.0.1 |
| `DJANGO_SETTINGS_MODULE` | Settings module path | config.settings.development |

#### Database Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection URL | postgres://user:pass@localhost:5432/lcc |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | lankacommerce_dev |
| `DB_USER` | Database user | lcc_user |
| `DB_PASSWORD` | Database password | (set locally) |

#### Redis/Cache Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | redis://localhost:6379/0 |
| `CACHE_BACKEND` | Cache backend class | django.core.cache.backends.redis.RedisCache |
| `CACHE_LOCATION` | Cache location | redis://localhost:6379/1 |

#### Celery Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `CELERY_BROKER_URL` | Message broker URL | redis://localhost:6379/2 |
| `CELERY_RESULT_BACKEND` | Result storage URL | redis://localhost:6379/3 |
| `CELERY_TIMEZONE` | Celery timezone | Asia/Colombo |

#### Multi-Tenancy Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `TENANT_MODEL` | Tenant model path | tenants.Tenant |
| `TENANT_DOMAIN_MODEL` | Domain model path | tenants.Domain |
| `PUBLIC_SCHEMA_NAME` | Public schema name | public |

#### Email Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_BACKEND` | Email backend class | django.core.mail.backends.console.EmailBackend |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_HOST_USER` | SMTP username | (set locally) |
| `EMAIL_HOST_PASSWORD` | SMTP password | (set locally) |
| `EMAIL_USE_TLS` | Use TLS | True |
| `DEFAULT_FROM_EMAIL` | Default sender | noreply@lankacommerce.lk |

#### File Storage Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `DEFAULT_FILE_STORAGE` | Storage backend | django.core.files.storage.FileSystemStorage |
| `AWS_ACCESS_KEY_ID` | S3 access key | (set locally) |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | (set locally) |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket name | lcc-media-dev |
| `AWS_S3_REGION_NAME` | S3 region | ap-south-1 |

#### Sri Lanka Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `DEFAULT_CURRENCY` | Default currency | LKR |
| `DEFAULT_TIMEZONE` | Default timezone | Asia/Colombo |
| `DEFAULT_LANGUAGE` | Default language | en |
| `SUPPORTED_LANGUAGES` | Supported languages | en,si,ta |

#### Security Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `CORS_ALLOWED_ORIGINS` | CORS origins | http://localhost:3000 |
| `CSRF_TRUSTED_ORIGINS` | CSRF trusted origins | http://localhost:3000 |
| `SECURE_SSL_REDIRECT` | SSL redirect | False |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── ... (other directories)
├── .env.example             # Backend env template
├── manage.py
├── pyproject.toml
└── README.md
```

### Verification Checklist
- [ ] `backend/.env.example` file exists
- [ ] All Django settings are documented
- [ ] Database variables are included
- [ ] Redis/Celery variables are included
- [ ] Sri Lanka-specific variables are included
- [ ] Sensitive values are empty

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create backend/.gitkeep Files | `.gitkeep` in all subdirectories |
| 32 | Create backend/manage.py Placeholder | `backend/manage.py` placeholder |
| 33 | Create backend/pyproject.toml | `backend/pyproject.toml` config |
| 34 | Create backend/README.md | `backend/README.md` documentation |
| 35 | Create backend/.env.example | `backend/.env.example` template |

### Final Group C Backend Structure
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── locale/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── requirements/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
├── .env.example
├── manage.py
├── pyproject.toml
└── README.md
```

### Group C Completion
All 15 tasks in Group C are now complete. The backend directory is fully scaffolded with:
- 10 subdirectories for Django components
- Configuration files (pyproject.toml)
- Documentation (README.md)
- Environment template (.env.example)
- Management script placeholder (manage.py)

### Next Steps
1. **Create Git commit** with message: `chore: scaffold backend directory structure`
2. Proceed to [../Group-D_Frontend-Directory-Scaffold/](../Group-D_Frontend-Directory-Scaffold/) to scaffold the frontend directory

---

## Notes for AI Agents

1. **Task 31:** Verification task - ensure all .gitkeep files exist
2. **Placeholders:** manage.py is a placeholder; actual Django setup is in SubPhase-02
3. **pyproject.toml:** Modern Python project configuration (not legacy setup.py)
4. **No Code Implementation:** These are configuration files, not application code
5. **Git Commit:** After completing Group C, create commit with all backend scaffold files
6. **Sri Lanka Context:** .env.example includes LKR, Asia/Colombo, Sinhala settings
