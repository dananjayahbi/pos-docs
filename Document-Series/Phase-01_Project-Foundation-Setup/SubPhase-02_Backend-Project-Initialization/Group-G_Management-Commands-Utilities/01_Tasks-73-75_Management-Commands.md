# Tasks 73-75: Management Commands

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** G - Management Commands & Utilities  
> **Document:** 01 of 02  
> **Tasks Covered:** 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-F_ASGI-Server-Configuration/02_Tasks-70-72_Channel-Deploy.md](../Group-F_ASGI-Server-Configuration/02_Tasks-70-72_Channel-Deploy.md)
- **→ Next Document:** [02_Tasks-76-78_Health-Test-Verify.md](02_Tasks-76-78_Health-Test-Verify.md)

---

## Document Overview

This document covers creating essential Django management commands for database waiting, superuser creation, and data seeding.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 73 | Create wait_for_db Command | Medium |
| 74 | Create create_superuser Command | Medium |
| 75 | Create seed_data Command | Medium |

---

## Task 73: Create wait_for_db Command

### Overview
Create a management command that waits for the database to be available before proceeding.

### Dependencies
- Task 52: Create apps/core/ App (Group E)

### Instructions

1. **Create command file**
   - Create apps/core/management/commands/wait_for_db.py

2. **Implement Command class**
   - Extend BaseCommand
   - Add help text

3. **Implement handle method**
   - Check database connection
   - Retry with exponential backoff
   - Output success message

4. **Add configurable options**
   - max_retries (default: 30)
   - delay (default: 1 second)

### File Location

```
apps/core/management/commands/
├── __init__.py
└── wait_for_db.py
```

### Command Structure

| Component | Purpose |
|-----------|---------|
| `help` | Command description |
| `add_arguments()` | CLI options |
| `handle()` | Main logic |

### Command Arguments

| Argument | Type | Default | Purpose |
|----------|------|---------|---------|
| `--max-retries` | int | 30 | Maximum retry attempts |
| `--delay` | float | 1.0 | Seconds between retries |

### Logic Flow

1. Attempt database connection
2. If fails, wait `delay` seconds
3. Retry up to `max_retries` times
4. Exit 0 on success, 1 on failure

### Database Check Method

Use Django's database connection:
- `connections['default'].ensure_connection()`
- Catches `OperationalError`

### Output Messages

| Scenario | Message |
|----------|---------|
| Waiting | "Waiting for database..." |
| Retry | "Database unavailable, retrying in X seconds..." |
| Success | "Database available!" |
| Failure | "Database not available after X attempts" |

### Docker Usage

In docker-compose entrypoint:
```
python manage.py wait_for_db
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Expected Outcome
- wait_for_db command available
- Works in Docker startup scripts

### Verification Checklist
- [ ] wait_for_db.py created
- [ ] BaseCommand extended
- [ ] Retry logic implemented
- [ ] Configurable options added

---

## Task 74: Create create_superuser Command

### Overview
Create a management command for non-interactive superuser creation using environment variables.

### Dependencies
- Task 54: Create apps/users/ App (Group E)

### Instructions

1. **Create command file**
   - Create apps/core/management/commands/create_superuser.py

2. **Implement Command class**
   - Extend BaseCommand
   - Add help text

3. **Read environment variables**
   - DJANGO_SUPERUSER_EMAIL
   - DJANGO_SUPERUSER_PASSWORD
   - DJANGO_SUPERUSER_PHONE (optional)

4. **Make idempotent**
   - Check if user exists
   - Skip if already created

5. **Handle multi-tenancy**
   - Create in public schema
   - Use schema_context if needed

### File Location

```
apps/core/management/commands/
├── __init__.py
├── wait_for_db.py
└── create_superuser.py
```

### Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `DJANGO_SUPERUSER_EMAIL` | Yes | None |
| `DJANGO_SUPERUSER_PASSWORD` | Yes | None |
| `DJANGO_SUPERUSER_FIRST_NAME` | No | 'Admin' |
| `DJANGO_SUPERUSER_LAST_NAME` | No | 'User' |

### Command Arguments

| Argument | Purpose |
|----------|---------|
| `--email` | Override env email |
| `--password` | Override env password |
| `--no-input` | Skip prompts (default) |

### Logic Flow

1. Get credentials from env/args
2. Validate required fields
3. Check if user exists
4. Create superuser if not exists
5. Output result

### Output Messages

| Scenario | Message |
|----------|---------|
| Created | "Superuser created successfully" |
| Exists | "Superuser already exists, skipping" |
| Missing | "Email and password required" |

### Multi-Tenancy Consideration

For public schema operations:
```python
with schema_context('public'):
    User.objects.create_superuser(...)
