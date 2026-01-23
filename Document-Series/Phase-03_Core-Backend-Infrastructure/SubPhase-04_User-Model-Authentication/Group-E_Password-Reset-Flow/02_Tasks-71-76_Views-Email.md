# Tasks 71-76: Views & Email

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 04 - User Model & Authentication  
> **Group:** E - Password Reset Flow  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-70_Token-Model.md](01_Tasks-65-70_Token-Model.md)
- **→ Next Document:** [03_Tasks-77-80_URLs-Validation-Docs.md](03_Tasks-77-80_URLs-Validation-Docs.md)

---

## Document Overview

This document adds serializers, views, and email service components for password reset requests and confirmations.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Create PasswordResetRequestSerializer | Medium |
| 72 | Create PasswordResetConfirmSerializer | Medium |
| 73 | Create PasswordResetRequestView | Medium |
| 74 | Create PasswordResetConfirmView | Medium |
| 75 | Create Email Service | Medium |
| 76 | Create Reset Email Template | Simple |

---

## Task 71: Create PasswordResetRequestSerializer

### Overview
Create the serializer for reset requests.

### Dependencies
- Task 70: Create Token Generation Utility

### Instructions

1. **Define request serializer**
   - Accept email input

2. **Document validation**
   - Confirm the user exists before issuing token

### Expected Outcome
- Request serializer documented

### Verification Checklist
- [ ] Serializer documented
- [ ] Validation noted

---

## Task 72: Create PasswordResetConfirmSerializer

### Overview
Create the serializer for reset confirmation.

### Dependencies
- Task 71: Create PasswordResetRequestSerializer

### Instructions

1. **Define confirm serializer**
   - Accept token and new password

2. **Document validation**
   - Require valid, unused, unexpired token

### Expected Outcome
- Confirm serializer documented

### Verification Checklist
- [ ] Serializer documented
- [ ] Validation noted

---

## Task 73: Create PasswordResetRequestView

### Overview
Create the view that handles reset requests.

### Dependencies
- Task 72: Create PasswordResetConfirmSerializer

### Instructions

1. **Define request view**
   - Create token and trigger email

2. **Document response**
   - Return generic success response

### Expected Outcome
- Request view documented

### Verification Checklist
- [ ] View documented
- [ ] Response noted

---

## Task 74: Create PasswordResetConfirmView

### Overview
Create the view that confirms password resets.

### Dependencies
- Task 73: Create PasswordResetRequestView

### Instructions

1. **Define confirm view**
   - Validate token and set new password

2. **Document token invalidation**
   - Mark token as used after success

### Expected Outcome
- Confirm view documented

### Verification Checklist
- [ ] View documented
- [ ] Invalidation noted

---

## Task 75: Create Email Service

### Overview
Create an email service to deliver reset messages.

### Dependencies
- Task 74: Create PasswordResetConfirmView

### Instructions

1. **Define email service**
   - Centralize email sending logic

2. **Document configuration**
   - Use configured sender and frontend URL

### Expected Outcome
- Email service documented

### Verification Checklist
- [ ] Service documented
- [ ] Configuration noted

---

## Task 76: Create Reset Email Template

### Overview
Create the reset email template for user notifications.

### Dependencies
- Task 75: Create Email Service

### Instructions

1. **Create template**
   - Provide reset link and expiry info

2. **Document tone**
   - Clear, concise, and security-aware

### Expected Outcome
- Email template documented

### Verification Checklist
- [ ] Template documented
- [ ] Tone noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 71 | Create PasswordResetRequestSerializer | Serializer documented |
| 72 | Create PasswordResetConfirmSerializer | Serializer documented |
| 73 | Create PasswordResetRequestView | View documented |
| 74 | Create PasswordResetConfirmView | View documented |
| 75 | Create Email Service | Service documented |
| 76 | Create Reset Email Template | Template documented |

### Next Steps
- Continue with [03_Tasks-77-80_URLs-Validation-Docs.md](03_Tasks-77-80_URLs-Validation-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 71 through 76 in sequence
2. **Security:** Do not leak whether emails exist
3. **Token Handling:** Always validate and invalidate tokens
4. **No Code Snippets:** Avoid fenced code blocks in documentation
