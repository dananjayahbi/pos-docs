# Tasks 15-20: App Routing

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** B - Schema Routing Logic  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Router-Foundation/00_GROUP_OVERVIEW.md](../Group-A_Router-Foundation/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-25_Schema-Switching.md](02_Tasks-21-25_Schema-Switching.md)

---

## Document Overview

This document defines shared and tenant app routing and context retrieval.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Define Shared Apps List | Simple |
| 16 | Define Tenant Apps List | Simple |
| 17 | Route Shared App Queries | Medium |
| 18 | Route Tenant App Queries | Medium |
| 19 | Handle Mixed Queries | Medium |
| 20 | Get Schema from Context | Simple |

---

## Task 15: Define Shared Apps List

### Overview
Define the list of shared apps that use the public schema.

### Dependencies
- Task 14: Document Router Configuration

### Instructions

1. **Define shared apps list**
   - Include platform and tenant management apps

2. **Document usage**
   - Note routing to public schema

### Expected Outcome
- Shared apps list documented

### Verification Checklist
- [ ] Shared apps list documented
- [ ] Usage noted

---

## Task 16: Define Tenant Apps List

### Overview
Define the list of tenant apps using tenant schemas.

### Dependencies
- Task 14: Document Router Configuration

### Instructions

1. **Define tenant apps list**
   - Include all tenant business apps

2. **Document usage**
   - Note routing to tenant schema

### Expected Outcome
- Tenant apps list documented

### Verification Checklist
- [ ] Tenant apps list documented
- [ ] Usage noted

---

## Task 17: Route Shared App Queries

### Overview
Route shared app queries to the public schema.

### Dependencies
- Task 15: Define Shared Apps List

### Instructions

1. **Route shared queries**
   - Ensure public schema routing

2. **Document behavior**
   - Note shared app overrides

### Expected Outcome
- Shared app routing documented

### Verification Checklist
- [ ] Shared routing documented
- [ ] Behavior noted

---

## Task 18: Route Tenant App Queries

### Overview
Route tenant app queries to tenant schema.

### Dependencies
- Task 16: Define Tenant Apps List

### Instructions

1. **Route tenant queries**
   - Use schema from context

2. **Document behavior**
   - Note default handling

### Expected Outcome
- Tenant app routing documented

### Verification Checklist
- [ ] Tenant routing documented
- [ ] Behavior noted

---

## Task 19: Handle Mixed Queries

### Overview
Handle queries involving shared and tenant models.

### Dependencies
- Task 17: Route Shared App Queries
- Task 18: Route Tenant App Queries

### Instructions

1. **Define mixed query behavior**
   - Determine routing precedence

2. **Document constraints**
   - Note any blocked combinations

### Expected Outcome
- Mixed query handling documented

### Verification Checklist
- [ ] Mixed handling documented
- [ ] Constraints noted

---

## Task 20: Get Schema from Context

### Overview
Retrieve the active schema from context.

### Dependencies
- Task 18: Route Tenant App Queries

### Instructions

1. **Get schema from context**
   - Use thread-local or context helper

2. **Document usage**
   - Note where it is accessed

### Expected Outcome
- Schema retrieval documented

### Verification Checklist
- [ ] Schema retrieval documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Define Shared Apps List | Shared apps documented |
| 16 | Define Tenant Apps List | Tenant apps documented |
| 17 | Route Shared App Queries | Shared routing documented |
| 18 | Route Tenant App Queries | Tenant routing documented |
| 19 | Handle Mixed Queries | Mixed handling documented |
| 20 | Get Schema from Context | Schema retrieval documented |

### Next Steps
- Continue with [02_Tasks-21-25_Schema-Switching.md](02_Tasks-21-25_Schema-Switching.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Context:** Use thread-local schema
3. **No Code Snippets:** Avoid fenced code blocks in documentation