```

### Expected Outcome
- Non-interactive superuser creation
- Idempotent execution

### Verification Checklist
- [ ] create_superuser.py created
- [ ] Environment variables read
- [ ] Idempotent (skips if exists)
- [ ] Works with multi-tenancy

---

## Task 75: Create seed_data Command

### Overview
Create a management command to populate the database with sample data for development and demos.

### Dependencies
- Task 52: Create apps/core/ App (Group E)

### Instructions

1. **Create command file**
   - Create apps/core/management/commands/seed_data.py

2. **Implement Command class**
   - Extend BaseCommand
   - Add help text

3. **Add command arguments**
   - --tenant (target tenant)
   - --clear (clear existing data)
   - --minimal (minimal seed set)

4. **Implement seed functions**
   - Placeholder structure for now
   - Actual seeding in later phases

5. **Add safety checks**
   - Prevent in production
   - Require --force in production

### File Location

```
apps/core/management/commands/
├── __init__.py
├── wait_for_db.py
├── create_superuser.py
└── seed_data.py
```

### Command Arguments

| Argument | Type | Purpose |
|----------|------|---------|
| `--tenant` | str | Target tenant schema |
| `--clear` | flag | Clear existing data first |
| `--minimal` | flag | Create minimal data set |
| `--force` | flag | Allow in production |

### Seed Data Categories

| Category | Examples |
|----------|----------|
| Users | Demo users, staff |
| Products | Sample products |
| Customers | Demo customers |
| Transactions | Sample orders |

### Logic Flow

1. Check environment (dev/prod)
2. Validate tenant if specified
3. Clear data if --clear
4. Call seed functions
5. Output summary

### Safety Checks

| Check | Action |
|-------|--------|
| Production | Require --force |
| Missing tenant | Error if multi-tenant |
| Clear data | Confirm or require --force |

### Output Messages

| Phase | Message |
|-------|---------|
| Start | "Seeding database for tenant: X" |
| Clear | "Cleared existing data" |
| Users | "Created X users" |
| Products | "Created X products" |
| Complete | "Seed data complete!" |

### Placeholder Structure

For now, create command skeleton:
- Import structure ready
- Seed functions as stubs
- Actual implementation in Phase 4-6

### Expected Outcome
- seed_data command structure ready
- Placeholder for future implementation

### Verification Checklist
- [ ] seed_data.py created
- [ ] Command arguments defined
- [ ] Safety checks implemented
- [ ] Placeholder functions ready

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 73 | Create wait_for_db Command | Database availability check |
| 74 | Create create_superuser Command | Non-interactive admin creation |
| 75 | Create seed_data Command | Development data seeding |

### Commands Directory Structure

```
apps/core/management/
├── __init__.py
└── commands/
    ├── __init__.py
    ├── wait_for_db.py
    ├── create_superuser.py
    └── seed_data.py
```

### Command Usage Summary

| Command | Usage |
|---------|-------|
| wait_for_db | `python manage.py wait_for_db` |
| create_superuser | `python manage.py create_superuser` |
| seed_data | `python manage.py seed_data --tenant=demo` |

### Docker Entrypoint Example

```bash
#!/bin/bash
python manage.py wait_for_db
python manage.py migrate --noinput
python manage.py create_superuser
python manage.py collectstatic --noinput
exec "$@"
```

### Next Steps
Proceed to [02_Tasks-76-78_Health-Test-Verify.md](02_Tasks-76-78_Health-Test-Verify.md) for health check, pytest config, and verification.

---

## Notes for AI Agents

1. **BaseCommand:** All commands extend Django's BaseCommand
2. **Idempotent:** Commands should be safe to run multiple times
3. **Environment:** Use environment variables for sensitive data
4. **Placeholder:** seed_data is a skeleton for now
5. **Git:** Do NOT commit yet - complete all Group G tasks first
