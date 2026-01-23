# Tasks 30-36: Users App

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** C - Tenant & User Apps  
> **Document:** 02 of 02  
> **Tasks Covered:** 30, 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-23-29_Tenants-App.md](01_Tasks-23-29_Tenants-App.md)
- **→ Next Group:** [../Group-D_Product-Inventory-Apps/00_GROUP_OVERVIEW.md](../Group-D_Product-Inventory-Apps/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers users app directory setup, core files, admin and URL placeholders, and registration in settings.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 30 | Create users App Directory | Simple |
| 31 | Create users __init__.py | Simple |
| 32 | Create users apps.py | Simple |
| 33 | Create users models.py | Simple |
| 34 | Create users admin.py | Simple |
| 35 | Create users urls.py | Simple |
| 36 | Register users in Settings | Simple |

---

## Task 30: Create users App Directory

### Overview
Create the users app directory.

### Dependencies
- Task 29: Register tenants in Settings

### Instructions

1. **Create users directory**
   - Establish backend/apps/users

2. **Document purpose**
   - Users app holds custom user model

### Expected Outcome
- Users directory documented

### Verification Checklist
- [ ] Directory documented
- [ ] Purpose noted

---

## Task 31: Create users __init__.py

### Overview
Initialize the users app package.

### Dependencies
- Task 30: Create users App Directory

### Instructions

1. **Create __init__.py**
   - Enable module discovery

2. **Document usage**
   - Note package initialization

### Expected Outcome
- Users package documented

### Verification Checklist
- [ ] __init__.py documented
- [ ] Usage noted

---

## Task 32: Create users apps.py

### Overview
Create UsersConfig.

### Dependencies
- Task 31: Create users __init__.py

### Instructions

1. **Define app config**
   - Include app name and verbose name

2. **Document readiness**
   - Note future signal hooks

### Expected Outcome
- App config documented

### Verification Checklist
- [ ] Config documented
- [ ] Readiness noted

---

## Task 33: Create users models.py

### Overview
Create users models placeholder.

### Dependencies
- Task 32: Create users apps.py

### Instructions

1. **Define custom user placeholder**
   - Based on AbstractUser

2. **Document future extension**
   - Will be expanded in later subphases

### Expected Outcome
- Models placeholder documented

### Verification Checklist
- [ ] Placeholder documented
- [ ] Extension noted

---

## Task 34: Create users admin.py

### Overview
Create users admin configuration.

### Dependencies
- Task 33: Create users models.py

### Instructions

1. **Define admin placeholder**
   - Prepare for user model registration

2. **Document intent**
   - Note admin setup later

### Expected Outcome
- Admin placeholder documented

### Verification Checklist
- [ ] Placeholder documented
- [ ] Intent noted

---

## Task 35: Create users urls.py

### Overview
Create users URL placeholder.

### Dependencies
- Task 34: Create users admin.py

### Instructions

1. **Define URLs placeholder**
   - Prepare for user endpoints

2. **Document versioning**
   - Align with /api/v1/

### Expected Outcome
- URLs placeholder documented

### Verification Checklist
- [ ] URLs documented
- [ ] Versioning noted

---

## Task 36: Register users in Settings

### Overview
Register users app in settings.

### Dependencies
- Task 35: Create users urls.py

### Instructions

1. **Register users in TENANT_APPS**
   - Ensure per-tenant user data

2. **Document AUTH_USER_MODEL**
   - Note users.User registration

### Expected Outcome
- Users registration documented

### Verification Checklist
- [ ] Registration documented
- [ ] AUTH_USER_MODEL noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 30 | Create users App Directory | Directory documented |
| 31 | Create users __init__.py | Package documented |
| 32 | Create users apps.py | App config documented |
| 33 | Create users models.py | Placeholder documented |
| 34 | Create users admin.py | Admin placeholder documented |
| 35 | Create users urls.py | URLs documented |
| 36 | Register users in Settings | Registration documented |

### Next Steps
- Continue with Group D in [../Group-D_Product-Inventory-Apps/00_GROUP_OVERVIEW.md](../Group-D_Product-Inventory-Apps/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 30 through 36 in sequence
2. **Users:** Custom user model placeholder
3. **No Code Snippets:** Avoid fenced code blocks in documentation
