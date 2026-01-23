# Tasks 29-34: Commands & Parallel

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 08 - Migration Strategy  
> **Group:** C - Tenant Schema Migrations  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Public-Schema-Migrations/00_GROUP_OVERVIEW.md](../Group-B_Public-Schema-Migrations/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-35-40_Progress-Errors-Retry.md](02_Tasks-35-40_Progress-Errors-Retry.md)

---

## Document Overview

This document defines tenant migration commands and parallel execution settings.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create Tenant Migration Command | Medium |
| 30 | Define Tenant Schema Apps | Simple |
| 31 | Create Single Tenant Migration | Medium |
| 32 | Create Batch Tenant Migration | Medium |
| 33 | Configure Parallel Migration | Complex |
| 34 | Set Concurrency Limit | Simple |

---

## Task 29: Create Tenant Migration Command

### Overview
Create a command to migrate tenant schemas.

### Dependencies
- Task 28: Document Public Migrations

### Instructions

1. **Define tenant migration command**
   - Target tenant schemas only

2. **Document usage**
   - Note options for single or all tenants

### Expected Outcome
- Tenant migration command documented

### Verification Checklist
- [ ] Command documented
- [ ] Usage noted

---

## Task 30: Define Tenant Schema Apps

### Overview
Define the tenant apps list for migrations.

### Dependencies
- Task 29: Create Tenant Migration Command

### Instructions

1. **Define tenant apps list**
   - Include all tenant business apps

2. **Document scope**
   - Note relation to TENANT_APPS

### Expected Outcome
- Tenant apps scope documented

### Verification Checklist
- [ ] Tenant apps documented
- [ ] Scope noted

---

## Task 31: Create Single Tenant Migration

### Overview
Create a migration path for a single tenant.

### Dependencies
- Task 30: Define Tenant Schema Apps

### Instructions

1. **Define single-tenant flow**
   - Migrate one tenant schema

2. **Document usage**
   - Note when to use single tenant mode

### Expected Outcome
- Single-tenant migration documented

### Verification Checklist
- [ ] Single-tenant flow documented
- [ ] Usage noted

---

## Task 32: Create Batch Tenant Migration

### Overview
Create a migration flow for batches of tenants.

### Dependencies
- Task 31: Create Single Tenant Migration

### Instructions

1. **Define batch migration**
   - Process tenants in batches

2. **Document behavior**
   - Note ordering and limits

### Expected Outcome
- Batch migration documented

### Verification Checklist
- [ ] Batch flow documented
- [ ] Behavior noted

---

## Task 33: Configure Parallel Migration

### Overview
Configure parallel tenant migrations.

### Dependencies
- Task 32: Create Batch Tenant Migration

### Instructions

1. **Configure parallel execution**
   - Use controlled worker pool

2. **Document safeguards**
   - Note limits to avoid overload

### Expected Outcome
- Parallel migration documented

### Verification Checklist
- [ ] Parallel execution documented
- [ ] Safeguards noted

---

## Task 34: Set Concurrency Limit

### Overview
Set maximum concurrent migrations.

### Dependencies
- Task 33: Configure Parallel Migration

### Instructions

1. **Set concurrency limit**
   - Define max workers or batch size

2. **Document rationale**
   - Note performance and safety balance

### Expected Outcome
- Concurrency limit documented

### Verification Checklist
- [ ] Limit documented
- [ ] Rationale noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create Tenant Migration Command | Command documented |
| 30 | Define Tenant Schema Apps | Tenant apps documented |
| 31 | Create Single Tenant Migration | Single-tenant flow documented |
| 32 | Create Batch Tenant Migration | Batch flow documented |
| 33 | Configure Parallel Migration | Parallel config documented |
| 34 | Set Concurrency Limit | Concurrency limit documented |

### Next Steps
- Continue with [02_Tasks-35-40_Progress-Errors-Retry.md](02_Tasks-35-40_Progress-Errors-Retry.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 34 in sequence
2. **Parallel:** Use safe concurrency limits
3. **No Code Snippets:** Avoid fenced code blocks in documentation
