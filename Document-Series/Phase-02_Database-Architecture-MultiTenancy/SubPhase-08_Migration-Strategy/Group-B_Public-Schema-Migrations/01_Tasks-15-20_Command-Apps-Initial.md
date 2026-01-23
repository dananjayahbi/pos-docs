# Tasks 15-20: Command, Apps & Initial

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** B - Public Schema Migrations  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Migration-Foundation/00_GROUP_OVERVIEW.md](../Group-A_Migration-Foundation/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-25_Models-Data-Seed.md](02_Tasks-21-25_Models-Data-Seed.md)

---

## Document Overview

This document sets up public schema migrations and initial verification.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create Public Migration Command | Simple |
| 16 | Define Public Schema Apps | Simple |
| 17 | Run Initial Public Migration | Simple |
| 18 | Verify Public Tables Created | Simple |
| 19 | Create Public Migration Script | Medium |
| 20 | Handle Tenant Table Updates | Medium |

---

## Task 15: Create Public Migration Command

### Overview
Create a command to migrate the public schema.

### Dependencies
- Task 14: Document Migration Flow

### Instructions

1. **Define public migration command**
   - Use shared schema migration path

2. **Document usage**
   - Note invocation and options

### Expected Outcome
- Public migration command documented

### Verification Checklist
- [ ] Command documented
- [ ] Usage noted

---

## Task 16: Define Public Schema Apps

### Overview
Define the apps that migrate in the public schema.

### Dependencies
- Task 15: Create Public Migration Command

### Instructions

1. **Define public apps list**
   - Include tenants, platform, and shared apps

2. **Document scope**
   - Note why these apps are shared

### Expected Outcome
- Public apps list documented

### Verification Checklist
- [ ] Public apps documented
- [ ] Scope noted

---

## Task 17: Run Initial Public Migration

### Overview
Run initial migrations for public schema.

### Dependencies
- Task 16: Define Public Schema Apps

### Instructions

1. **Run initial migration**
   - Migrate public schema first

2. **Document results**
   - Record migration completion

### Expected Outcome
- Initial public migration documented

### Verification Checklist
- [ ] Initial migration documented
- [ ] Results recorded

---

## Task 18: Verify Public Tables Created

### Overview
Verify public schema tables are created.

### Dependencies
- Task 17: Run Initial Public Migration

### Instructions

1. **Verify tables**
   - Confirm expected tables exist

2. **Document verification**
   - Note any missing tables

### Expected Outcome
- Public tables verified

### Verification Checklist
- [ ] Tables verified
- [ ] Findings noted

---

## Task 19: Create Public Migration Script

### Overview
Create a script to automate public migrations.

### Dependencies
- Task 18: Verify Public Tables Created

### Instructions

1. **Create migration script**
   - Automate public migration flow

2. **Document usage**
   - Note script location and usage

### Expected Outcome
- Migration script documented

### Verification Checklist
- [ ] Script documented
- [ ] Usage noted

---

## Task 20: Handle Tenant Table Updates

### Overview
Handle updates to Tenant model tables in public schema.

### Dependencies
- Task 19: Create Public Migration Script

### Instructions

1. **Define tenant table update flow**
   - Apply updates safely

2. **Document behavior**
   - Note impact on tenant registry

### Expected Outcome
- Tenant table updates documented

### Verification Checklist
- [ ] Updates documented
- [ ] Impact noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create Public Migration Command | Command documented |
| 16 | Define Public Schema Apps | Public apps documented |
| 17 | Run Initial Public Migration | Initial migration documented |
| 18 | Verify Public Tables Created | Tables verified |
| 19 | Create Public Migration Script | Script documented |
| 20 | Handle Tenant Table Updates | Updates documented |

### Next Steps
- Continue with [02_Tasks-21-25_Models-Data-Seed.md](02_Tasks-21-25_Models-Data-Seed.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Order:** Public schema must be migrated first
3. **No Code Snippets:** Avoid fenced code blocks in documentation
