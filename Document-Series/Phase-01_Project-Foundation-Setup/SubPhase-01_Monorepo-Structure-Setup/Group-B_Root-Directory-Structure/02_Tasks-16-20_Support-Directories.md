# Tasks 16-20: Support Directories & Environment Template

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** B - Root Directory Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-11-15_Main-Directories.md](01_Tasks-11-15_Main-Directories.md)
- **→ Next Group:** [../Group-C_Backend-Directory-Scaffold/](../Group-C_Backend-Directory-Scaffold/)

---

## Document Overview

This document covers the creation of support directories for scripts, GitHub configuration, VS Code settings, integration tests, and the environment variable template file.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 16 | Create scripts/ Directory | Simple |
| 17 | Create .github/ Directory | Simple |
| 18 | Create .vscode/ Directory | Simple |
| 19 | Create tests/ Directory | Simple |
| 20 | Create .env.example File | Medium |

---

## Task 16: Create scripts/ Directory

### Overview
Create the scripts directory that will contain utility scripts for development, deployment, and automation.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the scripts directory**
   - Create a directory named `scripts/` in the root of the project
   - This will contain automation and utility scripts

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Development setup scripts
   - Database seeding scripts
   - Deployment automation
   - CI/CD helper scripts
   - Data migration utilities

### Planned Scripts Reference

| Script (Future) | Purpose |
|-----------------|---------|
| `setup-dev.sh` | Initialize development environment |
| `seed-db.sh` | Seed database with test data |
| `backup-db.sh` | Create database backups |
| `deploy.sh` | Deployment automation |
| `generate-types.sh` | Generate TypeScript types from API |
| `run-migrations.sh` | Run database migrations |

### Expected Outcome
```
lankacommerce-cloud/
├── scripts/
│   └── .gitkeep
└── ... (other directories)
```

### Verification Checklist
- [ ] `scripts/` directory exists in project root
- [ ] `.gitkeep` file exists inside `scripts/`
- [ ] Directory is tracked by Git

---

## Task 17: Create .github/ Directory

### Overview
Create the GitHub configuration directory that will contain workflows, issue templates, and pull request templates.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the .github directory**
   - Create a directory named `.github/` in the root of the project
   - This is a special directory recognized by GitHub

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - GitHub Actions workflows
   - Issue templates
   - Pull request templates
   - Funding configuration
   - Dependabot configuration

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `workflows/` | GitHub Actions CI/CD workflows |
| `ISSUE_TEMPLATE/` | Issue templates for bug reports, features |
| `PULL_REQUEST_TEMPLATE.md` | PR template |
| `FUNDING.yml` | Funding/sponsorship configuration |
| `dependabot.yml` | Dependency update configuration |

### Planned Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push, PR | Run tests and linting |
| `deploy-staging.yml` | Push to develop | Deploy to staging |
| `deploy-production.yml` | Push to main | Deploy to production |
| `codeql.yml` | Schedule, PR | Security analysis |

### Expected Outcome
```
lankacommerce-cloud/
├── .github/
│   └── .gitkeep
└── ... (other directories)
```

### Verification Checklist
- [ ] `.github/` directory exists in project root
- [ ] `.gitkeep` file exists inside `.github/`
- [ ] Directory is tracked by Git

---

## Task 18: Create .vscode/ Directory

### Overview
Create the VS Code configuration directory that will contain workspace settings, recommended extensions, and debug configurations.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the .vscode directory**
   - Create a directory named `.vscode/` in the root of the project
   - This is recognized by VS Code for workspace settings

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Workspace settings shared by all developers
   - Recommended extensions list
   - Debug configurations for Python and Node.js
   - Task definitions
   - Snippet definitions

### Planned Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `settings.json` | Workspace-specific settings |
| `extensions.json` | Recommended extensions |
| `launch.json` | Debug configurations |
| `tasks.json` | Build and run tasks |

### Recommended Extensions (Future)

| Extension | Purpose |
|-----------|---------|
| Python (ms-python) | Python language support |
| Pylance | Python IntelliSense |
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| Tailwind CSS IntelliSense | Tailwind class autocomplete |
| Docker | Docker support |
| GitLens | Git enhancements |

