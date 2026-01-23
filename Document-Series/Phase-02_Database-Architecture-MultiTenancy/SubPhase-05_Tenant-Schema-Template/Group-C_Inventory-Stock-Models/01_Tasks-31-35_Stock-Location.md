# Tasks 31-35: Stock Location

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** C - Inventory & Stock Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Product-Category-Models/00_GROUP_OVERVIEW.md](../Group-B_Product-Category-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-36-40_Stock-Levels.md](02_Tasks-36-40_Stock-Levels.md)

---

## Document Overview

This document defines stock locations for warehouses and stores.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create StockLocation Model | Medium |
| 32 | Add Location Name Field | Simple |
| 33 | Add Location Type Field | Simple |
| 34 | Add Location Address Fields | Simple |
| 35 | Add Location Active Field | Simple |

---

## Task 31: Create StockLocation Model

### Overview
Create the StockLocation model for warehouse and store locations.

### Dependencies
- Task 11: Register in TENANT_APPS

### Instructions

1. **Define StockLocation model**
   - Capture location identity and type

2. **Document scope**
   - Note multi-location support

### Expected Outcome
- StockLocation model documented

### Verification Checklist
- [ ] StockLocation documented
- [ ] Scope noted

---

## Task 32: Add Location Name Field

### Overview
Add a name field for location identification.

### Dependencies
- Task 31: Create StockLocation Model

### Instructions

1. **Add name field**
   - Use human-friendly location names

2. **Document constraints**
   - Note uniqueness per tenant if required

### Expected Outcome
- Name field documented

### Verification Checklist
- [ ] Name field documented
- [ ] Constraints noted

---

## Task 33: Add Location Type Field

### Overview
Add a type field for warehouse, store, transit, or virtual locations.

### Dependencies
- Task 31: Create StockLocation Model

### Instructions

1. **Add location type field**
   - Use the defined location type set

2. **Document usage**
   - Note how type influences logic

### Expected Outcome
- Location type documented

### Verification Checklist
- [ ] Location type documented
- [ ] Usage noted

---

## Task 34: Add Location Address Fields

### Overview
Add address fields for location details.

### Dependencies
- Task 31: Create StockLocation Model

### Instructions

1. **Add address fields**
   - Capture address for physical locations

2. **Document usage**
   - Note optional usage for non-physical types

### Expected Outcome
- Address fields documented

### Verification Checklist
- [ ] Address fields documented
- [ ] Usage noted

---

## Task 35: Add Location Active Field

### Overview
Add an active flag for location availability.

### Dependencies
- Task 31: Create StockLocation Model

### Instructions

1. **Add active field**
   - Control active/inactive locations

2. **Document behavior**
   - Note how inactive locations are handled

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
| 31 | Create StockLocation Model | StockLocation documented |
| 32 | Add Location Name Field | Name field documented |
| 33 | Add Location Type Field | Type field documented |
| 34 | Add Location Address Fields | Address fields documented |
| 35 | Add Location Active Field | Active field documented |

### Next Steps
- Continue with [02_Tasks-36-40_Stock-Levels.md](02_Tasks-36-40_Stock-Levels.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 31 through 35 in sequence
2. **Location Types:** Use defined location type set
3. **No Code Snippets:** Avoid fenced code blocks in documentation
