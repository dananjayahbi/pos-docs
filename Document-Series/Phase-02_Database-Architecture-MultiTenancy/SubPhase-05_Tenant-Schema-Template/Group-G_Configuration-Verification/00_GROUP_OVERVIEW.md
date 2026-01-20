# Group G: Configuration & Verification

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** G of G  
> **Tasks Covered:** 85-94  
> **Group Goal:** Finalize configuration, create migrations, and verify schema

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Employee-Accounting-Models/](../Group-F_Employee-Accounting-Models/)
- **→ Next Group:** None (Last Group in SubPhase)

---

## Group Overview

This group verifies all apps are registered correctly, creates model signals and managers, documents relationships, generates migrations, tests schema creation, and commits all tenant apps.

### Key Outcomes
- TENANT_APPS list verified
- Model signals created (auto-create related)
- Custom model managers created
- Model relationships documented (ERD)
- Migrations created for all tenant apps
- Migration files reviewed
- Test tenant schema created
- Table isolation verified
- Schema documentation created
- Initial commit completed

### Technology Context
- **Migrations:** makemigrations for all apps
- **Schema Test:** Create tenant and verify tables
- **Isolation:** Confirm tables only in tenant schema
- **ERD:** Full relationship documentation

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-85-88_Signals-Managers-ERD.md | 85-88 | Verify TENANT_APPS, signals, managers, ERD documentation |
| 02 | 02_Tasks-89-94_Migrations-Test-Commit.md | 89-94 | Migrations, review, test schema, verify isolation, docs, commit |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 85 | Verify TENANT_APPS List | Task 84 | Simple |
| 86 | Create Model Signals | Task 85 | Medium |
| 87 | Create Model Managers | Task 85 | Medium |
| 88 | Document Model Relationships | Task 87 | Medium |
| 89 | Create Migrations | Task 87 | Simple |
| 90 | Review Migration Files | Task 89 | Simple |
| 91 | Test Schema Creation | Task 90 | Medium |
| 92 | Verify Table Isolation | Task 91 | Medium |
| 93 | Create Schema Docs | Task 92 | Simple |
| 94 | Create Initial Commit | Task 93 | Simple |

---

## Execution Order

```
01_Tasks-85-88_Signals-Managers-ERD.md
        │
        ▼
02_Tasks-89-94_Migrations-Test-Commit.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   ├── products/
│   │   └── migrations/0001_initial.py
│   ├── inventory/
│   │   └── migrations/0001_initial.py
│   ├── customers/
│   │   └── migrations/0001_initial.py
│   ├── suppliers/
│   │   └── migrations/0001_initial.py
│   ├── orders/
│   │   └── migrations/0001_initial.py
│   ├── invoices/
│   │   └── migrations/0001_initial.py
│   ├── employees/
│   │   └── migrations/0001_initial.py
│   ├── accounting/
│   │   └── migrations/0001_initial.py
│   └── pos/
│       └── migrations/0001_initial.py

docs/
└── database/
    ├── tenant-schema-erd.md
    └── tenant-schema-docs.md
```

---

## Migration Commands

```bash
# Create migrations for all tenant apps
python manage.py makemigrations products inventory customers suppliers orders invoices employees accounting pos

# Review SQL for a specific app
python manage.py sqlmigrate products 0001

# Create test tenant (will create schema with all tables)
python manage.py shell
>>> from apps.tenants.models import Tenant, Domain
>>> tenant = Tenant.objects.create(name="Test", slug="test")
>>> Domain.objects.create(tenant=tenant, domain="test.localhost", is_primary=True)
```

---

## Schema Verification

```sql
-- Check tables in tenant schema
SET search_path TO 'tenant_test';
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'tenant_test';
```

---

## Notes for AI Agents

1. **Dependencies:** Requires all previous groups complete
2. **Order:** Create migrations BEFORE test tenant
3. **Signals:** Auto-create TenantSettings, Stock, etc.
4. **Managers:** Provide active/inactive querysets
5. **ERD:** Use dbdiagram.io or similar
6. **Git Commit:** Commit with message "feat: define tenant schema template"

