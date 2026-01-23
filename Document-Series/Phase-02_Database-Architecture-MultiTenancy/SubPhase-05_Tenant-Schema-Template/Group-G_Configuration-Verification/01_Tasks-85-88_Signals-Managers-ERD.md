# Tasks 85-88: Signals, Managers & ERD

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** G - Configuration & Verification  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Employee-Accounting-Models/00_GROUP_OVERVIEW.md](../Group-F_Employee-Accounting-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-94_Migrations-Test-Commit.md](02_Tasks-89-94_Migrations-Test-Commit.md)

---

## Document Overview

This document verifies tenant app registration, defines model signals and managers, and documents relationships.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 85 | Verify TENANT_APPS List | Simple |
| 86 | Create Model Signals | Medium |
| 87 | Create Model Managers | Medium |
| 88 | Document Model Relationships | Medium |

---

## Task 85: Verify TENANT_APPS List

### Overview
Confirm all tenant apps are registered correctly.

### Dependencies
- Task 84: Add Audit Log Fields

### Instructions

1. **Review TENANT_APPS**
   - Ensure all tenant apps are listed

2. **Document verification**
   - Record confirmation of app registration

### Expected Outcome
- TENANT_APPS verified

### Verification Checklist
- [ ] TENANT_APPS verified
- [ ] Verification recorded

---

## Task 86: Create Model Signals

### Overview
Define model signals for auto-creating related records.

### Dependencies
- Task 85: Verify TENANT_APPS List

### Instructions

1. **Define auto-create signals**
   - Include TenantSettings, Stock, and related setup

2. **Document triggers**
   - Note when signals fire

### Expected Outcome
- Model signals documented

### Verification Checklist
- [ ] Signals documented
- [ ] Triggers noted

---

## Task 87: Create Model Managers

### Overview
Create custom managers and querysets.

### Dependencies
- Task 85: Verify TENANT_APPS List

### Instructions

1. **Define managers**
   - Include active/inactive helper querysets

2. **Document usage**
   - Note key helper methods

### Expected Outcome
- Model managers documented

### Verification Checklist
- [ ] Managers documented
- [ ] Usage noted

---

## Task 88: Document Model Relationships

### Overview
Document the tenant schema relationships and ERD.

### Dependencies
- Task 87: Create Model Managers

### Instructions

1. **Produce ERD**
   - Use a tool like dbdiagram.io

2. **Document relationships**
   - Record key entity connections

### Expected Outcome
- ERD documentation completed

### Verification Checklist
- [ ] ERD created
- [ ] Relationships documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 85 | Verify TENANT_APPS List | TENANT_APPS verified |
| 86 | Create Model Signals | Signals documented |
| 87 | Create Model Managers | Managers documented |
| 88 | Document Model Relationships | ERD documented |

### Next Steps
- Continue with [02_Tasks-89-94_Migrations-Test-Commit.md](02_Tasks-89-94_Migrations-Test-Commit.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 85 through 88 in sequence
2. **Signals:** Auto-create dependent records
3. **No Code Snippets:** Avoid fenced code blocks in documentation
