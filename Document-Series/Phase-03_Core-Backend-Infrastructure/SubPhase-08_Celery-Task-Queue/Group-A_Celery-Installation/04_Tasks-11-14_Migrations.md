# Tasks 11-14: Migrations

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** A - Celery Installation  
> **Document:** 04 of 04  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-09-10_Redis-Verification.md](03_Tasks-09-10_Redis-Verification.md)
- **→ Next Group:** [../Group-B_Celery-Configuration/](../Group-B_Celery-Configuration/)

---

## Document Overview

This document covers the creation and application of database migrations for django-celery-beat and django-celery-results apps, and the update of requirements.txt with all Celery dependencies.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Update requirements.txt | Simple |
| 12 | Generate Beat Migrations | Simple |
| 13 | Generate Results Migrations | Simple |
| 14 | Apply Migrations | Medium |

---

## Task 11: Update requirements.txt

### Overview
Consolidate all Celery-related package installations into the requirements.txt file with proper version pinning to ensure reproducible deployments across all environments.

### Dependencies
- Task 02: Pin Celery Version
- Task 03: Install redis Package
- Task 04: Install django-celery-beat
- Task 05: Install django-celery-results
- Task 06: Install flower

### Instructions

1. **Locate requirements file**
   - Find the appropriate requirements file for your project
   - Common locations: `requirements.txt`, `requirements/base.txt`, `requirements/production.txt`
   - For LCC: Use `backend/requirements/base.txt` for core dependencies

2. **Add all Celery packages with versions**
   - List all five packages installed in earlier tasks
   - Include exact version pins for each package
   - Add comments for clarity and organization

3. **Organize package list**
   - Group Celery packages together in requirements file
   - Add section comment like "# Task Queue - Celery"
   - Maintain alphabetical order within groups
   - Include brief purpose comments if helpful

4. **Verify package versions**
   - Confirm all versions are the currently installed versions
   - Ensure version compatibility between packages
   - Check compatibility with Django 5.x and Python 3.12+

### Requirements File Organization
Recommended structure:
```
# Task Queue - Celery
celery==5.3.4              # Distributed task queue
redis==5.0.1               # Redis client for broker/backend
django-celery-beat==2.5.0  # Database-backed periodic tasks
django-celery-results==2.5.1  # Database result backend
flower==2.0.1              # Task monitoring UI
```

### Version Compatibility Matrix
| Package | Min Version | Compatible With |
|---------|-------------|-----------------|
| celery | 5.3.x | Django 5.x, Python 3.12+ |
| redis | 5.0.x | Celery 5.3+ |
| django-celery-beat | 2.5.x | Django 5.x, Celery 5.3+ |
| django-celery-results | 2.5.x | Django 5.x, Celery 5.3+ |
| flower | 2.0.x | Celery 5.3+ |

### Requirements File Best Practices
| Practice | Rationale |
|----------|-----------|
| Exact pinning | Reproducible deployments |
| Comments | Clarify package purpose |
| Grouping | Organize related packages |
| Alphabetical | Easy to find packages |
| Version compatibility | Prevent conflicts |

### Expected Outcome
- requirements.txt contains all five Celery packages
- All packages have exact version pins
- Packages are organized and commented
- Ready for fresh installations

### Verification Checklist
- [ ] All five Celery packages are in requirements file
- [ ] Each package has exact version pin (==x.y.z)
- [ ] Versions match currently installed versions
- [ ] Packages are grouped and commented
- [ ] File can be used for fresh installation

---

## Task 12: Generate Beat Migrations

### Overview
Generate Django migrations for django-celery-beat models that will create database tables for storing periodic task schedules.

### Dependencies
- Task 07: Add django_celery_beat to INSTALLED_APPS

### Instructions

1. **Run makemigrations command**
   - Execute Django's makemigrations management command
   - Specify the django_celery_beat app
   - Review the generated migration file

2. **Verify migration file created**
   - Check that migration file appears in django_celery_beat migrations directory
   - Migration file is numbered (e.g., 0001_initial.py)
   - File contains CreateModel operations

3. **Review migration operations**
   - Confirm all expected models are created
   - Check field definitions match requirements
   - Verify foreign key relationships are correct

4. **Multi-tenancy considerations**
   - Determine if Beat tables should be in public or tenant schemas
   - For LCC: Likely public schema (system-wide schedules) OR tenant schema (per-tenant schedules)
   - Configure schema_tenant setting if using tenant schema

