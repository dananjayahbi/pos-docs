# Tasks 15-20: Model Class & Meta

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** B - TimeStampedModel  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Base-Model-Setup/00_GROUP_OVERVIEW.md](../Group-A_Base-Model-Setup/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-28_Manager-Methods-Tests.md](02_Tasks-21-28_Manager-Methods-Tests.md)

---

## Document Overview

This document covers the TimeStampedModel file, class, fields, abstract Meta, and default ordering.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create timestamped.py File | Simple |
| 16 | Create TimeStampedModel Class | Medium |
| 17 | Add created_at Field | Simple |
| 18 | Add updated_at Field | Simple |
| 19 | Set Meta abstract=True | Simple |
| 20 | Add ordering by created_at | Simple |

---

## Task 15: Create timestamped.py File

### Overview
Create the timestamped model file.

### Dependencies
- Task 14: Verify Base Structure

### Instructions

1. **Create timestamped file**
   - Place under core models

2. **Document purpose**
   - Time-based fields for all models

### Expected Outcome
- timestamped.py documented

### Verification Checklist
- [ ] File documented
- [ ] Purpose noted

---

## Task 16: Create TimeStampedModel Class

### Overview
Create the TimeStampedModel class.

### Dependencies
- Task 15: Create timestamped.py File

### Instructions

1. **Define class**
   - Abstract base model

2. **Document inheritance**
   - Used by business models

### Expected Outcome
- TimeStampedModel documented

### Verification Checklist
- [ ] Class documented
- [ ] Inheritance noted

---

## Task 17: Add created_at Field

### Overview
Add created_at timestamp field.

### Dependencies
- Task 16: Create TimeStampedModel Class

### Instructions

1. **Define created_at**
   - auto_now_add and index

2. **Document usage**
   - Record creation time

### Expected Outcome
- created_at field documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 18: Add updated_at Field

### Overview
Add updated_at timestamp field.

### Dependencies
- Task 17: Add created_at Field

### Instructions

1. **Define updated_at**
   - auto_now for updates

2. **Document usage**
   - Record last update

### Expected Outcome
- updated_at field documented

### Verification Checklist
- [ ] Field documented
- [ ] Usage noted

---

## Task 19: Set Meta abstract=True

### Overview
Set model as abstract.

### Dependencies
- Task 18: Add updated_at Field

### Instructions

1. **Set abstract=True**
   - Prevent table creation

2. **Document intent**
   - Base class only

### Expected Outcome
- Abstract Meta documented

### Verification Checklist
- [ ] Meta documented
- [ ] Intent noted

---

## Task 20: Add ordering by created_at

### Overview
Set default ordering.

### Dependencies
- Task 19: Set Meta abstract=True

### Instructions

1. **Define ordering**
   - Order by created_at descending

2. **Document behavior**
   - Default order for queries

### Expected Outcome
- Ordering documented

### Verification Checklist
- [ ] Ordering documented
- [ ] Behavior noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create timestamped.py File | File documented |
| 16 | Create TimeStampedModel Class | Model documented |
| 17 | Add created_at Field | Field documented |
| 18 | Add updated_at Field | Field documented |
| 19 | Set Meta abstract=True | Meta documented |
| 20 | Add ordering by created_at | Ordering documented |

### Next Steps
- Continue with [02_Tasks-21-28_Manager-Methods-Tests.md](02_Tasks-21-28_Manager-Methods-Tests.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Ordering:** Default to newest first
3. **No Code Snippets:** Avoid fenced code blocks in documentation
