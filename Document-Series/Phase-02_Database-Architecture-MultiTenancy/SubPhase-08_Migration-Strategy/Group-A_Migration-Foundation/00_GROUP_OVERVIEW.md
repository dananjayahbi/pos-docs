# Group A: Migration Foundation

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Establish migration foundation with commands, settings, and helper utilities

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Public-Schema-Migrations/](../Group-B_Public-Schema-Migrations/)

---

## Group Overview

This group establishes the migration foundation by reviewing django-tenants migration commands, creating the migration directory structure, configuring settings, and building helper utilities.

### Key Outcomes
- Review django-tenants migrate_schemas command
- Document all migration commands
- Create migration directory structure
- Configure migration settings
- Define SHARED_APPS migration scope
- Define TENANT_APPS migration scope
- Create migration helper module
- Define naming convention (NNNN_descriptive_name.py)
- Create migration template
- Define cross-app dependencies
- Create migration check script
- Add Makefile commands
- Configure CI migration checks
- Document migration workflow

### Technology Context
- **django-tenants:** migrate_schemas command
- **SHARED_APPS:** Public schema apps
- **TENANT_APPS:** Tenant schema apps
- **Makefile:** Automation commands

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Review-Commands-Settings.md | 01-05 | Review migrate_schemas, docs, directory, settings, shared apps |
| 02 | 02_Tasks-06-10_Helpers-Naming-Template.md | 06-10 | Tenant apps, helper module, naming convention, template, dependencies |
| 03 | 03_Tasks-11-14_Check-Makefile-CI-Docs.md | 11-14 | Check script, Makefile, CI pipeline, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Review django-tenants Migrations | SubPhase-07 | Simple |
| 02 | Document Migration Commands | Task 01 | Simple |
| 03 | Create Migration Directory | Task 01 | Simple |
| 04 | Configure Migration Settings | Task 03 | Simple |
| 05 | Define Shared Apps Migrations | Task 04 | Simple |
| 06 | Define Tenant Apps Migrations | Task 04 | Simple |
| 07 | Create Migration Helper Module | Task 06 | Medium |
| 08 | Define Migration Naming Convention | Task 07 | Simple |
| 09 | Create Migration Template | Task 08 | Simple |
| 10 | Define Migration Dependencies | Task 09 | Medium |
| 11 | Create Migration Check Script | Task 10 | Medium |
| 12 | Add to Makefile | Task 11 | Simple |
| 13 | Configure CI Migration Checks | Task 12 | Medium |
| 14 | Document Migration Flow | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Review-Commands-Settings.md
        │
        ▼
02_Tasks-06-10_Helpers-Naming-Template.md
        │
        ▼
03_Tasks-11-14_Check-Makefile-CI-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── core/
│       ├── migrations_utils.py
│       └── management/
│           └── commands/
│               └── check_migrations.py
├── scripts/
│   └── check_pending_migrations.sh
└── Makefile                    # Updated with migrate commands

docs/
└── migrations/
    ├── overview.md
    └── naming-conventions.md
```

---

## Migration Commands Reference

```bash
# django-tenants commands
python manage.py migrate_schemas           # Migrate all schemas
python manage.py migrate_schemas --shared  # Public schema only
python manage.py migrate_schemas --tenant  # Tenant schemas only
python manage.py migrate_schemas -s tenant_name  # Specific tenant

# Makefile shortcuts
make migrate-public     # Public schema
make migrate-tenants    # All tenants
make migrate-all        # Public + tenants
make check-migrations   # Check pending
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-07 complete (router configured)
2. **Order:** Always migrate public before tenants
3. **Naming:** Use NNNN_descriptive_name.py format
4. **Helper:** Create reusable migration utilities
5. **CI:** Block deployments with pending migrations
6. **Git Commit:** Commit after completing this group

