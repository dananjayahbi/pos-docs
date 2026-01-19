# Group D: PostgreSQL Container Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** D of H  
> **Tasks Covered:** 35-45  
> **Group Goal:** Configure PostgreSQL container with initialization scripts

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Frontend-Dockerfile-Creation/](../Group-C_Frontend-Dockerfile-Creation/)
- **→ Next Group:** [../Group-E_Redis-Container-Setup/](../Group-E_Redis-Container-Setup/)

---

## Group Overview

This group configures the PostgreSQL database container with initialization scripts, custom configuration, and required extensions for django-tenants multi-tenancy support.

### Key Outcomes
- Database initialization script with main and test databases
- PostgreSQL user with proper permissions
- Required extensions enabled (uuid-ossp, hstore)
- Optimized PostgreSQL configuration
- Backup script for development

### Technology Context
- **PostgreSQL Version:** 15+
- **Extensions:** uuid-ossp, hstore (required for django-tenants)
- **Multi-tenancy:** Schema-based via django-tenants
- **Persistence:** Docker volume for data

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-35-41_Init-Script.md | 35-41 | Create init.sql, databases, user, permissions, extensions |
| 02 | 02_Tasks-42-45_Config-Backup.md | 42-45 | PostgreSQL config, connections, memory, backup script |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 35 | Create postgres/init.sql | Task 04 | Medium |
| 36 | Create Main Database | Task 35 | Simple |
| 37 | Create Test Database | Task 35 | Simple |
| 38 | Create Database User | Task 35 | Simple |
| 39 | Grant User Permissions | Task 38 | Simple |
| 40 | Enable UUID Extension | Task 36 | Simple |
| 41 | Enable Hstore Extension | Task 36 | Simple |
| 42 | Create postgres/postgresql.conf | Task 04 | Medium |
| 43 | Configure Max Connections | Task 42 | Simple |
| 44 | Configure Shared Buffers | Task 42 | Simple |
| 45 | Create Backup Script | Task 04 | Medium |

---

## Execution Order

```
01_Tasks-35-41_Init-Script.md
        │
        ▼
02_Tasks-42-45_Config-Backup.md
```

---

## Expected Deliverables

```
docker/postgres/
├── init.sql                 # Database initialization
├── postgresql.conf          # PostgreSQL configuration
└── backup.sh                # Backup script
```

---

## Database Setup Overview

**Databases:**
- `lankacommerce` - Main application database
- `lankacommerce_test` - Test database

**User:**
- `lcc_user` with full permissions on both databases

**Extensions:**
- `uuid-ossp` - UUID generation
- `hstore` - Key-value storage (django-tenants)

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (docker/postgres/ exists)
2. **Init Script:** Runs on first container startup only
3. **Extensions:** Must be enabled on template1 for tenant schemas
4. **Backup:** Development convenience, not for production
5. **Git Commit:** Commit after completing this group
