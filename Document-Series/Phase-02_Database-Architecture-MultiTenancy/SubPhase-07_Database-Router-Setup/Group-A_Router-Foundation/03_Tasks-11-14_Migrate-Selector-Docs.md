# Tasks 11-14: Migrate, Selector & Docs

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** A - Router Foundation  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Core-Methods.md](02_Tasks-06-10_Core-Methods.md)
- **→ Next Group:** [../Group-B_Schema-Routing-Logic/00_GROUP_OVERVIEW.md](../Group-B_Schema-Routing-Logic/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers migration routing, schema selection, and configuration documentation.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Implement allow_migrate | Medium |
| 12 | Create Schema Selector | Simple |
| 13 | Handle Default Schema | Simple |
| 14 | Document Router Configuration | Simple |

---

## Task 11: Implement allow_migrate

### Overview
Control which apps migrate to which schemas.

### Dependencies
- Task 04: Create Custom Router Class

### Instructions

1. **Define allow_migrate**
   - Route shared apps to public schema

2. **Document behavior**
   - Note tenant app migration rules

### Expected Outcome
- allow_migrate documented

### Verification Checklist
- [ ] allow_migrate documented
- [ ] Behavior noted

---

## Task 12: Create Schema Selector

### Overview
Create helper to select the active schema.

### Dependencies
- Task 07: Create Router Utils

### Instructions

1. **Define schema selector**
   - Retrieve schema from context

2. **Document usage**
   - Note where selector is used

### Expected Outcome
- Schema selector documented

### Verification Checklist
- [ ] Schema selector documented
- [ ] Usage noted

---

## Task 13: Handle Default Schema

### Overview
Handle fallback to public schema when no tenant is set.

### Dependencies
- Task 12: Create Schema Selector

### Instructions

1. **Define fallback behavior**
   - Use public schema as default

2. **Document behavior**
   - Note when fallback applies

### Expected Outcome
- Default schema fallback documented

### Verification Checklist
- [ ] Fallback documented
- [ ] Behavior noted

---

## Task 14: Document Router Configuration

### Overview
Document router configuration and responsibilities.

### Dependencies
- Task 13: Handle Default Schema

### Instructions

1. **Document router configuration**
   - Include DATABASE_ROUTERS usage

2. **Document responsibilities**
   - Note read/write and migrate routing

### Expected Outcome
- Router configuration documented

### Verification Checklist
- [ ] Configuration documented
- [ ] Responsibilities noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Implement allow_migrate | allow_migrate documented |
| 12 | Create Schema Selector | Schema selector documented |
| 13 | Handle Default Schema | Default fallback documented |
| 14 | Document Router Configuration | Configuration documented |

### Next Steps
- Proceed to [Group-B_Schema-Routing-Logic](../Group-B_Schema-Routing-Logic/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 11 through 14 in sequence
2. **Fallback:** Use public schema when tenant missing
3. **No Code Snippets:** Avoid fenced code blocks in documentation
