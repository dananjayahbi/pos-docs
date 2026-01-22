# Tasks 01-04: Platform App Setup

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** A - Public Schema Planning  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** None (First Group in SubPhase)
- **→ Next Document:** [02_Tasks-05-08_Models-Package-Mixins.md](02_Tasks-05-08_Models-Package-Mixins.md)

---

## Document Overview

This document creates the platform app scaffold and public schema planning artifacts.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create platform app scaffold | Medium |
| 02 | Register platform app in shared apps | Medium |
| 03 | Create public schema ERD doc | Medium |
| 04 | Create naming conventions doc | Medium |

---

## Task 01: Create platform app scaffold

### Overview
Create the platform app for public schema models.

### Dependencies
- SubPhase-02 Django-Tenants Installation complete

### Instructions

1. **Create `backend/apps/platform`**
   - Add app directory structure for models and admin

2. **Document purpose**
   - Note platform app stores public schema models

### Expected Outcome
- Platform app scaffold created

### Verification Checklist
- [ ] Platform app directory exists
- [ ] Purpose documented

---

## Task 02: Register platform app in shared apps

### Overview
Ensure platform app is part of SHARED_APPS.

### Dependencies
- Task 01: Create platform app scaffold

### Instructions

1. **Add platform app to SHARED_APPS**
   - Keep ordering consistent with django-tenants rules

2. **Document registration**
   - Note platform app is shared schema only

### Expected Outcome
- Platform app registered in SHARED_APPS

### Verification Checklist
- [ ] Platform app included in SHARED_APPS
- [ ] Registration documented

---

## Task 03: Create public schema ERD doc

### Overview
Create a public schema ERD documentation page.

### Dependencies
- Task 02: Register platform app in shared apps

### Instructions

1. **Create `docs/database/public-schema-erd.md`**
   - Describe public schema entities and relationships

2. **Add navigation links**
   - Link from database docs index

### Expected Outcome
- Public schema ERD documentation created

### Verification Checklist
- [ ] ERD doc exists
- [ ] Links added

---

## Task 04: Create naming conventions doc

### Overview
Document naming conventions for public schema tables and fields.

### Dependencies
- Task 03: Create public schema ERD doc

### Instructions

1. **Create `docs/database/naming-conventions.md`**
   - Document table and field naming rules

2. **Link documentation**
   - Add links from database docs index

### Expected Outcome
- Naming conventions documentation created

### Verification Checklist
- [ ] Naming conventions doc exists
- [ ] Links added

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create platform app scaffold | Platform app scaffold created |
| 02 | Register platform app in shared apps | Platform app registered |
| 03 | Create public schema ERD doc | `public-schema-erd.md` created |
| 04 | Create naming conventions doc | `naming-conventions.md` created |

### Next Steps
- Continue with [02_Tasks-05-08_Models-Package-Mixins.md](02_Tasks-05-08_Models-Package-Mixins.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 01 through 04 in sequence
2. **Shared App:** Platform app must be in SHARED_APPS
3. **No Code Snippets:** Avoid fenced code blocks in documentation
