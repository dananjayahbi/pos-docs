# Tasks 21-28: Manager, Methods & Tests

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** B - TimeStampedModel  
> **Document:** 02 of 02  
> **Tasks Covered:** 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-20_Model-Class-Meta.md](01_Tasks-15-20_Model-Class-Meta.md)
- **→ Next Group:** [../Group-C_SoftDeleteModel/00_GROUP_OVERVIEW.md](../Group-C_SoftDeleteModel/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the TimeStampedManager, time-based filter methods, exports, tests, and documentation.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Create TimeStampedManager | Medium |
| 22 | Add recent() Method | Simple |
| 23 | Add today() Method | Simple |
| 24 | Add this_week() Method | Simple |
| 25 | Add this_month() Method | Simple |
| 26 | Export in models __init__.py | Simple |
| 27 | Create TimeStamped Tests | Medium |
| 28 | Document TimeStampedModel | Simple |

---

## Task 21: Create TimeStampedManager

### Overview
Create manager for time-based queries.

### Dependencies
- Task 20: Add ordering by created_at

### Instructions

1. **Define manager**
   - Use time-based query helpers

2. **Document usage**
   - Manager attached to TimeStampedModel

### Expected Outcome
- Manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Usage noted

---

## Task 22: Add recent() Method

### Overview
Add recent() query helper.

### Dependencies
- Task 21: Create TimeStampedManager

### Instructions

1. **Define recent()**
   - Filter records from last N days

2. **Document usage**
   - Default to 7 days

### Expected Outcome
- recent() documented

### Verification Checklist
- [ ] Method documented
- [ ] Usage noted

---

## Task 23: Add today() Method

### Overview
Add today() query helper.

### Dependencies
- Task 22: Add recent() Method

### Instructions

1. **Define today()**
   - Filter records created today

2. **Document usage**
   - Timezone-aware behavior

### Expected Outcome
- today() documented

### Verification Checklist
- [ ] Method documented
- [ ] Usage noted

---

## Task 24: Add this_week() Method

### Overview
Add this_week() query helper.

### Dependencies
- Task 23: Add today() Method

### Instructions

1. **Define this_week()**
   - Filter records from last 7 days

2. **Document usage**
   - Alias for recent(7)

### Expected Outcome
- this_week() documented

### Verification Checklist
- [ ] Method documented
- [ ] Usage noted

---

## Task 25: Add this_month() Method

### Overview
Add this_month() query helper.

### Dependencies
- Task 24: Add this_week() Method

### Instructions

1. **Define this_month()**
   - Filter records from last 30 days

2. **Document usage**
   - Alias for recent(30)

### Expected Outcome
- this_month() documented

### Verification Checklist
- [ ] Method documented
- [ ] Usage noted

---

## Task 26: Export in models __init__.py

### Overview
Export TimeStampedModel in models package.

### Dependencies
- Task 25: Add this_month() Method

### Instructions

1. **Update exports**
   - Add TimeStampedModel to __init__.py

2. **Document usage**
   - Simplify imports

### Expected Outcome
- Export documented

### Verification Checklist
- [ ] Export documented
- [ ] Usage noted

---

## Task 27: Create TimeStamped Tests

### Overview
Create unit tests for TimeStampedModel.

### Dependencies
- Task 26: Export in models __init__.py

### Instructions

1. **Define tests**
   - Validate created_at and updated_at

2. **Document coverage**
   - Include manager methods

### Expected Outcome
- Tests documented

### Verification Checklist
- [ ] Tests documented
- [ ] Coverage noted

---

## Task 28: Document TimeStampedModel

### Overview
Document TimeStampedModel usage.

### Dependencies
- Task 27: Create TimeStamped Tests

### Instructions

1. **Document usage**
   - Inheritance and fields

2. **Document guidelines**
   - When to use the model

### Expected Outcome
- TimeStampedModel documentation completed

### Verification Checklist
- [ ] Usage documented
- [ ] Guidelines noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Create TimeStampedManager | Manager documented |
| 22 | Add recent() Method | Method documented |
| 23 | Add today() Method | Method documented |
| 24 | Add this_week() Method | Method documented |
| 25 | Add this_month() Method | Method documented |
| 26 | Export in models __init__.py | Export documented |
| 27 | Create TimeStamped Tests | Tests documented |
| 28 | Document TimeStampedModel | Documentation completed |

### Next Steps
- Continue with Group C in [../Group-C_SoftDeleteModel/00_GROUP_OVERVIEW.md](../Group-C_SoftDeleteModel/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 21 through 28 in sequence
2. **Timezone:** Use timezone-aware fields
3. **No Code Snippets:** Avoid fenced code blocks in documentation