### Expected Outcome
```
lankacommerce-cloud/
├── .vscode/
│   └── .gitkeep
└── ... (other directories)
```

### Verification Checklist
- [ ] `.vscode/` directory exists in project root
- [ ] `.gitkeep` file exists inside `.vscode/`
- [ ] Directory is tracked by Git
- [ ] Directory is properly ignored/included in `.gitignore`

---

## Task 19: Create tests/ Directory

### Overview
Create the root tests directory that will contain integration tests and end-to-end (E2E) tests that span both backend and frontend.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the tests directory**
   - Create a directory named `tests/` in the root of the project
   - This is for cross-platform integration and E2E tests

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - End-to-end tests (Playwright/Cypress)
   - Integration tests spanning backend and frontend
   - API integration tests
   - Performance tests
   - Load tests

### Directory Purpose Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `e2e/` | End-to-end browser tests |
| `integration/` | API integration tests |
| `performance/` | Performance and load tests |
| `fixtures/` | Shared test fixtures |

### Testing Strategy

| Test Type | Location | Framework |
|-----------|----------|-----------|
| Unit (Python) | `backend/tests/` | pytest |
| Unit (TypeScript) | `frontend/__tests__/` | Jest/Vitest |
| Integration | `tests/integration/` | pytest + httpx |
| E2E | `tests/e2e/` | Playwright |
| Performance | `tests/performance/` | Locust/k6 |

### Expected Outcome
```
lankacommerce-cloud/
├── tests/
│   └── .gitkeep
└── ... (other directories)
```

### Verification Checklist
- [ ] `tests/` directory exists in project root
- [ ] `.gitkeep` file exists inside `tests/`
- [ ] Directory is tracked by Git

---

## Task 20: Create .env.example File

### Overview
Create an environment variable template file that documents all required configuration variables without exposing actual secrets.

### Dependencies
- Task 01: Create Root Directory (Group A)

### Instructions

1. **Create the .env.example file**
   - Create a file named `.env.example` in the root of the project
   - This serves as a template for environment configuration

2. **Organize variables by category**
   - Group related environment variables together
   - Add comments explaining each variable's purpose

3. **Include all required categories**
   - Application settings
   - Database configuration
   - Redis/cache configuration
   - Django settings
   - Next.js settings
   - Authentication/JWT settings
   - File storage settings
   - Email configuration
   - Payment gateway settings
   - Sri Lanka-specific settings

### Environment Variable Categories

#### Application Settings
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `APP_NAME` | Application display name | LankaCommerce Cloud |
| `APP_ENV` | Environment (dev/staging/prod) | development |
| `APP_DEBUG` | Debug mode flag | true |
| `APP_URL` | Base application URL | http://localhost:8000 |

#### Database Configuration
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | Full database connection URL | postgres://user:pass@localhost:5432/lcc |
| `POSTGRES_HOST` | PostgreSQL host | localhost |
| `POSTGRES_PORT` | PostgreSQL port | 5432 |
| `POSTGRES_DB` | Database name | lankacommerce_dev |
| `POSTGRES_USER` | Database user | lcc_user |
| `POSTGRES_PASSWORD` | Database password | (leave empty, set locally) |

#### Redis Configuration
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `REDIS_URL` | Full Redis connection URL | redis://localhost:6379/0 |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |

#### Django Settings
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DJANGO_SECRET_KEY` | Django secret key | (leave empty, generate locally) |
| `DJANGO_DEBUG` | Django debug mode | True |
| `DJANGO_ALLOWED_HOSTS` | Allowed hosts list | localhost,127.0.0.1 |
| `DJANGO_SETTINGS_MODULE` | Settings module path | config.settings.development |

#### Next.js Settings
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:8000/api |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL | http://localhost:3000 |
| `NEXT_PUBLIC_APP_NAME` | App name for frontend | LankaCommerce |

#### Authentication Settings
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `JWT_SECRET_KEY` | JWT signing secret | (leave empty, generate locally) |
| `JWT_ACCESS_TOKEN_LIFETIME` | Access token lifetime (minutes) | 30 |
| `JWT_REFRESH_TOKEN_LIFETIME` | Refresh token lifetime (days) | 7 |

#### File Storage (S3/MinIO)
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS/MinIO access key | (leave empty) |
| `AWS_SECRET_ACCESS_KEY` | AWS/MinIO secret key | (leave empty) |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | lcc-media-dev |
| `AWS_S3_REGION_NAME` | AWS region | ap-south-1 |
| `AWS_S3_ENDPOINT_URL` | MinIO endpoint (dev) | http://localhost:9000 |

#### Email Configuration
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `EMAIL_BACKEND` | Email backend class | django.core.mail.backends.console.EmailBackend |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_HOST_USER` | SMTP username | (leave empty) |
| `EMAIL_HOST_PASSWORD` | SMTP password | (leave empty) |
| `EMAIL_USE_TLS` | Use TLS | True |
| `DEFAULT_FROM_EMAIL` | Default sender email | noreply@lankacommerce.lk |