### Django-Celery-Beat Models
Migrations will create tables for:
| Model | Purpose | Fields |
|-------|---------|--------|
| PeriodicTask | Task schedule definitions | name, task, schedule type, args, kwargs |
| IntervalSchedule | Fixed intervals | every, period (seconds/minutes/hours) |
| CrontabSchedule | Cron schedules | minute, hour, day of week, day of month, month |
| SolarSchedule | Sun-based schedules | event (sunrise/sunset), latitude, longitude |
| ClockedSchedule | One-time schedules | clocked_time |
| PeriodicTasks | Change tracking | last_update |

### Schema Placement Decision
| Option | Use Case |
|--------|----------|
| Public Schema | System-wide schedules, all tenants share |
| Tenant Schema | Per-tenant schedules, isolated scheduling |
| Hybrid | Some tasks in public, some in tenant |

For LCC recommendation:
- **Public Schema:** System maintenance tasks (backups, cleanup)
- **Tenant Schema:** Business tasks (reports, alerts, notifications)

### Migration File Structure
Generated migration includes:
- CreateModel operations for each model
- Field definitions with appropriate types
- Index definitions for performance
- Foreign key constraints
- Unique constraints

### Expected Outcome
- Migration file generated in django_celery_beat package
- All Beat models defined in migration
- Migration ready to apply
- Schema placement decided

### Verification Checklist
- [ ] makemigrations command executed successfully
- [ ] Migration file created in django_celery_beat/migrations/
- [ ] Migration file numbered correctly (0001_initial.py)
- [ ] All expected models appear in migration
- [ ] Schema placement decision made
- [ ] No migration errors or warnings

---

## Task 13: Generate Results Migrations

### Overview
Generate Django migrations for django-celery-results models that will create database tables for storing task execution results and history.

### Dependencies
- Task 08: Add django_celery_results to INSTALLED_APPS

### Instructions

1. **Run makemigrations command**
   - Execute Django's makemigrations management command
   - Specify the django_celery_results app
   - Review the generated migration file

2. **Verify migration file created**
   - Check that migration file appears in django_celery_results migrations directory
   - Migration file is numbered (e.g., 0001_initial.py)
   - File contains CreateModel operations

3. **Review migration operations**
   - Confirm TaskResult, GroupResult, ChordCounter models created
   - Check field definitions for task storage
   - Verify indexes for task_id and status fields

4. **Multi-tenancy considerations**
   - Results should typically be in tenant schema
   - Each tenant has isolated task results
   - Ensures data privacy and tenant isolation

### Django-Celery-Results Models
Migrations will create tables for:
| Model | Purpose | Fields |
|-------|---------|--------|
| TaskResult | Individual task results | task_id, task_name, status, result, traceback, date_created, date_done |
| GroupResult | Group task results | group_id, date_created, date_done, content_type, content_encoding |
| ChordCounter | Chord callback tracking | group_id, sub_tasks, count |

### TaskResult Fields Detail
| Field | Type | Purpose |
|-------|------|---------|
| task_id | CharField(255) | Unique task UUID |
| task_name | CharField(255) | Full task name path |
| task_args | TextField | JSON encoded arguments |
| task_kwargs | TextField | JSON encoded keyword arguments |
| status | CharField(50) | PENDING, STARTED, SUCCESS, FAILURE, RETRY |
| result | TextField | Return value or exception |
| date_created | DateTimeField | Task creation time |
| date_done | DateTimeField | Task completion time |
| traceback | TextField | Error traceback if failed |
| meta | TextField | Additional metadata |

### Schema Placement
For LCC:
- **Tenant Schema:** Task results are tenant-specific
- Each tenant sees only their task results
- Ensures data isolation and privacy
- Supports per-tenant task monitoring

### Indexes for Performance
Migration should create indexes on:
- task_id (primary lookup)
- status (filtering by status)
- task_name (filtering by task type)
- date_created (time-based queries)
- date_done (completion time queries)

### Expected Outcome
- Migration file generated in django_celery_results package
- All Results models defined in migration
- Indexes created for performance
- Ready to apply to tenant schemas

### Verification Checklist
- [ ] makemigrations command executed successfully
- [ ] Migration file created in django_celery_results/migrations/
- [ ] Migration file numbered correctly
- [ ] TaskResult, GroupResult, ChordCounter models in migration
- [ ] Appropriate indexes defined
- [ ] Ready for tenant schema application

---

## Task 14: Apply Migrations

### Overview
Apply the generated migrations for both django-celery-beat and django-celery-results to create the required database tables in the appropriate schemas.

### Dependencies
- Task 12: Generate Beat Migrations
- Task 13: Generate Results Migrations

### Instructions

1. **Determine migration strategy**
   - Decide which schemas need migrations
   - Public schema for system-wide tables
   - Tenant schemas for tenant-specific tables
   - Document the decision

