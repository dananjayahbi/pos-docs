# Tasks 35-41: Initialization Script

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** D - PostgreSQL Container Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Frontend-Dockerfile-Creation/02_Tasks-29-34_Complete-Dockerfiles.md](../Group-C_Frontend-Dockerfile-Creation/02_Tasks-29-34_Complete-Dockerfiles.md)
- **→ Next Document:** [02_Tasks-42-45_Config-Backup.md](02_Tasks-42-45_Config-Backup.md)

---

## Document Overview

This document covers creating the PostgreSQL initialization script including database creation, user setup, permissions, and required extensions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create postgres/init.sql | Medium |
| 36 | Create Main Database | Simple |
| 37 | Create Test Database | Simple |
| 38 | Create Database User | Simple |
| 39 | Grant User Permissions | Simple |
| 40 | Enable UUID Extension | Simple |
| 41 | Enable Hstore Extension | Simple |

---

## Task 35: Create postgres/init.sql

### Overview
Create the initialization SQL script that runs on first PostgreSQL container startup.

### Dependencies
- Task 04: Create docker/postgres/ Directory

### Instructions

1. **Create init.sql file**
   - In docker/postgres/

2. **Add header documentation**
   - Purpose and context

3. **Structure sections**
   - Databases, user, extensions

### File Location

```
docker/
└── postgres/
    └── init.sql
```

### Initialization Behavior

| Behavior | Description |
|----------|-------------|
| First run only | /var/lib/postgresql/data empty |
| Idempotent | IF NOT EXISTS clauses |
| Order matters | Extensions before grants |

### Script Structure

```sql
-- ==================================================
-- LankaCommerce Cloud - PostgreSQL Initialization
-- ==================================================
-- Purpose: Initialize databases, user, and extensions
-- Runs: On first container startup only
-- Databases: lankacommerce, lankacommerce_test
-- ==================================================

-- Sections will follow in subsequent tasks
```

### Docker Volume

When volume is:
| State | Action |
|-------|--------|
| Empty | Runs init.sql |
| Has data | Skips init.sql |

### Expected Outcome
- init.sql created
- Structure defined

### Verification Checklist
- [ ] File exists at docker/postgres/init.sql
- [ ] Header documentation added
- [ ] Ready for SQL statements

---

## Task 36: Create Main Database

### Overview
Create the main application database in the initialization script.

### Dependencies
- Task 35: Create postgres/init.sql

### Instructions

1. **Create database**
   - Name: lankacommerce

2. **Set encoding**
   - UTF8 for Unicode

3. **Set locale**
   - C for consistency

### SQL Addition

```sql
-- Create main database
CREATE DATABASE lankacommerce
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;
```

### Database Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| ENCODING | UTF8 | Unicode support |
| LC_COLLATE | C | Consistent sorting |
| LC_CTYPE | C | Character classification |
| TEMPLATE | template0 | Clean slate |
| CONNECTION LIMIT | -1 | Unlimited |

### Sri Lanka Support

UTF8 encoding supports:
| Script | Example |
|--------|---------|
| Sinhala | සිංහල |
| Tamil | தமிழ் |
| English | English |

### Expected Outcome
- Main database created
- Proper encoding set

### Verification Checklist
- [ ] CREATE DATABASE added
- [ ] Name is lankacommerce
- [ ] UTF8 encoding
- [ ] template0 used

---

## Task 37: Create Test Database

### Overview
Create the test database for running Django tests.

### Dependencies
- Task 35: Create postgres/init.sql

### Instructions

1. **Create test database**
   - Name: lankacommerce_test

2. **Match main settings**
   - Same encoding

3. **Document purpose**
   - For pytest/Django tests

### SQL Addition

```sql
-- Create test database
CREATE DATABASE lankacommerce_test
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE lankacommerce_test IS 'LankaCommerce test database for pytest/Django';
```

### Test Database Purpose

| Use Case | Framework |
|----------|-----------|
| Unit tests | pytest |
| Integration tests | Django TestCase |
| Tenant tests | django-tenants |

### Django Settings

Configure in settings:
| Setting | Value |
|---------|-------|
| TEST_DATABASE | lankacommerce_test |
| DJANGO_TENANTS_MIGRATE_SCHEMAS | True |

### Expected Outcome
- Test database created
- Ready for testing

### Verification Checklist
- [ ] CREATE DATABASE added
- [ ] Name is lankacommerce_test
- [ ] Same settings as main

---

## Task 38: Create Database User

### Overview
Create the application database user with a password.

### Dependencies
- Task 35: Create postgres/init.sql

### Instructions

1. **Create user**
   - Name: lcc_user

2. **Set password**
   - From environment variable

3. **Add login capability**
   - Required for connections

### SQL Addition

```sql
-- Create application user
-- Note: Password from environment variable in docker-compose
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lcc_user') THEN
        CREATE USER lcc_user WITH PASSWORD 'dev_password_change_me';
    END IF;
END
$$;
```

### User Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| LOGIN | Yes | Connect to database |
| CREATEDB | No | Security |
| SUPERUSER | No | Security |

### Environment Override

In docker-compose, password comes from:
| Source | Variable |
|--------|----------|
| .env file | POSTGRES_PASSWORD |
| Compose | environment section |

### Security Note

| Environment | Password |
|-------------|----------|
| Development | Simple for convenience |
| Production | Strong, from secrets |

### Expected Outcome
- User lcc_user created
- Password set

### Verification Checklist
- [ ] CREATE USER added
- [ ] Name is lcc_user
- [ ] IF NOT EXISTS check
- [ ] Password placeholder

---

