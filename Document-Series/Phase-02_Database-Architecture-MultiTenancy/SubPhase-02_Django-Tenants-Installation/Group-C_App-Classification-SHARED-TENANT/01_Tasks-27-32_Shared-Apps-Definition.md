# Tasks 27-32: Shared Apps Definition

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** C - App Classification (SHARED vs TENANT)  
> **Document:** 01 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Database-Settings-Configuration/](../Group-B_Database-Settings-Configuration/)
- **→ Next Document:** [02_Tasks-33-37_Tenant-Apps-Installed.md](02_Tasks-33-37_Tenant-Apps-Installed.md)

---

## Document Overview

This document defines SHARED_APPS and establishes shared app ordering rules.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Define SHARED_APPS list | Medium |
| 28 | Ensure django_tenants first | Simple |
| 29 | Include contenttypes in shared | Simple |
| 30 | Document shared app criteria | Medium |
| 31 | Add apps registry entry | Simple |
| 32 | Validate shared apps order | Medium |

---

## Task 27: Define SHARED_APPS list

### Overview
Create the SHARED_APPS list for apps that live in the public schema.

### Dependencies
- Group B completed

### Instructions

1. **Create SHARED_APPS list**
   - Include core Django apps and shared modules

2. **Document inclusion rationale**
   - Explain why each app is shared

### Expected Outcome
- SHARED_APPS list defined

### Verification Checklist
- [ ] SHARED_APPS defined
- [ ] Rationale documented

---

## Task 28: Ensure django_tenants first

### Overview
Ensure django-tenants is first in SHARED_APPS.

### Dependencies
- Task 27: Define SHARED_APPS list

### Instructions

1. **Order apps correctly**
   - Place `django_tenants` first

2. **Document ordering requirement**
   - Note requirement in documentation

### Expected Outcome
- django_tenants first in SHARED_APPS

### Verification Checklist
- [ ] django_tenants first
- [ ] Ordering requirement documented

---

## Task 29: Include contenttypes in shared

### Overview
Ensure contenttypes is included in SHARED_APPS.

### Dependencies
- Task 28: Ensure django_tenants first

### Instructions

1. **Add contenttypes**
   - Ensure contenttypes appears in SHARED_APPS

2. **Document rationale**
   - Note why contenttypes must be shared

### Expected Outcome
- contenttypes included in SHARED_APPS

### Verification Checklist
- [ ] contenttypes in SHARED_APPS
- [ ] Rationale documented

---

## Task 30: Document shared app criteria

### Overview
Document the criteria for shared apps selection.

### Dependencies
- Task 29: Include contenttypes in shared

### Instructions

1. **Define shared criteria**
   - Explain how to decide if an app is shared

2. **Add examples**
   - Provide examples without code blocks

### Expected Outcome
- Shared app criteria documented

### Verification Checklist
- [ ] Criteria documented
- [ ] Examples included

---

## Task 31: Add apps registry entry

### Overview
Ensure the apps package is recognized by Python.

### Dependencies
- Task 30: Document shared app criteria

### Instructions

1. **Create `backend/apps/__init__.py`**
   - Enable package import for apps namespace

2. **Document purpose**
   - Note how it supports app discovery

### Expected Outcome
- Apps package initialization created

### Verification Checklist
- [ ] `backend/apps/__init__.py` exists
- [ ] Purpose documented

---

## Task 32: Validate shared apps order

### Overview
Verify shared apps list is ordered correctly.

### Dependencies
- Task 31: Add apps registry entry

### Instructions

1. **Validate ordering**
   - Ensure django_tenants is first

2. **Record verification**
   - Capture outcome in documentation

### Expected Outcome
- Shared apps ordering verified

### Verification Checklist
- [ ] Ordering verified
- [ ] Verification record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 27 | Define SHARED_APPS list | SHARED_APPS defined |
| 28 | Ensure django_tenants first | Ordering configured |
| 29 | Include contenttypes in shared | contenttypes included |
| 30 | Document shared app criteria | Criteria documented |
| 31 | Add apps registry entry | `backend/apps/__init__.py` created |
| 32 | Validate shared apps order | Ordering verified |

### Next Steps
- Continue with [02_Tasks-33-37_Tenant-Apps-Installed.md](02_Tasks-33-37_Tenant-Apps-Installed.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 27 through 32 in sequence
2. **Ordering:** Keep django_tenants first in SHARED_APPS
3. **No Code Snippets:** Avoid fenced code blocks in documentation
