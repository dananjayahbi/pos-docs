# Group B: Schema Creation & Migrations

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Create PostgreSQL schema and run tenant migrations

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Provisioning-Service/](../Group-A_Provisioning-Service/)
- **→ Next Group:** [../Group-C_Default-Data-Seeding/](../Group-C_Default-Data-Seeding/)

---

## Group Overview

This group handles the creation of PostgreSQL schemas for new tenants and running all tenant migrations. It includes schema name generation, validation, creation, permissions, and failure handling.

### Key Outcomes
- Create schema name generator
- Validate schema name characters
- Check if schema already exists
- Create PostgreSQL schema
- Set schema permissions
- Run tenant migrations
- Verify migrations applied
- Handle migration failure
- Drop schema on failure
- Create schema timeout
- Log schema creation
- Track creation duration
- Handle concurrent creation
- Document schema creation

### Technology Context
- **PostgreSQL:** CREATE SCHEMA
- **django-tenants:** migrate_schemas
- **Concurrency:** Advisory locks
- **Cleanup:** DROP SCHEMA CASCADE

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Name-Create-Migrate.md | 15-20 | Schema name, validation, check exists, create, permissions, migrate |
| 02 | 02_Tasks-21-25_Verify-Failure-Cleanup.md | 21-25 | Verify migrations, failure handling, drop schema, timeout, audit log |
| 03 | 03_Tasks-26-28_Duration-Concurrent-Docs.md | 26-28 | Track duration, concurrent handling, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create Schema Name Generator | Task 14 | Medium |
| 16 | Validate Schema Name | Task 15 | Simple |
| 17 | Check Schema Exists | Task 16 | Simple |
| 18 | Create PostgreSQL Schema | Task 17 | Medium |
| 19 | Set Schema Permissions | Task 18 | Simple |
| 20 | Run Tenant Migrations | Task 19 | Medium |
| 21 | Verify Migrations Applied | Task 20 | Simple |
| 22 | Handle Migration Failure | Task 21 | Medium |
| 23 | Drop Schema on Failure | Task 22 | Simple |
| 24 | Create Schema Timeout | Task 20 | Simple |
| 25 | Log Schema Creation | Task 24 | Simple |
| 26 | Track Creation Duration | Task 25 | Simple |
| 27 | Handle Concurrent Creation | Task 26 | Medium |
| 28 | Document Schema Creation | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_Name-Create-Migrate.md
        │
        ▼
02_Tasks-21-25_Verify-Failure-Cleanup.md
        │
        ▼
03_Tasks-26-28_Duration-Concurrent-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── services/
            ├── provisioning.py    # Updated
            └── schema_creation.py

docs/
└── provisioning/
    └── schema-creation.md
```

---

## Schema Name Generation

```python
def generate_schema_name(tenant_name: str) -> str:
    """
    Generate a valid PostgreSQL schema name.
    
    Format: tenant_{sanitized_name}_{short_uuid}
    Example: tenant_acme_retail_a1b2c3
    """
    sanitized = re.sub(r'[^a-z0-9_]', '', tenant_name.lower())[:20]
    short_uuid = uuid.uuid4().hex[:6]
    return f"tenant_{sanitized}_{short_uuid}"
```

---

## Schema Creation SQL

```sql
-- Create schema
CREATE SCHEMA IF NOT EXISTS tenant_acme_retail_a1b2c3;

-- Set permissions
GRANT ALL ON SCHEMA tenant_acme_retail_a1b2c3 TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA tenant_acme_retail_a1b2c3 
    GRANT ALL ON TABLES TO app_user;

-- On failure, cleanup
DROP SCHEMA IF EXISTS tenant_acme_retail_a1b2c3 CASCADE;
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (service exists)
2. **Naming:** Use tenant_{name}_{uuid} format
3. **Validation:** Only lowercase, numbers, underscore
4. **Advisory Lock:** Prevent concurrent schema creation
5. **Cleanup:** DROP CASCADE on failure
6. **Git Commit:** Commit after completing this group

