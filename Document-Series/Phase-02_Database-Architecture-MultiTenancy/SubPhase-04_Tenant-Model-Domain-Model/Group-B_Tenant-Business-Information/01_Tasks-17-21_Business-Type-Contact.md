# Tasks 17-21: Business Type & Contact

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** B - Tenant Business Information  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Tenant-Model-Foundation/](../Group-A_Tenant-Model-Foundation/)
- **→ Next Document:** [02_Tasks-22-26_Address-Fields.md](02_Tasks-22-26_Address-Fields.md)

---

## Document Overview

This document adds business identity and contact fields to the tenant model.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Add business type field | Medium |
| 18 | Add industry classification | Medium |
| 19 | Add BR number field | Medium |
| 20 | Add primary contact fields | Medium |
| 21 | Validate business info fields | Medium |

---

## Task 17: Add business type field

### Overview
Add a field for tenant business type.

### Dependencies
- Task 16: Validate manager behavior

### Instructions

1. **Add business type field**
   - Define allowable business types

2. **Document usage**
   - Note how the field is used in onboarding

### Expected Outcome
- Business type field defined

### Verification Checklist
- [ ] Business type field defined
- [ ] Usage documented

---

## Task 18: Add industry classification

### Overview
Add an industry or category classification field.

### Dependencies
- Task 17: Add business type field

### Instructions

1. **Add industry field**
   - Use standardized categories

2. **Document usage**
   - Note reporting and analytics usage

### Expected Outcome
- Industry field defined

### Verification Checklist
- [ ] Industry field defined
- [ ] Usage documented

---

## Task 19: Add BR number field

### Overview
Add a business registration number field.

### Dependencies
- Task 18: Add industry classification

### Instructions

1. **Add BR number field**
   - Store Sri Lanka BRN format

2. **Document validation**
   - Note format and validation rules

### Expected Outcome
- BR number field defined

### Verification Checklist
- [ ] BR number field defined
- [ ] Validation documented

---

## Task 20: Add primary contact fields

### Overview
Add primary contact details for the tenant.

### Dependencies
- Task 19: Add BR number field

### Instructions

1. **Add contact fields**
   - Include contact name, email, and phone

2. **Document phone format**
   - Use +94 XX XXX XXXX format

### Expected Outcome
- Primary contact fields defined

### Verification Checklist
- [ ] Contact fields defined
- [ ] Phone format documented

---

## Task 21: Validate business info fields

### Overview
Validate business information fields for completeness.

### Dependencies
- Task 20: Add primary contact fields

### Instructions

1. **Review fields**
   - Ensure all business info fields are present

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Business info fields validated

### Verification Checklist
- [ ] Business info fields validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Add business type field | Business type added |
| 18 | Add industry classification | Industry field added |
| 19 | Add BR number field | BR number added |
| 20 | Add primary contact fields | Contact fields added |
| 21 | Validate business info fields | Validation recorded |

### Next Steps
- Continue with [02_Tasks-22-26_Address-Fields.md](02_Tasks-22-26_Address-Fields.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 17 through 21 in sequence
2. **Localization:** Use Sri Lanka BR and phone formats
3. **No Code Snippets:** Avoid fenced code blocks in documentation
