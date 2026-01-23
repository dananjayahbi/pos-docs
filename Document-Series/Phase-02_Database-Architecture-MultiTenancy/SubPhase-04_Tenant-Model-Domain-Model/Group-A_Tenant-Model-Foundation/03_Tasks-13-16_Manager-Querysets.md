# Tasks 13-16: Manager & Querysets

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** A - Tenant Model Foundation  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Status-Schema-Meta.md](02_Tasks-07-12_Status-Schema-Meta.md)
- **→ Next Group:** [../Group-B_Tenant-Business-Information/](../Group-B_Tenant-Business-Information/)

---

## Document Overview

This document adds tenant model manager and query helpers.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 13 | Create tenant manager file | Medium |
| 14 | Add active tenant queryset | Medium |
| 15 | Add billing status filters | Medium |
| 16 | Validate manager behavior | Medium |

---

## Task 13: Create tenant manager file

### Overview
Create a tenant manager for filtering tenant records.

### Dependencies
- Task 12: Validate status and meta

### Instructions

1. **Create `models/managers/tenant_manager.py`**
   - Add manager for tenant model

2. **Document purpose**
   - Note expected query helpers

### Expected Outcome
- Tenant manager file created

### Verification Checklist
- [ ] Tenant manager file exists
- [ ] Purpose documented

---

## Task 14: Add active tenant queryset

### Overview
Add a queryset method for active tenants.

### Dependencies
- Task 13: Create tenant manager file

### Instructions

1. **Define active filter**
   - Include only active tenants

2. **Document usage**
   - Note where active filter is used

### Expected Outcome
- Active tenant queryset defined

### Verification Checklist
- [ ] Active queryset defined
- [ ] Usage documented

---

## Task 15: Add billing status filters

### Overview
Add queryset helpers for billing status.

### Dependencies
- Task 14: Add active tenant queryset

### Instructions

1. **Define billing filters**
   - Add filters for trial, active, and expired

2. **Document usage**
   - Note where filters are used

### Expected Outcome
- Billing status filters defined

### Verification Checklist
- [ ] Billing filters defined
- [ ] Usage documented

---

## Task 16: Validate manager behavior

### Overview
Validate manager methods and queryset results.

### Dependencies
- Task 15: Add billing status filters

### Instructions

1. **Review manager methods**
   - Ensure methods return expected results

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Tenant manager validated

### Verification Checklist
- [ ] Manager methods validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 13 | Create tenant manager file | Tenant manager created |
| 14 | Add active tenant queryset | Active filter added |
| 15 | Add billing status filters | Billing filters added |
| 16 | Validate manager behavior | Manager validated |

### Next Steps
- Proceed to [../Group-B_Tenant-Business-Information/](../Group-B_Tenant-Business-Information/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 13 through 16 in sequence
2. **Querysets:** Keep helper methods consistent across services
3. **No Code Snippets:** Avoid fenced code blocks in documentation
