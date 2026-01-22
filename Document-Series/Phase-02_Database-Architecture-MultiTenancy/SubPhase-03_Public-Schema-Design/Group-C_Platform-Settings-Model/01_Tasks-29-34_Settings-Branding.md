# Tasks 29-34: Settings & Branding

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** C - Platform Settings Model  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Subscription-Plans-Model/](../Group-B_Subscription-Plans-Model/)
- **→ Next Document:** [02_Tasks-35-38_Settings-Features.md](02_Tasks-35-38_Settings-Features.md)

---

## Document Overview

This document defines the platform settings model and branding fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create settings model file | Medium |
| 30 | Add branding fields | Medium |
| 31 | Add contact fields | Medium |
| 32 | Add localization fields | Medium |
| 33 | Define singleton behavior | Medium |
| 34 | Validate settings model | Medium |

---

## Task 29: Create settings model file

### Overview
Create the platform settings model module.

### Dependencies
- Group B completed

### Instructions

1. **Create `models/settings.py`**
   - Place settings model in platform app

2. **Document purpose**
   - Note settings are public schema singleton

### Expected Outcome
- Settings model file created

### Verification Checklist
- [ ] Settings model file exists
- [ ] Purpose documented

---

## Task 30: Add branding fields

### Overview
Add branding fields for platform identity.

### Dependencies
- Task 29: Create settings model file

### Instructions

1. **Add branding fields**
   - Include platform name, logo URL, and primary color

2. **Document usage**
   - Note how branding is applied across UI

### Expected Outcome
- Branding fields defined

### Verification Checklist
- [ ] Branding fields defined
- [ ] Usage documented

---

## Task 31: Add contact fields

### Overview
Add contact information fields for platform settings.

### Dependencies
- Task 30: Add branding fields

### Instructions

1. **Add contact fields**
   - Include support email and phone in +94 format

2. **Document usage**
   - Note how contact fields are displayed

### Expected Outcome
- Contact fields defined

### Verification Checklist
- [ ] Contact fields defined
- [ ] Usage documented

---

## Task 32: Add localization fields

### Overview
Add localization fields for Sri Lanka context.

### Dependencies
- Task 31: Add contact fields

### Instructions

1. **Add localization fields**
   - Include timezone and default currency

2. **Document defaults**
   - Use Asia/Colombo and LKR (₨)

### Expected Outcome
- Localization fields defined

### Verification Checklist
- [ ] Localization fields defined
- [ ] Defaults documented

---

## Task 33: Define singleton behavior

### Overview
Ensure only one settings row exists.

### Dependencies
- Task 32: Add localization fields

### Instructions

1. **Define singleton rule**
   - Document enforcement of a single row

2. **Document admin behavior**
   - Note how admin edits settings

### Expected Outcome
- Singleton behavior documented

### Verification Checklist
- [ ] Singleton rule documented
- [ ] Admin behavior documented

---

## Task 34: Validate settings model

### Overview
Validate settings model fields and constraints.

### Dependencies
- Task 33: Define singleton behavior

### Instructions

1. **Review settings fields**
   - Ensure required fields are present

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Settings model validated

### Verification Checklist
- [ ] Settings model validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create settings model file | Settings model file created |
| 30 | Add branding fields | Branding fields defined |
| 31 | Add contact fields | Contact fields defined |
| 32 | Add localization fields | Localization fields defined |
| 33 | Define singleton behavior | Singleton behavior documented |
| 34 | Validate settings model | Settings model validated |

### Next Steps
- Continue with [02_Tasks-35-38_Settings-Features.md](02_Tasks-35-38_Settings-Features.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 34 in sequence
2. **Localization:** Use Asia/Colombo and LKR defaults
3. **No Code Snippets:** Avoid fenced code blocks in documentation
