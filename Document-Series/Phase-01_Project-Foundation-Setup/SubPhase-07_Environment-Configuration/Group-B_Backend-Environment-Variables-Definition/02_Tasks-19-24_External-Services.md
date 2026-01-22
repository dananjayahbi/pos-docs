# Tasks 19-24: External Services

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** B - Backend Environment Variables Definition  
> **Document:** 02 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-18_Database-Cache.md](01_Tasks-15-18_Database-Cache.md)
- **→ Next Document:** [03_Tasks-25-30_API-App-Settings.md](03_Tasks-25-30_API-App-Settings.md)

---

## Document Overview

This document defines backend environment variables for external services and integrations.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Define SMTP configuration | Medium |
| 20 | Define AWS/S3 configuration | Medium |
| 21 | Define CORS settings | Simple |
| 22 | Define JWT settings | Medium |
| 23 | Define Sentry configuration | Simple |
| 24 | Define Stripe settings | Medium |

---

## Task 19: Define SMTP configuration

### Overview
Add environment variables for email delivery and notifications.

### Dependencies
- Task 18: Define CELERY_RESULT_BACKEND

### Instructions

1. **Add SMTP variables to `.env.example`**
   - Include host, port, username, password, and from address

2. **Document usage**
   - Specify which modules require SMTP settings

### Expected Outcome
- SMTP variables are defined and documented

### Verification Checklist
- [ ] SMTP variables are listed in `.env.example`
- [ ] SMTP usage is documented

---

## Task 20: Define AWS/S3 configuration

### Overview
Add environment variables for object storage and media handling.

### Dependencies
- Task 19: Define SMTP configuration

### Instructions

1. **Add AWS/S3 variables to `.env.example`**
   - Include access key, secret key, region, bucket name, and endpoint

2. **Document storage usage**
   - Indicate which storage backends rely on these variables

### Expected Outcome
- AWS/S3 variables are defined and documented

### Verification Checklist
- [ ] AWS/S3 variables are listed in `.env.example`
- [ ] Storage usage is documented

---

## Task 21: Define CORS settings

### Overview
Add environment variables for CORS configuration.

### Dependencies
- Task 20: Define AWS/S3 configuration

### Instructions

1. **Add CORS variables to `.env.example`**
   - Include allowed origins and allowed headers placeholders

2. **Document formats**
   - Specify list format and default behavior

### Expected Outcome
- CORS variables are defined and documented

### Verification Checklist
- [ ] CORS variables are listed in `.env.example`
- [ ] Formats are documented

---

## Task 22: Define JWT settings

### Overview
Add environment variables for token signing and expiration.

### Dependencies
- Task 21: Define CORS settings

### Instructions

1. **Add JWT variables to `.env.example`**
   - Include signing key and token lifetime placeholders

2. **Document security guidance**
   - Note rotation expectations for signing keys

### Expected Outcome
- JWT variables are defined and documented

### Verification Checklist
- [ ] JWT variables are listed in `.env.example`
- [ ] Rotation guidance is documented

---

## Task 23: Define Sentry configuration

### Overview
Add environment variables for error monitoring.

### Dependencies
- Task 22: Define JWT settings

### Instructions

1. **Add Sentry variables to `.env.example`**
   - Include DSN and environment name placeholders

2. **Document environment mapping**
   - Define which environments should report to Sentry

### Expected Outcome
- Sentry variables are defined and documented

### Verification Checklist
- [ ] Sentry variables are listed in `.env.example`
- [ ] Environment mapping is documented

---

## Task 24: Define Stripe settings

### Overview
Add environment variables for payment integration.

### Dependencies
- Task 23: Define Sentry configuration

### Instructions

1. **Add Stripe variables to `.env.example`**
   - Include secret key and webhook secret placeholders

2. **Document usage scope**
   - Clarify which services require Stripe settings

### Expected Outcome
- Stripe variables are defined and documented

### Verification Checklist
- [ ] Stripe variables are listed in `.env.example`
- [ ] Usage scope is documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Define SMTP configuration | SMTP variables documented |
| 20 | Define AWS/S3 configuration | Storage variables documented |
| 21 | Define CORS settings | CORS variables documented |
| 22 | Define JWT settings | JWT variables documented |
| 23 | Define Sentry configuration | Sentry variables documented |
| 24 | Define Stripe settings | Stripe variables documented |

### Next Steps
- Continue with [03_Tasks-25-30_API-App-Settings.md](03_Tasks-25-30_API-App-Settings.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 19 through 24 in sequence
2. **No Secrets:** Use placeholders and mark secret values
3. **Consistency:** Align formats with existing env loader helpers
