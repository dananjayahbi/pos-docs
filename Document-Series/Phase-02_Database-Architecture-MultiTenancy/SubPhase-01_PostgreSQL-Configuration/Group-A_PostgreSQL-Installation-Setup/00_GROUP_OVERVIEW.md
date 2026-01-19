# Group A: PostgreSQL Installation & Setup

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 01 - PostgreSQL Configuration  
> **Group:** A of F  
> **Tasks Covered:** 01-12  
> **Group Goal:** Install and configure PostgreSQL 15+ with required extensions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Database-Configuration/](../Group-B_Database-Configuration/)

---

## Group Overview

This group installs and sets up PostgreSQL 15+ for the multi-tenant SaaS platform. The setup includes Docker configuration, database creation, essential extensions, and encoding configuration.

### Key Outcomes
- PostgreSQL 15+ verified and configured in Docker
- Dedicated database user created
- Main and test databases created
- uuid-ossp extension enabled (UUID primary keys)
- hstore extension enabled (key-value storage)
- pg_stat_statements extension enabled (query monitoring)
- btree_gin extension enabled (composite indexes)
- UTF-8 encoding configured
- en_US.UTF-8 locale configured
- PostgreSQL startup verified

### Technology Context
- **Database:** PostgreSQL 15+
- **Container:** Docker with official postgres image
- **Extensions:** uuid-ossp, hstore, pg_stat_statements, btree_gin
- **Encoding:** UTF-8 / en_US.UTF-8

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_PostgreSQL-Docker-Setup.md | 01-04 | Verify PostgreSQL version, update Docker Compose, create user, create main database |
| 02 | 02_Tasks-05-08_Test-DB-Extensions.md | 05-08 | Create test database, enable uuid-ossp, hstore, pg_stat_statements |
| 03 | 03_Tasks-09-12_Encoding-Locale-Verify.md | 09-12 | Enable btree_gin, configure encoding, locale, verify startup |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Verify PostgreSQL Version | Phase-01 | Simple |
| 02 | Update Docker Compose | Task 01 | Medium |
| 03 | Configure PostgreSQL User | Task 02 | Simple |
| 04 | Create Main Database | Task 03 | Simple |
| 05 | Create Test Database | Task 03 | Simple |
| 06 | Enable uuid-ossp Extension | Task 04 | Simple |
| 07 | Enable hstore Extension | Task 04 | Simple |
| 08 | Enable pg_stat_statements | Task 04 | Simple |
| 09 | Enable btree_gin Extension | Task 04 | Simple |
| 10 | Configure Database Encoding | Task 04 | Simple |
| 11 | Configure Locale Settings | Task 04 | Simple |
| 12 | Verify PostgreSQL Startup | Task 11 | Simple |

---

## Execution Order

```
01_Tasks-01-04_PostgreSQL-Docker-Setup.md
        │
        ▼
02_Tasks-05-08_Test-DB-Extensions.md
        │
        ▼
03_Tasks-09-12_Encoding-Locale-Verify.md
```

---

## Expected Deliverables

After completing this group:

```
docker/
└── postgres/
    └── init/
        └── 01-init.sql      # Database initialization script

docker-compose.yml           # Updated with PostgreSQL 15+
```

---

## PostgreSQL Extensions

| Extension | Purpose |
|-----------|---------|
| uuid-ossp | Generate UUID primary keys |
| hstore | Key-value pair storage |
| pg_stat_statements | Query performance monitoring |
| btree_gin | Composite GIN indexes |

---

## Notes for AI Agents

1. **Dependencies:** Requires Phase-01 SubPhase-04 complete (Docker configured)
2. **PostgreSQL Version:** Must be 15+ for best schema features
3. **Extensions:** Create in template1 for automatic inclusion
4. **Encoding:** UTF-8 required for Sri Lankan language support
5. **Test Database:** Separate database for running tests
6. **Git Commit:** Commit after completing this group

