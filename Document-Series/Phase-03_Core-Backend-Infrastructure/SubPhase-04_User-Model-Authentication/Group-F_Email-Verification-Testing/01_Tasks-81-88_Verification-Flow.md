# Tasks 81-88: Verification Flow

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** F - Email Verification & Testing  
> **Document:** 01 of 03  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Password-Reset-Flow/](../Group-E_Password-Reset-Flow/)
- **→ Next Document:** [02_Tasks-89-92_Admin-Model-Tests.md](02_Tasks-89-92_Admin-Model-Tests.md)

---

## Document Overview

This document introduces email verification tokens, the verification email service and template, and the verification endpoints.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create EmailVerificationToken Model | Medium |
| 82 | Add Verification Fields | Simple |
| 83 | Create VerificationEmailService | Medium |
| 84 | Create Verification Email Template | Simple |
| 85 | Create EmailVerificationView | Medium |
| 86 | Create ResendVerificationView | Medium |
| 87 | Add verify-email/ Endpoint | Simple |
| 88 | Add resend-verification/ Endpoint | Simple |

---

## Task 81: Create EmailVerificationToken Model

### Overview
Create the model that stores email verification tokens.

### Dependencies
- Task 80: Document Password Reset

### Instructions

1. **Define verification token model**
   - Track token, expiry, and usage

2. **Document purpose**
   - Confirms email ownership

### Expected Outcome
- EmailVerificationToken model documented

### Verification Checklist
- [ ] Model documented
- [ ] Purpose noted

---

## Task 82: Add Verification Fields

### Overview
Add core fields required for verification tokens.

### Dependencies
- Task 81: Create EmailVerificationToken Model

### Instructions

1. **Add token, expiry, and used fields**
   - Token must be unique and indexed

2. **Document defaults**
   - Default expiry set to 7 days

### Expected Outcome
- Verification fields documented

### Verification Checklist
- [ ] Fields documented
- [ ] Defaults noted

---

## Task 83: Create VerificationEmailService

### Overview
Create the email service method for verification emails.

### Dependencies
- Task 82: Add Verification Fields

### Instructions

1. **Add verification email service**
   - Centralize verification sending logic

2. **Document configuration**
   - Uses frontend URL and sender settings

### Expected Outcome
- Verification email service documented

### Verification Checklist
- [ ] Service documented
- [ ] Configuration noted

---

## Task 84: Create Verification Email Template

### Overview
Create the HTML template for verification emails.

### Dependencies
- Task 83: Create VerificationEmailService

### Instructions

1. **Create verification template**
   - Include verification link and expiry details

2. **Document tone**
   - Clear, actionable, and secure

### Expected Outcome
- Verification template documented

### Verification Checklist
- [ ] Template documented
- [ ] Tone noted

---

## Task 85: Create EmailVerificationView

### Overview
Create the endpoint view that verifies email tokens.

### Dependencies
- Task 84: Create Verification Email Template

### Instructions

1. **Define verification view**
   - Validate token and mark verified

2. **Document outcomes**
   - Update is_verified status

### Expected Outcome
- Verification view documented

### Verification Checklist
- [ ] View documented
- [ ] Outcomes noted

---

## Task 86: Create ResendVerificationView

### Overview
Create the endpoint view that resends verification emails.

### Dependencies
- Task 85: Create EmailVerificationView

### Instructions

1. **Define resend view**
   - Issue new token for unverified users

2. **Document guardrails**
   - Prevent resending for verified users

### Expected Outcome
- Resend view documented

### Verification Checklist
- [ ] View documented
- [ ] Guardrails noted

---

## Task 87: Add verify-email/ Endpoint

### Overview
Add the verify email endpoint to auth URLs.

### Dependencies
- Task 86: Create ResendVerificationView

### Instructions

1. **Add verify-email route**
   - Point to verification view

2. **Document access**
   - Public endpoint with token input

### Expected Outcome
- verify-email endpoint documented

### Verification Checklist
- [ ] Endpoint documented
- [ ] Access noted

---

## Task 88: Add resend-verification/ Endpoint

### Overview
Add the resend verification endpoint to auth URLs.

### Dependencies
- Task 87: Add verify-email/ Endpoint

### Instructions

1. **Add resend-verification route**
   - Point to resend view

2. **Document access**
   - Requires authenticated user

### Expected Outcome
- resend-verification endpoint documented

### Verification Checklist
- [ ] Endpoint documented
- [ ] Access noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create EmailVerificationToken Model | Model documented |
| 82 | Add Verification Fields | Fields documented |
| 83 | Create VerificationEmailService | Service documented |
| 84 | Create Verification Email Template | Template documented |
| 85 | Create EmailVerificationView | View documented |
| 86 | Create ResendVerificationView | View documented |
| 87 | Add verify-email/ Endpoint | Endpoint documented |
| 88 | Add resend-verification/ Endpoint | Endpoint documented |

### Next Steps
- Continue with [02_Tasks-89-92_Admin-Model-Tests.md](02_Tasks-89-92_Admin-Model-Tests.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 81 through 88 in sequence
2. **Expiry:** Default verification token expiry is 7 days
3. **Access Control:** Keep resend endpoint authenticated
4. **No Code Snippets:** Avoid fenced code blocks in documentation
