# Tasks 36-44: Methods, Index & Tests

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** C - SoftDeleteModel  
> **Document:** 02 of 02  
> **Tasks Covered:** 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-35_Model-Fields-Managers.md](01_Tasks-29-35_Model-Fields-Managers.md)
- **→ Next Group:** [../Group-D_AuditModel/00_GROUP_OVERVIEW.md](../Group-D_AuditModel/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers deleted_only manager, soft delete methods, delete override, indexing, exports, tests, and documentation.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Create deleted_only Manager | Medium |
| 37 | Add soft_delete() Method | Medium |
| 38 | Add restore() Method | Medium |
| 39 | Add hard_delete() Method | Simple |
| 40 | Override delete() Method | Medium |
| 41 | Add db_index to is_deleted | Simple |
| 42 | Export in models __init__.py | Simple |
| 43 | Create SoftDelete Tests | Medium |
| 44 | Document SoftDeleteModel | Simple |

---

## Task 36: Create deleted_only Manager

### Overview
Create manager for deleted records.

### Dependencies
- Task 35: Create all_with_deleted Manager

### Instructions

1. **Define deleted_only manager**
   - Filter is_deleted=True

2. **Document usage**
   - Admin or audit access

### Expected Outcome
- deleted_only manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Usage noted

---

## Task 37: Add soft_delete() Method

### Overview
Add soft_delete method.

### Dependencies
- Task 36: Create deleted_only Manager

### Instructions

1. **Define soft_delete**
   - Set is_deleted and deleted_at

2. **Document behavior**
   - Update updated_at

### Expected Outcome
- soft_delete documented

### Verification Checklist
- [ ] Method documented
- [ ] Behavior noted

---

## Task 38: Add restore() Method

### Overview
Add restore method for soft-deleted records.

### Dependencies
- Task 37: Add soft_delete() Method

### Instructions

1. **Define restore**
   - Clear is_deleted and deleted_at

2. **Document behavior**
   - Restore record access

### Expected Outcome
- restore documented

### Verification Checklist
- [ ] Method documented
- [ ] Behavior noted

---

## Task 39: Add hard_delete() Method

### Overview
Add hard_delete method.

### Dependencies
- Task 38: Add restore() Method

### Instructions

1. **Define hard_delete**
   - Permanently remove record

2. **Document usage**
   - Administrative cleanup only

### Expected Outcome
- hard_delete documented

### Verification Checklist
- [ ] Method documented
- [ ] Usage noted

---

## Task 40: Override delete() Method

### Overview
Override delete to use soft_delete.

### Dependencies
- Task 39: Add hard_delete() Method

### Instructions

1. **Override delete**
   - Default to soft deletion

2. **Document impact**
   - Soft delete is default behavior

### Expected Outcome
- Delete override documented

### Verification Checklist
- [ ] Override documented
- [ ] Impact noted

---

## Task 41: Add db_index to is_deleted

### Overview
Add index to is_deleted field.

### Dependencies
- Task 40: Override delete() Method

### Instructions

1. **Add db_index**
   - Improve deleted filtering performance

2. **Document impact**
   - Faster queries

### Expected Outcome
- Index documented

### Verification Checklist
- [ ] Index documented
- [ ] Impact noted

---

## Task 42: Export in models __init__.py

### Overview
Export SoftDeleteModel.

### Dependencies
- Task 41: Add db_index to is_deleted

### Instructions

1. **Update exports**
   - Add SoftDeleteModel

2. **Document usage**
   - Simplify imports

### Expected Outcome
- Export documented

### Verification Checklist
- [ ] Export documented
- [ ] Usage noted

---

## Task 43: Create SoftDelete Tests

### Overview
Create unit tests for SoftDeleteModel.

### Dependencies
- Task 42: Export in models __init__.py

### Instructions

1. **Define tests**
   - Validate soft delete and restore

2. **Document coverage**
   - Include managers behavior

### Expected Outcome
- Tests documented

### Verification Checklist
- [ ] Tests documented
- [ ] Coverage noted

---

## Task 44: Document SoftDeleteModel

### Overview
Document SoftDeleteModel usage.

### Dependencies
- Task 43: Create SoftDelete Tests

### Instructions

1. **Document usage**
   - How to soft delete and restore

2. **Document guidelines**
   - When to use soft deletion

### Expected Outcome
- SoftDeleteModel documentation completed

### Verification Checklist
- [ ] Usage documented
- [ ] Guidelines noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Create deleted_only Manager | Manager documented |
| 37 | Add soft_delete() Method | Method documented |
| 38 | Add restore() Method | Method documented |
| 39 | Add hard_delete() Method | Method documented |
| 40 | Override delete() Method | Override documented |
| 41 | Add db_index to is_deleted | Index documented |
| 42 | Export in models __init__.py | Export documented |
| 43 | Create SoftDelete Tests | Tests documented |
| 44 | Document SoftDeleteModel | Documentation completed |

### Next Steps
- Continue with Group D in [../Group-D_AuditModel/00_GROUP_OVERVIEW.md](../Group-D_AuditModel/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 36 through 44 in sequence
2. **Soft Delete:** Default delete behavior
3. **No Code Snippets:** Avoid fenced code blocks in documentation
