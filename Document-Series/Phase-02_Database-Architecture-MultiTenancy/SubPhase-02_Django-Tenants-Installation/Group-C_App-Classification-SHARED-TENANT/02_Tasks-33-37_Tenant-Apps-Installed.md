# Tasks 33-37: Tenant Apps & Installed

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** C - App Classification (SHARED vs TENANT)  
> **Document:** 02 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-27-32_Shared-Apps-Definition.md](01_Tasks-27-32_Shared-Apps-Definition.md)
- **→ Next Document:** [03_Tasks-38-42_Registry-Verification.md](03_Tasks-38-42_Registry-Verification.md)

---

## Document Overview

This document defines TENANT_APPS and constructs the final INSTALLED_APPS list.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Define TENANT_APPS list | Medium |
| 34 | Include contenttypes in tenant | Simple |
| 35 | Combine SHARED and TENANT apps | Medium |
| 36 | Validate INSTALLED_APPS order | Medium |
| 37 | Document app classification | Medium |

---

## Task 33: Define TENANT_APPS list

### Overview
Create the TENANT_APPS list for apps that live in tenant schemas.

### Dependencies
- Task 32: Validate shared apps order

### Instructions

1. **Create TENANT_APPS list**
   - Include tenant-specific applications

2. **Document inclusion rationale**
   - Explain why each app is tenant-scoped

### Expected Outcome
- TENANT_APPS list defined

### Verification Checklist
- [ ] TENANT_APPS defined
- [ ] Rationale documented

---

## Task 34: Include contenttypes in tenant

### Overview
Ensure contenttypes is present in TENANT_APPS.

### Dependencies
- Task 33: Define TENANT_APPS list

### Instructions

1. **Add contenttypes**
   - Include contenttypes in TENANT_APPS

2. **Document rationale**
   - Note requirement for per-tenant auth models

### Expected Outcome
- contenttypes included in TENANT_APPS

### Verification Checklist
- [ ] contenttypes in TENANT_APPS
- [ ] Rationale documented

---

## Task 35: Combine SHARED and TENANT apps

### Overview
Combine SHARED_APPS and TENANT_APPS into INSTALLED_APPS.

### Dependencies
- Task 34: Include contenttypes in tenant

### Instructions

1. **Combine app lists**
   - Merge lists without duplicates

2. **Document combination rule**
   - Note ordering rules and shared-first logic

### Expected Outcome
- INSTALLED_APPS assembled correctly

### Verification Checklist
- [ ] INSTALLED_APPS combined without duplicates
- [ ] Ordering rules documented

---

## Task 36: Validate INSTALLED_APPS order

### Overview
Verify installed app order conforms to django-tenants requirements.

### Dependencies
- Task 35: Combine SHARED and TENANT apps

### Instructions

1. **Validate ordering**
   - Ensure shared apps appear before tenant apps

2. **Record verification**
   - Capture ordering verification outcome

### Expected Outcome
- INSTALLED_APPS order verified

### Verification Checklist
- [ ] Order verified
- [ ] Verification record documented

---

## Task 37: Document app classification

### Overview
Document the shared vs tenant app classification rules.

### Dependencies
- Task 36: Validate INSTALLED_APPS order

### Instructions

1. **Create documentation**
   - Add `docs/multi-tenancy/app-classification.md`

2. **Link documentation**
   - Link from docs index and multi-tenancy section

### Expected Outcome
- App classification documentation created and linked

### Verification Checklist
- [ ] App classification doc exists
- [ ] Links added

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Define TENANT_APPS list | TENANT_APPS defined |
| 34 | Include contenttypes in tenant | contenttypes included |
| 35 | Combine SHARED and TENANT apps | INSTALLED_APPS combined |
| 36 | Validate INSTALLED_APPS order | Ordering verified |
| 37 | Document app classification | App classification doc created |

### Next Steps
- Continue with [03_Tasks-38-42_Registry-Verification.md](03_Tasks-38-42_Registry-Verification.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 33 through 37 in sequence
2. **Ordering:** Shared apps must precede tenant apps
3. **No Code Snippets:** Avoid fenced code blocks in documentation
