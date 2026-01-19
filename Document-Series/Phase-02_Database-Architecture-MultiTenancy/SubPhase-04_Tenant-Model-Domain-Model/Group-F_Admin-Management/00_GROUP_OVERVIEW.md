# Group F: Admin & Management

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** F of F  
> **Tasks Covered:** 73-88  
> **Group Goal:** Create admin interfaces and finalize migrations

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Tenant-Subscription-Tracking/](../Group-E_Tenant-Subscription-Tracking/)
- **→ Next Group:** None (Last Group in SubPhase)

---

## Group Overview

This group creates comprehensive Django admin interfaces for managing tenants and domains. It includes inline editing, bulk actions, export functionality, and concludes with migrations and test data.

### Key Outcomes
- TenantAdmin with full configuration
- List display with key fields
- List filters for status, plan, etc.
- Search fields for name, slug, email
- Organized fieldsets
- Inline domains editing
- Inline settings editing
- DomainAdmin with verification actions
- Domain verification bulk action
- Tenant actions (suspend, activate, delete)
- CSV export action
- Migrations created and run
- Migration SQL reviewed
- Test tenants created
- Initial commit completed

### Technology Context
- **Admin:** Django admin customization
- **Inlines:** TabularInline for related models
- **Actions:** Bulk admin actions
- **Export:** CSV export functionality

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-73-79_Tenant-Admin.md | 73-79 | TenantAdmin, list display, filters, search, fieldsets, inlines |
| 02 | 02_Tasks-80-83_Domain-Admin-Actions.md | 80-83 | DomainAdmin, verification action, tenant actions, export |
| 03 | 03_Tasks-84-88_Migrations-Commit.md | 84-88 | Create migrations, review SQL, run migrations, test data, commit |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 73 | Create TenantAdmin | Task 30 | Medium |
| 74 | Add List Display | Task 73 | Simple |
| 75 | Add List Filters | Task 73 | Simple |
| 76 | Add Search Fields | Task 73 | Simple |
| 77 | Add Fieldsets | Task 73 | Medium |
| 78 | Add Inline Domains | Task 73, 46 | Medium |
| 79 | Add Inline Settings | Task 73, 58 | Medium |
| 80 | Create DomainAdmin | Task 46 | Medium |
| 81 | Add Domain Verification Action | Task 80 | Medium |
| 82 | Create Tenant Actions | Task 73 | Medium |
| 83 | Create Export Action | Task 73 | Medium |
| 84 | Create Migrations | Task 72 | Simple |
| 85 | Review Migration SQL | Task 84 | Simple |
| 86 | Run Shared Migrations | Task 85 | Simple |
| 87 | Create Test Tenants | Task 86 | Medium |
| 88 | Create Initial Commit | Task 87 | Simple |

---

## Execution Order

```
01_Tasks-73-79_Tenant-Admin.md
        │
        ▼
02_Tasks-80-83_Domain-Admin-Actions.md
        │
        ▼
03_Tasks-84-88_Migrations-Commit.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── admin.py              # Full admin configuration
        ├── actions.py            # Admin bulk actions
        └── migrations/
            ├── __init__.py
            └── 0001_initial.py
```

---

## Admin List Display Fields

| Field | Description |
|-------|-------------|
| name | Business name |
| slug | URL identifier |
| is_active | Active status badge |
| is_suspended | Suspension status |
| plan | Current subscription plan |
| created_at | Registration date |

---

## Admin Bulk Actions

| Action | Description |
|--------|-------------|
| suspend_tenants | Suspend selected tenants |
| activate_tenants | Activate selected tenants |
| verify_domains | Verify selected domains |
| export_to_csv | Export tenants to CSV |

---

## Migration Commands

```bash
# Create migrations
python manage.py makemigrations tenants

# Review SQL
python manage.py sqlmigrate tenants 0001

# Run shared migrations
python manage.py migrate_schemas --shared

# Create test tenant
python manage.py shell
>>> from apps.tenants.models import Tenant, Domain
>>> tenant = Tenant.objects.create(name="Demo Store", slug="demo")
>>> Domain.objects.create(tenant=tenant, domain="demo.localhost", is_primary=True)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete (all models exist)
2. **Inlines:** Use TabularInline for domains/settings
3. **Actions:** Provide confirmation dialogs
4. **Export:** Include all tenant fields in CSV
5. **Test Data:** Create at least 2 test tenants
6. **Git Commit:** Commit with message "feat: implement tenant and domain models"

