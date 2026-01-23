# Tasks 35-40: Progress, Errors & Retry

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** C - Tenant Schema Migrations  
> **Document:** 02 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-34_Commands-Parallel.md](01_Tasks-29-34_Commands-Parallel.md)
- **→ Next Document:** [03_Tasks-41-44_Data-Large-Verify-Docs.md](03_Tasks-41-44_Data-Large-Verify-Docs.md)

---

## Document Overview

This document covers ordering, progress tracking, log tables, and retry handling.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Handle Migration Ordering | Medium |
| 36 | Create Progress Tracking | Medium |
| 37 | Create Migration Log Table | Medium |
| 38 | Handle Failed Tenant Migration | Medium |
| 39 | Retry Failed Migrations | Medium |
| 40 | Skip Problematic Tenants | Simple |

---

## Task 35: Handle Migration Ordering

### Overview
Define the order for tenant schema migrations.

### Dependencies
- Task 34: Set Concurrency Limit

### Instructions

1. **Define migration ordering**
   - Ensure dependencies resolve correctly

2. **Document ordering**
   - Note how order is enforced

### Expected Outcome
- Migration ordering documented

### Verification Checklist
- [ ] Ordering documented
- [ ] Enforcement noted

---

## Task 36: Create Progress Tracking

### Overview
Create progress tracking for migration runs.

### Dependencies
- Task 35: Handle Migration Ordering

### Instructions

1. **Define progress tracking**
   - Track completed and pending tenants

2. **Document reporting**
   - Note progress output format

### Expected Outcome
- Progress tracking documented

### Verification Checklist
- [ ] Progress tracking documented
- [ ] Reporting noted

---

## Task 37: Create Migration Log Table

### Overview
Create a log table for tenant migration history.

### Dependencies
- Task 36: Create Progress Tracking

### Instructions

1. **Define migration log table**
   - Record tenant, status, timestamps

2. **Document usage**
   - Note how logs are queried

### Expected Outcome
- Migration log table documented

### Verification Checklist
- [ ] Log table documented
- [ ] Usage noted

---

## Task 38: Handle Failed Tenant Migration

### Overview
Handle failures on tenant migrations.

### Dependencies
- Task 37: Create Migration Log Table

### Instructions

1. **Define failure handling**
   - Record failures and stop or continue

2. **Document behavior**
   - Note failure thresholds

### Expected Outcome
- Failure handling documented

### Verification Checklist
- [ ] Failure handling documented
- [ ] Thresholds noted

---

## Task 39: Retry Failed Migrations

### Overview
Retry migrations that failed.

### Dependencies
- Task 38: Handle Failed Tenant Migration

### Instructions

1. **Define retry behavior**
   - Use configured retry count

2. **Document safeguards**
   - Note delays between retries

### Expected Outcome
- Retry behavior documented

### Verification Checklist
- [ ] Retry behavior documented
- [ ] Safeguards noted

---

## Task 40: Skip Problematic Tenants

### Overview
Allow skipping tenants that repeatedly fail.

### Dependencies
- Task 39: Retry Failed Migrations

### Instructions

1. **Define skip mechanism**
   - Mark tenant as skipped

2. **Document usage**
   - Note manual review requirement

### Expected Outcome
- Skip mechanism documented

### Verification Checklist
- [ ] Skip mechanism documented
- [ ] Review requirement noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Handle Migration Ordering | Ordering documented |
| 36 | Create Progress Tracking | Tracking documented |
| 37 | Create Migration Log Table | Log table documented |
| 38 | Handle Failed Tenant Migration | Failure handling documented |
| 39 | Retry Failed Migrations | Retry behavior documented |
| 40 | Skip Problematic Tenants | Skip mechanism documented |

### Next Steps
- Continue with [03_Tasks-41-44_Data-Large-Verify-Docs.md](03_Tasks-41-44_Data-Large-Verify-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 35 through 40 in sequence
2. **Logs:** Maintain per-tenant migration history
3. **No Code Snippets:** Avoid fenced code blocks in documentation
