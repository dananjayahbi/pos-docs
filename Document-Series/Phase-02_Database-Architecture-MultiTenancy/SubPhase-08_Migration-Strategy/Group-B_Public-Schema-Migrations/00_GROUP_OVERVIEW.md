# Group B: Public Schema Migrations

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Implement public schema migration strategy and initial data seeding

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Migration-Foundation/](../Group-A_Migration-Foundation/)
- **→ Next Group:** [../Group-C_Tenant-Schema-Migrations/](../Group-C_Tenant-Schema-Migrations/)

---

## Group Overview

This group implements the public schema migration strategy. Public schema contains shared apps like tenant registry, subscription plans, and platform settings. It must be migrated before any tenant schemas.

### Key Outcomes
- Create public migration command
- Define public schema apps list
- Run initial public migration
- Verify public tables created
- Create automated migration script
- Handle Tenant model updates
- Handle Domain model updates
- Handle SubscriptionPlan updates
- Create data migration template
- Seed initial data with fixtures
- Create public tenant record
- Verify public migration success
- Create pre-migration backup
- Document public migrations

### Technology Context
- **Public Schema:** Shared across all tenants
- **Tenant Registry:** Tenant, Domain models
- **Fixtures:** Initial data seeding
- **Backup:** Pre-migration safety

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Command-Apps-Initial.md | 15-20 | Public command, apps list, initial migration, verify, script, tenant updates |
| 02 | 02_Tasks-21-25_Models-Data-Seed.md | 21-25 | Domain updates, Plan updates, data migration, seed, public tenant |
| 03 | 03_Tasks-26-28_Verify-Backup-Docs.md | 26-28 | Verify migration, backup, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create Public Migration Command | Task 14 | Simple |
| 16 | Define Public Schema Apps | Task 15 | Simple |
| 17 | Run Initial Public Migration | Task 16 | Simple |
| 18 | Verify Public Tables Created | Task 17 | Simple |
| 19 | Create Public Migration Script | Task 18 | Medium |
| 20 | Handle Tenant Table Updates | Task 19 | Medium |
| 21 | Handle Domain Table Updates | Task 19 | Medium |
| 22 | Handle Plan Table Updates | Task 19 | Medium |
| 23 | Create Data Migration Template | Task 22 | Medium |
| 24 | Seed Initial Data | Task 23 | Medium |
| 25 | Create Public Tenant | Task 24 | Simple |
| 26 | Verify Public Migration | Task 25 | Simple |
| 27 | Create Migration Backup | Task 26 | Medium |
| 28 | Document Public Migrations | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_Command-Apps-Initial.md
        │
        ▼
02_Tasks-21-25_Models-Data-Seed.md
        │
        ▼
03_Tasks-26-28_Verify-Backup-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   ├── core/
│   │   └── management/
│   │       └── commands/
│   │           └── migrate_public.py
│   ├── platform/
│   │   ├── migrations/
│   │   └── fixtures/
│   │       └── initial_data.json
│   └── tenants/
│       ├── migrations/
│       └── fixtures/
│           └── subscription_plans.json

scripts/
├── migrate_public.sh
└── backup_before_migrate.sh

docs/
└── migrations/
    └── public-schema.md
```

---

## Public Schema Apps

```python
SHARED_APPS = [
    'django_tenants',
    'django.contrib.contenttypes',
    'apps.platform',       # Platform settings
    'apps.tenants',        # Tenant registry
    'apps.users.platform', # Platform users (admins)
]
```

---

## Initial Data Fixtures

```json
// subscription_plans.json
[
    {
        "model": "tenants.subscriptionplan",
        "pk": 1,
        "fields": {
            "name": "Free Trial",
            "slug": "free-trial",
            "price": "0.00",
            "trial_days": 14
        }
    }
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (foundation ready)
2. **Order:** Public schema migrated FIRST before tenants
3. **Fixtures:** Seed subscription plans, platform settings
4. **Public Tenant:** Create special public tenant for admin
5. **Backup:** Always backup before production migrations
6. **Git Commit:** Commit after completing this group

