# Group B: Product & Category Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** B of G  
> **Tasks Covered:** 15-30  
> **Group Goal:** Create product catalog and category models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Tenant-Apps-Structure/](../Group-A_Tenant-Apps-Structure/)
- **→ Next Group:** [../Group-C_Inventory-Stock-Models/](../Group-C_Inventory-Stock-Models/)

---

## Group Overview

This group creates the Category and Product models that form the product catalog. Categories support hierarchical structures, and products include pricing, tax, barcode, and variant support.

### Key Outcomes
- Category model created
- Category parent field (self-referential)
- Category name, slug, image, active fields
- Product model created
- Product name, SKU, barcode fields
- Product category FK
- Product pricing fields (cost, selling, MRP)
- Product tax fields
- Product status field
- ProductImage model for multiple images
- ProductVariant model for variants

### Technology Context
- **Hierarchy:** Category tree structure
- **Pricing:** Cost, selling price, MRP (Maximum Retail Price)
- **Tax:** Sri Lankan VAT support
- **Variants:** Size, color, etc.

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Category-Model.md | 15-20 | Category model, parent FK, name, slug, image, active |
| 02 | 02_Tasks-21-26_Product-Core.md | 21-26 | Product model, name, SKU, barcode, category FK, pricing |
| 03 | 03_Tasks-27-30_Product-Extras.md | 27-30 | Tax fields, status, ProductImage, ProductVariant |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create Category Model | Task 11 | Medium |
| 16 | Add Category Parent Field | Task 15 | Simple |
| 17 | Add Category Name Field | Task 15 | Simple |
| 18 | Add Category Slug Field | Task 15 | Simple |
| 19 | Add Category Image Field | Task 15 | Simple |
| 20 | Add Category Active Field | Task 15 | Simple |
| 21 | Create Product Model | Task 20 | Medium |
| 22 | Add Product Name Field | Task 21 | Simple |
| 23 | Add Product SKU Field | Task 21 | Simple |
| 24 | Add Product Barcode Field | Task 21 | Simple |
| 25 | Add Product Category FK | Task 21 | Simple |
| 26 | Add Product Pricing Fields | Task 21 | Medium |
| 27 | Add Product Tax Fields | Task 21 | Simple |
| 28 | Add Product Status Field | Task 21 | Simple |
| 29 | Create ProductImage Model | Task 28 | Medium |
| 30 | Create ProductVariant Model | Task 28 | Medium |

---

## Execution Order

```
01_Tasks-15-20_Category-Model.md
        │
        ▼
02_Tasks-21-26_Product-Core.md
        │
        ▼
03_Tasks-27-30_Product-Extras.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── products/
        ├── models/
        │   ├── __init__.py
        │   ├── category.py       # Category model
        │   ├── product.py        # Product model
        │   ├── image.py          # ProductImage model
        │   └── variant.py        # ProductVariant model
        └── constants.py          # Status choices, tax types
```

---

## Product Pricing Structure

| Field | Description |
|-------|-------------|
| cost_price | Purchase cost from supplier |
| selling_price | Standard selling price |
| mrp | Maximum Retail Price (if applicable) |
| wholesale_price | Bulk purchase price |

---

## Product Status Values

| Status | Description |
|--------|-------------|
| DRAFT | Not yet published |
| ACTIVE | Available for sale |
| INACTIVE | Temporarily unavailable |
| DISCONTINUED | No longer sold |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (apps registered)
2. **Category Tree:** Use django-mptt or self-referential FK
3. **SKU:** Unique per tenant
4. **Barcode:** Support EAN-13, UPC-A formats
5. **MRP:** Common in Sri Lankan retail
6. **Git Commit:** Commit after completing this group

