# Group G: Migration & Verification

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** G of G  
> **Tasks Covered:** 85-92  
> **Group Goal:** Create migrations, verify public schema, and commit

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Platform-Audit-Billing/](../Group-F_Platform-Audit-Billing/)
- **→ Next Group:** None (Last Group in SubPhase)

---

## Group Overview

This group creates migrations for all public schema models, runs shared migrations, verifies the schema structure, loads fixtures, and creates the final commit for the public schema design.

### Key Outcomes
- Initial migrations created for platform app
- Migration files reviewed for correctness
- Shared migrations run (migrate_schemas --shared)
- Public schema tables verified
- Default fixtures loaded (plans, flags)
- Admin interface tested
- All model relationships verified
- Final commit created

### Technology Context
- **Migrations:** Django migration system
- **Command:** migrate_schemas --shared
- **Fixtures:** JSON fixtures for initial data
- **Verification:** Table structure checks

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-85-88_Migrations-Run.md | 85-88 | Create migrations, review files, run shared migrations, verify tables |
| 02 | 02_Tasks-89-92_Fixtures-Verification-Commit.md | 89-92 | Load fixtures, test admin, verify relationships, final commit |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 85 | Create Initial Migrations | Task 84 | Simple |
| 86 | Review Migration Files | Task 85 | Simple |
| 87 | Run Shared Migrations | Task 86 | Simple |
| 88 | Verify Public Schema Tables | Task 87 | Medium |
| 89 | Load Default Fixtures | Task 88 | Simple |
| 90 | Test Admin Interface | Task 89 | Medium |
| 91 | Verify Model Relationships | Task 90 | Medium |
| 92 | Create Initial Commit | Task 91 | Simple |

---

## Execution Order

```
01_Tasks-85-88_Migrations-Run.md
        │
        ▼
02_Tasks-89-92_Fixtures-Verification-Commit.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        └── migrations/
            ├── 0001_initial.py
            └── ...

database (public schema):
├── platform_subscriptionplan
├── platform_planfeature
├── platform_platformsettings
├── platform_platformuser
├── platform_platformrole
├── platform_featureflag
├── platform_tenantfeatureflag
├── platform_platformauditlog
└── platform_tenantbilling
```

---

## Migration Commands

```bash
# Create migrations
python manage.py makemigrations platform

# Run shared migrations only
python manage.py migrate_schemas --shared

# Load fixtures
python manage.py loaddata default_plans default_flags
```

---

## Public Schema Verification

```sql
-- Check public schema tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'platform_%';
```

---

## Notes for AI Agents

1. **Dependencies:** Requires all previous groups complete
2. **Order:** Create migrations BEFORE running them
3. **Shared Only:** Use --shared flag for public schema
4. **Fixtures:** Load after migrations complete
5. **Verify:** Check all tables exist in public schema
6. **Git Commit:** Commit with message "feat: design public schema models"

