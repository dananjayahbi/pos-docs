# Tasks 79-84: Billing Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** F - Platform Audit & Billing  
> **Document:** 02 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-73-78_Audit-Log-Model.md](01_Tasks-73-78_Audit-Log-Model.md)
- **→ Next Group:** [../Group-G_Migration-Verification/](../Group-G_Migration-Verification/)

---

## Document Overview

This document defines billing models and documentation for platform billing.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create billing model file | Medium |
| 80 | Add billing fields | Medium |
| 81 | Add BRN validation fields | Medium |
| 82 | Add billing cycle rules | Medium |
| 83 | Configure billing admin | Medium |
| 84 | Document billing setup | Medium |

---

## Task 79: Create billing model file

### Overview
Create billing model module for platform billing.

### Dependencies
- Task 78: Document audit logging

### Instructions

1. **Create `models/billing.py`**
   - Add billing models in platform app

2. **Document purpose**
   - Note billing entries per tenant

### Expected Outcome
- Billing model file created

### Verification Checklist
- [ ] Billing model file exists
- [ ] Purpose documented

---

## Task 80: Add billing fields

### Overview
Add billing amount, currency, and invoice fields.

### Dependencies
- Task 79: Create billing model file

### Instructions

1. **Add billing fields**
   - Include amount, currency (LKR), and invoice references

2. **Document usage**
   - Note monthly billing expectations

### Expected Outcome
- Billing fields defined

### Verification Checklist
- [ ] Billing fields defined
- [ ] Usage documented

---

## Task 81: Add BRN validation fields

### Overview
Add fields for business registration number validation.

### Dependencies
- Task 80: Add billing fields

### Instructions

1. **Add BRN fields**
   - Store BRN and validation status

2. **Document validation rules**
   - Note Sri Lanka-specific format checks

### Expected Outcome
- BRN fields defined

### Verification Checklist
- [ ] BRN fields defined
- [ ] Validation rules documented

---

## Task 82: Add billing cycle rules

### Overview
Define billing cycle rules and status fields.

### Dependencies
- Task 81: Add BRN validation fields

### Instructions

1. **Add cycle fields**
   - Include billing period start/end and status

2. **Document rules**
   - Explain monthly billing schedule

### Expected Outcome
- Billing cycle fields defined

### Verification Checklist
- [ ] Billing cycle fields defined
- [ ] Rules documented

---

## Task 83: Configure billing admin

### Overview
Add admin configuration for billing records.

### Dependencies
- Task 82: Add billing cycle rules

### Instructions

1. **Register billing models**
   - Add billing models to admin

2. **Document admin usage**
   - Note access restrictions

### Expected Outcome
- Billing admin configuration documented

### Verification Checklist
- [ ] Billing admin configured
- [ ] Usage documented

---

## Task 84: Document billing setup

### Overview
Create billing setup documentation.

### Dependencies
- Task 83: Configure billing admin

### Instructions

1. **Create `docs/platform/billing-setup.md`**
   - Document billing lifecycle and records

2. **Link documentation**
   - Add links from docs index

### Expected Outcome
- Billing documentation created

### Verification Checklist
- [ ] Billing doc exists
- [ ] Links added

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create billing model file | Billing model file created |
| 80 | Add billing fields | Billing fields defined |
| 81 | Add BRN validation fields | BRN fields defined |
| 82 | Add billing cycle rules | Billing cycle rules defined |
| 83 | Configure billing admin | Billing admin configured |
| 84 | Document billing setup | Billing doc created |

### Next Steps
- Proceed to [../Group-G_Migration-Verification/](../Group-G_Migration-Verification/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 79 through 84 in sequence
2. **Localization:** Use LKR currency and Sri Lanka BRN formats
3. **No Code Snippets:** Avoid fenced code blocks in documentation
