# Tasks 38-42: Registry & Verification

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** C - App Classification (SHARED vs TENANT)  
> **Document:** 03 of 03  
> **Tasks Covered:** 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-33-37_Tenant-Apps-Installed.md](02_Tasks-33-37_Tenant-Apps-Installed.md)
- **→ Next Group:** [../Group-D_Model-Configuration/](../Group-D_Model-Configuration/)

---

## Document Overview

This document validates app registry behavior and confirms app classification rules.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 38 | Verify app registry import | Medium |
| 39 | Validate shared apps migrations | Medium |
| 40 | Validate tenant apps migrations | Medium |
| 41 | Document auth per-tenant decision | Medium |
| 42 | Record classification verification | Simple |

---

## Task 38: Verify app registry import

### Overview
Verify the apps registry loads with shared and tenant apps.

### Dependencies
- Task 37: Document app classification

### Instructions

1. **Load Django apps registry**
   - Ensure no import errors

2. **Record verification**
   - Note verification outcome

### Expected Outcome
- App registry loads successfully

### Verification Checklist
- [ ] Registry loads without errors
- [ ] Verification recorded

---

## Task 39: Validate shared apps migrations

### Overview
Confirm shared apps migrate in the public schema.

### Dependencies
- Task 38: Verify app registry import

### Instructions

1. **Validate shared migrations**
   - Ensure shared apps apply to public schema

2. **Record results**
   - Capture migration validation outcome

### Expected Outcome
- Shared migrations validated

### Verification Checklist
- [ ] Shared migrations validated
- [ ] Results documented

---

## Task 40: Validate tenant apps migrations

### Overview
Confirm tenant apps migrate within tenant schemas.

### Dependencies
- Task 39: Validate shared apps migrations

### Instructions

1. **Validate tenant migrations**
   - Ensure tenant apps apply to tenant schemas

2. **Record results**
   - Capture migration validation outcome

### Expected Outcome
- Tenant migrations validated

### Verification Checklist
- [ ] Tenant migrations validated
- [ ] Results documented

---

## Task 41: Document auth per-tenant decision

### Overview
Document the decision to keep auth per tenant.

### Dependencies
- Task 40: Validate tenant apps migrations

### Instructions

1. **Document auth model choice**
   - Explain per-tenant auth rationale

2. **Link decision**
   - Reference ADRs or architecture docs if available

### Expected Outcome
- Auth per-tenant decision documented

### Verification Checklist
- [ ] Decision documented
- [ ] Links added

---

## Task 42: Record classification verification

### Overview
Record verification results for app classification.

### Dependencies
- Task 41: Document auth per-tenant decision

### Instructions

1. **Record verification details**
   - Capture date, reviewer, and outcome

2. **Link verification**
   - Reference in app classification documentation

### Expected Outcome
- Classification verification recorded

### Verification Checklist
- [ ] Verification record documented
- [ ] Links added

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 38 | Verify app registry import | Registry verified |
| 39 | Validate shared apps migrations | Shared migrations validated |
| 40 | Validate tenant apps migrations | Tenant migrations validated |
| 41 | Document auth per-tenant decision | Decision documented |
| 42 | Record classification verification | Verification recorded |

### Next Steps
- Proceed to [../Group-D_Model-Configuration/](../Group-D_Model-Configuration/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 38 through 42 in sequence
2. **Auth Model:** Maintain per-tenant auth decision
3. **No Code Snippets:** Avoid fenced code blocks in documentation