2. **Apply migrations to public schema**
   - Run migrate command for public schema
   - Apply django_celery_beat migrations (if public)
   - Verify tables created successfully

3. **Apply migrations to tenant schemas**
   - Run migrate command for all tenant schemas
   - Apply django_celery_results migrations to each tenant
   - Optionally apply beat migrations if tenant-specific
   - Verify tables created in each tenant schema

4. **Verify migration application**
   - Check that all tables exist in database
   - Verify table structures match models
   - Test that models can be queried
   - Check migration history is recorded

5. **Test model access**
   - Open Django shell
   - Import Beat and Results models
   - Perform simple queries
   - Verify no errors

### Migration Strategy for LCC
| Component | Schema | Rationale |
|-----------|--------|-----------|
| django_celery_beat | Public | System-wide scheduling OR |
| django_celery_beat | Tenant | Per-tenant scheduling |
| django_celery_results | Tenant | Isolated task results |

Recommended for LCC:
- **Beat in Tenant Schema:** Each tenant manages own schedules
- **Results in Tenant Schema:** Each tenant sees only their results

### Migration Commands
Apply to public schema:
- Migrate specific app to public schema
- Verify public schema tables

Apply to all tenant schemas:
- Iterate through all tenants
- Migrate each tenant schema
- Handle any migration errors per tenant

### Multi-Tenancy Migration Process
1. Apply to public schema (if needed)
2. Get list of all tenants
3. For each tenant:
   - Set tenant context
   - Apply migrations
   - Verify success
4. Report results

### Database Tables Created
**django_celery_beat tables:**
- django_celery_beat_periodictask
- django_celery_beat_intervalschedule
- django_celery_beat_crontabschedule
- django_celery_beat_solarschedule
- django_celery_beat_clockedschedule
- django_celery_beat_periodictasks

**django_celery_results tables:**
- django_celery_results_taskresult
- django_celery_results_groupresult
- django_celery_results_chordcounter

### Migration Verification Steps
| Step | Action |
|------|--------|
| 1 | Check migration history (django_migrations table) |
| 2 | List tables in schema |
| 3 | Verify all expected tables exist |
| 4 | Query model counts (should be 0 initially) |
| 5 | Test model creation |

### Handling Migration Errors
Common issues:
| Error | Cause | Solution |
|-------|-------|----------|
| Table already exists | Previous migration | Use --fake if intentional |
| Missing dependency | App not in INSTALLED_APPS | Add app to settings |
| Permission denied | Database permissions | Grant table creation permission |
| Tenant not found | Invalid tenant | Check tenant exists |

### Expected Outcome
- All Beat tables created in appropriate schema(s)
- All Results tables created in tenant schemas
- Migrations recorded in django_migrations table
- Models are queryable without errors
- Ready for Celery configuration

### Verification Checklist
- [ ] Migrations applied to public schema (if applicable)
- [ ] Migrations applied to all tenant schemas
- [ ] All expected tables exist in database
- [ ] Can query Beat models without errors
- [ ] Can query Results models without errors
- [ ] Migration history is recorded
- [ ] No migration errors or warnings

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Update requirements.txt | All Celery packages documented |
| 12 | Generate Beat Migrations | Beat migration files created |
| 13 | Generate Results Migrations | Results migration files created |
| 14 | Apply Migrations | Database tables created |

### Requirements File Status
All Celery packages added to requirements.txt:
- celery (with version)
- redis (with version)
- django-celery-beat (with version)
- django-celery-results (with version)
- flower (with version)

### Database Schema Status
**Tables Created:**
- 6 tables for django_celery_beat (scheduling)
- 3 tables for django_celery_results (results storage)

**Schema Locations:**
- Beat tables: public or tenant (based on decision)
- Results tables: tenant schemas

### Group A Completion Status
All installation tasks complete:
✓ Celery packages installed
✓ Django apps registered
✓ Redis verified
✓ Migrations applied
✓ Requirements documented

### Next Steps
Proceed to [Group-B_Celery-Configuration](../Group-B_Celery-Configuration/) to configure Celery application and settings.

---

## Notes for AI Agents

1. **Requirements File:** Keep all Celery packages grouped together
2. **Version Pinning:** Use exact versions for production stability
3. **Migration Strategy:** Decide public vs tenant schema placement
4. **Multi-Tenancy:** Apply migrations to all tenant schemas
5. **Verification:** Test model queries after migration
6. **Schema Isolation:** Results should be tenant-isolated
7. **Error Handling:** Handle migration errors gracefully
8. **Documentation:** Document schema placement decisions
