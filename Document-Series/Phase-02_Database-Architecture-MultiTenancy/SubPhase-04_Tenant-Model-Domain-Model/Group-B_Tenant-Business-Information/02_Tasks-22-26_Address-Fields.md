# Tasks 22-26: Address Fields

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** B - Tenant Business Information  
> **Document:** 02 of 03  
> **Tasks Covered:** 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-21_Business-Type-Contact.md](01_Tasks-17-21_Business-Type-Contact.md)
- **→ Next Document:** [03_Tasks-27-30_Branding-Localization.md](03_Tasks-27-30_Branding-Localization.md)

---

## Document Overview

This document adds tenant address fields and Sri Lanka-specific location data.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 22 | Add address line fields | Medium |
| 23 | Add city and district fields | Medium |
| 24 | Add province field | Medium |
| 25 | Add postal code field | Medium |
| 26 | Validate address fields | Medium |

---

## Task 22: Add address line fields

### Overview
Add primary address line fields for tenants.

### Dependencies
- Task 21: Validate business info fields

### Instructions

1. **Add address fields**
   - Include address line 1 and 2

2. **Document usage**
   - Note usage for billing and legal docs

### Expected Outcome
- Address line fields defined

### Verification Checklist
- [ ] Address line fields defined
- [ ] Usage documented

---

## Task 23: Add city and district fields

### Overview
Add city and district location fields.

### Dependencies
- Task 22: Add address line fields

### Instructions

1. **Add city and district fields**
   - Include standard Sri Lanka city/district naming

2. **Document usage**
   - Note usage in regional reporting

### Expected Outcome
- City and district fields defined

### Verification Checklist
- [ ] City and district fields defined
- [ ] Usage documented

---

## Task 24: Add province field

### Overview
Add province field aligned to Sri Lankan provinces.

### Dependencies
- Task 23: Add city and district fields

### Instructions

1. **Add province field**
   - Use Sri Lanka province list

2. **Document validation**
   - Note allowed values

### Expected Outcome
- Province field defined

### Verification Checklist
- [ ] Province field defined
- [ ] Allowed values documented

---

## Task 25: Add postal code field

### Overview
Add postal code field for tenant addresses.

### Dependencies
- Task 24: Add province field

### Instructions

1. **Add postal code field**
   - Include postal/ZIP field

2. **Document format**
   - Note expected Sri Lanka postal format

### Expected Outcome
- Postal code field defined

### Verification Checklist
- [ ] Postal code field defined
- [ ] Format documented

---

## Task 26: Validate address fields

### Overview
Validate address fields for completeness and accuracy.

### Dependencies
- Task 25: Add postal code field

### Instructions

1. **Review address fields**
   - Ensure all address fields are present

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Address fields validated

### Verification Checklist
- [ ] Address fields validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 22 | Add address line fields | Address lines added |
| 23 | Add city and district fields | City/district added |
| 24 | Add province field | Province added |
| 25 | Add postal code field | Postal code added |
| 26 | Validate address fields | Address validation recorded |

### Next Steps
- Continue with [03_Tasks-27-30_Branding-Localization.md](03_Tasks-27-30_Branding-Localization.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 22 through 26 in sequence
2. **Localization:** Use Sri Lanka province list and formats
3. **No Code Snippets:** Avoid fenced code blocks in documentation
