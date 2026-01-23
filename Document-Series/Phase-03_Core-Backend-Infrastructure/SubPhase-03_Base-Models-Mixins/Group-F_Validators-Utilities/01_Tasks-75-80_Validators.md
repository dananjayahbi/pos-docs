# Tasks 75-80: Validators

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** F - Validators & Utilities  
> **Document:** 01 of 04  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_UUID-TenantScoped-Models/00_GROUP_OVERVIEW.md](../Group-E_UUID-TenantScoped-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-81-85_Custom-Fields.md](02_Tasks-81-85_Custom-Fields.md)

---

## Document Overview

This document covers validator creation for Sri Lankan phone numbers, NIC, BRN, positive decimals, and percentages.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Create validators.py File | Simple |
| 76 | Create PhoneNumberValidator | Medium |
| 77 | Create NICValidator | Medium |
| 78 | Create BRNValidator | Medium |
| 79 | Create PositiveDecimalValidator | Simple |
| 80 | Create PercentageValidator | Simple |

---

## Task 75: Create validators.py File

### Overview
Create validators module.

### Dependencies
- Task 74: Document UUID & TenantScoped

### Instructions

1. **Create validators file**
   - Place under core validators

2. **Document purpose**
   - Central validation utilities

### Expected Outcome
- validators.py documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 76: Create PhoneNumberValidator

### Overview
Create validator for Sri Lankan phone numbers.

### Dependencies
- Task 75: Create validators.py File

### Instructions

1. **Define phone format**
   - Use +94 XX XXX XXXX format support

2. **Document validation**
   - Accept common local variants

### Expected Outcome
- Phone validator documented

### Verification Checklist
- [ ] Validator documented
- [ ] Format noted

---

## Task 77: Create NICValidator

### Overview
Create validator for Sri Lankan NIC.

### Dependencies
- Task 76: Create PhoneNumberValidator

### Instructions

1. **Define NIC formats**
   - Old 9 digits + V/X, new 12 digits

2. **Document validation**
   - Accept both formats

### Expected Outcome
- NIC validator documented

### Verification Checklist
- [ ] Validator documented
- [ ] Formats noted

---

## Task 78: Create BRNValidator

### Overview
Create validator for Business Registration Number.

### Dependencies
- Task 77: Create NICValidator

### Instructions

1. **Define BRN format**
   - Uppercase letters and numbers

2. **Document validation**
   - Standard pattern

### Expected Outcome
- BRN validator documented

### Verification Checklist
- [ ] Validator documented
- [ ] Format noted

---

## Task 79: Create PositiveDecimalValidator

### Overview
Create validator for positive decimals.

### Dependencies
- Task 78: Create BRNValidator

### Instructions

1. **Define positive decimal rule**
   - Reject negatives

2. **Document usage**
   - Use for monetary values

### Expected Outcome
- Positive decimal validator documented

### Verification Checklist
- [ ] Validator documented
- [ ] Usage noted

---

## Task 80: Create PercentageValidator

### Overview
Create validator for percentage values.

### Dependencies
- Task 79: Create PositiveDecimalValidator

### Instructions

1. **Define percentage range**
   - 0 to 100

2. **Document usage**
   - Use for discount rates

### Expected Outcome
- Percentage validator documented

### Verification Checklist
- [ ] Validator documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 75 | Create validators.py File | File documented |
| 76 | Create PhoneNumberValidator | Validator documented |
| 77 | Create NICValidator | Validator documented |
| 78 | Create BRNValidator | Validator documented |
| 79 | Create PositiveDecimalValidator | Validator documented |
| 80 | Create PercentageValidator | Validator documented |

### Next Steps
- Continue with [02_Tasks-81-85_Custom-Fields.md](02_Tasks-81-85_Custom-Fields.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 75 through 80 in sequence
2. **Sri Lanka:** Use local formats
3. **No Code Snippets:** Avoid fenced code blocks in documentation
