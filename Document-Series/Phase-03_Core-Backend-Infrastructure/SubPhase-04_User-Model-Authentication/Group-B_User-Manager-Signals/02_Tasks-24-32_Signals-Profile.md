# Tasks 24-32: Signals & Profile

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** B - User Manager & Signals  
> **Document:** 02 of 02  
> **Tasks Covered:** 24, 25, 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-23_Manager-Methods.md](01_Tasks-17-23_Manager-Methods.md)
- **→ Next Group:** [../Group-C_JWT-Configuration/](../Group-C_JWT-Configuration/)

---

## Document Overview

This document adds user-related signals, a user profile model, and prepares migrations for the users app.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Create User Signals File | Simple |
| 25 | Create post_save Signal | Medium |
| 26 | Add Profile Creation Signal | Medium |
| 27 | Connect Signals in apps.py | Simple |
| 28 | Create UserProfile Model | Medium |
| 29 | Add phone_number Field | Simple |
| 30 | Add avatar Field | Simple |
| 31 | Add timezone Field | Simple |
| 32 | Generate User Migrations | Simple |

---

## Task 24: Create User Signals File

### Overview
Create the signals module for user-related event handling.

### Dependencies
- Task 23: Update AUTH_USER_MODEL

### Instructions

1. **Create signals file**
   - Place it under backend/apps/users

2. **Document purpose**
   - Host user post-save behaviors

### Expected Outcome
- Signals file documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 25: Create post_save Signal

### Overview
Define a post-save signal handler for user creation events.

### Dependencies
- Task 24: Create User Signals File

### Instructions

1. **Define post-save handling**
   - Trigger on user creation

2. **Document intent**
   - Enable automatic profile creation

### Expected Outcome
- post-save behavior documented

### Verification Checklist
- [ ] Signal documented
- [ ] Intent noted

---

## Task 26: Add Profile Creation Signal

### Overview
Add logic to create a UserProfile when a User is created.

### Dependencies
- Task 25: Create post_save Signal

### Instructions

1. **Create profile on user creation**
   - Ensure it only runs for new users

2. **Document idempotency**
   - Avoid duplicates

### Expected Outcome
- Profile creation documented

### Verification Checklist
- [ ] Profile creation documented
- [ ] Idempotency noted

---

## Task 27: Connect Signals in apps.py

### Overview
Ensure signals are connected during app startup.

### Dependencies
- Task 26: Add Profile Creation Signal

### Instructions

1. **Wire signals in app config**
   - Load signals on app ready

2. **Document location**
   - AppConfig is the single connection point

### Expected Outcome
- Signal connection documented

### Verification Checklist
- [ ] Connection documented
- [ ] Location noted

---

## Task 28: Create UserProfile Model

### Overview
Create a UserProfile model for extended user details.

### Dependencies
- Task 27: Connect Signals in apps.py

### Instructions

1. **Define UserProfile model**
   - Link to User with one-to-one relationship

2. **Document relationship**
   - One profile per user

### Expected Outcome
- UserProfile model documented

### Verification Checklist
- [ ] Model documented
- [ ] Relationship noted

---

## Task 29: Add phone_number Field

### Overview
Add a phone number field to the user profile.

### Dependencies
- Task 28: Create UserProfile Model

### Instructions

1. **Add phone_number field**
   - Support Sri Lankan format: +94 XX XXX XXXX

2. **Document validation intent**
   - Ensure consistent formatting

### Expected Outcome
- phone_number field documented

### Verification Checklist
- [ ] Field documented
- [ ] Format noted

---

## Task 30: Add avatar Field

### Overview
Add an optional avatar field for profile images.

### Dependencies
- Task 29: Add phone_number Field

### Instructions

1. **Add avatar field**
   - Optional image file

2. **Document usage**
   - For profile display and branding

### Expected Outcome
- avatar field documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 31: Add timezone Field

### Overview
Add a timezone field to store the user’s preferred time zone.

### Dependencies
- Task 30: Add avatar Field

### Instructions

1. **Add timezone field**
   - Default to Asia/Colombo

2. **Document usage**
   - Used in scheduling and timestamps

### Expected Outcome
- timezone field documented

### Verification Checklist
- [ ] Field documented
- [ ] Default noted

---

## Task 32: Generate User Migrations

### Overview
Create initial migrations for the users app.

### Dependencies
- Task 31: Add timezone Field

### Instructions

1. **Prepare initial migrations**
   - Include User and UserProfile models

2. **Document migration order**
   - Ensure AUTH_USER_MODEL is configured first

### Expected Outcome
- Migrations documented

### Verification Checklist
- [ ] Migrations documented
- [ ] Order noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 24 | Create User Signals File | File documented |
| 25 | Create post_save Signal | Signal documented |
| 26 | Add Profile Creation Signal | Behavior documented |
| 27 | Connect Signals in apps.py | Connection documented |
| 28 | Create UserProfile Model | Model documented |
| 29 | Add phone_number Field | Field documented |
| 30 | Add avatar Field | Field documented |
| 31 | Add timezone Field | Field documented |
| 32 | Generate User Migrations | Migration plan documented |

### Next Steps
- Proceed to Group C: [../Group-C_JWT-Configuration/](../Group-C_JWT-Configuration/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 24 through 32 in sequence
2. **Signal Wiring:** Use AppConfig to connect signals
3. **Sri Lanka Defaults:** Phone format and Asia/Colombo timezone
4. **No Code Snippets:** Avoid fenced code blocks in documentation
