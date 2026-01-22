# Tasks 50-56: Services, Auth & Docs

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** D - Frontend Environment Variables Definition  
> **Document:** 02 of 02  
> **Tasks Covered:** 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-49_Public-URLs-Analytics.md](01_Tasks-45-49_Public-URLs-Analytics.md)
- **→ Next Group:** [../Group-E_Docker-Environment-Integration/](../Group-E_Docker-Environment-Integration/)

---

## Document Overview

This document defines frontend variables for monitoring, payments, maps, and authentication, and documents the configuration.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 50 | Define Sentry frontend DSN | Simple |
| 51 | Define Stripe publishable key | Simple |
| 52 | Define Maps API key | Simple |
| 53 | Define server-only vars | Medium |
| 54 | Define NextAuth URL | Medium |
| 55 | Define NextAuth secret | Medium |
| 56 | Document frontend env variables | Medium |

---

## Task 50: Define Sentry frontend DSN

### Overview
Add a public Sentry DSN variable for frontend error tracking.

### Dependencies
- Task 49: Define analytics ID

### Instructions

1. **Add variable to `.env.local.example`**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document usage**
   - Specify environment mapping and enablement rules

### Expected Outcome
- Frontend Sentry DSN variable is defined and documented

### Verification Checklist
- [ ] Sentry DSN variable listed in `.env.local.example`
- [ ] Environment mapping documented

---

## Task 51: Define Stripe publishable key

### Overview
Add a public Stripe publishable key for frontend payment flows.

### Dependencies
- Task 50: Define Sentry frontend DSN

### Instructions

1. **Add variable to `.env.local.example`**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document scope**
   - Clarify that only the publishable key is client-exposed

### Expected Outcome
- Stripe publishable key variable is defined and documented

### Verification Checklist
- [ ] Stripe publishable key listed in `.env.local.example`
- [ ] Scope and exposure documented

---

## Task 52: Define Maps API key

### Overview
Add a public maps API key variable for location features.

### Dependencies
- Task 51: Define Stripe publishable key

### Instructions

1. **Add variable to `.env.local.example`**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document usage**
   - Identify features that depend on map services

### Expected Outcome
- Maps API key variable is defined and documented

### Verification Checklist
- [ ] Maps API key listed in `.env.local.example`
- [ ] Usage documented

---

## Task 53: Define server-only vars

### Overview
Add server-only variables that should never be exposed to the client.

### Dependencies
- Task 52: Define Maps API key

### Instructions

1. **Add server-only variables**
   - Include webhook secrets and private service keys

2. **Document exposure restrictions**
   - Explicitly mark them as server-only

### Expected Outcome
- Server-only variables are defined and documented

### Verification Checklist
- [ ] Server-only variables are listed
- [ ] Exposure restrictions documented

---

## Task 54: Define NextAuth URL

### Overview
Add the NextAuth base URL variable used for authentication callbacks.

### Dependencies
- Task 53: Define server-only vars

### Instructions

1. **Add NEXTAUTH_URL**
   - Include in `.env.local.example`

2. **Document environment differences**
   - Specify dev and prod URL expectations

### Expected Outcome
- NEXTAUTH_URL is defined and documented

### Verification Checklist
- [ ] NEXTAUTH_URL listed in `.env.local.example`
- [ ] Environment guidance documented

---

## Task 55: Define NextAuth secret

### Overview
Add the NextAuth secret used for signing and encryption.

### Dependencies
- Task 54: Define NextAuth URL

### Instructions

1. **Add NEXTAUTH_SECRET**
   - Mark as server-only and secret

2. **Document rotation expectations**
   - Provide guidance on rotation for production

### Expected Outcome
- NEXTAUTH_SECRET is defined and documented

### Verification Checklist
- [ ] NEXTAUTH_SECRET listed in `.env.local.example`
- [ ] Rotation guidance documented

---

## Task 56: Document frontend env variables

### Overview
Finalize frontend environment documentation aligned with all variables in this group.

### Dependencies
- Task 55: Define NextAuth secret

### Instructions

1. **Update documentation**
   - Ensure all variables from tasks 45-55 are included

2. **Validate clarity**
   - Add brief descriptions and expected formats

### Expected Outcome
- Frontend environment variables are fully documented

### Verification Checklist
- [ ] All variables are listed in documentation
- [ ] Descriptions and formats are present

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 50 | Define Sentry frontend DSN | Sentry DSN documented |
| 51 | Define Stripe publishable key | Stripe publishable key documented |
| 52 | Define Maps API key | Maps API key documented |
| 53 | Define server-only vars | Server-only variables documented |
| 54 | Define NextAuth URL | NEXTAUTH_URL documented |
| 55 | Define NextAuth secret | NEXTAUTH_SECRET documented |
| 56 | Document frontend env variables | Frontend env docs updated |

### Next Steps
- Proceed to [../Group-E_Docker-Environment-Integration/](../Group-E_Docker-Environment-Integration/)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 50 through 56 in sequence
2. **Exposure Rules:** Client variables must use `NEXT_PUBLIC_` prefix
3. **Security:** Keep server-only variables out of client builds
