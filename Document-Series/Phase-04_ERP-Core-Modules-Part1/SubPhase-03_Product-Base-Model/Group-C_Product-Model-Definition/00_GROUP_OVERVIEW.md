# Group C: Product Model Definition

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** C of F  
> **Tasks Covered:** 33-56  
> **Group Goal:** Create the core Product model with all fields

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Supporting-Models](../Group-B_Supporting-Models/)
- **→ Next Group:** [Group-D_Product-Manager-QuerySets](../Group-D_Product-Manager-QuerySets/)

---

## Group Overview

### Key Outcomes
- Complete Product model with all fields
- Identity fields: name, slug, SKU, barcode
- Classification: category, brand, type, status
- Visibility: webstore, POS, featured
- Physical: weight, dimensions
- SEO fields for webstore

### Technology Context
- ForeignKey relationships to Category, Brand, TaxClass, UoM
- Choice fields for product_type and status
- Unique constraints on SKU and barcode per tenant
- Decimal fields for weight and dimensions

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-40_Product-Identity-Fields.md | 33-40 | Create Product model with identity fields |
| 02 | 02_Tasks-41-48_Classification-Tax-Fields.md | 41-48 | Add classification and tax fields |
| 03 | 03_Tasks-49-56_Physical-SEO-Meta.md | 49-56 | Add physical dimensions, SEO, and Meta |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create product.py File | Low |
| 34 | Define Product Class | Medium |
| 35 | Add name Field | Low |
| 36 | Add slug Field | Low |
| 37 | Add sku Field | Medium |
| 38 | Add barcode Field | Medium |
| 39 | Add description Field | Low |
| 40 | Add short_description Field | Low |
| 41 | Add category Field | Medium |
| 42 | Add brand Field | Medium |
| 43 | Add product_type Field | Medium |
| 44 | Add status Field | Medium |
| 45 | Add is_webstore_visible Field | Low |
| 46 | Add is_pos_visible Field | Low |
| 47 | Add tax_class Field | Medium |
| 48 | Add unit_of_measure Field | Medium |
| 49 | Add weight Field | Low |
| 50 | Add dimensions Fields | Medium |
| 51 | Add seo_title Field | Low |
| 52 | Add seo_description Field | Low |
| 53 | Add featured Field | Low |
| 54 | Add __str__ Method | Low |
| 55 | Add Meta Class | Medium |
| 56 | Export Product Model | Low |

---

## Execution Order

```
Tasks 33-40: Identity Fields
    │
    ▼
Tasks 41-48: Classification & Tax
    │
    ▼
Tasks 49-56: Physical, SEO, Meta
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── brand.py
    ├── tax_class.py
    ├── unit_of_measure.py
    └── product.py
```

---

## Notes for AI Agents

1. SKU must be unique per tenant (use UniqueForTenantValidator)
2. Barcode supports EAN-13 and UPC formats
3. description supports rich text (HTML)
4. dimensions are length, width, height in cm
5. weight is in kg (kilograms)
6. Meta.indexes should include SKU and barcode for fast lookups
