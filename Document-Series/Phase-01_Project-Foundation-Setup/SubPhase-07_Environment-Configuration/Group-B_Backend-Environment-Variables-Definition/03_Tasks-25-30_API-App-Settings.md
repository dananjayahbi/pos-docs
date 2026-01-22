# Tasks 25-30: API & App Settings

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** B - Backend Environment Variables Definition  
> **Document:** 03 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-19-24_External-Services.md](02_Tasks-19-24_External-Services.md)
- **→ Next Group:** [../Group-C_Frontend-Environment-Setup/](../Group-C_Frontend-Environment-Setup/)

---

## Document Overview

This document defines backend environment variables for APIs, application settings, logging, and regional configuration.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Define SMS provider settings | Medium |
| 26 | Define OpenAI settings | Medium |
| 27 | Define site and app settings | Simple |
| 28 | Define logging configuration | Simple |
| 29 | Define timezone settings | Simple |
| 30 | Finalize backend env example | Medium |

---

## Task 25: Define SMS provider settings

### Overview
Add environment variables for SMS provider integration used for notifications and OTP.

### Dependencies
- Task 24: Define Stripe settings

### Instructions

1. **Add SMS variables to `.env.example`**
   - Include provider name, API key, and sender ID placeholders

2. **Document usage**
   - Identify features that rely on SMS delivery

### Expected Outcome
- SMS variables are defined and documented

### Verification Checklist
- [ ] SMS variables are listed in `.env.example`
- [ ] Usage scope is documented

---

## Task 26: Define OpenAI settings

### Overview
Add environment variables for AI integrations.

### Dependencies
- Task 25: Define SMS provider settings

### Instructions

1. **Add AI variables to `.env.example`**
   - Include API key and model identifiers

2. **Document limits and usage**
   - Note intended features and rate limit expectations

### Expected Outcome
- AI variables are defined and documented

### Verification Checklist
- [ ] AI variables are listed in `.env.example`
- [ ] Usage guidance is documented

---

## Task 27: Define site and app settings

### Overview
Add variables for site name, brand identity, and application configuration.

### Dependencies
- Task 26: Define OpenAI settings

### Instructions

1. **Add app identity variables**
   - Include site name, support email, and base URL placeholders

2. **Document environment-specific overrides**
   - Note which values change between dev, staging, and prod

### Expected Outcome
- App identity variables are defined and documented

### Verification Checklist
- [ ] App identity variables are listed in `.env.example`
- [ ] Environment-specific guidance is documented

---

## Task 28: Define logging configuration

### Overview
Add environment variables for logging level and logging destinations.

### Dependencies
- Task 27: Define site and app settings

### Instructions

1. **Add logging variables**
   - Include log level and optional log sink placeholders

2. **Document defaults**
   - Clarify default log levels per environment

### Expected Outcome
- Logging variables are defined and documented

### Verification Checklist
- [ ] Logging variables are listed in `.env.example`
- [ ] Default behavior is documented

---

## Task 29: Define timezone settings

### Overview
Standardize timezone configuration for Sri Lanka.

### Dependencies
- Task 28: Define logging configuration

### Instructions

1. **Add timezone variables**
   - Include `TIME_ZONE` and relevant locale placeholders

2. **Document Sri Lanka context**
   - Use Asia/Colombo as the standard timezone

### Expected Outcome
- Timezone variables are defined and documented

### Verification Checklist
- [ ] Timezone variables are listed in `.env.example`
- [ ] Asia/Colombo is specified as default

---

## Task 30: Finalize backend env example

### Overview
Ensure `.env.example` reflects all backend environment variables defined in Group B.

### Dependencies
- Task 29: Define timezone settings

### Instructions

1. **Consolidate variables**
   - Verify all variables from tasks 15-29 are listed

2. **Validate clarity**
   - Ensure every variable has a short description and expected format

### Expected Outcome
- `backend/.env.example` is complete and consistent

### Verification Checklist
- [ ] All Group B variables are included
- [ ] Descriptions and formats are present

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Define SMS provider settings | SMS variables documented |
| 26 | Define OpenAI settings | AI variables documented |
| 27 | Define site and app settings | App identity variables documented |
| 28 | Define logging configuration | Logging variables documented |
| 29 | Define timezone settings | Sri Lanka timezone documented |
| 30 | Finalize backend env example | Backend `.env.example` complete |

### Next Steps
- Proceed to [../Group-C_Frontend-Environment-Setup/](../Group-C_Frontend-Environment-Setup/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 25 through 30 in sequence
2. **No Secrets:** Use placeholders for all secret keys
3. **Sri Lanka Context:** Timezone must be Asia/Colombo
