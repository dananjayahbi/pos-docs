# Tasks 27-30: Product Extras

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** B - Product & Category Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-21-26_Product-Core.md](02_Tasks-21-26_Product-Core.md)
- **→ Next Group:** [../Group-C_Inventory-Stock-Models/00_GROUP_OVERVIEW.md](../Group-C_Inventory-Stock-Models/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document adds tax and status fields plus ProductImage and ProductVariant models.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Add Product Tax Fields | Simple |
| 28 | Add Product Status Field | Simple |
| 29 | Create ProductImage Model | Medium |
| 30 | Create ProductVariant Model | Medium |

---

## Task 27: Add Product Tax Fields

### Overview
Add tax-related fields for Sri Lankan VAT handling.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add tax fields**
   - Capture VAT and tax type needs

2. **Document usage**
   - Note how VAT is applied

### Expected Outcome
- Tax fields documented

### Verification Checklist
- [ ] Tax fields documented
- [ ] VAT usage noted

---

## Task 28: Add Product Status Field

### Overview
Add a status field for product availability.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add status field**
   - Include draft, active, inactive, discontinued

2. **Document usage**
   - Note how status affects availability

### Expected Outcome
- Status field documented

### Verification Checklist
- [ ] Status field documented
- [ ] Availability rules noted

---

## Task 29: Create ProductImage Model

### Overview
Create a model to store multiple images per product.

### Dependencies
- Task 28: Add Product Status Field

### Instructions

1. **Define ProductImage model**
   - Link images to products

2. **Document usage**
   - Note image ordering or primary image

### Expected Outcome
- ProductImage model documented

### Verification Checklist
- [ ] ProductImage documented
- [ ] Usage noted

---

## Task 30: Create ProductVariant Model

### Overview
Create a model for product variants such as size and color.

### Dependencies
- Task 28: Add Product Status Field

### Instructions

1. **Define ProductVariant model**
   - Capture variant attributes

2. **Document usage**
   - Note pricing or SKU per variant

### Expected Outcome
- ProductVariant model documented

### Verification Checklist
- [ ] ProductVariant documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 27 | Add Product Tax Fields | Tax fields documented |
| 28 | Add Product Status Field | Status field documented |
| 29 | Create ProductImage Model | ProductImage documented |
| 30 | Create ProductVariant Model | ProductVariant documented |

### Next Steps
- Proceed to [Group-C_Inventory-Stock-Models](../Group-C_Inventory-Stock-Models/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 27 through 30 in sequence
2. **Tax:** Support Sri Lankan VAT
3. **No Code Snippets:** Avoid fenced code blocks in documentation
