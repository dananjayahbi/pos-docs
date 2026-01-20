# Group A: Bundle Product Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** A of F  
> **Tasks Covered:** 01-20  
> **Group Goal:** Create ProductBundle and BundleItem models for bundled products

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Bundle-Stock-Pricing-Logic](../Group-B_Bundle-Stock-Pricing-Logic/)

---

## Group Overview

### Key Outcomes
- bundle.py model file created
- ProductBundle model with bundle_type, fixed_price, discount fields
- BundleItem model linking bundles to products/variants
- Support for fixed and dynamic pricing types
- Optional components in bundles
- Database migration created

### Technology Context
- **Framework:** Django 5.x ORM
- **Database:** PostgreSQL 15+ with tenant schemas
- **Multi-tenancy:** django-tenants (tenant-specific bundles)
- **Dependencies:** Product model from SubPhase-03

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Bundle-File-Setup.md | 01-05 | Bundle file creation and base model fields |
| 02 | 02_Tasks-06-09_Bundle-Discount-Fields.md | 06-09 | Discount type, value, and active status |
| 03 | 03_Tasks-10-14_BundleItem-Base.md | 10-14 | BundleItem model with FK to bundle and product |
| 04 | 04_Tasks-15-20_BundleItem-Fields-Migration.md | 15-20 | Optional flag, sort order, and migration |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create bundle.py File | Low | 3 min |
| 02 | Define ProductBundle Class | Medium | 10 min |
| 03 | Add product Field | Low | 5 min |
| 04 | Add bundle_type Field | Low | 5 min |
| 05 | Add fixed_price Field | Low | 5 min |
| 06 | Add discount_type Field | Low | 5 min |
| 07 | Add discount_value Field | Low | 5 min |
| 08 | Add is_active Field | Low | 3 min |
| 09 | Export ProductBundle | Low | 3 min |
| 10 | Define BundleItem Class | Medium | 10 min |
| 11 | Add bundle Field | Low | 5 min |
| 12 | Add product Field | Low | 5 min |
| 13 | Add variant Field | Low | 5 min |
| 14 | Add quantity Field | Low | 5 min |
| 15 | Add is_optional Field | Low | 5 min |
| 16 | Add sort_order Field | Low | 3 min |
| 17 | Add __str__ Method | Low | 3 min |
| 18 | Add Meta Class | Low | 5 min |
| 19 | Export BundleItem | Low | 3 min |
| 20 | Create Bundle Migration | Low | 5 min |

---

## Execution Order

```
Task 01: Create bundle.py File
    │
    ▼
Tasks 02-09: ProductBundle Model
    │ (product, bundle_type, fixed_price, discount_type, 
    │  discount_value, is_active, export)
    ▼
Tasks 10-19: BundleItem Model
    │ (bundle FK, product FK, variant FK, quantity,
    │  is_optional, sort_order, __str__, Meta, export)
    ▼
Task 20: Create Bundle Migration
```

---

## Expected Deliverables

```
backend/apps/products/
├── models/
│   ├── __init__.py (updated)
│   └── bundle.py (NEW)
└── migrations/
    └── XXXX_bundle_models.py (NEW)
```

---

## Notes for AI Agents

1. **ProductBundle:** Container linking to base Product model
2. **bundle_type:** CHOICES for "fixed" or "dynamic" pricing
3. **BundleItem:** Many-to-many through model for bundle contents
4. **variant Field:** Optional FK to ProductVariant for specific variants
5. **is_optional:** Allow optional items in bundles
6. **Unique Constraint:** (bundle, product, variant) should be unique
7. **Tenant Isolation:** Inherits from TenantAwareModel
8. **Next Group:** Bundle Stock & Pricing Logic (Group B)
