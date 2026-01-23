# Tasks 33-40: Settings & Lifetimes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** C - JWT Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_User-Manager-Signals/](../Group-B_User-Manager-Signals/)
- **→ Next Document:** [02_Tasks-41-48_Claims-Serializer-Docs.md](02_Tasks-41-48_Claims-Serializer-Docs.md)

---

## Document Overview

This document establishes JWT settings, token lifetimes, rotation, and signing configuration for authentication.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create JWT Settings File | Simple |
| 34 | Configure SIMPLE_JWT | Medium |
| 35 | Set ACCESS_TOKEN_LIFETIME | Simple |
| 36 | Set REFRESH_TOKEN_LIFETIME | Simple |
| 37 | Set ROTATE_REFRESH_TOKENS | Simple |
| 38 | Set BLACKLIST_AFTER_ROTATION | Simple |
| 39 | Set UPDATE_LAST_LOGIN | Simple |
| 40 | Configure SIGNING_KEY | Simple |

---

## Task 33: Create JWT Settings File

### Overview
Create the settings file dedicated to JWT configuration.

### Dependencies
- Task 32: Generate User Migrations

### Instructions

1. **Create JWT settings file**
   - Place it under backend/config/settings

2. **Document scope**
   - Isolate JWT settings from base settings

### Expected Outcome
- JWT settings file documented

### Verification Checklist
- [ ] File documented
- [ ] Scope noted

---

## Task 34: Configure SIMPLE_JWT

### Overview
Add the SIMPLE_JWT configuration dictionary.

### Dependencies
- Task 33: Create JWT Settings File

### Instructions

1. **Define SIMPLE_JWT structure**
   - Include core JWT keys

2. **Document ownership**
   - Centralized token configuration

### Expected Outcome
- SIMPLE_JWT documented

### Verification Checklist
- [ ] Structure documented
- [ ] Ownership noted

---

## Task 35: Set ACCESS_TOKEN_LIFETIME

### Overview
Define the access token lifetime.

### Dependencies
- Task 34: Configure SIMPLE_JWT

### Instructions

1. **Set access token lifetime**
   - Use 15 minutes as standard

2. **Document rationale**
   - Short-lived access tokens reduce risk

### Expected Outcome
- Access token lifetime documented

### Verification Checklist
- [ ] Lifetime documented
- [ ] Rationale noted

---

## Task 36: Set REFRESH_TOKEN_LIFETIME

### Overview
Define the refresh token lifetime.

### Dependencies
- Task 35: Set ACCESS_TOKEN_LIFETIME

### Instructions

1. **Set refresh token lifetime**
   - Use 7 days as standard

2. **Document rationale**
   - Balance security and usability

### Expected Outcome
- Refresh token lifetime documented

### Verification Checklist
- [ ] Lifetime documented
- [ ] Rationale noted

---

## Task 37: Set ROTATE_REFRESH_TOKENS

### Overview
Enable refresh token rotation to reduce token reuse risk.

### Dependencies
- Task 36: Set REFRESH_TOKEN_LIFETIME

### Instructions

1. **Enable rotation**
   - Issue a new refresh token on use

2. **Document behavior**
   - Old token becomes invalid after rotation

### Expected Outcome
- Rotation setting documented

### Verification Checklist
- [ ] Rotation documented
- [ ] Behavior noted

---

## Task 38: Set BLACKLIST_AFTER_ROTATION

### Overview
Enable blacklisting after refresh token rotation.

### Dependencies
- Task 37: Set ROTATE_REFRESH_TOKENS

### Instructions

1. **Enable blacklisting**
   - Ensure rotated tokens cannot be reused

2. **Document dependency**
   - Requires blacklist app configuration

### Expected Outcome
- Blacklist behavior documented

### Verification Checklist
- [ ] Blacklisting documented
- [ ] Dependency noted

---

## Task 39: Set UPDATE_LAST_LOGIN

### Overview
Update the last_login field on authentication.

### Dependencies
- Task 38: Set BLACKLIST_AFTER_ROTATION

### Instructions

1. **Enable last_login updates**
   - Track latest successful login

2. **Document usage**
   - Supports auditing and security reviews

### Expected Outcome
- last_login updates documented

### Verification Checklist
- [ ] Update setting documented
- [ ] Usage noted

---

## Task 40: Configure SIGNING_KEY

### Overview
Set the signing key used to issue JWTs.

### Dependencies
- Task 39: Set UPDATE_LAST_LOGIN

### Instructions

1. **Set signing key source**
   - Use the secure application secret

2. **Document security**
   - Key must remain private

### Expected Outcome
- Signing key documented

### Verification Checklist
- [ ] Key source documented
- [ ] Security noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Create JWT Settings File | File documented |
| 34 | Configure SIMPLE_JWT | Structure documented |
| 35 | Set ACCESS_TOKEN_LIFETIME | Lifetime documented |
| 36 | Set REFRESH_TOKEN_LIFETIME | Lifetime documented |
| 37 | Set ROTATE_REFRESH_TOKENS | Rotation documented |
| 38 | Set BLACKLIST_AFTER_ROTATION | Blacklist documented |
| 39 | Set UPDATE_LAST_LOGIN | Setting documented |
| 40 | Configure SIGNING_KEY | Key documented |

### Next Steps
- Continue with [02_Tasks-41-48_Claims-Serializer-Docs.md](02_Tasks-41-48_Claims-Serializer-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 33 through 40 in sequence
2. **Token Lifetimes:** 15 minutes access, 7 days refresh
3. **Rotation:** Enable rotation and blacklisting together
4. **No Code Snippets:** Avoid fenced code blocks in documentation
