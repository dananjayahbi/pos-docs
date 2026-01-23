# Tasks 15-20: Category Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** B - Product & Category Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Tenant-Apps-Structure/00_GROUP_OVERVIEW.md](../Group-A_Tenant-Apps-Structure/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-26_Product-Core.md](02_Tasks-21-26_Product-Core.md)

---

## Document Overview

This document defines the Category model and its core fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create Category Model | Medium |
| 16 | Add Category Parent Field | Simple |
| 17 | Add Category Name Field | Simple |
| 18 | Add Category Slug Field | Simple |
| 19 | Add Category Image Field | Simple |
| 20 | Add Category Active Field | Simple |

---

## Task 15: Create Category Model

### Overview
Create the Category model for the tenant product catalog.

### Dependencies
- Task 11: Register in TENANT_APPS

### Instructions

1. **Define Category model**
   - Capture required category structure

2. **Document hierarchy approach**
   - Note self-referential or tree pattern

### Expected Outcome
- Category model documented

### Verification Checklist
- [ ] Category model documented
- [ ] Hierarchy approach noted

---

## Task 16: Add Category Parent Field

### Overview
Add a parent field for category hierarchy.

### Dependencies
- Task 15: Create Category Model

### Instructions

1. **Add parent field**
   - Support nested categories

2. **Document behavior**
   - Note root category handling

### Expected Outcome
- Parent field documented

### Verification Checklist
- [ ] Parent field documented
- [ ] Behavior noted

---

## Task 17: Add Category Name Field

### Overview
Add a category name field.

### Dependencies
- Task 15: Create Category Model

### Instructions

1. **Add name field**
   - Capture display name

2. **Document constraints**
   - Note uniqueness or length rules

### Expected Outcome
- Name field documented

### Verification Checklist
- [ ] Name field documented
- [ ] Constraints noted

---

## Task 18: Add Category Slug Field

### Overview
Add a slug field for URL-friendly identifiers.

### Dependencies
- Task 15: Create Category Model

### Instructions

1. **Add slug field**
   - Ensure slug is URL-friendly

2. **Document constraints**
   - Note uniqueness per tenant

### Expected Outcome
- Slug field documented

### Verification Checklist
- [ ] Slug field documented
- [ ] Constraints noted

---

## Task 19: Add Category Image Field

### Overview
Add an image field for category branding.

### Dependencies
- Task 15: Create Category Model

### Instructions

1. **Add image field**
   - Support optional category images

2. **Document usage**
   - Note display locations

### Expected Outcome
- Image field documented

### Verification Checklist
- [ ] Image field documented
- [ ] Usage noted

---

## Task 20: Add Category Active Field

### Overview
Add an active flag for category visibility.

### Dependencies
- Task 15: Create Category Model

### Instructions

1. **Add active field**
   - Control category availability

2. **Document usage**
   - Note how inactive categories behave

### Expected Outcome
- Active field documented

### Verification Checklist
- [ ] Active field documented
- [ ] Behavior noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create Category Model | Category model documented |
| 16 | Add Category Parent Field | Parent field documented |
| 17 | Add Category Name Field | Name field documented |
| 18 | Add Category Slug Field | Slug field documented |
| 19 | Add Category Image Field | Image field documented |
| 20 | Add Category Active Field | Active field documented |

### Next Steps
- Continue with [02_Tasks-21-26_Product-Core.md](02_Tasks-21-26_Product-Core.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Category Tree:** Use a self-referential pattern or tree structure
3. **No Code Snippets:** Avoid fenced code blocks in documentation
