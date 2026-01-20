# Group D: Zero-Downtime Approach

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Implement zero-downtime migration rules and safe migration practices

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Tenant-Schema-Migrations/](../Group-C_Tenant-Schema-Migrations/)
- **→ Next Group:** [../Group-E_Rollback-Strategy/](../Group-E_Rollback-Strategy/)

---

## Group Overview

This group implements zero-downtime migration practices to ensure the application remains available during database migrations. This includes safe migration rules, a migration linter, and PostgreSQL-specific optimizations.

### Key Outcomes
- Define zero-downtime rules
- Enforce additive migrations only
- Require nullable new columns
- Require default values for new columns
- Avoid column renames
- Implement phased column removal
- Create migration linter
- Configure django-pg-zero-downtime
- Handle index creation CONCURRENTLY
- Handle non-blocking constraint addition
- Create migration dry run
- Schedule off-peak migrations
- Monitor during migrations
- Document zero-downtime rules

### Technology Context
- **Zero-Downtime:** No service interruption
- **PostgreSQL:** CONCURRENTLY for indexes
- **Linter:** Block unsafe migrations
- **Monitoring:** Performance impact tracking

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-50_Rules-Columns.md | 45-50 | Zero-downtime rules, additive, nullable, defaults, no renames, phased removal |
| 02 | 02_Tasks-51-55_Linter-Indexes-DryRun.md | 51-55 | Linter, pg-zero-downtime, concurrent indexes, constraints, dry run |
| 03 | 03_Tasks-56-58_Schedule-Monitor-Docs.md | 56-58 | Off-peak scheduling, monitoring, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Define Zero-Downtime Rules | Task 44 | Simple |
| 46 | Additive Migrations Only | Task 45 | Simple |
| 47 | Nullable New Columns | Task 45 | Simple |
| 48 | Default Values Required | Task 45 | Simple |
| 49 | No Column Renames | Task 45 | Simple |
| 50 | Phased Column Removal | Task 49 | Medium |
| 51 | Create Linter for Migrations | Task 50 | Complex |
| 52 | Configure django-pg-zero-downtime | Task 51 | Medium |
| 53 | Handle Index Creation | Task 52 | Medium |
| 54 | Handle Constraint Addition | Task 52 | Medium |
| 55 | Create Migration Dry Run | Task 54 | Medium |
| 56 | Schedule Off-Peak Migrations | Task 55 | Simple |
| 57 | Monitor During Migration | Task 56 | Medium |
| 58 | Document Zero-Downtime Rules | Task 57 | Simple |

---

## Execution Order

```
01_Tasks-45-50_Rules-Columns.md
        │
        ▼
02_Tasks-51-55_Linter-Indexes-DryRun.md
        │
        ▼
03_Tasks-56-58_Schedule-Monitor-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── core/
│       ├── management/
│       │   └── commands/
│       │       ├── lint_migrations.py
│       │       └── migrate_dry_run.py
│       └── migration_linter.py
├── scripts/
│   ├── monitor_migration.sh
│   └── schedule_migration.py

docs/
└── migrations/
    ├── zero-downtime.md
    └── safe-migration-rules.md
```

---

## Zero-Downtime Rules

| Rule | Description | Example |
|------|-------------|---------|
| ✅ Add Column | Always allowed | `AddField(null=True)` |
| ✅ Add Table | Always allowed | `CreateModel` |
| ✅ Add Index | Use CONCURRENTLY | `AddIndex(concurrently=True)` |
| ⚠️ Remove Column | Phase out over deploys | Deploy 1: Stop using, Deploy 2: Remove |
| ❌ Rename Column | Never do directly | Add new → migrate data → remove old |
| ❌ Change Type | Dangerous | Use phased approach |

---

## Phased Column Removal

```
Deploy 1: Stop writing to old column, start writing to new
            │
            ▼
Deploy 2: Backfill data from old to new column
            │
            ▼
Deploy 3: Start reading from new column only
            │
            ▼
Deploy 4: Remove old column migration
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (tenant migrations work)
2. **PostgreSQL:** Use CONCURRENTLY for indexes
3. **Nullable:** New columns MUST be nullable or have defaults
4. **Linter:** Block unsafe migrations in CI
5. **Monitor:** Watch pg_stat_activity during migrations
6. **Git Commit:** Commit after completing this group

