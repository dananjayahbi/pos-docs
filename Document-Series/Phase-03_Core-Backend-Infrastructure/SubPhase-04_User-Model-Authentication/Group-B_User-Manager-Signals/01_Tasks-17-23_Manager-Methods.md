# Tasks 17-23: Manager Methods

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** B - User Manager & Signals  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_User-Model-Foundation/](../Group-A_User-Model-Foundation/)
- **→ Next Document:** [02_Tasks-24-32_Signals-Profile.md](02_Tasks-24-32_Signals-Profile.md)

---

## Document Overview

This document creates the custom user manager and defines the creation methods required for regular users and superusers.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Create UserManager File | Simple |
| 18 | Create UserManager Class | Medium |
| 19 | Implement create_user | Medium |
| 20 | Implement create_superuser | Medium |
| 21 | Add email Normalization | Simple |
| 22 | Assign Manager to User | Simple |
| 23 | Update AUTH_USER_MODEL | Simple |

---

## Task 17: Create UserManager File

### Overview
Create the managers file that will house the custom UserManager.

### Dependencies
- Task 16: Add __str__ Method

### Instructions

1. **Create the managers file**
   - Place it under backend/apps/users

2. **Document purpose**
   - Identify it as the location for the user manager

### Expected Outcome
- Managers file documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 18: Create UserManager Class

### Overview
Define the UserManager class used by the custom User model.

### Dependencies
- Task 17: Create UserManager File

### Instructions

1. **Define the UserManager class**
   - Base on Django’s base manager

2. **Document responsibilities**
   - User creation and normalization

### Expected Outcome
- UserManager class documented

### Verification Checklist
- [ ] Class documented
- [ ] Responsibilities noted

---

## Task 19: Implement create_user

### Overview
Add the method used to create a standard user.

### Dependencies
- Task 18: Create UserManager Class

### Instructions

1. **Define create_user**
   - Require email and password inputs

2. **Document required fields**
   - Email is mandatory for creation

### Expected Outcome
- create_user method documented

### Verification Checklist
- [ ] Method documented
- [ ] Requirements noted

---

## Task 20: Implement create_superuser

### Overview
Add the method used to create a superuser.

### Dependencies
- Task 19: Implement create_user

### Instructions

1. **Define create_superuser**
   - Set staff and superuser flags

2. **Document validation rules**
   - Prevent misconfigured superusers

### Expected Outcome
- create_superuser method documented

### Verification Checklist
- [ ] Method documented
- [ ] Validation rules noted

---

## Task 21: Add email Normalization

### Overview
Normalize email values before saving.

### Dependencies
- Task 20: Implement create_superuser

### Instructions

1. **Normalize email input**
   - Use the standard normalization helper

2. **Document behavior**
   - Ensures consistent casing and formatting

### Expected Outcome
- Email normalization documented

### Verification Checklist
- [ ] Normalization documented
- [ ] Behavior noted

---

## Task 22: Assign Manager to User

### Overview
Attach the custom manager to the User model.

### Dependencies
- Task 21: Add email Normalization

### Instructions

1. **Assign the manager**
   - Configure the User model to use UserManager

2. **Document impact**
   - All user creation routes through manager

### Expected Outcome
- Manager assignment documented

### Verification Checklist
- [ ] Assignment documented
- [ ] Impact noted

---

## Task 23: Update AUTH_USER_MODEL

### Overview
Update Django settings to use the custom User model.

### Dependencies
- Task 22: Assign Manager to User

### Instructions

1. **Set AUTH_USER_MODEL**
   - Point to the users app model

2. **Document timing**
   - Must be set before initial migrations

### Expected Outcome
- AUTH_USER_MODEL documented

### Verification Checklist
- [ ] Setting documented
- [ ] Timing noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Create UserManager File | File documented |
| 18 | Create UserManager Class | Class documented |
| 19 | Implement create_user | Method documented |
| 20 | Implement create_superuser | Method documented |
| 21 | Add email Normalization | Behavior documented |
| 22 | Assign Manager to User | Assignment documented |
| 23 | Update AUTH_USER_MODEL | Setting documented |

### Next Steps
- Continue with [02_Tasks-24-32_Signals-Profile.md](02_Tasks-24-32_Signals-Profile.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 17 through 23 in sequence
2. **AUTH_USER_MODEL:** Set prior to initial migrations
3. **Normalization:** Email normalization is mandatory
4. **No Code Snippets:** Avoid fenced code blocks in documentation
