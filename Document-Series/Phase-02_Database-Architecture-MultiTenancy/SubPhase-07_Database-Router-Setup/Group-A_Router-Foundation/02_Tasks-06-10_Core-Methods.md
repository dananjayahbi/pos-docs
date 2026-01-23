# Tasks 06-10: Core Methods

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** A - Router Foundation  
> **Document:** 02 of 03  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Router-Setup.md](01_Tasks-01-05_Router-Setup.md)
- **→ Next Document:** [03_Tasks-11-14_Migrate-Selector-Docs.md](03_Tasks-11-14_Migrate-Selector-Docs.md)

---

## Document Overview

This document implements router order, utilities, and core routing methods.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Verify Router Order | Simple |
| 07 | Create Router Utils | Medium |
| 08 | Implement db_for_read | Medium |
| 09 | Implement db_for_write | Medium |
| 10 | Implement allow_relation | Medium |

---

## Task 06: Verify Router Order

### Overview
Ensure the router is first in DATABASE_ROUTERS.

### Dependencies
- Task 05: Register in DATABASE_ROUTERS

### Instructions

1. **Verify router order**
   - Router must be first in list

2. **Document rationale**
   - Note impact on routing behavior

### Expected Outcome
- Router order documented

### Verification Checklist
- [ ] Order documented
- [ ] Rationale noted

---

## Task 07: Create Router Utils

### Overview
Create utility helpers for routing logic.

### Dependencies
- Task 02: Create Router Module

### Instructions

1. **Define router utilities**
   - Include schema access helpers

2. **Document usage**
   - Note where utilities are used

### Expected Outcome
- Router utilities documented

### Verification Checklist
- [ ] Utilities documented
- [ ] Usage noted

---

## Task 08: Implement db_for_read

### Overview
Implement database selection for read queries.

### Dependencies
- Task 04: Create Custom Router Class

### Instructions

1. **Define db_for_read**
   - Route to tenant or public schema

2. **Document behavior**
   - Note schema selection logic

### Expected Outcome
- db_for_read documented

### Verification Checklist
- [ ] db_for_read documented
- [ ] Behavior noted

---

## Task 09: Implement db_for_write

### Overview
Implement database selection for write queries.

### Dependencies
- Task 04: Create Custom Router Class

### Instructions

1. **Define db_for_write**
   - Route writes to tenant schema

2. **Document behavior**
   - Note public schema constraints

### Expected Outcome
- db_for_write documented

### Verification Checklist
- [ ] db_for_write documented
- [ ] Behavior noted

---

## Task 10: Implement allow_relation

### Overview
Implement relation allowance rules for models.

### Dependencies
- Task 04: Create Custom Router Class

### Instructions

1. **Define allow_relation**
   - Enforce schema rules for relations

2. **Document behavior**
   - Note allowed relation types

### Expected Outcome
- allow_relation documented

### Verification Checklist
- [ ] allow_relation documented
- [ ] Behavior noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 06 | Verify Router Order | Order documented |
| 07 | Create Router Utils | Utilities documented |
| 08 | Implement db_for_read | db_for_read documented |
| 09 | Implement db_for_write | db_for_write documented |
| 10 | Implement allow_relation | allow_relation documented |

### Next Steps
- Continue with [03_Tasks-11-14_Migrate-Selector-Docs.md](03_Tasks-11-14_Migrate-Selector-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 06 through 10 in sequence
2. **Schema:** Use thread-local schema with public fallback
3. **No Code Snippets:** Avoid fenced code blocks in documentation