## Task 39: Grant User Permissions

### Overview
Grant the application user full permissions on application databases.

### Dependencies
- Task 38: Create Database User

### Instructions

1. **Grant on main database**
   - All privileges

2. **Grant on test database**
   - All privileges

3. **Grant on public schema**
   - Create, usage

### SQL Addition

```sql
-- Grant permissions on main database
GRANT ALL PRIVILEGES ON DATABASE lankacommerce TO lcc_user;

-- Grant permissions on test database
GRANT ALL PRIVILEGES ON DATABASE lankacommerce_test TO lcc_user;

-- Connect to main database for schema grants
\connect lankacommerce

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lcc_user;

-- Connect to test database for schema grants
\connect lankacommerce_test

-- Grant schema permissions on test database
GRANT ALL ON SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lcc_user;
```

### Permission Levels

| Level | Scope |
|-------|-------|
| DATABASE | Connect, create schemas |
| SCHEMA | Create tables |
| TABLES | CRUD operations |
| SEQUENCES | Auto-increment |

### Multi-Tenancy

For django-tenants:
| Permission | Purpose |
|------------|---------|
| CREATE SCHEMA | New tenants |
| USAGE ON SCHEMA | Access tenant data |

### Expected Outcome
- Full database access
- Schema creation allowed

### Verification Checklist
- [ ] GRANT ALL on databases
- [ ] GRANT on public schema
- [ ] DEFAULT PRIVILEGES set
- [ ] Both databases covered

---

## Task 40: Enable UUID Extension

### Overview
Enable the uuid-ossp extension for UUID generation.

### Dependencies
- Task 36: Create Main Database

### Instructions

1. **Enable on main database**
   - uuid_generate_v4()

2. **Enable on test database**
   - Same extension

3. **Enable on template1**
   - Inherited by new schemas

### SQL Addition

```sql
-- Enable UUID extension on main database
\connect lankacommerce
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable UUID extension on test database
\connect lankacommerce_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### UUID Functions

| Function | Output |
|----------|--------|
| uuid_generate_v1() | MAC + timestamp |
| uuid_generate_v4() | Random |

### Usage in Django

```python
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
```

With PostgreSQL:
```python
# Database generates UUID
id = models.UUIDField(primary_key=True, db_default=RawSQL("uuid_generate_v4()"))
```

### Expected Outcome
- UUID extension enabled
- uuid_generate_v4() available

### Verification Checklist
- [ ] Extension created on main
- [ ] Extension created on test
- [ ] IF NOT EXISTS clause

---

## Task 41: Enable Hstore Extension

### Overview
Enable the hstore extension for key-value storage, required by django-tenants.

### Dependencies
- Task 36: Create Main Database

### Instructions

1. **Enable on main database**
   - Required for django-tenants

2. **Enable on test database**
   - Same extension

3. **Document requirement**
   - django-tenants needs it

### SQL Addition

```sql
-- Enable hstore extension on main database (required by django-tenants)
\connect lankacommerce
CREATE EXTENSION IF NOT EXISTS "hstore";

-- Enable hstore extension on test database
\connect lankacommerce_test
CREATE EXTENSION IF NOT EXISTS "hstore";
```

### Why Hstore

django-tenants uses hstore for:
| Use Case | Example |
|----------|---------|
| Tenant metadata | Key-value pairs |
| Schema mapping | Domain → schema |

### Django Settings

```python
INSTALLED_APPS = [
    'django.contrib.postgres',  # Enables hstore field
    # ...
]
```

### Expected Outcome
- Hstore extension enabled
- django-tenants compatible

### Verification Checklist
- [ ] Extension created on main
- [ ] Extension created on test
- [ ] IF NOT EXISTS clause

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create postgres/init.sql | Initialization script |
| 36 | Create Main Database | lankacommerce |
| 37 | Create Test Database | lankacommerce_test |
| 38 | Create Database User | lcc_user |
| 39 | Grant User Permissions | Full access |
| 40 | Enable UUID Extension | uuid-ossp |
| 41 | Enable Hstore Extension | hstore |

### Complete init.sql

```sql
-- ==================================================
-- LankaCommerce Cloud - PostgreSQL Initialization
-- ==================================================
-- Purpose: Initialize databases, user, and extensions
-- Runs: On first container startup only
-- Databases: lankacommerce, lankacommerce_test
-- ==================================================

-- Create main database
CREATE DATABASE lankacommerce
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Create test database
CREATE DATABASE lankacommerce_test
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Create application user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lcc_user') THEN
        CREATE USER lcc_user WITH PASSWORD 'dev_password_change_me';
    END IF;
END
$$;

-- Grant database permissions
GRANT ALL PRIVILEGES ON DATABASE lankacommerce TO lcc_user;
GRANT ALL PRIVILEGES ON DATABASE lankacommerce_test TO lcc_user;

-- Main database setup
\connect lankacommerce

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "hstore";

GRANT ALL ON SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lcc_user;

-- Test database setup
\connect lankacommerce_test

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "hstore";

GRANT ALL ON SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lcc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lcc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lcc_user;
```

### Next Steps
Proceed to [02_Tasks-42-45_Config-Backup.md](02_Tasks-42-45_Config-Backup.md) for PostgreSQL configuration and backup script.

---

## Notes for AI Agents

1. **Init execution:** Only on first startup
2. **Extensions:** Must use \connect before CREATE EXTENSION
3. **Password:** Placeholder, override in compose
4. **Order:** Extensions before grants
5. **Multi-tenancy:** django-tenants creates tenant schemas
6. **Git:** Do NOT commit yet - complete Group D first
