# Tasks 73-77: Employee Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** F - Employee & Accounting Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Order-Invoice-Models/00_GROUP_OVERVIEW.md](../Group-E_Order-Invoice-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-78-82_Accounting-Models.md](02_Tasks-78-82_Accounting-Models.md)

---

## Document Overview

This document defines the Employee model and its core fields for staff management.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 73 | Create Employee Model | Medium |
| 74 | Add Employee User FK | Simple |
| 75 | Add Employee Role Field | Simple |
| 76 | Add Employee Contact Fields | Simple |
| 77 | Add Employee Status Field | Simple |

---

## Task 73: Create Employee Model

### Overview
Create the Employee model for tenant staff records.

### Dependencies
- Task 11: Register in TENANT_APPS

### Instructions

1. **Define Employee model**
   - Capture core employee attributes

2. **Document role usage**
   - Note role-based access implications

### Expected Outcome
- Employee model documented

### Verification Checklist
- [ ] Employee model documented
- [ ] Role usage noted

---

## Task 74: Add Employee User FK

### Overview
Link employees to tenant users.

### Dependencies
- Task 73: Create Employee Model

### Instructions

1. **Add user foreign key**
   - Link to tenant user model

2. **Document dependency**
   - Note tenant user is defined later

### Expected Outcome
- Employee user FK documented

### Verification Checklist
- [ ] User FK documented
- [ ] Dependency noted

---

## Task 75: Add Employee Role Field

### Overview
Add a role field for staff access levels.

### Dependencies
- Task 73: Create Employee Model

### Instructions

1. **Add role field**
   - Include admin, manager, cashier, warehouse, accountant

2. **Document usage**
   - Note role mapping to permissions

### Expected Outcome
- Role field documented

### Verification Checklist
- [ ] Role field documented
- [ ] Usage noted

---

## Task 76: Add Employee Contact Fields

### Overview
Add contact fields for staff communication.

### Dependencies
- Task 73: Create Employee Model

### Instructions

1. **Add contact fields**
   - Include phone and email

2. **Document format**
   - Use +94 XX XXX XXXX for phone

### Expected Outcome
- Contact fields documented

### Verification Checklist
- [ ] Contact fields documented
- [ ] Phone format noted

---

## Task 77: Add Employee Status Field

### Overview
Add a status field for employee activity.

### Dependencies
- Task 73: Create Employee Model

### Instructions

1. **Add status field**
   - Track active, inactive, or suspended status

2. **Document usage**
   - Note effect on access

### Expected Outcome
- Status field documented

### Verification Checklist
- [ ] Status field documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 73 | Create Employee Model | Employee model documented |
| 74 | Add Employee User FK | User FK documented |
| 75 | Add Employee Role Field | Role field documented |
| 76 | Add Employee Contact Fields | Contact fields documented |
| 77 | Add Employee Status Field | Status field documented |

### Next Steps
- Continue with [02_Tasks-78-82_Accounting-Models.md](02_Tasks-78-82_Accounting-Models.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 73 through 77 in sequence
2. **User FK:** Link to tenant user
3. **No Code Snippets:** Avoid fenced code blocks in documentation
