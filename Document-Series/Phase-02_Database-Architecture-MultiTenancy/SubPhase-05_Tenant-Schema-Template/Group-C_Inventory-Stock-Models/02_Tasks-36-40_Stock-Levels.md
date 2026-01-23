# Tasks 36-40: Stock Levels

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** C - Inventory & Stock Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-35_Stock-Location.md](01_Tasks-31-35_Stock-Location.md)
- **→ Next Document:** [03_Tasks-41-44_Stock-Movement.md](03_Tasks-41-44_Stock-Movement.md)

---

## Document Overview

This document defines stock levels per product per location.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Create Stock Model | Medium |
| 37 | Add Stock Product FK | Simple |
| 38 | Add Stock Location FK | Simple |
| 39 | Add Stock Quantity Field | Simple |
| 40 | Add Stock Reorder Level | Simple |

---

## Task 36: Create Stock Model

### Overview
Create the Stock model for tracking quantities per location.

### Dependencies
- Task 35: Add Location Active Field

### Instructions

1. **Define Stock model**
   - Track stock per product per location

2. **Document uniqueness**
   - Note unique constraint on product and location

### Expected Outcome
- Stock model documented

### Verification Checklist
- [ ] Stock model documented
- [ ] Uniqueness noted

---

## Task 37: Add Stock Product FK

### Overview
Link stock records to products.

### Dependencies
- Task 36: Create Stock Model

### Instructions

1. **Add product foreign key**
   - Link to Product model

2. **Document usage**
   - Note lookup behavior

### Expected Outcome
- Product FK documented

### Verification Checklist
- [ ] Product FK documented
- [ ] Usage noted

---

## Task 38: Add Stock Location FK

### Overview
Link stock records to locations.

### Dependencies
- Task 36: Create Stock Model

### Instructions

1. **Add location foreign key**
   - Link to StockLocation

2. **Document usage**
   - Note location-based reporting

### Expected Outcome
- Location FK documented

### Verification Checklist
- [ ] Location FK documented
- [ ] Usage noted

---

## Task 39: Add Stock Quantity Field

### Overview
Add quantity tracking for each stock record.

### Dependencies
- Task 36: Create Stock Model

### Instructions

1. **Add quantity field**
   - Track on-hand quantity

2. **Document usage**
   - Note adjustment via movements

### Expected Outcome
- Quantity field documented

### Verification Checklist
- [ ] Quantity field documented
- [ ] Usage noted

---

## Task 40: Add Stock Reorder Level

### Overview
Add a reorder level threshold for low stock alerts.

### Dependencies
- Task 36: Create Stock Model

### Instructions

1. **Add reorder level field**
   - Define threshold for low stock

2. **Document usage**
   - Note alert condition when quantity drops below threshold

### Expected Outcome
- Reorder level documented

### Verification Checklist
- [ ] Reorder level documented
- [ ] Alert behavior noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Create Stock Model | Stock model documented |
| 37 | Add Stock Product FK | Product FK documented |
| 38 | Add Stock Location FK | Location FK documented |
| 39 | Add Stock Quantity Field | Quantity documented |
| 40 | Add Stock Reorder Level | Reorder level documented |

### Next Steps
- Continue with [03_Tasks-41-44_Stock-Movement.md](03_Tasks-41-44_Stock-Movement.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 36 through 40 in sequence
2. **Uniqueness:** Enforce one stock row per product and location
3. **No Code Snippets:** Avoid fenced code blocks in documentation