#### Payment Gateways
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PAYHERE_MERCHANT_ID` | PayHere merchant ID | (leave empty) |
| `PAYHERE_MERCHANT_SECRET` | PayHere secret | (leave empty) |
| `PAYHERE_SANDBOX` | Use PayHere sandbox | true |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | (leave empty) |
| `STRIPE_SECRET_KEY` | Stripe secret key | (leave empty) |

#### Sri Lanka Specific
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DEFAULT_CURRENCY` | Default currency code | LKR |
| `DEFAULT_TIMEZONE` | Default timezone | Asia/Colombo |
| `DEFAULT_LOCALE` | Default locale | en-LK |
| `SMS_GATEWAY_API_KEY` | SMS gateway key | (leave empty) |
| `WHATSAPP_BUSINESS_TOKEN` | WhatsApp API token | (leave empty) |

#### Celery Configuration
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `CELERY_BROKER_URL` | Celery broker URL | redis://localhost:6379/1 |
| `CELERY_RESULT_BACKEND` | Celery result backend | redis://localhost:6379/2 |

### File Structure Guidelines
- Use comments (`#`) to create section headers
- Provide example values where appropriate
- Leave sensitive values empty with instructions
- Include documentation links where helpful

### Expected Outcome
```
lankacommerce-cloud/
├── .env.example             # Environment template
└── ... (other directories)
```

### Verification Checklist
- [ ] `.env.example` file exists in root directory
- [ ] All variable categories are included
- [ ] Comments explain each section
- [ ] Sensitive values are empty (not committed)
- [ ] Sri Lanka-specific variables are included
- [ ] Example values are provided where safe

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 16 | Create scripts/ Directory | `scripts/` with `.gitkeep` |
| 17 | Create .github/ Directory | `.github/` with `.gitkeep` |
| 18 | Create .vscode/ Directory | `.vscode/` with `.gitkeep` |
| 19 | Create tests/ Directory | `tests/` with `.gitkeep` |
| 20 | Create .env.example File | `.env.example` template |

### Final Group B Directory Structure
```
lankacommerce-cloud/
├── .git/
├── .github/
│   └── .gitkeep
├── .vscode/
│   └── .gitkeep
├── backend/
│   └── .gitkeep
├── docker/
│   └── .gitkeep
├── docs/
│   └── .gitkeep
├── frontend/
│   └── .gitkeep
├── scripts/
│   └── .gitkeep
├── shared/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

### Group B Completion
All 10 tasks in Group B are now complete. The root directory structure is established with:
- Main directories (backend, frontend, shared, docker, docs)
- Support directories (scripts, .github, .vscode, tests)
- Environment variable template (.env.example)

### Next Steps
1. **Create Git commit** with message: `chore: create root directory structure`
2. Proceed to [../Group-C_Backend-Directory-Scaffold/](../Group-C_Backend-Directory-Scaffold/) to scaffold the backend directory

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 16-19 can be executed simultaneously
2. **Task 20 Complexity:** The .env.example file requires careful attention to all categories
3. **Sensitive Data:** Never include actual secrets in .env.example
4. **Git Commit:** After completing Group B, create commit with all new directories
5. **Sri Lanka Context:** Ensure .env.example includes LKR, Asia/Colombo, local payment gateways
6. **Directory Naming:** Use lowercase for all directories
