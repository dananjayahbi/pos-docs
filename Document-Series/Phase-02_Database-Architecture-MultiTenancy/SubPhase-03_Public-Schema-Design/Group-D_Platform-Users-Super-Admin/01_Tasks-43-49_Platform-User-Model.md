# Tasks 43-49: Platform User Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** D - Platform Users & Super Admin  
> **Document:** 01 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Platform-Settings-Model/](../Group-C_Platform-Settings-Model/)
- **→ Next Document:** [02_Tasks-50-54_Roles-Permissions-Admin.md](02_Tasks-50-54_Roles-Permissions-Admin.md)

---

## Document Overview

This document defines the platform user model and manager.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Create platform user model file | Medium |
| 44 | Create user manager | Medium |
| 45 | Add core user fields | Medium |
| 46 | Add staff/superuser flags | Medium |
| 47 | Set AUTH_USER_MODEL | Medium |
| 48 | Validate user model | Medium |
| 49 | Document platform user model | Medium |

---

## Task 43: Create platform user model file

### Overview
Create the platform user model module.

### Dependencies
- Group C completed

### Instructions

1. **Create `models/user.py`**
   - Place platform user model in platform app

2. **Document purpose**
   - Note platform users are distinct from tenant users

### Expected Outcome
- Platform user model file created

### Verification Checklist
- [ ] User model file exists
- [ ] Purpose documented

---

## Task 44: Create user manager

### Overview
Create a custom user manager for platform users.

### Dependencies
- Task 43: Create platform user model file

### Instructions

1. **Create `models/managers.py`**
   - Add manager for platform user creation

2. **Document usage**
   - Note creation requirements and defaults

### Expected Outcome
- Platform user manager created

### Verification Checklist
- [ ] User manager file exists
- [ ] Usage documented

---

## Task 45: Add core user fields

### Overview
Add core identity fields for platform users.

### Dependencies
- Task 44: Create user manager

### Instructions

1. **Add identity fields**
   - Include email, name, and contact fields

2. **Document fields**
   - Note +94 phone format requirement

### Expected Outcome
- Core user fields defined

### Verification Checklist
- [ ] Identity fields defined
- [ ] Phone format documented

---

## Task 46: Add staff/superuser flags

### Overview
Add staff and superuser flags for platform admin access.

### Dependencies
- Task 45: Add core user fields

### Instructions

1. **Add access flags**
   - Include is_staff and is_superuser

2. **Document usage**
   - Note platform admin permissions

### Expected Outcome
- Access flags defined

### Verification Checklist
- [ ] Access flags defined
- [ ] Usage documented

---

## Task 47: Set AUTH_USER_MODEL

### Overview
Set the platform user model as AUTH_USER_MODEL before migrations.

### Dependencies
- Task 46: Add staff/superuser flags

### Instructions

1. **Set AUTH_USER_MODEL**
   - Update base settings before migrations

2. **Document caution**
   - Note it must be set before initial migrate

### Expected Outcome
- AUTH_USER_MODEL configured

### Verification Checklist
- [ ] AUTH_USER_MODEL set
- [ ] Caution documented

---

## Task 48: Validate user model

### Overview
Validate platform user model fields and behavior.

### Dependencies
- Task 47: Set AUTH_USER_MODEL

### Instructions

1. **Review user model**
   - Ensure required fields are present

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Platform user model validated

### Verification Checklist
- [ ] User model validated
- [ ] Validation record documented

---

## Task 49: Document platform user model

### Overview
Document platform user model in user hierarchy docs.

### Dependencies
- Task 48: Validate user model

### Instructions

1. **Update `docs/users/user-hierarchy.md`**
   - Document platform user roles and separation

2. **Link documentation**
   - Add links from docs index

### Expected Outcome
- Platform user documentation updated

### Verification Checklist
- [ ] User hierarchy doc updated
- [ ] Links added

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 43 | Create platform user model file | User model file created |
| 44 | Create user manager | User manager created |
| 45 | Add core user fields | Core fields defined |
| 46 | Add staff/superuser flags | Access flags defined |
| 47 | Set AUTH_USER_MODEL | AUTH_USER_MODEL set |
| 48 | Validate user model | User model validated |
| 49 | Document platform user model | User hierarchy doc updated |

### Next Steps
- Continue with [02_Tasks-50-54_Roles-Permissions-Admin.md](02_Tasks-50-54_Roles-Permissions-Admin.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 43 through 49 in sequence
2. **Auth Model:** Set AUTH_USER_MODEL before initial migrations
3. **No Code Snippets:** Avoid fenced code blocks in documentation
