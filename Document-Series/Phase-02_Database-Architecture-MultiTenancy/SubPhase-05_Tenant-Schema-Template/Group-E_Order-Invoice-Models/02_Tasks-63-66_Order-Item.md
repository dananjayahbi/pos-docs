# Tasks 63-66: Order Item

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** E - Order & Invoice Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-57-62_Order-Model.md](01_Tasks-57-62_Order-Model.md)
- **→ Next Document:** [03_Tasks-67-72_Invoice-Payment.md](03_Tasks-67-72_Invoice-Payment.md)

---

## Document Overview

This document defines the OrderItem model and its product, quantity, and pricing fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create OrderItem Model | Medium |
| 64 | Add OrderItem Product FK | Simple |
| 65 | Add OrderItem Quantity Field | Simple |
| 66 | Add OrderItem Price Fields | Simple |

---

## Task 63: Create OrderItem Model

### Overview
Create the OrderItem model to store line items.

### Dependencies
- Task 62: Add Order Total Fields

### Instructions

1. **Define OrderItem model**
   - Capture line item details

2. **Document relationships**
   - Note linkage to orders and products

### Expected Outcome
- OrderItem model documented

### Verification Checklist
- [ ] OrderItem documented
- [ ] Relationships noted

---

## Task 64: Add OrderItem Product FK

### Overview
Link order items to products.

### Dependencies
- Task 63: Create OrderItem Model

### Instructions

1. **Add product foreign key**
   - Link to Product model

2. **Document usage**
   - Note reporting and inventory ties

### Expected Outcome
- Product FK documented

### Verification Checklist
- [ ] Product FK documented
- [ ] Usage noted

---

## Task 65: Add OrderItem Quantity Field

### Overview
Add a quantity field for order items.

### Dependencies
- Task 63: Create OrderItem Model

### Instructions

1. **Add quantity field**
   - Store ordered quantity

2. **Document validation**
   - Note non-negative constraints

### Expected Outcome
- Quantity field documented

### Verification Checklist
- [ ] Quantity documented
- [ ] Validation noted

---

## Task 66: Add OrderItem Price Fields

### Overview
Add price fields for line items.

### Dependencies
- Task 63: Create OrderItem Model

### Instructions

1. **Add price fields**
   - Capture unit price and line total

2. **Document usage**
   - Note pricing in LKR (₨)

### Expected Outcome
- Price fields documented

### Verification Checklist
- [ ] Price fields documented
- [ ] Currency noted as LKR

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create OrderItem Model | OrderItem documented |
| 64 | Add OrderItem Product FK | Product FK documented |
| 65 | Add OrderItem Quantity Field | Quantity documented |
| 66 | Add OrderItem Price Fields | Price fields documented |

### Next Steps
- Continue with [03_Tasks-67-72_Invoice-Payment.md](03_Tasks-67-72_Invoice-Payment.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 63 through 66 in sequence
2. **Pricing:** Use LKR for line totals
3. **No Code Snippets:** Avoid fenced code blocks in documentation
