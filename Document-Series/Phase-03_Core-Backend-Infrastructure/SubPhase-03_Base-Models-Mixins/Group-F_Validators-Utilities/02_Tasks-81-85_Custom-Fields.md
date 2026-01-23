# Tasks 81-85: Custom Fields

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** F - Validators & Utilities  
> **Document:** 02 of 04  
> **Tasks Covered:** 81, 82, 83, 84, 85

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-75-80_Validators.md](01_Tasks-75-80_Validators.md)
- **→ Next Document:** [03_Tasks-86-90_Utils-Exports.md](03_Tasks-86-90_Utils-Exports.md)

---

## Document Overview

This document covers custom field definitions for money, percentage, phone numbers, and auto-generated slugs.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create fields.py File | Simple |
| 82 | Create MoneyField | Medium |
| 83 | Create PercentageField | Medium |
| 84 | Create PhoneNumberField | Medium |
| 85 | Create SlugField with Auto | Medium |

---

## Task 81: Create fields.py File

### Overview
Create custom fields module.

### Dependencies
- Task 80: Create PercentageValidator

### Instructions

1. **Create fields file**
   - Place under core fields

2. **Document purpose**
   - Central custom fields

### Expected Outcome
- fields.py documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 82: Create MoneyField

### Overview
Create MoneyField with precision.

### Dependencies
- Task 81: Create fields.py File

### Instructions

1. **Define MoneyField defaults**
   - Two decimal places for LKR

2. **Document usage**
   - Monetary values across apps

### Expected Outcome
- MoneyField documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 83: Create PercentageField

### Overview
Create PercentageField.

### Dependencies
- Task 82: Create MoneyField

### Instructions

1. **Define PercentageField defaults**
   - 0 to 100 with 2 decimals

2. **Document usage**
   - Discounts and tax rates

### Expected Outcome
- PercentageField documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 84: Create PhoneNumberField

### Overview
Create PhoneNumberField.

### Dependencies
- Task 83: Create PercentageField

### Instructions

1. **Define PhoneNumberField behavior**
   - Enforce Sri Lankan format

2. **Document usage**
   - Customer and vendor contacts

### Expected Outcome
- PhoneNumberField documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 85: Create SlugField with Auto

### Overview
Create slug field with auto-generation.

### Dependencies
- Task 84: Create PhoneNumberField

### Instructions

1. **Define auto slug generation**
   - Generate from name/title fields

2. **Document usage**
   - SEO-friendly identifiers

### Expected Outcome
- SlugField documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create fields.py File | File documented |
| 82 | Create MoneyField | Field documented |
| 83 | Create PercentageField | Field documented |
| 84 | Create PhoneNumberField | Field documented |
| 85 | Create SlugField with Auto | Field documented |

### Next Steps
- Continue with [03_Tasks-86-90_Utils-Exports.md](03_Tasks-86-90_Utils-Exports.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 81 through 85 in sequence
2. **LKR:** Use 2 decimals
3. **No Code Snippets:** Avoid fenced code blocks in documentation
