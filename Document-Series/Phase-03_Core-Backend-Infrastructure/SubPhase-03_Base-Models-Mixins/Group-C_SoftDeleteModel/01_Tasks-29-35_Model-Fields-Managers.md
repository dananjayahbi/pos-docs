# Tasks 29-35: Model, Fields & Managers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** C - SoftDeleteModel  
> **Document:** 01 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_TimeStampedModel/00_GROUP_OVERVIEW.md](../Group-B_TimeStampedModel/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-36-44_Methods-Index-Tests.md](02_Tasks-36-44_Methods-Index-Tests.md)

---

## Document Overview

This document covers SoftDeleteModel file creation, core fields, manager setup, and queryset behavior.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create soft_delete.py File | Simple |
| 30 | Create SoftDeleteModel Class | Medium |
| 31 | Add is_deleted Field | Simple |
| 32 | Add deleted_at Field | Simple |
| 33 | Create SoftDeleteManager | Medium |
| 34 | Override get_queryset | Medium |
| 35 | Create all_with_deleted Manager | Medium |

---

## Task 29: Create soft_delete.py File

### Overview
Create the soft delete model file.

### Dependencies
- Task 28: Document TimeStampedModel

### Instructions

1. **Create soft_delete file**
   - Place under core models

2. **Document purpose**
   - Soft deletion support

### Expected Outcome
- soft_delete.py documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 30: Create SoftDeleteModel Class

### Overview
Create SoftDeleteModel extending TimeStampedModel.

### Dependencies
- Task 29: Create soft_delete.py File

### Instructions

1. **Define class**
   - Abstract base model with soft delete

2. **Document inheritance**
   - Extends TimeStampedModel

### Expected Outcome
- SoftDeleteModel documented

### Verification Checklist
- [ ] Class documented
- [ ] Inheritance noted

---

## Task 31: Add is_deleted Field

### Overview
Add is_deleted boolean field.

### Dependencies
- Task 30: Create SoftDeleteModel Class

### Instructions

1. **Define is_deleted**
   - Default false and indexed

2. **Document usage**
   - Marks records as deleted

### Expected Outcome
- is_deleted documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 32: Add deleted_at Field

### Overview
Add deleted_at timestamp field.

### Dependencies
- Task 31: Add is_deleted Field

### Instructions

1. **Define deleted_at**
   - Null when not deleted

2. **Document usage**
   - Capture deletion time

### Expected Outcome
- deleted_at documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 33: Create SoftDeleteManager

### Overview
Create SoftDeleteManager.

### Dependencies
- Task 32: Add deleted_at Field

### Instructions

1. **Define manager**
   - Exclude deleted records by default

2. **Document usage**
   - Use as default manager

### Expected Outcome
- Manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Usage noted

---

## Task 34: Override get_queryset

### Overview
Override get_queryset to exclude deleted records.

### Dependencies
- Task 33: Create SoftDeleteManager

### Instructions

1. **Define queryset behavior**
   - Filter is_deleted=False

2. **Document behavior**
   - Soft-deleted records hidden

### Expected Outcome
- Queryset override documented

### Verification Checklist
- [ ] Behavior documented
- [ ] Effect noted

---

## Task 35: Create all_with_deleted Manager

### Overview
Create manager for all records including deleted.

### Dependencies
- Task 34: Override get_queryset

### Instructions

1. **Define all_with_deleted**
   - Manager includes deleted records

2. **Document usage**
   - Administrative access

### Expected Outcome
- all_with_deleted manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create soft_delete.py File | File documented |
| 30 | Create SoftDeleteModel Class | Model documented |
| 31 | Add is_deleted Field | Field documented |
| 32 | Add deleted_at Field | Field documented |
| 33 | Create SoftDeleteManager | Manager documented |
| 34 | Override get_queryset | Queryset documented |
| 35 | Create all_with_deleted Manager | Manager documented |

### Next Steps
- Continue with [02_Tasks-36-44_Methods-Index-Tests.md](02_Tasks-36-44_Methods-Index-Tests.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 35 in sequence
2. **Default Manager:** Excludes deleted records
3. **No Code Snippets:** Avoid fenced code blocks in documentation
