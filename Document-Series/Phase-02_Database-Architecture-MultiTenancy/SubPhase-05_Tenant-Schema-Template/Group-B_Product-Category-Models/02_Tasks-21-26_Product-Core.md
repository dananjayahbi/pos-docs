# Tasks 21-26: Product Core

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** B - Product & Category Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-20_Category-Model.md](01_Tasks-15-20_Category-Model.md)
- **→ Next Document:** [03_Tasks-27-30_Product-Extras.md](03_Tasks-27-30_Product-Extras.md)

---

## Document Overview

This document defines the core Product model fields including identifiers and pricing.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Create Product Model | Medium |
| 22 | Add Product Name Field | Simple |
| 23 | Add Product SKU Field | Simple |
| 24 | Add Product Barcode Field | Simple |
| 25 | Add Product Category FK | Simple |
| 26 | Add Product Pricing Fields | Medium |

---

## Task 21: Create Product Model

### Overview
Create the Product model for tenant catalog items.

### Dependencies
- Task 20: Add Category Active Field

### Instructions

1. **Define Product model**
   - Capture core product fields

2. **Document relationships**
   - Note linkage to categories

### Expected Outcome
- Product model documented

### Verification Checklist
- [ ] Product model documented
- [ ] Relationships noted

---

## Task 22: Add Product Name Field

### Overview
Add a product name field.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add name field**
   - Store product display name

2. **Document constraints**
   - Note uniqueness or length rules

### Expected Outcome
- Name field documented

### Verification Checklist
- [ ] Name field documented
- [ ] Constraints noted

---

## Task 23: Add Product SKU Field

### Overview
Add a SKU field, unique per tenant.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add SKU field**
   - Ensure uniqueness per tenant

2. **Document usage**
   - Note how SKU is used in search

### Expected Outcome
- SKU field documented

### Verification Checklist
- [ ] SKU documented
- [ ] Uniqueness noted

---

## Task 24: Add Product Barcode Field

### Overview
Add a barcode field to support EAN-13 and UPC-A.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add barcode field**
   - Support EAN-13 and UPC-A formats

2. **Document validation**
   - Note format validation expectations

### Expected Outcome
- Barcode field documented

### Verification Checklist
- [ ] Barcode documented
- [ ] Validation noted

---

## Task 25: Add Product Category FK

### Overview
Link products to categories.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add category foreign key**
   - Link product to category

2. **Document behavior**
   - Note category changes impact

### Expected Outcome
- Category FK documented

### Verification Checklist
- [ ] Category FK documented
- [ ] Behavior noted

---

## Task 26: Add Product Pricing Fields

### Overview
Add pricing fields including cost, selling price, and MRP.

### Dependencies
- Task 21: Create Product Model

### Instructions

1. **Add pricing fields**
   - Include cost, selling price, MRP, and wholesale

2. **Document usage**
   - Note Sri Lankan retail MRP usage

### Expected Outcome
- Pricing fields documented

### Verification Checklist
- [ ] Pricing documented
- [ ] MRP usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Create Product Model | Product model documented |
| 22 | Add Product Name Field | Name field documented |
| 23 | Add Product SKU Field | SKU field documented |
| 24 | Add Product Barcode Field | Barcode field documented |
| 25 | Add Product Category FK | Category FK documented |
| 26 | Add Product Pricing Fields | Pricing documented |

### Next Steps
- Continue with [03_Tasks-27-30_Product-Extras.md](03_Tasks-27-30_Product-Extras.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 21 through 26 in sequence
2. **SKU:** Unique per tenant
3. **No Code Snippets:** Avoid fenced code blocks in documentation
